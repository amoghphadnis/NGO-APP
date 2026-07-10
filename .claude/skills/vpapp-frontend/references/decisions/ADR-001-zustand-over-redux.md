# ADR-001: Zustand over Redux

**Date:** 2025
**Status:** Accepted

## Context

VPApp needs global state management for form data, step tracking, upload progress, and submission state across 4 form types with 8-11 steps each.

## Decision

Use **Zustand** (v5) instead of Redux Toolkit.

## Rationale

- **Minimal boilerplate** — No actions, reducers, dispatch, or connect HOCs. State and actions live in one store object.
- **Single store** — All form state (formData, completedSteps, uploadState, submissionState) in one place (`useFormEngineStore.ts`). Redux would require multiple slices and selectors.
- **Direct access** — Components call `useFormEngineStore()` and destructure only what they need. No provider wrappers needed.
- **TypeScript-friendly** — Zustand's `create<T>()` provides full type inference out of the box.
- **No context provider** — Works without `<Provider>`. Simpler component tree.
- **Smaller bundle** — Zustand is ~1KB vs Redux Toolkit ~15KB.

## Trade-offs

- **DevTools** — Redux DevTools are more mature. Zustand has middleware support but less ecosystem tooling.
- **Time-travel debugging** — Redux's immutability model enables this natively. Zustand requires middleware.
- **Team familiarity** — Redux is more widely known. Zustand has a smaller learning curve though.

## Implementation

```typescript
export const useFormEngineStore = create<FormEngineStore>((set, get) => ({
  currentFormType: null,
  currentStep: 0,
  formData: {} as FormDataUnion,
  // ... actions
}));
```

Single file: `src/store/useFormEngineStore.ts` (~371 lines).
