// Centralized Form Type Definitions for VP Scholarship App
// This file provides type-safe interfaces using Zod-inferred types as single source of truth

import { z } from 'zod';
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
  guidelinesSchema,
} from '@/validation/sharedSchemas';
import {
  academicDetailsSchema,
  bankDetailsSchema,
  professionalFormSchema,
  professionalDocumentDetailsSchema,
} from '@/validation/professionalSchemas';
import {
  pucCategoryHousingSchema,
  pucAcademicDetailsSchema,
  pucFormSchema,
  pucDocumentDetailsSchema,
} from '@/validation/pucSchemas';

// Type exports from Zod schemas (single source of truth)
export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>;
export type AddressDetailsFormValues = z.infer<typeof addressDetailsSchema>;
export type FamilyDetailsFormValues = z.infer<typeof familyDetailsSchema>;
export type GuidelinesFormValues = z.infer<typeof guidelinesSchema>;

export type AcademicDetailsFormValues = z.infer<typeof academicDetailsSchema>;
export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;
export type ProfessionalDocumentDetailsFormValues = z.infer<typeof professionalDocumentDetailsSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

export type PucCategoryHousingFormValues = z.infer<typeof pucCategoryHousingSchema>;
export type PucAcademicDetailsFormValues = z.infer<typeof pucAcademicDetailsSchema>;
export type PucDocumentDetailsFormValues = z.infer<typeof pucDocumentDetailsSchema>;
export type PucFormValues = z.infer<typeof pucFormSchema>;

// Union type for all form types
export type FormDataUnion = ProfessionalFormValues | PucFormValues;

// Form engine state interface (using Zod-inferred types)
export interface FormEngineState {
  currentFormType: 'professional' | 'puc' | null;
  currentStep: number;
  completedSteps: Record<number, boolean>;
  formData: FormDataUnion;
  validationState: Record<string, {
    isValid: boolean;
    errors?: Record<string, string>;
    data?: unknown;
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

// Navigation props interface
export interface NavigationProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route: {
    params?: Record<string, unknown>;
  };
}

// Type guards for safe form operations
export const isProfessionalForm = (data: FormDataUnion): data is ProfessionalFormValues => {
  return data && 'academic' in data && !('category' in data);
};

export const isPUCForm = (data: FormDataUnion): data is PucFormValues => {
  return data && 'category' in data && !('bank' in data);
};
