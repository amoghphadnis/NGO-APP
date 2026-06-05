---
name: vp-api-contracts
description: Backend API contract alignment rules for VPApp. Defines field naming conventions, type conversions, and mapper layer standards for form submissions.
---

# VPApp API Contracts

## Purpose

Ensure the mapper layer adheres to backend contracts. Prevent field naming mismatches, type conversion errors, and API payload inconsistencies.

---

## Contract Categories

### 1. Registration APIs

**Purpose:** Submit student scholarship applications

**Forms:** PUC, Professional, Payana

**Category:** Multi-part form submissions with file uploads

**Contract Pattern:**
- POST endpoints
- Multipart/form-data for file + metadata
- Unique endpoint per form type
- Returns application ID on success

### 2. Dashboard APIs

**Purpose:** Overview metrics and application lists

**Data:** Counts by status, pending/approved/rejected lists

**Category:** Read-only aggregations

**Contract Pattern:**
- GET endpoints
- Short-lived cache (implementation detail)
- Filterable by status, date range

### 3. Approval APIs

**Purpose:** Review workflows and decision tracking

**Data:** Pending approvals, decision submissions, history

**Category:** Workflow state transitions

**Contract Pattern:**
- GET for pending list
- POST for decision submission
- PUT for status updates

### 4. Master Data APIs

**Purpose:** Reference data for dropdowns

**Data:** Districts, castes, occupations, courses, colleges

**Category:** Long-lived reference data

**Contract Pattern:**
- GET endpoints
- Long-lived cache (implementation detail)
- Normalized response structure

---

## Endpoint Stability Note

**Concrete endpoints are implementation details**, not architectural constraints.

- Categories (Registration, Dashboard, Approval, Master Data) are stable
- Specific paths may change during backend refactoring
- Mappers should document which category they belong to, not hardcode endpoints
- Always verify current endpoints in `src/api/*.ts` files

---

## Field Naming Conventions

### Naming Matrix

| Layer | Case | Example |
|-------|------|---------|
| UI/Schema | camelCase | `casteCategoryId` |
| Mapper | camelCase → PascalCase | `CasteCategoryID` |
| API Contract | PascalCase | `CasteCategoryID` |
| Backend | PascalCase | `CasteCategoryID` |

### PascalCase Conversion Rules

UI field → API field transformation:

| UI Field | API Field | Notes |
|----------|-----------|-------|
| `casteCategoryId` | `CasteCategoryID` | camelCase → PascalCase |
| `fatherOccupationId` | `FatherOccupationID` | ID suffix preserved |
| `familyIncome` | `FamilyIncome` | Compound words capitalized |
| `cetNeetRank` | `CET_NEET_Rank` | Acronyms stay uppercase |
| `pincode` | `PinCode` | Common abbreviations |

### Conversion Function Pattern

```typescript
function toPascalCase(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\s+/g, '');
}

// Examples:
// casteCategoryId → CasteCategoryId → CasteCategoryID (manual fix for ID)
// cetNeetRank → CET_NEET_Rank (acronym handling)
```

---

## Type Conversion Rules

### Conversion Matrix

| UI Type | API Type | Conversion | Example |
|---------|----------|------------|---------|
| `number` (ID) | `string` | `.toString()` | `casteCategoryId: 1` → `"1"` |
| `number` (ID) | `number` | Direct pass | `collegeTypeID: 1` → `1` |
| `string` (Rank) | `string` | Direct pass | `cetNeetRank: "12345"` → `"12345"` |
| `Date` | `string` (ISO) | `.toISOString()` | `new Date()` → `"2024-01-15T00:00:00Z"` |
| `File` | `FormData` | `append(key, file)` | File object → multipart |
| `boolean` | `string` | `"true"` / `"false"` | `true` → `"true"` |
| `undefined` | Omitted | Skip append | Optional fields omitted |

### Critical Type Mismatches (Documented)

