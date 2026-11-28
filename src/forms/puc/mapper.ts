/**
 * PUC Form Mapper
 * Converts PUC form state to the backend API contract.
 * Primary: POST /api/students/students/create (multipart/form-data)
 * Fallback: POST /api/puc-format1-1/create
 *
 * All scalar fields are sent as strings; the backend parses them
 * via model binding. File fields are emitted with both legacy and new names
 * for 100% backend compatibility.
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { PucFormat11FormValues } from '@/validation/pucFormat11Schemas';
import dayjs from 'dayjs';
import { PUC_FORMAT11_FILE_KEYS } from './fileKeys';

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

function toString(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

function appendIfPresent(
  fd: FormData,
  key: string,
  value: string | number | undefined | null,
): void {
  if (value === undefined || value === null || value === '') return;
  fd.append(key, toString(value));
}

/**
 * Maps PUC form data to the multipart contract.
 * Emits both standard/newStudent and format1.1 keys for seamless backend routing.
 */
export function pucMapper(formData: PucFormat11FormValues): FormData {
  const fd = new FormData();

  // ── Personal ──────────────────────────────────────────────────────────
  fd.append('StudentName', formData.personal.StudentName);
  if (formData.personal.DateOfBirth) {
    const formattedDob = formatDate(formData.personal.DateOfBirth);
    fd.append('DateOfBirth', formattedDob);
    fd.append('DOB', formattedDob);
  }
  const genderVal = toString(formData.personal.Gender || 0);
  fd.append('Gender', genderVal);
  fd.append('GenderID', genderVal);

  const casteVal = toString(formData.personal.Caste || 0);
  fd.append('Caste', casteVal);
  fd.append('CasteCategoryID', casteVal);

  const placeVal = toString(formData.personal.Place || 0);
  fd.append('Place', placeVal);
  fd.append('AreaTypeID', placeVal);
  fd.append('PlaceID', placeVal);

  // ── Contact ───────────────────────────────────────────────────────────
  appendIfPresent(fd, 'Email', formData.contact.Email);
  fd.append('ContactNumber', formData.contact.ContactNumber);
  appendIfPresent(fd, 'AlternateNumber', formData.contact.AlternateNumber);

  // ── Address ───────────────────────────────────────────────────────────
  const districtVal = toString(formData.address.District || 0);
  fd.append('District', districtVal);
  fd.append('DistrictID', districtVal);
  appendIfPresent(fd, 'OtherDistrict', formData.address.OtherDistrict || '');
  fd.append('Taluk', formData.address.Taluk);
  fd.append('Taluka', formData.address.Taluk);
  fd.append('ResidentialAddress', formData.address.ResidentialAddress);
  fd.append('Address', formData.address.ResidentialAddress);
  fd.append('PinCode', toString((formData.address as any).PinCode || ''));

  // ── Family ────────────────────────────────────────────────────────────
  appendIfPresent(fd, 'FatherName', (formData.family as any).FatherName || '');
  appendIfPresent(fd, 'MotherName', (formData.family as any).MotherName || '');
  const fatherOccVal = toString(formData.family.FatherOccupation || 0);
  fd.append('FatherOccupation', fatherOccVal);
  fd.append('FatherOccupationID', fatherOccVal);

  const motherOccVal = toString(formData.family.MotherOccupation || 0);
  fd.append('MotherOccupation', motherOccVal);
  fd.append('MotherOccupationID', motherOccVal);

  const familyMembersVal = toString(formData.family.TotalFamilyMembers || 0);
  fd.append('TotalFamilyMembers', familyMembersVal);
  fd.append('FamilyMembers', familyMembersVal);

  const familyIncomeVal = toString(formData.family.FamilyAnnualIncome || 0);
  fd.append('FamilyAnnualIncome', familyIncomeVal);
  fd.append('FamilyIncome', familyIncomeVal);

  appendIfPresent(fd, 'HouseTypeID', (formData.family as any).HouseTypeID || 1);
  appendIfPresent(fd, 'MonthlyRent', (formData.family as any).MonthlyRent || '0');
  appendIfPresent(fd, 'ReferenceSourceID', (formData.family as any).ReferenceSourceID || 1);
  appendIfPresent(fd, 'ReferenceSourceOther', '');

  // ── Academic ──────────────────────────────────────────────────────────
  const percentageVal = toString(formData.academic.SSLCPercentage || 0);
  fd.append('SSLCPercentage', percentageVal);
  fd.append('SecuredPercentage', percentageVal);
  appendIfPresent(fd, 'TotalMarks', (formData.academic as any).SSLCTotalMarks || '');

  const courseVal = toString(formData.academic.CourseJoined || 0);
  fd.append('CourseJoined', courseVal);
  fd.append('CourseID', courseVal);

  fd.append('CollegeName', formData.academic.CollegeName);

  const collegeTypeVal = toString(formData.academic.CollegeType || 0);
  fd.append('CollegeType', collegeTypeVal);
  fd.append('CollegeTypeID', collegeTypeVal);

  const collegeFeesVal = toString(formData.academic.CollegeFees || 0);
  fd.append('CollegeFees', collegeFeesVal);
  fd.append('ExpectedFees', collegeFeesVal);

  // ── Location ──────────────────────────────────────────────────────────
  const mapLink = (formData.documents as any)?.GoogleMapLink || '';
  appendIfPresent(fd, 'GoogleMapLink', mapLink);
  appendIfPresent(fd, 'HouseVisitLink', mapLink);

  // ── Documents ─────────────────────────────────────────────────────────
  // Primary (New_Students / VPStudentApiController) and Fallback (Format 1.1) keys:
  const fileMappings: { formKey: string; apiKeys: string[] }[] = [
    { formKey: 'StudentSelfie', apiKeys: ['StudentPhoto', 'StudentSelfie'] },
    { formKey: 'SSLCMarksCard', apiKeys: ['SSLCMarksCard'] },
    { formKey: 'ElectricityBill', apiKeys: ['ElectricityBill'] },
    { formKey: 'RationCard', apiKeys: ['RationCards', 'RationCard'] },
    { formKey: 'DwellingUnitPhoto', apiKeys: ['FamilyPhoto', 'DwellingUnitPhoto'] },
    { formKey: 'HouseVideo', apiKeys: ['HouseVideo'] },
    { formKey: 'IncomeCertificate', apiKeys: ['IncomeCertificate'] },
  ];

  for (const mapping of fileMappings) {
    const doc = formData.documents?.[mapping.formKey as keyof typeof formData.documents];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as { file?: unknown }).file : undefined;
    if (file) {
      for (const apiKey of mapping.apiKeys) {
        appendFileToFormData(fd, apiKey, file);
      }
    } else {
      console.log(`[pucMapper] Missing required file: ${mapping.formKey} (API: ${mapping.apiKeys[0]})`);
    }
  }

  return fd;
}
