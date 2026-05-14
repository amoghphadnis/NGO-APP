// Centralized Form Type Definitions for VP Scholarship App
// This file provides stable, type-safe interfaces for all form operations

export interface BaseFormData {
  // Common fields across all forms
  guidelines: {
    accepted: boolean;
    timestamp?: string;
  };
  personal: {
    name: string;
    dateOfBirth: string;
    gender: string;
    caste: string;
  };
  contact: {
    email: string;
    phone: string;
    communicationPreference?: 'email' | 'phone' | 'both';
  };
  address: {
    pincode: string;
    district: string;
    taluk: string;
    place: string;
    address: string;
  };
  family: {
    fatherOccupation?: string;
    motherOccupation?: string;
    familyMembers: number;
    familyComposition?: string[];
    annualIncome?: string;
  };
  documents: {
    marksCard?: any;
    aadhaar?: any;
    incomeCert?: any;
  };
  review: {
    declarationAccepted: boolean;
    timestamp?: string;
  };
}

export interface ProfessionalFormData extends BaseFormData {
  // Professional-specific fields
  category: {
    scholarshipCategory: string;
    courseType: string;
  };
  academic: {
    puPercentage: number;
    cetNeetRank?: number;
    course: string;
    collegeName: string;
    collegeType: 'Government' | 'Private' | 'Aided';
    annualCollegeFees: number;
  };
  bank: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
    ifscVerified: boolean;
  };
}

export interface PUCFormData extends BaseFormData {
  // PUC-specific fields (minimal additional fields)
  // PUC forms use mostly base fields with some variations
}

export type FormDataUnion = ProfessionalFormData | PUCFormData;

export interface FormSection {
  id: string;
  title: string;
  component: string;
  required?: boolean;
  validation?: any;
}

export interface FormStep {
  id: string;
  title: string;
  sections: FormSection[];
}

export interface FormConfig {
  id: 'professional' | 'puc';
  title: string;
  description: string;
  steps: string[];
  validation: Record<string, any>;
  submission: {
    endpoint: string;
    method: 'POST' | 'PUT';
    mapper: (data: FormDataUnion) => any;
  };
}

export interface FormEngineState {
  currentFormType: 'professional' | 'puc' | null;
  currentStep: number;
  completedSteps: Record<number, boolean>;
  formData: FormDataUnion;
  validationState: Record<string, {
    isValid: boolean;
    errors?: Record<string, string>;
    data?: any;
  }>;
  uploadState: Record<string, {
    isUploading: boolean;
    uploaded: boolean;
    progress: number;
    error?: string;
  }>;
  submissionState: {
    isSubmitting: boolean;
    isSubmitted: boolean;
    error?: string;
    applicationId?: string;
  };
}

export interface NavigationProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, any>) => void;
  };
  route: {
    params?: Record<string, any>;
  };
}

// Type guards for safe form operations
export const isProfessionalForm = (data: FormDataUnion): data is ProfessionalFormData => {
  return data && 'academic' in data && 'bank' in data;
};

export const isPUCForm = (data: FormDataUnion): data is PUCFormData => {
  return data && !('academic' in data) && !('bank' in data);
};
