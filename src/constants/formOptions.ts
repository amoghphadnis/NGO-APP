/**
 * Centralized Form Options and Constants
 * Single source of truth for all dropdown options and enum values
 * Aligned with backend DTO requirements
 */

import type { Option } from '@/components/common/ModalSelectField';

// ============================================================================
// COLLEGE TYPE OPTIONS
// ============================================================================

export const COLLEGE_TYPE_OPTIONS = [
  { value: '1', label: 'Government' },
  { value: '2', label: 'Aided' },
  { value: '3', label: 'Private' },
] as const;

export type CollegeTypeID = '1' | '2' | '3';

// ============================================================================
// SCHOLARSHIP CATEGORY OPTIONS
// ============================================================================

export const SCHOLARSHIP_CATEGORY_OPTIONS = [
  { value: 'merit', label: 'Merit Based' },
  { value: 'need', label: 'Need Based' },
  { value: 'merit_cum_need', label: 'Merit Cum Need' },
] as const;

export type ScholarshipCategoryID = 'merit' | 'need' | 'merit_cum_need';

// ============================================================================
// COURSE TYPE OPTIONS
// ============================================================================

export const COURSE_TYPE_OPTIONS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'dental', label: 'Dental' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'law', label: 'Law' },
  { value: 'other', label: 'Other Professional Course' },
] as const;

export type CourseTypeID = 'engineering' | 'medical' | 'dental' | 'pharmacy' | 'nursing' | 'architecture' | 'law' | 'other';

// ============================================================================
// GENDER OPTIONS
// ============================================================================

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export type GenderID = 'male' | 'female' | 'other';

// ============================================================================
// CASTE CATEGORY OPTIONS
// ============================================================================

export const CASTE_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
] as const;

export type CasteID = 'general' | 'obc' | 'sc' | 'st' | 'ews';

// ============================================================================
// OCCUPATION OPTIONS (for father/mother)
// ============================================================================

export const OCCUPATION_OPTIONS = [
  { value: '1', label: 'Agriculture' },
  { value: '2', label: 'Business' },
  { value: '3', label: 'Government Employee' },
  { value: '4', label: 'Private Employee' },
  { value: '5', label: 'Self-Employed' },
  { value: '6', label: 'Homemaker' },
  { value: '7', label: 'Retired' },
  { value: '8', label: 'Unemployed' },
  { value: '9', label: 'Other' },
] as const;

export type OccupationID = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

// ============================================================================
// RESIDENCE TYPE OPTIONS
// ============================================================================

export const RESIDENCE_TYPE_OPTIONS = [
  { value: 'OWNED', label: 'Owned' },
  { value: 'RENTED', label: 'Rented' },
  { value: 'HOSTEL', label: 'Hostel' },
] as const;

export type ResidenceTypeID = 'OWNED' | 'RENTED' | 'HOSTEL';

// ============================================================================
// DOCUMENT TYPE OPTIONS
// ============================================================================

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'marksCard', label: 'Marks Card' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'incomeCert', label: 'Income Certificate' },
  { value: 'sslcMarksCard', label: 'SSLC Marks Card' },
  { value: 'studentPhoto', label: 'Student Photo' },
  { value: 'electricityBill', label: 'Electricity Bill' },
  { value: 'rationCard', label: 'Ration Card' },
  { value: 'familyPhoto', label: 'Family Photo' },
  { value: 'houseVideo', label: 'House Video' },
] as const;

export type DocumentTypeID = 'marksCard' | 'aadhaar' | 'incomeCert' | 'sslcMarksCard' | 'studentPhoto' | 'electricityBill' | 'rationCard' | 'familyPhoto' | 'houseVideo';

// ============================================================================
// FILE VALIDATION CONSTANTS
// ============================================================================

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  ...ALLOWED_IMAGE_MIME_TYPES,
] as const;

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export type AllowedMimeType = typeof ALLOWED_DOCUMENT_MIME_TYPES[number];

// ============================================================================
// FORM STEP CONSTANTS
// ============================================================================

export const FORM_STEPS = [
  'guidelines',
  'personal',
  'contact',
  'address',
  'family',
  'category',
  'academic',
  'bank',
  'documents',
  'review',
  'success',
] as const;

export type FormStep = typeof FORM_STEPS[number];

// ============================================================================
// REQUIRED DOCUMENTS BY FORM TYPE
// ============================================================================

export const PROFESSIONAL_REQUIRED_DOCUMENTS = [
  'marksCard',
  'aadhaar',
  'incomeCert',
] as const;

export const PUC_REQUIRED_DOCUMENTS = [
  'marksCard',
  'aadhaar',
  'incomeCert',
  'sslcMarksCard',
  'studentPhoto',
  'electricityBill',
  'rationCard',
  'familyPhoto',
  'houseVideo',
] as const;

// ============================================================================
// PUC-SPECIFIC OPTIONS
// ============================================================================

export const PUC_CASTE_OPTIONS = [
  { value: '1', label: 'GM' },
  { value: '2', label: 'OBC' },
  { value: '3', label: 'SC' },
  { value: '4', label: 'ST' },
  { value: '5', label: 'Minority' },
] as const;

export type PUCCasteID = '1' | '2' | '3' | '4' | '5';

export const PUC_HOUSE_TYPE_OPTIONS = [
  { value: '1', label: 'Own' },
  { value: '2', label: 'Rented' },
  { value: '3', label: 'Leased' },
] as const;

export type PUCHouseTypeID = '1' | '2' | '3';

export const PUC_REFERENCE_SOURCE_OPTIONS = [
  { value: '1', label: 'Volunteer' },
  { value: '2', label: 'Student' },
  { value: '3', label: 'Website' },
  { value: '4', label: 'Other' },
] as const;

export type PUCReferenceSourceID = '1' | '2' | '3' | '4';

export const PUC_COURSE_OPTIONS = [
  { value: '1', label: 'PUC I - Science' },
  { value: '2', label: 'PUC I - Commerce' },
  { value: '3', label: 'Diploma - I' },
] as const;

export type PUCCourseID = '1' | '2' | '3';

export const PUC_AREA_OPTIONS = [
  { value: '1', label: 'Urban' },
  { value: '2', label: 'Rural' },
  { value: '3', label: 'Semi Urban' },
] as const;

export type PUCAreaID = '1' | '2' | '3';

// ============================================================================
// TYPE EXPORTS FOR OPTIONS
// ============================================================================

export type CollegeTypeOption = Option<CollegeTypeID>;
export type ScholarshipCategoryOption = Option<ScholarshipCategoryID>;
export type CourseTypeOption = Option<CourseTypeID>;
export type GenderOption = Option<GenderID>;
export type CasteOption = Option<CasteID>;
export type OccupationOption = Option<OccupationID>;
export type ResidenceTypeOption = Option<ResidenceTypeID>;
export type PUCCasteOption = Option<PUCCasteID>;
export type PUCHouseTypeOption = Option<PUCHouseTypeID>;
export type PUCReferenceSourceOption = Option<PUCReferenceSourceID>;
export type PUCCourseOption = Option<PUCCourseID>;
export type PUCAreaOption = Option<PUCAreaID>;
