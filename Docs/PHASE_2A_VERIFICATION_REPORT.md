# Phase 2A — Production Contract & Portal Parity Verification Report

**Date:** 6 September 2026  
**Scope:** Code-level audit of API endpoints, authentication flows, dashboard counts, student-list endpoints, and portal ↔ mobile content parity.  
**Constraints:** No refactoring or architecture changes. Only confirmed, minimal defects may be fixed.

---

## 1. Baseline Results

| Check | Result |
|-------|--------|
| `tsc --noEmit` | **0 errors** |
| Jest test suite | **16/16 passing** |

Baseline is clean. No pre-existing TypeScript or test failures to carry forward.

---

## 2. PUC Format 1.1 API Integration

### 2.1 Endpoint Configuration

| Function | Mobile Endpoint | Portal Form Action | Classification |
|----------|----------------|-------------------|----------------|
| `createPUCStudent` | `POST /api/VP_Format1_1PUC` | `POST /VPStudent/CreateStudent` | **CONFIRMED CONTRACT** (mobile uses API; portal uses MVC form post) |
| `getPUCDropdowns` | `GET /api/VP_Format1_1PUC/dropdowns` | N/A (portal uses server-rendered dropdowns) | **CONFIRMED CONTRACT** |

**File:** `@/src/api/pucApi.ts:13` — `BASE_URL = '/VP_Format1_1PUC'`  
**File:** `@/src/forms/puc/mapper.ts:4` — Comment documents `POST /api/VP_Format1_1PUC`

### 2.2 Field Name Audit — PUC Mapper vs Portal Form

**CRITICAL FINDING:** The mobile PUC mapper uses **Format 1.1 field names** (short names like `Gender`, `Caste`, `District`) while the portal HTML form uses **legacy field names** (suffix `ID` like `GenderID`, `CasteCategoryID`, `DistrictID`).

| Section | Mobile Mapper Field | Portal Form Field | Match? |
|---------|-------------------|-------------------|--------|
| Personal | `StudentName` | `StudentName` | ✅ |
| Personal | `DateOfBirth` | `DateOfBirth` | ✅ |
| Personal | `Gender` | `GenderID` | ❌ **MISMATCH** |
| Personal | `Caste` | `CasteCategoryID` | ❌ **MISMATCH** |
| Personal | `Place` | `AreaTypeID` | ❌ **MISMATCH** |
| Contact | `Email` | `Email` | ✅ |
| Contact | `ContactNumber` | `ContactNumber` | ✅ |
| Contact | `AlternateNumber` | `AlternateNumber` | ✅ |
| Address | `District` | `DistrictID` | ❌ **MISMATCH** |
| Address | `OtherDistrict` | `OtherDistrict` | ✅ |
| Address | `Taluk` | `Taluka` | ❌ **MISMATCH** (spelling) |
| Address | `ResidentialAddress` | `Address` | ❌ **MISMATCH** |
| Family | `FatherOccupation` | `FatherOccupationID` | ❌ **MISMATCH** |
| Family | `MotherOccupation` | `MotherOccupationID` | ❌ **MISMATCH** |
| Family | `TotalFamilyMembers` | `FamilyMembers` | ❌ **MISMATCH** |
| Family | `FamilyAnnualIncome` | `FamilyIncome` | ❌ **MISMATCH** |
| Academic | `SSLCPercentage` | `SecuredPercentage` | ❌ **MISMATCH** |
| Academic | `CourseJoined` | `CourseID` | ❌ **MISMATCH** |
| Academic | `CollegeName` | `CollegeName` | ✅ |
| Academic | `CollegeType` | `CollegeTypeID` | ❌ **MISMATCH** |
| Academic | `CollegeFees` | `ExpectedFees` | ❌ **MISMATCH** |
| Academic | `CollegeContactNumber` | *(not in portal)* | ⚠️ Extra field |
| Academic | `Achievement` | *(not in portal)* | ⚠️ Extra field |
| Bank | `ParentsBankBalance` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |
| Bank | `AccountHolderName` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |
| Bank | `AccountNumber` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |
| Bank | `IFSCCode` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |
| Bank | `BankName` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |
| Bank | `BranchName` | *(not in portal)* | ⚠️ Extra field (Format 1.1 only) |

