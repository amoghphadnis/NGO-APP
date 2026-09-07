=========================================================

API CONTRACT DOCUMENT

=====================

API Name:

New Professional Approval Grid API

Controller:

VP\_NewProfessinalApprovalGridAPIController

Namespace:

VP\_WebAPI.Controllers

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/new-professional-approval

Authentication:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute on every public endpoint in this controller.

Important:

The controller does NOT use a controller-level JWT attribute. However, all eight public actions individually contain [JwtSessionFilter]. Therefore, based on the supplied controller, JWT authentication is currently required for every endpoint exposed by this controller.

Authorization behavior is not identical for every endpoint:

- All endpoints have the JwtSessionFilter.

- The two grid/list endpoints additionally read UserRole and UserID from Session.

- Branch Executives are restricted to their mapped districts on the two grid/list endpoints.

- The approve/reject/delete/import actions do not contain an explicit role check in the controller. Any role enforcement performed internally by JwtSessionFilter is not specified in the supplied controller.

=========================================================

ENDPOINT SUMMARY

================

| # | Endpoint | Method | JWT |

|---|----------|--------|-----|

| 1 | Get Professional Approval Grid | GET | Required |

| 2 | Approve Professional Student | POST | Required |

| 3 | Reject Professional Student | POST | Required |

| 4 | Delete / Soft Delete Professional Student | DELETE | Required |

| 5 | Import Professional Students from Excel | POST | Required |

| 6 | Get Imported Professional Student Grid | GET | Required |

| 7 | Approve Imported Professional Student | POST | Required |

| 8 | Reject Imported Professional Student | POST | Required |

Note:

There are 8 HTTP endpoints in the supplied controller. Private helper methods such as GetUserId(), GetUserRole(), UpdateStatus(), GetOriginalFileName(), and DeleteUploadedFile() are not API endpoints.

=========================================================

1. GET PROFESSIONAL APPROVAL GRID

==================================

Endpoint:

GET /api/new-professional-approval/list

Purpose:

Retrieves professional student applications whose Status is 1 and returns them as an approval grid.

The endpoint joins NewProfessionalApplication with master tables to return both ID values and descriptive names for district, gender, caste category, area type, father occupation, mother occupation, and house type.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Controller-level JWT filter:

Not present

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

The controller does not directly read JWT claims.

\* Required Roles:

No explicit role requirement is declared through an authorization attribute.

\* Session dependencies:

Yes.

\* Session values used:

- Session["UserID"]

- Session["UserRole"]

The controller expects these Session values to be available, presumably as a result of the authentication/filter mechanism.

Role-specific behavior:

If UserRole is "Branch Executives":

- UserID must be available.

- Applications are restricted to districts mapped to that UserID in BranchExecutiveDistrictMapping.

For roles other than "Branch Executives":

- No district restriction is applied by this controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No path parameters are used. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are defined. |

Request Body:

None.

Content-Type:

Not applicable for a GET request.

Validation Rules:

\* UserRole must exist in Session.

\* If UserRole is missing/blank, the endpoint returns 403 Forbidden.

\* If UserRole is "Branch Executives", UserID must exist in Session.

\* If Branch Executive UserID is unavailable, the endpoint returns 401 Unauthorized.

\* Applications are filtered by np.Status = 1.

\* Branch Executives are additionally restricted using BranchExecutiveDistrictMapping.UserId.

\* No pagination is implemented.

\* No search parameter is implemented.

\* No sorting parameter is implemented.

\* No date filtering is implemented.

Database Behavior:

Main table:

NewProfessionalApplication

Joined tables:

- DistrictMaster

- GenderMaster

- CasteCategoryMaster

- AreaTypeMaster

- FatherOccupationMaster

- MotherOccupationMaster

- HouseTypeMaster

Base SQL filter:

NewProfessionalApplication.Status = 1

Branch Executive filter:

NewProfessionalApplication.DistrictID must belong to a district in BranchExecutiveDistrictMapping for the authenticated UserID.

Business Logic Notes:

\* Only applications with Status = 1 are returned.

\* Branch Executives see only applications from their mapped districts.

\* The Branch Executive mapping is based on UserID from Session.

\* No database modification is performed.

\* No approval status is changed by this endpoint.

\* count equals the number of records returned.

\* No pagination metadata is returned.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ApplicationID": 101,

"StudentName": "John Doe",

"Email": "john@example.com",

"DOB": "2007-05-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Sample residential address",

"GoogleMapLink": "https://maps.google.com/...",

"AreaTypeID": 1,

"DistrictID": 5,

"GenderID": 1,

"CasteCategoryID": 2,

"DistrictName": "Dharwad",

"OtherDistrict": null,

"GenderName": "Male",

"CategoryName": "Category Name",

"AreaTypeName": "Urban",

"HouseTypeName": "Rented",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 1,

"MotherOccupationID": 2,

"FatherOccupation": "Occupation",

"MotherOccupation": "Occupation",

"FamilyMembers": 5,

"HouseTypeID": 2,

"MonthlyRent": 5000.00,

"FamilyIncome": 150000.00,

"PUPercentage": 85.50,

"CETRank": "12345",

"NEETRank": "67890",

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfiePath": "path/to/selfie.jpg",

"CETNEETRankSheetPath": "path/to/rank-sheet.pdf",

"DwellingUnitPhotoPath": "path/to/dwelling.jpg",

"MarksSheet12Path": "path/to/marksheet.pdf",

"RequestLetterPath": "path/to/request-letter.pdf",

"HouseVideoPath": "path/to/house-video.mp4",

"ElectricityBillPath": "path/to/electricity-bill.pdf",

"IncomeCertificatePath": "path/to/income-certificate.pdf",

"RationCardPath": "path/to/ration-card.pdf",

"Status": true,

"ApproveStatus": "Pending",

"Remark": null,

"CreatedDate": "2026-08-28T10:30:00"

}

]

}

Failure Responses:

403 Forbidden:

Occurs when UserRole is missing from Session.

{

"success": false,

"message": "User role was not found in session."

}

401 Unauthorized:

Occurs when the authenticated role is Branch Executives but UserID is missing from Session.

{

"success": false,

"message": "Authenticated UserID was not found."

}

500 Internal Server Error:

Occurs when an unexpected exception occurs while executing the endpoint/database query.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 401 Unauthorized

- 403 Forbidden

- 500 Internal Server Error

=========================================================

2. APPROVE PROFESSIONAL STUDENT

================================

Endpoint:

POST /api/new-professional-approval/approve/{id}

Purpose:

Updates a professional application's ApproveStatus to "Approved" and optionally stores an approval remark.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

Not present in the supplied action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

Not directly specified in the controller.

