import {
  formatDisplayDate,
  parseLastDate,
  isDeadlinePassed,
  fetchApplicationDeadlines,
  deadlineKeyFor,
} from '@/utils/applicationDeadline';
import { applicationSettingsApi } from '@/api/applicationSettingsApi';
import { getProfessionalDropdowns } from '@/api/professionalApi';
import { getPUCDropdowns } from '@/api/pucApi';
import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import { getPayanaDropdowns } from '@/api/payanaApi';

jest.mock('@/api/applicationSettingsApi');
jest.mock('@/api/professionalApi');
jest.mock('@/api/pucApi');
jest.mock('@/api/semiProfessionalApi');
jest.mock('@/api/payanaApi');

describe('applicationDeadline utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatDisplayDate', () => {
    it('formats ISO YYYY-MM-DD to dd MMM yyyy without timezone drift', () => {
      expect(formatDisplayDate('2026-12-31')).toBe('31 Dec 2026');
      expect(formatDisplayDate('2026-01-05')).toBe('5 Jan 2026');
      expect(formatDisplayDate('2026-09-30')).toBe('30 Sep 2026');
    });

    it('returns original string if already in dd MMM yyyy or arbitrary format', () => {
      expect(formatDisplayDate('30 Sep 2026')).toBe('30 Sep 2026');
      expect(formatDisplayDate('')).toBe('');
    });
  });

  describe('parseLastDate', () => {
    it('parses "dd MMM yyyy" format to end of day', () => {
      const d = parseLastDate('30 Sep 2026');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2026);
      expect(d?.getMonth()).toBe(8); // September (0-indexed)
      expect(d?.getDate()).toBe(30);
      expect(d?.getHours()).toBe(23);
      expect(d?.getMinutes()).toBe(59);
      expect(d?.getSeconds()).toBe(59);
    });

    it('parses ISO "YYYY-MM-DD" format to end of day', () => {
      const d = parseLastDate('2026-12-31');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2026);
      expect(d?.getMonth()).toBe(11); // December (0-indexed)
      expect(d?.getDate()).toBe(31);
      expect(d?.getHours()).toBe(23);
      expect(d?.getMinutes()).toBe(59);
    });

    it('returns null for missing, empty, or unparseable dates', () => {
      expect(parseLastDate(null)).toBeNull();
      expect(parseLastDate(undefined)).toBeNull();
      expect(parseLastDate('')).toBeNull();
      expect(parseLastDate('   ')).toBeNull();
      expect(parseLastDate('not-a-date')).toBeNull();
    });
  });

  describe('isDeadlinePassed', () => {
    it('returns false when no deadline is set', () => {
      expect(isDeadlinePassed(null)).toBe(false);
      expect(isDeadlinePassed('')).toBe(false);
    });

    it('returns false for future deadlines', () => {
      const fixedNow = new Date('2026-11-23T10:00:00Z');
      expect(isDeadlinePassed('2026-12-31', fixedNow)).toBe(false);
      expect(isDeadlinePassed('31 Dec 2026', fixedNow)).toBe(false);
    });

    it('returns true for past deadlines', () => {
      const fixedNow = new Date('2026-11-23T10:00:00Z');
      expect(isDeadlinePassed('2026-09-30', fixedNow)).toBe(true);
      expect(isDeadlinePassed('30 Sep 2026', fixedNow)).toBe(true);
    });

    it('remains open during the day of the deadline until 23:59:59', () => {
      const morningOfDeadline = new Date(2026, 11, 31, 10, 0, 0); // 31 Dec 2026 10:00
      expect(isDeadlinePassed('2026-12-31', morningOfDeadline)).toBe(false);

      const afterDeadline = new Date(2027, 0, 1, 0, 0, 1); // 1 Jan 2027 00:00:01
      expect(isDeadlinePassed('2026-12-31', afterDeadline)).toBe(true);
    });
  });

  describe('fetchApplicationDeadlines', () => {
    it('fetches live configured dates from ApplicationSettings API (Primary source)', async () => {
      (applicationSettingsApi.list as jest.Mock).mockResolvedValue([
        { ID: 1, FormType: 'Professional', LastDateToApply: '2026-12-31' },
        { ID: 2, FormType: 'Diploma', LastDateToApply: '2026-09-30' },
        { ID: 3, FormType: 'Semi Professional', LastDateToApply: '2026-11-10' },
        { ID: 4, FormType: 'Payana', LastDateToApply: '2026-08-30' },
      ]);

      const deadlines = await fetchApplicationDeadlines();

      expect(deadlines.professional.lastDate).toBe('31 Dec 2026');
      expect(deadlines.puc.lastDate).toBe('30 Sep 2026');
      expect(deadlines.semiProfessional.lastDate).toBe('10 Nov 2026');
      expect(deadlines.payana.lastDate).toBe('30 Aug 2026');

      // Dropdown APIs should not be called when ApplicationSettings succeeds
      expect(getProfessionalDropdowns).not.toHaveBeenCalled();
    });

    it('falls back to dropdowns endpoints if ApplicationSettings API fails', async () => {
      (applicationSettingsApi.list as jest.Mock).mockRejectedValue(new Error('Network error'));
      (getProfessionalDropdowns as jest.Mock).mockResolvedValue({
        success: true,
        data: { lastDate: '30 Sep 2026' },
      });
      (getPUCDropdowns as jest.Mock).mockResolvedValue({
        success: true,
        data: { lastDate: '31 Aug 2026' },
      });
      (getSemiProfessionalDropdowns as jest.Mock).mockResolvedValue({
        success: true,
        data: { lastDate: '15 Oct 2026' },
      });
      (getPayanaDropdowns as jest.Mock).mockResolvedValue({
        success: true,
        data: { lastDate: '01 Nov 2026' },
      });

      const deadlines = await fetchApplicationDeadlines();

      expect(deadlines.professional.lastDate).toBe('30 Sep 2026');
      expect(deadlines.puc.lastDate).toBe('31 Aug 2026');
      expect(deadlines.semiProfessional.lastDate).toBe('15 Oct 2026');
      expect(deadlines.payana.lastDate).toBe('01 Nov 2026');
    });
  });

  describe('deadlineKeyFor', () => {
    it('returns the same key', () => {
      expect(deadlineKeyFor('professional')).toBe('professional');
      expect(deadlineKeyFor('puc')).toBe('puc');
    });
  });
});

