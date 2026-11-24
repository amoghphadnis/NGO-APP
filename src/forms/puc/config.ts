import { APP_TITLES } from '@/config/appContent';
import { FormConfig, FormStep } from '../shared/types';

export const pucFormConfig: FormConfig = {
  type: 'puc',
  title: APP_TITLES.pucApplication,
  description: APP_TITLES.pucApplication,
  steps: [
    'guidelines',
    'personal',
    'contact',
    'address',
    'family',
    'academic',
    'documents',
    'review',
    'success'
  ],
  totalSteps: 9,
  validation: {
    guidelines: 'guidelinesSchema',
    personal: 'pucFormat11PersonalSchema',
    contact: 'pucFormat11ContactSchema',
    address: 'pucFormat11AddressSchema',
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
    title: 'Personal Details',
    subtitle: 'Tell us about yourself',
    component: 'PersonalSection',
    validation: 'pucFormat11PersonalSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'contact' as FormStep,
    title: 'Contact Information',
    subtitle: 'How can we reach you',
    component: 'ContactSection',
    validation: 'pucFormat11ContactSchema',
    required: true,
    icon: 'mail'
  },
  {
    id: 'address' as FormStep,
    title: 'Address Details',
    subtitle: 'Where do you live',
    component: 'AddressSection',
    validation: 'pucFormat11AddressSchema',
    required: true,
    icon: 'location'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Information',
    subtitle: 'Tell us about your family',
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
