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
 * POST /api/semi-professional/create (multipart/form-data)
 */
export function semiProfessionalMapper(formData: SemiProfessionalFormValues): FormData {
  console.log('[semiProfessionalMapper] Input formData:', JSON.stringify(formData, null, 2));

  const fd = new FormData();

  // Applicant's Information (personal + contact + address merged)
  if (formData.personal.email) {
    fd.append('Email', formData.personal.email);
  }
  if (formData.personal.studentName) {
    fd.append('StudentName', formData.personal.studentName);
  }
  if (formData.personal.dateOfBirth) {
    fd.append('DOB', formatDate(formData.personal.dateOfBirth));
  }
  if (formData.personal.contactNumber) {
    fd.append('ContactNumber', formData.personal.contactNumber);
  }
  if (formData.personal.alternateNumber) {
    fd.append('AlternateNumber', formData.personal.alternateNumber);
  }
  if (formData.personal.residentialAddress) {
    fd.append('ResidentialAddress', formData.personal.residentialAddress);
  }
  if (formData.personal.googleMapLink) {
    fd.append('GoogleMapLink', formData.personal.googleMapLink);
  }
  if (formData.personal.areaTypeID) {
    fd.append('AreaTypeID', toString(formData.personal.areaTypeID));
  }
  if (formData.personal.districtID) {
    fd.append('DistrictID', toString(formData.personal.districtID));
  }
  fd.append('OtherDistrict', formData.personal.otherDistrict || '');
  if (formData.personal.genderID) {
    fd.append('GenderID', toString(formData.personal.genderID));
  }
  if (formData.personal.casteCategoryID) {
    fd.append('CasteCategoryID', toString(formData.personal.casteCategoryID));
  }

  // Family Details
  if (formData.family.fatherName) {
    fd.append('FatherName', formData.family.fatherName);
  }
  if (formData.family.motherName) {
    fd.append('MotherName', formData.family.motherName);
  }
  if (formData.family.fatherOccupationID) {
    fd.append('FatherOccupationID', toString(formData.family.fatherOccupationID));
  }
  if (formData.family.motherOccupationID) {
    fd.append('MotherOccupationID', toString(formData.family.motherOccupationID));
  }
  if (formData.family.familyMembers) {
    fd.append('FamilyMembers', toString(formData.family.familyMembers));
  }
  if (formData.family.houseTypeID) {
    fd.append('HouseTypeID', toString(formData.family.houseTypeID));
  }
  if (formData.family.monthlyRent !== undefined && formData.family.monthlyRent !== null) {
    fd.append('MonthlyRent', toString(formData.family.monthlyRent));
  }
  if (formData.family.familyIncome !== undefined && formData.family.familyIncome !== null) {
    fd.append('FamilyIncome', toString(formData.family.familyIncome));
  }

  // Academic Details
  if (formData.academic.puPercentage !== undefined && formData.academic.puPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.puPercentage));
  }
  if (formData.academic.cetRank !== undefined && formData.academic.cetRank !== null) {
    fd.append('CETRank', toString(formData.academic.cetRank));
  }
  if (formData.academic.ptRank !== undefined && formData.academic.ptRank !== null) {
    fd.append('PTRank', toString(formData.academic.ptRank));
  }
  if (formData.academic.courseApplying) {
    fd.append('CourseApplying', formData.academic.courseApplying);
  }
  if (formData.academic.courseStream) {
    fd.append('CourseStream', formData.academic.courseStream);
  }

  // Document Uploads (9 documents)
  appendFileToFormData(fd, 'StudentSelfie', formData.documents.studentSelfie?.file);
  appendFileToFormData(fd, 'CETRankSheet', formData.documents.cetRankSheet?.file);
  appendFileToFormData(fd, 'PTRankSheet', formData.documents.ptRankSheet?.file);
  appendFileToFormData(fd, 'DwellingUnitPhoto', formData.documents.dwellingUnitPhoto?.file);
  appendFileToFormData(fd, 'MarksSheet12', formData.documents.marksSheet12?.file);
  appendFileToFormData(fd, 'HouseVideo', formData.documents.houseVideo?.file);
  appendFileToFormData(fd, 'ElectricityBill', formData.documents.electricityBill?.file);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.incomeCertificate?.file);
  appendFileToFormData(fd, 'RationCard', formData.documents.rationCard?.file);

  console.log('[semiProfessionalMapper] Documents attached:', {
    studentSelfie: !!formData.documents.studentSelfie,
    cetRankSheet: !!formData.documents.cetRankSheet,
    ptRankSheet: !!formData.documents.ptRankSheet,
    dwellingUnitPhoto: !!formData.documents.dwellingUnitPhoto,
    marksSheet12: !!formData.documents.marksSheet12,
    houseVideo: !!formData.documents.houseVideo,
    electricityBill: !!formData.documents.electricityBill,
    incomeCertificate: !!formData.documents.incomeCertificate,
    rationCard: !!formData.documents.rationCard,
  });

  return fd;
}
