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

export const PROFESSIONAL_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-quicktime',
  'video/mov',
  'video/avi',
  'video/x-msvideo',
  'video/x-m4v',
  'video/3gpp',
  'video/webm',
  'video/mkv',
  'video/x-matroska',
];

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.wmv', '.m4v'];

export const PROFESSIONAL_UPLOAD_RULES: UploadRule[] = [
  {
    key: PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE,
    label: "Student's Selfie",
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
    label: 'Dwelling Unit Photograph',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12,
    label: '12th/PUC Mark Sheet',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.REQUEST_LETTER,
    label: 'Hand Written Request Letter',
    required: false,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  {
    key: PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO,
    label: 'Short Video of the House',
    required: false,
    maxSize: 50 * 1024 * 1024,
    acceptedTypes: PROFESSIONAL_VIDEO_TYPES,
  },
  {
    key: PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Latest Electricity bill or House/Tax/site receipts / or related documents',
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
    label: 'Ration Card Copy (both sides)',
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

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  const isVideo = fileType.startsWith('video/') || VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const isTargetingVideo = key === PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO;

  // Reject videos on document/image fields
  if (!isTargetingVideo && isVideo) {
    return {
      valid: false,
      error: `${rule.label} cannot be a video. Only images (JPG, PNG) and PDF files up to 2MB are allowed.`,
    };
  }

  // Reject images/PDFs on video field
  if (isTargetingVideo && !isVideo) {
    return {
      valid: false,
      error: 'House Video must be a video file (MP4, MOV, etc.) and cannot be an image or PDF',
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

  if (isTargetingVideo) {
    const isVideoExt = VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const isVideoMime = (file.type && file.type.startsWith('video/')) || rule.acceptedTypes.includes(file.type);
    if (!isVideoMime && !isVideoExt) {
      return { valid: false, error: 'House Video must be a video file (MP4, MOV, etc.)' };
    }
  } else {
    const hasAllowedExt = ['.jpg', '.jpeg', '.png', '.pdf'].some((ext) => fileName.endsWith(ext));
    const hasAllowedMime = rule.acceptedTypes.includes(file.type);
    if (!hasAllowedExt && !hasAllowedMime) {
      return { valid: false, error: `${rule.label} must be ${rule.acceptedTypes.join(', ')}` };
    }
  }

  return { valid: true };
}
