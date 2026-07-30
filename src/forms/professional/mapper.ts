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

  // Personal Information (merged personal + contact + address)
  if (formData.personal.Email) {
    fd.append('Email', formData.personal.Email);
  }
  if (formData.personal.StudentName) {
    fd.append('StudentName', formData.personal.StudentName);
  }
  if (formData.personal.DateOfBirth) {
    fd.append('DOB', formatDate(formData.personal.DateOfBirth));
  }
  if (formData.personal.ContactNumber) {
    fd.append('ContactNumber', formData.personal.ContactNumber);
  }
  if (formData.personal.AlternateNumber) {
    fd.append('AlternateNumber', formData.personal.AlternateNumber);
  }
  if (formData.personal.ResidentialAddress) {
    fd.append('ResidentialAddress', formData.personal.ResidentialAddress);
  }
  if (formData.personal.GoogleMapLink) {
    fd.append('GoogleMapLink', formData.personal.GoogleMapLink);
  }
  if (formData.personal.AreaTypeID) {
    fd.append('AreaTypeID', toString(formData.personal.AreaTypeID));
  }
  if (formData.personal.DistrictID) {
    fd.append('DistrictID', toString(formData.personal.DistrictID));
  }
  fd.append('OtherDistrict', formData.personal.OtherDistrict || '');
  if (formData.personal.GenderID) {
    fd.append('GenderID', toString(formData.personal.GenderID));
  }
  if (formData.personal.CasteCategoryID) {
    fd.append('CasteCategoryID', toString(formData.personal.CasteCategoryID));
  }

  // Family Information
  if (formData.family.FatherName) {
    fd.append('FatherName', formData.family.FatherName);
  }
  if (formData.family.MotherName) {
    fd.append('MotherName', formData.family.MotherName);
  }
  if (formData.family.FatherOccupationID) {
    fd.append('FatherOccupationID', toString(formData.family.FatherOccupationID));
  }
  if (formData.family.MotherOccupationID) {
    fd.append('MotherOccupationID', toString(formData.family.MotherOccupationID));
  }
  if (formData.family.FamilyMembers) {
    fd.append('FamilyMembers', toString(formData.family.FamilyMembers));
  }
  if (formData.family.HouseTypeID) {
    fd.append('HouseTypeID', toString(formData.family.HouseTypeID));
  }
  if (formData.family.MonthlyRent !== undefined && formData.family.MonthlyRent !== null) {
    fd.append('MonthlyRent', toString(formData.family.MonthlyRent));
  }
  if (formData.family.FamilyIncome) {
    fd.append('FamilyIncome', toString(formData.family.FamilyIncome));
  }

  // Academic Information
  if (formData.academic.PUPercentage !== undefined && formData.academic.PUPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.PUPercentage));
  }
  if (formData.academic.CETRank !== undefined && formData.academic.CETRank !== null) {
    fd.append('CETRank', toString(formData.academic.CETRank));
  }
  if (formData.academic.NEETRank !== undefined && formData.academic.NEETRank !== null) {
    fd.append('NEETRank', toString(formData.academic.NEETRank));
  }
  if (formData.academic.CourseApplying) {
    fd.append('CourseApplying', formData.academic.CourseApplying);
  }
  if (formData.academic.CourseStream) {
    fd.append('CourseStream', formData.academic.CourseStream);
  }

  // Document Uploads - 9 documents
  appendFileToFormData(fd, 'StudentSelfie', formData.documents.StudentSelfie?.file);
  appendFileToFormData(fd, 'CETNEETRankSheet', formData.documents.CETNEETRankSheet?.file);
  appendFileToFormData(fd, 'DwellingUnitPhoto', formData.documents.DwellingUnitPhoto?.file);
  appendFileToFormData(fd, 'MarksSheet12', formData.documents.MarksSheet12?.file);
  appendFileToFormData(fd, 'RequestLetter', formData.documents.RequestLetter?.file);
  appendFileToFormData(fd, 'HouseVideo', formData.documents.HouseVideo?.file);
  appendFileToFormData(fd, 'ElectricityBill', formData.documents.ElectricityBill?.file);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.IncomeCertificate?.file);
  appendFileToFormData(fd, 'RationCard', formData.documents.RationCard?.file);

  console.log('[professionalMapper] Documents attached:', {
    StudentSelfie: !!formData.documents.StudentSelfie,
    CETNEETRankSheet: !!formData.documents.CETNEETRankSheet,
    DwellingUnitPhoto: !!formData.documents.DwellingUnitPhoto,
    MarksSheet12: !!formData.documents.MarksSheet12,
    RequestLetter: !!formData.documents.RequestLetter,
    HouseVideo: !!formData.documents.HouseVideo,
    ElectricityBill: !!formData.documents.ElectricityBill,
    IncomeCertificate: !!formData.documents.IncomeCertificate,
    RationCard: !!formData.documents.RationCard,
  });

  return fd;
}
