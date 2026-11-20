/**
 * New Student Registration Form Mapper
 * Converts newStudent form state to the backend API contract
 * POST /api/students/students/create (multipart/form-data)
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { NewStudentFormValues } from '@/validation/newStudentSchemas';
import dayjs from 'dayjs';

/**
 * Maps form document keys to API multipart file field names.
 * Field names match request.Files[...] lookups in VPStudentApiController.
 */
export const NEW_STUDENT_FILE_MAPPINGS = {
  sslcMarksCard: 'SSLCMarksCard',
  studentPhoto: 'StudentPhoto',
  electricityBill: 'ElectricityBill',
  rationCards: 'RationCards',
  incomeCertificate: 'IncomeCertificate',
  familyPhoto: 'FamilyPhoto',
  houseVideo: 'HouseVideo',
} as const;

export type NewStudentDocumentKey = keyof typeof NEW_STUDENT_FILE_MAPPINGS;

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
 * Maps newStudent form data to the multipart contract.
 * Field names match request[...] reads in VPStudentApiController.CreateStudent.
 */
export function newStudentMapper(formData: NewStudentFormValues): FormData {
  const fd = new FormData();

  // Personal
  fd.append('StudentName', formData.personal.studentName);
  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.dateOfBirth));
  }
  appendIfPresent(fd, 'GenderID', formData.personal.genderID);

  // Contact
  appendIfPresent(fd, 'ContactNumber', formData.contact.contactNumber);
  appendIfPresent(fd, 'AlternateNumber', formData.contact.alternateNumber);
  appendIfPresent(fd, 'Email', formData.contact.email);

  // Address
  appendIfPresent(fd, 'Address', formData.address.address);
  appendIfPresent(fd, 'Taluka', formData.address.taluka);
  appendIfPresent(fd, 'PinCode', formData.address.pincode);
  appendIfPresent(fd, 'DistrictID', formData.address.districtID);
  if (formData.address.districtID === 11) {
    appendIfPresent(fd, 'OtherDistrict', formData.address.otherDistrict);
  }

  // Family
  appendIfPresent(fd, 'FatherName', formData.family.fatherName);
  appendIfPresent(fd, 'MotherName', formData.family.motherName);
  appendIfPresent(fd, 'FatherOccupationID', formData.family.fatherOccupationID);
  appendIfPresent(fd, 'MotherOccupationID', formData.family.motherOccupationID);
  appendIfPresent(fd, 'FamilyIncome', formData.family.familyIncome);
  appendIfPresent(fd, 'FamilyMembers', formData.family.familyMembers);

  // Category
  appendIfPresent(fd, 'CasteCategoryID', formData.category.casteCategoryID);
  appendIfPresent(fd, 'AreaTypeID', formData.category.areaTypeID);
  appendIfPresent(fd, 'HouseTypeID', formData.category.houseTypeID);
  appendIfPresent(fd, 'MonthlyRent', formData.category.monthlyRent);
  appendIfPresent(fd, 'ReferenceSourceID', formData.category.referenceSourceID);
  appendIfPresent(fd, 'ReferenceSourceOther', formData.category.referenceSourceOther);

  // Academic
  appendIfPresent(fd, 'CourseID', formData.academic.courseID);
  appendIfPresent(fd, 'CollegeName', formData.academic.collegeName);
  appendIfPresent(fd, 'CollegeTypeID', formData.academic.collegeTypeID);
  appendIfPresent(fd, 'ExpectedFees', formData.academic.expectedFees);
  appendIfPresent(fd, 'SecuredPercentage', formData.academic.securedPercentage);
  appendIfPresent(fd, 'TotalMarks', formData.academic.totalMarks);

  // Misc
  appendIfPresent(fd, 'HouseVisitLink', formData.documents.houseVisitLink);

  // Files (all optional per contract)
  (Object.keys(NEW_STUDENT_FILE_MAPPINGS) as NewStudentDocumentKey[]).forEach((formKey) => {
    const apiKey = NEW_STUDENT_FILE_MAPPINGS[formKey];
    const doc = formData.documents?.[formKey];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as { file?: unknown }).file : undefined;
    if (file) {
      appendFileToFormData(fd, apiKey, file);
    } else {
      console.log(`[newStudentMapper] Missing file: ${formKey} (API: ${apiKey})`);
    }
  });

  return fd;
}
