/**
 * Professional Form File Keys
 * Centralized file key constants for Professional form uploads
 */

export const PROFESSIONAL_FILE_KEYS = {
  MARKS_CARD: 'marksCard',
  INCOME_CERTIFICATE: 'incomeCert',
  AADHAR_CARD: 'aadhaar',
} as const;

export type ProfessionalFileKey = typeof PROFESSIONAL_FILE_KEYS[keyof typeof PROFESSIONAL_FILE_KEYS];
