import { APP_TITLES } from '@/config/appContent';
import { FormConfig, FormStep } from '../shared/types';

export const professionalFormConfig: FormConfig = {
  type: 'professional',
  title: APP_TITLES.professionalApplication,
  description: APP_TITLES.professionalApplication,
  steps: [
    'guidelines',
    'personal',
    'family',
    'academic',
    'documents',
    'review',
    'success'
  ],
  totalSteps: 7,
  validation: {
    guidelines: 'guidelinesSchema',
    personal: 'professionalPersonalDetailsSchema',
    family: 'professionalFamilyDetailsSchema',
    academic: 'academicDetailsSchema',
    documents: 'professionalDocumentDetailsSchema',
    review: null,
    success: null
  }
};

export const professionalStepConfigs = [
  {
    id: 'guidelines' as FormStep,
    title: 'Application Guidelines',
    subtitle: 'Read and accept the terms',
    component: 'GuidelinesSection',
    validation: 'guidelinesSchema',
    required: true,
    icon: 'document-text'
  },
  {
    id: 'personal' as FormStep,
    title: "Applicant's Information",
    subtitle: 'Personal, contact and address details',
    component: 'PersonalSection',
    validation: 'professionalPersonalDetailsSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Details',
    subtitle: 'Family and housing information',
    component: 'FamilySection',
    validation: 'professionalFamilyDetailsSchema',
    required: true,
    icon: 'people'
  },
  {
    id: 'academic' as FormStep,
    title: 'Academic Details',
    subtitle: 'Your educational background',
    component: 'AcademicSection',
    validation: 'academicDetailsSchema',
    required: true,
    icon: 'school'
  },
  {
    id: 'documents' as FormStep,
    title: 'Document Upload',
    subtitle: 'Upload required documents',
    component: 'DocumentSection',
    validation: 'professionalDocumentDetailsSchema',
    required: true,
    icon: 'attach'
  },
  {
    id: 'review' as FormStep,
    title: 'Review Application',
    subtitle: 'Check your application before submitting',
    component: 'ReviewSection',
    validation: null,
    required: true,
    icon: 'checkmark-circle'
  },
  {
    id: 'success' as FormStep,
    title: 'Application Submitted',
    subtitle: 'Your application has been received',
    component: 'SuccessSection',
    validation: null,
    required: false,
    icon: 'checkmark-done'
  }
];
