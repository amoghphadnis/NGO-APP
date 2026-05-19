/**
 * Professional Form Validation
 * Form-specific validation schemas for Professional scholarship application
 */

import { z } from 'zod';

// Professional-specific field validation
export const cetNeetRankSchema = z
  .number()
  .positive({ message: 'Rank must be a positive number' })
  .optional();

export const puPercentageSchema = z
  .number()
  .min(0, { message: 'Percentage must be at least 0' })
  .max(100, { message: 'Percentage cannot exceed 100' });

export const collegeFeesSchema = z
  .number()
  .positive({ message: 'Fees must be a positive number' });

export const courseTypeSchema = z.enum(['Government', 'Private', 'Aided'] as const, {
  message: 'Please select a college type',
});

export const scholarshipCategorySchema = z.string().min(1, {
  message: 'Scholarship category is required',
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

// Complete Professional form validation composition
export const professionalFormValidation = {
  cetNeetRank: cetNeetRankSchema,
  puPercentage: puPercentageSchema,
  collegeFees: collegeFeesSchema,
  courseType: courseTypeSchema,
  scholarshipCategory: scholarshipCategorySchema,
  addressWithOtherDistrict: addressWithOtherDistrictSchema,
};
