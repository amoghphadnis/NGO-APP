/**
 * Base Validation Schemas
 * Minimal shared validation schemas used across both Professional and PUC forms
 * Only includes truly universal field validation
 */

import { z } from 'zod';

// Core personal information validation
export const nameSchema = z.string().min(1, { message: 'Name is required' });

export const dateOfBirthSchema = z
  .string()
  .min(1, { message: 'Date of birth is required' })
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  })
  .refine((val) => new Date(val) <= new Date(), {
    message: 'Date cannot be in the future',
  })
  .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 13;
  }, {
    message: 'You must be at least 13 years old',
  });

// Core contact information validation
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email('Enter a valid email address');

export const phoneSchema = z
  .string()
  .min(10, { message: 'Please enter a valid 10-digit number' })
  .max(10, { message: 'Please enter a valid 10-digit number' })
  .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit number');

// Core address validation primitives
export const pincodeSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\d{6}$/.test(val), {
    message: 'Pincode must be exactly 6 digits',
  });

export const addressTextSchema = z.string().optional();

// Core family validation primitives
export const familyMembersSchema = z
  .number()
  .min(1, { message: 'At least 1 family member' });

export const annualIncomeSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
    message: 'Enter a valid amount',
  });

// Core document validation primitives
export const fileRequiredSchema = z.any().refine((val) => val !== undefined && val !== null, {
  message: 'This document is required',
});

export const fileOptionalSchema = z.any().optional();

// Guidelines validation
export const guidelinesAcceptedSchema = z.boolean().refine(val => val === true, {
  message: 'You must accept the guidelines to proceed'
});

// Export base schema composition
export const baseSchemas = {
  name: nameSchema,
  dateOfBirth: dateOfBirthSchema,
  email: emailSchema,
  phone: phoneSchema,
  pincode: pincodeSchema,
  addressText: addressTextSchema,
  familyMembers: familyMembersSchema,
  annualIncome: annualIncomeSchema,
  fileRequired: fileRequiredSchema,
  fileOptional: fileOptionalSchema,
  guidelinesAccepted: guidelinesAcceptedSchema,
};
