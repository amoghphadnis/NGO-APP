/**
 * Application deadline helpers.
 *
 * Primary source: ApplicationSettings API (managed via Update Last Date admin portal).
 * Fallback source: Each program's legacy dropdown endpoint.
 * An empty/missing lastDate means no deadline is configured — the
 * application form stays open.
 */

import { applicationSettingsApi } from '@/api/applicationSettingsApi';
import { getPayanaDropdowns } from '@/api/payanaApi';
import { getProfessionalDropdowns } from '@/api/professionalApi';
import { getPUCDropdowns } from '@/api/pucApi';
import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import type { HomeFormType } from '@/config/homeSections';

export type ProgramKey = 'professional' | 'puc' | 'semiProfessional' | 'payana' | 'newStudent';

export interface ProgramDeadline {
  lastDate: string | null;
  closed: boolean;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const PROGRAM_FORM_TYPES: Record<Exclude<ProgramKey, 'newStudent'>, string> = {
  professional: 'Professional',
  puc: 'Diploma',
  semiProfessional: 'Semi Professional',
  payana: 'Payana',
};

/**
 * Formats YYYY-MM-DD (e.g. "2026-12-31") to "31 Dec 2026" for UI display.
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (match) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[monthIndex] || match[2];
    return `${day} ${monthName} ${year}`;
  }
  return dateStr;
}

/**
 * Parses "dd MMM yyyy" (e.g. "30 Jul 2026") or an ISO date (e.g. "2026-12-31").
 * Returns null when the value is missing or unparseable.
 */
export function parseLastDate(value?: string | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = /^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/.exec(trimmed);
  if (match) {
    const month = MONTHS[match[2].slice(0, 3).toLowerCase()];
    if (month === undefined) return null;
    return new Date(Number(match[3]), month, Number(match[1]), 23, 59, 59, 999);
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return new Date(
      Number(isoMatch[1]),
      parseInt(isoMatch[2], 10) - 1,
      Number(isoMatch[3]),
      23,
      59,
      59,
      999
    );
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

/** True when a deadline exists and today is past the end of that date. */
export function isDeadlinePassed(lastDate?: string | null, now: Date = new Date()): boolean {
  const deadline = parseLastDate(lastDate);
  return deadline !== null && now.getTime() > deadline.getTime();
}

/**
 * Fetches all program deadlines.
 * Primary: ApplicationSettings API (configured by admins).
 * Fallback: Dropdown endpoints if ApplicationSettings API is unavailable.
 * Failures degrade to "no deadline" so a network error never locks users out of forms.
 */
export async function fetchApplicationDeadlines(): Promise<Record<ProgramKey, ProgramDeadline>> {
  const result: Record<ProgramKey, ProgramDeadline> = {
    professional: { lastDate: null, closed: false },
    puc: { lastDate: null, closed: false },
    semiProfessional: { lastDate: null, closed: false },
    payana: { lastDate: null, closed: false },
    newStudent: { lastDate: null, closed: false },
  };

  // 1. Try ApplicationSettings API (live configured deadlines from admin portal)
  try {
    const settings = await applicationSettingsApi.list();
    if (settings && settings.length > 0) {
      const settingsMap = new Map(settings.map((s) => [s.FormType, s.LastDateToApply]));

      for (const [key, formType] of Object.entries(PROGRAM_FORM_TYPES)) {
        const lastDate = settingsMap.get(formType);
        if (lastDate) {
          const displayDate = formatDisplayDate(lastDate);
          result[key as ProgramKey] = {
            lastDate: displayDate,
            closed: isDeadlinePassed(lastDate),
          };
        }
      }
      return result;
    }
  } catch (err) {
    console.warn('[fetchApplicationDeadlines] ApplicationSettings API failed, falling back to dropdowns', err);
  }

  // 2. Fallback to legacy dropdown responses
  const [professional, puc, semiProfessional, payana] = await Promise.allSettled([
    getProfessionalDropdowns(),
    getPUCDropdowns(),
    getSemiProfessionalDropdowns(),
    getPayanaDropdowns(),
  ]);

  const assign = (
    key: ProgramKey,
    settled: PromiseSettledResult<any>,
  ) => {
    if (settled.status !== 'fulfilled') return;
    const res = settled.value;
    const lastDate: string | undefined =
      res?.success && res?.data ? res.data.lastDate : undefined;
    if (lastDate) {
      result[key] = { lastDate, closed: isDeadlinePassed(lastDate) };
    }
  };

  assign('professional', professional);
  assign('puc', puc);
  assign('semiProfessional', semiProfessional);
  assign('payana', payana);

  return result;
}

/** Maps a scholarship card formType to its deadline key. */
export function deadlineKeyFor(formType: HomeFormType): ProgramKey {
  return formType;
}
