/**
 * Professional Form File Keys
 * Centralized file key constants for Professional form uploads
 */

export const PROFESSIONAL_FILE_KEYS = {
  PUC_MARKS_CARD: 'PUCMarksCard',
  INCOME_CERTIFICATE: 'IncomeCertificate',
  RATION_CARD: 'Rationcard',
  ELECTRICITY_BILL: 'Electricitybill',
  COLLEGE_ID: 'CollegeID',
  ADMISSION_PROOF: 'Admissionproof',
  FEES_RECEIPTS: 'FeesReceipts',
  EXPENDITURE: 'Expenditure',
  STUDENT_PHOTO: 'Studentphoto',
  PHOTO_IN_FRONT_OF_COLLEGE: 'Photoinfrontofcollege',
  DWELLING_UNIT: 'Dwellingunit',
  CET_RANK_SHEET: 'CET',
  STUDENT_PASSBOOK: 'Studentpass',
  MONTHS_BANK_STATEMENT: 'Monthsbank',
  AADHAR_CARD: 'AadharCard',
  HANDWRITTEN_DECLARATION: 'Handwritten',
} as const;

export type ProfessionalFileKey = typeof PROFESSIONAL_FILE_KEYS[keyof typeof PROFESSIONAL_FILE_KEYS];