| Form | UI Field | API Field | UI Type | API Type | Conversion |
|------|----------|-----------|---------|----------|------------|
| **PUC** | `casteCategoryId` | `CasteCategoryID` | `string` | `string` | Direct |
| **PUC** | `fatherOccupationId` | `FatherOccupationID` | `number` | `number` | Direct |
| **PUC** | `familyIncome` | `FamilyIncome` | `string` | `string` | Direct |
| **PUC** | `courseId` | `CourseID` | `string` | `string` | `toString()` |
| **PUC** | `expectedFees` | `ExpectedFees` | `number` | `number` | Direct |
| **Professional** | `annualIncome` | `AnnualIncome` | `string` | `string` | Direct |
| **Professional** | `cetNeetRank` | `CET_NEET_Rank` | `string` | `string` | Direct |
| **Professional** | `collegeTypeId` | `CollegeTypeID` | `number` | `number` | Direct |
| **Professional** | `courseTypeId` | `CourseTypeID` | `string` | `string` | Direct |

---

## Mapper Layer Standards

### File Structure

```
src/forms/
├── professional/
│   └── mapper.ts          # mapProfessionalFormToApiPayload
├── puc/
│   └── mapper.ts          # mapPUCFormToApiPayload
└── payana/
    └── mapper.ts          # mapPayanaFormToApiPayload
```

### Mapper Function Pattern

```typescript
export function mapProfessionalFormToApiPayload(
  formData: ProfessionalFormValues
): FormData {
  const formData = new FormData();
  
  // 1. Personal details - PascalCase conversion
  formData.append('Name', values.personal.name);
  formData.append('DateOfBirth', values.personal.dateOfBirth);
  formData.append('Gender', values.personal.gender);
  formData.append('CasteCategoryID', values.personal.casteCategoryId);
  
  // 2. Type conversion (number → string for some IDs)
  formData.append('FatherOccupationID', values.family.fatherOccupationId?.toString() ?? '');
  
  // 3. Optional fields - only append if defined
  if (values.contact.alternatePhone) {
    formData.append('AlternateNumber', values.contact.alternatePhone);
  }
  
  // 4. File uploads - binary data
  if (values.documents.marksCard?.file) {
    formData.append('SslcMarksCard', {
      uri: values.documents.marksCard.file.uri,
      type: values.documents.marksCard.file.type,
      name: values.documents.marksCard.file.name,
    } as any);
  }
  
  return formData;
}
```

### Mapper Rules

1. **Always create new FormData** - Never modify incoming form data
2. **Use PascalCase for API field names** - Convert UI camelCase
3. **Convert types explicitly** - Document type conversions in comments
4. **Omit undefined values** - Don't append optional fields with undefined
5. **Handle files specially** - Use multipart format for React Native
6. **Validate before mapping** - Assume input is already Zod-validated

---

## Contract Validation Checklist

Before submitting new form integration:

- [ ] All ID fields use correct casing (PascalCase in API)
- [ ] Number IDs converted to strings where API expects strings
- [ ] Optional fields omitted when undefined (not sent as empty strings)
- [ ] File upload keys match API contract exactly (case-sensitive)
- [ ] Enum values match allowed values in API contract
- [ ] Date formats match expected format (ISO 8601)
- [ ] Phone numbers are 10 digits, no country code
- [ ] Pincode is 6 digits, validated before mapping

---

## Non-Goals (Out of Scope)

This skill does **NOT** define:

- **UI Component Structure** → See `vp-platform-architecture.md`, `vp-form-engine.md`
- **TypeScript Type Guards** → See `vp-type-safety.md`
- **Validation Rules** → See validation schemas in `src/validation/`
- **Error Handling** → See `vp-error-handling.md`
- **State Management** → See `vp-platform-architecture.md`

---

## Success Criteria

| Metric | Target |
|--------|--------|
| API contract mismatches | 0 |
| Field naming errors | 0 |
| Type conversion errors | 0 |
| New form integration time | < 1 week |

**Code follows API Contracts when:**
- All mappers use PascalCase for API fields
- Type conversions are explicit and documented
- Optional fields omitted, not sent as empty strings
- File upload keys match contract exactly
- Backend accepts payload without field rejections