\* Required Roles:

Not specified in the controller.

\* Session values:

This action does not directly read UserID or UserRole from Session.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the professional application. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Application verified and approved."

}

Request Body DTO:

ApprovalRemarkRequest

Content-Type:

application/json

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* Remark is optional.

\* If request is null, Remark is treated as an empty string.

\* If Remark is null/empty/whitespace, the database value is stored as NULL.

\* ApproveStatus is always set internally to "Approved".

\* No validation is implemented for the maximum length of Remark at controller level, although the SQL parameter is NVARCHAR(MAX).

Business Logic Notes:

\* Calls UpdateStatus(id, "Approved", remark).

\* Updates NewProfessionalApplication.

\* Sets ApproveStatus = "Approved".

\* Sets Remark to the supplied value.

\* Blank/whitespace remarks are stored as NULL.

\* CreatedBy/ModifiedBy are not updated by this controller.

\* No explicit role check is implemented in this action.

\* The update is based only on ApplicationID.

\* No separate status validation is performed before approval.

Database Operation:

UPDATE NewProfessionalApplication

SET

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE ApplicationID = @ApplicationID

Success Response (200):

{

"success": true,

"message": "Professional student approved successfully.",

"applicationId": 101,

"approveStatus": "Approved",

"remark": "Application verified and approved."

}

If no remark is provided:

{

"success": true,

"message": "Professional student approved successfully.",

"applicationId": 101,

"approveStatus": "Approved",

"remark": ""

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid ApplicationID."

}

Occurs when id <= 0.

404 Not Found:

{

"success": false,

"message": "Professional application not found."

}

Occurs when the UPDATE affects zero rows.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

Authorization note:

401/403 may also be generated by the JwtSessionFilter itself, but such responses are not explicitly generated inside this action.

=========================================================

3. REJECT PROFESSIONAL STUDENT

================================

Endpoint:

POST /api/new-professional-approval/reject/{id}

Purpose:

Updates a professional application's ApproveStatus to "Rejected" and optionally stores a rejection remark.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

Not present in the supplied action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

Not directly specified.

\* Required Roles:

Not specified.

\* Session dependency:

No direct Session access in this action.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the professional application. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Application does not meet the required criteria."

}

Content-Type:

application/json

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* Remark is optional.

\* If request is null, Remark becomes an empty string.

\* Blank/whitespace Remark is stored as NULL.

\* ApproveStatus is always set to "Rejected".

\* No explicit role validation is implemented in the action.

Business Logic Notes:

\* Calls UpdateStatus(id, "Rejected", remark).

\* Updates NewProfessionalApplication.

\* Sets ApproveStatus = "Rejected".

\* Stores the remark.

\* Blank/whitespace remark becomes NULL.

\* No audit-user field is updated.

\* No separate current-status validation is performed.

Database Operation:

UPDATE NewProfessionalApplication

SET

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE ApplicationID = @ApplicationID

Success Response (200):

{

"success": true,

"message": "Professional student rejected successfully.",

"applicationId": 101,

"approveStatus": "Rejected",

"remark": "Application does not meet the required criteria."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid ApplicationID."

}

404 Not Found:

