/**
 * Semi Professional Form Mapper
 * Converts Semi Professional form state to backend API contract
 * Handles multipart/form-data serialization
 */

import dayjs from 'dayjs';
import { SEMI_PROFESSIONAL_FILE_KEYS } from './fileKeys';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';
import { appendFileToFormData } from '@/submission/attachFiles';

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
 */
export function semiProfessionalMapper(formData: SemiProfessionalFormValues): FormData {
  console.log('[semiProfessionalMapper] Input formData:', JSON.stringify(formData, null, 2));

  const fd = new FormData();

  // Personal Information
  if (formData.personal.studentName) {
    fd.append('StudentName', formData.personal.studentName);
  }

  if (formData.personal.email) {
    fd.append('Email', formData.personal.email);
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

  // Address Information
  if (formData.address.districtID) {
    fd.append('DistrictID', toString(formData.address.districtID));
  }

  if (formData.address.otherDistrict) {
    fd.append('OtherDistrict', formData.address.otherDistrict);
  }

  if (formData.address.taluk) {
    fd.append('Taluk', formData.address.taluk);
  }

  if (formData.address.placeID) {
    fd.append('PlaceID', toString(formData.address.placeID));
  }

  if (formData.address.address) {
    fd.append('Address', formData.address.address);
  }

  // Family Information
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

  // Academic Information
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

  // House Visit Link
  if (formData.documents.houseVisitLink) {
    fd.append('HouseVisitLink', formData.documents.houseVisitLink);
  }

  // Document Uploads
  appendFileToFormData(fd, 'PUCMarksCard', formData.documents.pucMarksCard);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.incomeCertificate);
  appendFileToFormData(fd, 'AadharCard', formData.documents.aadharCard);

  // Debug: log file keys
  console.log('[semiProfessionalMapper] File keys:', SEMI_PROFESSIONAL_FILE_KEYS);
  console.log('[semiProfessionalMapper] Documents attached:', {
    pucMarksCard: !!formData.documents.pucMarksCard,
    incomeCertificate: !!formData.documents.incomeCertificate,
    aadharCard: !!formData.documents.aadharCard,
  });

  return fd;
}
