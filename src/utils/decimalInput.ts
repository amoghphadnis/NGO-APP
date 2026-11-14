/**
 * Helpers for decimal text inputs (percentages, currency amounts).
 */

/** Strip everything except digits, keeping only the first decimal point. */
export function sanitizeDecimalInput(text: string): string {
  const digitsAndDots = text.replace(/[^0-9.]/g, '');
  const dotIndex = digitsAndDots.indexOf('.');
  if (dotIndex === -1) return digitsAndDots;
  const intPart = digitsAndDots.slice(0, dotIndex);
  const fracPart = digitsAndDots.slice(dotIndex + 1).replace(/\./g, '');
  return `${intPart}.${fracPart}`;
}

/** Parse sanitized input to a number; returns undefined for empty/unparseable text. */
export function parseDecimalInput(text: string): number | undefined {
  const num = parseFloat(text);
  return text === '' || isNaN(num) ? undefined : num;
}
