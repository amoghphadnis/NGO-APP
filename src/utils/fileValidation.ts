import { UploadableFile } from '@/types/api';
import { ALLOWED_DOCUMENT_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/constants/formOptions';

export const MAX_DOCUMENT_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.3gp', '.wmv', '.m4v'];
export const DOCUMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const isVideoFile = (file: { name?: string; type?: string }): boolean => {
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return type.startsWith('video/') || VIDEO_EXTENSIONS.some((ext) => name.endsWith(ext));
};

export const isImageOrPdfFile = (file: { name?: string; type?: string }): boolean => {
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return (
    type.startsWith('image/') ||
    type === 'application/pdf' ||
    DOCUMENT_EXTENSIONS.some((ext) => name.endsWith(ext))
  );
};

export const validateFileType = (file: UploadableFile): FileValidationResult => {
  if (!file || !file.uri) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Explicitly reject video files for standard document uploads
  if (isVideoFile(file)) {
    return {
      isValid: false,
      error: 'Videos are not allowed. Please upload an image (JPG, PNG) or PDF document (max 2MB)',
    };
  }

  // Check file size (2MB limit for document/image files)
  if (file.size && file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'File size exceeds 2MB limit (maximum allowed: 2MB)',
    };
  }

  // Check MIME type or extension
  const isAllowedMime = ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as any);
  const isAllowedExt = DOCUMENT_EXTENSIONS.some((ext) => (file.name || '').toLowerCase().endsWith(ext));

  if (!isAllowedMime && !isAllowedExt) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed',
    };
  }

  return {
    isValid: true,
  };
};

export const validateVideoUpload = (file: UploadableFile, label: string = 'Video'): FileValidationResult => {
  if (!file || !file.uri) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Reject image or PDF files
  if (isImageOrPdfFile(file) && !isVideoFile(file)) {
    return {
      isValid: false,
      error: `${label} must be a video file (MP4, MOV, etc.) and cannot be an image or PDF`,
    };
  }

  if (!isVideoFile(file)) {
    return {
      isValid: false,
      error: `${label} must be a valid video format (MP4, MOV, AVI, etc.)`,
    };
  }

  // Max 50MB for video
  if (file.size && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      isValid: false,
      error: `${label} exceeds 50MB limit (maximum allowed: 50MB)`,
    };
  }

  return {
    isValid: true,
  };
};

export const validateDocumentUpload = (file: UploadableFile, label: string = 'Document'): FileValidationResult => {
  if (!file || !file.uri) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Strictly reject videos
  if (isVideoFile(file)) {
    return {
      isValid: false,
      error: `${label} cannot be a video. Only images (JPG, PNG) and PDF files up to 2MB are allowed.`,
    };
  }

  // Max 2MB for images and PDFs
  if (file.size && file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      isValid: false,
      error: `${label} exceeds 2MB limit (maximum allowed: 2MB)`,
    };
  }

  const isAllowedMime = ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as any);
  const isAllowedExt = DOCUMENT_EXTENSIONS.some((ext) => (file.name || '').toLowerCase().endsWith(ext));

  if (!isAllowedMime && !isAllowedExt) {
    return {
      isValid: false,
      error: `${label} must be a JPG, JPEG, PNG, or PDF file`,
    };
  }

  return {
    isValid: true,
  };
};

export const validateDocumentFile = (file: UploadableFile, required: boolean = true): FileValidationResult => {
  if (required && (!file || !file.uri)) {
    return {
      isValid: false,
      error: 'This document is required',
    };
  }

  return validateFileType(file);
};

export const validateImageFile = (file: UploadableFile, required: boolean = true): FileValidationResult => {
  if (required && (!file || !file.uri)) {
    return {
      isValid: false,
      error: 'This image is required',
    };
  }

  const basicValidation = validateFileType(file);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (file.type && !file.type.startsWith('image/')) {
    const isImageExt = ['.jpg', '.jpeg', '.png'].some((ext) => (file.name || '').toLowerCase().endsWith(ext));
    if (!isImageExt) {
      return {
        isValid: false,
        error: 'Invalid file type. Only image files are allowed',
      };
    }
  }

  return {
    isValid: true,
  };
};
