/**
 * Semi Professional Form File Keys
 * Centralized file key constants for Semi Professional form uploads
 * Aligned with the web form's 9 mandatory documents
 */

export const SEMI_PROFESSIONAL_FILE_KEYS = {
  STUDENT_SELFIE: 'studentSelfie',
  CET_RANK_SHEET: 'cetRankSheet',
  PT_RANK_SHEET: 'ptRankSheet',
  DWELLING_UNIT_PHOTO: 'dwellingUnitPhoto',
  MARKS_SHEET_12: 'marksSheet12',
  HOUSE_VIDEO: 'houseVideo',
  ELECTRICITY_BILL: 'electricityBill',
  INCOME_CERTIFICATE: 'incomeCertificate',
  RATION_CARD: 'rationCard',
} as const;

export type SemiProfessionalFileKey = typeof SEMI_PROFESSIONAL_FILE_KEYS[keyof typeof SEMI_PROFESSIONAL_FILE_KEYS];
