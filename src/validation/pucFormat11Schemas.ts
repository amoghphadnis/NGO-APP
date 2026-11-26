/**
 * PUC Format 1.1 — Zod Validation Schemas
 *
 * Mirrors the POST /api/VP_Format1_1PUC multipart contract exactly.
 * Section-based composition matches the form engine's step architecture.
 */

import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// ============================================================================
// Personal Section (Personal + Contact + Address)
// ============================================================================

export const pucFormat11PersonalSchema = z.object({
  StudentName: z.string().min(1, { message: 'Student name is required' }),
  DateOfBirth: z
    .string()
    .min(1, { message: 'Date of birth is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Date cannot be in the future',
    }),
  Gender: z.number().min(1, { message: 'Gender is required' }),
  ContactNumber: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .max(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit WhatsApp number'),
  AlternateNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'Please enter a valid 10-digit alternate number',
    }),
  Email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Enter a valid email address',
    }),
  ResidentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  Place: z.number().min(1, { message: 'Area is required' }),
  District: z.number().min(1, { message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  Taluk: z.string().min(1, { message: 'Taluka is required' }),
  PinCode: z.string().optional(),
  Caste: z.number().optional(),
});

// ============================================================================
// Contact Section
// ============================================================================

export const pucFormat11ContactSchema = z.object({
  Email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Enter a valid email address',
    }),
  ContactNumber: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .max(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit WhatsApp number'),
  AlternateNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'Please enter a valid 10-digit alternate number',
    }),
});

// ============================================================================
// Address Section
// ============================================================================

export const pucFormat11AddressSchema = z.object({
  District: z.number().min(1, { message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  Taluk: z.string().min(1, { message: 'Taluka is required' }),
  ResidentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  PinCode: z.string().optional(),
});

// ============================================================================
// Family Section (Parents + Occupations + Family Members + Housing + Reference)
// ============================================================================

export const pucFormat11FamilySchema = z.object({
  FatherName: z.string().min(1, { message: 'Father name is required' }),
  MotherName: z.string().min(1, { message: 'Mother name is required' }),
  FatherOccupation: z.number().min(1, { message: "Father/Guardian occupation is required" }),
  MotherOccupation: z.number().min(1, { message: "Mother/Guardian occupation is required" }),
  TotalFamilyMembers: z.number({ message: 'Total family members is required' }).min(1, { message: 'At least 1 family member required' }),
  FamilyAnnualIncome: z
    .number({ message: 'Family income is required' })
    .positive({ message: 'Family income must be greater than 0' }),
  CasteCategoryID: z.number().optional(),
  HouseTypeID: z.number().min(1, { message: 'House type is required' }),
  MonthlyRent: z.number().optional(),
  ReferenceSourceID: z.number().min(1, { message: 'Reference source is required' }),
});

// ============================================================================
// Academic Section
// ============================================================================

export const pucFormat11AcademicSchema = z.object({
  SSLCPercentage: z
    .number({ message: 'SSLC Percentage is required' })
    .min(1, { message: 'Percentage must be greater than 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  SSLCTotalMarks: z.number().optional(),
  CourseJoined: z.number().min(1, { message: 'Course is required' }),
  CollegeName: z.string().min(1, { message: 'College name is required' }),
  CollegeType: z.number().min(1, { message: 'College type is required' }),
  CollegeFees: z.number().min(0, { message: 'Expected fees must be at least 0' }),
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
  ElectricityBill: z.custom<UploadedDocument>().optional(),
  RationCard: z.custom<UploadedDocument>().optional(),
  DwellingUnitPhoto: z.custom<UploadedDocument>().optional(),
  HouseVideo: z.custom<UploadedDocument>().optional(),
  IncomeCertificate: z.custom<UploadedDocument>().optional(),
  GoogleMapLink: z.string().optional(),
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
  bank: pucFormat11BankSchema.optional(),
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
