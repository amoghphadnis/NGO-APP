import { create } from 'zustand';
import { FormType, FormStep, FormState } from '@/forms/shared/types';
import { getFormConfig } from '@/forms/shared/registry';
import { FormEngineState, FormDataUnion, ProfessionalFormValues, PucFormValues } from '@/types/forms';
import { professionalFormSchema } from '@/validation/professionalSchemas';
import { pucFormSchema } from '@/validation/pucSchemas';

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
  updateSectionData: (section: keyof FormDataUnion | 'academic' | 'bank' | 'category' | 'documents', data: unknown) => void;
  updateValidationState: (step: string, validation: { isValid: boolean; errors?: Record<string, string>; data?: unknown }) => void;
  updateUploadState: (documentKey: string, meta: Partial<DocumentsMetaItem>) => void;
  setSubmissionLoading: (loading: boolean) => void;
  setSubmissionError: (error: string | undefined) => void;
  setSubmissionSuccess: (success: boolean, applicationId?: string) => void;
  resetForm: () => void;
  
  // Getters
  getCurrentStepConfig: () => unknown;
  getFormProgress: () => number;
}

export const useFormEngineStore = create<FormEngineStore>((set, get) => ({
  // Current form state
  currentFormType: null,
  currentStep: 0,
  completedSteps: {},
  
  // Form data - initialized with safe defaults matching Zod schemas
  formData: {
    personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
    contact: { email: '', phone: '' },
    address: { pincode: '', district: '', otherDistrict: '', taluk: '', place: '', address: '' },
    family: { fatherOccupationID: '', motherOccupationID: '', familyMembers: 1, familyComposition: [], annualIncome: '' },
    category: { scholarshipCategory: '', courseType: '' },
    academic: { puPercentage: 0, cetNeetRank: undefined, courseTypeID: '', collegeName: '', collegeTypeID: '1', collegeFees: 0 },
    bank: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: '', ifscVerified: false },
    documents: { marksCard: undefined, aadhaar: undefined, incomeCert: undefined },
  } as ProfessionalFormValues,
  
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
    
    // Initialize form data based on form type using Zod schema defaults
    const safeFormData: FormDataUnion = formType === 'professional' 
      ? {
          personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
          contact: { email: '', phone: '', alternatePhone: undefined },
          address: { pincode: '', district: '', otherDistrict: '', taluk: '', place: '', address: '', area: undefined },
          family: { fatherOccupationID: '', motherOccupationID: '', familyMembers: 1, familyComposition: [], annualIncome: '' },
          academic: { puPercentage: 0, cetNeetRank: undefined, courseTypeID: '', collegeName: '', collegeTypeID: '1', collegeFees: 0 },
          bank: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: '', ifscVerified: false },
          documents: { marksCard: undefined, aadhaar: undefined, incomeCert: undefined },
        } as ProfessionalFormValues
      : {
          personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
          contact: { email: '', phone: '', alternatePhone: undefined },
          address: { pincode: '', district: '', otherDistrict: '', taluk: '', place: '', address: '', area: undefined },
          family: { fatherName: '', motherName: '', fatherOccupationID: '', motherOccupationID: '', familyMembers: 1, familyComposition: [], annualIncome: '', monthlyRent: '', residenceType: undefined },
          category: { caste: '', houseType: '', monthlyRent: '', referenceSource: '' },
          academic: { course: '', collegeName: '', collegeType: '', expectedFees: 0, percentage: 0, totalMarks: 0 },
          documents: { sslcMarksCard: undefined, studentPhoto: undefined, electricityBill: undefined, rationCard: undefined, incomeCert: undefined, familyPhoto: undefined, houseVideo: undefined, houseVisitLink: undefined },
        } as PucFormValues;

    set({ 
      formData: safeFormData,
      currentStep: 0,
      completedSteps: {},
      validationState: {},
      uploadState: formType === 'professional' ? {
        marksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        aadhaar: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      } : {
        sslcMarksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        studentPhoto: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        electricityBill: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        rationCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        familyPhoto: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        houseVideo: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
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
      // For professional form specific sections, ensure we're working with ProfessionalFormValues
      if (state.currentFormType === 'professional') {
        return {
          formData: { ...state.formData, [section]: { ...(state.formData as ProfessionalFormValues)[section as keyof ProfessionalFormValues], ...(data as object) } },
        };
      }
      return state; // Ignore updates for non-professional forms
    }
    if (section === 'documents') {
      return {
        formData: { ...state.formData, documents: { ...state.formData.documents, ...(data as object) } },
      };
    }
    return {
      formData: { ...state.formData, [section]: { ...state.formData[section as keyof FormDataUnion], ...(data as object) } },
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
      personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
      contact: { email: '', phone: '' },
      address: { pincode: '', district: '', otherDistrict: '', taluk: '', place: '', address: '' },
      family: { fatherOccupationID: '', motherOccupationID: '', familyMembers: 1, familyComposition: [], annualIncome: '' },
      category: { scholarshipCategory: '', courseType: '' },
      academic: { puPercentage: 0, cetNeetRank: undefined, courseTypeID: '', collegeName: '', collegeTypeID: '1', collegeFees: 0 },
      bank: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: '', ifscVerified: false },
      documents: { marksCard: undefined, aadhaar: undefined, incomeCert: undefined },
    } as ProfessionalFormValues,
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
