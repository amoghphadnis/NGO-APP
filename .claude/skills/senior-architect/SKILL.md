---
name: senior-architect
description: VPApp software architecture skill for designing scalable, maintainable mobile form systems using Expo 54, React Native, TypeScript, Zustand, Zod, and Expo Router. Includes architecture pattern guidance, system design workflows, and tech decision frameworks tailored to the Vidya Poshak Scholarship App. Use when designing system architecture, making technical decisions, creating architecture diagrams, evaluating trade-offs, or defining integration patterns for VPApp.
---

# Senior Architect — VPApp Edition

This skill provides architecture guidance specific to the Vidya Poshak Scholarship App (VPApp). It covers system design, pattern selection, and technical decisions within the project's actual tech stack.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo | 54 |
| Runtime | React Native | 0.81 |
| Language | TypeScript | 5.9 |
| Navigation | Expo Router | 6 |
| State | Zustand | 5 |
| Forms | React Hook Form | 7 |
| Validation | Zod | 4 |
| HTTP | Native fetch | — |
| Icons | @expo/vector-icons (Ionicons) | — |
| Storage | AsyncStorage | 2.2 |
| Images | expo-image | 3.0 |
| Document Picker | expo-document-picker | 14.0 |
| Image Picker | react-native-image-picker | 8.2 |

## Architecture Patterns

### Config-Driven Form Engine
- 4 form types registered in a central registry
- Each form has a `FormConfig` defining steps, validation, and component mappings
- `FormRenderer` dynamically renders components based on config + current step
- See: `src/forms/shared/registry.ts`, `src/components/FormRenderer.tsx`

### Single Zustand Store
- All form state in one store: `useFormEngineStore`
- State keys: `formData`, `completedSteps`, `uploadState`, `validationState`, `submissionState`
- Type-safe via `FormDataUnion` with type guards (`isProfessionalForm`, etc.)
- See: `src/store/useFormEngineStore.ts`

### Submission Pipeline
- `preparePayload(formType, formData)` → dispatches to form-specific mapper
- `submitApplication(formType, payload)` → routes to form-specific API function
- `validatePayload(formType, formData)` → pre-submission Zod validation
- Mappers convert form data to `FormData` (professional, puc, semiProfessional) or JSON (payana)
- See: `src/submission/`

### VP UI System
- Centralized component library: `FormScreenLayout`, `VPInputField`, `StickyActionFooter`, etc.
- Theme tokens: `colors.ts`, `spacing.ts`, `platform.ts`, `typography.ts`
- 8pt grid spacing system
- Platform normalization for iOS/Android parity
- See: `src/components/common/`, `src/components/layout/`, `src/theme/`

### Native Build Guardrails
- Defined in `.devin/rules/instructions.md`
- Covers: Android manifest overrides, Gradle credentials, signing config, compilation workflow
- Critical: Never run `expo prebuild --clean` without re-applying native configs

## System Design Workflows

### Adding a New Form Type
1. Define `FormType` union member in `src/forms/shared/types.ts`
2. Create `src/forms/{type}/config.ts` with step definitions
3. Create `src/forms/{type}/fileKeys.ts` with document key constants
4. Create `src/forms/{type}/mapper.ts` with payload mapper
5. Create section components in `src/screens/form-sections/{type}/`
6. Add component map in `FormRenderer.tsx`
7. Register config in `src/forms/shared/registry.ts`
8. Add type guard in `src/types/forms.ts`
9. Add Zod schemas in `src/validation/{type}Schemas.ts`
10. Add API function in `src/api/{type}Api.ts`
11. Add cases in `preparePayload.ts` and `submit.ts`
12. Add validation in `validatePayload.ts`
13. Update `PROJECT_CONTEXT_CURRENT.md`

### Adding a New API Endpoint
1. Add endpoint function in `src/api/{domain}Api.ts`
2. Use `api.get()` / `api.post()` from `src/api/client.ts`
3. Define request/response interfaces in `src/types/api.ts`
4. Add transformer if response needs normalization (`src/api/transformers/`)
5. Update `PROJECT_CONTEXT_CURRENT.md`

### Modifying the Zustand Store
1. Add new state key to `FormEngineStore` interface
2. Initialize in store creation with safe defaults
3. Add action to modify state
4. Update `initializeForm()` if key needs per-form-type initialization
5. Update `resetForm()` to reset new key
6. Update `PROJECT_CONTEXT_CURRENT.md`

## Tech Decision Framework

| Decision | Choice | Rationale | ADR |
|---|---|---|---|
| State management | Zustand | Minimal boilerplate, single store, TypeScript-native | ADR-001 |
| HTTP client | Native fetch | No dependency, multipart support, resolved axios issues | ADR-002 |
| Form architecture | Config-driven | Single renderer for 4 form types, easy to extend | ADR-003 |
| Validation | Zod | Type inference, RHF integration, composable schemas | ADR-004 |
| Navigation | Expo Router | File-based routing, Expo ecosystem, deep linking | ADR-005 |

See `vpapp-frontend/references/decisions/` for full ADR documents.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   Expo Router                    │
│  (src/app/ — file-based routing)                 │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    Auth Screens   Form Engine   Dashboard
    (login,        (form-engine   (dashboard,
     register,      .tsx)          pdashboard)
     etc.)               │
                    ┌────▼────┐
                    │FormRenderer│
                    │  .tsx     │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         Form Config  Component  Zustand
         Registry     Maps       Store
         (registry.ts)           (useFormEngine
                                 Store.ts)
              │                     │
              │          ┌──────────┤
              │          │          │
         Zod Schemas   Form      Submission
         (validation/) Sections  Pipeline
                      (screens/  (submission/)
                       form-     → Mappers
                       sections/) → API Client
                                  (api/client.ts)
```

## References

- [Architecture Patterns](references/architecture_patterns.md) — SOLID, DRY + VPApp-specific patterns
- [System Design Workflows](references/system_design_workflows.md) — Form engine flow, submission flow, upload lifecycle
- [Tech Decision Guide](references/tech_decision_guide.md) — VPApp-specific technology decisions

## Scripts

```bash
# Tier 1 — verify architectural consistency
npx tsx scripts/check-form-consistency.ts

# Tier 2 — generate project context
npx tsx scripts/update-project-context.ts

# Tier 3 — analyze dependencies
npx tsx scripts/dependency_analyzer.ts
```
