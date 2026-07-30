/**
 * Professional Form File Keys
 * Centralized file key constants for Professional form uploads
 */

export const PROFESSIONAL_FILE_KEYS = {
  STUDENT_SELFIE: 'StudentSelfie',
  CET_NEET_RANK_SHEET: 'CETNEETRankSheet',
  DWELLING_UNIT_PHOTO: 'DwellingUnitPhoto',
  MARKS_SHEET_12: 'MarksSheet12',
  REQUEST_LETTER: 'RequestLetter',
  HOUSE_VIDEO: 'HouseVideo',
  ELECTRICITY_BILL: 'ElectricityBill',
  INCOME_CERTIFICATE: 'IncomeCertificate',
  RATION_CARD: 'RationCard',
} as const;

export type ProfessionalFileKey = typeof PROFESSIONAL_FILE_KEYS[keyof typeof PROFESSIONAL_FILE_KEYS];
