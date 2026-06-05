/**
 * Professional Form Mapper
 * Converts Professional form state to backend API contract
 * Handles multipart/form-data serialization
 */

import dayjs from 'dayjs';
import { PROFESSIONAL_FILE_KEYS } from './fileKeys';
import { ProfessionalFormValues } from '@/types/forms';
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
 * Maps Professional form data to backend API contract
 */
export function professionalMapper(formData: ProfessionalFormValues): FormData {
  console.log('[professionalMapper] Input formData:', JSON.stringify(formData, null, 2));
  
  const fd = new FormData();

  // Personal Information
  if (formData.personal.name) {
    fd.append('StudentName', formData.personal.name);
  }

  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.dateOfBirth));
  }

  if (formData.personal.gender) {
    fd.append('GenderID', toString(formData.personal.gender));
  }

  if (formData.personal.caste) {
    fd.append('CasteCategoryID', toString(formData.personal.caste));
  }

  // Contact Information
  if (formData.contact.email) {
    fd.append('Email', formData.contact.email);
  }

  if (formData.contact.phone) {
    fd.append('ContactNumber', formData.contact.phone);
  }

  if (formData.contact.alternatePhone) {
    fd.append('AlternateNumber', formData.contact.alternatePhone);
  }

  // Address Information
  if (formData.address.district) {
    fd.append('DistrictID', toString(formData.address.district));
  }

  // Always append OtherDistrict as API requires it
  fd.append('OtherDistrict', formData.address.otherDistrict || '');

  if (formData.address.taluk) {
    fd.append('Taluk', formData.address.taluk);
  }

  if (formData.address.place) {
    fd.append('PlaceID', toString(formData.address.place));
  }

  if (formData.address.address) {
    fd.append('Address', formData.address.address);
  }

  if (formData.address.pincode) {
    fd.append('Pincode', formData.address.pincode);
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

  if (formData.family.annualIncome) {
    fd.append('AnnualIncome', formData.family.annualIncome);
  }

  // Academic Information
  if (formData.academic.puPercentage !== undefined && formData.academic.puPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.puPercentage));
  }

  if (formData.academic.cetNeetRank) {
    fd.append('CET_NEET_Rank', formData.academic.cetNeetRank);
  }

  if (formData.academic.courseTypeID) {
    fd.append('CourseTypeID', toString(formData.academic.courseTypeID));
  }

  if (formData.academic.collegeName) {
    fd.append('CollegeName', formData.academic.collegeName);
  }

  // collegeTypeID is already the correct field name
  if (formData.academic.collegeTypeID) {
    fd.append('CollegeTypeID', toString(formData.academic.collegeTypeID));
  }

  if (formData.academic.collegeFees) {
    fd.append('CollegeFees', toString(formData.academic.collegeFees));
  }

  // House Visit Link
  if (formData.documents.houseVisitLink) {
    fd.append('HouseVisitLink', formData.documents.houseVisitLink);
  }

  // Document Uploads
  appendFileToFormData(fd, PROFESSIONAL_FILE_KEYS.MARKS_CARD, formData.documents.marksCard);
  appendFileToFormData(fd, PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE, formData.documents.incomeCert);
  appendFileToFormData(fd, PROFESSIONAL_FILE_KEYS.AADHAR_CARD, formData.documents.aadhaar);

  // Debug: log file keys
  console.log('[professionalMapper] Professional file keys:', PROFESSIONAL_FILE_KEYS);
  console.log('[professionalMapper] Documents attached:', {
    marksCard: !!formData.documents.marksCard,
    incomeCert: !!formData.documents.incomeCert,
    aadhaar: !!formData.documents.aadhaar,
  });

  return fd;
}
