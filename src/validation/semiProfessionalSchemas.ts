import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// Semi Professional Personal schema
export const semiProfPersonalSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  studentName: z.string().min(1, { message: 'Student name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  contactNumber: z.string().min(10, { message: 'Valid 10-digit contact number required' }).max(10),
  genderID: z.number().min(1, { message: 'Gender is required' }),
  casteCategoryID: z.number().min(1, { message: 'Caste category is required' }),
  districtID: z.number().min(1, { message: 'District is required' }),
  otherDistrict: z.string().optional(),
  taluk: z.string().min(1, { message: 'Taluk is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  placeID: z.number().min(1, { message: 'Place is required' }),
}).refine(
  (data) => {
    if (data.districtID === 11) {
      return !!data.otherDistrict && data.otherDistrict.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Other district name is required when "Other" is selected',
    path: ['otherDistrict'],
  }
);

// Semi Professional Family schema
export const semiProfFamilySchema = z.object({
  fatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  motherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  familyMembers: z.number().min(1, { message: 'At least 1 family member required' }),
  annualIncome: z.number().positive({ message: 'Annual income must be positive' }),
});

// Semi Professional Academic schema
export const semiProfAcademicSchema = z.object({
  puPercentage: z.number()
    .min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  semiProfessionalCourseID: z.number().min(1, { message: 'Course is required' }),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeTypeID: z.number().min(1, { message: 'College type is required' }),
  collegeFees: z.number().min(0, { message: 'College fees must be at least 0' }),
});

// Semi Professional Document schema (3 documents)
export const semiProfDocumentSchema = z.object({
  pucMarksCard: z.custom<UploadedDocument>().optional(),
  incomeCertificate: z.custom<UploadedDocument>().optional(),
  aadharCard: z.custom<UploadedDocument>().optional(),
});

// Complete Semi Professional form schema
export const semiProfessionalFormSchema = z.object({
  personal: semiProfPersonalSchema,
  family: semiProfFamilySchema,
  academic: semiProfAcademicSchema,
  documents: semiProfDocumentSchema,
});

// Type exports
export type SemiProfPersonalFormValues = z.infer<typeof semiProfPersonalSchema>;
export type SemiProfFamilyFormValues = z.infer<typeof semiProfFamilySchema>;
export type SemiProfAcademicFormValues = z.infer<typeof semiProfAcademicSchema>;
export type SemiProfDocumentFormValues = z.infer<typeof semiProfDocumentSchema>;
export type SemiProfessionalFormValues = z.infer<typeof semiProfessionalFormSchema>;
