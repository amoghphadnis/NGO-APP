import { z } from 'zod';
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
} from './sharedSchemas';

// Professional form specific schemas
export const categoryDetailsSchema = z.object({
  scholarshipCategory: z.string().min(1, { message: 'Scholarship category is required' }),
  courseType: z.string().min(1, { message: 'Course type is required' }),
});

export const academicDetailsSchema = z.object({
  puPercentage: z.number().min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  cetNeetRank: z.number().positive({ message: 'Rank must be a positive number' }).optional(),
  course: z.string().min(1, { message: 'Course is required' }),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeType: z.enum(['Government', 'Private', 'Aided'] as const, {
    error: 'Please select a college type',
  }),
  annualCollegeFees: z.number().positive({ message: 'Fees must be a positive number' }),
});

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
  marksCard: z.any().optional(),
  aadhaar: z.any().optional(),
  incomeCert: z.any().optional(),
});

// Complete professional form schema
export const professionalFormSchema = z.object({
  personal: personalDetailsSchema,
  contact: contactDetailsSchema,
  address: addressDetailsSchema,
  family: familyDetailsSchema,
  category: categoryDetailsSchema,
  academic: academicDetailsSchema,
  bank: bankDetailsSchema,
  documents: professionalDocumentDetailsSchema,
});

// Type exports
export type CategoryDetailsFormValues = z.infer<typeof categoryDetailsSchema>;
export type AcademicDetailsFormValues = z.infer<typeof academicDetailsSchema>;
export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
export type ProfessionalDocumentDetailsFormValues = z.infer<typeof professionalDocumentDetailsSchema>;
