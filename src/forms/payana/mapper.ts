/**
 * Payana Form Mapper
 * Converts Payana form state to the backend API contract
 * POST /api/payana-students/create (multipart/form-data)
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { PayanaFormValues } from '@/validation/payanaSchemas';
import dayjs from 'dayjs';

/**
 * Maps form document keys to API multipart file field names.
 * Field names follow the controller exactly (case-sensitive lookup on the server side
 * is not guaranteed, so we match the documented spelling).
 */
export const PAYANA_FILE_MAPPINGS = {
  latestMarksCard: 'latestmarkscard',
  studentPassbookFP: 'studentpassbookFP',
  studentPhoto: 'StudentPhoto',
  dwellingUnit: 'dwellingunit',
  aadhaarCard: 'adharcard',
} as const;

export type PayanaDocumentKey = keyof typeof PAYANA_FILE_MAPPINGS;

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

function toString(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

function appendIfPresent(fd: FormData, key: string, value: string | number | undefined | null): void {
  if (value === undefined || value === null || value === '') {
    return;
  }
  fd.append(key, toString(value));
}

/**
 * Maps Payana form data to the multipart contract.
 * Required by controller: StudentName, ContactNumber, Email.
 * All other fields are optional; missing ints become 0 / null server-side.
 */
export function payanaMapper(formData: PayanaFormValues): FormData {
  const fd = new FormData();

  // Personal
  fd.append('StudentName', formData.personal.studentName);
  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.dateOfBirth));
  }
  appendIfPresent(fd, 'GenderID', formData.personal.genderID);

  // Contact
  fd.append('ContactNumber', formData.contact.contactNumber);
  appendIfPresent(fd, 'AlternateNumber', formData.contact.alternateNumber);
  fd.append('Email', formData.contact.email);

  // Address
  appendIfPresent(fd, 'RAddress', formData.address.residentialAddress);
  appendIfPresent(fd, 'CAddress', formData.address.currentAddress);
  appendIfPresent(fd, 'Taluka', formData.address.taluka);
  appendIfPresent(fd, 'DistrictID', formData.address.districtID);
  fd.append('OtherDistrict', formData.address.otherDistrict || '');
  appendIfPresent(fd, 'PinCode', formData.address.pincode);
  appendIfPresent(fd, 'AreaTypeID', formData.address.placeID);

  // Category
  appendIfPresent(fd, 'CasteCategoryID', formData.category.casteCategoryID);
  appendIfPresent(fd, 'HouseTypeID', formData.category.houseTypeID);

  // Family
  appendIfPresent(fd, 'FatherName', formData.family.fatherName);
  appendIfPresent(fd, 'MotherName', formData.family.motherName);
  appendIfPresent(fd, 'FatherOccupationID', formData.family.fatherOccupationID);
  appendIfPresent(fd, 'MotherOccupationID', formData.family.motherOccupationID);
  appendIfPresent(fd, 'FamilyMembers', formData.family.familyMembers);
  appendIfPresent(fd, 'FamilyIncome', formData.family.familyIncome);
  appendIfPresent(fd, 'ParentBank', formData.family.parentBank);

  // Academic
  appendIfPresent(fd, 'CourseID', formData.academic.courseID);
  appendIfPresent(fd, 'CollegeName', formData.academic.collegeName);
  appendIfPresent(fd, 'CollegeTypeID', formData.academic.collegeTypeID);
  appendIfPresent(fd, 'CollegeCNumber', formData.academic.collegeCNumber);
  appendIfPresent(fd, 'CourseSA', formData.academic.courseSA);
  appendIfPresent(fd, 'CourseStream', formData.academic.courseStream);
  appendIfPresent(fd, 'AnnualFees', formData.academic.annualFees);
  appendIfPresent(fd, 'TotalExpenses', formData.academic.totalExpenses);
  appendIfPresent(fd, 'ReferenceSourceOther', formData.academic.reference);
  appendIfPresent(fd, 'StudentAchivements', formData.academic.studentAchievements);
  appendIfPresent(fd, 'securedPercentage', formData.academic.securedPercentage);

  // Bank
  appendIfPresent(fd, 'AccountHolderName', formData.bank.accountHolderName);
  appendIfPresent(fd, 'bankaccountno', formData.bank.bankAccountNo);
  appendIfPresent(fd, 'ifsccode', formData.bank.ifscCode);
  appendIfPresent(fd, 'bankname', formData.bank.bankName);
  appendIfPresent(fd, 'branchname', formData.bank.branchName);

  // Misc
  appendIfPresent(fd, 'HouseVisitLink', formData.documents.houseVisitLink);
  fd.append('IsAgreed', toString(formData.agreement.isAgreed));

  // Files (all optional per contract)
  (Object.keys(PAYANA_FILE_MAPPINGS) as PayanaDocumentKey[]).forEach((formKey) => {
    const apiKey = PAYANA_FILE_MAPPINGS[formKey];
    const doc = formData.documents?.[formKey];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as { file?: unknown }).file : undefined;
    if (file) {
      appendFileToFormData(fd, apiKey, file);
    } else {
      console.log(`[payanaMapper] Missing file: ${formKey} (API: ${apiKey})`);
    }
  });

  return fd;
}
