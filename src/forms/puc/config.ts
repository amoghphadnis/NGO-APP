import { APP_TITLES } from '@/config/appContent';
import { FormConfig, FormStep } from '../shared/types';

export const pucFormConfig: FormConfig = {
  type: 'puc',
  title: APP_TITLES.pucApplication,
  description: APP_TITLES.pucApplication,
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
    personal: 'pucFormat11PersonalSchema',
    family: 'pucFormat11FamilySchema',
    academic: 'pucFormat11AcademicSchema',
    documents: 'pucFormat11DocumentsSchema',
    review: null,
    success: null
  }
};

export const pucStepConfigs = [
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
    validation: 'pucFormat11PersonalSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Details',
    subtitle: 'Family and housing information',
    component: 'FamilySection',
    validation: 'pucFormat11FamilySchema',
    required: true,
    icon: 'people'
  },
  {
    id: 'academic' as FormStep,
    title: 'Academic Details',
    subtitle: 'Course and academic information',
    component: 'AcademicSection',
    validation: 'pucFormat11AcademicSchema',
    required: true,
    icon: 'school'
  },
  {
    id: 'documents' as FormStep,
    title: 'Document Upload',
    subtitle: 'Upload required documents',
    component: 'DocumentSection',
    validation: 'pucFormat11DocumentsSchema',
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
