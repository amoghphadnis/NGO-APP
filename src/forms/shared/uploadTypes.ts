/**
 * Shared Upload Types
 * Common upload type definitions used across forms
 */

export interface UploadableFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export interface UploadProgress {
  isUploading: boolean;
  uploaded: boolean;
  progress: number;
  error?: string;
}

export interface UploadState {
  [key: string]: UploadProgress;
}

export function isUploadableFile(file: any): file is UploadableFile {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.uri === 'string' &&
    typeof file.type === 'string' &&
    typeof file.name === 'string'
  );
}

export function createInitialUploadProgress(): UploadProgress {
  return {
    isUploading: false,
    uploaded: false,
    progress: 0,
  };
}

export function createInitialUploadState(keys: string[]): UploadState {
  const state: UploadState = {};
  keys.forEach((key) => {
    state[key] = createInitialUploadProgress();
  });
  return state;
}
