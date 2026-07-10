# Architecture Patterns

## Generic Patterns (Applied in VPApp)

### SOLID Principles

- **Single Responsibility:** Each form section handles one step. Each mapper handles one form type. Each API file handles one domain.
- **Open/Closed:** New form types extend the system via registry + config without modifying `FormRenderer` logic. Component maps are additive.
- **Liskov Substitution:** All form sections accept the same `{ navigation }` prop interface. Any section can replace another in a component map.
- **Interface Segregation:** Zustand store exposes focused actions (`updateSectionData`, `markStepComplete`) rather than a monolithic `update` method.
- **Dependency Inversion:** Form sections depend on Zod schema interfaces, not concrete validation implementations. Mappers depend on `UploadableFile` interface, not concrete file types.

### DRY Compliance

- Shared sections (guidelines, review, success) are reused across form types where possible.
- `appendFileToFormData()` is a single utility used by all mappers.
- Theme tokens prevent repeated color/spacing values.
- VP UI components prevent repeated input/layout code.

## VPApp-Specific Patterns

### Config-Driven Form Engine

```
FormType → FormConfig (steps[], validation{})
                ↓
FormRenderer → componentMap[stepId] → React.FC
                ↓
Zustand Store → formData, currentStep, completedSteps
```

**Benefits:**
- Adding a form type = config + components + registry entry (no renderer changes)
- Step order is declarative, not hardcoded
- Validation is mapped per-step in config

### Type Guard Pattern

```typescript
const isProfessionalForm = (data: FormDataUnion): data is ProfessionalFormValues =>
  data && 'academic' in data && !('category' in data);
```

Enables safe narrowing of the union type without `as` casts in components.

### Mapper Convention Pattern

Each form type has its own mapper that converts `FormValues` → `FormData` or `JSON`:
- Professional: PascalCase keys → FormData
- PUC: camelCase keys → FormData
- Payana: camelCase keys → JSON
- SemiProfessional: camelCase keys → FormData

This allows each form to match its specific backend contract without a universal mapping layer.

### Review Gatekeeper Pattern

Review sections implement a completeness check before allowing submission:
1. `isFormComplete(formData)` — verifies all required sections have data
2. `declarationAccepted` — user must check a checkbox
3. `canSubmit = isFormComplete() && declarationAccepted`
4. Submit button disabled until `canSubmit` is true

### Success Screen Fallback Pattern

When API doesn't return an application ID:
```typescript
const applicationId = submissionState.applicationId ||
  `VP${new Date().getFullYear()}${Math.random().toString().slice(2, 8)}`;
```

Ensures user always sees a reference ID, even if backend doesn't provide one.

### Platform Normalization Pattern

```typescript
fontSize: Platform.select({ ios: 16, android: 17 })
```

All visual properties are platform-aware via `src/theme/platform.ts`, preventing Android compression issues.

## Anti-Patterns to Avoid

- **Per-form-type stores** — Use the single `useFormEngineStore` with `FormDataUnion`
- **Direct FormData construction in components** — Always go through mappers
- **Hardcoded step indices** — Use `config.steps` array and `currentStep` pointer
- **Raw `TextInput` in screens** — Use `VPInputField`
- **Inline color/spacing values** — Use theme tokens
- **Bypassing `preparePayload`** — Always use the submission pipeline
