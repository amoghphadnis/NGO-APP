import { z } from 'zod';

// New Student Registration schemas (web: /VPStudent/CreateStudent)
// Backend: POST /api/students/students/create -> New_Students table

export const newStudentPersonalSchema = z.object({
  studentName: z.string().min(1, { message: 'Student name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  genderID: z.number().min(1, { message: 'Gender is required' }),
});

export const newStudentContactSchema = z.object({
  contactNumber: z.string().min(10, { message: 'Valid 10-digit contact number required' }).max(10),
  alternateNumber: z.string().min(10, { message: 'Valid 10-digit alternate number required' }).max(10),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, {
    message: 'Enter a valid email address',
  }),
});

export const newStudentAddressSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  taluka: z.string().min(1, { message: 'Taluka is required' }),
  districtID: z.number().min(1, { message: 'District is required' }),
  otherDistrict: z.string().optional(),
  pincode: z.string().optional().refine((v) => !v || v.length === 6, {
    message: 'Valid 6-digit pincode required',
  }),
}).refine((data) => {
  if (data.districtID === 11) {
    return !!data.otherDistrict && data.otherDistrict.trim().length > 0;
  }
  return true;
}, {
  message: 'Please specify the district',
  path: ['otherDistrict'],
});

export const newStudentFamilySchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  fatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  motherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  familyIncome: z.string().min(1, { message: 'Family income is required' }),
  familyMembers: z.number({ message: 'Total family members is required' }).min(1, { message: 'At least 1 family member required' }),
});

export const newStudentCategorySchema = z.object({
  casteCategoryID: z.number().min(1, { message: 'Caste category is required' }),
  areaTypeID: z.number().min(1, { message: 'Area type is required' }),
  houseTypeID: z.number().min(1, { message: 'House type is required' }),
  monthlyRent: z.string().optional(),
  referenceSourceID: z.number().min(1, { message: 'Reference source is required' }),
  referenceSourceOther: z.string().optional(),
});

export const newStudentAcademicSchema = z.object({
  courseID: z.number().min(1, { message: 'Course is required' }),
  collegeName: z.string().min(1, { message: 'College name is required' }),
  collegeTypeID: z.number().min(1, { message: 'College type is required' }),
  expectedFees: z.string().min(1, { message: 'Expected fees are required' }),
  securedPercentage: z.string().min(1, { message: 'Secured percentage is required' }),
  totalMarks: z.string().min(1, { message: 'Total marks are required' }),
});

export const newStudentDocumentSchema = z.object({
  sslcMarksCard: z.any().optional(),
  studentPhoto: z.any().optional(),
  electricityBill: z.any().optional(),
  rationCards: z.any().optional(),
  incomeCertificate: z.any().optional(),
  familyPhoto: z.any().optional(),
  houseVideo: z.any().optional(),
  houseVisitLink: z.string().min(1, { message: 'House visit link is required' }).url('Enter a valid URL'),
});

export const newStudentFormSchema = z.object({
  personal: newStudentPersonalSchema,
  contact: newStudentContactSchema,
  address: newStudentAddressSchema,
  family: newStudentFamilySchema,
  category: newStudentCategorySchema,
  academic: newStudentAcademicSchema,
  documents: newStudentDocumentSchema,
});

export type NewStudentPersonalFormValues = z.infer<typeof newStudentPersonalSchema>;
export type NewStudentContactFormValues = z.infer<typeof newStudentContactSchema>;
export type NewStudentAddressFormValues = z.infer<typeof newStudentAddressSchema>;
export type NewStudentFamilyFormValues = z.infer<typeof newStudentFamilySchema>;
export type NewStudentCategoryFormValues = z.infer<typeof newStudentCategorySchema>;
export type NewStudentAcademicFormValues = z.infer<typeof newStudentAcademicSchema>;
export type NewStudentDocumentFormValues = z.infer<typeof newStudentDocumentSchema>;
export type NewStudentFormValues = z.infer<typeof newStudentFormSchema>;
