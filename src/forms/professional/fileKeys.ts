/**
 * Professional Form File Keys
 * Centralized file key constants for Professional form uploads
 */

export const PROFESSIONAL_FILE_KEYS = {
  MARKS_CARD: 'PUCMarksCard',
  INCOME_CERTIFICATE: 'IncomeCertificate',
  AADHAR_CARD: 'AadharCard',
} as const;

export type ProfessionalFileKey = typeof PROFESSIONAL_FILE_KEYS[keyof typeof PROFESSIONAL_FILE_KEYS];
