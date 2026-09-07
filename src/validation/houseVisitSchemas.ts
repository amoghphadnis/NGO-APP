/**
 * Zod Validation Schemas for House Visit Form
 * Sections A-L
 */

import { z } from 'zod';

// ============================================================================
// Section A: Basic Details
// ============================================================================

export const basicDetailsSchema = z.object({
  studentID: z.number(),
  source: z.enum(['PUC', 'Professional', 'Payana', 'SemiProfessional']),
  studentName: z.string().min(1, 'Student name is required'),
  courseInstitution: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  visitDate: z.string().min(1, 'Visit date is required'),
  fieldSupervisorName: z.string().optional(),
  personsInteracted: z.string().optional(),
});

export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

// ============================================================================
// Section B: Housing & Living Conditions
// ============================================================================

export const housingConditionsSchema = z.object({
  houseType: z.array(z.enum(['Kutcha', 'Semi-Pucca', 'Pucca'])).default([]),
  ownership: z.array(z.enum(['Own', 'Rented', "Relative's", 'Government Housing'])).default([]),
  rooms: z.array(z.enum(['1', '2', 'More than 3'])).default([]),
  floor: z.array(z.enum(['Ground', '1', '2', '3+'])).default([]),
});

export type HousingConditionsFormValues = z.infer<typeof housingConditionsSchema>;

// ============================================================================
// Social Data
// ============================================================================

export const socialDataSchema = z.object({
  rationCardType: z.enum(['BPL', 'PHH', 'NPHH', 'APL', '']).default(''),
  digitalAccess: z.enum(['Smartphone', 'Keypad', 'iPhone', 'Laptop / Tablet', '']).default(''),
  livingCondition: z.array(z.enum(['Poor', 'Average', 'Satisfactory'])).default([]),
  latestElecBill: z.string().optional(),
  elecUnitsCons: z.string().optional(),
  internetBillCharges: z.string().optional(),
  remarkGeneralLivingCondition: z.string().optional(),
});

export type SocialDataFormValues = z.infer<typeof socialDataSchema>;

// ============================================================================
// Section C: Family Composition
// ============================================================================

export const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  age: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.string().optional(),
});

export const familyCompositionSchema = z.object({
  members: z.array(familyMemberSchema).default([]),
  totalFamilyMembers: z.string().optional(),
});

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;
export type FamilyCompositionFormValues = z.infer<typeof familyCompositionSchema>;

// ============================================================================
// Section D: Income Stability
// ============================================================================

export const incomeStabilitySchema = z.object({
  primaryIncomeSource: z.array(z.enum(['Daily Wage', 'Agriculture', 'Private Job', 'Self-Employed', 'Pension'])).default([]),
  natureOfIncome: z.array(z.enum(['Regular', 'Irregular', 'Seasonal'])).default([]),
  primaryEarningPerson: z.string().optional(),
  averageIncome: z.string().optional(),
  incomeShocks: z.array(z.enum(['Job Loss', 'Crop Failure', 'Health Emergency'])).default([]),
});

export type IncomeStabilityFormValues = z.infer<typeof incomeStabilitySchema>;

// ============================================================================
// Section E: Land Holdings
// ============================================================================

export const landHoldingsSchema = z.object({
  agriculturalLand: z.array(z.enum(['Dry Land', 'Irrigated Land', 'Farm'])).default([]),
  waterSource: z.array(z.enum(['Rainwater', 'Borewell', 'Canal', 'Other'])).default([]),
  cropPattern: z.array(z.enum(['Rabi', 'Kharif', 'Summer'])).default([]),
  otherLandHoldings: z.string().optional(),
});

export type LandHoldingsFormValues = z.infer<typeof landHoldingsSchema>;

// ============================================================================
// Section F: Educational Expenses
// ============================================================================

export const educationalExpensesSchema = z.object({
  totalChildrenStudying: z.string().optional(),
  annualEducationExpense: z.string().optional(),
  scholarshipSupport: z.enum(['Yes', 'No', '']).default(''),
  governmentSchemes: z.string().optional(),
});

export type EducationalExpensesFormValues = z.infer<typeof educationalExpensesSchema>;

// ============================================================================
// Section G: Debt & Financial
// ============================================================================

export const debtFinancialSchema = z.object({
  educationalLoanAmount: z.string().optional(),
  outstandingLoans: z.array(z.enum(['Bank', 'SHG', 'Private', 'Moneylender'])).default([]),
  outstandingLoanAmount: z.string().optional(),
  monthlyEMI: z.string().optional(),
});

export type DebtFinancialFormValues = z.infer<typeof debtFinancialSchema>;

// ============================================================================
// Section H: Health Vulnerability
// ============================================================================

export const healthVulnerabilitySchema = z.object({
  vulnerabilityType: z.enum(['Chronic Illness', 'Disability', 'Single Parent Household', 'Orphan / Guardian-led Family', 'Elderly Dependents', '']).default(''),
  remarks: z.string().optional(),
});

export type HealthVulnerabilityFormValues = z.infer<typeof healthVulnerabilitySchema>;

// ============================================================================
// Section I: Assets
// ============================================================================

export const assetsSchema = z.object({
  assets: z.array(z.enum(['Tractor', 'Car', 'Livestock', 'Two-wheeler', 'Other'])).default([]),
});

export type AssetsFormValues = z.infer<typeof assetsSchema>;

// ============================================================================
// Section J: Student Development
// ============================================================================

export const studentDevelopmentSchema = z.object({
  extracurricular: z.array(z.enum(['Sports', 'NSS', 'NMMS Exam', 'Dance', 'Debate', 'Music', 'Other', 'No Participation'])).default([]),
  studentAspiration: z.string().optional(),
  consentParticipation: z.enum(['Yes', 'No', '']).default(''),
  remarks: z.string().optional(),
});

export type StudentDevelopmentFormValues = z.infer<typeof studentDevelopmentSchema>;

// ============================================================================
// Section K: Supervisor Assessment
// ============================================================================

export const supervisorAssessmentSchema = z.object({
  householdVulnerabilityLevel: z.array(z.enum(['High', 'Moderate', 'Low'])).default([]),
  studentMotivation: z.enum(['High', 'Average', 'Needs Support', '']).default(''),
  recommendation: z.array(z.enum(['Strongly Recommended', 'Recommended', 'Not Recommended'])).default([]),
  justification: z.string().optional(),
});

export type SupervisorAssessmentFormValues = z.infer<typeof supervisorAssessmentSchema>;

// ============================================================================
// Section L: Declaration
// ============================================================================

export const declarationSchema = z.object({
  confirmation: z.string().min(1, 'Confirmation is required'),
  date: z.string().min(1, 'Date is required'),
  uploadedFiles: z.array(z.instanceof(File)).optional(),
});

export type DeclarationFormValues = z.infer<typeof declarationSchema>;

// ============================================================================
// Complete Form Schema
// ============================================================================

export const houseVisitFormSchema = z.object({
  basicDetails: basicDetailsSchema,
  housingConditions: housingConditionsSchema,
  socialData: socialDataSchema,
  familyComposition: familyCompositionSchema,
  incomeStability: incomeStabilitySchema,
  landHoldings: landHoldingsSchema,
  educationalExpenses: educationalExpensesSchema,
  debtFinancial: debtFinancialSchema,
  healthVulnerability: healthVulnerabilitySchema,
  assets: assetsSchema,
  studentDevelopment: studentDevelopmentSchema,
  supervisorAssessment: supervisorAssessmentSchema,
  declaration: declarationSchema,
});

export type HouseVisitFormValues = z.infer<typeof houseVisitFormSchema>;