**Classification: INCONCLUSIVE**  
The mobile app targets a **new API** (`/api/VP_Format1_1PUC`) which is a separate endpoint from the portal's MVC form post (`/VPStudent/CreateStudent`). The field name differences may be intentional — the Format 1.1 API may accept short names (`Gender`, `Caste`, `District`) while the legacy portal form uses `ID`-suffixed names. **This cannot be confirmed without live API testing or backend controller source code.** The mapper field names match the documented Format 1.1 contract in the code comments.

### 2.3 Document Field Audit — PUC

| Mobile Mapper Field | Portal Form Field | Match? |
|---------------------|-------------------|--------|
| `StudentSelfie` | `StudentPhoto` | ❌ **MISMATCH** |
| `SSLCMarksCard` | `SSLCMarksCard` | ✅ |
| `FeeReceipts` | *(not in portal)* | ⚠️ Format 1.1 only |
| `BankPassbook` | *(not in portal)* | ⚠️ Format 1.1 only |
| `AadhaarCard` | *(not in portal)* | ⚠️ Format 1.1 only |

**Portal PUC documents (7):** SSLCMarksCard, StudentPhoto, ElectricityBill, RationCards, IncomeCertificate, FamilyPhoto, HouseVideo  
**Mobile PUC documents (5):** StudentSelfie, SSLCMarksCard, FeeReceipts, BankPassbook, AadhaarCard

**Classification: INCONCLUSIVE** — The mobile app uses a completely different document set (5 docs) from the portal (7 docs). This is consistent with a Format 1.1 contract change, but cannot be verified without backend confirmation.

### 2.4 Missing Portal Fields in Mobile PUC Form

The portal PUC form has these fields **not present** in the mobile PUC mapper:
- `FatherName` / `MotherName` — mobile PUC only captures occupation, not parent names
- `AreaTypeID` (Urban/Rural/Semi Urban) — mobile uses `Place` instead
- `HouseTypeID` (Own/Rent/Leased) + `MonthlyRent` — not in mobile PUC
- `ReferenceSourceID` + `ReferenceSourceOther` — not in mobile PUC
- `PinCode` — not in mobile PUC
- `TotalMarks` (SSLC total) — not in mobile PUC
- `HouseVisitLink` (Google Maps) — not in mobile PUC
- `HouseVideo` — not in mobile PUC
- `ElectricityBill`, `RationCards`, `IncomeCertificate`, `FamilyPhoto` — not in mobile PUC

**Classification: INCONCLUSIVE** — Format 1.1 may intentionally drop these fields. Needs backend confirmation.

---

## 3. Payana Endpoint Reconciliation

### 3.1 Create Endpoint

| Function | Mobile Endpoint | Classification |
|----------|----------------|----------------|
| `createPayanaStudent` | `POST /api/payana-students/create` | **CONFIRMED CONTRACT** |
| `getPayanaDistricts` | `GET /api/payana-students/districts` | **CONFIRMED CONTRACT** |
| `getPayanaDropdowns` | `GET /api/payana-students/dropdowns` | **CONFIRMED CONTRACT** |

**File:** `@/src/api/payanaApi.ts:12` — `BASE_URL = '/payana-students'`

### 3.2 Student List Endpoint — Dual Path

| Function | Mobile Endpoint | Bearer Required? | Classification |
|----------|----------------|-----------------|----------------|
| `getPayanaStudentList` | `GET /api/payanastudents/studentlist` | ✅ Yes (in `BEARER_REQUIRED_PATHS`) | **CONFIRMED CONTRACT** (legacy) |

**File:** `@/src/api/payanaStudentApi.ts:20` — `BASE_URL = '/payanastudents'`

The Payana create endpoint uses the **contract path** (`/payana-students/create`) while the student list uses the **legacy path** (`/payanastudents/studentlist`). The `BEARER_REQUIRED_PATHS` array in `@/src/api/client.ts:82` includes `/payanastudents` for token attachment.

**Classification: CONFIRMED CONTRACT** — Both paths are correctly configured. The create path is public (no token needed), the list path requires JWT and is listed in `BEARER_REQUIRED_PATHS`.

### 3.3 Payana Mapper Field Audit

