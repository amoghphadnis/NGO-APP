/**
 * PUC Form Validation
 * Form-specific validation schemas for PUC scholarship application
 */

import { z } from 'zod';

// PUC-specific field validation
export const sslcMarksSchema = z
  .number()
  .min(0, { message: 'Percentage must be at least 0' })
  .max(100, { message: 'Percentage cannot exceed 100' });

export const securedPercentageSchema = z
  .number()
  .min(0, { message: 'Percentage must be at least 0' })
  .max(100, { message: 'Percentage cannot exceed 100' });

export const expectedFeesSchema = z
  .number()
  .positive({ message: 'Fees must be a positive number' });

export const monthlyRentSchema = z
  .number()
  .positive({ message: 'Rent must be a positive number' })
  .optional();

export const houseVisitLinkSchema = z
  .string()
  .url({ message: 'Please enter a valid URL' })
  .optional();

export const residenceTypeSchema = z.enum(['OWNED', 'RENTED', 'HOSTEL'] as const, {
  message: 'Please select residence type',
});

// Conditional validation for OtherDistrict
export const addressWithOtherDistrictSchema = z
  .object({
    district: z.string().min(1, { message: 'District is required' }),
    otherDistrict: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.district === 'OTHER') {
        return !!data.otherDistrict && data.otherDistrict.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Other district name is required when "Other" is selected',
      path: ['otherDistrict'],
    }
  );

// Conditional validation for MonthlyRent (only required for RENTED)
export const familyWithRentSchema = z
  .object({
    residenceType: z.enum(['OWNED', 'RENTED', 'HOSTEL'] as const),
    monthlyRent: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.residenceType === 'RENTED') {
        return data.monthlyRent !== undefined && data.monthlyRent > 0;
      }
      return true;
    },
    {
      message: 'Monthly rent is required for rented accommodation',
      path: ['monthlyRent'],
    }
  );

// Conditional validation for HouseVisitLink (only required in approval workflow)
export const houseVisitLinkConditionalSchema = z
  .object({
    status: z.string().optional(),
    houseVisitLink: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'HOUSE_VISIT_PENDING') {
        return !!data.houseVisitLink && data.houseVisitLink.trim().length > 0;
      }
      return true;
    },
    {
      message: 'House visit link is required for pending house visits',
      path: ['houseVisitLink'],
    }
  );

// Complete PUC form validation composition
export const pucFormValidation = {
  sslcMarks: sslcMarksSchema,
  securedPercentage: securedPercentageSchema,
  expectedFees: expectedFeesSchema,
  monthlyRent: monthlyRentSchema,
  houseVisitLink: houseVisitLinkSchema,
  residenceType: residenceTypeSchema,
  addressWithOtherDistrict: addressWithOtherDistrictSchema,
  familyWithRent: familyWithRentSchema,
  houseVisitLinkConditional: houseVisitLinkConditionalSchema,
};
