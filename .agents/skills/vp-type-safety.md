---
name: vp-type-safety
description: TypeScript safety rules for discriminated unions, type guards, and error prevention in VPApp form engine.
---

# VPApp Type Safety & Guards

## Purpose

Prevent TypeScript errors when working with discriminated unions and form data. Enforce type-safe patterns for accessing form-specific properties.

---

## Prohibited Patterns (Never Use)

### 1. `as unknown as` Casting
```typescript
// ❌ Never use - Circumvents type system
const formData = rawData as unknown as ProfessionalFormValues;
```

### 2. Non-Null Assertions (`!`)
```typescript
// ❌ Never use - Assumes value exists without check
const name = formData.personal!.name;
```

### 3. `any` Type for Form Data
```typescript
// ❌ Never use - Disables all type checking
function processForm(data: any) {
  data.personal.name; // No error, but unsafe
}
```

### 4. Direct Property Access on Unions
```typescript
// ❌ Never use - Property might not exist on all union members
function getName(data: FormDataUnion) {
  return data.personal.name; // Error: Property 'personal' does not exist on type 'FormDataUnion'
}
```

### 5. Type Assertions Over Narrowing
```typescript
// ❌ Never use - Prefer narrowing
if ((formData as ProfessionalFormValues).academic) {
  // ...
}
```

---

## Required Patterns (Always Use)

### 1. Type Guards for Union Access

```typescript
// ✅ Always use - Safe narrowing
import { isProfessionalForm, isPUCForm, isPayanaForm } from '@/types/forms';

function ReviewSection({ formData }: { formData: FormDataUnion }) {
  if (isProfessionalForm(formData)) {
    // formData is now narrowed to ProfessionalFormValues
    return <Text>{formData.personal.name}</Text>;
  }
  
  if (isPUCForm(formData)) {
    // formData is now narrowed to PUCFormValues
    return <Text>{formData.personal.name}</Text>;
  }
  
  if (isPayanaForm(formData)) {
    // formData is now narrowed to PayanaFormValues
    return <Text>{formData.personal.studentName}</Text>;
  }
  
  // Exhaustive check (optional but recommended)
  return null;
}
```

### 2. Fallback Values for Guard Failures

```typescript
// ✅ Always provide fallback when guard might fail
const familyData = isProfessionalForm(formData) 
  ? formData.family 
  : { 
      fatherOccupationID: undefined, 
      motherOccupationID: undefined, 
      familyMembers: 1, 
      familyComposition: [], 
      annualIncome: '' 
    };
```

### 3. Exhaustive Switch Statements

```typescript
// ✅ Use exhaustive checking for form type branching
function getReviewComponent(formType: FormType, formData: FormDataUnion) {
  switch (formType) {
    case 'professional':
      return <ProfessionalReview data={formData} />;
    case 'puc':
      return <PUCReview data={formData} />;
    case 'payana':
      return <PayanaReview data={formData} />;
    default:
      // Compile-time check for exhaustive handling
      const _exhaustiveCheck: never = formType;
      return null;
  }
}
```

### 4. Optional Chaining with Guards

```typescript
// ✅ Combine guards with optional chaining for safety
if (isProfessionalForm(formData) && formData.academic?.cetNeetRank) {
  // Safe access to cetNeetRank
}
```

---

## Type Guard Standards

### Available Guards

| Guard | Import | When to Use |
|-------|--------|-------------|
| `isProfessionalForm(data)` | `@/types/forms` | Accessing `academic.cetNeetRank`, Professional-specific fields |
| `isPUCForm(data)` | `@/types/forms` | Accessing `category.casteCategoryId`, PUC-specific fields |
| `isPayanaForm(data)` | `@/types/forms` | Accessing `personal.studentName`, Payana-specific fields |

### Guard Implementation Pattern

```typescript
// From src/types/forms.ts
export const isProfessionalForm = (
  data: FormDataUnion
): data is ProfessionalFormValues => {
  return data && 'academic' in data && 'cetNeetRank' in data.academic;
};

export const isPUCForm = (data: FormDataUnion): data is PucFormValues => {
  return data && 'category' in data && 'casteCategoryId' in data.category;
};

export const isPayanaForm = (data: FormDataUnion): data is PayanaFormValues => {
  return data && 'personal' in data && 'studentName' in data.personal;
};
```

### Guard Rules

1. **Use guards at component entry** - Guard once, then use narrowed type throughout
2. **Provide fallback for all branches** - Never assume guard always passes
3. **Combine guards with optional chaining** - For nested property access
4. **Guard in render methods** - Before accessing form-specific JSX

---

## Common Type Errors & Prevention

