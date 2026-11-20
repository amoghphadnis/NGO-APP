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
    maxSize: 50 * 1024 * 1024, // 50MB for video
    acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/webm', 'video/3gpp', 'video/mkv'],
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
  {
    key: PUC_FORMAT11_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Electricity Bill',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.RATION_CARD,
    label: 'Ration Card',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.DWELLING_UNIT_PHOTO,
    label: 'Dwelling Unit Photo',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.HOUSE_VIDEO,
    label: 'House Video',
    required: true,
    maxSize: 50 * 1024 * 1024, // 50MB for video
    acceptedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/webm', 'video/3gpp', 'video/mkv'],
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
];

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.wmv', '.m4v'];
const DOCUMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

export function getUploadRule(key: string): UploadRule | undefined {
  return (
    PUC_FORMAT11_UPLOAD_RULES.find((rule) => rule.key === key) ||
    PUC_UPLOAD_RULES.find((rule) => rule.key === key)
  );
}

export function validateUpload(file: any, key: string): { valid: boolean; error?: string } {
  const rule = getUploadRule(key);
  if (!rule) {
    return { valid: false, error: 'Unknown upload type' };
  }

  if (!file) {
    return rule.required ? { valid: false, error: `${rule.label} is required` } : { valid: true };
  }

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  const isVideo = fileType.startsWith('video/') || VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const isTargetingVideo = key === PUC_FILE_KEYS.HOUSE_VIDEO;

  // If this is a document/image field but a video was selected, reject it immediately
  if (!isTargetingVideo && isVideo) {
    return {
      valid: false,
      error: `${rule.label} cannot be a video. Only images (JPG, PNG) and PDF files up to 2MB are allowed.`,
    };
  }

  // If this is a video field but an image/PDF was selected, reject it
  if (isTargetingVideo && !isVideo) {
    return {
      valid: false,
      error: `${rule.label} must be a video file (MP4, MOV, etc.) and cannot be an image or PDF.`,
    };
  }

  // Check file size
  if (file.size > rule.maxSize) {
    const limitMB = Math.round(rule.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `${rule.label} exceeds ${limitMB}MB limit (file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum allowed is ${limitMB}MB.`,
    };
  }

  // For non-video files, verify extension or MIME type
  if (!isTargetingVideo) {
    const hasAllowedExt = DOCUMENT_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasAllowedMime = rule.acceptedTypes.includes(file.type);
    if (!hasAllowedExt && !hasAllowedMime) {
      return { valid: false, error: `${rule.label} must be a JPG, PNG, or PDF file` };
    }
  }

  return { valid: true };
}
