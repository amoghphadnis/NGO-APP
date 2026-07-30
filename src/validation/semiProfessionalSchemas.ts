import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// Semi Professional Personal schema (Applicant's Information: personal + contact + address)
export const semiProfPersonalSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  studentName: z.string().min(1, { message: 'Student name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  contactNumber: z.string().min(10, { message: 'Valid 10-digit contact number required' }).max(10),
  alternateNumber: z.string().optional(),
  residentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  googleMapLink: z.string().optional(),
  areaTypeID: z.number().min(1, { message: 'Area type is required' }),
  districtID: z.number().min(1, { message: 'District is required' }),
  otherDistrict: z.string().optional(),
  genderID: z.number().min(1, { message: 'Gender is required' }),
  casteCategoryID: z.number().min(1, { message: 'Caste category is required' }),
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

// Semi Professional Family schema (Family Details: family + housing)
export const semiProfFamilySchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  fatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  motherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  familyMembers: z.number().min(1, { message: 'At least 1 family member required' }),
  houseTypeID: z.number().min(1, { message: 'House type is required' }),
  monthlyRent: z.number().optional(),
  familyIncome: z.number().positive({ message: 'Family income must be positive' }),
});

// Semi Professional Academic schema
export const semiProfAcademicSchema = z.object({
  puPercentage: z.number()
    .min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  cetRank: z.number().optional(),
  ptRank: z.number().optional(),
  courseApplying: z.string().min(1, { message: 'Course applying is required' }),
  courseStream: z.string().min(1, { message: 'Course stream is required' }),
});

// Semi Professional Document schema (9 documents, all optional)
export const semiProfDocumentSchema = z.object({
  studentSelfie: z.custom<UploadedDocument>().optional(),
  cetRankSheet: z.custom<UploadedDocument>().optional(),
  ptRankSheet: z.custom<UploadedDocument>().optional(),
  dwellingUnitPhoto: z.custom<UploadedDocument>().optional(),
  marksSheet12: z.custom<UploadedDocument>().optional(),
  houseVideo: z.custom<UploadedDocument>().optional(),
  electricityBill: z.custom<UploadedDocument>().optional(),
  incomeCertificate: z.custom<UploadedDocument>().optional(),
  rationCard: z.custom<UploadedDocument>().optional(),
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
