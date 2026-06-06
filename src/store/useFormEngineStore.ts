import { create } from 'zustand';
import { FormType, FormStep, FormState } from '@/forms/shared/types';
import { getFormConfig } from '@/forms/shared/registry';
import { FormEngineState, FormDataUnion, ProfessionalFormValues, PucFormValues, PayanaFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { professionalFormSchema } from '@/validation/professionalSchemas';
import { pucFormSchema } from '@/validation/pucSchemas';
import { payanaFormSchema } from '@/validation/payanaSchemas';
import { semiProfessionalFormSchema } from '@/validation/semiProfessionalSchemas';

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
  progress: number;
}

export interface DocumentsMeta {
  [key: string]: DocumentsMetaItem;
}

// Professional form upload state keys (16 documents)
const PROFESSIONAL_UPLOAD_KEYS = [
  'PUCMarksCard',
  'IncomeCertificate',
  'Rationcard',
  'Electricitybill',
  'CollegeID',
  'Admissionproof',
  'FeesReceipts',
  'Expenditure',
  'Studentphoto',
  'Photoinfrontofcollege',
  'Dwellingunit',
  'CET',
  'Studentpass',
  'Monthsbank',
  'AadharCard',
  'Handwritten',
] as const;

interface FormEngineStore extends FormEngineState {
  // Actions
  initializeForm: (formType: FormType) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateSectionData: (section: keyof FormDataUnion | 'contact' | 'academic' | 'category' | 'bank' | 'documents', data: unknown) => void;
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
    personal: { StudentName: '', DateOfBirth: '', GenderID: 0, CasteCategoryID: 0 },
    contact: { Email: '', ContactNumber: '' },
    address: { Pincode: '', DistrictID: 0, OtherDistrict: '', Taluk: '', PlaceID: 0, Address: '' },
    family: { FatherOccupationID: undefined, MotherOccupationID: undefined, FamilyMembers: 1, AnnualIncome: '' },
    academic: { PUPercentage: 0, CET_NEET_Rank: undefined, CourseTypeID: 0, CollegeName: '', CollegeTypeID: 0, CollegeFees: 0 },
    documents: {
      PUCMarksCard: undefined,
      IncomeCertificate: undefined,
      Rationcard: undefined,
      Electricitybill: undefined,
      CollegeID: undefined,
      Admissionproof: undefined,
      FeesReceipts: undefined,
      Expenditure: undefined,
      Studentphoto: undefined,
      Photoinfrontofcollege: undefined,
      Dwellingunit: undefined,
      CET: undefined,
      Studentpass: undefined,
      Monthsbank: undefined,
      AadharCard: undefined,
      Handwritten: undefined,
      HouseVisitLink: '',
    },
  } as ProfessionalFormValues,
  
  // Validation state
  validationState: {},
  
  // Upload state
  uploadState: PROFESSIONAL_UPLOAD_KEYS.reduce((acc, key) => ({
    ...acc,
    [key]: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
  }), {} as Record<string, DocumentsMetaItem>),
  
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
    let safeFormData: FormDataUnion;
    let initialUploadState: Record<string, DocumentsMetaItem>;
    
    if (formType === 'professional') {
      safeFormData = {
        personal: { StudentName: '', DateOfBirth: '', GenderID: 0, CasteCategoryID: 0 },
        contact: { Email: '', ContactNumber: '' },
        address: { Pincode: '', DistrictID: 0, OtherDistrict: '', Taluk: '', PlaceID: 0, Address: '' },
        family: { FatherOccupationID: undefined, MotherOccupationID: undefined, FamilyMembers: 1, AnnualIncome: '' },
        academic: { PUPercentage: 0, CET_NEET_Rank: undefined, CourseTypeID: 0, CollegeName: '', CollegeTypeID: 0, CollegeFees: 0 },
        documents: {
          PUCMarksCard: undefined,
          IncomeCertificate: undefined,
          Rationcard: undefined,
          Electricitybill: undefined,
          CollegeID: undefined,
          Admissionproof: undefined,
          FeesReceipts: undefined,
          Expenditure: undefined,
          Studentphoto: undefined,
          Photoinfrontofcollege: undefined,
          Dwellingunit: undefined,
          CET: undefined,
          Studentpass: undefined,
          Monthsbank: undefined,
          AadharCard: undefined,
          Handwritten: undefined,
          HouseVisitLink: '',
        },
      } as unknown as ProfessionalFormValues;
      initialUploadState = PROFESSIONAL_UPLOAD_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      }), {} as Record<string, DocumentsMetaItem>);
    } else if (formType === 'semiProfessional') {
      safeFormData = {
        personal: { studentName: '', email: '', dateOfBirth: '', contactNumber: '', genderID: 0, casteCategoryID: 0 },
        address: { districtID: 0, otherDistrict: '', taluk: '', placeID: 0, address: '' },
        family: { fatherOccupationID: 0, motherOccupationID: 0, familyMembers: 1, annualIncome: 0 },
        academic: { puPercentage: 0, semiProfessionalCourseID: 0, collegeName: '', collegeTypeID: 0, collegeFees: 0 },
        documents: { pucMarksCard: undefined, incomeCertificate: undefined, aadharCard: undefined, houseVisitLink: '' },
      } as unknown as SemiProfessionalFormValues;
      initialUploadState = {
        pucMarksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        incomeCertificate: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        aadharCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      };
    } else if (formType === 'payana') {
      safeFormData = {
        personal: { studentName: '', dateOfBirth: '', genderID: 0 },
        contact: { contactNumber: '', alternateNumber: '', email: '' },
        address: { residentialAddress: '', currentAddress: '', place: '', taluka: '', districtID: 0, otherDistrict: '', pincode: '', areaTypeID: 0 },
        family: { fatherName: '', motherName: '', fatherOccupationID: undefined, motherOccupationID: undefined, familyMembers: 1, familyIncome: '', parentBank: '' },
        category: { casteCategoryID: 0, houseTypeID: 0 },
        academic: { courseID: 0, collegeName: '', collegeTypeID: 0, collegeCNumber: '', courseSA: '', courseStream: '', annualFees: '', totalExpenses: '', studentAchievements: '', securedPercentage: '' },
        bank: { accountHolderName: '', bankAccountNo: '', ifscCode: '', bankName: '', branchName: '' },
        documents: { latestMarksCard: undefined, studentPassbookFP: undefined, studentPhoto: undefined, dwellingUnit: undefined, aadhaarCard: undefined, houseVisitLink: '' },
        agreement: { isAgreed: false },
      } as unknown as PayanaFormValues;
      initialUploadState = {
        latestMarksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        studentPassbookFP: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        studentPhoto: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        dwellingUnit: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        aadhaarCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      };
    } else {
      // PUC form (default)
      safeFormData = {
        personal: { name: '', dateOfBirth: '', gender: '', caste: '' },
        contact: { email: '', phone: '', alternatePhone: undefined },
        address: { pincode: '', district: '', otherDistrict: '', taluk: '', place: '', address: '', area: undefined },
        family: { fatherName: '', motherName: '', fatherOccupationID: undefined, motherOccupationID: undefined, familyMembers: 1, familyComposition: [], annualIncome: '', monthlyRent: '', residenceType: undefined },
        category: { caste: '', houseType: '', monthlyRent: '', referenceSource: '', referenceSourceOther: '' },
        academic: { course: '', collegeName: '', collegeType: '', expectedFees: 0, percentage: 0, totalMarks: 0 },
        documents: { sslcMarksCard: undefined, studentPhoto: undefined, electricityBill: undefined, rationCard: undefined, incomeCert: undefined, familyPhoto: undefined, houseVideo: undefined, houseVisitLink: undefined },
      } as PucFormValues;
      initialUploadState = {
        sslcMarksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        studentPhoto: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        electricityBill: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        rationCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        incomeCert: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        familyPhoto: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        houseVideo: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      };
    }

    set({ 
      formData: safeFormData,
      currentStep: 0,
      completedSteps: {},
      validationState: {},
      uploadState: initialUploadState,
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
    // Handle form-specific sections that don't exist in all forms
    if (section === 'contact') {
      // Contact section exists in professional, puc, payana but NOT semiProfessional
      if (state.currentFormType === 'semiProfessional') {
        // Semi Professional doesn't have a separate contact section - ignore
        return state;
      }
      return {
        formData: { ...state.formData, [section]: { ...state.formData[section as keyof FormDataUnion], ...(data as object) } } as FormDataUnion,
      };
    }
    if (section === 'academic' || section === 'category' || section === 'bank') {
      // Handle form-specific sections
      if (state.currentFormType === 'professional' && section !== 'bank') {
        return {
          formData: { ...state.formData, [section]: { ...(state.formData as ProfessionalFormValues)[section as keyof ProfessionalFormValues], ...(data as object) } } as FormDataUnion,
        };
      }
      if (state.currentFormType === 'payana') {
        return {
          formData: { ...state.formData, [section]: { ...(state.formData as PayanaFormValues)[section as keyof PayanaFormValues], ...(data as object) } } as FormDataUnion,
        };
      }
      if (state.currentFormType === 'semiProfessional') {
        if (section === 'academic') {
          return {
            formData: { ...state.formData, [section]: { ...(state.formData as SemiProfessionalFormValues)[section as keyof SemiProfessionalFormValues], ...(data as object) } } as FormDataUnion,
          };
        }
        // semiProfessional doesn't have category or bank - ignore
        return state;
      }
      // PUC form handling
      if (section !== 'bank') {
        return {
          formData: { ...state.formData, [section]: { ...(state.formData as PucFormValues)[section as keyof PucFormValues], ...(data as object) } } as FormDataUnion,
        };
      }
      return state; // Ignore bank updates for non-Payana forms
    }
    if (section === 'documents') {
      return {
        formData: { ...state.formData, documents: { ...state.formData.documents, ...(data as object) } } as FormDataUnion,
      };
    }
    return {
      formData: { ...state.formData, [section]: { ...state.formData[section as keyof FormDataUnion], ...(data as object) } } as FormDataUnion,
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
      personal: { StudentName: '', DateOfBirth: '', GenderID: 0, CasteCategoryID: 0 },
      contact: { Email: '', ContactNumber: '' },
      address: { Pincode: '', DistrictID: 0, OtherDistrict: '', Taluk: '', PlaceID: 0, Address: '' },
      family: { FatherOccupationID: undefined, MotherOccupationID: undefined, FamilyMembers: 1, AnnualIncome: '' },
      academic: { PUPercentage: 0, CET_NEET_Rank: undefined, CourseTypeID: 0, CollegeName: '', CollegeTypeID: 0, CollegeFees: 0 },
      documents: {
        PUCMarksCard: undefined,
        IncomeCertificate: undefined,
        Rationcard: undefined,
        Electricitybill: undefined,
        CollegeID: undefined,
        Admissionproof: undefined,
        FeesReceipts: undefined,
        Expenditure: undefined,
        Studentphoto: undefined,
        Photoinfrontofcollege: undefined,
        Dwellingunit: undefined,
        CET: undefined,
        Studentpass: undefined,
        Monthsbank: undefined,
        AadharCard: undefined,
        Handwritten: undefined,
        HouseVisitLink: '',
      },
    } as unknown as ProfessionalFormValues,
    validationState: {},
    uploadState: PROFESSIONAL_UPLOAD_KEYS.reduce((acc, key) => ({
      ...acc,
      [key]: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
    }), {} as Record<string, DocumentsMetaItem>),
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
