/**
 * PUC Form Upload Configuration
 * Defines upload rules and validation for PUC form documents
 */

import { PUC_FILE_KEYS, PUC_FORMAT11_FILE_KEYS } from './fileKeys';

export interface UploadRule {
  key: string;
  label: string;
  required: boolean;
  maxSize: number; // bytes
  acceptedTypes: string[];
}

export const PUC_UPLOAD_RULES: UploadRule[] = [
  {
    key: PUC_FILE_KEYS.SSLC_MARKS_CARD,
    label: 'SSLC Marks Card',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FILE_KEYS.STUDENT_PHOTO,
    label: 'Student Photo',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  {
    key: PUC_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Electricity Bill',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FILE_KEYS.RATION_CARD,
    label: 'Ration Card',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FILE_KEYS.FAMILY_PHOTO,
    label: 'Family Photo',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  {
    key: PUC_FILE_KEYS.HOUSE_VIDEO,
    label: 'House Video',
    required: false,
    maxSize: 10 * 1024 * 1024, // 10MB for video
    acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  },
];

// ---------------------------------------------------------------------------
// PUC Format 1.1 contract upload rules (5 mandatory documents)
// Accepted: PDF, JPG, JPEG, PNG
// ---------------------------------------------------------------------------

export const PUC_FORMAT11_UPLOAD_RULES: UploadRule[] = [
  {
    key: PUC_FORMAT11_FILE_KEYS.STUDENT_SELFIE,
    label: 'Student Selfie',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.SSLC_MARKS_CARD,
    label: 'SSLC Marks Card',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.FEE_RECEIPTS,
    label: 'Fee Receipts',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.BANK_PASSBOOK,
    label: 'Bank Passbook',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.AADHAAR_CARD,
    label: 'Aadhaar Card',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
];

export function getUploadRule(key: string): UploadRule | undefined {
  return PUC_UPLOAD_RULES.find((rule) => rule.key === key);
}

export function validateUpload(file: any, key: string): { valid: boolean; error?: string } {
  const rule = getUploadRule(key);
  if (!rule) {
    return { valid: false, error: 'Unknown upload type' };
  }

  if (!file) {
    return rule.required ? { valid: false, error: `${rule.label} is required` } : { valid: true };
  }

  if (file.size > rule.maxSize) {
    return { valid: false, error: `${rule.label} must be less than ${rule.maxSize / (1024 * 1024)}MB` };
  }

  if (!rule.acceptedTypes.includes(file.type)) {
    return { valid: false, error: `${rule.label} must be ${rule.acceptedTypes.join(', ')}` };
  }

  return { valid: true };
}
