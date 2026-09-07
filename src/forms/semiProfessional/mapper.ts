/**
 * Semi Professional Form Mapper
 * Converts Semi Professional form state to backend API contract
 * Handles multipart/form-data serialization
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';
import dayjs from 'dayjs';

/**
 * Formats date to YYYY-MM-DD for API
 */
function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * Converts value to string safely
 */
function toString(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

/**
 * Maps Semi Professional form data to backend API contract
 * POST /api/semiprofessionalstudent/create (multipart/form-data)
 */
export function semiProfessionalMapper(formData: SemiProfessionalFormValues): FormData {
  console.log('[semiProfessionalMapper] Input formData:', JSON.stringify(formData, null, 2));

  const fd = new FormData();

  // Personal Information
  if (formData.personal.email) {
    fd.append('Email', formData.personal.email);
  }
  if (formData.personal.studentName) {
    fd.append('StudentName', formData.personal.studentName);
  }
  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.dateOfBirth));
  }
  if (formData.personal.contactNumber) {
    fd.append('ContactNumber', formData.personal.contactNumber);
  }
  if (formData.personal.genderID) {
    fd.append('GenderID', toString(formData.personal.genderID));
  }
  if (formData.personal.casteCategoryID) {
    fd.append('CasteCategoryID', toString(formData.personal.casteCategoryID));
  }
  if (formData.personal.districtID) {
    fd.append('DistrictID', toString(formData.personal.districtID));
  }
  fd.append('OtherDistrict', formData.personal.otherDistrict || '');
  if (formData.personal.taluk) {
    fd.append('Taluk', formData.personal.taluk);
  }
  if (formData.personal.address) {
    fd.append('Address', formData.personal.address);
  }
  if (formData.personal.placeID) {
    fd.append('PlaceID', toString(formData.personal.placeID));
  }

  // Family Details
  if (formData.family.fatherOccupationID) {
    fd.append('FatherOccupationID', toString(formData.family.fatherOccupationID));
  }
  if (formData.family.motherOccupationID) {
    fd.append('MotherOccupationID', toString(formData.family.motherOccupationID));
  }
  if (formData.family.familyMembers) {
    fd.append('FamilyMembers', toString(formData.family.familyMembers));
  }
  if (formData.family.annualIncome !== undefined && formData.family.annualIncome !== null) {
    fd.append('AnnualIncome', toString(formData.family.annualIncome));
  }

  // Academic Details
  if (formData.academic.puPercentage !== undefined && formData.academic.puPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.puPercentage));
  }
  if (formData.academic.semiProfessionalCourseID) {
    fd.append('SemiProfessionalCourseID', toString(formData.academic.semiProfessionalCourseID));
  }
  if (formData.academic.collegeName) {
    fd.append('CollegeName', formData.academic.collegeName);
  }
  if (formData.academic.collegeTypeID) {
    fd.append('CollegeTypeID', toString(formData.academic.collegeTypeID));
  }
  if (formData.academic.collegeFees !== undefined && formData.academic.collegeFees !== null) {
    fd.append('CollegeFees', toString(formData.academic.collegeFees));
  }

  // HouseVisitLink (defaults to empty string)
  fd.append('HouseVisitLink', '');

  // Document Uploads (3 documents)
  appendFileToFormData(fd, 'PUCMarksCard', formData.documents.pucMarksCard?.file);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.incomeCertificate?.file);
  appendFileToFormData(fd, 'AadharCard', formData.documents.aadharCard?.file);

  console.log('[semiProfessionalMapper] Documents attached:', {
    pucMarksCard: !!formData.documents.pucMarksCard,
    incomeCertificate: !!formData.documents.incomeCertificate,
    aadharCard: !!formData.documents.aadharCard,
  });

  return fd;
}
