# Phase 2C — Backend Contract Confirmation Report

**Date:** 6 September 2026  
**Scope:** Resolve all INCONCLUSIVE items from Phase 2A using backend source code and API contract documents.  
**Evidence Sources:** Backend C# controller source code, API contract documents, and Edit API contract markdown.  
**Constraints:** No frontend code modifications during investigation.

---

## Evidence Sources Used

| Source | Path | Type |
|--------|------|------|
| PUC Format 1.1 API Contract | `App/VPApp/Docs/API Contract - VP_Format1_1PUCApiControl.txt` | Contract document |
| Edit PUC Format 1.1 API Contract | `APIContracts/markdown-output/Edit_Format1_1_PUC_Student_API_Contract.md` | Contract document |
| Professional API Contract | `App/VPApp/Docs/VP_NewProfessional API Contract.txt` | Contract document |
| Payana API Contract | `App/VPApp/Docs/PAYANA STUDENTS API CONTRACT DOCUMENT.txt` | Contract document |
| SemiProfessional Controller | `Controllers/Controllers/SemiProfessionalStudentController.cs` | Backend source |
| SemiProfessional List Controller | `Controllers/Controllers/SemiProfessional_StudentListController.cs` | Backend source |
| PUC List Controller | `Controllers/Controllers/PUC_StudentsListController.cs` | Backend source |
| Professional List Controller | `Controllers/Controllers/Professional_StudentListController.cs` | Backend source |
| Payana Controller | `Controllers/Controllers/PayanaStudentsApiController.cs` | Backend source |
| Legacy PUC/Professional Controller | `Controllers/Controllers/VPStudentApiController.cs` | Backend source |

---

## 1. PUC Format 1.1 — Field Names

### Contract Evidence

The API contract document (`API Contract - VP_Format1_1PUCApiControl.txt`) explicitly lists the field names for `POST /api/VP_Format1_1PUC`:

```
Email, StudentName, District, OtherDistrict, Taluk, ResidentialAddress,
ContactNumber, AlternateNumber, Gender, DateOfBirth, Caste, Place,
FatherOccupation, MotherOccupation, TotalFamilyMembers, FamilyAnnualIncome,
SSLCPercentage, CourseJoined, CollegeName, CollegeType, CollegeFees,
CollegeContactNumber, Achievement, ParentsBankBalance, AccountHolderName,
AccountNumber, IFSCCode, BankName, BranchName
```

The Edit API contract confirms the database column mapping:
- `Gender` → `GenderID` column
- `Caste` → `CasteCategoryID` column
- `District` → `DistrictID` column
- `Place` → `AreaTypeID` column
- `FatherOccupation` → `FatherOccupationID` column
- `MotherOccupation` → `MotherOccupationID` column
- `CourseJoined` → `CourseID` column
- `CollegeType` → `CollegeTypeID` column

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| PUC field names | `Gender`, `Caste`, `District`, `Place`, `FatherOccupation`, `MotherOccupation`, `TotalFamilyMembers`, `FamilyAnnualIncome`, `SSLCPercentage`, `CourseJoined`, `CollegeType`, `CollegeFees` | Same short names | API Contract doc lines 14-42 | **NONE — Confirmed match** |

**Classification: CONFIRMED CONTRACT** — The mobile app's PUC Format 1.1 mapper uses the correct short field names. The portal HTML form uses legacy `ID`-suffixed names because it posts to a different legacy endpoint (`/VPStudent/CreateStudent`). The Format 1.1 API intentionally uses short names that map to `ID`-suffixed database columns server-side.

---

## 2. PUC Format 1.1 — Document Count (5 vs 7)

### Contract Evidence

The API contract document explicitly states:

```
Required File Uploads:
StudentSelfie, SSLCMarksCard, FeeReceipts, BankPassbook, AadhaarCard
Business Logic: All five documents are mandatory.
```

The Edit API contract also confirms exactly 5 file fields: `StudentSelfie`, `SSLCMarksCard`, `FeeReceipt`, `BankPassbook`, `AadhaarCard`.

