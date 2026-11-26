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
    label: 'Latest Electricity bill or Bhagyajyothi connection related document',
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
    label: 'Ration Card Copy (both sides)',
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

  const isVideo = key === SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO;

  if (isVideo) {
    const isVideoMime = file.type ? file.type.startsWith('video/') || VIDEO_TYPES.includes(file.type.toLowerCase()) : false;
    const isVideoExt = file.name ? VIDEO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext)) : false;

    if (!isVideoMime && !isVideoExt) {
      return { valid: false, error: 'Please upload a video file (MP4, AVI, MOV, MKV, WMV, 3GP, WEBM)' };
    }
  } else {
    const isDocMime = file.type ? IMAGE_DOC_TYPES.includes(file.type.toLowerCase()) : false;
    const isDocExt = file.name ? DOCUMENT_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext)) : false;

    if (!isDocMime && !isDocExt) {
      return { valid: false, error: 'Please upload an image or PDF file (JPG, PNG, PDF)' };
    }
  }

  if (file.size && file.size > rule.maxSize) {
    const maxMB = Math.round(rule.maxSize / (1024 * 1024));
    return { valid: false, error: `File size must not exceed ${maxMB}MB` };
  }

  return { valid: true };
}