### Error 1: `string | undefined not assignable to number`

**Cause:** Type mismatch between schema and usage

**Example:**
```typescript
// ❌ Wrong: Schema expects number, default is string
fatherOccupationID: ''  // Type 'string' not assignable to 'number | undefined'

// ✅ Correct: Use undefined for optional IDs
fatherOccupationID: undefined  // Type 'number | undefined'
```

**Prevention:**
```typescript
// In defaults.ts and store initialization:
fatherOccupationID: undefined as number | undefined,
motherOccupationID: undefined as number | undefined,
collegeTypeID: 1,  // number, not '1'
```

### Error 2: `Property does not exist on union type`

**Cause:** Accessing union property without guard

**Example:**
```typescript
// ❌ Wrong: personal.name might not exist on all union members
const name = formData.personal.name; // Error

// ✅ Correct: Guard first
const name = isProfessionalForm(formData) || isPUCForm(formData)
  ? formData.personal.name
  : isPayanaForm(formData)
  ? formData.personal.studentName
  : '';
```

**Prevention:** Always guard before accessing form-specific properties.

### Error 3: `as unknown as` Circumventing Type System

**Cause:** Using type assertion to bypass errors

**Example:**
```typescript
// ❌ Wrong: Bypassing type check
} as unknown as ProfessionalFormValues;

// ✅ Correct: Proper typing through guards
if (isProfessionalForm(formData)) {
  // Type-safe access
}
```

**Prevention:** Rewrite to use type guards instead of assertions.

### Error 4: Non-Exhaustive Switch Handling

**Cause:** Missing cases in form type switches

**Example:**
```typescript
// ❌ Wrong: Missing payana case
switch (formType) {
  case 'professional': return <ProfessionalForm />;
  case 'puc': return <PUCForm />;
  // payana not handled!
}

// ✅ Correct: Exhaustive with compile-time check
switch (formType) {
  case 'professional': return <ProfessionalForm />;
  case 'puc': return <PUCForm />;
  case 'payana': return <PayanaForm />;
  default: 
    const _exhaustive: never = formType;
    return null;
}
```

**Prevention:** Use `assertNever` pattern for compile-time exhaustiveness checking.

---

## Type Guard Usage Examples

### Section Component Pattern

```typescript
// src/screens/form-sections/professional/PersonalSection.tsx
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';

export default function PersonalSection() {
  const { formData, updateSectionData } = useFormEngineStore();
  
  // Guard at component entry
  const personalData = isProfessionalForm(formData)
    ? formData.personal
    : { name: '', dateOfBirth: '', gender: '', caste: '' };
  
  // Use guarded data throughout component
  return (
    <View>
      <Input value={personalData.name} />
      {/* ... */}
    </View>
  );
}
```

### Review Section Pattern

```typescript
// src/screens/form-sections/professional/ReviewSection.tsx
function renderPersonalSection() {
  if (!isProfessionalForm(formData)) return null;
  
  return (
    <Section title="Personal Details">
      <Text>{formData.personal.name}</Text>
      <Text>{formData.personal.dateOfBirth}</Text>
    </Section>
  );
}
```

### Mapper Pattern

```typescript
// src/mappers/mapApplicationToApi.ts
export function mapToApiPayload(formType: FormType, formData: FormDataUnion) {
  if (isProfessionalForm(formData)) {
    return mapProfessionalToDTO(formData);
  }
  
  if (isPUCForm(formData)) {
    return mapPUCToDTO(formData);
  }
  
  if (isPayanaForm(formData)) {
    return mapPayanaToDTO(formData);
  }
  
  throw new Error(`Unknown form type: ${formType}`);
}
```

---

## Helper Utilities

### `assertNever` for Exhaustive Checks

```typescript
// src/types/forms.ts
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

// Usage in switch statements
switch (formType) {
  case 'professional': return ...;
  case 'puc': return ...;
  case 'payana': return ...;
  default: return assertNever(formType); // Compile error if new form added
}
```

---

## Type Safety Checklist

Before submitting code, verify:

- [ ] No `as unknown as` assertions
- [ ] No non-null assertions (`!.`)
- [ ] No `any` types for form data
- [ ] All union accesses use type guards
- [ ] Fallback values provided for guard failures
- [ ] Switch statements are exhaustive
- [ ] ID fields use `number | undefined`, not `string`
- [ ] Type guards imported from `@/types/forms`

---

## Success Criteria

Type-safe code should:
- Pass `tsc --noEmit` without errors
- Use type guards for all union property access
- Never require `as` assertions for form data
- Handle all form types exhaustively
- Provide meaningful fallbacks for type guards
