# Backend Patches Required — VPApp Mobile/Web Parity

This document lists the backend changes needed for the mobile app review
fixes to work end-to-end. Mobile code is already aligned with these contracts.

**Backend source of truth used:** `F:\NGO APP\API Contracts\VP_WebAPI1-10-2026\`

---

## 1. Registration / User Approval — DEPLOYMENT + ONE MISSING COLUMN

### Status of the source
`VP_WebAPI/VP_WebAPI/Controllers/RegistrationController.cs` already contains
every endpoint the mobile app calls:

| Endpoint | Route | Status in source |
|---|---|---|
| Active users | `GET /api/registration/users` | ✅ present |
| Pending users | `GET /api/registration/users/pending` | ✅ present |
| Update user | `PUT /api/registration/update/{id}` | ✅ full-field update |
| Toggle status | `POST /api/registration/toggle/{id}` | ✅ toggles `Users.Status` |
| Delete user | `DELETE /api/registration/delete/{id}` | ✅ present |
| Assign role | `PUT /api/registration/assign-role/{id}` | ✅ present (Admin/Admin(CEO) only) |
| Roles list | `GET /api/registration/roles` | ✅ present |
| Districts | `GET /api/registration/districts` | ✅ present |

**Symptom:** "User approval feature is not functioning properly" and
"edit user details … is not working" on mobile.

**Most likely cause:** the IIS deployment on the test server predates this
source. The pre-fix build had (a) no `users/pending` route (404), (b)
`update` writing only Email+Password, and (c) `toggle` updating
`Employees.Status` instead of `Users.Status` (no-op for mobile-registered
users who have no EmployeeID).

**Action:** rebuild `VP_WebAPI` from `VP_WebAPI1-10-2026` and redeploy,
then verify:

```
GET  {base}/api/registration/users/pending      → 200 with pending list
POST {base}/api/registration/toggle/{id}        → flips Users.Status
PUT  {base}/api/registration/update/{id}        → persists Name/Mobile/Role/Taluk
```

### Optional improvement — return Taluk/Address in the user lists
The `users` and `users/pending` SELECTs omit `Taluk` and `Address`, so the
mobile edit dialog always shows them blank. Add both columns to the SELECT
lists in `GetUsers()` (line ~663) and `GetPendingUsers()` (line ~725):

```sql
SELECT Id, Name, Email, Password, Mobile, Role, District, OtherDistrict,
       Taluk, Address, Status
FROM Users
WHERE ISNULL(Status,0)=1   -- =0 for pending
```

---

## 2. PUC Format 1.1 — ACCEPT 5 ADDITIONAL DOCUMENT FILES

**File:** `VP_WebAPI/VP_WebAPI/Controllers/VP_Format1_1PUCApiController.cs`
(mirror in `Modified backend files/Contrrollers/VP_Format1_1PUCApiController.cs`)

The mobile PUC (Format 1.1) form now collects **10 documents** to match the
web application. The controller currently accepts only 5. The mobile sends
these **additional multipart file fields** (names match the professional
contract):

| Form field | Web label | Type | Max size |
|---|---|---|---|
| `ElectricityBill` | Electricity Bill | PDF/JPG/JPEG/PNG | 2 MB |
| `RationCard` | Ration Card (both sides) | PDF/JPG/JPEG/PNG | 2 MB |
| `DwellingUnitPhoto` | Dwelling Unit Photo | JPG/JPEG/PNG | 2 MB |
| `HouseVideo` | House Video | MP4/MOV/AVI/MKV/WEBM/3GP | 50 MB |
| `IncomeCertificate` | Income Certificate | PDF/JPG/JPEG/PNG | 2 MB |

### DB migration (run first)

```sql
ALTER TABLE Format1_1_PUC ADD
    ElectricityBillPath      NVARCHAR(500) NULL,
    RationCardPath           NVARCHAR(500) NULL,
    DwellingUnitPhotoPath    NVARCHAR(500) NULL,
    HouseVideoPath           NVARCHAR(500) NULL,
    IncomeCertificatePath    NVARCHAR(500) NULL;
