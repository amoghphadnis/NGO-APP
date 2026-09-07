/**
 * PUC Format 1.1 — Zod Validation Schemas
 *
 * Mirrors the POST /api/VP_Format1_1PUC multipart contract exactly.
 * Section-based composition matches the form engine's step architecture.
 */

import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// ============================================================================
// Personal Section
// ============================================================================

export const pucFormat11PersonalSchema = z.object({
  StudentName: z.string().min(1, { message: 'Student name is required' }),
  DateOfBirth: z
    .string()
    .min(1, { message: 'Date of birth is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Date cannot be in the future',
    })
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age >= 13;
    }, { message: 'You must be at least 13 years old' }),
  Gender: z.number().min(1, { message: 'Gender is required' }),
  Caste: z.number().min(1, { message: 'Caste is required' }),
  Place: z.number().min(1, { message: 'Place is required' }),
});

// ============================================================================
// Contact Section
// ============================================================================

export const pucFormat11ContactSchema = z.object({
  Email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('Enter a valid email address'),
  ContactNumber: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit number' })
    .max(10, { message: 'Please enter a valid 10-digit number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit number'),
  AlternateNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'Please enter a valid 10-digit number',
    }),
});

// ============================================================================
// Address Section
// ============================================================================

export const pucFormat11AddressSchema = z.object({
  District: z.number().min(1, { message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  Taluk: z.string().min(1, { message: 'Taluk is required' }),
  ResidentialAddress: z.string().min(1, { message: 'Residential address is required' }),
});

// ============================================================================
// Family Section
// ============================================================================

export const pucFormat11FamilySchema = z.object({
  FatherOccupation: z.number().min(1, { message: "Father's occupation is required" }),
  MotherOccupation: z.number().min(1, { message: "Mother's occupation is required" }),
  TotalFamilyMembers: z.number().min(1, { message: 'At least 1 family member' }),
  FamilyAnnualIncome: z
    .number()
    .min(0, { message: 'Annual income must be at least 0' }),
});

// ============================================================================
// Academic Section
// ============================================================================

export const pucFormat11AcademicSchema = z.object({
  SSLCPercentage: z
    .number()
    .min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  CourseJoined: z.number().min(1, { message: 'Course is required' }),
  CollegeName: z.string().min(1, { message: 'College name is required' }),
  CollegeType: z.number().min(1, { message: 'College type is required' }),
  CollegeFees: z.number().min(0, { message: 'Fees must be at least 0' }),
  CollegeContactNumber: z
    .string()
    .min(1, { message: 'College contact number is required' }),
  Achievement: z.string().optional(),
});

// ============================================================================
// Bank Section
// ============================================================================

export const pucFormat11BankSchema = z.object({
  ParentsBankBalance: z
    .number()
    .min(0, { message: 'Bank balance must be at least 0' }),
  AccountHolderName: z.string().min(1, { message: 'Account holder name is required' }),
  AccountNumber: z.string().min(1, { message: 'Account number is required' }),
  IFSCCode: z.string().min(1, { message: 'IFSC code is required' }),
  BankName: z.string().min(1, { message: 'Bank name is required' }),
  BranchName: z.string().min(1, { message: 'Branch name is required' }),
});

// ============================================================================
// Documents Section
// ============================================================================

export const pucFormat11DocumentsSchema = z.object({
  StudentSelfie: z.custom<UploadedDocument>().optional(),
  SSLCMarksCard: z.custom<UploadedDocument>().optional(),
  FeeReceipts: z.custom<UploadedDocument>().optional(),
  BankPassbook: z.custom<UploadedDocument>().optional(),
  AadhaarCard: z.custom<UploadedDocument>().optional(),
});

// ============================================================================
// Complete Form Schema
// ============================================================================

export const pucFormat11FormSchema = z.object({
  personal: pucFormat11PersonalSchema,
  contact: pucFormat11ContactSchema,
  address: pucFormat11AddressSchema,
  family: pucFormat11FamilySchema,
  academic: pucFormat11AcademicSchema,
  bank: pucFormat11BankSchema,
  documents: pucFormat11DocumentsSchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type PucFormat11PersonalFormValues = z.infer<typeof pucFormat11PersonalSchema>;
export type PucFormat11ContactFormValues = z.infer<typeof pucFormat11ContactSchema>;
export type PucFormat11AddressFormValues = z.infer<typeof pucFormat11AddressSchema>;
export type PucFormat11FamilyFormValues = z.infer<typeof pucFormat11FamilySchema>;
export type PucFormat11AcademicFormValues = z.infer<typeof pucFormat11AcademicSchema>;
export type PucFormat11BankFormValues = z.infer<typeof pucFormat11BankSchema>;
export type PucFormat11DocumentsFormValues = z.infer<typeof pucFormat11DocumentsSchema>;
export type PucFormat11FormValues = z.infer<typeof pucFormat11FormSchema>;
