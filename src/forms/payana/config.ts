import { FormConfig, FormStep } from '../shared/types';

export const payanaFormConfig: FormConfig = {
  type: 'payana',
  title: 'Payana Scholarship Application',
  description: 'Apply for Payana New Student Scholarship 2025-26',
  steps: [
    'guidelines',
    'personal',
    'contact',
    'address',
    'family',
    'category',
    'academic',
    'bank',
    'documents',
    'review',
    'success'
  ],
  totalSteps: 11,
  validation: {
    guidelines: 'guidelinesSchema',
    personal: 'payanaPersonalSchema',
    contact: 'payanaContactSchema',
    address: 'payanaAddressSchema',
    family: 'payanaFamilySchema',
    category: 'payanaCategorySchema',
    academic: 'payanaAcademicSchema',
    bank: 'payanaBankSchema',
    documents: 'payanaDocumentSchema',
    review: null,
    success: null
  }
};

export const payanaStepConfigs = [
  {
    id: 'guidelines' as FormStep,
    title: 'Application Guidelines',
    subtitle: 'Read the instructions carefully',
    component: 'GuidelinesSection',
    validation: 'guidelinesSchema',
    required: true,
    icon: 'document-text'
  },
  {
    id: 'personal' as FormStep,
    title: 'Personal Details',
    subtitle: 'Student name and date of birth',
    component: 'PersonalSection',
    validation: 'payanaPersonalSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'contact' as FormStep,
    title: 'Contact Information',
    subtitle: 'Phone numbers and email',
    component: 'ContactSection',
    validation: 'payanaContactSchema',
    required: true,
    icon: 'call'
  },
  {
    id: 'address' as FormStep,
    title: 'Address Details',
    subtitle: 'Residential and current address',
    component: 'AddressSection',
    validation: 'payanaAddressSchema',
    required: true,
    icon: 'location'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Information',
    subtitle: 'Parents and family details',
    component: 'FamilySection',
    validation: 'payanaFamilySchema',
    required: true,
    icon: 'people'
  },
  {
    id: 'category' as FormStep,
    title: 'Category Details',
    subtitle: 'Caste and house type',
    component: 'CategorySection',
    validation: 'payanaCategorySchema',
    required: true,
    icon: 'pricetag'
  },
  {
    id: 'academic' as FormStep,
    title: 'Academic Details',
    subtitle: 'Education and course information',
    component: 'AcademicSection',
    validation: 'payanaAcademicSchema',
    required: true,
    icon: 'school'
  },
  {
    id: 'bank' as FormStep,
    title: 'Bank Details',
    subtitle: 'Student bank account information',
    component: 'BankSection',
    validation: 'payanaBankSchema',
    required: true,
    icon: 'card'
  },
  {
    id: 'documents' as FormStep,
    title: 'Document Upload',
    subtitle: 'Upload required documents',
    component: 'DocumentSection',
    validation: 'payanaDocumentSchema',
    required: true,
    icon: 'attach'
  },
  {
    id: 'review' as FormStep,
    title: 'Review Application',
    subtitle: 'Check before submitting',
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
