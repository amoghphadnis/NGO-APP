---
name: vp-form-engine
description: Multi-Form Engine implementation patterns for VPApp. Defines config-driven forms, section architecture, and reusability standards.
---

# VPApp Form Engine

## Purpose

Codify the Multi-Form Engine implementation pattern. Ensure all forms (current and future) follow identical architecture for maximum code reuse.

---

## Core Principle

> Every new form type must be implementable **without modifying FormRenderer.tsx business logic**.

If a new form requires changing core engine logic, treat it as an architectural review.

---

## Engine Architecture

```
config.ts              ← FormConfig: steps, sections, validation rules
    │
    ▼
FormRenderer.tsx       ← Orchestrates section rendering (STABLE)
    │                    - Reads currentStep from store
    │                    - Renders section from componentMap
    │                    - Handles navigation (Next/Back)
    │                    - NEVER contains form-specific logic
    ▼
Section Component      ← Individual form sections (REUSABLE/FORM-SPECIFIC)
    │                    - PersonalSection, ContactSection, etc.
    │                    - Uses react-hook-form
    │                    - Calls updateSectionData()
    ▼
Zustand Store          ← Central form state (STABLE)
    │                    - formData (union type)
    │                    - currentStep, completedSteps
    │                    - validationState
    ▼
Mapper                 ← UI → API transformation (FORM-SPECIFIC)
    │                    - Field name conversion
    │                    - Type conversion
    │                    - FormData construction
    ▼
API Submission         ← HTTP POST (STABLE)
```

---

## File Structure Per Form Type

```
src/forms/{type}/
├── config.ts          ← REQUIRED: FormConfig, step definitions
├── steps.ts           ← REQUIRED: Step-to-section mapping
├── schema.ts          ← OPTIONAL: Form-specific Zod schemas
├── mapper.ts          ← REQUIRED: UI → API transformation
└── defaults.ts        ← REQUIRED: Initial form state values
```

### Files That Change Per Form

Only these files should be created/modified when adding a new form:

```
forms/{type}/config.ts
forms/{type}/mapper.ts
forms/{type}/schema.ts (if needed)
forms/{type}/defaults.ts
screens/form-sections/{type}/* (section components)
```

### Files That Stay Stable

These files should rarely change:

```
components/FormRenderer.tsx
store/useFormEngineStore.ts (only add new form type to union)
validation/sharedSchemas.ts
api/client.ts
```

---

## Config-Driven Forms

### FormConfig Structure

```typescript
// src/forms/professional/config.ts
export interface FormConfig {
  formType: FormType;
  totalSteps: number;
  steps: FormStep[];
}

export interface FormStep {
  id: string;
  title: string;
  section: string;           // Maps to componentMap key
  validation: z.ZodSchema;   // Zod schema for this step
}

export const professionalConfig: FormConfig = {
  formType: 'professional',
  totalSteps: 9,
  steps: [
    { id: 'personal', title: 'Personal Details', section: 'personal', validation: personalDetailsSchema },
    { id: 'contact', title: 'Contact Details', section: 'contact', validation: contactDetailsSchema },
    { id: 'address', title: 'Address Details', section: 'address', validation: addressDetailsSchema },
    { id: 'family', title: 'Family Details', section: 'family', validation: familyDetailsSchema },
    { id: 'academic', title: 'Academic Details', section: 'academic', validation: academicDetailsSchema },
    { id: 'bank', title: 'Bank Details', section: 'bank', validation: bankDetailsSchema },
    { id: 'documents', title: 'Documents', section: 'documents', validation: documentsSchema },
    { id: 'review', title: 'Review', section: 'review', validation: reviewSchema },
    { id: 'success', title: 'Success', section: 'success', validation: z.object({}) },
  ],
};
```

### Section Registration

```typescript
// src/components/FormRenderer.tsx
const professionalComponentMap = {
  personal: PersonalSection,
  contact: ContactSection,
  address: AddressSection,
  family: FamilySection,
  academic: AcademicSection,
  bank: BankSection,
  documents: DocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const pucComponentMap = {
  personal: PUCPersonalSection,
  contact: PUCContactSection,
  // ... etc
};
```

---

## Section Component Pattern

### Standard Section Structure