{

"success": false,

"message": "Professional application not found."

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

=========================================================

4. DELETE / SOFT DELETE PROFESSIONAL STUDENT

==============================================

Endpoint:

DELETE /api/new-professional-approval/delete/{id}

Purpose:

Soft deletes a professional student application by setting its Status value to 0.

This is NOT a physical DELETE operation.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

Not present in the supplied action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

Not directly specified.

\* Required Roles:

Not specified.

\* Session dependency:

No direct Session access in this action.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the professional student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

None.

Content-Type:

Not applicable.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* If no matching record is updated, 404 Not Found is returned.

Business Logic Notes:

\* Performs a soft delete.

\* Does NOT execute SQL DELETE.

\* Sets NewProfessionalApplication.Status = 0.

\* The record remains in the database.

\* The approval grid only retrieves records where Status = 1, so setting Status = 0 removes the record from that grid.

\* No UserID is used to restrict the delete operation.

\* No role check is implemented in the action.

\* No audit fields are updated.

Database Operation:

UPDATE NewProfessionalApplication

SET Status = 0

WHERE ApplicationID = @ApplicationID

Success Response (200):

{

"success": true,

"message": "New Professional Student deleted successfully.",

"applicationId": 101

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid ApplicationID."

}

404 Not Found:

{

"success": false,

"message": "Professional student not found."

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

=========================================================

5. IMPORT PROFESSIONAL STUDENTS FROM EXCEL

============================================

Endpoint:

POST /api/new-professional-approval/import

Purpose:

Uploads an Excel .xlsx file, reads student data from the first worksheet, and imports each non-empty student row into GoogleSheet\_NewProfessional.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

No role check is implemented in the action.

\* UserID/EmployeeID:

Not used by the action.

\* Session:

Not directly accessed by the import action.

Content-Type:

multipart/form-data

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

Not directly specified.

\* Required Roles:

Not specified.

\* Session dependency:

None directly used by the action.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Form Data / Multipart Fields:

| Field | Type | Required | Description |

|-------|------|----------|-------------|

| Excel file | File | Yes | First uploaded multipart file is treated as the Excel file. The exact multipart field name is not read or validated by the controller. |

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|-------|------|----------|--------------------|----------|-------------|

| Excel file | File | Yes | .xlsx | Not specified in controller | Excel workbook uploaded as multipart/form-data. Only the first uploaded file is processed. |

File Rules:

\* Request must be multipart/form-data.

\* At least one uploaded file is required.

\* Only .xlsx is supported.

\* Extension comparison is case-insensitive.

\* If the extension is not .xlsx, the temporary uploaded file is deleted.

\* Maximum file size is not specified in the controller.

\* Multiple uploaded files may technically be sent, but only the first file is processed.

\* The exact multipart form-data field name is not specified/validated.

\* Uploaded files are initially stored under:

~/App\_Data/TempUploads

\* The directory is created if it does not exist.

\* The controller does not permanently save the uploaded Excel file.

\* The uploaded temporary file is deleted when an unsupported extension is detected.

\* For normal successful processing, explicit temporary-file deletion after processing is not implemented in the supplied controller.

Excel Processing:

The controller reads worksheet 1.

The worksheet is considered invalid if:

- No used row exists.

- There is only a header/no student data.

Row 1 is treated as the header row.

Student data begins from row 2.

A row is completely skipped if BOTH StudentName and EmailAddress are blank.

Excel Column Mapping:

| Column | Excel Field |

|--------|-------------|

| 1 | Timestamp |

| 2 | EmailAddress |

| 3 | StudentName |

| 4 | DateOfBirth |

| 5 | ResidentialAddress |

| 6 | GoogleMapLink |

| 7 | Place |

| 8 | District |

| 9 | ContactNumber |

| 10 | AlternateNumber |

| 11 | Gender |

| 12 | CasteCategory |

| 13 | FatherName |

| 14 | MotherName |

| 15 | FatherOccupation |

| 16 | MotherOccupation |

| 17 | FamilyMembers |

| 18 | HouseType |

| 19 | MonthlyRent |

| 20 | FamilyIncome |

| 21 | SecuredPercentage12th |

| 22 | CETRank |

| 23 | NEETRank |

| 24 | CourseApplying |

| 25 | CourseStream |

| 26 | StudentSelfie |

| 27 | CET\_NEETRankSheet |

| 28 | DwellingUnitPhotograph |

| 29 | MarksSheet12th |

| 30 | HandWrittenRequestLetter |

| 31 | HouseVideo |

| 32 | ElectricityBill |

| 33 | IncomeCertificate |

| 34 | RationCardCopy |

Validation / Conversion Rules:

Timestamp:

- Read as formatted Excel text.

- Stored as NVARCHAR(100).

EmailAddress:

- Read as text.

- Stored as NVARCHAR(255).

- No email-format validation is performed.

StudentName:

- Read as text.

- Stored as NVARCHAR(255).

- The only empty-row test checks StudentName and EmailAddress together.

DateOfBirth:

- Read as text.

- Stored as NVARCHAR(100).

- No date parsing/validation is performed by this controller.

ResidentialAddress:

- Read as text.

- Stored as NVARCHAR(MAX).

GoogleMapLink:

- Read as text.

- Stored as NVARCHAR(MAX).

- No URL validation is performed.

Place:

- Read as text.

- Stored as NVARCHAR(200).

District:

- Read as text.

- Stored as NVARCHAR(200).

ContactNumber:

- Read as text.

- Stored as NVARCHAR(20).

- No phone-number validation is performed.

AlternateNumber:

- Read as text.

- Stored as NVARCHAR(20).

Gender:

- Read as text.

- Stored as NVARCHAR(50).

CasteCategory:

- Read as text.

- Stored as NVARCHAR(200).

FatherName:

- Read as text.

- Stored as NVARCHAR(255).

MotherName:

- Read as text.

- Stored as NVARCHAR(255).

FatherOccupation:

- Read as text.

- Stored as NVARCHAR(255).

MotherOccupation:

- Read as text.

- Stored as NVARCHAR(255).

FamilyMembers:

- Parsed using int.TryParse().

- If parsing succeeds, integer value is stored.

- If parsing fails, NULL is stored.

- Invalid numeric input therefore does not directly fail the row because the controller converts it to DBNull.Value.

HouseType:

- Read as text.

- Stored as NVARCHAR(100).

MonthlyRent:

- Removes comma characters.

- Removes the ₹ symbol.

- Trims whitespace.

- Attempts decimal.TryParse().

- If parsing fails, NULL is stored.

Examples:

"₹3,750" -> 3750

"3,750" -> 3750

FamilyIncome:

- Removes comma characters.

- Removes the ₹ symbol.

- Trims whitespace.

- Attempts decimal.TryParse().

- If parsing fails, NULL is stored.

SecuredPercentage12th:

- Removes "%" characters.

- Trims whitespace.

- Attempts decimal.TryParse().

- If parsing fails, NULL is stored.

CETRank:

- Removes comma characters.

- Trims whitespace.

- Attempts int.TryParse().

- If parsing fails, NULL is stored.

NEETRank:

- Removes comma characters.

- Trims whitespace.

- Attempts int.TryParse().

- If parsing fails, NULL is stored.

CourseApplying:

- Stored as NVARCHAR(255).

CourseStream:

- Stored as NVARCHAR(255).

Document/path fields:

- Stored as NVARCHAR(MAX).

- The controller does not validate their file extensions because these are imported as Excel cell values, not uploaded files.

Database Operation:

INSERT INTO dbo.GoogleSheet\_NewProfessional

Fields inserted:

Timestamp

EmailAddress

StudentName

DateOfBirth

ResidentialAddress

GoogleMapLink

Place

District

ContactNumber

AlternateNumber

Gender

CasteCategory

FatherName

MotherName

FatherOccupation

MotherOccupation

FamilyMembers

HouseType

MonthlyRent

FamilyIncome

SecuredPercentage12th

CETRank

NEETRank

CourseApplying

CourseStream

StudentSelfie

CET\_NEETRankSheet

DwellingUnitPhotograph

MarksSheet12th

HandWrittenRequestLetter

HouseVideo

ElectricityBill

IncomeCertificate

RationCardCopy

No duplicate check is implemented.

No transaction is implemented around the complete import.

Row-level error handling:

- Each Excel row is processed inside its own try/catch.

- If one row fails, failedCount is incremented and processing continues with the next row.

- The error is recorded as:

"Row {row number} | {exception message}"

Database name:

The endpoint executes SELECT DB\_NAME() and returns the current database name.

Success Response (200):

{

"success": true,

"database": "ENVISAGE",

"insertedCount": 25,

"failedCount": 2,

"message": "Database: ENVISAGE | Inserted: 25 | Failed: 2",

"errors": [

"Row 5 | Error message",

"Row 14 | Error message"

]

}

Important:

The endpoint returns HTTP 200 even when some rows fail.

The "success" property is:

- true when insertedCount > 0

- false when insertedCount == 0

Therefore, an HTTP 200 response can have:

"success": false

Example:

{

"success": false,

"database": "ENVISAGE",

"insertedCount": 0,

"failedCount": 3,

"message": "Database: ENVISAGE | Inserted: 0 | Failed: 3",

"errors": [

"Row 2 | Error message",

"Row 3 | Error message",

"Row 4 | Error message"

]

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Request must be multipart/form-data."

}

Occurs when the request is not multipart/form-data.

400 Bad Request:

{

"success": false,

"message": "Please upload an Excel file."

}

Occurs when no uploaded file exists.

400 Bad Request:

{

"success": false,

"message": "Excel file was not found."

}

Occurs if the first file entry is null.

400 Bad Request:

{

"success": false,

"message": "Only .xlsx Excel files are supported."

}

Occurs when the uploaded file extension is not .xlsx.

400 Bad Request:

{

"success": false,

"message": "Excel worksheet is empty."

}

Occurs when the first worksheet has no used rows.

400 Bad Request:

{

"success": false,

"message": "Excel file does not contain student data."

}

Occurs when the worksheet has fewer than two used rows.

500 Internal Server Error:

{

"success": false,

"message": "Error message",

"insertedCount": 10,

"failedCount": 2,

"errors": [

"Row 3 | Error message"

]

}

Occurs when an unexpected exception occurs outside the row-level processing logic.

Status Codes Used:

- 200 OK

- 400 Bad Request

- 500 Internal Server Error

401/403:

May be generated by JwtSessionFilter, but no explicit 401/403 response is generated inside ImportStudents().

=========================================================

6. GET IMPORTED PROFESSIONAL STUDENT GRID

============================================

Endpoint:

GET /api/new-professional-approval/imported/list

Purpose:

Retrieves records from GoogleSheet\_NewProfessional and returns them as an imported professional student grid.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims:

Not directly read from JWT in this action.

\* Session values used:

- Session["UserID"]

- Session["UserRole"]

Role behavior:

If UserRole is "Branch Executives":

- UserID must exist.

- Returned records are restricted to districts mapped to that UserID.

For other roles:

- No district restriction is added by this controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

None.

Content-Type:

Not applicable.

Validation Rules:

\* UserRole must exist in Session.

\* Missing UserRole results in 403 Forbidden.

\* If role is Branch Executives, UserID must exist.

\* Missing Branch Executive UserID results in 401 Unauthorized.

\* No pagination.

\* No search.

\* No sorting.

\* No date filtering.

\* Base query uses WHERE 1 = 1.

\* Branch Executive filtering is based on matching the imported District text to DistrictMaster.DistrictName.

Database Behavior:

Main table:

GoogleSheet\_NewProfessional

Branch Executive restriction:

The controller checks BranchExecutiveDistrictMapping and DistrictMaster.

The comparison is:

LTRIM(RTRIM(dm.DistrictName))

=

LTRIM(RTRIM(gp.District))

This means the imported District text is compared with the mapped DistrictMaster name after trimming leading/trailing whitespace.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ImportID": 1001,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "john@example.com",

"StudentName": "John Doe",

"DateOfBirth": "15/05/2007",

"ResidentialAddress": "Sample residential address",

"GoogleMapLink": "https://maps.google.com/...",

"Place": "Dharwad",

"District": "Dharwad",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Gender": "Male",

"CasteCategory": "Category Name",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupation": "Occupation",

"MotherOccupation": "Occupation",

"FamilyMembers": 5,

"HouseType": "Rented",

"MonthlyRent": 5000.00,

"FamilyIncome": 150000.00,

"SecuredPercentage12th": 85.50,

"CETRank": 12345,

"NEETRank": 67890,

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfie": "path/to/selfie.jpg",

"CET\_NEETRankSheet": "path/to/rank-sheet.pdf",

"DwellingUnitPhotograph": "path/to/dwelling.jpg",

"MarksSheet12th": "path/to/marksheet.pdf",

"HandWrittenRequestLetter": "path/to/request-letter.pdf",

"HouseVideo": "path/to/house-video.mp4",

"ElectricityBill": "path/to/electricity-bill.pdf",

"IncomeCertificate": "path/to/income-certificate.pdf",

"RationCardCopy": "path/to/ration-card.pdf",

"ImportedDate": "2026-08-28T10:30:00",

"Approve": "Pending",

"Remarks": null

}

]

}

