/**
 * Semi Professional Form Upload Configuration
 * Defines upload rules and validation for Semi Professional form documents
 */

import { SEMI_PROFESSIONAL_FILE_KEYS } from './fileKeys';

export interface UploadRule {
  key: string;
  label: string;
  required: boolean;
  maxSize: number; // bytes
  acceptedTypes: string[];
}

export const SEMI_PROFESSIONAL_UPLOAD_RULES: UploadRule[] = [
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD,
    label: 'PU Marks Card',
    required: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD,
    label: 'Aadhaar Card',
    required: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
];

export function getSemiProfUploadRule(key: string): UploadRule | undefined {
  return SEMI_PROFESSIONAL_UPLOAD_RULES.find((rule) => rule.key === key);
}

export function validateSemiProfUpload(file: any, key: string): { valid: boolean; error?: string } {
  const rule = getSemiProfUploadRule(key);
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
