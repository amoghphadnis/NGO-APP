import { parseDecimalInput, sanitizeDecimalInput } from '../decimalInput';

describe('sanitizeDecimalInput', () => {
  it('keeps digits and decimal point', () => {
    expect(sanitizeDecimalInput('85.5')).toBe('85.5');
    expect(sanitizeDecimalInput('100')).toBe('100');
  });

  it('preserves a trailing decimal point mid-typing', () => {
    expect(sanitizeDecimalInput('85.')).toBe('85.');
    expect(sanitizeDecimalInput('.')).toBe('.');
  });

  it('strips non-numeric characters', () => {
    expect(sanitizeDecimalInput('8a5b.5')).toBe('85.5');
    expect(sanitizeDecimalInput('abc')).toBe('');
    expect(sanitizeDecimalInput(' ₹1,500.50')).toBe('1500.50');
  });

  it('removes extra decimal points', () => {
    expect(sanitizeDecimalInput('8.5.5')).toBe('8.55');
    expect(sanitizeDecimalInput('1.2.3.4')).toBe('1.234');
    expect(sanitizeDecimalInput('..5')).toBe('.5');
  });
});

describe('parseDecimalInput', () => {
  it('parses decimals', () => {
    expect(parseDecimalInput('85.5')).toBe(85.5);
    expect(parseDecimalInput('82.25')).toBe(82.25);
    expect(parseDecimalInput('100')).toBe(100);
    expect(parseDecimalInput('.5')).toBe(0.5);
  });

  it('returns undefined for empty or unparseable input', () => {
    expect(parseDecimalInput('')).toBeUndefined();
    expect(parseDecimalInput('.')).toBeUndefined();
  });
});