The portal's 7 documents (SSLCMarksCard, ElectricityBill, RationCards, StudentPhoto, IncomeCertificate, FamilyPhoto, HouseVideo) are for the **legacy** `New_Students` table via `/VPStudent/CreateStudent`. The Format 1.1 API writes to the `Format1_1_PUC` table which has different columns.

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| PUC documents | 5: StudentSelfie, SSLCMarksCard, FeeReceipts, BankPassbook, AadhaarCard | 5: same | API Contract doc lines 43-49, 53 | **NONE — Confirmed match** |

**Classification: CONFIRMED CONTRACT** — The mobile app correctly implements 5 documents for Format 1.1. The portal's 7 documents belong to the legacy form.

---

## 3. PUC Format 1.1 — Missing Portal-Only Fields

### Contract Evidence

The Format 1.1 API contract does **not** include these portal fields:
- `FatherName`, `MotherName` — Not in Format 1.1 (only occupations are captured)
- `HouseTypeID`, `MonthlyRent` — Not in Format 1.1
- `ReferenceSourceID`, `ReferenceSourceOther` — Not in Format 1.1
- `PinCode` — Not in Format 1.1
- `TotalMarks` — Not in Format 1.1
- `HouseVisitLink` — Not in Format 1.1 (added during house visit workflow)
- `HouseVideo`, `ElectricityBill`, `RationCards`, `IncomeCertificate`, `FamilyPhoto` — Not in Format 1.1 (different document set)

The Format 1.1 API **adds** these fields not in the portal:
- `CollegeContactNumber`, `Achievement`, `ParentsBankBalance`, `AccountHolderName`, `AccountNumber`, `IFSCCode`, `BankName`, `BranchName` (bank details)

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| Portal-only fields | Not included in mapper | Not in Format 1.1 contract | API Contract doc — field list | **NONE — Intentionally excluded** |
| Format 1.1 extra fields | Included in mapper (bank, college contact, achievement) | Present in contract | API Contract doc lines 35-42 | **NONE — Confirmed match** |

**Classification: CONFIRMED CONTRACT** — The Format 1.1 API is a deliberately redesigned contract. Portal-only fields are intentionally excluded. The mobile app correctly implements the Format 1.1 field set.

---

## 4. Semi Professional — Create Endpoint

### Contract Evidence

The backend controller `SemiProfessionalStudentController.cs` shows:

```csharp
[RoutePrefix("api/semiprofessionalstudent")]
public class SemiProfessionalStudentController : ApiController
{
    [HttpPost]
    [Route("create")]
    public IHttpActionResult CreateSemiProfessionalStudent()
```

**Backend endpoint:** `POST /api/semiprofessionalstudent/create`

**Mobile app endpoint:** `POST /api/semi-professional/create` (in `semiProfessionalApi.ts:18`)

These are **completely different** routes. The mobile app will receive a 404.

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| Create endpoint | `/semi-professional/create` | `/semiprofessionalstudent/create` | Controller source line 12, 53 | **FIX REQUIRED** — Change path in `semiProfessionalApi.ts:18` |
| Dropdowns endpoint | `/semi-professional/form-data` | `/semiprofessionalstudent/dropdowns` | Controller source line 331-332 | **FIX REQUIRED** — Change path in `semiProfessionalApi.ts:34` |

**Classification: CONFIRMED DEFECT (D7)** — Both Semi Professional API endpoints are wrong.

---

## 5. Semi Professional — Field Name & Document Mismatch

### Contract Evidence

The backend controller reads these fields from `HttpContext.Current.Request`:

```
StudentName, Email, DateOfBirth, DistrictID, OtherDistrict, Taluk, Address,
ContactNumber, GenderID, CasteCategoryID, FatherOccupationID, MotherOccupationID,
FamilyMembers, AnnualIncome, PUPercentage, SemiProfessionalCourseID,
CollegeName, CollegeTypeID, CollegeFees, PlaceID, HouseVisitLink
```

**Documents (3 only):** `PUCMarksCard`, `IncomeCertificate`, `AadharCard`

