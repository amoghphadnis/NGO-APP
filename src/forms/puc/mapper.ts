/**
 * PUC Form Mapper
 * Converts PUC form state to backend API contract
 * Handles multipart/form-data serialization
 */

import dayjs from 'dayjs';
import { PUC_FILE_KEYS } from './fileKeys';
import { PUCFormData } from '@/types/forms';
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
 * Maps PUC form data to backend API contract
 */
export function pucMapper(formData: PUCFormData): FormData {
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

  // Address Information
  if (formData.address.district) {
    fd.append('DistrictID', toString(formData.address.district));
  }

  if (formData.address.otherDistrict) {
    fd.append('OtherDistrict', formData.address.otherDistrict);
  }

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
  if (formData.family.familyMembers) {
    fd.append('FamilyMembers', toString(formData.family.familyMembers));
  }

  if (formData.family.annualIncome) {
    fd.append('AnnualIncome', formData.family.annualIncome);
  }

  if (formData.family.monthlyRent) {
    fd.append('MonthlyRent', formData.family.monthlyRent);
  }

  if (formData.family.residenceType) {
    fd.append('ResidenceType', formData.family.residenceType);
  }

  // Document Uploads
  appendFileToFormData(fd, PUC_FILE_KEYS.SSLC_MARKS_CARD, formData.documents.sslcMarksCard);
  appendFileToFormData(fd, PUC_FILE_KEYS.STUDENT_PHOTO, formData.documents.studentPhoto);
  appendFileToFormData(fd, PUC_FILE_KEYS.ELECTRICITY_BILL, formData.documents.electricityBill);
  appendFileToFormData(fd, PUC_FILE_KEYS.RATION_CARD, formData.documents.rationCard);
  appendFileToFormData(fd, PUC_FILE_KEYS.INCOME_CERTIFICATE, formData.documents.incomeCert);
  appendFileToFormData(fd, PUC_FILE_KEYS.FAMILY_PHOTO, formData.documents.familyPhoto);
  appendFileToFormData(fd, PUC_FILE_KEYS.HOUSE_VIDEO, formData.documents.houseVideo);

  return fd;
}
