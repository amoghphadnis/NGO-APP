import dayjs from 'dayjs';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { 
  ProfessionalStudentPayload, 
  StudentSubmissionPayload,
  UploadableFile,
  isUploadableFile 
} from '@/types/api';

export const mapApplicationToApi = (): FormData => {
  const { formData } = useFormEngineStore.getState();  
  // Build FormData manually - NO generic conversion
  const fd = new FormData();
  
  // Required fields - skip undefined/null checks
  if (formData.personal.name) {
    fd.append('StudentName', formData.personal.name);
  }
  
  if (formData.contact.email) {
    fd.append('Email', formData.contact.email);
  }
  
  if (formData.personal.dateOfBirth) {
    fd.append('DateOfBirth', dayjs(formData.personal.dateOfBirth).format('YYYY-MM-DD'));
  }
  
  if (formData.address.district) {
    fd.append('DistrictID', String(formData.address.district));
  }
  
  if (formData.address.pincode) {
    fd.append('OtherDistrict', formData.address.pincode); // Using pincode as other district for now
  }
  
  if (formData.address.taluk) {
    fd.append('Taluk', formData.address.taluk);
  }
  
  if (formData.address.address) {
    fd.append('Address', formData.address.address);
  }
  
  if (formData.contact.phone) {
    fd.append('ContactNumber', formData.contact.phone);
  }
  
  if (formData.personal.gender) {
    fd.append('GenderID', '1'); // Will be mapped from gender selection
  }
  
  if (formData.personal.caste) {
    fd.append('CasteCategoryID', '1'); // Will be mapped from caste selection
  }
  
  if (formData.family.familyMembers) {
    fd.append('FamilyMembers', String(formData.family.familyMembers));
  }
  
  if (formData.family.annualIncome) {
    fd.append('AnnualIncome', String(formData.family.annualIncome));
  }
  
  // Professional form specific fields
  if (isProfessionalForm(formData)) {
    if (formData.academic.puPercentage) {
      fd.append('PUPercentage', String(formData.academic.puPercentage));
    }
    
    if (formData.academic.cetNeetRank) {
      fd.append('CET_NEET_Rank', String(formData.academic.cetNeetRank));
    }
    
    if (formData.academic.courseTypeID) {
      fd.append('CourseTypeID', String(formData.academic.courseTypeID));
    }
    
    if (formData.academic.collegeName) {
      fd.append('CollegeName', formData.academic.collegeName);
    }
    
    if (formData.academic.collegeTypeID) {
      fd.append('CollegeTypeID', String(formData.academic.collegeTypeID));
    }
    
    if (formData.academic.collegeFees) {
      fd.append('CollegeFees', String(formData.academic.collegeFees));
    }
  }
  
  if (formData.address.place) {
    fd.append('PlaceID', '1'); // Will be mapped from place selection
  }
  
  // File uploads - proper format for Expo
  const { documents } = formData;
  if ('marksCard' in documents && documents.marksCard && isUploadableFile(documents.marksCard)) {
    fd.append('PUCMarksCard', documents.marksCard as any);
  }
  
  if ('incomeCert' in documents && documents.incomeCert && isUploadableFile(documents.incomeCert)) {
    fd.append('IncomeCertificate', documents.incomeCert as any);
  }
  
  if ('aadhaar' in documents && documents.aadhaar && isUploadableFile(documents.aadhaar)) {
    fd.append('AadharCard', documents.aadhaar as any);
  }
  
  return fd;
};
