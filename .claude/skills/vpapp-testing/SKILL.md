---
name: vpapp-testing
description: VPApp testing strategy for React Native (Expo 54) covering Jest, React Native Testing Library, Zod schema tests, mapper tests, form engine tests, upload tests, and NGO acceptance checklists. Use when writing tests, designing test strategies, or performing QA for the Vidya Poshak Scholarship App.
---

# VPApp Testing Strategy

This skill encodes the testing approach for the Vidya Poshak Scholarship App. It is not a generic QA reference — it targets the specific architecture, form types, and submission pipeline of VPApp.

## Testing Stack

| Layer | Tool | Status |
|---|---|---|
| Unit/Component | Jest + React Native Testing Library | To be set up |
| E2E | Detox (optional) | Not yet adopted |
| Schema | Zod `safeParse()` in Jest | Ready to implement |
| Manual | Acceptance checklists | Active |

## Test Categories

### 1. Schema Validation Tests
Test every Zod schema per form type:
- Valid data passes
- Required fields missing → fails with correct message
- Boundary values (percentages 0-100, phone 10 digits, email format)
- PascalCase keys for professional, camelCase for others
- Document schema with `UploadedDocument` custom type

### 2. Mapper Tests
Test each mapper (`professionalMapper`, `pucMapper`, `payanaMapper`, `semiProfessionalMapper`):
- All form fields appear in output with correct keys
- File fields produce `FormData` entries (not JSON for non-Payana)
- Payana mapper produces JSON (not FormData)
- Empty/undefined files are skipped (not appended)
- Date fields formatted as `YYYY-MM-DD`
- `HouseVisitLink` validated as `https://` prefix

### 3. Upload Tests
Test file attachment utilities:
- `appendFileToFormData()` appends valid `UploadableFile`
- `isUploadableFile()` rejects non-file objects
- Missing `uri` → rejected
- All 16 professional document keys can be appended

### 4. Form Engine Tests
Test the config-driven engine:
- `getFormConfig()` returns correct config per form type
- `getFormConfig()` throws for invalid form type
- `FormRenderer` renders correct component for current step
- Component maps contain all steps from config
- `initializeForm()` resets state and sets correct form type
- `updateSectionData()` merges data correctly
- `markStepComplete()` updates `completedSteps`

### 5. Submission Pipeline Tests
Test the submission flow:
- `preparePayload()` dispatches to correct mapper
- `submitApplication()` routes to correct API function
- `validatePayload()` catches invalid data before submission
- `setSubmissionSuccess()` stores application ID
- Error states propagated to `submissionState`

### 6. Review Gatekeeper Tests
Test review section logic per form type:
- `isFormComplete()` returns false when required sections are empty
- `isFormComplete()` returns true when all required data present
- Submit button disabled when `declarationAccepted` is false
- Submit button disabled when `isFormComplete()` is false
- Professional: all 16 documents + HouseVisitLink required

### 7. Component Tests (RNTL)
Test VP UI components:
- `VPInputField` renders label, error, helper text
- `VPDatePickerField` opens picker on tap
- `ModalSelectField` shows options in modal
- `FormScreenLayout` renders title, footer, children
- `StickyActionFooter` disables buttons correctly

## References

- [Testing Setup](references/testing_setup.md) — Jest config, RNTL setup, mock patterns
- [Test Patterns](references/test_patterns.md) — Schema, mapper, store, component test examples
- [Acceptance Checklists](references/acceptance_checklists.md) — Manual QA and NGO stakeholder checklists
- [Failure Scenarios](references/failure_scenarios.md) — Real production edge cases to test against

## Scripts

```bash
# Generate a test file for a module
npx tsx scripts/generate-test.ts <modulePath>

# Check for dead dependencies
npx tsx scripts/check-dead-deps.ts
```
