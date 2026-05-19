import { UploadableFile, isUploadableFile } from '@/types/api';

export function appendFileToFormData(
  formData: FormData,
  key: string,
  file?: unknown
): void {
  if (!file || !isUploadableFile(file)) {
    return;
  }

  formData.append(key, {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as unknown as Blob);
}

export function attachFiles(
  formData: FormData,
  fileMap: Record<string, unknown> | undefined
): void {
  if (!fileMap) {
    return;
  }

  Object.entries(fileMap).forEach(([key, file]) => {
    appendFileToFormData(formData, key, file);
  });
}
