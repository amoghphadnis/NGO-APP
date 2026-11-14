/**
 * Offline draft persistence for the multi-step application forms.
 *
 * Drafts are stored in AsyncStorage under `vpdraft:<formType>` and are
 * written on every section/step change (debounced by callers). A draft
 * captures section field values, the current step, and completed steps
 * so a user can resume after the app closes or connectivity drops.
 *
 * Scope: drafts only — final submission still requires connectivity.
 * Document entries persist file URIs; picked files live in the app
 * sandbox and may be cleared by the OS, so users should verify
 * attachments when resuming an old draft.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FormType } from '@/forms/shared/types';

const KEY_PREFIX = 'vpdraft:';

export interface FormDraft {
  formType: FormType;
  formData: unknown;
  currentStep: number;
  completedSteps: Record<string, boolean>;
  savedAt: string; // ISO timestamp
}

export interface DraftSummary {
  formType: FormType;
  savedAt: string;
}

function keyFor(formType: FormType): string {
  return `${KEY_PREFIX}${formType}`;
}

export async function saveDraft(draft: Omit<FormDraft, 'savedAt'>): Promise<void> {
  try {
    const payload: FormDraft = { ...draft, savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(keyFor(draft.formType), JSON.stringify(payload));
  } catch (error) {
    // Draft persistence must never break the form — log and continue
    console.warn('[draftStorage] saveDraft failed:', error);
  }
}

export async function getDraft(formType: FormType): Promise<FormDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(formType));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FormDraft;
    if (!parsed || parsed.formType !== formType || parsed.formData == null) return null;
    return parsed;
  } catch (error) {
    console.warn('[draftStorage] getDraft failed:', error);
    return null;
  }
}

export async function clearDraft(formType: FormType): Promise<void> {
  try {
    await AsyncStorage.removeItem(keyFor(formType));
  } catch (error) {
    console.warn('[draftStorage] clearDraft failed:', error);
  }
}

export async function listDrafts(): Promise<DraftSummary[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const draftKeys = keys.filter((k) => k.startsWith(KEY_PREFIX));
    const entries = await AsyncStorage.multiGet(draftKeys);
    return entries
      .map(([key, raw]) => {
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw) as FormDraft;
          return { formType: parsed.formType, savedAt: parsed.savedAt };
        } catch {
          return null;
        }
      })
      .filter((d): d is DraftSummary => d !== null);
  } catch (error) {
    console.warn('[draftStorage] listDrafts failed:', error);
    return [];
  }
}
