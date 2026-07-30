/**
 * Professional Form Validation
 * Form-specific validation schemas for Professional scholarship application
 */

import { z } from 'zod';

// Professional-specific field validation
export const cetRankSchema = z
  .number()
  .positive({ message: 'Rank must be a positive number' })
  .optional();

export const neetRankSchema = z
  .number()
  .positive({ message: 'Rank must be a positive number' })
  .optional();

export const puPercentageSchema = z
  .number()
  .min(0, { message: 'Percentage must be at least 0' })
  .max(100, { message: 'Percentage cannot exceed 100' });

export const familyIncomeSchema = z
  .number()
  .positive({ message: 'Family income must be a positive number' });

export const monthlyRentSchema = z
  .number()
  .min(0, { message: 'Rent must be a non-negative number' })
  .optional();

// Complete Professional form validation composition
export const professionalFormValidation = {
  cetRank: cetRankSchema,
  neetRank: neetRankSchema,
  puPercentage: puPercentageSchema,
  familyIncome: familyIncomeSchema,
  monthlyRent: monthlyRentSchema,
};
