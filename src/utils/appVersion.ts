/**
 * Numeric, segment-wise comparison for versionName strings like "1.1.1".
 * Missing segments are treated as 0 ("1.1" == "1.1.0"); non-numeric
 * noise inside a segment is stripped so "1.1.1-beta" still compares.
 */

function toSegments(version: string): number[] {
  return String(version)
    .split('.')
    .map((segment) => {
      const n = parseInt(segment.replace(/\D/g, ''), 10);
      return Number.isNaN(n) ? 0 : n;
    });
}

/** Returns 1 when a > b, -1 when a < b, 0 when equal. */
export function compareVersions(a: string, b: string): number {
  const sa = toSegments(a);
  const sb = toSegments(b);
  const len = Math.max(sa.length, sb.length);
  for (let i = 0; i < len; i++) {
    const diff = (sa[i] ?? 0) - (sb[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

/** True when `latest` is strictly newer than `current`. */
export function isNewerVersion(latest: string, current: string): boolean {
  return compareVersions(latest, current) > 0;
}
