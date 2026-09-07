# D8 — Semi Professional Contract Migration Plan

**Date:** 6 September 2026  
**Scope:** Rebuild the Semi Professional mobile form to match the confirmed backend contract.  
**Evidence:** `Controllers/Controllers/SemiProfessionalStudentController.cs` (backend source)  
**Constraint:** Stop for approval before implementing. Do not change backend.

---

## 1. Confirmed Backend Contract

### Endpoint

| Item | Value |
|------|-------|
| Route prefix | `api/semiprofessionalstudent` |
| Create | `POST /api/semiprofessionalstudent/create` |
| Dropdowns | `GET /api/semiprofessionalstudent/dropdowns` |
| Content-Type | `multipart/form-data` (create only) |

### Create Endpoint — Request Fields

Read from `HttpContext.Current.Request` in `SemiProfessionalStudentController.cs:54-202`.

| # | Form Field | Type | Required | DB Column | Notes |
|---|-----------|------|----------|-----------|-------|
| 1 | `Email` | string | Yes (duplicate check) | Email | Checked for uniqueness |
| 2 | `StudentName` | string | Yes | StudentName | |
| 3 | `DateOfBirth` | string | Yes | DateOfBirth | Date string |
| 4 | `DistrictID` | string/int | Yes | DistrictID | |
| 5 | `OtherDistrict` | string | No | OtherDistrict | Defaults to `""` |
| 6 | `Taluk` | string | Yes | Taluk | Defaults to `""` |
| 7 | `Address` | string | Yes | Address | Defaults to `""` |
| 8 | `ContactNumber` | string | Yes | ContactNumber | |
| 9 | `GenderID` | string/int | Yes | GenderID | |
| 10 | `CasteCategoryID` | string/int | Yes | CasteCategoryID | |
| 11 | `FatherOccupationID` | string/int | Yes | FatherOccupationID | |
| 12 | `MotherOccupationID` | string/int | Yes | MotherOccupationID | |
| 13 | `FamilyMembers` | string/int | Yes | FamilyMembers | |
| 14 | `AnnualIncome` | string/decimal | Yes | AnnualIncome | |
| 15 | `PUPercentage` | string/decimal | Yes | PUPercentage | |
| 16 | `SemiProfessionalCourseID` | string/int | Yes | SemiProfessionalCourseID | FK to SemiProfessionalCourses_Master |
| 17 | `CollegeName` | string | Yes | CollegeName | |
| 18 | `CollegeTypeID` | string/int | Yes | CollegeTypeID | |
| 19 | `CollegeFees` | string/decimal | Yes | CollegeFees | |
| 20 | `PlaceID` | string/int | Yes | PlaceID | FK to PlaceMaster |
| 21 | `HouseVisitLink` | string | No | HouseVisitLink | Defaults to `""`; set during house visit |

### Create Endpoint — File Upload Fields

| # | File Field | Required | DB Column |
|---|-----------|----------|-----------|
| 1 | `PUCMarksCard` | No (null saved if missing) | PUCMarksCardPath |
| 2 | `IncomeCertificate` | No | IncomeCertificatePath |
| 3 | `AadharCard` | No | AadharCardPath |

### Create Endpoint — Response

**Success (200):**
```json
{
  "Success": true,
  "Message": "Semi Professional Student Saved Successfully",
  "StudentId": 123
}
```

**Error (500):**
```json
{
  "Message": "error message"
}
```

**Duplicate email (400):**
```json
{
  "Message": "This Email ID is already registered. Student can apply only once."
}
```

### Dropdowns Endpoint — Response

```json
{
  "Success": true,
  "Districts": [{ "Id": 1, "Name": "..." }],
  "Genders": [{ "Id": 1, "Name": "..." }],
  "SemiProfessionalCourses": [{ "Id": 1, "Name": "..." }],
  "CasteCategories": [{ "Id": 1, "Name": "..." }],
  "FatherOccupations": [{ "Id": 1, "Name": "..." }],
  "MotherOccupations": [{ "Id": 1, "Name": "..." }],
  "Places": [{ "Id": 1, "Name": "..." }],
  "CollegeTypes": [{ "Id": 1, "Name": "..." }]
}
```

**Key differences from current normalizer expectations:**
- Response uses `Id`/`Name` (PascalCase) — current normalizer already handles this ✅
- Property names: `Districts`, `Genders`, `SemiProfessionalCourses`, `CasteCategories`, `FatherOccupations`, `MotherOccupations`, `Places`, `CollegeTypes`
- **No** `AreaList`/`AreaTypes` — backend uses `Places` (PlaceID/PlaceMaster)
- **No** `HouseList`/`HouseTypes` — backend does not have house type
- **No** `ReferenceList`/`ReferenceSources`
- `SemiProfessionalCourses` comes from `SemiProfessionalCourses_Master` (not `CourseMaster`)

---

## 2. Current Mobile Implementation

### Current Form Steps (7 steps)

