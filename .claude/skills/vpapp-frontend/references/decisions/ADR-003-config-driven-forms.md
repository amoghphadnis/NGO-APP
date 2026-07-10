# ADR-003: Config-Driven Form Engine

**Date:** 2025
**Status:** Accepted

## Context

VPApp has 4 scholarship form types (professional, puc, payana, semiProfessional) with 8-11 steps each. Each form shares some steps (personal, address, family) but has unique steps (category, bank) and different field naming conventions (PascalCase vs camelCase).

## Decision

Use a **config-driven form engine** where each form type is defined by a `FormConfig` object that lists its steps, validation schemas, and component mappings.

## Rationale

- **Single renderer** — One `FormRenderer` component handles all 4 form types. No per-form screen wrappers.
- **Easy to add forms** — New form type = new config + section components + registry entry. No changes to navigation or rendering logic.
- **Step flexibility** — Forms can share steps (guidelines, review, success) while having unique ones (category, bank).
- **Validation mapping** — Each step maps to a Zod schema in the config, making validation declarative.
- **Component maps** — Each form type has its own component map, allowing different components for the same step name if needed.

## Trade-offs

- **Indirection** — Reading code requires understanding the registry → config → component map flow. Less obvious than direct imports.
- **Type safety** — `FormDataUnion` requires type guards (`isProfessionalForm`, etc.) for safe narrowing. Slightly more complex than per-form stores.
- **Shared sections** — PUC currently shares Professional's Review/Success sections, which have Professional-specific logic. This is a known debt item.

## Implementation

```
FormConfig {
  type: FormType
  steps: FormStep[]
  validation: Record<stepId, schema>
}

registry.ts → getFormConfig(type) → FormConfig
FormRenderer.tsx → componentMap[stepId] → React.FC
```

**Files:**
- `src/forms/shared/registry.ts`
- `src/forms/shared/types.ts`
- `src/forms/{type}/config.ts`
- `src/components/FormRenderer.tsx`
