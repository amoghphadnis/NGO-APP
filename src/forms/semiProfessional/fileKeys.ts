/**
 * Semi Professional Form File Keys
 * Centralized file key constants for Semi Professional form uploads
 */

export const SEMI_PROFESSIONAL_FILE_KEYS = {
  PUC_MARKS_CARD: 'pucMarksCard',
  INCOME_CERTIFICATE: 'incomeCertificate',
  AADHAR_CARD: 'aadharCard',
} as const;

export type SemiProfessionalFileKey = typeof SEMI_PROFESSIONAL_FILE_KEYS[keyof typeof SEMI_PROFESSIONAL_FILE_KEYS];
