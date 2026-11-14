/**
 * Total upload size guard tests
 * Ensures combined attachment size is measured correctly so over-limit
 * submissions are blocked before hitting the backend's request limit.
 */

import { MAX_TOTAL_UPLOAD_BYTES } from '@/constants/formOptions';
import { preparePayload } from '@/submission/preparePayload';
import { formatBytes, getTotalUploadSizeBytes, isTotalUploadSizeExceeded } from '../uploadSize';

const entry = (size?: number) => ({ file: { uri: 'file:///f.pdf', name: 'f.pdf', type: 'application/pdf', size } });

describe('getTotalUploadSizeBytes', () => {
  it('returns 0 for empty or non-object input', () => {
    expect(getTotalUploadSizeBytes(undefined)).toBe(0);
    expect(getTotalUploadSizeBytes(null)).toBe(0);
    expect(getTotalUploadSizeBytes({})).toBe(0);
  });

  it('sums file sizes across all document entries', () => {
    const docs = {
      studentSelfie: entry(1 * 1024 * 1024),
      marksCard: entry(2 * 1024 * 1024),
      houseVideo: entry(50 * 1024 * 1024),
    };
    expect(getTotalUploadSizeBytes(docs)).toBe(53 * 1024 * 1024);
  });

  it('ignores non-file values and entries without a size', () => {
    const docs = {
      houseVisitLink: 'https://maps.google.com/x',
      marksCard: entry(1024),
      noSize: entry(undefined),
      nullEntry: null,
    };
    expect(getTotalUploadSizeBytes(docs)).toBe(1024);
  });
});

describe('isTotalUploadSizeExceeded', () => {
  it('is false when the total is exactly at the limit', () => {
    const docs = { a: entry(MAX_TOTAL_UPLOAD_BYTES) };
    expect(isTotalUploadSizeExceeded(docs)).toBe(false);
  });

  it('is true when the total is one byte over the limit', () => {
    const docs = { a: entry(MAX_TOTAL_UPLOAD_BYTES + 1) };
    expect(isTotalUploadSizeExceeded(docs)).toBe(true);
  });

  it('is false when the total is under the limit', () => {
    const docs = {
      doc1: entry(2 * 1024 * 1024),
      video: entry(50 * 1024 * 1024),
    };
    expect(isTotalUploadSizeExceeded(docs)).toBe(false);
  });
});

describe('preparePayload total-size guard', () => {
  it('throws a friendly error instead of building a payload over the limit', () => {
    const docs = { a: entry(MAX_TOTAL_UPLOAD_BYTES + 1) };
    expect(() => preparePayload('payana', { documents: docs } as any)).toThrow(/upload limit/);
  });
});

describe('formatBytes', () => {
  it('formats MB and KB values', () => {
    expect(formatBytes(0)).toBe('0 MB');
    expect(formatBytes(512 * 1024)).toBe('512 KB');
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
    expect(formatBytes(140 * 1024 * 1024)).toBe('140.0 MB');
  });
});
