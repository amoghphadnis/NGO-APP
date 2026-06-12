/**
 * PUC Form Mapper
 * Converts PUC form state to backend API contract
 * Handles multipart/form-data serialization
 */

import dayjs from 'dayjs';
import { PUC_FILE_KEYS } from './fileKeys';
import { PucFormValues } from '@/types/forms';
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
export function pucMapper(formData: PucFormValues): FormData {
  const fd = new FormData();

  // Personal Information
  if (formData.personal.name) {
    fd.append('StudentName', formData.personal.name);
  }

  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.dateOfBirth));
  }

  // GenderID is required - always send it (default to 0 if not selected)
  fd.append('GenderID', toString(formData.personal.genderID || 0));

  // CasteCategoryID is required - always send it (default to 0 if not selected)
  fd.append('CasteCategoryID', toString(formData.personal.casteCategoryID || 0));

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
  // DistrictID is required - always send it
  fd.append('DistrictID', toString(formData.address.districtID || 0));

  if (formData.address.otherDistrict) {
    fd.append('OtherDistrict', formData.address.otherDistrict);
  }

  if (formData.address.taluk) {
    fd.append('Taluka', formData.address.taluk);
  }

  if (formData.address.address) {
    fd.append('Address', formData.address.address);
  }

  if (formData.address.pincode) {
    fd.append('Pincode', formData.address.pincode);
  }

  // AreaTypeID is optional
  if (formData.address.areaID) {
    fd.append('AreaTypeID', toString(formData.address.areaID));
  }

  // Family Information
  if (formData.family.fatherName) {
    fd.append('FatherName', formData.family.fatherName);
  }

  if (formData.family.motherName) {
    fd.append('MotherName', formData.family.motherName);
  }

  // FatherOccupationID is required - always send it
  fd.append('FatherOccupationID', toString((formData.family as any).fatherOccupationID || 0));

  // MotherOccupationID is required - always send it
  fd.append('MotherOccupationID', toString((formData.family as any).motherOccupationID || 0));

  if (formData.family.familyMembers) {
    fd.append('FamilyMembers', toString(formData.family.familyMembers));
  }

  if (formData.family.annualIncome) {
    fd.append('FamilyIncome', formData.family.annualIncome);
  }

  if (formData.family.monthlyRent) {
    fd.append('MonthlyRent', formData.family.monthlyRent);
  }

  if (formData.family.residenceType) {
    fd.append('ResidenceType', formData.family.residenceType);
  }

  // Category & Housing Information
  // Note: CasteCategoryID already sent in Personal section

  // HouseTypeID is required - always send it
  fd.append('HouseTypeID', toString(formData.category.houseTypeID || 0));

  if (formData.category.monthlyRent) {
    fd.append('MonthlyRent', formData.category.monthlyRent);
  }

  // ReferenceSourceID is required - always send it
  fd.append('ReferenceSourceID', toString(formData.category.referenceSourceID || 0));

  // ReferenceSourceOther is required by backend - always send it
  const referenceOther = (formData.category as any).referenceSourceOther || '';
  fd.append('ReferenceSourceOther', referenceOther);

  // Academic Information
  // CourseID is required - always send it
  fd.append('CourseID', toString(formData.academic.courseID || 0));

  if (formData.academic.collegeName) {
    fd.append('CollegeName', formData.academic.collegeName);
  }

  // CollegeTypeID is required - always send it
  fd.append('CollegeTypeID', toString(formData.academic.collegeTypeID || 0));

  if (formData.academic.expectedFees) {
    fd.append('ExpectedFees', toString(formData.academic.expectedFees));
  }

  if (formData.academic.percentage) {
    fd.append('SecuredPercentage', toString(formData.academic.percentage));
  }

  if (formData.academic.totalMarks) {
    fd.append('TotalMarks', toString(formData.academic.totalMarks));
  }

  // Document Uploads - pass the nested file object
  appendFileToFormData(fd, PUC_FILE_KEYS.SSLC_MARKS_CARD, formData.documents.sslcMarksCard?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.STUDENT_PHOTO, formData.documents.studentPhoto?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.ELECTRICITY_BILL, formData.documents.electricityBill?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.RATION_CARD, formData.documents.rationCard?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.INCOME_CERTIFICATE, formData.documents.incomeCert?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.FAMILY_PHOTO, formData.documents.familyPhoto?.file);
  appendFileToFormData(fd, PUC_FILE_KEYS.HOUSE_VIDEO, formData.documents.houseVideo?.file);

  if (formData.documents.houseVisitLink) {
    fd.append('HouseVisitLink', formData.documents.houseVisitLink);
  }

  return fd;
}
