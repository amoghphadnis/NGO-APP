/**
 * Semi Professional Form Upload Configuration
 * Defines upload rules and validation for Semi Professional form documents
 * Aligned with the web form: images/photos for documents, video files for House Video
 */

import { SEMI_PROFESSIONAL_FILE_KEYS } from './fileKeys';

export interface UploadRule {
  key: string;
  label: string;
  required: boolean;
  maxSize: number; // bytes
  acceptedTypes: string[];
}

const IMAGE_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/mov', 'video/quicktime', 'video/x-m4v', 'video/3gpp', 'video/webm'];

export const SEMI_PROFESSIONAL_UPLOAD_RULES: UploadRule[] = [
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE,
    label: "Student's Selfie",
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET,
    label: 'CET Rank Sheet',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.PT_RANK_SHEET,
    label: 'Agriculture/Veterinary/Horticulture (PT Rank)',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.DWELLING_UNIT_PHOTO,
    label: 'Dwelling Unit Photograph',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12,
    label: 'PUC II / 12th Marks Sheet',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO,
    label: 'Short Video of the House',
    required: true,
    maxSize: 50 * 1024 * 1024,
    acceptedTypes: VIDEO_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL,
    label: 'Latest Electricity Bill / Bhagyajyothi Document',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE,
    label: 'Income Certificate',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
  {
    key: SEMI_PROFESSIONAL_FILE_KEYS.RATION_CARD,
    label: 'Ration Card Copy (Both Sides)',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: IMAGE_DOC_TYPES,
  },
];

export function getSemiProfUploadRule(key: string): UploadRule | undefined {
  return SEMI_PROFESSIONAL_UPLOAD_RULES.find((rule) => rule.key === key);
}

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.wmv', '.m4v'];
const DOCUMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

export function validateSemiProfUpload(file: any, key: string): { valid: boolean; error?: string } {
  const rule = getSemiProfUploadRule(key);
  if (!rule) {
    return { valid: false, error: 'Unknown upload type' };
  }

  if (!file) {
    return rule.required ? { valid: false, error: `${rule.label} is required` } : { valid: true };
  }

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  const isVideo = fileType.startsWith('video/') || VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const isTargetingVideo = key === SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO;

  // Reject videos on document/image fields
  if (!isTargetingVideo && isVideo) {
    return {
      valid: false,
      error: `${rule.label} cannot be a video. Only images (JPG, PNG) and PDF files up to 2MB are allowed.`,
    };
  }

  // Reject images/PDFs on video fields
  if (isTargetingVideo && !isVideo) {
    return {
      valid: false,
      error: 'Short Video of the House must be a video file (MP4, MOV, etc.) and cannot be an image or PDF.',
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
      return { valid: false, error: 'Short Video of the House must be a video file (MP4, MOV, etc.)' };
    }
  } else {
    const hasAllowedExt = DOCUMENT_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasAllowedMime = rule.acceptedTypes.includes(file.type);
    if (!hasAllowedExt && !hasAllowedMime) {
      return { valid: false, error: `${rule.label} must be ${rule.acceptedTypes.join(', ')}` };
    }
  }

  return { valid: true };
}
