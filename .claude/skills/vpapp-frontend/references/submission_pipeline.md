# Submission Pipeline

## Flow

```
User clicks Submit on Review screen
  → preparePayload(formType, formData)     // Returns FormData or JSON
  → submitApplication(formType, payload)   // Routes to correct API function
  → API call (professionalApi, pucApi, etc.)
  → setSubmissionSuccess(true, applicationId)
  → Navigate to success screen
```

## Key Files

| File | Purpose |
|---|---|
| `src/submission/preparePayload.ts` | Dispatches to correct mapper by formType |
| `src/submission/submit.ts` | Routes payload to correct API function |
| `src/submission/validatePayload.ts` | Pre-submission Zod validation |
| `src/submission/attachFiles.ts` | `appendFileToFormData()` helper |
| `src/submission/serializeMultipart.ts` | Multipart serialization utility |
| `src/forms/{type}/mapper.ts` | Per-form payload mapper |

## preparePayload.ts

```typescript
export function preparePayload(formType: FormType, formData: FormDataUnion): SubmissionPayload {
  switch (formType) {
    case 'professional': return professionalMapper(formData as ProfessionalFormValues);
    case 'puc': return pucMapper(formData as PucFormValues);
    case 'payana': return mapPayanaFormToApiPayload(formData as PayanaFormValues); // JSON
    case 'semiProfessional': return semiProfessionalMapper(formData as SemiProfessionalFormValues);
  }
}
```

## submit.ts

```typescript
export async function submitApplication(formType: FormType, payload: SubmissionPayload) {
  switch (formType) {
    case 'professional': return createProfessionalStudent(payload as FormData);
    case 'puc': return createPUCStudent(payload as FormData);
    case 'payana': return createPayanaStudent(payload); // JSON
    case 'semiProfessional': return createSemiProfessionalStudent(payload as FormData);
  }
}
```

## Mapper Conventions

### Professional (PascalCase + FormData)
- ALL field names in PascalCase: `StudentName`, `DateOfBirth`, `GenderID`, etc.
- 16 documents appended via `appendFileToFormData(fd, key, file)`
- `HouseVisitLink` appended as string
- Date formatting via `dayjs`: `YYYY-MM-DD`

### PUC (camelCase + FormData)
- Field names in camelCase: `name`, `dateOfBirth`, `genderID`, etc.
- Documents appended via `appendFileToFormData`

### Payana (camelCase + JSON)
- Field names in camelCase
- Payload is JSON object (NOT FormData)
- File URIs sent as strings (not multipart)

### SemiProfessional (camelCase + FormData)
- Field names in camelCase
- 3 documents appended via `appendFileToFormData`

## File Attachment

```typescript
// src/submission/attachFiles.ts
export function appendFileToFormData(fd: FormData, key: string, file: any): void {
  if (isUploadableFile(file)) {
    fd.append(key, {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
  }
}
```

**Type guard:** `src/types/api.ts`
```typescript
export const isUploadableFile = (obj: any): obj is UploadableFile =>
  obj && typeof obj.uri === 'string';
```

## API Client

**File:** `src/api/client.ts`
- Uses native `fetch` with `AbortController` for timeout (30s)
- Custom `ApiError` class with `status`, `data`, `message`, `code`
- Bearer token auth for protected paths
- Token from `AsyncStorage` key `@vp_auth_user`
- Auto-logout on 401

## API Endpoints

| Form Type | Method | Endpoint |
|---|---|---|
| Professional | POST | `/students/professional/create` |
| Professional Dropdowns | GET | `/students/professional/dropdowns` |
| PUC | POST | `/students/puc/create` |
| Payana | POST | `/api/payanastudent/create` |
| SemiProfessional | POST | `/api/semiprofessionalstudent/create` |

## Base URL

```
https://vpwebservices.testserver.envisage-workflow.in/api
```

Defined in `src/config/environment.ts` as `API_BASE_URL`.

## Pre-Submission Validation

`validatePayload.ts` runs full form schema validation before API call:
```typescript
const result = professionalFormSchema.safeParse(formData);
if (!result.success) {
  return { success: false, errors: result.error.issues.map(i => i.message) };
}
```

## Deprecated

- `src/mappers/mapApplicationToApi.ts` — Legacy mapper, NOT used by submission pipeline. Should be deleted.
