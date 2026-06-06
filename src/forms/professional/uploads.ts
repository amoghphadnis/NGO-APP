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
    key: PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD,
    label: 'PUC Marks Card',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.RATION_CARD,
    label: 'Ration Card (Both Sides)',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Electricity Bill',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.COLLEGE_ID,
    label: 'College ID',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.ADMISSION_PROOF,
    label: 'Admission Proof/Form',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.FEES_RECEIPTS,
    label: 'Fees Receipts',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.EXPENDITURE,
    label: 'Expenditure Certificate from College',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.STUDENT_PHOTO,
    label: 'Student Photo',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.PHOTO_IN_FRONT_OF_COLLEGE,
    label: 'Photo in Front of College',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.DWELLING_UNIT,
    label: 'Dwelling Unit Photo/Family Photo in Front of House',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET,
    label: 'CET Rank/NEET Rank Sheet',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.STUDENT_PASSBOOK,
    label: 'Student Passbook First Page Photo',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.MONTHS_BANK_STATEMENT,
    label: '6 Months Bank Statement of Earning Member',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.AADHAR_CARD,
    label: 'Aadhar Card (Both Sides)',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.HANDWRITTEN_DECLARATION,
    label: 'Handwritten Self Declaration Letter',
    required: true,
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
