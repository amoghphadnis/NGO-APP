---
trigger: always_on
---
# Project Context Maintenance Rules

## Purpose
`PROJECT_CONTEXT_CURRENT.md` is the single source of truth for the project's
current state. It MUST be kept in sync with the codebase at all times.

## When to Update
Update `PROJECT_CONTEXT_CURRENT.md` after ANY of the following changes:

1. **Form Engine Changes** — New form type added, step config modified, component
   map updated, or FormRenderer logic changed.
2. **Store Changes** — State keys added/removed/renamed in
   `useFormEngineStore.ts`, or action signatures modified.
3. **API Changes** — New endpoint added, base URL changed, mapper logic updated,
   or API client behavior modified.
4. **UI System Changes** — New VP UI component added, legacy component
   migrated, or theme tokens modified.
5. **Validation Changes** — Zod schemas added/modified, validation flow changed,
   or new form type schemas created.
6. **Submission Pipeline Changes** — Mapper, submit, validatePayload, or
   attachFiles logic modified.
7. **New Feature or Screen** — Any new screen, component, or form section added
   to `src/screens/`.
8. **Dependency Changes** — Package added/removed in `package.json`.
9. **Technical Debt Resolved or Introduced** — Any item in the Milestone
   Checklist moves from Pending to Done or vice versa.

## How to Update
- Edit ONLY the affected section(s) — do not rewrite the entire file.
- Update the "Generated" date at the top to the current date.
- Move completed items from Pending to Done in the Milestone Checklist.
- Add new technical debt items to the Pending list as they are discovered.
- Keep the Tree Structure section in sync with `src/` directory changes.
- Verify all file paths and line references are accurate after edits.

## File Location
`PROJECT_CONTEXT_CURRENT.md` lives at the project root:
`f:\NGO APP\App\VPApp\PROJECT_CONTEXT_CURRENT.md`

## Scope
This file covers the `src/` directory and project-level configuration files
(`package.json`, `app.json`, `tsconfig.json`). It does NOT cover:
- `android/` native folder (covered by `.devin/rules/instructions.md`)
- `node_modules/`
- Build output directories