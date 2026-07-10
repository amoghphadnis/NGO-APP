---
name: vpapp-frontend
description: VPApp frontend engineering handbook for building forms, components, and features using Expo 54, Expo Router, Zustand, React Hook Form, Zod, and the VP UI System. Use when developing any frontend feature, creating form sections, modifying the form engine, or working with UI components in the Vidya Poshak Scholarship App.
---

# VPApp Frontend Architecture

This skill encodes how frontend is built in the Vidya Poshak Scholarship App (VPApp). It is the engineering handbook for the project, not a generic React reference.

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

## Core Architecture

### Config-Driven Form Engine

The app uses a config-driven multi-form engine supporting 4 form types:
`professional`, `puc`, `payana`, `semiProfessional`.

**Flow:**
```
Expo Router (/app/form-engine.tsx)
  → FormRenderer.tsx
    → getFormConfig(formType) from registry
    → Selects component map by form type
    → Renders component for config.steps[currentStep]
    → Navigation via Zustand setCurrentStep
```

**Key Files:**
- `src/forms/shared/registry.ts` — Form config registry, `getFormConfig()`
- `src/forms/shared/types.ts` — `FormType`, `FormStep`, `FormConfig` types
- `src/forms/{type}/config.ts` — Per-form step definitions and validation mapping
- `src/components/FormRenderer.tsx` — Core renderer with per-form-type component maps

### Zustand Store

**File:** `src/store/useFormEngineStore.ts`

**State Keys:**
| Key | Type | Purpose |
|---|---|---|
| `currentFormType` | `FormType \| null` | Active form type |
| `currentStep` | `number` | Zero-indexed step pointer |
| `completedSteps` | `Record<number, boolean>` | Completed step tracking |
| `formData` | `FormDataUnion` | All form data (union of 4 form types) |
| `validationState` | `Record<string, { isValid, errors?, data? }>` | Per-step validation |
| `uploadState` | `Record<string, DocumentsMetaItem>` | Per-document upload tracking |
| `submissionState` | `{ isSubmitting, isSubmitted, error?, applicationId? }` | Submission lifecycle |

**Actions:** `initializeForm`, `setCurrentStep`, `markStepComplete`, `updateSectionData`, `updateValidationState`, `updateUploadState`, `setSubmissionLoading`, `setSubmissionError`, `setSubmissionSuccess`, `resetForm`

### Form Section Pattern

Every form section follows this pattern:
```tsx
export default function SomeSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, formData } = useFormEngineStore();
  
  const { control, handleSubmit, formState } = useForm<SectionValues>({
    defaultValues: extractFromStore(formData),
    resolver: zodResolver(sectionSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SectionValues) => {
    updateSectionData("sectionName", data);
    markStepComplete(stepIndex);
    navigation.navigate("nextStep");
  };

  return (
    <FormScreenLayout title="..." step={N} onBack={navigation.goBack} onNext={handleSubmit(onSubmit)} nextDisabled={!formState.isValid}>
      <FormSectionHeader icon="..." title="..." />
      <FormCard>
        <Controller control={control} name="FieldName" render={...} />
      </FormCard>
    </FormScreenLayout>
  );
}
```

### VP UI System

All form screens MUST use these components:

| Component | File | Purpose |
|---|---|---|
| `FormScreenLayout` | `src/components/layout/FormScreenLayout.tsx` | Screen wrapper with title, progress, scroll, footer |
| `StickyActionFooter` | `src/components/common/StickyActionFooter.tsx` | Fixed Back/Next buttons |
| `VPInputField` | `src/components/common/VPInputField.tsx` | Text input (replaces raw TextInput) |
| `VPDatePickerField` | `src/components/common/VPDatePickerField.tsx` | Native date picker |
| `ModalSelectField` | `src/components/common/ModalSelectField.tsx` | Dropdown selector |
| `FormCard` | `src/components/common/FormCard.tsx` | Card container |
| `FormSectionHeader` | `src/components/common/FormSectionHeader.tsx` | Section title above cards |
| `Stepper` | `src/components/common/Stepper.tsx` | Numeric stepper |
| `SegmentedControl` | `src/components/common/SegmentedControl.tsx` | Toggle selector |
| `Chip` | `src/components/common/Chip.tsx` | Tag selector |

