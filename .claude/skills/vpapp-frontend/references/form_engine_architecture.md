# Form Engine Architecture

## Overview

VPApp uses a config-driven multi-form engine. Each form type has its own config defining steps, validation schemas, and component mappings. The `FormRenderer` reads the config and dynamically renders the correct component for the current step.

## Form Types

```typescript
type FormType = 'professional' | 'puc' | 'payana' | 'semiProfessional';
```

## Form Steps

```typescript
type FormStep =
  | 'guidelines' | 'personal' | 'contact' | 'address'
  | 'family' | 'category' | 'academic' | 'bank'
  | 'documents' | 'review' | 'success';
```

## Form Config Structure

Each form type has a config in `src/forms/{type}/config.ts`:

```typescript
interface FormConfig {
  type: FormType;
  title: string;
  description: string;
  steps: FormStep[];        // Ordered list of steps
  totalSteps: number;
  validation: Record<string, any>;  // Step → schema mapping
}
```

## Step Counts

| Form Type | Steps | Count |
|---|---|---|
| Professional | guidelines→personal→contact→address→family→academic→documents→review→success | 9 |
| PUC | guidelines→personal→contact→address→family→category→academic→documents→review→success | 10 |
| Payana | guidelines→personal→contact→address→family→category→academic→bank→documents→review→success | 11 |
| SemiProfessional | guidelines→personal→address→family→academic→documents→review→success | 8 |

## Registry

**File:** `src/forms/shared/registry.ts`

```typescript
const formConfigs: Record<FormType, FormConfig> = {
  professional: professionalFormConfig,
  puc: pucFormConfig,
  payana: payanaFormConfig,
  semiProfessional: semiProfessionalFormConfig,
};

export function getFormConfig(type: FormType): FormConfig { ... }
export function getAllFormTypes(): FormType[] { ... }
```

## FormRenderer

**File:** `src/components/FormRenderer.tsx`

The renderer maintains a component map per form type:

```typescript
const professionalComponentMap: Record<string, React.FC<any>> = {
  guidelines: GuidelinesSection,
  personal: PersonalSection,
  contact: ContactSection,
  // ...
};

const pucComponentMap: Record<string, React.FC<any>> = { ... };
const payanaComponentMap: Record<string, React.FC<any>> = { ... };
const semiProfessionalComponentMap: Record<string, React.FC<any>> = { ... };
```

**Render flow:**
1. `initializeForm(formType)` on mount
2. `getFormConfig(formType)` → get step list
3. `config.steps[currentStep]` → get current step ID
4. Select component map by form type
5. `componentMap[stepId]` → get component
6. Render component with `sectionNavigation` (goBack, navigate)

## Type Guards

**File:** `src/types/forms.ts`

```typescript
export const isProfessionalForm = (data: FormDataUnion): data is ProfessionalFormValues =>
  data && 'academic' in data && !('category' in data);

export const isPUCForm = (data: FormDataUnion): data is PucFormValues => { ... };
export const isPayanaForm = (data: FormDataUnion): data is PayanaFormValues => { ... };
export const isSemiProfessionalForm = (data: FormDataUnion): data is SemiProfessionalFormValues => { ... };
```

## Adding a New Form Type

1. Create `src/forms/{type}/config.ts` with `FormConfig`
2. Create `src/forms/{type}/fileKeys.ts` with document key constants
3. Create `src/forms/{type}/mapper.ts` with payload mapper
4. Create section components in `src/screens/form-sections/{type}/`
5. Add component map in `FormRenderer.tsx`
6. Register config in `src/forms/shared/registry.ts`
7. Add `FormType` union member in `src/forms/shared/types.ts`
8. Add type guard in `src/types/forms.ts`
9. Add Zod schemas in `src/validation/{type}Schemas.ts`
10. Add API function in `src/api/{type}Api.ts`
11. Add case in `preparePayload.ts` and `submit.ts`
12. Update `PROJECT_CONTEXT_CURRENT.md`

## Adding a New Step to Existing Form

1. Add step to `steps` array in `src/forms/{type}/config.ts`
2. Create section component in `src/screens/form-sections/{type}/`
3. Add entry to component map in `FormRenderer.tsx`
4. Create Zod schema in `src/validation/{type}Schemas.ts`
5. Map step to schema in config's `validation` record
6. Update `PROJECT_CONTEXT_CURRENT.md`
