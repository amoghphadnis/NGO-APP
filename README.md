# PROJECT_CONTEXT_CURRENT.md

> **Generated:** July 12, 2026  
> **Project:** Vidya Poshak Scholarship App (VPApp)  
> **Stack:** React Native (Expo 54) + TypeScript + Zustand + React Hook Form + Zod  
> **Purpose:** Comprehensive status report for external stakeholders and AI tools.

---

## Table of Contents

1. [Core Architecture](#1-core-architecture)
2. [Recent Feature Additions (July 11–12, 2026)](#2-recent-feature-additions-july-1112-2026)
3. [Form Implementation Status](#3-form-implementation-status)
4. [API & Networking](#4-api--networking)
5. [UI System Stabilization](#5-ui-system-stabilization)
6. [Validation & Error Handling](#6-validation--error-handling)
7. [Next Steps & Technical Debt](#7-next-steps--technical-debt)
8. [Tree Structure](#8-tree-structure)
9. [Milestone Checklist](#9-milestone-checklist)

---

## 1. Core Architecture

### Config-Driven Multi-Form Engine — STATUS: OPERATIONAL

The app uses a **config-driven multi-form engine** that supports **4 form types**: `professional`, `puc`, `payana`, and `semiProfessional`.

**Entry Point:**
- `src/app/form-engine.tsx` — Expo Router screen that receives `formType` via URL params and delegates to `FormRenderer`.
- `src/components/FormRenderer.tsx` — Core renderer that:
  1. Calls `initializeForm(formType)` on mount via Zustand store.
  2. Looks up the form config from the registry (`getFormConfig(type)`).
  3. Selects the correct **component map** based on form type (`professionalComponentMap`, `pucComponentMap`, `payanaComponentMap`, `semiProfessionalComponentMap`).
  4. Renders the component for `config.steps[currentStep]`.
  5. Provides step-based navigation (`goBack`, `navigate`) via Zustand's `setCurrentStep`.

**Form Registry:** `src/forms/shared/registry.ts`
- Maps each `FormType` to its `FormConfig` (steps, validation schema names, metadata).
- `getFormConfig(type)` throws if config is missing.

**Form Type Union:** `src/forms/shared/types.ts`
```typescript
export type FormType = 'professional' | 'puc' | 'payana' | 'semiProfessional';
```

**Form Configs:**
| Form Type | Config File | Steps | Step Count |
|---|---|---|---|
| Professional | `src/forms/professional/config.ts` | guidelines→personal→contact→address→family→academic→documents→review→success | 9 |
| PUC | `src/forms/puc/config.ts` | guidelines→personal→contact→address→family→category→academic→documents→review→success | 10 |
| Payana | `src/forms/payana/config.ts` | guidelines→personal→contact→address→family→category→academic→bank→documents→review→success | 11 |
| Semi Professional | `src/forms/semiProfessional/config.ts` | guidelines→personal→address→family→academic→documents→review→success | 8 |

### Zustand Store — STATUS: OPERATIONAL

**File:** `src/store/useFormEngineStore.ts` (371 lines)

**Primary State Keys:**
| Key | Type | Description |
|---|---|---|
| `currentFormType` | `FormType \| null` | Active form type |
| `currentStep` | `number` | Zero-indexed step pointer |
| `completedSteps` | `Record<number, boolean>` | Map of completed step indices |
| `formData` | `FormDataUnion` | Union of all form value types (Professional, PUC, Payana, SemiProfessional) |
| `validationState` | `Record<string, { isValid, errors?, data? }>` | Per-step validation results |
| `uploadState` | `Record<string, DocumentsMetaItem>` | Per-document upload tracking (isUploading, uploaded, progress, error) |
| `submissionState` | `{ isSubmitting, isSubmitted, error?, applicationId? }` | Submission lifecycle state |

**Actions:**
- `initializeForm(formType)` — Resets state and initializes form-specific defaults (formData, uploadState).
- `setCurrentStep(step)` — Navigate to a step by index.
- `markStepComplete(step)` — Mark a step as completed.
- `updateSectionData(section, data)` — Merge data into a form section (handles form-specific section routing).
- `updateValidationState(step, validation)` — Store validation results per step.
- `updateUploadState(documentKey, meta)` — Update upload progress for a document.
- `setSubmissionLoading/Error/Success` — Manage submission lifecycle.
- `resetForm()` — Reset to initial state (defaults to Professional form).

**Getters:**
- `getCurrentStepConfig()` — Returns validation config for the current step.
- `getFormProgress()` — Returns percentage of completed steps.

---

## 2. Recent Feature Additions (July 11–12, 2026)

### 2.1 Semi Professional House Visit Module

**Status:** OPERATIONAL

Added full student listing and house-visit navigation for Semi Professional students, reusing the existing `StudentListScreen` and `VolunteerStudentRow` components.

**New files:**
- `src/api/semiProfessionalStudentApi.ts` — `GET` student list with query params and PascalCase→camelCase normalization.
- `src/app/volunteer/semi-professional.tsx` — Volunteer listing route.

**Modified files:**
- `src/types/studentList.ts` — Added `SemiProfessionalStudent` interface and `'semiProfessional'` to `StudentType` union.
- `src/screens/volunteer/StudentListScreen.tsx` — Added semi-professional branch to React Query hook.
- `src/app/approval/semi-professional.tsx` — Fixed to use `studentType="semiProfessional"`.
- `src/api/houseVisitApi.ts` — Added `'semiProfessional'` to `getHouseVisitLink` source union.
- `src/types/dashboard.ts` — Added `PendingSemiProfessional` to dashboard response types.
- `src/app/dashboard.tsx` and `src/app/pdashboard.tsx` — Added Semi Professional stat cards, drawer items, and real-time counts.

### 2.2 Welcome Dashboard Notifications

**Status:** OPERATIONAL

Rewrote `src/app/notifications.tsx` from a static empty state to a data-driven notifications screen. Fetches dashboard data (`getDashboard` / `getPDashboard` based on role) and renders pending items as notification cards with counts, icons, routes, colors, pull-to-refresh, plus loading, empty, and error states.

### 2.3 Register Screen Refresh

**Status:** COMPLETE

Updated `src/screens/auth/RegisterScreen.tsx` and `src/api/registrationApi.ts`:
- Removed the "Other District" field and related state/schema/API payload key.
- Added a Terms & Conditions acceptance checkbox that gates the Register button.
- Replaced separate Privacy and Terms links with a single combined PDF link (`PrivacyAndTerms.pdf`) in both Register and Login screens.

### 2.4 Home (Welcome) Screen Redesign

**Status:** COMPLETE

Redesigned `src/app/form-selection.tsx` as a premium, student-friendly landing experience:
- Hero header with full-bleed `assets/hero-banner.png` background.
- Primary action cards: Login/My Dashboard + Apply for Scholarship.
- Config-driven scholarship sections (New + Renewal) rendered from `src/config/homeSections.ts`.
- New Scholarship cards displayed in a 2×2 grid.
- Renewal scholarships in a green-accented compact list.
- Support card and Material 3-inspired bottom navigation (Home, Notifications, My Applications, Help).

**New files:**
- `src/config/homeSections.ts` — Config-driven data source for scholarship/renewal sections.
- `src/utils/navigateToDashboard.ts` — Role-aware dashboard router (Volunteer → `/dashboard`; Program Manager/Admin → `/pdashboard`).
- `src/app/my-applications.tsx` and `src/app/help.tsx` — Lightweight "Coming Soon" placeholder screens.

**Modified files:**
- `src/app/_layout.tsx` — Registered `my-applications` and `help` routes.

---

## 3. Form Implementation Status

### Shared Sections Folder Audit (`src/screens/form-sections/`)

All form sections are organized by form type in subdirectories. Each section component uses the VP UI System (`FormScreenLayout`, `VPInputField`, `FormCard`, `FormSectionHeader`, `StickyActionFooter`).

#### Professional Form (10 screens) — FULLY MIGRATED TO VP UI
| Section | File | VP UI Components Used |
|---|---|---|
| Guidelines | `professional/GuidelinesSection.tsx` | FormScreenLayout, FormCard, FormSectionHeader |
| Personal | `professional/PersonalSection.tsx` | FormScreenLayout, VPInputField, VPDatePickerField, ModalSelectField, FormCard |
| Contact | `professional/ContactSection.tsx` | FormScreenLayout, VPInputField, FormCard |
| Address | `professional/AddressSection.tsx` | FormScreenLayout, VPInputField, ModalSelectField, FormCard |
| Family | `professional/FamilySection.tsx` | FormScreenLayout, VPInputField, ModalSelectField, FormCard |
| Academic | `professional/AcademicSection.tsx` | FormScreenLayout, VPInputField, ModalSelectField, FormCard |
| Bank | `professional/BankSection.tsx` | FormScreenLayout, VPInputField, FormCard |
| Document | `professional/DocumentSection.tsx` | FormScreenLayout, FileUploadField, FormCard |
| Review | `professional/ReviewSection.tsx` | FormScreenLayout, FormCard, FormSectionHeader |
| Success | `professional/SuccessSection.tsx` | FormScreenLayout, FormCard, FormSectionHeader |

#### PUC Form (7 screens) — FULLY MIGRATED TO VP UI
Shares Guidelines, Review, and Success sections with Professional form. Has its own Personal, Contact, Address, Family, Category, Academic, Document sections.

#### Payana Form (9 screens) — FULLY MIGRATED TO VP UI
Has its own Guidelines section. Shares Review and Success with Professional. Has unique Bank section. All sections use VP UI components.

#### Semi Professional Form (8 screens) — FULLY MIGRATED TO VP UI
Has its own Guidelines, Review, and Success sections. No Contact, Category, or Bank sections (simpler form). All sections use VP UI components.

#### Renewal Forms (3 screens) — PARTIALLY MIGRATED
- `renewal/RenewalPUCForm.tsx`
- `renewal/RenewalPayanaForm.tsx`
- `renewal/RenewalProfessionalForm.tsx`
These use `VPInputField` but are larger monolithic forms (not split into individual section components).

### PascalCase Field Name Verification — Professional Form: CONFIRMED

The Professional form correctly uses **PascalCase** field names throughout the stack to match the backend API contract:

- **Zod Schemas** (`src/validation/professionalSchemas.ts`): `StudentName`, `DateOfBirth`, `GenderID`, `CasteCategoryID`, `Email`, `ContactNumber`, `DistrictID`, `Taluk`, `PlaceID`, `Address`, `FatherOccupationID`, `MotherOccupationID`, `FamilyMembers`, `AnnualIncome`, `PUPercentage`, `CET_NEET_Rank`, `CourseTypeID`, `CollegeName`, `CollegeTypeID`, `CollegeFees`, `HouseVisitLink`, and all 16 document keys (`PUCMarksCard`, `IncomeCertificate`, etc.)
- **Store Initial State** (`useFormEngineStore.ts`): Matches PascalCase exactly.
- **Mapper** (`src/forms/professional/mapper.ts`): Appends all fields using PascalCase keys to FormData.
- **Screen Components** (e.g., `PersonalSection.tsx`): `useForm` defaultValues and Controller `name` props use PascalCase.

**Note:** PUC, Payana, and SemiProfessional forms use **camelCase** field names (intentional — they target different API contracts).

---

## 4. API & Networking

### Base URL

**File:** `src/config/environment.ts`
```
API_BASE_URL = 'https://vpwebservices.testserver.envisage-workflow.in/api'
API_TIMEOUT = 30000ms
MAX_FILE_SIZE = 5MB (documents)
MAX_IMAGE_SIZE = 2MB (images)
```

### API Client

**File:** `src/api/client.ts` (220 lines)
- Uses **native `fetch`** (NOT axios) with `AbortController` for timeout.
- Custom `ApiError` class mirrors axios error shape (`response.status`, `response.data`, `message`, `code`).
- Bearer token authentication for protected paths (`/welcomedashboard`, `/pucstudents`, `/professionalstudents`, `/payanastudents`, `/semiprofessionalstudent`).
- Token retrieved from `AsyncStorage` key `@vp_auth_user`.
- Auto-logout on 401 responses.
- Exposes `api.get()`, `api.post()`, `api.put()`, `api.delete()`, `api.patch()`.

### Active Endpoints

| Category | Method | Endpoint | File |
|---|---|---|---|
| Registration | POST | `/registration/register` | `registrationApi.ts` |
| Registration | POST | `/registration/forgotpassword` | `registrationApi.ts` |
| Registration | POST | `/registration/resetpassword` | `registrationApi.ts` |
| Registration | GET | `/registration/google-login` (redirect) | `registrationApi.ts` |
| Auth (Login) | POST | `/registration/login` | `authApi.ts` |
| Professional Submit | POST | `/students/professional/create` | `professionalApi.ts` |
| Professional Dropdowns | GET | `/students/professional/dropdowns` | `professionalApi.ts` |
| PUC Submit | POST | `/students/puc/create` | `pucApi.ts` |
| PUC Dropdowns | GET | `/students/puc/dropdowns` | `pucApi.ts` |
| Payana Submit | POST | `/api/payanastudent/create` | `payanaApi.ts` |
| SemiProf Submit | POST | `/api/semiprofessionalstudent/create` | `semiProfessionalApi.ts` |
| SemiProf Student List | GET | `/api/semiprofessionalstudent/studentlist` | `semiProfessionalStudentApi.ts` |
| Dashboard | GET | `/welcomedashboard/dashboard` | `dashboardApi.ts` |
| PDashboard | GET | `/welcomedashboard/pdashboard` | `dashboardApi.ts` |
| House Visit | POST/GET | `/housevisit/*` | `houseVisitApi.ts` |
| Approval | GET/POST | `/approval/*` | `approvalApi.ts` |

### Multipart Mapper — Professional Form: CONFIRMED (16 documents)

**Active Mapper:** `src/forms/professional/mapper.ts` (170 lines)
- Builds `FormData` with all personal, contact, address, family, academic fields in PascalCase.
- Appends all **16 document files** using `appendFileToFormData()`:
  `PUCMarksCard`, `IncomeCertificate`, `Rationcard`, `Electricitybill`, `CollegeID`, `Admissionproof`, `FeesReceipts`, `Expenditure`, `Studentphoto`, `Photoinfrontofcollege`, `Dwellingunit`, `CET`, `Studentpass`, `Monthsbank`, `AadharCard`, `Handwritten`
- Also appends `HouseVisitLink` (string URL).
- Uses `dayjs` for date formatting (`YYYY-MM-DD`).

**File Key Constants:** `src/forms/professional/fileKeys.ts` — Centralized `PROFESSIONAL_FILE_KEYS` object.

**Legacy Mapper (DEPRECATED):** `src/mappers/mapApplicationToApi.ts` still exists but is **NOT used** by the submission pipeline. It references old camelCase field names (`formData.personal.name`, `formData.contact.email`, etc.) and only handles 3 documents. The active pipeline uses `professionalMapper` via `preparePayload.ts`.

### Submission Pipeline

```
preparePayload(formType, formData)  →  submitApplication(formType, payload)  →  API call
```

- `src/submission/preparePayload.ts` — Dispatches to correct mapper based on formType.
- `src/submission/submit.ts` — Routes to correct API function based on formType.
- `src/submission/validatePayload.ts` — Pre-submission Zod validation per formType.
- `src/submission/attachFiles.ts` — `appendFileToFormData()` helper for safe file attachment.
- `src/submission/serializeMultipart.ts` — Multipart serialization utility.

**Payana Exception:** Uses JSON payload (not FormData) with file URIs as strings.

---

## 5. UI System Stabilization

### VP UI System Components — STATUS: FULLY DEPLOYED

All form section screens (35 files across professional, puc, payana, semiProfessional) use the VP UI System:

| Component | File | Usage |
|---|---|---|
| `FormScreenLayout` | `src/components/layout/FormScreenLayout.tsx` | 35 form screens |
| `StickyActionFooter` | `src/components/common/StickyActionFooter.tsx` | Integrated into FormScreenLayout |
| `ProgressHeader` | `src/components/layout/ProgressHeader.tsx` | Integrated into FormScreenLayout |
| `VPInputField` | `src/components/common/VPInputField.tsx` | 37 files (all form sections + auth + renewal) |
| `VPDatePickerField` | `src/components/common/VPDatePickerField.tsx` | Personal/Academic sections |
| `ModalSelectField` | `src/components/common/ModalSelectField.tsx` | Dropdown fields across forms |
| `FormCard` | `src/components/common/FormCard.tsx` | All form sections |
| `FormSectionHeader` | `src/components/common/FormSectionHeader.tsx` | All form sections |
| `Button` | `src/components/common/Button.tsx` | Used in StickyActionFooter |
| `Stepper` | `src/components/common/Stepper.tsx` | Numeric stepper fields |
| `SegmentedControl` | `src/components/common/SegmentedControl.tsx` | Toggle/segmented inputs |
| `Chip` | `src/components/common/Chip.tsx` | Tag/chip selectors |
| `LegalModal` | `src/components/common/LegalModal.tsx` | Legal text modal |

### Legacy Component Audit

| Legacy Component | Status | Notes |
|---|---|---|
| `InputField.tsx` | NOT FOUND | No standalone legacy InputField component exists in the codebase |
| `ScreenWrapper.tsx` | NOT FOUND | No ScreenWrapper component exists anywhere |
| Inline `InputField` in HouseVisitFormScreen | STILL PRESENT | `src/screens/house-visit/HouseVisitFormScreen.tsx` defines a local `InputField` component inline (lines 40-54). This is NOT a shared legacy component but a local definition that should be migrated to `VPInputField`. |
| `mapApplicationToApi.ts` (legacy mapper) | DEPRECATED | Still in `src/mappers/` but not used by submission pipeline |

### Theme System Audit

**File:** `src/theme/` (5 files)

#### Colors (`colors.ts`) — DEFINED PALETTE
| Token | Value |
|---|---|
| primary | `#4F5DFF` |
| primaryDark | `#3F4AE0` |
| background | `#F5F6FA` |
| card | `#FFFFFF` |
| darkMode | `#132749` |
| textPrimary | `#1A1A1A` |
| textSecondary | `#6B7280` |
| textTitle | `#FFFFFF` |
| textSubtitle | `#9CA3AF` |
| border | `#E5E7EB` |
| success | `#22C55E` |
| error | `#EF4444` |
| warning | `#F59E0B` |
| disabled | `#D1D5DB` |
| splash | `#208AEF` |

#### Spacing (`spacing.ts`) — 8PT GRID COMPLIANT
| Token | Value | 8pt Multiple |
|---|---|---|
| xs | 4 | 0.5x |
| sm | 8 | 1x |
| md | 16 | 2x |
| lg | 24 | 3x |
| xl | 32 | 4x |
| xxl | 40 | 5x |
| xxxl | 48 | 6x |
| xxxxl | 56 | 7x |

**Form-specific spacing:** `screenHorizontal: 20`, `sectionSpacing: 24`, `fieldSpacing: 20`, `labelSpacing: 8`, `cardPadding: 20`, `footerPadding: 16`, `borderRadius: 16`, `scrollViewBottomPadding: 140`.

#### Typography (`typography.ts`) — MINIMAL
Only defines 4 font sizes: `h1: 24`, `h2: 20`, `body: 16`, `caption: 14`. No line heights, font weights, or font families. **Most typography logic lives in `platform.ts`** which has comprehensive platform-normalized font sizes and line heights.

#### Platform Normalization (`platform.ts`) — COMPREHENSIVE
- Platform-specific font sizes (iOS vs Android with +1-2px on Android).
- Platform-specific line heights.
- Input normalization (56px min height, Android-specific padding).
- Touch target standards (48px min, 56px button height).
- Elevation/shadow per platform.

#### Design System Documentation (`DESIGN_SYSTEM.md`)
213-line design system spec documenting all components, spacing rules, accessibility requirements, color system, and implementation rules.

---

## 6. Validation & Error Handling

### Zod + React Hook Form — MODULARIZED BY FORM TYPE

**Validation Files:**
| File | Scope | Description |
|---|---|---|
| `src/validation/sharedSchemas.ts` | Shared | Personal, contact, address, family, guidelines schemas (camelCase, used by PUC) |
| `src/validation/professionalSchemas.ts` | Professional | All sections in PascalCase (personal, contact, address, family, academic, documents, bank) |
| `src/validation/pucSchemas.ts` | PUC | PUC-specific family, category, academic, document schemas |
| `src/validation/payanaSchemas.ts` | Payana | Payana-specific schemas |
| `src/validation/semiProfessionalSchemas.ts` | SemiProfessional | SemiProf-specific schemas |
| `src/validation/renewalProfessionalSchemas.ts` | Renewal | Professional renewal schemas |
| `src/validation/renewalPucSchemas.ts` | Renewal | PUC renewal schemas |
| `src/validation/renewalPayanaSchemas.ts` | Renewal | Payana renewal schemas |
| `src/validation/formSchemas.ts` | Shared | Additional form-level schemas |
| `src/validation/houseVisitSchemas.ts` | House Visit | House visit form schemas |

**Pattern:** Each form section uses `useForm` with `zodResolver(schema)` and `mode: 'onChange'` for real-time validation. On submit, data is pushed to the Zustand store via `updateSectionData()` and `updateValidationState()`.

**Pre-Submission Validation:** `src/submission/validatePayload.ts` runs full form schema validation (`professionalFormSchema.safeParse()`, etc.) before API submission.

### Review Screen Gatekeeper — STATUS: OPERATIONAL

**Professional Review** (`src/screens/form-sections/professional/ReviewSection.tsx`):
- `isFormComplete()` checks:
  - Personal: `StudentName` + `DateOfBirth` present
  - Contact: `Email` + `ContactNumber` present
  - Address: `DistrictID` + `Taluk` present
  - Family: `FamilyMembers > 0`
  - Academic: `CourseTypeID` + `CollegeName` + `CollegeFees > 0`
  - Documents: All 16 documents present + `HouseVisitLink` starts with `https://`
- `canSubmit = isFormComplete() && declarationAccepted`
- Submit button disabled until `canSubmit` is true.
- On submit: calls `preparePayload()` → `submitApplication()` → stores result via `setSubmissionSuccess()`.

**SemiProfessional Review** (`src/screens/form-sections/semiProfessional/ReviewSection.tsx`):
- Checks personal, address, family, academic completeness.
- Same declaration gate pattern.

**Payana Review:** Uses shared Professional `ReviewSection.tsx` with `isPayanaForm()` branch checking personal, contact, address, family, academic, bank, and agreement.

### Success Screen Reference ID Extraction — STATUS: OPERATIONAL

**Professional Success** (`src/screens/form-sections/professional/SuccessSection.tsx`):
- Extracts `applicationId` from `submissionState.applicationId`.
- **Fallback:** Generates a random ID: `VP{year}{6-digit-random}` if API doesn't return one.
- Displays: Application ID, Student Name, Submission Date, Form Type.
- Shows process timeline and next steps.
- Action buttons: "Go to Home" and "Exit Application" (both call `resetForm()`).

**SemiProfessional Success** (`src/screens/form-sections/semiProfessional/SuccessSection.tsx`):
- Extracts `applicationId` from `submissionState.applicationId` (set from `response.data?.studentId` or `response.data?.applicationId`).
- **Fallback:** Generates `VPSP{year}{6-digit-random}`.

**Review Section ID Extraction:**
- Professional: `setSubmissionSuccess(true, response.data?.applicationId || undefined)`
- SemiProfessional: `setSubmissionSuccess(true, response.data?.studentId?.toString() || response.data?.applicationId || undefined)`

---

## 7. Next Steps & Technical Debt

### Known Issues & Technical Debt

| # | Issue | Severity | Status | Details |
|---|---|---|---|---|
| 1 | **Legacy `mapApplicationToApi.ts`** | Low | Pending Cleanup | `src/mappers/mapApplicationToApi.ts` uses old camelCase field names and only handles 3 documents. Not used by submission pipeline but still exists. Should be deleted. |
| 2 | **`axios` in dependencies but unused** | Low | Pending Cleanup | `package.json` lists `axios: ^1.16.0` but API client uses native `fetch`. Can be removed. |
| 3 | **`yup` in dependencies but unused** | Low | Pending Cleanup | `package.json` lists `yup: ^1.7.1` but validation uses `zod: ^4.4.2`. Can be removed. |
| 4 | **`typography.ts` is minimal** | Low | Pending Enhancement | Only defines 4 font sizes. Most typography lives in `platform.ts`. Should be consolidated. |
| 5 | **House Visit form uses inline `InputField`** | Medium | Pending Migration | `src/screens/house-visit/HouseVisitFormScreen.tsx` defines a local `InputField` component instead of using `VPInputField`. Should be migrated to VP UI System. |
| 6 | **`resetForm()` defaults to Professional** | Medium | Pending Fix | `resetForm()` always resets `formData` to Professional form defaults regardless of `currentFormType`. Should reset to the current form type's defaults or call `initializeForm()`. |
| 7 | **Success Screen form type display hardcoded** | Low | Pending Fix | Professional `SuccessSection.tsx` line 80 checks `currentFormType === 'professional'` but defaults to "PUC Scholarship" for all other types, which is incorrect for Payana/SemiProfessional. |
| 8 | **PUC form shares Review/Success with Professional** | Low | Pending Enhancement | PUC form uses Professional's `ReviewSection` and `SuccessSection` which have Professional-specific completeness checks. PUC-specific review logic may be needed. |
| 9 | **Document validation schemas mark all docs as `.optional()`** | Medium | Pending Review | `professionalDocumentDetailsSchema` marks all 16 documents as optional, but the Review gatekeeper enforces them as required. Schema and gatekeeper are misaligned. |
| 10 | **Network Error handling** | Low | Mitigated | API client catches `Network request failed` and SSL errors with descriptive messages. Previous Axios "Network Error" issue is resolved by using native `fetch`. |

### TypeScript Status

- **TypeScript:** `~5.9.2` (dev dependency)
- **Types are well-defined:** `FormDataUnion`, `ProfessionalFormValues`, `PucFormValues`, `PayanaFormValues`, `SemiProfessionalFormValues` with type guards (`isProfessionalForm`, `isPUCForm`, `isPayanaForm`, `isSemiProfessionalForm`).
- **Some `as unknown as` casts** are used in the store for form type narrowing (acceptable given the union type architecture).
- **`any` types** exist in navigation props (`{ navigation }: any`) across most screen components — could be typed with a shared `FormNavigation` interface.

### Project Guardrails

| File | Status |
|---|---|
| `.devin/instructions.md` | NOT FOUND in repository |
| `.windsurf/instructions.md` | NOT FOUND in repository |
| `MEMORY[instructions.md]` | ACTIVE as user rules (loaded via IDE memory system, not as a file) |

The guardrails (native build constraints, Android manifest overrides, Gradle credentials, compilation workflow) are enforced through the IDE's memory system but are **not committed to the repository**. Consider adding them as a `.devin/instructions.md` or `.windsurf/instructions.md` file for persistence.

---

## 8. Tree Structure

```
src/
├── api/
│   ├── approvalApi.ts
│   ├── authApi.ts
│   ├── client.ts                          # Native fetch API client (replaces axios)
│   ├── dashboardApi.ts
│   ├── houseVisitApi.ts
│   ├── payanaApi.ts
│   ├── payanaStudentApi.ts
│   ├── professionalApi.ts                 # POST /students/professional/create
│   ├── professionalStudentApi.ts
│   ├── pucApi.ts
│   ├── pucStudentApi.ts
│   ├── registrationApi.ts                 # /registration/* endpoints
│   ├── renewalPayanaApi.ts
│   ├── renewalProfessionalApi.ts
│   ├── renewalPucApi.ts
│   ├── semiProfessionalApi.ts
│   ├── semiProfessionalStudentApi.ts           # Semi Professional student listing API
│   ├── studentApi.ts
│   └── transformers/
│       ├── normalizeApiResponse.ts
│       ├── normalizeDropdowns.ts
│       └── normalizeSemiProfDropdowns.ts
├── app/
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   ├── form-engine.tsx                    # Entry point for form rendering
│   ├── form-selection.tsx                 # Redesigned home/welcome landing screen
│   ├── help.tsx                           # Coming Soon placeholder
│   ├── index.tsx
│   ├── login.tsx
│   ├── my-applications.tsx                # Coming Soon placeholder
│   ├── notifications.tsx                  # Data-driven notifications screen
│   ├── pdashboard.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── renewal-payana.tsx
│   ├── renewal-professional.tsx
│   ├── renewal-puc.tsx
│   ├── approval/                          # (4 items)
│   ├── housevisit/
│   ├── legal/
│   └── volunteer/
├── components/
│   ├── FormRenderer.tsx                   # Config-driven form renderer
│   ├── animated-icon.tsx / .web.tsx
│   ├── app-tabs.tsx / .web.tsx
│   ├── external-link.tsx
│   ├── hint-row.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── web-badge.tsx
│   ├── approval/                          # (2 items)
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Chip.tsx
│   │   ├── FormCard.tsx
│   │   ├── FormSectionHeader.tsx
│   │   ├── LegalModal.tsx
│   │   ├── ModalSelectField.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── Stepper.tsx
│   │   ├── StickyActionFooter.tsx         # VP UI System
│   │   ├── VPDatePickerField.tsx          # VP UI System
│   │   └── VPInputField.tsx               # VP UI System
│   ├── form/
│   │   ├── DropdownField.tsx
│   │   └── FileUploadField.tsx
│   ├── layout/
│   │   ├── FormScreenLayout.tsx           # VP UI System
│   │   └── ProgressHeader.tsx
│   ├── student/
│   └── volunteer/
├── config/
│   ├── environment.ts                     # API_BASE_URL, timeouts, file limits
│   └── homeSections.ts                    # Config-driven home scholarship/renewal sections
├── constants/
│   ├── formOptions.ts                     # Required documents per form type
│   └── (2 more items)
├── forms/
│   ├── shared/
│   │   ├── types.ts                       # FormType, FormStep, FormConfig
│   │   └── registry.ts                    # Form config registry
│   ├── professional/
│   │   ├── config.ts                      # 9-step config
│   │   ├── fileKeys.ts                    # 16 document key constants
│   │   ├── mapper.ts                      # PascalCase FormData mapper (ACTIVE)
│   │   └── uploads.ts
│   ├── puc/
│   │   ├── config.ts                      # 10-step config
│   │   ├── fileKeys.ts
│   │   ├── mapper.ts
│   │   └── uploads.ts
│   ├── payana/
│   │   ├── config.ts                      # 11-step config
│   │   ├── fileKeys.ts
│   │   ├── mapper.ts                      # JSON payload (not FormData)
│   │   └── uploads.ts
│   └── semiProfessional/
│       ├── config.ts                      # 8-step config
│       ├── fileKeys.ts
│       ├── mapper.ts
│       └── uploads.ts
├── hooks/                                 # (6 items)
├── mappers/
│   └── mapApplicationToApi.ts             # DEPRECATED legacy mapper
├── navigation/                            # (empty)
├── screens/
│   ├── form-sections/
│   │   ├── professional/                  # 10 section components
│   │   ├── puc/                           # 7 section components
│   │   ├── payana/                        # 9 section components
│   │   ├── semiProfessional/              # 8 section components
│   │   └── renewal/                       # 3 renewal form components
│   ├── auth/                              # Login, Register, ForgotPassword, ResetPassword
│   ├── house-visit/                       # HouseVisitFormScreen + components
│   └── (remaining screens)
├── services/                              # (2 items)
├── store/
│   └── useFormEngineStore.ts              # Zustand store (371 lines)
├── submission/
│   ├── attachFiles.ts                     # File attachment helper
│   ├── index.ts                           # Re-exports
│   ├── preparePayload.ts                  # Payload dispatcher
│   ├── serializeMultipart.ts
│   ├── submit.ts                          # API call dispatcher
│   ├── validatePayload.ts                 # Pre-submission Zod validation
│   └── __tests__/
├── theme/
│   ├── colors.ts                          # 15 color tokens
│   ├── spacing.ts                         # 8pt grid spacing
│   ├── typography.ts                      # Minimal (4 font sizes)
│   ├── platform.ts                        # Platform normalization (133 lines)
│   └── DESIGN_SYSTEM.md                   # Design system documentation
├── types/
│   ├── forms.ts                           # FormDataUnion, type guards
│   ├── api.ts                             # API types, UploadableFile
│   ├── documents.ts                       # Document type interfaces
│   └── (3 more items)
├── utils/                                 # (14 items)
│   ├── navigateToDashboard.ts             # Role-aware dashboard navigation helper
├── validation/
│   ├── sharedSchemas.ts                   # Shared Zod schemas (camelCase)
│   ├── professionalSchemas.ts             # Professional Zod schemas (PascalCase)
│   ├── pucSchemas.ts                      # PUC Zod schemas
│   ├── payanaSchemas.ts                   # Payana Zod schemas
│   ├── semiProfessionalSchemas.ts         # SemiProfessional Zod schemas
│   ├── renewalProfessionalSchemas.ts
│   ├── renewalPucSchemas.ts
│   ├── renewalPayanaSchemas.ts
│   ├── formSchemas.ts
│   └── houseVisitSchemas.ts
└── global.css
```

---

## 9. Milestone Checklist

### Done

- [x] **Config-Driven Multi-Form Engine** — 4 form types registered (professional, puc, payana, semiProfessional)
- [x] **FormRenderer** — Component map dispatch per form type with step-based navigation
- [x] **Zustand Store** — Full state management (formData, completedSteps, uploadState, validationState, submissionState)
- [x] **Form Registry** — Centralized config lookup with `getFormConfig()` and `getAllFormTypes()`
- [x] **Professional Form** — 9 steps, 10 section components, PascalCase field names, 16-document multipart mapper
- [x] **PUC Form** — 10 steps, 7 section components + shared sections
- [x] **Payana Form** — 11 steps, 9 section components, JSON payload submission
- [x] **SemiProfessional Form** — 8 steps, 8 section components, 3-document upload
- [x] **VP UI System** — FormScreenLayout, StickyActionFooter, VPInputField, VPDatePickerField, FormCard, FormSectionHeader, ModalSelectField, Stepper, SegmentedControl, Chip
- [x] **All 35 form section screens** use FormScreenLayout + VP UI components
- [x] **Theme System** — colors.ts (15 tokens), spacing.ts (8pt grid), platform.ts (comprehensive normalization)
- [x] **Design System Documentation** — DESIGN_SYSTEM.md (213 lines)
- [x] **Zod Validation** — Modularized by form type (shared, professional, puc, payana, semiProfessional, renewal)
- [x] **React Hook Form Integration** — `zodResolver` with `mode: 'onChange'` across all sections
- [x] **Pre-Submission Validation** — `validatePayload.ts` runs full schema validation
- [x] **Review Screen Gatekeeper** — `isFormComplete()` + declaration checkbox before submit
- [x] **Success Screen** — Reference ID extraction from API response with fallback generation
- [x] **API Client** — Native fetch with timeout, Bearer token auth, auto-logout on 401
- [x] **Multipart Mapper** — `professionalMapper` handles all 16 documents + all fields in PascalCase
- [x] **Submission Pipeline** — `preparePayload` → `submitApplication` → form-specific API call
- [x] **API Error Handling** — Custom `ApiError` class with status, data, code; descriptive status messages
- [x] **Dropdown Normalization** — Transformers for professional, semiProfessional dropdowns
- [x] **Renewal Forms** — 3 renewal form types (Professional, PUC, Payana) with own schemas and APIs
- [x] **House Visit Form** — Comprehensive 12-section form with file upload
- [x] **Auth Screens** — Login, Register, ForgotPassword, ResetPassword
- [x] **Dashboard** — Student and volunteer dashboards
- [x] **Approval Workflow** — Approval screens and API
- [x] **Semi Professional House Visit** — Student listing, house-visit link, dashboard counts
- [x] **Welcome Dashboard Notifications** — Data-driven notifications with loading/empty/error states
- [x] **Register Refresh** — Terms checkbox, single PDF link, removed Other District
- [x] **Home Screen Redesign** — Premium hero, config-driven sections, bottom navigation, placeholders

### Pending

- [ ] **Remove legacy `mapApplicationToApi.ts`** — Deprecated mapper still in `src/mappers/`
- [ ] **Remove unused dependencies** — `axios` and `yup` in `package.json` but not used
- [ ] **Consolidate `typography.ts`** — Merge into `platform.ts` or expand with line heights, weights, font families
- [ ] **Migrate House Visit `InputField`** — Replace inline component with `VPInputField`
- [ ] **Fix `resetForm()`** — Should reset to current form type's defaults, not hardcode Professional
- [ ] **Fix Success Screen form type label** — Professional SuccessSection shows "PUC Scholarship" for non-professional forms
- [ ] **Align document validation schemas** — `professionalDocumentDetailsSchema` marks all 16 docs as `.optional()` but Review gatekeeper enforces them as required
- [ ] **PUC-specific Review/Success screens** — Currently shares Professional's Review/Success which has Professional-specific logic
- [ ] **Type navigation props** — Replace `{ navigation }: any` with shared `FormNavigation` interface
- [ ] **Add `.devin/instructions.md` or `.windsurf/instructions.md`** — Commit project guardrails to repo for persistence
- [ ] **Payana file upload** — Currently sends file URIs as strings; backend may need actual file upload or base64
- [ ] **Renewal form refactoring** — Split monolithic renewal forms into individual section components matching the main form pattern
