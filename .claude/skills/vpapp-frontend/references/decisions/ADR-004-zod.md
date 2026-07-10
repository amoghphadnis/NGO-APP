# ADR-004: Zod over Yup

**Date:** 2025
**Status:** Accepted

## Context

VPApp needs schema validation for form fields, pre-submission validation, and type inference for form values across 4 form types.

## Decision

Use **Zod** (v4) instead of Yup.

## Rationale

- **Type inference** — `z.infer<typeof schema>` generates TypeScript types from schemas. Yup requires manual type definitions or `@types/yup`.
- **React Hook Form integration** — `@hookform/resolvers/zod` provides seamless `zodResolver` integration.
- **Composable** — Zod schemas compose via `.object()`, `.merge()`, `.optional()`, `.refine()`. Easy to build per-section schemas and combine into full-form schemas.
- **Error messages** — Zod provides detailed error issues with paths and messages. Custom error messages are inline.
- **Custom types** — `z.custom<UploadedDocument>()` handles complex types like file uploads.
- **Tree-shakeable** — Zod is modular. Only imported schemas are bundled.

## Trade-offs

- **Bundle size** — Zod is larger than Yup (~8KB vs ~6KB minified). Acceptable for the type safety benefit.
- **API style** — Zod's chaining API differs from Yup's. Team needed to learn the new syntax.
- **Async validation** — Yup has better built-in async validation. Zod requires `.refine()` with async functions.

## Implementation

```typescript
// Per-section schema
export const professionalPersonalDetailsSchema = z.object({
  StudentName: z.string().min(1, { message: 'Student name is required' }),
  DateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  GenderID: z.number().positive({ message: 'Gender is required' }),
});

// Full form schema (composed)
export const professionalFormSchema = z.object({
  personal: professionalPersonalDetailsSchema,
  contact: professionalContactDetailsSchema,
  // ...
});

// Type export
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
```

**Files:**
- `src/validation/professionalSchemas.ts`
- `src/validation/pucSchemas.ts`
- `src/validation/payanaSchemas.ts`
- `src/validation/semiProfessionalSchemas.ts`
- `src/validation/sharedSchemas.ts`

## Cleanup

`yup` is still listed in `package.json` but is unused. Should be removed.
