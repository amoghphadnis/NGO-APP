# Phase 1C — PUC Format 1.1 Migration (DEFERRED, pending backend confirmation)

Status: **Not started.** Blocked on the backend question in §1.
Source contracts: `APIContracts/markdown-output/PUC FORMAT 1.1 API CONTRACT.md`,
`Edit_Format1_1_PUC_Student_API_Contract.md`, `FORMAT 1.1 PUC STUDENT GRID API CONTRACT.md`.

## 1. Open question for backend (blocker)

The mobile app currently submits PUC applications to `POST /students/students/create`
with the field set in `src/forms/puc/mapper.ts`. The contract set documents a different
controller, `VP_Format1_1PUCApiController` at `POST /api/puc-format1-1/create`, with a
different model (`PUCStudentFormat1_1`).

**Confirm before starting:**
- Is `/students/students/create` still live, or is `/api/puc-format1-1/create` its replacement?
- Is `Format1_1_PUC` the target table for new PUC applications from the app?
- Are the 5 files truly mandatory for mobile submissions (the controller rejects with 400 otherwise)?

## 2. Contract summary (create)

`POST /api/puc-format1-1/create` — multipart/form-data — **public (no JWT)** — 201 on success.

Form fields (bound by property name on `PUCStudentFormat1_1`):

| Contract field | Current app field (mapper) | Change |
|---|---|---|
| `Email` | `Email` | none |
| `StudentName` | `StudentName` | none |
| `District` | `DistrictID` | rename |
| `OtherDistrict` | `OtherDistrict` | none |
| `Taluk` | `Taluka` | rename |
| `ResidentialAddress` | `Address` | rename |
| `ContactNumber` | `ContactNumber` | none |
| `AlternateNumber` | `AlternateNumber` | none |
| `Gender` | `GenderID` | rename |
| `DateOfBirth` | `DateOfBirth` | none |
| `Caste` | `CasteCategoryID` | rename |
| `Place` | `AreaTypeID` | rename |
| `FatherOccupation` | `FatherOccupationID` | rename |
| `MotherOccupation` | `MotherOccupationID` | rename |
| `TotalFamilyMembers` | `FamilyMembers` | rename |
| `FamilyAnnualIncome` | `FamilyIncome` | rename |
| `SSLCPercentage` | `SecuredPercentage` | rename |
| `CourseJoined` | `CourseID` | rename |
| `CollegeName` | `CollegeName` | none |
| `CollegeType` | `CollegeTypeID` | rename |
| `CollegeFees` | `ExpectedFees` | rename |
| `CollegeContactNumber` | — | **new** |
| `Achievement` | — | **new** |
| `ParentsBankBalance` | — | **new** |
| `AccountHolderName` | — | **new (bank)** |
| `AccountNumber` | — | **new (bank)** |
| `IFSCCode` | — | **new (bank)** |
| `BankName` | — | **new (bank)** |
| `BranchName` | — | **new (bank)** |

Fields the app sends that are **not in the contract** (would be silently dropped):
`Pincode`, `FatherName`, `MotherName`, `MonthlyRent`, `ResidenceType`, `HouseTypeID`,
`ReferenceSourceID`, `ReferenceSourceOther`, `TotalMarks`, `HouseVisitLink`.

Files — **all 5 mandatory**, `.pdf/.jpg/.jpeg/.png` only:

| Contract file field | Current app file |
|---|---|
| `StudentSelfie` | `studentPhoto` (rename) |
| `SSLCMarksCard` | `sslcMarksCard` (rename) |
| `FeeReceipts` | — **new** |
| `BankPassbook` | — **new** |
| `AadhaarCard` | — **new** |

Current app files with no contract counterpart: `electricityBill`, `rationCard`,
`incomeCert`, `familyPhoto`, `houseVideo`.

Dropdowns: `GET /api/puc-format1-1/dropdowns` (public) → `{ genders, areas, districts,
castes, courses, collegeTypes, fatherOccupations, motherOccupations }`, items `{Value, Text}`.
`normalizeDropdowns.ts` already understands `{Value, Text}` (added in Phase 1B).

## 3. Already delivered in Phase 1B (reusable)

- `src/types/editStudents.ts` — `PucFormat11StudentDto`, `PUC_FORMAT11_FILE_FIELDS`,
  dropdown/update types (field names match the create contract).
- `src/api/pucEditApi.ts` — GET `/edit-format1-1-puc-student/{id}`, `/dropdowns`,
  POST `/{id}/update`.
- `src/api/client.ts` — JWT coverage for `/edit-format1-1-puc-student`, `/format1-1-puc`;
  `/edit-format1-1-puc-student/dropdowns` marked public.

## 4. Work plan (once §1 is confirmed)

1. **Schema** — `src/validation/pucSchemas.ts`
   - Replace `pucCategoryHousingSchema` (HouseType/ReferenceSource not in contract).
   - Extend academic with `collegeContactNumber`, `achievement`.
   - Add `pucBankDetailsSchema` (`accountHolderName`, `accountNumber`, `ifscCode`,
     `bankName`, `branchName`, `parentsBankBalance`).
   - Replace `pucDocumentDetailsSchema` with 5 **required** `UploadedDocument` fields.
   - Keep the section structure (personal/contact/address/family/academic/bank/documents)
     so the step engine is unchanged; flattening happens in the mapper.
2. **Mapper** — `src/forms/puc/mapper.ts` and `fileKeys.ts`
   - Emit contract field names from the table in §2; drop non-contract fields.
   - Emit the 5 contract file keys; fail fast client-side if any is missing.
3. **API** — `src/api/pucApi.ts`
   - `POST /puc-format1-1/create`, `GET /puc-format1-1/dropdowns` (base URL already has `/api`).
   - Success is 201 `{ success, message }` (handled by `normalizeApiResponse`).
4. **Store defaults** — `src/store/useFormEngineStore.ts` PUC branch and upload-state keys.
5. **UI** — `src/forms/puc/config.ts`, `src/screens/form-sections/puc/*`
   - Remove Category & Housing step; add Bank Details step; rework Document step for 5 files.
   - Document UI copy: fee receipt, bank passbook, Aadhaar.
6. **Docs types** — `src/types/documents.ts` `PUCDocuments` → 5 contract fields.
7. **Tests** — extend `src/submission/__tests__/submission.test.ts` with a PUC case
   asserting the exact field/file keys; add a schema test that missing files fail.
8. **Approval grid** (optional, same phase) — `GET /format1-1-puc/list`,
   `POST /format1-1-puc/approve/{id}`, `reject/{id}`, `DELETE delete/{id}`.

## 5. Risks

- Breaking change for any PUC drafts persisted with the old shape (store is in-memory only today).
- Backend does not validate master IDs; unparsable ints become `NULL` silently — keep
  client-side `min(1)` checks.
- No transaction between file copy and INSERT server-side; a failed INSERT leaves orphan files.
