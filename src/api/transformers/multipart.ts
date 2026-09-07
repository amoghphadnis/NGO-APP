/**
 * Helpers for building multipart/form-data bodies for partial-update endpoints.
 * Only defined values are appended so the backend keeps existing values for omitted fields.
 */

import { DocumentFile } from '@/types/documents';

export type MultipartScalar = string | number | boolean | null | undefined;

export function appendScalarFields(
  fd: FormData,
  fields: Record<string, MultipartScalar>
): void {
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    fd.append(key, value === null ? '' : String(value));
  });
}

export function appendDocumentFile(fd: FormData, key: string, file?: DocumentFile | null): void {
  if (!file?.uri) {
    return;
  }
  fd.append(key, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
}

export function appendDocumentFiles(
  fd: FormData,
  files: Partial<Record<string, DocumentFile | undefined>> | undefined
): void {
  if (!files) {
    return;
  }
  Object.entries(files).forEach(([key, file]) => appendDocumentFile(fd, key, file));
}
