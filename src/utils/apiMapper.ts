/**
 * API Submission Mapper
 * Maps form data to backend DTO format for submission
 */

import { ProfessionalFormValues, PucFormValues } from '@/types/forms';

// Backend DTO interfaces (aligned with actual backend requirements)
export interface ProfessionalSubmissionDTO {
  personal: {
    name: string;
    dateOfBirth: string;
    gender: string;
    caste: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  address: {
    pincode: string;
    district: string;
    otherDistrict?: string;
    taluk: string;
    place: string;
    address: string;
  };
  family: {
    fatherOccupationID?: number;
    motherOccupationID?: number;
    familyMembers: number;
    familyComposition?: string[];
    annualIncome?: string;
  };
  academic: {
    puPercentage: number;
    cetNeetRank?: string;
    courseTypeID: string;
    collegeName: string;
    collegeTypeID: number;
    collegeFees: number;
  };
  documents: {
    marksCard?: string; // File URI or ID
    aadhaar?: string;
    incomeCert?: string;
    houseVisitLink?: string;
  };
}

export interface PUCSubmissionDTO {
  personal: {
    name: string;
    dateOfBirth: string;
    gender: string;
    caste: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  address: {
    pincode: string;
    district: string;
    otherDistrict?: string;
    taluk: string;
    place: string;
    address: string;
  };
  family: {
    fatherOccupationID?: number;
    motherOccupationID?: number;
    familyMembers: number;
    familyComposition?: string[];
    annualIncome?: string;
    monthlyRent?: string;
    residenceType?: 'OWNED' | 'RENTED' | 'HOSTEL';
  };
  documents: {
    marksCard?: string;
    aadhaar?: string;
    incomeCert?: string;
    sslcMarksCard?: string;
    studentPhoto?: string;
    electricityBill?: string;
    rationCard?: string;
    familyPhoto?: string;
    houseVideo?: string;
  };
}

/**
 * Map Professional form values to backend DTO
 */
export function mapProfessionalToDTO(formData: ProfessionalFormValues): ProfessionalSubmissionDTO {
  return {
    personal: {
      name: formData.personal.name,
      dateOfBirth: formData.personal.dateOfBirth,
      gender: formData.personal.gender,
      caste: formData.personal.caste,
    },
    contact: {
      email: formData.contact.email,
      phone: formData.contact.phone,
    },
    address: {
      pincode: formData.address.pincode,
      district: formData.address.district,
      otherDistrict: formData.address.otherDistrict,
      taluk: formData.address.taluk,
      place: formData.address.place,
      address: formData.address.address,
    },
    family: {
      fatherOccupationID: formData.family.fatherOccupationID,
      motherOccupationID: formData.family.motherOccupationID,
      familyMembers: formData.family.familyMembers,
      familyComposition: formData.family.familyComposition,
      annualIncome: formData.family.annualIncome,
    },
    academic: {
      puPercentage: formData.academic.puPercentage,
      cetNeetRank: formData.academic.cetNeetRank,
      courseTypeID: formData.academic.courseTypeID,
      collegeName: formData.academic.collegeName,
      collegeTypeID: formData.academic.collegeTypeID,
      collegeFees: formData.academic.collegeFees,
    },
    documents: {
      marksCard: 'marksCard' in formData.documents ? formData.documents.marksCard?.file.uri : undefined,
      aadhaar: 'aadhaar' in formData.documents ? formData.documents.aadhaar?.file.uri : undefined,
      incomeCert: 'incomeCert' in formData.documents ? formData.documents.incomeCert?.file.uri : undefined,
      houseVisitLink: formData.documents.houseVisitLink,
    },
  };
}

/**
 * Map PUC form values to backend DTO
 */
export function mapPUCToDTO(formData: PucFormValues): PUCSubmissionDTO {
  return {
    personal: {
      name: formData.personal.name,
      dateOfBirth: formData.personal.dateOfBirth,
      gender: formData.personal.gender,
      caste: formData.personal.caste,
    },
    contact: {
      email: formData.contact.email,
      phone: formData.contact.phone,
    },
    address: {
      pincode: formData.address.pincode,
      district: formData.address.district,
      otherDistrict: formData.address.otherDistrict,
      taluk: formData.address.taluk,
      place: formData.address.place,
      address: formData.address.address,
    },
    family: {
      fatherOccupationID: formData.family.fatherOccupationID,
      motherOccupationID: formData.family.motherOccupationID,
      familyMembers: formData.family.familyMembers,
      familyComposition: formData.family.familyComposition,
      annualIncome: formData.family.annualIncome,
      monthlyRent: formData.family.monthlyRent,
      residenceType: formData.family.residenceType,
    },
    documents: {
      sslcMarksCard: formData.documents.sslcMarksCard?.file.uri,
      studentPhoto: formData.documents.studentPhoto?.file.uri,
      electricityBill: formData.documents.electricityBill?.file.uri,
      rationCard: formData.documents.rationCard?.file.uri,
      incomeCert: formData.documents.incomeCert?.file.uri,
      familyPhoto: formData.documents.familyPhoto?.file.uri,
      houseVideo: formData.documents.houseVideo?.file.uri,
    },
  };
}

/**
 * Generic mapper that selects the appropriate mapper based on form type
 */
export function mapFormToDTO(formType: 'professional' | 'puc', formData: ProfessionalFormValues | PucFormValues) {
  if (formType === 'professional') {
    return mapProfessionalToDTO(formData as ProfessionalFormValues);
  }
  return mapPUCToDTO(formData as PucFormValues);
}
