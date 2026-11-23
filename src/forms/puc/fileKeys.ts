/**
 * PUC Form File Keys
 * Centralized file key constants for PUC form uploads
 */

export const PUC_FILE_KEYS = {
  SSLC_MARKS_CARD: 'SSLCMarksCard',
  STUDENT_PHOTO: 'StudentPhoto',
  ELECTRICITY_BILL: 'ElectricityBill',
  RATION_CARD: 'RationCards',
  INCOME_CERTIFICATE: 'IncomeCertificate',
  FAMILY_PHOTO: 'FamilyPhoto',
  HOUSE_VIDEO: 'HouseVideo',
} as const;

export type PUCFileKey = typeof PUC_FILE_KEYS[keyof typeof PUC_FILE_KEYS];

// ---------------------------------------------------------------------------
// PUC Format 1.1 contract file keys (POST /api/VP_Format1_1PUC)
// All five documents are mandatory; accepted: PDF, JPG, JPEG, PNG
// ---------------------------------------------------------------------------

export const PUC_FORMAT11_FILE_KEYS = {
  STUDENT_SELFIE: 'StudentSelfie',
  SSLC_MARKS_CARD: 'SSLCMarksCard',
  // Additional documents required for web/mobile parity (house-visit
  // verification). Backend field names match the professional contract.
  ELECTRICITY_BILL: 'ElectricityBill',
  RATION_CARD: 'RationCard',
  DWELLING_UNIT_PHOTO: 'DwellingUnitPhoto',
  HOUSE_VIDEO: 'HouseVideo',
  INCOME_CERTIFICATE: 'IncomeCertificate',
} as const;

export type PucFormat11FileKey =
  typeof PUC_FORMAT11_FILE_KEYS[keyof typeof PUC_FORMAT11_FILE_KEYS];
