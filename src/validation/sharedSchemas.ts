import { z } from 'zod';

// Shared schemas used across both Professional and PUC forms
export const personalDetailsSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  dateOfBirth: z
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
    }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  caste: z.string().min(1, { message: 'Please select your caste' }),
});

export const contactDetailsSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('Enter a valid email address'),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit number' })
    .max(10, { message: 'Please enter a valid 10-digit number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit number'),
});

export const addressDetailsSchema = z.object({
  pincode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: 'Pincode must be exactly 6 digits',
    }),
  district: z.string().optional(),
  otherDistrict: z.string().optional(),
  taluk: z.string().optional(),
  place: z.string().optional(),
  address: z.string().optional(),
});

export const familyDetailsSchema = z.object({
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  familyMembers: z.number().min(1, { message: 'At least 1 family member' }),
  familyComposition: z.array(z.string()).optional(),
  annualIncome: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
      message: 'Enter a valid amount',
    }),
  monthlyRent: z.string().optional(),
  residenceType: z.enum(['OWNED', 'RENTED', 'HOSTEL']).optional(),
});

export const guidelinesSchema = z.object({
  guidelinesAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the guidelines to proceed'
  })
});

// Type exports
export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>;
export type AddressDetailsFormValues = z.infer<typeof addressDetailsSchema>;
export type FamilyDetailsFormValues = z.infer<typeof familyDetailsSchema>;
export type GuidelinesFormValues = z.infer<typeof guidelinesSchema>;