The mobile app's mapper (`semiProfessionalMapper`) sends:

```
Email, StudentName, DOB (should be DateOfBirth), ContactNumber, AlternateNumber (not in backend),
ResidentialAddress (should be Address), GoogleMapLink (not in backend), AreaTypeID (should be PlaceID),
DistrictID, OtherDistrict, GenderID, CasteCategoryID, FatherName (not in backend), MotherName (not in backend),
FatherOccupationID, MotherOccupationID, FamilyMembers, HouseTypeID (not in backend), MonthlyRent (not in backend),
FamilyIncome (should be AnnualIncome), PUPercentage, CETRank (not in backend), PTRank (not in backend),
CourseApplying (should be SemiProfessionalCourseID), CourseStream (not in backend)
```

**Documents (9):** StudentSelfie, CETRankSheet, PTRankSheet, DwellingUnitPhoto, MarksSheet12, HouseVideo, ElectricityBill, IncomeCertificate, RationCard

### Field Mismatch Table

| Mobile Mapper Field | Backend Expected Field | Match? | Required Change |
|---------------------|----------------------|--------|----------------|
| `DOB` | `DateOfBirth` | ❌ | Rename to `DateOfBirth` |
| `ResidentialAddress` | `Address` | ❌ | Rename to `Address` |
| `AreaTypeID` | `PlaceID` | ❌ | Rename to `PlaceID` |
| `FamilyIncome` | `AnnualIncome` | ❌ | Rename to `AnnualIncome` |
| `CourseApplying` | `SemiProfessionalCourseID` | ❌ | Rename to `SemiProfessionalCourseID` |
| `AlternateNumber` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `GoogleMapLink` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `FatherName` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `MotherName` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `HouseTypeID` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `MonthlyRent` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `CETRank` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `PTRank` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `CourseStream` | *(not in backend)* | ⚠️ | Backend ignores — no harm but no effect |
| `StudentSelfie` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `CETRankSheet` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `PTRankSheet` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `DwellingUnitPhoto` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `MarksSheet12` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `HouseVideo` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `ElectricityBill` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| `RationCard` | *(not in backend)* | ❌ | Backend will ignore — document lost |
| *(missing)* | `PUCMarksCard` | ❌ | **ADD** — Backend expects this file |
| *(missing)* | `AadharCard` | ❌ | **ADD** — Backend expects this file |
| `IncomeCertificate` | `IncomeCertificate` | ✅ | No change |

### Verdict

**Classification: CONFIRMED DEFECT (D8)** — The Semi Professional mapper is built to a completely different contract than the backend implements. The mobile app sends 9 documents but the backend only processes 3. Five critical field names are wrong. Two backend-expected documents are missing.

**Required Changes:**
1. **`semiProfessionalApi.ts`** — Fix endpoint paths (D7)
2. **`semiProfessional/mapper.ts`** — Fix field names: `DOB`→`DateOfBirth`, `ResidentialAddress`→`Address`, `AreaTypeID`→`PlaceID`, `FamilyIncome`→`AnnualIncome`, `CourseApplying`→`SemiProfessionalCourseID`
3. **`semiProfessional/mapper.ts`** — Fix documents: Replace 9 documents with backend's 3: `PUCMarksCard`, `IncomeCertificate`, `AadharCard`
4. **Semi Professional form screens** — Remove fields not in backend (CETRank, PTRank, HouseTypeID, MonthlyRent, FatherName, MotherName, AlternateNumber, GoogleMapLink, CourseStream)
5. **Semi Professional form screens** — Add missing fields: `HouseVisitLink`, `SemiProfessionalCourseID` (from dropdown)
6. **Semi Professional dropdowns normalizer** — Update to match backend's dropdown response shape

**Impact:** This is a **major rework** of the Semi Professional form, not a minimal fix.

---

## 6. Payana — Endpoint Path Mismatch (Bonus Finding)

### Contract Evidence

The backend controller and contract document both confirm:

```
Route prefix: api/payanastudents
Create: POST /api/payanastudents/create
Dropdowns: GET /api/payanastudents/dropdowns
Districts: GET /api/payanastudents/districts
```