1. Guidelines
2. Personal (email, studentName, dateOfBirth, contactNumber, alternateNumber, residentialAddress, googleMapLink, areaTypeID, districtID, otherDistrict, genderID, casteCategoryID)
3. Family (fatherName, motherName, fatherOccupationID, motherOccupationID, familyMembers, houseTypeID, monthlyRent, familyIncome)
4. Academic (puPercentage, cetRank, ptRank, courseApplying, courseStream)
5. Documents (9 docs: studentSelfie, cetRankSheet, ptRankSheet, dwellingUnitPhoto, marksSheet12, houseVideo, electricityBill, incomeCertificate, rationCard)
6. Review
7. Success

### Current Mapper Output

Sends 25+ form fields and 9 file fields with names like `DOB`, `ResidentialAddress`, `AreaTypeID`, `FamilyIncome`, `CourseApplying`, `CourseStream`, `FatherName`, `MotherName`, `HouseTypeID`, `MonthlyRent`, `CETRank`, `PTRank`, `AlternateNumber`, `GoogleMapLink`.

---

## 3. Field-by-Field Migration Table

### A. Form Fields — KEEP (correct name, no change needed)

| Mobile Field | Backend Field | Match? | Action |
|-------------|--------------|--------|--------|
| `Email` | `Email` | ✅ | None |
| `StudentName` | `StudentName` | ✅ | None |
| `ContactNumber` | `ContactNumber` | ✅ | None |
| `DistrictID` | `DistrictID` | ✅ | None |
| `OtherDistrict` | `OtherDistrict` | ✅ | None |
| `GenderID` | `GenderID` | ✅ | None |
| `CasteCategoryID` | `CasteCategoryID` | ✅ | None |
| `FatherOccupationID` | `FatherOccupationID` | ✅ | None |
| `MotherOccupationID` | `MotherOccupationID` | ✅ | None |
| `FamilyMembers` | `FamilyMembers` | ✅ | None |
| `PUPercentage` | `PUPercentage` | ✅ | None |

### B. Form Fields — RENAME (wrong field name in mapper)

| Current Mapper Field | Backend Expected Field | Action |
|---------------------|----------------------|--------|
| `DOB` | `DateOfBirth` | Rename in mapper |
| `ResidentialAddress` | `Address` | Rename in mapper |
| `AreaTypeID` | `PlaceID` | Rename in mapper + schema + UI |
| `FamilyIncome` | `AnnualIncome` | Rename in mapper + schema + UI |
| `CourseApplying` | `SemiProfessionalCourseID` | Change from text input to dropdown, rename in mapper + schema + UI |

### C. Form Fields — REMOVE (not in backend contract)

| Current Mobile Field | Reason | Action |
|---------------------|--------|--------|
| `AlternateNumber` | Not in backend | Remove from schema + mapper + UI |
| `GoogleMapLink` | Not in backend | Remove from schema + mapper + UI |
| `FatherName` | Not in backend | Remove from schema + mapper + UI |
| `MotherName` | Not in backend | Remove from schema + mapper + UI |
| `HouseTypeID` | Not in backend | Remove from schema + mapper + UI |
| `MonthlyRent` | Not in backend | Remove from schema + mapper + UI |
| `CETRank` | Not in backend | Remove from schema + mapper + UI |
| `PTRank` | Not in backend | Remove from schema + mapper + UI |
| `CourseStream` | Not in backend | Remove from schema + mapper + UI |

### D. Form Fields — ADD (in backend but missing from mobile)

| Backend Field | Type | Required | Action |
|--------------|------|----------|--------|
| `Taluk` | string | Yes | Add to personal/address schema + UI + mapper |
| `CollegeName` | string | Yes | Add to academic schema + UI + mapper |
| `CollegeTypeID` | int (dropdown) | Yes | Add to academic schema + UI + mapper |
| `CollegeFees` | decimal | Yes | Add to academic schema + UI + mapper |
| `PlaceID` | int (dropdown) | Yes | Replace `AreaTypeID` with `PlaceID` in personal schema + UI + mapper |
| `SemiProfessionalCourseID` | int (dropdown) | Yes | Replace `courseApplying` text input with dropdown in academic schema + UI + mapper |
| `HouseVisitLink` | string | No | Optional — can default to `""` in mapper, no UI needed initially |

### E. Documents — REPLACE ENTIRELY

| Current (9 docs) | Backend (3 docs) | Action |
|-----------------|-----------------|--------|
| `StudentSelfie` | *(not in backend)* | Remove |
| `CETRankSheet` | *(not in backend)* | Remove |
| `PTRankSheet` | *(not in backend)* | Remove |
| `DwellingUnitPhoto` | *(not in backend)* | Remove |
| `MarksSheet12` | *(not in backend)* | Remove |
| `HouseVideo` | *(not in backend)* | Remove |
| `ElectricityBill` | *(not in backend)* | Remove |
| `IncomeCertificate` | `IncomeCertificate` | Keep |
| `RationCard` | *(not in backend)* | Remove |
| *(missing)* | `PUCMarksCard` | Add |
| *(missing)* | `AadharCard` | Add |