The Payana mapper (`@/src/forms/payana/mapper.ts`) uses field names that match neither the PUC portal nor the Professional portal — this is expected as Payana has its own backend contract. File field names use lowercase (`latestmarkscard`, `dwellingunit`, `adharcard`) which matches the documented Payana API contract.

**Classification: CONFIRMED CONTRACT** — No portal reference available for Payana; field names are internally consistent with API code comments.

---

## 4. Authentication Investigation

### 4.1 Endpoint Matrix

| Function | Mobile Endpoint | Method | Token Required | Classification |
|----------|----------------|--------|---------------|----------------|
| Login | `/api/registration/login` | POST | No | **CONFIRMED CONTRACT** |
| Register | `/api/registration/register` | POST | No | **CONFIRMED CONTRACT** |
| Forgot Password | `/api/registration/forgotpassword` | POST | No | **CONFIRMED CONTRACT** |
| Reset Password | `/api/registration/resetpassword` | POST | No | **CONFIRMED CONTRACT** |
| Google Login | Opens browser to `/api/registration/google-login` | GET | No | **CONFIRMED CONTRACT** |

**File:** `@/src/api/authApi.ts:25`, `@/src/api/registrationApi.ts:43,65,87,105`

### 4.2 Login Response Contract

The `LoginResponse` interface expects: `Success`, `UserID`, `UserName`, `Role`, `EmployeeID`, `AssignedRole`, `District`, `Token`, `DistrictID`, `OtherDistrict`.

**Classification: CONFIRMED CONTRACT** — Token is extracted and stored in AsyncStorage under key `@vp_auth_user`. The client's `getAuthToken()` reads this key and attaches `Bearer` token for protected paths.

### 4.3 Error Handling

- **401** → "Invalid credentials"  
- **400** → Extracts `Message` from response body or falls back to "Account inactive."  
- **Network errors** → "Cannot connect to server. Check your internet or API URL."

**Classification: CONFIRMED CONTRACT** — Error handling is comprehensive and matches expected backend behavior.

### 4.4 Registration Screen

- Roles are **hardcoded** in the mobile app: Admin, Employee, Branch Executives, Program Manager, Account Manager, Admin(CEO), Resource Mobilization, Volunteer
- Districts are **hardcoded** (10 districts + Other option not present)
- District-scoped roles: Volunteer, Branch Executives, Employee

**Classification: CONFIRMED CONTRACT** — Registration endpoint and payload match. Hardcoded roles/districts are a known limitation but not a defect.

### 4.5 Forgot/Reset Password Flow

1. User enters email → `POST /api/registration/forgotpassword` with `{ Email }`
2. On `Success: true` → navigate to `/reset-password` with email param
3. User enters new password → `POST /api/registration/resetpassword` with `{ Email, NewPassword }`

**Classification: CONFIRMED CONTRACT** — Flow is correct and matches expected backend contract.

---

## 5. Dashboard Approval Count Discrepancy (11 vs 0)

### 5.1 Root Cause Analysis

**The dashboard uses TWO separate data sources for approval counts:**

1. **`dashboardApi.getDashboard()`** → `GET /api/welcomedashboard/dashboard`  
   Returns `DashboardResponseDto` with fields: `PendingPUC`, `PendingPayana`, `PendingProfessional`, `PendingSemiProfessional`, etc.  
   These are the **backend-computed pending approval counts**.

2. **`fetchRealTimeCounts()`** → Calls all 4 student list APIs in parallel:  
   - `pucStudentApi.getList()` → `GET /api/pucstudents/studentlist`  
   - `payanaStudentApi.getList()` → `GET /api/payanastudents/studentlist`  
   - `professionalStudentApi.getList()` → `GET /api/professionalstudents/studentlist`  
   - `semiProfessionalStudentApi.getList()` → `GET /api/semiprofessional/studentlist`