The mobile app's `payanaApi.ts` uses:

```typescript
const BASE_URL = '/payana-students';  // with hyphen
```

This produces `/api/payana-students/create` which does **not** match the backend's `/api/payanastudents/create`.

However, the mobile app's `payanaStudentApi.ts` (student list) correctly uses:

```typescript
const BASE_URL = '/payanastudents';  // no hyphen, correct
```

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| Payana create | `/payana-students/create` | `/payanastudents/create` | Controller source line 15, 31-32; Contract doc line 8, 36 | **FIX REQUIRED** — Change `BASE_URL` in `payanaApi.ts:12` |
| Payana dropdowns | `/payana-students/dropdowns` | `/payanastudents/dropdowns` | Contract doc line 337 | **FIX REQUIRED** — Same `BASE_URL` fix |
| Payana districts | `/payana-students/districts` | `/payanastudents/districts` | Contract doc (districts endpoint) | **FIX REQUIRED** — Same `BASE_URL` fix |
| Payana student list | `/payanastudents/studentlist` | `/payanastudents/studentlist` | Controller source line 15 | **NONE — Already correct** |

**Classification: CONFIRMED DEFECT (D9)** — Payana create/dropdowns/districts endpoints use hyphenated path but backend expects non-hyphenated. Single `BASE_URL` change fixes all three.

---

## 7. Professional — Endpoint Verification (Post-D2 Fix)

### Contract Evidence

The API contract document confirms:

```
Base Route: api/VP_NewProfessional
Submit: POST /api/VP_NewProfessional/submit
Dropdowns: GET /api/VP_NewProfessional/dropdowns
```

After the D2 fix, the mobile app uses `/VP_NewProfessional/submit` and `/VP_NewProfessional/dropdowns` (without the extra `/api` prefix). Since `API_BASE_URL` ends with `/api`, the full URLs are correct.

### Field & Document Verification

The contract lists 24 form fields and 9 file fields. The mobile app's `professionalMapper` matches all fields and documents exactly.

### Verdict

| Item | Mobile Implementation | Backend Expectation | Evidence | Required Change |
|------|----------------------|---------------------|----------|----------------|
| Professional endpoint | `/VP_NewProfessional/submit` | Same | Contract doc line 3, 11 | **NONE — Confirmed (post-D2)** |
| Professional dropdowns | `/VP_NewProfessional/dropdowns` | Same | Contract doc line 5 | **NONE — Confirmed (post-D2)** |
| Professional fields | 24 fields, all matching | 24 fields | Contract doc lines 14-39 | **NONE — Confirmed match** |
| Professional documents | 9 files, all matching | 9 files | Contract doc lines 41-50 | **NONE — Confirmed match** |

**Classification: CONFIRMED CONTRACT** — Professional form is fully correct after D2 fix.

---

## 8. Student List Endpoints — Verification

| Form | Mobile Endpoint | Backend Route Prefix | Evidence | Match? |
|------|----------------|---------------------|----------|--------|
| PUC | `/pucstudents/studentlist` | `api/pucstudents` | Controller source line 16 | ✅ |
| Professional | `/professionalstudents/studentlist` | `api/professionalstudents` | Controller source line 13 | ✅ |
| Semi Professional | `/semiprofessional/studentlist` | `api/semiprofessional` | List controller source line 16 | ✅ |
| Payana | `/payanastudents/studentlist` | `api/payanastudents` | Controller source line 15 | ✅ |

**Classification: CONFIRMED CONTRACT** — All 4 student list endpoints are correct.

---

## Summary — Contract Decision Table

