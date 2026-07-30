/**
 * Professional Form Upload Configuration
 * Defines upload rules and validation for Professional form documents
 */

import { PROFESSIONAL_FILE_KEYS } from './fileKeys';

export interface UploadRule {
  key: string;
  label: string;
  required: boolean;
  maxSize: number; // bytes
  acceptedTypes: string[];
}

export const PROFESSIONAL_UPLOAD_RULES: UploadRule[] = [
  {
    key: PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE,
    label: 'Student Selfie/Photograph',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.CET_NEET_RANK_SHEET,
    label: 'CET/NEET Rank Sheet',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.DWELLING_UNIT_PHOTO,
    label: 'Dwelling Unit Photo',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12,
    label: '12th Marks Sheet',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.REQUEST_LETTER,
    label: 'Request Letter',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO,
    label: 'House Video',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Electricity Bill',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.RATION_CARD,
    label: 'Ration Card',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
];

export function getUploadRule(key: string): UploadRule | undefined {
  return PROFESSIONAL_UPLOAD_RULES.find((rule) => rule.key === key);
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