```

### Controller patch (in `PostFormat11Student` / create action)

After the existing `GetUploadedFile` calls (~line 525):

```csharp
MultipartFileInfo electricityFile =
    GetUploadedFile(provider, "ElectricityBill");

MultipartFileInfo rationCardFile =
    GetUploadedFile(provider, "RationCard");

MultipartFileInfo dwellingFile =
    GetUploadedFile(provider, "DwellingUnitPhoto");

MultipartFileInfo houseVideoFile =
    GetUploadedFile(provider, "HouseVideo");

MultipartFileInfo incomeCertFile =
    GetUploadedFile(provider, "IncomeCertificate");
```

Update the required-file check (~line 530) to include the new files
(or make them optional if the web form treats them so):

```csharp
if (selfieFile == null || sslcFile == null || feeFile == null ||
    passbookFile == null || aadhaarFile == null ||
    electricityFile == null || rationCardFile == null ||
    dwellingFile == null || houseVideoFile == null ||
    incomeCertFile == null)
{
    return Content(HttpStatusCode.BadRequest, new
    {
        success = false,
        message = "All 10 documents are required."
    });
}
```

Video validation — `IsValidFile` only permits PDF/JPG/JPEG/PNG. Add a
video-aware check for `HouseVideo` (~line 549):

```csharp
if (!IsValidFile(selfieFile) || !IsValidFile(sslcFile) ||
    !IsValidFile(feeFile) || !IsValidFile(passbookFile) ||
    !IsValidFile(aadhaarFile) || !IsValidFile(electricityFile) ||
    !IsValidFile(rationCardFile) || !IsValidFile(dwellingFile) ||
    !IsValidFile(incomeCertFile) || !IsValidVideoFile(houseVideoFile))
{
    return Content(HttpStatusCode.BadRequest, new
    {
        success = false,
        message = "Only PDF, JPG, JPEG, PNG files (video for HouseVideo) are allowed."
    });
}
```

New helper next to `IsValidFile` (~line 1258):

```csharp
private bool IsValidVideoFile(MultipartFileInfo file)
{
    if (file == null) return false;
    string ext = Path.GetExtension(
        file.FileName ?? string.Empty).ToLowerInvariant();
    return ext == ".mp4" || ext == ".mov" || ext == ".avi" ||
           ext == ".mkv" || ext == ".webm" || ext == ".3gp";
}
```

Save + insert (~lines 590-650):

```csharp
string electricityPath = SaveFile(electricityFile, folder);
string rationPath = SaveFile(rationCardFile, folder);
string dwellingPath = SaveFile(dwellingFile, folder);
string houseVideoPath = SaveFile(houseVideoFile, folder);
string incomeCertPath = SaveFile(incomeCertFile, folder);
```

Add the 5 columns + parameters to the `INSERT INTO Format1_1_PUC`
statement and `cmd.Parameters.AddWithValue(...)` for each path.

> NOTE: raising the IIS `maxRequestLength`/`maxAllowedContentLength`
> may be required — 9 × 2 MB + 1 × 50 MB ≈ 68 MB worst case.
> `web.config`: `maxAllowedContentLength` should be ≥ 75 MB.

---

## 3. Verification checklist (post-deploy)

- [ ] `GET /api/registration/users/pending` returns pending users
- [ ] Approve (toggle) activates a pending user; Reject (delete) removes
- [ ] Edit user persists Name, Email, Mobile, Role, District, Taluk
- [ ] `PUT /api/registration/assign-role/{id}` works for Admin sessions
- [ ] PUC Format 1.1 POST accepts all 10 file fields without 400
- [ ] Uploaded files land in `~/Uploads/PUC_Format1_1/` and paths persist