| # | Contract Area | Mobile Current | Backend Expected | Evidence | Required Frontend Change | Severity |
|---|--------------|----------------|-----------------|----------|------------------------|----------|
| I1 | PUC Format 1.1 field names | Short names (Gender, Caste, District, Place...) | Same short names | API Contract doc | **NONE** | ✅ Confirmed |
| I2 | PUC Format 1.1 documents | 5 docs (StudentSelfie, SSLCMarksCard, FeeReceipts, BankPassbook, AadhaarCard) | Same 5 docs | API Contract doc | **NONE** | ✅ Confirmed |
| I3 | PUC Format 1.1 missing portal fields | Not included | Not in contract | API Contract doc | **NONE** | ✅ Intentional |
| I4 | Semi Professional create endpoint | `/semi-professional/create` | `/semiprofessionalstudent/create` | Controller source | **FIX `semiProfessionalApi.ts` paths** | **CRITICAL** |
| I5 | Semi Professional dropdowns endpoint | `/semi-professional/form-data` | `/semiprofessionalstudent/dropdowns` | Controller source | **FIX `semiProfessionalApi.ts` paths** | **CRITICAL** |
| I6 | Semi Professional field names | 5 wrong field names | DateOfBirth, Address, PlaceID, AnnualIncome, SemiProfessionalCourseID | Controller source | **FIX mapper + form screens** | **CRITICAL** |
| I7 | Semi Professional documents | 9 docs (wrong set) | 3 docs (PUCMarksCard, IncomeCertificate, AadharCard) | Controller source | **FIX mapper + form screens** | **CRITICAL** |
| I8 | Semi Professional extra fields | 8 fields not in backend | Not expected | Controller source | **REMOVE from form** | **HIGH** |
| D9 | Payana create/dropdowns endpoint | `/payana-students/` (hyphenated) | `/payanastudents/` (no hyphen) | Controller source + contract doc | **FIX `BASE_URL` in `payanaApi.ts`** | **CRITICAL** |
| — | Professional endpoint (post-D2) | `/VP_NewProfessional/submit` | Same | Contract doc | **NONE** | ✅ Confirmed |
| — | Professional fields & documents | 24 fields + 9 docs | Same | Contract doc | **NONE** | ✅ Confirmed |
| — | All 4 student list endpoints | All correct | All correct | Controller source | **NONE** | ✅ Confirmed |

---

## New Defects Discovered

| Defect | Severity | Description | Fix Scope |
|--------|----------|-------------|-----------|
| **D7** | CRITICAL | Semi Professional API endpoints wrong (`/semi-professional/` vs `/semiprofessionalstudent/`) | 2 lines in `semiProfessionalApi.ts` |
| **D8** | CRITICAL | Semi Professional mapper field names, document set, and form fields do not match backend contract | Major rework of mapper + form screens + schemas |
| **D9** | CRITICAL | Payana API `BASE_URL` uses hyphen (`/payana-students`) but backend has no hyphen (`/payanastudents`) | 1 line in `payanaApi.ts` |

---

## Recommendations

### Immediate (Minimal, High Impact)

1. **D9 — Payana `BASE_URL` fix**: Change `/payana-students` to `/payanastudents` in `payanaApi.ts:12`. One-line fix, unblocks Payana form submission.

2. **D7 — Semi Professional endpoint fix**: Change `/semi-professional/create` to `/semiprofessionalstudent/create` and `/semi-professional/form-data` to `/semiprofessionalstudent/dropdowns` in `semiProfessionalApi.ts`. Two-line fix.

### Major Rework (Requires Approval)

3. **D8 — Semi Professional form rebuild**: The entire Semi Professional form (mapper, schemas, form screens, document section) needs to be rebuilt to match the actual backend contract. The backend expects:
   - 20 form fields (not 25+)
   - 3 documents (not 9)
   - Different field names for 5 critical fields
   - `SemiProfessionalCourseID` from a Semi Professional courses dropdown (not `CourseApplying`/`CourseStream`)
   - `PlaceID` (not `AreaTypeID`)
   - No CET/PET rank fields
   - No Father/Mother name fields
   - No House type / Monthly rent fields

### Leave Untouched

4. **PUC Format 1.1** — Fully confirmed. No changes needed.
5. **Professional** — Fully confirmed (post-D2). No changes needed.
6. **All student list endpoints** — Fully confirmed. No changes needed.

---

**Report End — Stopping for approval before making any changes.**
