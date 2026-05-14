import { create } from 'zustand';
import { FormType, FormStep, FormState } from '@/forms/shared/types';
import { getFormConfig } from '@/forms/shared/registry';
import { FormEngineState, FormDataUnion } from '@/types/forms';

// Document interfaces for upload tracking
export interface DocumentFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface DocumentsMetaItem {
  isUploading: boolean;
  uploaded: boolean;
  error?: string | undefined;
  progress?: number;
}

export interface DocumentsMeta {
  [key: string]: DocumentsMetaItem;
}

interface FormEngineStore extends FormEngineState {
  // Actions
  initializeForm: (formType: FormType) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateSectionData: (section: keyof FormDataUnion | 'academic' | 'bank' | 'category', data: any) => void;
  updateValidationState: (step: string, validation: any) => void;
  updateUploadState: (documentKey: string, meta: Partial<DocumentsMetaItem>) => void;
  setSubmissionLoading: (loading: boolean) => void;
  setSubmissionError: (error: string | undefined) => void;
  setSubmissionSuccess: (success: boolean, applicationId?: string) => void;
  resetForm: () => void;
  
  // Getters
  getCurrentStepConfig: () => any;
  getFormProgress: () => number;
}

export const useFormEngineStore = create<FormEngineStore>((set, get) => ({
  // Current form state
  currentFormType: null,
  currentStep: 0,
  completedSteps: {},
  
  // Form data
  formData: {
    guidelines: { accepted: false },
    personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
    contact: { email: '', phone: '' },
    address: { pincode: '', district: '', taluk: '', place: '', address: '' },
    family: { fatherOccupation: '', motherOccupation: '', familyMembers: 1, annualIncome: '' },
    category: { scholarshipCategory: '', courseType: '' },
    academic: { puPercentage: 0, course: '', collegeName: '', collegeType: 'Government', annualCollegeFees: 0 },
    bank: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: '', ifscVerified: false },
    documents: { marksCard: undefined, aadhaar: undefined, incomeCert: undefined },
    review: { declarationAccepted: false },
  } as FormDataUnion,
  
  // Validation state
  validationState: {},
  
  // Upload state
  uploadState: {
    marksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
    aadhaar: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
    incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
  },
  
  // Submission state
  submissionState: {
    isSubmitting: false,
    isSubmitted: false,
    error: undefined,
    applicationId: undefined,
  },

  // Actions
  initializeForm: (formType) => {
    const config = getFormConfig(formType);
    set({ currentFormType: formType });
    
    // Reset form data for new formType
    const defaultFormData = config.steps.reduce((acc, stepId) => {
      const stepConfig = config.validation[stepId];
      if (stepConfig?.defaultValues) {
        return { ...acc, ...stepConfig.defaultValues };
      }
      return acc;
    }, {} as FormDataUnion);
    
    set({ 
      formData: defaultFormData,
      currentStep: 0,
      completedSteps: {},
      validationState: {},
      uploadState: {
        marksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        aadhaar: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      },
      submissionState: {
        isSubmitting: false,
        isSubmitted: false,
        error: undefined,
        applicationId: undefined,
      },
    });
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  markStepComplete: (step) => set((state) => ({
    completedSteps: { ...state.completedSteps, [step]: true },
  })),

  updateSectionData: (section, data) => set((state) => {
    if (section === 'academic' || section === 'bank' || section === 'category') {
      // For professional form specific sections, ensure we're working with ProfessionalFormData
      if (state.currentFormType === 'professional') {
        return {
          formData: { ...state.formData, [section]: { ...(state.formData as any)[section], ...data } },
        };
      }
      return state; // Ignore updates for non-professional forms
    }
    return {
      formData: { ...state.formData, [section]: { ...state.formData[section], ...data } },
    };
  }),

  updateValidationState: (step, validation) => set((state) => ({
    validationState: { ...state.validationState, [step]: validation },
  })),

  updateUploadState: (documentKey, meta) => set((state) => ({
    uploadState: { 
      ...state.uploadState, 
      [documentKey]: { ...state.uploadState[documentKey], ...meta } 
    },
  })),

  setSubmissionLoading: (loading) => set((state) => ({
    submissionState: { ...state.submissionState, isSubmitting: loading },
  })),

  setSubmissionError: (error) => set((state) => ({
    submissionState: { ...state.submissionState, error, isSubmitting: false },
  })),

  setSubmissionSuccess: (success, applicationId) => set((state) => ({
    submissionState: { 
      ...state.submissionState, 
      isSubmitted: success, 
      applicationId, 
      isSubmitting: false, 
      error: undefined 
    },
  })),

  resetForm: () => set({
    currentFormType: null,
    currentStep: 0,
    completedSteps: {},
    formData: {
      guidelines: { accepted: false },
      personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
      contact: { email: '', phone: '' },
      address: { pincode: '', district: '', taluk: '', place: '', address: '' },
      family: { fatherOccupation: '', motherOccupation: '', familyMembers: 1, annualIncome: '' },
      category: { scholarshipCategory: '', courseType: '' },
      academic: { puPercentage: 0, course: '', collegeName: '', collegeType: 'Government', annualCollegeFees: 0 },
      bank: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: '', ifscVerified: false },
      documents: { marksCard: undefined, aadhaar: undefined, incomeCert: undefined },
      review: { declarationAccepted: false },
    } as FormDataUnion,
    validationState: {},
    uploadState: {
      marksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      aadhaar: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
    },
    submissionState: {
      isSubmitting: false,
      isSubmitted: false,
      error: undefined,
      applicationId: undefined,
    },
  }),

  // Getters
  getCurrentStepConfig: () => {
    const { currentFormType } = get();
    if (!currentFormType) return null;
    const config = getFormConfig(currentFormType);
    const { currentStep } = get();
    return config.validation[config.steps[currentStep]];
  },

  getFormProgress: () => {
    const { currentStep, completedSteps } = get();
    const { currentFormType } = get();
    if (!currentFormType) return 0;
    const config = getFormConfig(currentFormType);
    const totalSteps = config.steps.length;
    const completedCount = Object.keys(completedSteps).length;
    return Math.round((completedCount / totalSteps) * 100);
  },
}));
