import { z } from 'zod';
import { 
  personalDetailsSchema, 
  contactDetailsSchema, 
  addressDetailsSchema, 
  familyDetailsSchema,
  documentDetailsSchema 
} from './sharedSchemas';

// PUC form specific schemas
export const pucAcademicDetailsSchema = z.object({
  puPercentage: z.number().min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeType: z.enum(['Government', 'Private', 'Aided'] as const, {
    error: 'Please select a college type',
  }),
  course: z.string().min(1, { message: 'Course is required' }),
});

// Complete PUC form schema
export const pucFormSchema = z.object({
  personal: personalDetailsSchema,
  contact: contactDetailsSchema,
  address: addressDetailsSchema,
  family: familyDetailsSchema,
  academic: pucAcademicDetailsSchema,
  documents: documentDetailsSchema,
});

// Type exports
export type PucAcademicDetailsFormValues = z.infer<typeof pucAcademicDetailsSchema>;
export type PucFormValues = z.infer<typeof pucFormSchema>;
