import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// Semi Professional Personal schema — aligned with web form Section-1
export const semiProfPersonalSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  studentName: z.string().min(1, { message: 'Student name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  contactNumber: z.string().min(10, { message: 'Valid 10-digit contact number required' }).max(10),
  alternateNumber: z.string().min(10, { message: 'Valid 10-digit alternate number required' }).max(10),
  genderID: z.number().min(1, { message: 'Gender is required' }),
  casteCategoryID: z.number({ message: 'Caste & Category is required' }).min(1, { message: 'Caste & Category is required' }),
  areaTypeID: z.number().min(1, { message: 'Place is required' }),
  districtID: z.number().min(1, { message: 'District is required' }),
  otherDistrict: z.string().optional(),
  residentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  googleMapLink: z.string().min(1, { message: 'Google Map link is required' }),
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

// Semi Professional Family schema — aligned with web form (parents names, house type, income)
export const semiProfFamilySchema = z.object({
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  fatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  motherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  familyMembers: z.number({ message: 'Total family members is required' }).min(1, { message: 'At least 1 family member required' }),
  houseTypeID: z.number().min(1, { message: 'House type is required' }),
  // Web parity: monthly rent is shown for rented houses but not required
  monthlyRent: z.number().min(0).optional(),
  familyIncome: z.number({ message: 'Total monthly family income is required' }).min(0, { message: 'Family income cannot be negative' }),
});

// Semi Professional Academic schema — aligned with web form Section-2
export const semiProfAcademicSchema = z.object({
  puPercentage: z.number({ message: 'Percentage is required' })
    .min(0, { message: 'Percentage cannot be negative' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  cetRank: z.number({ message: 'CET rank is required' }).positive({ message: 'CET rank is required' }),
  ptRank: z.number({ message: 'Agriculture/Veterinary/Horticulture (PT) rank is required' }).positive({ message: 'Agriculture/Veterinary/Horticulture (PT) rank is required' }),
  semiProfessionalCourseID: z.number({ message: 'Course is required' }).min(1, { message: 'Course applying is required' }),
  courseApplying: z.string().min(1, { message: 'Course applying is required' }),
  courseStream: z.string().min(1, { message: 'Course stream is required' }),
});

// Semi Professional Document schema (9 documents, matching web form)
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
