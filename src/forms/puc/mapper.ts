/**
 * PUC Format 1.1 Form Mapper
 * Converts PUC form state to the backend API contract.
 * POST /api/VP_Format1_1PUC  (multipart/form-data)
 *
 * All scalar fields are sent as strings; the backend parses them
 * via model binding.  File fields use the exact contract key names.
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
 * Maps PUC Format 1.1 form data to the multipart contract.
 * Required fields are always sent; optional fields are sent only when present.
 */
export function pucMapper(formData: PucFormat11FormValues): FormData {
  const fd = new FormData();

  // ── Personal ──────────────────────────────────────────────────────────
  fd.append('StudentName', formData.personal.StudentName);
  if (formData.personal.DateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.DateOfBirth));
  }
  fd.append('Gender', toString(formData.personal.Gender || 0));
  fd.append('Caste', toString(formData.personal.Caste || 0));
  fd.append('Place', toString(formData.personal.Place || 0));

  // ── Contact ───────────────────────────────────────────────────────────
  appendIfPresent(fd, 'Email', formData.contact.Email);
  fd.append('ContactNumber', formData.contact.ContactNumber);
  appendIfPresent(fd, 'AlternateNumber', formData.contact.AlternateNumber);

  // ── Address ───────────────────────────────────────────────────────────
  fd.append('District', toString(formData.address.District || 0));
  appendIfPresent(fd, 'OtherDistrict', formData.address.OtherDistrict);
  fd.append('Taluk', formData.address.Taluk);
  fd.append('ResidentialAddress', formData.address.ResidentialAddress);
  appendIfPresent(fd, 'PinCode', (formData.address as any).PinCode);

  // ── Family ────────────────────────────────────────────────────────────
  appendIfPresent(fd, 'FatherName', (formData.family as any).FatherName);
  appendIfPresent(fd, 'MotherName', (formData.family as any).MotherName);
  fd.append('FatherOccupation', toString(formData.family.FatherOccupation || 0));
  fd.append('MotherOccupation', toString(formData.family.MotherOccupation || 0));
  fd.append('TotalFamilyMembers', toString(formData.family.TotalFamilyMembers || 0));
  fd.append('FamilyAnnualIncome', toString(formData.family.FamilyAnnualIncome || 0));
  appendIfPresent(fd, 'HouseTypeID', (formData.family as any).HouseTypeID);
  appendIfPresent(fd, 'MonthlyRent', (formData.family as any).MonthlyRent);
  appendIfPresent(fd, 'ReferenceSourceID', (formData.family as any).ReferenceSourceID);

  // ── Academic ──────────────────────────────────────────────────────────
  fd.append('SSLCPercentage', toString(formData.academic.SSLCPercentage || 0));
  appendIfPresent(fd, 'TotalMarks', (formData.academic as any).SSLCTotalMarks);
  fd.append('CourseJoined', toString(formData.academic.CourseJoined || 0));
  fd.append('CollegeName', formData.academic.CollegeName);
  fd.append('CollegeType', toString(formData.academic.CollegeType || 0));
  fd.append('CollegeFees', toString(formData.academic.CollegeFees || 0));

  // ── Location ──────────────────────────────────────────────────────────
  appendIfPresent(fd, 'GoogleMapLink', (formData.documents as any)?.GoogleMapLink);

  // ── Documents (all required by contract) ──────────────────────────────
  const fileMappings: Record<string, keyof typeof PUC_FORMAT11_FILE_KEYS> = {
    StudentSelfie: 'STUDENT_SELFIE',
    SSLCMarksCard: 'SSLC_MARKS_CARD',
    ElectricityBill: 'ELECTRICITY_BILL',
    RationCard: 'RATION_CARD',
    DwellingUnitPhoto: 'DWELLING_UNIT_PHOTO',
    HouseVideo: 'HOUSE_VIDEO',
    IncomeCertificate: 'INCOME_CERTIFICATE',
  };

  for (const [docField, keyConst] of Object.entries(fileMappings)) {
    const apiKey = PUC_FORMAT11_FILE_KEYS[keyConst];
    const doc = formData.documents?.[docField as keyof typeof formData.documents];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as { file?: unknown }).file : undefined;
    if (file) {
      appendFileToFormData(fd, apiKey, file);
    } else {
      console.log(`[pucMapper] Missing required file: ${docField} (API: ${apiKey})`);
    }
  }

  return fd;
}
