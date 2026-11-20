import { compareVersions, isNewerVersion } from '@/utils/appVersion';

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.1.1', '1.1.1')).toBe(0);
    expect(compareVersions('1.1.0', '1.1')).toBe(0);
    expect(compareVersions('2', '2.0.0')).toBe(0);
  });

  it('detects newer versions across each segment', () => {
    expect(compareVersions('1.1.1', '1.1.0')).toBe(1);
    expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
    expect(compareVersions('10.0.0', '9.9.9')).toBe(1);
  });

  it('detects older versions', () => {
    expect(compareVersions('1.1.0', '1.1.1')).toBe(-1);
    expect(compareVersions('1.9', '2.0')).toBe(-1);
  });

  it('tolerates non-numeric noise', () => {
    expect(compareVersions('1.1.1-beta', '1.1.0')).toBe(1);
    expect(compareVersions('v1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('', '0.0.0')).toBe(0);
  });
});

describe('isNewerVersion', () => {
  it('is true only when latest > current', () => {
    expect(isNewerVersion('1.1.2', '1.1.1')).toBe(true);
    expect(isNewerVersion('1.1.1', '1.1.1')).toBe(false);
    expect(isNewerVersion('1.1.0', '1.1.1')).toBe(false);
  });
});