### Submission Pipeline

```
preparePayload(formType, formData)  →  submitApplication(formType, payload)  →  API call
```

**Key Files:**
- `src/submission/preparePayload.ts` — Dispatches to correct mapper by formType
- `src/submission/submit.ts` — Routes to correct API function by formType
- `src/submission/validatePayload.ts` — Pre-submission Zod validation
- `src/submission/attachFiles.ts` — `appendFileToFormData()` helper
- `src/forms/{type}/mapper.ts` — Per-form FormData/JSON mapper

### Mapper Conventions

| Form Type | Casing | Payload Format | File Handling |
|---|---|---|---|
| Professional | PascalCase | FormData | 16 documents via `appendFileToFormData` |
| PUC | camelCase | FormData | Documents via `appendFileToFormData` |
| Payana | camelCase | JSON | File URIs as strings |
| SemiProfessional | camelCase | FormData | 3 documents via `appendFileToFormData` |

### Document Upload Lifecycle

1. User picks file via `expo-document-picker` or `expo-image-picker`
2. File stored as `UploadableFile` (`{ uri, type, name }`) in `formData.documents`
3. Upload state tracked in `uploadState[key]` (`{ isUploading, uploaded, progress, error }`)
4. On submit, mapper appends files to FormData via `appendFileToFormData(fd, key, file)`
5. `isUploadableFile()` type guard validates file shape before appending

**Professional 16 keys:** Defined in `src/forms/professional/fileKeys.ts` as `PROFESSIONAL_FILE_KEYS`.

### Platform Normalization

**File:** `src/theme/platform.ts`
- iOS vs Android font sizes (Android +1-2px to prevent compression)
- Input normalization: 56px min height, `textAlignVertical: 'center'` on Android
- Touch targets: 48px min, 56px button height
- Platform-specific shadows/elevation

**Spacing (8pt grid):** `src/theme/spacing.ts`
- `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 40`, `xxxl: 48`, `xxxxl: 56`
- Form-specific: `screenHorizontal: 20`, `sectionSpacing: 24`, `fieldSpacing: 20`, `labelSpacing: 8`

**Colors:** `src/theme/colors.ts` — 15 tokens (primary `#4F5DFF`, background `#F5F6FA`, etc.)

### Review Gatekeeper

Review sections check form completeness before allowing submission:
1. `isFormComplete()` verifies all required sections have data
2. `declarationAccepted` checkbox must be checked
3. `canSubmit = isFormComplete() && declarationAccepted`
4. Submit button disabled until `canSubmit` is true
5. On submit: `preparePayload()` → `submitApplication()` → `setSubmissionSuccess()`

### Success Screen Conventions

- Extract `applicationId` from `submissionState.applicationId`
- Fallback: generate `VP{year}{6-digit-random}` if API doesn't return ID
- Display: Application ID, Student Name, Submission Date, Form Type
- Show process timeline and next steps
- "Go to Home" and "Exit Application" buttons both call `resetForm()`

## References

- [VP UI System](references/vp_ui_system.md) — Component catalog and usage rules
- [Form Engine Architecture](references/form_engine_architecture.md) — Config-driven engine details
- [Submission Pipeline](references/submission_pipeline.md) — Payload, mappers, API routing
- [AI Development Rules](references/ai-development-rules.md) — Hard rules for AI assistants
- [Architecture Decision Records](references/decisions/) — Rationale for key choices

## Scripts

```bash
# Tier 1 — highest ROI
npx tsx scripts/generate-form-section.ts <formType> <sectionName>
npx tsx scripts/validate-form-config.ts
npx tsx scripts/check-field-contracts.ts

# Tier 2
npx tsx scripts/design-system-audit.ts
```