**The stat cards use `realTimeCounts` (source #2), NOT `dashboard` (source #1).**

**File:** `@/src/app/dashboard.tsx:366-379` — `getCountForCard()` returns `realTimeCounts.pendingPUC` etc., ignoring the dashboard API's `PendingPUC` field.

### 5.2 Why 11 vs 0

The student list APIs return only **Approved** students (per code comments in each student list API). The dashboard API returns **Pending** approval counts. These are **opposite** concepts:

- **Dashboard API** says "11 pending approvals" → 11 students awaiting approval
- **Student List API** returns approved students → 0 students returned (if none approved yet)

The stat cards labeled "Pending PUC", "Pending Payana" etc. show the **student list count** (approved students) instead of the **dashboard API's pending count**.

**Classification: CONFIRMED DEFECT**  
**Root Cause:** `getCountForCard()` at `@/src/app/dashboard.tsx:366` uses `realTimeCounts` (student list lengths) instead of `dashboard` API's `Pending*` fields for the stat cards.  
**Impact:** Dashboard always shows 0 for all pending counts if no students are approved, even when the backend reports 11 pending.  
**Fix Scope:** Replace `realTimeCounts` usage in `getCountForCard()` with `dashboard?.[field]` values. The `realTimeCounts` should only be used for drawer badges if needed.  
**Fix Complexity:** Minimal — single function change (~10 lines).

### 5.3 Notification Bell Count

The notification bell at `@/src/app/dashboard.tsx:381-386` sums all `Pending*` fields from the `dashboard` API response. This **correctly** uses the dashboard API data.

**Classification: CONFIRMED CONTRACT** — Notification count is correct; it's the stat cards that are wrong.

---

## 6. Student-List Endpoint Audit (All 4 Forms)

| Form | Function | Endpoint | Bearer Token | Response Array Key | Classification |
|------|----------|----------|-------------|-------------------|----------------|
| PUC | `getPUCStudentList` | `GET /api/pucstudents/studentlist` | ✅ | `Data` or `Students` | **CONFIRMED CONTRACT** |
| Payana | `getPayanaStudentList` | `GET /api/payanastudents/studentlist` | ✅ | `Data` or `Students` | **CONFIRMED CONTRACT** |
| Professional | `getProfessionalStudentList` | `GET /api/professionalstudents/studentlist` | ✅ | `Data` or `Students` | **CONFIRMED CONTRACT** |
| Semi Professional | `getSemiProfessionalStudentList` | `GET /api/semiprofessional/studentlist` | ✅ | `Data` or `Students` | **CONFIRMED CONTRACT** |

All four student list APIs follow the same pattern:
- Query params: `search` (optional), `districtId` (optional, not in SemiProf)
- Response: PascalCase → camelCase transform
- Array fallback: `data.Data || data.Students || []`
- Districts: `data.Districts || []`

**All four are in `BEARER_REQUIRED_PATHS`** in `@/src/api/client.ts:79-84`.

**Classification: CONFIRMED CONTRACT** — All endpoints are consistent and correctly configured.

---

## 7. Portal ↔ Mobile Content Parity Audit

### 7.1 Public Links Page (Portal Home)

**Portal:** `AccessPublicLinks - Vidya Poshak.html`  
**Portal content:**
- "Vidya Poshak Financial Assistance Application for PUC-I Commerce and Diploma-I Students 2026-2027"
- "Vidya Poshak Financial Assistance Application form for Engineering and Medical students- 2026-2027"
- "Vidya Poshak Financial Assistance Application form for SemiProfessional (For B.ScNursing, GLM- Nursing, Physiotherapy, B.Sc- Agriculture, Veterinary Science & Horticulture)- 2026-2027"

**Mobile:** `@/src/config/homeSections.ts` and `@/src/config/appContent.ts`
- PUC: "Vidya Poshak Financial Assistance Application\nfor PUC-I Commerce and Diploma-I Students\n2026-2027" — ✅ **MATCH** (modulo newlines)
- Professional: "New Professional Student Information Sheet-\n2026-2027" — ❌ **MISMATCH**
- Semi Professional: "Vidya Poshak Financial Assistance Application\nfor Semi-Professional Students 2026-2027" — ❌ **MISMATCH** (missing course list)

**Classification: CONFIRMED DEFECT (Minor)**  
**Details:**
1. Professional title in mobile says "New Professional Student Information Sheet" but portal says "Vidya Poshak Financial Assistance Application form for Engineering and Medical students"
2. Semi Professional title in mobile omits the course list "(For B.ScNursing, GNM- Nursing, Physiotherapy, B.Sc- Agriculture, Veterinary Science & Horticulture)"

### 7.2 PUC Guidelines Content

**Portal guidelines:**
- "This application form is only for students seeking admission to PUC I Year Commerce and Diploma courses."
- "Must have passed in the 2025-26 academic year in their first attempt."
- "Only students who have secured more than 80% in their SSLC examination are eligible to apply."
- "Last date to apply: 30 Jun 2026"
- "If any queries, contact: 0836-2747357"

**Portal required documents (7):** SSLC Marks Card, Electricity Bill, Ration Card, Student photo/selfie, Income Certificate, Family Photo, House Video

**Mobile PUC:** No dedicated GuidelinesSection component exists in `@/src/screens/form-sections/puc/`. The PUC form uses the generic `GuidelinesScreen` at `@/src/screens/common/GuidelinesScreen.tsx` which has **generic text**: "Follow the step indicator, keep your answers concise..."

**Classification: CONFIRMED DEFECT**  
**Details:** PUC form guidelines screen has no portal-specific content — no eligibility criteria, no deadline, no contact number, no document list. The generic guidelines text is not useful for applicants.

### 7.3 Professional Guidelines Content

**Portal eligibility:**
- "Student should have appeared for the PUC II examination for the first time in 2026"
- "Must be aspiring to join a Medical or Engineering course"
- "Only for students from Karnataka"
- "Should have scored 80% and above in the PUC II examination"
- "CET rank below 25,000" (Engineering) / "NEET Karnataka rank below 3,000 and All India rank below 60,000" (Medical)
- "Total family income should be less than ₹15,000/- per month"
- "Parents must be residents of Karnataka"
- "Last date to apply: 30 Jul 2026"

**Portal required documents (9):** PUC II Marks Card, Student's Selfie, CET/NEET Rank Sheet, Electricity Bill, Dwelling Unit Photo, Ration Card, Income Certificate, House Video, Request Letter

**Mobile Professional Guidelines** (`@/src/screens/form-sections/professional/GuidelinesSection.tsx`):
- "Student must be a resident of Karnataka" — ✅ partial match
- "Annual family income should not exceed ₹2,00,000" — ❌ **WRONG** (portal says ₹15,000/month)
- "Student must have secured minimum 60% in previous examination" — ❌ **WRONG** (portal says 80% in PUC II)
- "Must be studying in a recognized institution" — ❌ **NOT IN PORTAL**
- Documents list: 9 items — ✅ **MATCH** (same 9 documents)
- No last date mentioned — ❌ **MISSING**
- No CET/NEET rank criteria — ❌ **MISSING**

**Classification: CONFIRMED DEFECT**  
**Details:** Professional guidelines have incorrect eligibility criteria (income threshold and percentage are wrong) and missing critical details (CET/NEET rank requirements, last date).

### 7.4 Semi Professional Guidelines Content

**Portal eligibility:**
- "PUC II/12 Grade examination for the first time in 2026"
- "B.Sc-Nursing, GNM- Nursing, Physiotherapy, B.Sc- Agriculture, Veterinary Science & Horticulture"
- "Only for students from Karnataka"
- "80% and above in the PUC II examination"
- "Total family income should be less than ₹15,000/- per month"
- "Parents must be residents of Karnataka"
- "Last date to apply: 30 Jun 2026"

**Portal required documents (9):** PUC II Marks Card, Student's Selfie, CET Rank Sheet, PT Rank Sheet, Dwelling Unit Photo, House Video, Electricity Bill, Income Certificate, Ration Card

**Mobile Semi Professional Guidelines** (`@/src/screens/form-sections/semiProfessional/GuidelinesSection.tsx`):
- **No eligibility criteria at all** — ❌ **MISSING**
- **No document list** — ❌ **MISSING** (only generic "upload clear documents" text)
- **No last date** — ❌ **MISSING**
- **No course list** — ❌ **MISSING**
- Generic instructions only ("Fields marked with * are mandatory")

**Classification: CONFIRMED DEFECT**  
**Details:** Semi Professional guidelines screen has none of the portal-specific content. No eligibility, no document list, no deadline.

### 7.5 Professional & Semi Professional Form Field Parity

**Professional mapper** (`@/src/forms/professional/mapper.ts`) vs **Portal NewProfessional form:**

| Field | Mobile | Portal | Match? |
|-------|--------|--------|--------|
| Email | ✅ | ✅ | ✅ |
| StudentName | ✅ | ✅ | ✅ |
| DOB | ✅ | ✅ | ✅ |
| ContactNumber | ✅ | ✅ | ✅ |
| AlternateNumber | ✅ | ✅ | ✅ |
| ResidentialAddress | ✅ | ✅ | ✅ |
| GoogleMapLink | ✅ | ✅ | ✅ |
| AreaTypeID | ✅ | ✅ | ✅ |
| DistrictID | ✅ | ✅ | ✅ |
| OtherDistrict | ✅ | ✅ | ✅ |
| GenderID | ✅ | ✅ | ✅ |
| CasteCategoryID | ✅ | ✅ | ✅ |
| FatherName | ✅ | ✅ | ✅ |
| MotherName | ✅ | ✅ | ✅ |
| FatherOccupationID | ✅ | ✅ | ✅ |
| MotherOccupationID | ✅ | ✅ | ✅ |
| FamilyMembers | ✅ | ✅ | ✅ |
| HouseTypeID | ✅ | ✅ | ✅ |
| MonthlyRent | ✅ | ✅ | ✅ |
| FamilyIncome | ✅ | ✅ | ✅ |
| PUPercentage | ✅ | ✅ | ✅ |
| CETRank | ✅ | ✅ | ✅ |
| NEETRank | ✅ | ✅ | ✅ |
| CourseApplying | ✅ | ✅ | ✅ |
| CourseStream | ✅ | ✅ | ✅ |
| StudentSelfie | ✅ | ✅ | ✅ |
| CETNEETRankSheet | ✅ | ✅ | ✅ |
| DwellingUnitPhoto | ✅ | ✅ | ✅ |
| MarksSheet12 | ✅ | ✅ | ✅ |
| RequestLetter | ✅ | ✅ | ✅ |
| HouseVideo | ✅ | ✅ | ✅ |
| ElectricityBill | ✅ | ✅ | ✅ |
| IncomeCertificate | ✅ | ✅ |
| RationCard | ✅ | ✅ | ✅ |

**Classification: CONFIRMED CONTRACT** — Professional mapper fields match portal form fields exactly.

**Semi Professional mapper** (`@/src/forms/semiProfessional/mapper.ts`) vs **Portal SemiProfessional form:**

All fields match the portal form. The semi-professional form correctly uses `PTRank` / `PTRankSheet` for the Agriculture/Veterinary/Horticulture rank (portal labels it as `NEETRank` field name but with PT Rank label — the mobile app correctly maps `ptRank` → `PTRank`).

**Classification: CONFIRMED CONTRACT** — Semi Professional mapper fields match portal form.

### 7.6 API Endpoint Parity — Professional & Semi Professional

| Form | Mobile Create Endpoint | Portal Form Action | Classification |
|------|----------------------|-------------------|----------------|
| Professional | `POST /api/api/VP_NewProfessional/submit` | `POST /VP_NewProfessional/NewProfessional` | **CONFIRMED DEFECT** |
| Semi Professional | `POST /api/semi-professional/create` | `POST /VP_SemiProfessionalStudent/CreateSemiProfessionalStudent` | **INCONCLUSIVE** |

**CRITICAL:** The Professional API at `@/src/api/professionalApi.ts:18` uses path `/api/VP_NewProfessional/submit`. Since `environment.API_BASE_URL` already ends with `/api`, the full URL becomes `https://vpwebservices.testserver.envisage-workflow.in/api/api/VP_NewProfessional/submit` — **double `/api`**.

**Classification: CONFIRMED DEFECT** — Professional create endpoint has a doubled `/api` prefix.  
**Fix:** Change `@/src/api/professionalApi.ts:18` from `'/api/VP_NewProfessional/submit'` to `'/VP_NewProfessional/submit'`.  
**Also fix:** `@/src/api/professionalApi.ts:40` — dropdowns endpoint has same doubled `/api` issue.

The Semi Professional endpoint `/semi-professional/create` does not have this issue (no `/api` prefix in the path).

---

## 8. Summary of Findings

### CONFIRMED DEFECTS

| # | Area | Severity | Description | Fix Scope |
|---|------|----------|-------------|-----------|
| D1 | Dashboard | **High** | Stat cards use student-list counts instead of dashboard API pending counts, causing 11 vs 0 discrepancy | ~10 lines in `dashboard.tsx` `getCountForCard()` |
| D2 | Professional API | **High** | Doubled `/api` prefix in create and dropdowns endpoints (`/api/api/VP_NewProfessional/submit`) | 2 lines in `professionalApi.ts` |
| D3 | Professional Guidelines | **Medium** | Incorrect eligibility criteria (income ₹2L vs ₹15K/mo, 60% vs 80%) and missing CET/NEET rank requirements | Content update in `GuidelinesSection.tsx` |
| D4 | Semi Professional Guidelines | **Medium** | No eligibility criteria, no document list, no deadline — only generic instructions | Content update in `GuidelinesSection.tsx` |
| D5 | PUC Guidelines | **Medium** | No portal-specific guidelines content (eligibility, deadline, contact, documents) | Content update — need PUC GuidelinesSection |
| D6 | Form Titles | **Low** | Professional title mismatch; Semi Professional title missing course list | Update `appContent.ts` |

### CONFIRMED CONTRACTS

| # | Area | Description |
|---|------|-------------|
| C1 | PUC Format 1.1 API | Endpoints `/VP_Format1_1PUC` and `/VP_Format1_1PUC/dropdowns` are correctly configured |
| C2 | Payana API | Create/districts/dropdowns endpoints under `/payana-students` are correct |
| C3 | Payana Student List | Legacy `/payanastudents/studentlist` is correctly used with JWT |
| C4 | Authentication | All 5 auth endpoints (login, register, forgot, reset, google) are correct |
| C5 | Auth Token Flow | Token stored in AsyncStorage, attached as Bearer for protected paths |
| C6 | Student List APIs | All 4 student list endpoints are correctly configured with JWT |
| C7 | Professional Mapper | All 34 form fields + 9 document fields match portal exactly |
| C8 | Semi Professional Mapper | All form fields + 9 document fields match portal exactly |
| C9 | Notification Bell | Correctly sums `Pending*` fields from dashboard API |

### INCONCLUSIVE

| # | Area | Description |
|---|------|-------------|
| I1 | PUC Format 1.1 Field Names | Mobile uses short names (`Gender`, `Caste`, `District`) vs portal's `ID`-suffixed names (`GenderID`, `CasteCategoryID`, `DistrictID`). May be intentional Format 1.1 contract change — needs backend confirmation. |
| I2 | PUC Format 1.1 Documents | Mobile has 5 docs (StudentSelfie, SSLCMarksCard, FeeReceipts, BankPassbook, AadhaarCard) vs portal's 7 docs. May be Format 1.1 contract change — needs backend confirmation. |
| I3 | PUC Missing Portal Fields | Mobile PUC form omits FatherName, MotherName, HouseType, ReferenceSource, PinCode, TotalMarks, HouseVisitLink, HouseVideo — may be intentional Format 1.1 simplification. |
| I4 | Semi Professional API Endpoint | Mobile uses `/semi-professional/create` vs portal's MVC form post. Cannot verify if API endpoint exists on backend. |

### BLOCKED

None.

---

## 9. Recommended Phase 2A Fixes (Minimal, No Refactoring)

### Priority 1 — Functional Defects

1. **D1: Dashboard count fix** — Change `getCountForCard()` in `dashboard.tsx` to use `dashboard?.[field] ?? 0` instead of `realTimeCounts`. Keep `realTimeCounts` only for drawer sidebar badges.

2. **D2: Professional API double `/api`** — Remove `/api` prefix from paths in `professionalApi.ts` lines 18 and 40.

### Priority 2 — Content Parity

3. **D3: Professional guidelines** — Update eligibility text to match portal (80% in PUC II, ₹15,000/month income, CET <25,000, NEET KA <3,000/AI <60,000, last date 30 Jul 2026).

4. **D4: Semi Professional guidelines** — Add eligibility criteria, document list, and deadline from portal.

5. **D5: PUC guidelines** — Create PUC-specific guidelines section with portal content.

6. **D6: Form titles** — Update `appContent.ts` titles to match portal wording.

---

**Report End**