### F. Dropdowns — UPDATE

| Dropdown | Current Normalizer Key | Backend Response Key | Action |
|----------|----------------------|---------------------|--------|
| Districts | `Districts` / `districts` | `Districts` | ✅ Already handled |
| Genders | `Genders` / `genders` | `Genders` | ✅ Already handled |
| Caste Categories | `CasteCategories` / `casteCategories` | `CasteCategories` | ✅ Already handled |
| Father Occupations | `FatherOccupations` / `fatherOccupations` | `FatherOccupations` | ✅ Already handled |
| Mother Occupations | `MotherOccupations` / `motherOccupations` | `MotherOccupations` | ✅ Already handled |
| Places | `AreaList` / `AreaTypes` / `areas` | `Places` | **FIX** — Add `Places` / `places` to normalizer |
| College Types | `CollegeTypeList` / `CollegeTypes` | `CollegeTypes` | ✅ Already handled |
| Semi Professional Courses | `CourseList` / `Courses` | `SemiProfessionalCourses` | **FIX** — Add `SemiProfessionalCourses` / `semiProfessionalCourses` to normalizer |
| House Types | `HouseList` / `HouseTypes` | *(not in backend)* | Remove from normalizer |
| Area Types | `AreaList` / `AreaTypes` | *(not in backend)* | Remove from normalizer |
| Reference Sources | `ReferenceList` / `ReferenceSources` | *(not in backend)* | Remove from normalizer |

---

## 4. Proposed New Form Structure (6 steps)

| Step | Title | Fields |
|------|-------|--------|
| 1. Guidelines | Application Guidelines | (unchanged — already updated in D4) |
| 2. Personal | Applicant's Information | email, studentName, dateOfBirth, contactNumber, genderID, casteCategoryID, districtID, otherDistrict, taluk, address, placeID |
| 3. Family | Family Details | fatherOccupationID, motherOccupationID, familyMembers, annualIncome |
| 4. Academic | Academic & College Details | puPercentage, semiProfessionalCourseID, collegeName, collegeTypeID, collegeFees |
| 5. Documents | Document Upload | pucMarksCard, incomeCertificate, aadharCard (3 docs) |
| 6. Review | Review Application | (unchanged) |
| 7. Success | Application Submitted | (unchanged) |

---

## 5. Files Requiring Changes

| File | Change Type | Description |
|------|------------|-------------|
| `src/validation/semiProfessionalSchemas.ts` | **Rewrite** | New personal, family, academic, document schemas |
| `src/forms/semiProfessional/mapper.ts` | **Rewrite** | New field names, 3 documents, remove extra fields |
| `src/forms/semiProfessional/fileKeys.ts` | **Rewrite** | 3 keys: pucMarksCard, incomeCertificate, aadharCard |
| `src/forms/semiProfessional/uploads.ts` | **Update** | 3 upload rules |
| `src/forms/semiProfessional/config.ts` | **Update** | Step titles/subtitles |
| `src/types/documents.ts` | **Update** | SemiProfessionalDocuments interface (3 docs) |
| `src/api/transformers/normalizeSemiProfDropdowns.ts` | **Update** | Add Places, SemiProfessionalCourses; remove AreaTypes, HouseTypes, ReferenceSources |
| `src/screens/form-sections/semiProfessional/PersonalSection.tsx` | **Rewrite** | Remove alternateNumber, googleMapLink, areaTypeID; add taluk, address (renamed), placeID |
| `src/screens/form-sections/semiProfessional/FamilySection.tsx` | **Rewrite** | Remove fatherName, motherName, houseTypeID, monthlyRent; rename familyIncome→annualIncome |
| `src/screens/form-sections/semiProfessional/AcademicSection.tsx` | **Rewrite** | Remove cetRank, ptRank, courseApplying, courseStream; add semiProfessionalCourseID (dropdown), collegeName, collegeTypeID (dropdown), collegeFees |
| `src/screens/form-sections/semiProfessional/DocumentSection.tsx` | **Rewrite** | 3 documents instead of 9 |
| `src/screens/form-sections/semiProfessional/ReviewSection.tsx` | **Update** | Match new field names |
| `src/constants/formOptions.ts` | **Update** | SEMI_PROFESSIONAL_REQUIRED_DOCUMENTS (3 docs) |

---

## 6. Implementation Order (Proposed)

1. **Schemas** — Rewrite `semiProfessionalSchemas.ts` with new fields
2. **File keys** — Rewrite `fileKeys.ts` with 3 keys
3. **Types** — Update `SemiProfessionalDocuments` interface
4. **Mapper** — Rewrite `mapper.ts` with correct field names and 3 documents
5. **Dropdowns normalizer** — Update `normalizeSemiProfDropdowns.ts`
6. **Form screens** — Rewrite Personal, Family, Academic, Document sections
7. **Config** — Update step titles
8. **Review section** — Update field display
9. **Constants** — Update required documents list
10. **Regression** — `tsc --noEmit` + `jest`

---

**Report End — Stopping for approval before implementing D8.**
