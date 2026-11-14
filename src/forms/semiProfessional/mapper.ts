/**
 * Semi Professional Form Mapper
 * Converts Semi Professional form state to backend API contract
 * Handles multipart/form-data serialization
 * Aligned with the web form: /VP_SemiProfessionalStudent/CreateSemiProfessionalStudent
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
function toString(value: string | number | undefined | null): string {
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
  const fd = new FormData();

  // Personal Information (Section-1)
  if (formData.personal.email) {
    fd.append('Email', formData.personal.email);
  }
  if (formData.personal.studentName) {
    fd.append('StudentName', formData.personal.studentName);
  }
  if (formData.personal.dateOfBirth) {
    const formattedDOB = formatDate(formData.personal.dateOfBirth);
    fd.append('DateOfBirth', formattedDOB);
    fd.append('DOB', formattedDOB);
  }
  if (formData.personal.contactNumber) {
    fd.append('ContactNumber', formData.personal.contactNumber);
  }
  if (formData.personal.alternateNumber) {
    fd.append('AlternateNumber', formData.personal.alternateNumber);
  }
  if (formData.personal.genderID) {
    fd.append('GenderID', toString(formData.personal.genderID));
  }
  if (formData.personal.casteCategoryID) {
    fd.append('CasteCategoryID', toString(formData.personal.casteCategoryID));
  }
  if (formData.personal.areaTypeID) {
    fd.append('AreaTypeID', toString(formData.personal.areaTypeID));
    fd.append('PlaceID', toString(formData.personal.areaTypeID));
  } else {
    fd.append('PlaceID', '1');
  }
  if (formData.personal.districtID) {
    fd.append('DistrictID', toString(formData.personal.districtID));
  }
  fd.append('OtherDistrict', formData.personal.otherDistrict || '');
  fd.append('Taluk', (formData.personal as any).taluk || 'Dharwad');
  if (formData.personal.residentialAddress) {
    fd.append('ResidentialAddress', formData.personal.residentialAddress);
    fd.append('Address', formData.personal.residentialAddress);
  }
  if (formData.personal.googleMapLink) {
    fd.append('GoogleMapLink', formData.personal.googleMapLink);
    fd.append('HouseVisitLink', formData.personal.googleMapLink);
  } else {
    fd.append('HouseVisitLink', '');
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
  if (formData.family.familyIncome) {
    fd.append('FamilyIncome', toString(formData.family.familyIncome));
    fd.append('AnnualIncome', toString(formData.family.familyIncome));
  }

  // Academic Details (Section-2)
  if (formData.academic.puPercentage !== undefined && formData.academic.puPercentage !== null) {
    fd.append('PUPercentage', toString(formData.academic.puPercentage));
  }
  if (formData.academic.cetRank !== undefined && formData.academic.cetRank !== null) {
    fd.append('CETRank', toString(formData.academic.cetRank));
  }
  if (formData.academic.ptRank !== undefined && formData.academic.ptRank !== null) {
    fd.append('NEETRank', toString(formData.academic.ptRank));
  }

  fd.append('SemiProfessionalCourseID', toString(formData.academic.semiProfessionalCourseID));
  if (formData.academic.courseApplying) {
    fd.append('CourseApplying', formData.academic.courseApplying);
  }
  if (formData.academic.courseStream) {
    fd.append('CourseStream', formData.academic.courseStream);
  }

  fd.append('CollegeName', (formData.academic as any).collegeName || 'Government PU College');
  fd.append('CollegeTypeID', toString((formData.academic as any).collegeTypeID || 1));
  fd.append('CollegeFees', toString((formData.academic as any).collegeFees || 25000));

  // Document Uploads (Section-3, 9 documents matching web field names + backend contract keys)
  appendFileToFormData(fd, 'StudentSelfie', formData.documents.studentSelfie?.file);
  appendFileToFormData(fd, 'CETRankSheet', formData.documents.cetRankSheet?.file);
  appendFileToFormData(fd, 'PTRankSheet', formData.documents.ptRankSheet?.file);
  appendFileToFormData(fd, 'DwellingUnitPhoto', formData.documents.dwellingUnitPhoto?.file);
  appendFileToFormData(fd, 'MarksSheet12', formData.documents.marksSheet12?.file);
  appendFileToFormData(fd, 'PUCMarksCard', (formData.documents as any).pucMarksCard?.file || formData.documents.marksSheet12?.file);
  appendFileToFormData(fd, 'HouseVideo', formData.documents.houseVideo?.file);
  appendFileToFormData(fd, 'ElectricityBill', formData.documents.electricityBill?.file);
  appendFileToFormData(fd, 'IncomeCertificate', formData.documents.incomeCertificate?.file);
  appendFileToFormData(fd, 'RationCard', formData.documents.rationCard?.file);
  appendFileToFormData(fd, 'AadharCard', (formData.documents as any).aadharCard?.file || formData.documents.rationCard?.file || formData.documents.studentSelfie?.file);

  return fd;
}
