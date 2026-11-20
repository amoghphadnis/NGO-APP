import { APP_TITLES } from '@/config/appContent';
import { FormConfig, FormStep } from '../shared/types';

export const newStudentFormConfig: FormConfig = {
  type: 'newStudent',
  title: APP_TITLES.studentRegistration,
  description: APP_TITLES.studentRegistration,
  steps: [
    'guidelines',
    'personal',
    'contact',
    'address',
    'family',
    'category',
    'academic',
    'documents',
    'review',
    'success'
  ],
  totalSteps: 10,
  validation: {
    guidelines: 'guidelinesSchema',
    personal: 'newStudentPersonalSchema',
    contact: 'newStudentContactSchema',
    address: 'newStudentAddressSchema',
    family: 'newStudentFamilySchema',
    category: 'newStudentCategorySchema',
    academic: 'newStudentAcademicSchema',
    documents: 'newStudentDocumentSchema',
    review: null,
    success: null
  }
};

export const newStudentStepConfigs = [
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
    validation: 'newStudentPersonalSchema',
    required: true,
    icon: 'person'
  },
  {
    id: 'contact' as FormStep,
    title: 'Contact Information',
    subtitle: 'Phone numbers and email',
    component: 'ContactSection',
    validation: 'newStudentContactSchema',
    required: true,
    icon: 'call'
  },
  {
    id: 'address' as FormStep,
    title: 'Address Details',
    subtitle: 'Residential address',
    component: 'AddressSection',
    validation: 'newStudentAddressSchema',
    required: true,
    icon: 'location'
  },
  {
    id: 'family' as FormStep,
    title: 'Family Information',
    subtitle: 'Parents and family details',
    component: 'FamilySection',
    validation: 'newStudentFamilySchema',
    required: true,
    icon: 'people'
  },
  {
    id: 'category' as FormStep,
    title: 'Category Details',
    subtitle: 'Caste, house and reference',
    component: 'CategorySection',
    validation: 'newStudentCategorySchema',
    required: true,
    icon: 'pricetag'
  },
  {
    id: 'academic' as FormStep,
    title: 'Academic Details',
    subtitle: 'Education and course information',
    component: 'AcademicSection',
    validation: 'newStudentAcademicSchema',
    required: true,
    icon: 'school'
  },
  {
    id: 'documents' as FormStep,
    title: 'Document Upload',
    subtitle: 'Upload required documents',
    component: 'DocumentSection',
    validation: 'newStudentDocumentSchema',
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
