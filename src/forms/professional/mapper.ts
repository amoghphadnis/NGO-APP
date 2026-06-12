/**
 * Professional Form Mapper
 * Converts Professional form state to backend API contract
 * Handles multipart/form-data serialization
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { ProfessionalFormValues } from '@/types/forms';
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
 * Maps Professional form data to backend API contract
 */
export function professionalMapper(formData: ProfessionalFormValues): FormData {
  console.log('[professionalMapper] Input formData:', JSON.stringify(formData, null, 2));

  const fd = new FormData();

  // Personal Information (PascalCase as per API)
  if (formData.personal.StudentName) {
    fd.append('StudentName', formData.personal.StudentName);
  }

  if (formData.personal.DateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.DateOfBirth));
  }

  if (formData.personal.GenderID) {
    fd.append('GenderID', toString(formData.personal.GenderID));
  }

  if (formData.personal.CasteCategoryID) {
    fd.append('CasteCategoryID', toString(formData.personal.CasteCategoryID));
  }

  // Contact Information (PascalCase as per API)
  if (formData.contact.Email) {
    fd.append('Email', formData.contact.Email);
  }

  if (formData.contact.ContactNumber) {
    fd.append('ContactNumber', formData.contact.ContactNumber);
  }

  // Address Information (PascalCase as per API)
  if (formData.address.DistrictID) {
    fd.append('DistrictID', toString(formData.address.DistrictID));
  }

  // Always append OtherDistrict as API requires it
  fd.append('OtherDistrict', formData.address.OtherDistrict || '');

  if (formData.address.Taluk) {
    fd.append('Taluk', formData.address.Taluk);
  }

  // Always send PlaceID - backend requires it as mandatory field
  fd.append('PlaceID', toString(formData.address.PlaceID || 0));

  if (formData.address.Address) {
    fd.append('Address', formData.address.Address);
  }

  // Family Information (PascalCase as per API)
  // Send occupation IDs only when selected (> 0), always as integer strings
  if (formData.family.FatherOccupationID && formData.family.FatherOccupationID > 0) {
    fd.append('FatherOccupationID', String(Number(formData.family.FatherOccupationID)));
  }

  if (formData.family.MotherOccupationID && formData.family.MotherOccupationID > 0) {
    fd.append('MotherOccupationID', String(Number(formData.family.MotherOccupationID)));
  }

  if (formData.family.FamilyMembers) {
    fd.append('FamilyMembers', toString(formData.family.FamilyMembers));
  }

  if (formData.family.AnnualIncome) {
    fd.append('AnnualIncome', formData.family.AnnualIncome);
  }

  // Academic Information (PascalCase as per API)
  if (formData.academic.PUPercentage !== undefined && formData.academic.PUPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.PUPercentage));
  }

  if (formData.academic.CET_NEET_Rank) {
    fd.append('CET_NEET_Rank', formData.academic.CET_NEET_Rank);
  }

  if (formData.academic.CourseTypeID) {
    fd.append('CourseTypeID', toString(formData.academic.CourseTypeID));
  }

  if (formData.academic.CollegeName) {
    fd.append('CollegeName', formData.academic.CollegeName);
  }

  if (formData.academic.CollegeTypeID) {
    fd.append('CollegeTypeID', toString(formData.academic.CollegeTypeID));
  }

  if (formData.academic.CollegeFees) {
    fd.append('CollegeFees', toString(formData.academic.CollegeFees));
  }

  // House Visit Link (PascalCase as per API)
  if (formData.documents.HouseVisitLink) {
    fd.append('HouseVisitLink', formData.documents.HouseVisitLink);
  }

  // Document Uploads - All 16 documents
  // Pass the nested file object, not the wrapper { file, uploadedAt }
  appendFileToFormData(fd, 'PUCMarksCard', formData.documents.PUCMarksCard?.file);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.IncomeCertificate?.file);
  appendFileToFormData(fd, 'Rationcard', formData.documents.Rationcard?.file);
  appendFileToFormData(fd, 'Electricitybill', formData.documents.Electricitybill?.file);
  appendFileToFormData(fd, 'CollegeID', formData.documents.CollegeID?.file);
  appendFileToFormData(fd, 'Admissionproof', formData.documents.Admissionproof?.file);
  appendFileToFormData(fd, 'FeesReceipts', formData.documents.FeesReceipts?.file);
  appendFileToFormData(fd, 'Expenditure', formData.documents.Expenditure?.file);
  appendFileToFormData(fd, 'Studentphoto', formData.documents.Studentphoto?.file);
  appendFileToFormData(fd, 'Photoinfrontofcollege', formData.documents.Photoinfrontofcollege?.file);
  appendFileToFormData(fd, 'Dwellingunit', formData.documents.Dwellingunit?.file);
  appendFileToFormData(fd, 'CET', formData.documents.CET?.file);
  appendFileToFormData(fd, 'Studentpass', formData.documents.Studentpass?.file);
  appendFileToFormData(fd, 'Monthsbank', formData.documents.Monthsbank?.file);
  appendFileToFormData(fd, 'AadharCard', formData.documents.AadharCard?.file);
  appendFileToFormData(fd, 'Handwritten', formData.documents.Handwritten?.file);

  // Debug: log file attachments
  console.log('[professionalMapper] Documents attached:', {
    PUCMarksCard: !!formData.documents.PUCMarksCard,
    IncomeCertificate: !!formData.documents.IncomeCertificate,
    Rationcard: !!formData.documents.Rationcard,
    Electricitybill: !!formData.documents.Electricitybill,
    CollegeID: !!formData.documents.CollegeID,
    Admissionproof: !!formData.documents.Admissionproof,
    FeesReceipts: !!formData.documents.FeesReceipts,
    Expenditure: !!formData.documents.Expenditure,
    Studentphoto: !!formData.documents.Studentphoto,
    Photoinfrontofcollege: !!formData.documents.Photoinfrontofcollege,
    Dwellingunit: !!formData.documents.Dwellingunit,
    CET: !!formData.documents.CET,
    Studentpass: !!formData.documents.Studentpass,
    Monthsbank: !!formData.documents.Monthsbank,
    AadharCard: !!formData.documents.AadharCard,
    Handwritten: !!formData.documents.Handwritten,
  });

  return fd;
}
