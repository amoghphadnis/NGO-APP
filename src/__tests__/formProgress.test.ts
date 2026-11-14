/**
 * Form progress tests
 * Progress must be derived from the active form config, treat step index 0
 * as a valid step, exclude the review/success meta screens, and never show
 * a non-zero percentage before the user has entered anything.
 */

import { getFormConfig } from '@/forms/shared/registry';
import { useFormEngineStore } from '@/store/useFormEngineStore';

const resetStore = (formType: string | null, completedSteps: Record<number, boolean> = {}) => {
  useFormEngineStore.setState({
    currentFormType: formType as any,
    currentStep: 0,
    completedSteps,
  });
};

describe('getFormProgress', () => {
  it('returns 0 when no form is active', () => {
    resetStore(null);
    expect(useFormEngineStore.getState().getFormProgress()).toBe(0);
  });

  it('returns 0 on a fresh PUC form (regression: was 14.3%)', () => {
    resetStore('puc');
    expect(useFormEngineStore.getState().getFormProgress()).toBe(0);
  });

  it('returns 0 on a fresh semiProfessional form', () => {
    resetStore('semiProfessional');
    expect(useFormEngineStore.getState().getFormProgress()).toBe(0);
  });

  it('counts only user-facing pages for PUC (8 pages, not 10)', () => {
    const puc = getFormConfig('puc');
    expect(puc.steps.length).toBe(10);
    // guidelines + 3 data-entry steps complete = 4/8 = 50%
    resetStore('puc', { 0: true, 1: true, 2: true, 3: true });
    expect(useFormEngineStore.getState().getFormProgress()).toBe(50);
  });

  it('ignores review/success completion', () => {
    // review=8, success=9 for PUC — marking them changes nothing
    resetStore('puc', { 8: true, 9: true });
    expect(useFormEngineStore.getState().getFormProgress()).toBe(0);
  });

  it('reaches 100 only when all user-facing pages are complete', () => {
    resetStore('puc', { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
    expect(useFormEngineStore.getState().getFormProgress()).toBe(100);
  });

  it('never exceeds 100 even with out-of-range step flags', () => {
    resetStore('puc', {
      0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 15: true,
    });
    expect(useFormEngineStore.getState().getFormProgress()).toBe(100);
  });
});
