import { z } from 'zod';
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
} from './sharedSchemas';
import { UploadedDocument } from '@/types/documents';

// PUC Category & Housing schema
export const pucCategoryHousingSchema = z.object({
  caste: z.string().min(1, { message: 'Caste is required' }),
  houseType: z.string().min(1, { message: 'House type is required' }),
  monthlyRent: z.string().optional(),
  referenceSource: z.string().min(1, { message: 'Reference source is required' }),
  referenceSourceOther: z.string().optional(),
});

// PUC Family schema (extends shared with additional fields)
export const pucFamilyDetailsSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  fatherOccupationID: z.number().optional(),
  motherOccupationID: z.number().optional(),
  familyMembers: z.number().min(1, { message: 'At least 1 family member' }),
  familyComposition: z.array(z.string()).optional(),
  annualIncome: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
      message: 'Enter a valid amount',
    }),
  monthlyRent: z.string().optional(),
  residenceType: z.enum(['OWNED', 'RENTED', 'HOSTEL']).optional(),
});

// PUC Academic schema with new fields
export const pucAcademicDetailsSchema = z.object({
  course: z.string().min(1, { message: 'Course is required' }),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeType: z.string().min(1, { message: 'College type is required' }),
  expectedFees: z.number().min(0, { message: 'Fees must be at least 0' }),
  percentage: z.number().min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  totalMarks: z.number().min(0, { message: 'Total marks must be at least 0' }),
});

// PUC Document schema with house visit link
export const pucDocumentDetailsSchema = z.object({
  sslcMarksCard: z.custom<UploadedDocument>().optional(),
  studentPhoto: z.custom<UploadedDocument>().optional(),
  electricityBill: z.custom<UploadedDocument>().optional(),
  rationCard: z.custom<UploadedDocument>().optional(),
  incomeCert: z.custom<UploadedDocument>().optional(),
  familyPhoto: z.custom<UploadedDocument>().optional(),
  houseVideo: z.custom<UploadedDocument>().optional(),
  houseVisitLink: z.string().optional().refine((val) => !val || /^https?:\/\//.test(val), {
    message: 'Please enter a valid URL',
  }),
});

// Complete PUC form schema
export const pucFormSchema = z.object({
  personal: personalDetailsSchema,
  contact: contactDetailsSchema,
  address: addressDetailsSchema,
  family: pucFamilyDetailsSchema,
  category: pucCategoryHousingSchema,
  academic: pucAcademicDetailsSchema,
  documents: pucDocumentDetailsSchema,
});

// Type exports
export type PucCategoryHousingFormValues = z.infer<typeof pucCategoryHousingSchema>;
export type PucFamilyDetailsFormValues = z.infer<typeof pucFamilyDetailsSchema>;
export type PucAcademicDetailsFormValues = z.infer<typeof pucAcademicDetailsSchema>;
export type PucFormValues = z.infer<typeof pucFormSchema>;
export type PUCDocumentDetailsFormValues = z.infer<typeof pucDocumentDetailsSchema>;