Failure Responses:

403 Forbidden:

{

"success": false,

"message": "User role was not found in session."

}

401 Unauthorized:

{

"success": false,

"message": "Authenticated UserID was not found."

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 401 Unauthorized

- 403 Forbidden

- 500 Internal Server Error

=========================================================

7. APPROVE IMPORTED PROFESSIONAL STUDENT

==========================================

Endpoint:

POST /api/new-professional-approval/imported/approve/{id}

Purpose:

Approves an imported professional student by setting Approve = "Approved" in GoogleSheet\_NewProfessional and optionally saving Remarks.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

Not implemented in the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims:

Not directly specified.

\* Required Roles:

Not specified.

\* Session dependency:

No direct Session access.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported professional student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Imported student documents verified."

}

Content-Type:

application/json

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* Remark is optional.

\* Blank/whitespace remarks are stored as NULL.

\* No role validation is implemented.

\* No duplicate validation is implemented.

\* No current approval-status validation is implemented.

Business Logic Notes:

\* Updates GoogleSheet\_NewProfessional.

\* Sets Approve = "Approved".

\* Stores the supplied Remark in Remarks.

\* Blank/whitespace Remark becomes NULL.

\* Update is performed using ImportID.

Database Operation:

UPDATE GoogleSheet\_NewProfessional

SET

Approve = 'Approved',

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student approved successfully.",

"importId": 1001,

"approve": "Approved",

"remarks": "Imported student documents verified."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid ImportID."

}

404 Not Found:

{

"success": false,

"message": "Imported student not found."

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

=========================================================

8. REJECT IMPORTED PROFESSIONAL STUDENT

=========================================

Endpoint:

POST /api/new-professional-approval/imported/reject/{id}

Purpose:

Rejects an imported professional student by setting Approve = "Rejected" in GoogleSheet\_NewProfessional and optionally saving Remarks.

JWT authentication is required.

Authorization:

\* JWT Required

\* Expected authorization format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Explicit role check:

Not implemented in the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims:

Not directly specified.

\* Required Roles:

Not specified.

\* Session dependency:

No direct Session access.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported professional student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Required information was not satisfactory."

}

Content-Type:

application/json

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* Remark is optional.

\* Blank/whitespace Remark is stored as NULL.

\* No explicit role validation is implemented.

\* No duplicate validation is implemented.

\* No current approval-status validation is implemented.

Business Logic Notes:

\* Updates GoogleSheet\_NewProfessional.

\* Sets Approve = "Rejected".

\* Stores the supplied Remark in Remarks.

\* Blank/whitespace Remark becomes NULL.

\* Update is based on ImportID.

Database Operation:

UPDATE GoogleSheet\_NewProfessional

SET

Approve = 'Rejected',

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student rejected successfully.",

"importId": 1001,

"approve": "Rejected",

"remarks": "Required information was not satisfactory."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid ImportID."

}

404 Not Found:

{

"success": false,

"message": "Imported student not found."

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

=========================================================

COMMON DTOs

===========

The supplied controller explicitly declares one DTO/request model.

The controller also references:

- NewProfessionalApplicationModel

- ProfessionalStudentImportGridModel

However, their class definitions are NOT included in the supplied controller. Their properties can be determined from the object initializers and therefore the exposed response fields can be documented, but the exact DTO declarations, nullable annotations, attributes, and validation attributes are not specified in this controller.

=========================================================

DTO 1: ApprovalRemarkRequest

============================

DTO Name:

ApprovalRemarkRequest

Purpose:

Request body used by professional student approval/rejection endpoints and imported student approval/rejection endpoints.

Used By:

- POST /api/new-professional-approval/approve/{id}

- POST /api/new-professional-approval/reject/{id}

- POST /api/new-professional-approval/imported/approve/{id}

- POST /api/new-professional-approval/imported/reject/{id}

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Remark | string | Optional | Yes | Approval/rejection remark. Blank/whitespace values are treated as NULL before database update in the relevant endpoints. |

Important:

No [Required] attribute is present.

The supplied DTO is:

public class ApprovalRemarkRequest

{

public string Remark { get; set; }

}

Sample Request:

{

"Remark": "Application verified successfully."

}

Sample Request Without Remark:

{}

Sample Request With Null:

{

"Remark": null

}

=========================================================

DTO 2: NewProfessionalApplicationModel

========================================

DTO Name:

NewProfessionalApplicationModel

Purpose:

Represents a professional student application returned by the Professional Approval Grid.

Definition:

The actual class definition is not included in the supplied controller.

Properties exposed by the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ApplicationID | int | Not specified | No | Professional application identifier. |

| StudentName | string | Not specified | Yes | Student name. |

| Email | string | Not specified | Yes | Student email address. |

| DOB | DateTime | Not specified | Yes | Date of birth. |

| ContactNumber | string | Not specified | Yes | Primary contact number. |

| AlternateNumber | string | Not specified | Yes | Alternate contact number. |

| ResidentialAddress | string | Not specified | Yes | Residential address. |

| GoogleMapLink | string | Not specified | Yes | Google Maps link. |

| AreaTypeID | int | Not specified | Yes | Area type identifier. |

| DistrictID | int | Not specified | Yes | District identifier. |

| GenderID | int | Not specified | Yes | Gender identifier. |

| CasteCategoryID | int | Not specified | Yes | Caste category identifier. |

| DistrictName | string | Not specified | Yes | District name from DistrictMaster. |

| OtherDistrict | string | Not specified | Yes | Other district value. |

| GenderName | string | Not specified | Yes | Gender name from GenderMaster. |

| CategoryName | string | Not specified | Yes | Category name from CasteCategoryMaster. |

| AreaTypeName | string | Not specified | Yes | Area type name from AreaTypeMaster. |

| HouseTypeName | string | Not specified | Yes | House type name from HouseTypeMaster. |

| FatherName | string | Not specified | Yes | Father's name. |

| MotherName | string | Not specified | Yes | Mother's name. |

| FatherOccupationID | int | Not specified | Yes | Father's occupation identifier. |

| MotherOccupationID | int | Not specified | Yes | Mother's occupation identifier. |

| FatherOccupation | string | Not specified | Yes | Father's occupation name. |

| MotherOccupation | string | Not specified | Yes | Mother's occupation name. |

| FamilyMembers | int | Not specified | Yes | Number of family members. |

| HouseTypeID | int | Not specified | Yes | House type identifier. |

| MonthlyRent | decimal | Not specified | Yes | Monthly rent. |

| FamilyIncome | decimal | Not specified | Yes | Family income. |

| PUPercentage | decimal | Not specified | Yes | PUC percentage. |

| CETRank | string | Not specified | Yes | CET rank. |

| NEETRank | string | Not specified | Yes | NEET rank. |

| CourseApplying | string | Not specified | Yes | Course being applied for. |

| CourseStream | string | Not specified | Yes | Course stream. |

| StudentSelfiePath | string | Not specified | Yes | Student selfie document/path. |

| CETNEETRankSheetPath | string | Not specified | Yes | CET/NEET rank sheet path. |

| DwellingUnitPhotoPath | string | Not specified | Yes | Dwelling unit photograph path. |

| MarksSheet12Path | string | Not specified | Yes | 12th marks sheet path. |

| RequestLetterPath | string | Not specified | Yes | Request letter path. |

| HouseVideoPath | string | Not specified | Yes | House video path. |

| ElectricityBillPath | string | Not specified | Yes | Electricity bill path. |

| IncomeCertificatePath | string | Not specified | Yes | Income certificate path. |

| RationCardPath | string | Not specified | Yes | Ration card path. |

| Status | bool | Not specified | Yes | Application active/status flag converted using Convert.ToBoolean(). |

| ApproveStatus | string | Not specified | Yes | Approval status. |

| Remark | string | Not specified | Yes | Approval/rejection remark. |

| CreatedDate | DateTime | Not specified | Yes | Application creation date. |

Sample Response Item:

{

"ApplicationID": 101,

"StudentName": "John Doe",

"Email": "john@example.com",

"DOB": "2007-05-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Sample address",

"GoogleMapLink": "https://maps.google.com/...",

"AreaTypeID": 1,

"DistrictID": 5,

"GenderID": 1,

"CasteCategoryID": 2,

"DistrictName": "Dharwad",

"OtherDistrict": null,

"GenderName": "Male",

"CategoryName": "Category Name",

"AreaTypeName": "Urban",

"HouseTypeName": "Rented",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 1,

"MotherOccupationID": 2,

"FatherOccupation": "Occupation",

"MotherOccupation": "Occupation",

"FamilyMembers": 5,

"HouseTypeID": 2,

"MonthlyRent": 5000.00,

"FamilyIncome": 150000.00,

"PUPercentage": 85.50,

"CETRank": "12345",

"NEETRank": "67890",

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfiePath": "path/to/selfie.jpg",

"CETNEETRankSheetPath": "path/to/rank-sheet.pdf",

"DwellingUnitPhotoPath": "path/to/dwelling.jpg",

"MarksSheet12Path": "path/to/marksheet.pdf",

"RequestLetterPath": "path/to/request-letter.pdf",

"HouseVideoPath": "path/to/house-video.mp4",

"ElectricityBillPath": "path/to/electricity-bill.pdf",

"IncomeCertificatePath": "path/to/income-certificate.pdf",

"RationCardPath": "path/to/ration-card.pdf",

"Status": true,

"ApproveStatus": "Pending",

"Remark": null,

"CreatedDate": "2026-08-28T10:30:00"

}

=========================================================

DTO 3: ProfessionalStudentImportGridModel

===========================================

DTO Name:

ProfessionalStudentImportGridModel

Purpose:

Represents a professional student imported from GoogleSheet\_NewProfessional.

Definition:

The actual class definition is not included in the supplied controller. The following properties are populated by the controller.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ImportID | int | Not specified | No | Imported record identifier. |

| Timestamp | string | Not specified | Yes | Original Excel timestamp value. |

| EmailAddress | string | Not specified | Yes | Student email address. |

| StudentName | string | Not specified | Yes | Student name. |

| DateOfBirth | string | Not specified | Yes | Date of birth as stored/imported text. |

| ResidentialAddress | string | Not specified | Yes | Residential address. |

| GoogleMapLink | string | Not specified | Yes | Google Maps link. |

| Place | string | Not specified | Yes | Place. |

| District | string | Not specified | Yes | District text imported from Excel. |

| ContactNumber | string | Not specified | Yes | Contact number. |

| AlternateNumber | string | Not specified | Yes | Alternate contact number. |

| Gender | string | Not specified | Yes | Gender. |

| CasteCategory | string | Not specified | Yes | Caste category. |

| FatherName | string | Not specified | Yes | Father's name. |

| MotherName | string | Not specified | Yes | Mother's name. |

| FatherOccupation | string | Not specified | Yes | Father's occupation. |

| MotherOccupation | string | Not specified | Yes | Mother's occupation. |

| FamilyMembers | int | Not specified | Yes | Number of family members. |

| HouseType | string | Not specified | Yes | House type. |

| MonthlyRent | decimal | Not specified | Yes | Monthly rent. |

| FamilyIncome | decimal | Not specified | Yes | Family income. |

| SecuredPercentage12th | decimal | Not specified | Yes | Secured percentage in 12th. |

| CETRank | int | Not specified | Yes | CET rank. |

| NEETRank | int | Not specified | Yes | NEET rank. |

| CourseApplying | string | Not specified | Yes | Course applied for. |

| CourseStream | string | Not specified | Yes | Course stream. |

| StudentSelfie | string | Not specified | Yes | Student selfie path/value. |

| CET\_NEETRankSheet | string | Not specified | Yes | CET/NEET rank sheet path/value. |

| DwellingUnitPhotograph | string | Not specified | Yes | Dwelling unit photograph path/value. |

| MarksSheet12th | string | Not specified | Yes | 12th marks sheet path/value. |

| HandWrittenRequestLetter | string | Not specified | Yes | Handwritten request letter path/value. |

| HouseVideo | string | Not specified | Yes | House video path/value. |

| ElectricityBill | string | Not specified | Yes | Electricity bill path/value. |

| IncomeCertificate | string | Not specified | Yes | Income certificate path/value. |

| RationCardCopy | string | Not specified | Yes | Ration card path/value. |

| ImportedDate | DateTime | Not specified | Yes | Import date. |

| Approve | string | Not specified | Yes | Imported student approval status. |

| Remarks | string | Not specified | Yes | Approval/rejection remarks. |

Sample Response Item:

{

"ImportID": 1001,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "john@example.com",

"StudentName": "John Doe",

"DateOfBirth": "15/05/2007",

"ResidentialAddress": "Sample address",

"GoogleMapLink": "https://maps.google.com/...",

"Place": "Dharwad",

"District": "Dharwad",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Gender": "Male",

"CasteCategory": "Category Name",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupation": "Occupation",

"MotherOccupation": "Occupation",

"FamilyMembers": 5,

"HouseType": "Rented",

"MonthlyRent": 5000.00,

"FamilyIncome": 150000.00,

"SecuredPercentage12th": 85.50,

"CETRank": 12345,

"NEETRank": 67890,

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfie": "path/to/selfie.jpg",

"CET\_NEETRankSheet": "path/to/rank-sheet.pdf",

"DwellingUnitPhotograph": "path/to/dwelling.jpg",

"MarksSheet12th": "path/to/marksheet.pdf",

"HandWrittenRequestLetter": "path/to/request-letter.pdf",

"HouseVideo": "path/to/house-video.mp4",

"ElectricityBill": "path/to/electricity-bill.pdf",

"IncomeCertificate": "path/to/income-certificate.pdf",

"RationCardCopy": "path/to/ration-card.pdf",

"ImportedDate": "2026-08-28T10:30:00",

"Approve": "Pending",

"Remarks": null

}

=========================================================

DROPDOWN APIs

============

No dropdown API endpoints are implemented in this controller.

There are no endpoints for:

- District dropdown

- Gender dropdown

- Caste Category dropdown

- Area Type dropdown

- Father Occupation dropdown

- Mother Occupation dropdown

- House Type dropdown

The GET approval grid does retrieve descriptive master-table names, but it is not a dropdown endpoint.

=========================================================

JWT / AUTHORIZATION CONTRACT

============================

All 8 controller actions currently have [JwtSessionFilter] at ACTION LEVEL.

There is no [JwtSessionFilter] attribute at controller level.

Therefore:

1. GET /api/new-professional-approval/list

JWT Required.

Uses Session["UserID"] and Session["UserRole"].

Branch Executives are district restricted.

2. POST /api/new-professional-approval/approve/{id}

JWT Required.

No direct Session or role check in the action.

3. POST /api/new-professional-approval/reject/{id}

JWT Required.

No direct Session or role check in the action.

4. DELETE /api/new-professional-approval/delete/{id}

JWT Required.

No direct Session or role check in the action.

5. POST /api/new-professional-approval/import

JWT Required.

No direct Session or role check in the action.

6. GET /api/new-professional-approval/imported/list

JWT Required.

Uses Session["UserID"] and Session["UserRole"].

Branch Executives are district restricted.

7. POST /api/new-professional-approval/imported/approve/{id}

JWT Required.

No direct Session or role check in the action.

8. POST /api/new-professional-approval/imported/reject/{id}

JWT Required.

No direct Session or role check in the action.

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

=========================================================

JWT CLAIMS AND SESSION DEPENDENCY

=================================

The supplied controller does not directly extract JWT claims.

Instead, the controller reads:

HttpContext.Current.Session["UserID"]

and:

HttpContext.Current.Session["UserRole"]

through helper methods.

Helper behavior:

GetUserId():

- Reads Session["UserID"].

- Attempts int.TryParse().

- Returns nullable int.

- Returns null if the Session value does not exist or cannot be parsed.

GetUserRole():

- Reads Session["UserRole"].

- Returns its string representation.

- Returns null if unavailable.

Important:

The controller does not show the implementation of JwtSessionFilter. Therefore, the exact JWT claim names and the mapping mechanism from JWT claims to Session values are NOT specified in this controller.

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | int | Required for Branch Executive grid access | Expected to identify the authenticated user, but exact JWT claim name/mapping is not specified in this controller. |

| UserRole | string | Required for the two grid endpoints | Expected to determine role behavior, but exact JWT claim name/mapping is not specified in this controller. |

| EmployeeID | Not specified | Not specified | Not used by this controller. |

Session Mapping:

| Session Key | Used By | Purpose |

|-------------|---------|---------|

| UserID | list, imported/list | Identifies Branch Executive for district mapping. |

| UserRole | list, imported/list | Determines whether Branch Executive restrictions apply. |

Recommended interpretation:

The actual JWT-to-Session mapping must be verified in the implementation of JwtSessionFilter before documenting exact JWT claim names.

=========================================================

ROLE-BASED AUTHORIZATION

========================

Explicit role name used by controller:

Branch Executives

Role check is implemented in:

GET /api/new-professional-approval/list

and:

GET /api/new-professional-approval/imported/list

For Branch Executives:

- UserID is mandatory.

- District access is restricted using BranchExecutiveDistrictMapping.

For the remaining endpoints:

- No explicit role is checked in the supplied controller.

- No [Authorize(Roles = "...")] attribute is present.

- No direct UserRole comparison is present.

- Therefore, no specific required role can be stated from this controller.

Important:

If JwtSessionFilter itself performs role authorization, that behavior is outside the supplied controller and is therefore "Not specified in controller."

=========================================================

DATABASE CONTRACT

=================

Connection String:

EnvisageDb

Connection:

System.Data.SqlClient.SqlConnection

Database operations visible in controller:

1. NewProfessionalApplication

SELECT:

Used by the Professional Approval Grid.

UPDATE:

Used by:

- Approve Professional Student

- Reject Professional Student

- Delete / Soft Delete Professional Student

2. GoogleSheet\_NewProfessional

INSERT:

Used by Excel Import.

SELECT:

Used by Imported Professional Student Grid.

UPDATE:

Used by:

- Approve Imported Student

- Reject Imported Student

3. BranchExecutiveDistrictMapping

SELECT/filter:

Used to restrict Branch Executive records.

4. DistrictMaster

SELECT/JOIN:

Used for district names in the approval grid.

Also used to compare imported district names for Branch Executive restrictions.

5. GenderMaster

LEFT JOIN:

Used by Professional Approval Grid.

6. CasteCategoryMaster

LEFT JOIN:

Used by Professional Approval Grid.

7. AreaTypeMaster

LEFT JOIN:

Used by Professional Approval Grid.

8. FatherOccupationMaster

LEFT JOIN:

Used by Professional Approval Grid.

9. MotherOccupationMaster

LEFT JOIN:

Used by Professional Approval Grid.

10. HouseTypeMaster

LEFT JOIN:

Used by Professional Approval Grid.

=========================================================

TRANSACTION BEHAVIOR

====================

No explicit SQL transaction is implemented in the supplied controller.

Excel import:

- Rows are inserted individually.

- A failure in one row does not stop processing of subsequent rows.

- There is no transaction wrapping all row inserts.

- insertedCount and failedCount are maintained separately.

=========================================================

PAGINATION / SEARCH / SORTING

=============================

No pagination is implemented.

No page number parameter is available.

No page size parameter is available.

No search parameter is available.

No sorting parameter is available.

No date-range filtering is available.

The grid endpoints return the complete result set produced by their SQL query.

Response list metadata:

- count

- data

=========================================================

DEFAULT VALUES

==============

Professional Approval Grid:

Status filter:

Status = 1

Approve/reject professional student:

ApproveStatus:

- "Approved" for approve endpoint.

- "Rejected" for reject endpoint.

Remark:

- Empty/null/whitespace values become database NULL through UpdateStatus().

Delete:

Status:

- Set to 0.

Imported approval:

Approve:

- "Approved"

Imported rejection:

Approve:

- "Rejected"

Remarks:

- Empty/null/whitespace values become database NULL.

Excel import:

FamilyMembers:

- Invalid integer -> NULL

MonthlyRent:

- Invalid decimal -> NULL

FamilyIncome:

- Invalid decimal -> NULL

SecuredPercentage12th:

- Invalid decimal -> NULL

CETRank:

- Invalid integer -> NULL

NEETRank:

- Invalid integer -> NULL

Empty Excel student row:

- Skipped when both StudentName and EmailAddress are blank.

=========================================================

FILE UPLOAD CONTRACT

====================

Only one endpoint accepts a file:

POST /api/new-professional-approval/import

Content-Type:

multipart/form-data

Required:

Yes, an Excel file must be uploaded.

Allowed extension:

.xlsx

Maximum file size:

Not specified in controller.

Multiple files:

The controller accepts multipart content and selects only the first uploaded file.

Exact multipart field name:

Not specified in controller.

Temporary upload directory:

~/App\_Data/TempUploads

Processing:

- Multipart request is parsed.

- First file is selected.

- Original filename is extracted from Content-Disposition.

- Extension is checked.

- Workbook is opened using ClosedXML.

- First worksheet is read.

- Rows are imported individually.

The controller does not upload document files such as StudentSelfie, MarksSheet12th, etc. during this endpoint. Those values are read as strings from Excel cells and stored in database columns.

=========================================================

ERROR HANDLING CONTRACT

=======================

Common error structure:

{

"success": false,

"message": "Error message"

}

Approval/rejection endpoints may return:

{

"success": false,

"message": "Professional application not found."

}

or:

{

"success": false,

"message": "Imported student not found."

}

Grid endpoints may return:

{

"success": false,

"message": "User role was not found in session."

}

or:

{

"success": false,

"message": "Authenticated UserID was not found."

}

Excel import unexpected exception may return:

{

"success": false,

"message": "Error message",

"insertedCount": 0,

"failedCount": 0,

"errors": []

}

=========================================================

COMPLETE STATUS CODE MATRIX

===========================

| Endpoint | 200 | 400 | 401 | 403 | 404 | 409 | 500 |

|----------|-----|-----|-----|-----|-----|-----|-----|

| GET /list | Yes | No | Yes | Yes | No | No | Yes |

| POST /approve/{id} | Yes | Yes | Filter only | Filter only | Yes | No | Yes |

| POST /reject/{id} | Yes | Yes | Filter only | Filter only | Yes | No | Yes |

| DELETE /delete/{id} | Yes | Yes | Filter only | Filter only | Yes | No | Yes |

| POST /import | Yes | Yes | Filter only | Filter only | No | No | Yes |

| GET /imported/list | Yes | No | Yes | Yes | No | No | Yes |

| POST /imported/approve/{id} | Yes | Yes | Filter only | Filter only | Yes | No | Yes |

| POST /imported/reject/{id} | Yes | Yes | Filter only | Filter only | Yes | No | Yes |

409 Conflict:

No endpoint explicitly returns 409 Conflict in the supplied controller.

Therefore:

409 Conflict is NOT currently implemented by these actions.

401/403 for action endpoints:

The supplied actions do not explicitly generate these statuses, but JwtSessionFilter may generate authentication/authorization responses before the action executes. Exact filter behavior is not included in the supplied controller.

=========================================================

COMPLETE ENDPOINT ROUTE LIST

============================

1.

GET /api/new-professional-approval/list

JWT:

Required

Purpose:

Get active professional applications for approval.

2.

POST /api/new-professional-approval/approve/{id}

JWT:

Required

Purpose:

Approve a professional application.

3.

POST /api/new-professional-approval/reject/{id}

JWT:

Required

Purpose:

Reject a professional application.

4.

DELETE /api/new-professional-approval/delete/{id}

JWT:

Required

Purpose:

Soft delete a professional application.

5.

POST /api/new-professional-approval/import

JWT:

Required

Purpose:

Import professional student records from an Excel .xlsx file.

6.

GET /api/new-professional-approval/imported/list

JWT:

Required

Purpose:

Get imported professional student records.

7.

POST /api/new-professional-approval/imported/approve/{id}

JWT:

Required

Purpose:

Approve an imported professional student.

8.

POST /api/new-professional-approval/imported/reject/{id}

JWT:

Required

Purpose:

Reject an imported professional student.

=========================================================

IMPORTANT IMPLEMENTATION / CONTRACT NOTES

===========================================

1. JWT Scope

The supplied controller places [JwtSessionFilter] directly above every public endpoint.

Therefore, JWT is currently required on every endpoint in this controller.

There is NO controller-level [JwtSessionFilter] in the supplied code.

2. Public Endpoints

There are no explicitly public endpoints in the supplied controller.

3. Role Authorization

Only "Branch Executives" is explicitly checked in the controller.

The Branch Executive restriction is implemented only in:

- GET /api/new-professional-approval/list

- GET /api/new-professional-approval/imported/list

4. Branch Executive District Restriction

For the approval grid:

np.DistrictID must exist in BranchExecutiveDistrictMapping for the authenticated UserID.

For the imported grid:

gp.District must match the DistrictMaster.DistrictName associated with the authenticated UserID's mapped district.

5. UserID Source

UserID is obtained from:

Session["UserID"]

It is not directly read from the JWT by the controller.

6. UserRole Source

UserRole is obtained from:

Session["UserRole"]

7. Exact JWT Claim Names

Not specified in controller.

The implementation of JwtSessionFilter must be inspected to determine the exact JWT claim names and how they populate Session values.

8. EmployeeID

EmployeeID is not used by this controller.

9. Soft Delete

The delete endpoint performs:

UPDATE NewProfessionalApplication

SET Status = 0

It does not physically delete the database record.

10. Approval

Professional application approval sets:

ApproveStatus = "Approved"

11. Rejection

Professional application rejection sets:

ApproveStatus = "Rejected"

12. Imported Approval

Imported student approval sets:

Approve = "Approved"

13. Imported Rejection

Imported student rejection sets:

Approve = "Rejected"

14. Remark Handling

For approve/reject operations:

- Null request -> empty remark.

- Empty/whitespace remark -> database NULL.

- Non-empty remark -> stored.

15. Excel Import

The Excel importer:

- Requires multipart/form-data.

- Requires at least one file.

- Processes only the first uploaded file.

- Supports only .xlsx.

- Reads worksheet 1.

- Treats row 1 as header.

- Starts processing from row 2.

- Skips rows where both StudentName and EmailAddress are blank.

- Performs row-level error handling.

- Continues after individual row failures.

- Does not implement a duplicate check.

- Does not implement a transaction for the complete import.

- Returns insertedCount and failedCount.

16. Maximum Upload Size

Not specified in the supplied controller.

17. File Extensions for Student Documents

No document-extension validation is performed by this controller during Excel import because document values are imported as strings.

18. Pagination

Not implemented.

19. Search

Not implemented.

20. Sorting

Not implemented.

21. Date Filtering

Not implemented.

22. 409 Conflict

Not implemented.

23. Audit Fields

CreatedBy/ModifiedBy are not populated by the visible controller actions.

24. Database Transactions

No explicit transaction is implemented.

25. Stored Procedures

No stored procedures are used by the supplied controller.

26. Duplicate Validation

No duplicate validation is implemented.

27. Foreign-Key Validation

No explicit foreign-key validation is implemented by the controller. The database may still enforce its own constraints, but those constraints are not visible in this controller.

28. Business Status Validation

The approve/reject endpoints do not verify the existing approval status before changing it.

29. Authorization for Update/Delete

The supplied controller requires JwtSessionFilter but does not independently verify UserID, EmployeeID, or role for:

- approve

- reject

- delete

- import

- imported approve

- imported reject

Any additional authorization performed by JwtSessionFilter is not visible in the supplied controller.

30. Data Scope

The approval and imported grids implement explicit Branch Executive district filtering.

The modification endpoints update records by ID only and do not add a UserID/district condition in the SQL.

=========================================================

FINAL API CONTRACT QUALITY CHECK

================================

[✓] All 8 public endpoints included.

[✓] Correct HTTP methods documented.

[✓] Correct route prefix documented.

[✓] Correct individual routes documented.

[✓] JWT requirement determined endpoint-by-endpoint.

[✓] Existing [JwtSessionFilter] preserved as action-level.

[✓] No controller-level JWT filter invented.

[✓] No public endpoint incorrectly declared.

[✓] Branch Executive role behavior documented.

[✓] UserID Session dependency documented.

[✓] UserRole Session dependency documented.

[✓] Exact JWT claims not invented.

[✓] EmployeeID not incorrectly added.

[✓] Path parameters documented.

[✓] Query parameters documented.

[✓] Request body documented.

[✓] Multipart upload documented.

[✓] Excel file rules documented.

[✓] All 34 Excel columns documented.

[✓] File extension restriction documented.

[✓] Maximum file size marked as not specified.

[✓] Required/optional remark behavior documented.

[✓] Default approval/rejection values documented.

[✓] Soft delete behavior documented.

[✓] Branch Executive district restriction documented.

[✓] Pagination/search/sorting absence documented.

[✓] Database tables visible in controller documented.

[✓] SELECT/INSERT/UPDATE operations documented.

[✓] Row-level Excel error handling documented.

[✓] Transaction absence documented.

[✓] Duplicate-check absence documented.

[✓] Success responses documented.

[✓] Failure responses documented.

[✓] Actual status codes documented.

[✓] 409 correctly identified as not implemented.

[✓] Dropdown API absence documented.

[✓] ApprovalRemarkRequest documented.

[✓] NewProfessionalApplicationModel documented based only on properties exposed by the supplied controller.

[✓] ProfessionalStudentImportGridModel documented based only on properties exposed by the supplied controller.

[✓] Fields not defined in the supplied controller are explicitly identified as "Not specified in controller."

[✓] No additional fields, endpoints, roles, or JWT claims have been invented.