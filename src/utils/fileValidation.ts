import { UploadableFile } from '@/types/api';
import { ALLOWED_DOCUMENT_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/constants/formOptions';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFileType = (file: UploadableFile): FileValidationResult => {
  if (!file || !file.uri) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  // Check file size (2MB limit for all files)
  if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
    const maxSizeMB = Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check MIME type against centralized allowed types
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed',
    };
  }

  return {
    isValid: true,
  };
};

export const validateDocumentFile = (file: UploadableFile, required: boolean = true): FileValidationResult => {
  const basicValidation = validateFileType(file);
  
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (required && !file) {
    return {
      isValid: false,
      error: 'This document is required',
    };
  }

  return {
    isValid: true,
  };
};

export const validateImageFile = (file: UploadableFile, required: boolean = true): FileValidationResult => {
  const basicValidation = validateFileType(file);
  
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (required && !file) {
    return {
      isValid: false,
      error: 'This image is required',
    };
  }

  // Additional image validation
  if (file.type && !file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Invalid file type. Only image files are allowed',
    };
  }

  return {
    isValid: true,
  };
};
