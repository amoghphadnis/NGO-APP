import { z } from 'zod';
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
} from './sharedSchemas';
import { UploadedDocument } from '@/types/documents';

// Professional Personal Details Schema (PascalCase to match API)
export const professionalPersonalDetailsSchema = z.object({
  StudentName: z.string().min(1, { message: 'Student name is required' }),
  DateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  GenderID: z.number().positive({ message: 'Gender is required' }),
  CasteCategoryID: z.number().positive({ message: 'Caste category is required' }),
});

// Professional Contact Details Schema (PascalCase to match API)
export const professionalContactDetailsSchema = z.object({
  Email: z.string().min(1, { message: 'Email is required' }).email('Enter a valid email address'),
  ContactNumber: z.string().min(10, { message: 'Please enter a valid 10-digit number' }).max(10).regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit number'),
});

// Professional Address Details Schema (PascalCase to match API)
export const professionalAddressDetailsSchema = z.object({
  DistrictID: z.number().positive({ message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  Taluk: z.string().min(1, { message: 'Taluk is required' }),
  PlaceID: z.number().positive({ message: 'Place is required' }),
  Address: z.string().min(1, { message: 'Address is required' }),
  Pincode: z.string().min(6).max(6).regex(/^\d{6}$/, 'Pincode must be 6 digits'),
});

// Professional Family Details Schema (PascalCase to match API, occupations optional)
export const professionalFamilyDetailsSchema = z.object({
  FatherOccupationID: z.number().optional(),
  MotherOccupationID: z.number().optional(),
  FamilyMembers: z.number().min(1, { message: 'At least 1 family member' }),
  AnnualIncome: z.string().min(1, { message: 'Annual income is required' }),
});

export const academicDetailsSchema = z.object({
  PUPercentage: z.number().min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  CET_NEET_Rank: z.string().optional(), // Can be "Not Appeared" or rank number
  CourseTypeID: z.number().positive({ message: 'Course type is required' }),
  CollegeName: z.string().min(1, { message: 'College name is required' }),
  CollegeTypeID: z.number().positive({ message: 'College type is required' }),
  CollegeFees: z.number().positive({ message: 'Fees must be a positive number' }),
});

// Bank details schema kept for potential future use
export const bankDetailsSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, { message: 'Account holder name is required' })
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  bankName: z.string().min(1, { message: 'Bank name is required' }),
  accountNumber: z
    .string()
    .min(9, { message: 'Account number must be at least 9 digits' })
    .max(18, { message: 'Account number must be at most 18 digits' })
    .regex(/^\d+$/, 'Account number must be numeric'),
  ifscCode: z
    .string()
    .min(1, { message: 'IFSC code is required' })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'),
  branchName: z.string().optional(),
  ifscVerified: z.boolean(),
});

export const professionalDocumentDetailsSchema = z.object({
  // All 16 documents are required
  PUCMarksCard: z.custom<UploadedDocument>().optional(),
  IncomeCertificate: z.custom<UploadedDocument>().optional(),
  Rationcard: z.custom<UploadedDocument>().optional(),
  Electricitybill: z.custom<UploadedDocument>().optional(),
  CollegeID: z.custom<UploadedDocument>().optional(),
  Admissionproof: z.custom<UploadedDocument>().optional(),
  FeesReceipts: z.custom<UploadedDocument>().optional(),
  Expenditure: z.custom<UploadedDocument>().optional(),
  Studentphoto: z.custom<UploadedDocument>().optional(),
  Photoinfrontofcollege: z.custom<UploadedDocument>().optional(),
  Dwellingunit: z.custom<UploadedDocument>().optional(),
  CET: z.custom<UploadedDocument>().optional(),
  Studentpass: z.custom<UploadedDocument>().optional(),
  Monthsbank: z.custom<UploadedDocument>().optional(),
  AadharCard: z.custom<UploadedDocument>().optional(),
  Handwritten: z.custom<UploadedDocument>().optional(),
  HouseVisitLink: z.string()
    .min(1, { message: 'House visit link is required' })
    .regex(/^https:\/\/.*/, { message: 'Link must start with https://' }),
});

// Complete professional form schema (PascalCase to match API)
export const professionalFormSchema = z.object({
  personal: professionalPersonalDetailsSchema,
  contact: professionalContactDetailsSchema,
  address: professionalAddressDetailsSchema,
  family: professionalFamilyDetailsSchema,
  academic: academicDetailsSchema,
  documents: professionalDocumentDetailsSchema,
});

// Type exports
export type AcademicDetailsFormValues = z.infer<typeof academicDetailsSchema>;
export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
export type ProfessionalDocumentDetailsFormValues = z.infer<typeof professionalDocumentDetailsSchema>;
export type ProfessionalPersonalDetailsFormValues = z.infer<typeof professionalPersonalDetailsSchema>;
export type ProfessionalContactDetailsFormValues = z.infer<typeof professionalContactDetailsSchema>;
export type ProfessionalAddressDetailsFormValues = z.infer<typeof professionalAddressDetailsSchema>;
export type ProfessionalFamilyDetailsFormValues = z.infer<typeof professionalFamilyDetailsSchema>;
