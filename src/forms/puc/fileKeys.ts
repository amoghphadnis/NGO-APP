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
