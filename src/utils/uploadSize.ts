import { MAX_TOTAL_UPLOAD_BYTES } from '@/constants/formOptions';

/**
 * Sums the byte size of every attached file in a form's `documents` section.
 * Document entries are shaped `{ file: { uri, name, type, size }, uploadedAt }`;
 * non-file values (e.g. houseVisitLink strings) and entries without a size are skipped.
 */
export function getTotalUploadSizeBytes(documents: unknown): number {
  if (!documents || typeof documents !== 'object') return 0;

  let total = 0;
  for (const value of Object.values(documents as Record<string, unknown>)) {
    const size = (value as { file?: { size?: number } } | null)?.file?.size;
    if (typeof size === 'number' && size > 0) total += size;
  }
  return total;
}

export function isTotalUploadSizeExceeded(documents: unknown): boolean {
  return getTotalUploadSizeBytes(documents) > MAX_TOTAL_UPLOAD_BYTES;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
}