```typescript
// src/screens/form-sections/professional/PersonalSection.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { personalDetailsSchema, PersonalDetailsFormValues } from '@/validation/sharedSchemas';

export default function PersonalSection({ navigation }: any) {
  const { formData, updateSectionData, markStepComplete } = useFormEngineStore();
  
  // 1. Guard at component entry
  const personalData = isProfessionalForm(formData)
    ? formData.personal
    : { name: '', dateOfBirth: '', gender: '', caste: '' };
  
  // 2. React Hook Form with Zod
  const { control, handleSubmit, formState } = useForm<PersonalDetailsFormValues>({
    defaultValues: personalData,
    resolver: zodResolver(personalDetailsSchema),
    mode: 'onChange',
  });
  
  // 3. Submit handler
  const onSubmit = (data: PersonalDetailsFormValues) => {
    updateSectionData('personal', data);
    markStepComplete(0); // Current step index
    navigation.goNext();
  };
  
  // 4. Render form fields
  return (
    <View>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Input 
            value={field.value} 
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      {/* ... more fields */}
      <Button onPress={handleSubmit(onSubmit)} title="Next" />
    </View>
  );
}
```

### Section Rules

1. **Use type guard at entry** - `isProfessionalForm(formData)` or equivalent
2. **Provide fallback values** - When guard returns false
3. **React Hook Form + Zod** - Always use this combination
4. **Call updateSectionData** - On submit with section name
5. **Call markStepComplete** - After validation passes
6. **Navigation via props** - Don't import navigation directly

---

## Shared vs Form-Specific Sections

### Current Shared Sections

None yet. All sections are form-specific:

```
src/screens/form-sections/
├── professional/      # 9 sections
├── puc/               # 9 sections  
└── payana/            # 9 sections
```

### Future Shared Sections

When patterns stabilize, extract shared sections:

```
src/screens/form-sections/
├── shared/
│   ├── PersonalSection.tsx    # If identical across forms
│   ├── ContactSection.tsx     # If identical across forms
│   └── AddressSection.tsx     # If identical across forms
├── professional/
├── puc/
└── payana/
```

### Shared Section Criteria

Extract to shared when:
- 3+ forms use identical section logic
- Schema validation is identical
- Field names are identical
- No form-specific conditional logic

---

## Form Data Flow

### Initialization Flow

```
User selects form type
    ↓
FormRenderer mounts with formType prop
    ↓
initializeForm(formType) called
    ↓
Store reset with defaults for form type
    ↓
First section renders with default values
```

### Section Submit Flow

```
User fills section
    ↓
Zod validation (real-time + on submit)
    ↓
handleSubmit(onSubmit) called
    ↓
updateSectionData('sectionName', data)
    ↓
markStepComplete(stepIndex)
    ↓
Navigation to next section
```

### Review Flow

```
All sections marked complete
    ↓
Review section renders
    ↓
Full form validation (all schemas)
    ↓
Mapper transforms to API payload
    ↓
API submission
    ↓
Success/Error handling
```

---

## Reusability Standards

### Target Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| New form-specific code | < 10% | Lines in `forms/{new}/` vs total form lines |
| Code reuse across forms | > 90% | Shared sections, shared schemas, shared components |
| Time to new form | 1 week | From config creation to working submission |

### Reusability Checklist

Before implementing a new form, verify:

- [ ] Can reuse `FormRenderer.tsx` without modification?
- [ ] Can reuse `useFormEngineStore` without modification?
- [ ] Can reuse validation schemas from `sharedSchemas.ts`?
- [ ] Which sections are identical to existing forms?
- [ ] Which sections need form-specific customization?
- [ ] Can sections be parameterized instead of duplicated?

---

## Future Forms

### Planned Form Types

| Form Type | Expected Reuse | New Code Estimate |
|-----------|---------------|-------------------|
| Payana Renewal | 80% | 20% (renewal logic) |
| Professional Renewal | 80% | 20% (renewal logic) |
| House Visit | 60% | 40% (new data model) |
| New NGO Program | 70% | 30% (custom fields) |

### Implementation Order

1. **Payana** - First new form using engine (prove pattern)
2. **Payana Renewal** - Test reuse capabilities
3. **Professional Renewal** - Verify cross-form reuse
4. **House Visit** - Test different data model

---

## Non-Goals (Out of Scope)

This skill does **NOT** define:

- **UI Component Library** → See `vp-ui-system.md`, `vp-ui-design-system.md`
- **API Field Mappings** → See `vp-api-contracts.md`
- **TypeScript Type Guards** → See `vp-type-safety.md`
- **State Management Internals** → See `vp-platform-architecture.md`
- **Error Handling UX** → See `vp-error-handling.md`
- **Backend Contracts** → See `vp-api-contracts.md`

---

## Success Criteria

**Code follows Form Engine when:**

- New forms implemented without modifying FormRenderer.tsx
- Sections use consistent `useForm` + `zodResolver` pattern
- Type guards used at all section entry points
- All forms follow config → renderer → section → store → mapper → API flow
- Code reuse > 90% across form types
- New form implementation time < 1 week

---

## Critical Rule

> If implementing a new form requires changes to FormRenderer.tsx business logic, **STOP** and request architectural review.

This rule protects the Multi-Form Engine from becoming a collection of special cases.
