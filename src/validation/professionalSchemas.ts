import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

// Professional Personal schema (Applicant's Information: personal + contact + address)
export const professionalPersonalDetailsSchema = z.object({
  Email: z.string().min(1, { message: 'Email is required' }).email('Enter a valid email address'),
  StudentName: z.string().min(1, { message: 'Name of the student is required' }),
  DateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  ContactNumber: z.string().min(10, { message: 'Valid 10-digit WhatsApp contact number required' }).max(10),
  AlternateNumber: z.string().min(10, { message: 'Valid 10-digit alternate number required' }).max(10),
  ResidentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  GoogleMapLink: z.string().min(1, { message: 'Google Map link is required' }).url('Enter a valid URL'),
  AreaTypeID: z.number().min(1, { message: 'Place is required' }),
  DistrictID: z.number().min(1, { message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  GenderID: z.number().min(1, { message: 'Gender is required' }),
  CasteCategoryID: z.number().min(1, { message: 'Caste & Category is required' }),
}).refine(
  (data) => {
    if (data.DistrictID === 11) {
      return !!data.OtherDistrict && data.OtherDistrict.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Other district name is required when "Other" is selected',
    path: ['OtherDistrict'],
  }
);

// Professional Family schema (Family Details: family + housing)
export const professionalFamilyDetailsSchema = z.object({
  FatherName: z.string().min(1, { message: 'Father name is required' }),
  MotherName: z.string().min(1, { message: 'Mother name is required' }),
  FatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  MotherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  FamilyMembers: z.number({ message: 'Total family members is required' }).min(1, { message: 'At least 1 family member required' }),
  HouseTypeID: z.number().min(1, { message: 'House type is required' }),
  MonthlyRent: z.number().optional(),
  FamilyIncome: z.number().min(0, { message: 'Family income is required' }),
});

// Professional Academic schema
export const academicDetailsSchema = z.object({
  PUPercentage: z.number({ message: 'PU/12th percentage is required' })
    .min(1, { message: 'Percentage must be greater than 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  CETRank: z.number().optional(),
  NEETRank: z.number().optional(),
  CourseApplying: z.string().min(1, { message: 'Course applying is required' }),
  CourseStream: z.string().min(1, { message: 'Course stream is required' }),
});

// Professional Document schema (9 documents, all optional)
export const professionalDocumentDetailsSchema = z.object({
  StudentSelfie: z.custom<UploadedDocument>().optional(),
  CETNEETRankSheet: z.custom<UploadedDocument>().optional(),
  DwellingUnitPhoto: z.custom<UploadedDocument>().optional(),
  MarksSheet12: z.custom<UploadedDocument>().optional(),
  RequestLetter: z.custom<UploadedDocument>().optional(),
  HouseVideo: z.custom<UploadedDocument>().optional(),
  ElectricityBill: z.custom<UploadedDocument>().optional(),
  IncomeCertificate: z.custom<UploadedDocument>().optional(),
  RationCard: z.custom<UploadedDocument>().optional(),
});

// Complete professional form schema
export const professionalFormSchema = z.object({
  personal: professionalPersonalDetailsSchema,
  family: professionalFamilyDetailsSchema,
  academic: academicDetailsSchema,
  documents: professionalDocumentDetailsSchema,
});

// Type exports
export type AcademicDetailsFormValues = z.infer<typeof academicDetailsSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
export type ProfessionalDocumentDetailsFormValues = z.infer<typeof professionalDocumentDetailsSchema>;
export type ProfessionalPersonalDetailsFormValues = z.infer<typeof professionalPersonalDetailsSchema>;
export type ProfessionalFamilyDetailsFormValues = z.infer<typeof professionalFamilyDetailsSchema>;
