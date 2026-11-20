import { z } from 'zod';

// Payana-specific field validation
export const payanaGenderSchema = z.number().min(1, { message: 'Gender is required' });

export const payanaDistrictSchema = z.number().min(1, { message: 'District is required' });

export const payanaPlaceSchema = z.number().min(1, { message: 'Place is required' });

export const payanaCasteCategorySchema = z.number().min(1, { message: 'Caste category is required' });

export const payanaHouseTypeSchema = z.number().min(1, { message: 'House type is required' });

export const payanaOccupationSchema = z.number().optional();

export const payanaFamilyMembersSchema = z.number().min(1, { message: 'At least 1 family member required' });

export const payanaIncomeSchema = z.string().min(1, { message: 'Income is required' });

export const payanaParentBankSchema = z.string().min(1, { message: 'Parent bank balance is required' });

export const payanaCourseSchema = z.number().min(1, { message: 'Course is required' });

export const payanaCollegeTypeSchema = z.number().min(1, { message: 'College type is required' });

export const payanaFeesSchema = z.string().min(1, { message: 'Fees are required' });

export const payanaExpensesSchema = z.string().min(1, { message: 'Total expenses are required' });

export const payanaSecuredPercentageSchema = z.string().min(1, { message: 'Secured percentage is required' });

export const payanaBankAccountSchema = z.string().min(1, { message: 'Bank account number is required' });

export const payanaIfscSchema = z.string().min(1, { message: 'IFSC code is required' });

export const payanaBankNameSchema = z.string().min(1, { message: 'Bank name is required' });

export const payanaBranchNameSchema = z.string().min(1, { message: 'Branch name is required' });

export const payanaAccountHolderSchema = z.string().min(1, { message: 'Account holder name is required' });

export const payanaIsAgreedSchema = z.boolean().refine((val) => val === true, {
  message: 'You must agree to the terms',
});

// Payana Personal schema
export const payanaPersonalSchema = z.object({
  studentName: z.string().min(1, { message: 'Student name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  genderID: payanaGenderSchema,
  casteCategoryID: z.number().optional(),
});

// Payana Contact schema
export const payanaContactSchema = z.object({
  contactNumber: z.string().min(10, { message: 'Valid contact number required' }),
  alternateNumber: z.string().min(10, { message: 'Valid 10-digit alternate number required' }).max(10),
  email: z.string().email({ message: 'Valid email required' }),
});

// Payana Address schema with conditional OtherDistrict
export const payanaAddressSchema = z.object({
  residentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  currentAddress: z.string().min(1, { message: 'Current address is required' }),
  taluka: z.string().min(1, { message: 'Taluka is required' }),
  districtID: payanaDistrictSchema,
  otherDistrict: z.string().optional(),
  pincode: z.string().optional().refine((v) => !v || v.length === 6, { message: 'Valid 6-digit pincode required' }),
  placeID: payanaPlaceSchema,
}).refine(
  (data) => {
    if (data.districtID === 11) { // Assuming 11 is 'Other'
      return !!data.otherDistrict && data.otherDistrict.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Other district name is required when "Other" is selected',
    path: ['otherDistrict'],
  }
);

// Payana Category schema
export const payanaCategorySchema = z.object({
  casteCategoryID: payanaCasteCategorySchema,
  houseTypeID: z.number().optional(),
});

// Payana Family schema
export const payanaFamilySchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  fatherOccupationID: z.number().min(1, { message: 'Father occupation is required' }),
  motherOccupationID: z.number().min(1, { message: 'Mother occupation is required' }),
  familyMembers: payanaFamilyMembersSchema,
  familyIncome: payanaIncomeSchema,
  parentBank: payanaParentBankSchema,
});

// Payana Academic schema
export const payanaAcademicSchema = z.object({
  courseID: z.number().optional(),
  collegeName: z.string().optional(),
  collegeTypeID: z.number().optional(),
  collegeCNumber: z.string().optional(),
  courseSA: z.string().min(1, { message: 'Course specialization is required' }),
  courseStream: z.string().optional(),
  annualFees: payanaFeesSchema,
  totalExpenses: payanaExpensesSchema,
  reference: z.string().min(1, { message: 'Reference is required' }),
  studentAchievements: z.string().min(1, { message: 'Student achievements are required' }),
  securedPercentage: payanaSecuredPercentageSchema,
});

// Payana Bank schema
export const payanaBankSchema = z.object({
  accountHolderName: payanaAccountHolderSchema,
  bankAccountNo: payanaBankAccountSchema,
  ifscCode: payanaIfscSchema,
  bankName: payanaBankNameSchema,
  branchName: payanaBranchNameSchema,
});

// Payana Document schema
export const payanaDocumentSchema = z.object({
  latestMarksCard: z.any().optional(),
  studentPassbookFP: z.any().optional(),
  studentPhoto: z.any().optional(),
  dwellingUnit: z.any().optional(),
  aadhaarCard: z.any().optional(),
  houseVisitLink: z.string().min(1, { message: 'House visit link is required' }).url('Enter a valid URL'),
});

// Payana Agreement schema
export const payanaAgreementSchema = z.object({
  isAgreed: payanaIsAgreedSchema,
});

// Complete Payana form schema
export const payanaFormSchema = z.object({
  personal: payanaPersonalSchema,
  contact: payanaContactSchema,
  address: payanaAddressSchema,
  family: payanaFamilySchema,
  category: payanaCategorySchema,
  academic: payanaAcademicSchema,
  bank: payanaBankSchema,
  documents: payanaDocumentSchema,
  agreement: payanaAgreementSchema,
});

// Type exports
export type PayanaPersonalFormValues = z.infer<typeof payanaPersonalSchema>;
export type PayanaContactFormValues = z.infer<typeof payanaContactSchema>;
export type PayanaAddressFormValues = z.infer<typeof payanaAddressSchema>;
export type PayanaFamilyFormValues = z.infer<typeof payanaFamilySchema>;
export type PayanaCategoryFormValues = z.infer<typeof payanaCategorySchema>;
export type PayanaAcademicFormValues = z.infer<typeof payanaAcademicSchema>;
export type PayanaBankFormValues = z.infer<typeof payanaBankSchema>;
export type PayanaDocumentFormValues = z.infer<typeof payanaDocumentSchema>;
export type PayanaFormValues = z.infer<typeof payanaFormSchema>;
