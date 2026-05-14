import { FormConfig, FormStep } from '../shared/types';

export const pucFormConfig: FormConfig = {
  type: 'puc',
  title: 'PUC Scholarship Application',
  description: 'Apply for Pre-University College scholarships',
  steps: [
    'guidelines',
    'personal',
    'contact', 
    'address',
    'family',
    'documents',
    'review',
    'success'
  ],
  totalSteps: 8,
  validation: {
    guidelines: 'guidelinesSchema',
    personal: 'personalDetailsSchema',
    contact: 'contactDetailsSchema',
    address: 'addressDetailsSchema',
    family: 'familyDetailsSchema',
    documents: 'documentDetailsSchema',
    review: null,
    success: null
  },
  submission: {
    endpoint: '/api/forms/puc/submit',
    mapper: 'pucMapper'
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
    validation: 'personalDetailsSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'contact' as FormStep,
    title: 'Contact Information',
    subtitle: 'How can we reach you',
    component: 'ContactSection',
    validation: 'contactDetailsSchema',
    required: true,
    icon: 'mail'
  },
  {
    id: 'address' as FormStep,
    title: 'Address Details',
    subtitle: 'Where do you live',
    component: 'AddressSection',
    validation: 'addressDetailsSchema',
    required: true,
    icon: 'location'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Information',
    subtitle: 'Tell us about your family',
    component: 'FamilySection',
    validation: 'familyDetailsSchema',
    required: true,
    icon: 'people'
  },
  {
    id: 'documents' as FormStep,
    title: 'Document Upload',
    subtitle: 'Upload required documents',
    component: 'DocumentSection',
    validation: 'documentDetailsSchema',
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
