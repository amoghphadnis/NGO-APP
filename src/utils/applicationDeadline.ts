/**
 * Application deadline helpers.
 *
 * Each program's dropdown/form-data endpoint now returns a `lastDate`
 * string in "dd MMM yyyy" format (e.g. "30 Jul 2026"), managed by the
 * web portal's UpdateLastDate pages (ApplicationSettings table).
 * An empty/missing lastDate means no deadline is configured — the
 * application form stays open.
 */

import { getProfessionalDropdowns } from '@/api/professionalApi';
import { getPUCDropdowns } from '@/api/pucApi';
import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import { getPayanaDropdowns } from '@/api/payanaApi';
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

/**
 * Parses "dd MMM yyyy" (e.g. "30 Jul 2026") or an ISO date.
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
    return new Date(Number(match[3]), month, Number(match[1]), 23, 59, 59);
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
 * Fetches all program deadlines in parallel. Failures degrade to
 * "no deadline" so a network error never locks users out of forms.
 */
export async function fetchApplicationDeadlines(): Promise<Record<ProgramKey, ProgramDeadline>> {
  const result: Record<ProgramKey, ProgramDeadline> = {
    professional: { lastDate: null, closed: false },
    puc: { lastDate: null, closed: false },
    semiProfessional: { lastDate: null, closed: false },
    payana: { lastDate: null, closed: false },
    newStudent: { lastDate: null, closed: false },
  };

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
