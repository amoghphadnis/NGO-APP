import { getFormConfig } from '@/forms/shared/registry';
import { FormType } from '@/forms/shared/types';
import { FormDataUnion, FormEngineState, PayanaFormValues, ProfessionalFormValues, PucFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { create } from 'zustand';

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

// Professional form upload state keys (9 documents)
const PROFESSIONAL_UPLOAD_KEYS = [
  'StudentSelfie',
  'CETNEETRankSheet',
  'DwellingUnitPhoto',
  'MarksSheet12',
  'RequestLetter',
  'HouseVideo',
  'ElectricityBill',
  'IncomeCertificate',
  'RationCard',
] as const;

interface FormEngineStore extends FormEngineState {
  // Actions
  initializeForm: (formType: FormType) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateSectionData: (section: keyof FormDataUnion | 'contact' | 'address' | 'academic' | 'category' | 'bank' | 'documents', data: unknown) => void;
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
    personal: {
      Email: '',
      StudentName: '',
      DateOfBirth: '',
      ContactNumber: '',
      AlternateNumber: '',
      ResidentialAddress: '',
      GoogleMapLink: '',
      AreaTypeID: 0,
      DistrictID: 0,
      OtherDistrict: '',
      GenderID: 0,
      CasteCategoryID: 0,
    },
    family: {
      FatherName: '',
      MotherName: '',
      FatherOccupationID: 0,
      MotherOccupationID: 0,
      FamilyMembers: 1,
      HouseTypeID: 0,
      MonthlyRent: undefined,
      FamilyIncome: 0,
    },
    academic: {
      PUPercentage: 0,
      CETRank: undefined,
      NEETRank: undefined,
      CourseApplying: '',
      CourseStream: '',
    },
    documents: {
      StudentSelfie: undefined,
      CETNEETRankSheet: undefined,
      DwellingUnitPhoto: undefined,
      MarksSheet12: undefined,
      RequestLetter: undefined,
      HouseVideo: undefined,
      ElectricityBill: undefined,
      IncomeCertificate: undefined,
      RationCard: undefined,
    },
  } as unknown as ProfessionalFormValues,
  
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
        personal: {
          Email: '',
          StudentName: '',
          DateOfBirth: '',
          ContactNumber: '',
          AlternateNumber: '',
          ResidentialAddress: '',
          GoogleMapLink: '',
          AreaTypeID: 0,
          DistrictID: 0,
          OtherDistrict: '',
          GenderID: 0,
          CasteCategoryID: 0,
        },
        family: {
          FatherName: '',
          MotherName: '',
          FatherOccupationID: 0,
          MotherOccupationID: 0,
          FamilyMembers: 1,
          HouseTypeID: 0,
          MonthlyRent: undefined,
          FamilyIncome: 0,
        },
        academic: {
          PUPercentage: 0,
          CETRank: undefined,
          NEETRank: undefined,
          CourseApplying: '',
          CourseStream: '',
        },
        documents: {
          StudentSelfie: undefined,
          CETNEETRankSheet: undefined,
          DwellingUnitPhoto: undefined,
          MarksSheet12: undefined,
          RequestLetter: undefined,
          HouseVideo: undefined,
          ElectricityBill: undefined,
          IncomeCertificate: undefined,
          RationCard: undefined,
        },
      } as unknown as ProfessionalFormValues;
      initialUploadState = PROFESSIONAL_UPLOAD_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
      }), {} as Record<string, DocumentsMetaItem>);
    } else if (formType === 'semiProfessional') {
      safeFormData = {
        personal: {
          email: '',
          studentName: '',
          dateOfBirth: '',
          contactNumber: '',
          genderID: 0,
          casteCategoryID: 0,
          districtID: 0,
          otherDistrict: '',
          taluk: '',
          address: '',
          placeID: 0,
        },
        family: {
          fatherOccupationID: 0,
          motherOccupationID: 0,
          familyMembers: 1,
          annualIncome: 0,
        },
        academic: {
          puPercentage: 0,
          semiProfessionalCourseID: 0,
          collegeName: '',
          collegeTypeID: 0,
          collegeFees: 0,
        },
        documents: {
          pucMarksCard: undefined,
          incomeCertificate: undefined,
          aadharCard: undefined,
        },
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
        address: { residentialAddress: '', currentAddress: '', taluka: '', districtID: 0, otherDistrict: '', pincode: '', placeID: 0 },
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
      // PUC Format 1.1 form
      safeFormData = {
        personal: { StudentName: '', DateOfBirth: '', Gender: 0, Caste: 0, Place: 0 },
        contact: { Email: '', ContactNumber: '', AlternateNumber: '' },
        address: { District: 0, OtherDistrict: '', Taluk: '', ResidentialAddress: '' },
        family: { FatherOccupation: 0, MotherOccupation: 0, TotalFamilyMembers: 1, FamilyAnnualIncome: 0 },
        academic: { SSLCPercentage: 0, CourseJoined: 0, CollegeName: '', CollegeType: 0, CollegeFees: 0, CollegeContactNumber: '', Achievement: '' },
        bank: { ParentsBankBalance: 0, AccountHolderName: '', AccountNumber: '', IFSCCode: '', BankName: '', BranchName: '' },
        documents: { StudentSelfie: undefined, SSLCMarksCard: undefined, FeeReceipts: undefined, BankPassbook: undefined, AadhaarCard: undefined },
      } as unknown as PucFormValues;
      initialUploadState = {
        StudentSelfie: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        SSLCMarksCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        FeeReceipts: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        BankPassbook: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
        AadhaarCard: { isUploading: false, uploaded: false, error: undefined, progress: 0 },
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
      // Contact section exists in puc, payana but NOT professional (merged into personal) or semiProfessional
      if (state.currentFormType === 'semiProfessional' || state.currentFormType === 'professional') {
        // These forms don't have a separate contact section - ignore
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
      // PUC form handling (Format 1.1 — has bank section)
      if (section === 'bank') {
        return {
          formData: { ...state.formData, bank: { ...(state.formData as PucFormValues).bank, ...(data as object) } } as FormDataUnion,
        };
      }
      return {
        formData: { ...state.formData, [section]: { ...(state.formData as PucFormValues)[section as keyof PucFormValues], ...(data as object) } } as FormDataUnion,
      };
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
      personal: {
        Email: '',
        StudentName: '',
        DateOfBirth: '',
        ContactNumber: '',
        AlternateNumber: '',
        ResidentialAddress: '',
        GoogleMapLink: '',
        AreaTypeID: 0,
        DistrictID: 0,
        OtherDistrict: '',
        GenderID: 0,
        CasteCategoryID: 0,
      },
      family: {
        FatherName: '',
        MotherName: '',
        FatherOccupationID: 0,
        MotherOccupationID: 0,
        FamilyMembers: 1,
        HouseTypeID: 0,
        MonthlyRent: undefined,
        FamilyIncome: 0,
      },
      academic: {
        PUPercentage: 0,
        CETRank: undefined,
        NEETRank: undefined,
        CourseApplying: '',
        CourseStream: '',
      },
      documents: {
        StudentSelfie: undefined,
        CETNEETRankSheet: undefined,
        DwellingUnitPhoto: undefined,
        MarksSheet12: undefined,
        RequestLetter: undefined,
        HouseVideo: undefined,
        ElectricityBill: undefined,
        IncomeCertificate: undefined,
        RationCard: undefined,
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
