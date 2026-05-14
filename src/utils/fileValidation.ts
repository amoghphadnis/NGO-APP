import { UploadableFile } from '@/types/api';

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

  // Check file size (2MB for images, 5MB for documents)
  const maxSize = file.type.startsWith('image/') ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  
  if (file.size && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed',
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
