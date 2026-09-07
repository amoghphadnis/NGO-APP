PAYANA STUDENT GRID API CONTRACT

=====================

API BASE ROUTE

==============

Route Prefix:

/api/payana-student-grid

Controller:

VP\_PayanaStudentGridApiController

API Type:

ASP.NET Web API (System.Web.Http)

Authentication:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute. The controller does NOT have a controller-level JWT filter.

Important:

All endpoints in this controller currently have [JwtSessionFilter]. Therefore, based strictly on the supplied controller code, ALL endpoints are JWT-protected.

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / SESSION DEPENDENCY:

Several protected endpoints read the following values from HttpContext.Current.Session:

\* Session["UserRole"]

\* Session["UserID"]

The controller itself does not directly read JWT claims. It relies on [JwtSessionFilter] to authenticate the request and, where applicable, populate the Session values used by the controller.

The exact JWT claim-to-session mapping is NOT specified in this controller.

Important role-based behavior:

Only the role "Branch Executives" receives an additional district-level data restriction in the two list endpoints:

\* GET /api/payana-student-grid/list

\* GET /api/payana-student-grid/imported/list

For those endpoints:

\* Session["UserRole"] is checked.

\* Session["UserID"] is parsed.

\* The authenticated user's UserID is used to determine mapped districts.

\* Other roles are not restricted by these Branch Executive-specific filters in the controller.

The controller does NOT explicitly return 401 or 403 itself. The behavior of [JwtSessionFilter] for invalid/missing JWTs is not shown in this controller.

=========================================================

1. GET NORMAL PAYANA STUDENTS

=============================

Endpoint:

GET /api/payana-student-grid/list

Purpose:

Returns all active/normal Payana students from the PayanaStudents table.

The endpoint retrieves student details together with related Area Type, District, Father Occupation, Mother Occupation, Caste Category, and College Type names.

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Existing authorization/filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No single role is required for access.

\* Special role behavior:

Branch Executives receive only students belonging to districts mapped to their authenticated UserID.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified in this controller.

\* Session values required:

\* UserRole

\* UserID

\* How identity is used:

The controller reads UserRole and UserID from Session.

\* JWT-to-Session mapping:

Expected to be performed by [JwtSessionFilter], but the exact mapping is not specified in this controller.

Branch Executive authorization/data filtering:

If:

UserRole = "Branch Executives"

the SQL query adds:

AND ps.DistrictID IN

(

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

)

Therefore, Branch Executives can only see students from districts mapped to their UserID.

For non-Branch-Executive roles, this additional district filter is not applied by this controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | This endpoint has no path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | This endpoint does not define query parameters. |

Request Body:

None.

Validation Rules:

\* No request body validation.

\* No StudentID validation because no ID is supplied.

\* JWT/session authentication is required through [JwtSessionFilter].

\* Session["UserRole"] is optional from the controller's perspective; if absent, an empty string is used.

\* Session["UserID"] defaults to 0 if unavailable or not parseable.

\* If the role is "Branch Executives", UserID is used in the district mapping query.

\* Only records with:

Status = 1

are returned.

\* No pagination is implemented.

\* No search parameter is implemented.

\* No sorting parameter is implemented.

\* No date filtering is implemented.

Business Logic Notes:

\* Reads from PayanaStudents.

\* Uses LEFT JOINs with:

\* AreaTypeMaster

\* DistrictMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CasteCategoryMaster

\* CollegeTypeMaster

\* Filters normal students using:

ps.Status = 1

\* Branch Executives are restricted to districts in BranchExecutiveDistrictMapping for their UserID.

\* No hard-coded page size exists.

\* No total count query exists.

\* The response count is the number of records loaded into the returned list.

\* No modification occurs.

Database Behavior:

Tables/views directly visible in the controller:

\* PayanaStudents

\* AreaTypeMaster

\* DistrictMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CasteCategoryMaster

\* CollegeTypeMaster

\* BranchExecutiveDistrictMapping

Operation:

SELECT

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"StudentID": 101,

"StudentName": "John Doe",

"DateOfBirth": "2008-06-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Email": "john@example.com",

"AreaTypeID": 1,

"AreaTypeName": "Rural",

"Address": "Main Road",

"CurrentAddress": "Current Address",

"DistrictID": 5,

"DistrictName": "Dharwad",

"OtherDistrict": "",

"Taluka": "Dharwad",

"PinCode": "580001",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 2,

"MotherOccupationID": 3,

"FatherOccupationName": "Farmer",

"MotherOccupationName": "Homemaker",

"FamilyMembers": 5,

"FamilyIncome": 120000.00,

"CasteCategoryID": 1,

"CategoryName": "Category",

"CollegeName": "Example College",

"CollegeTypeID": 1,

"CollegeTypeName": "Government",

"CollegeContactNumber": "9876500000",

"CourseSA": "B.Com",

"CourseStream": "Commerce",

"AnnualFees": 25000.00,

"TotalExpenses": 50000.00,

"ReferenceSourceOther": "",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": 82.50,

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BranchName": "Dharwad",

"StudentPhotoPath": "/uploads/student.jpg",

"MarksCardPath": "/uploads/marks.pdf",

"BankPassbookPath": "/uploads/passbook.pdf",

"AadharPath": "/uploads/aadhar.jpg",

"HousePhotoPath": "/uploads/house.jpg",

"ParentsBankBalance": 15000.00,

"HouseVisitLink": "/house-visits/101",

"ApproveStatus": "Approved",

"Remark": ""

}

]

}

Failure Responses:

400 Bad Request:

No explicit 400 response is generated by this endpoint in the controller.

401 Unauthorized:

Expected when [JwtSessionFilter] rejects a missing, invalid, expired, or otherwise unauthorized JWT. Exact behavior is not specified in this controller.

403 Forbidden:

The controller does not explicitly generate 403.

If [JwtSessionFilter] implements authorization failure handling, it may return 403, but the exact behavior is not specified.

404 Not Found:

Not used by this endpoint.

409 Conflict:

Not used by this endpoint.

500 Internal Server Error:

Returned when an exception occurs.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

\* 401/403 may be produced by [JwtSessionFilter], but their exact implementation is not shown.

=========================================================

2. GET NORMAL PAYANA STUDENT BY ID

=================================

Endpoint:

GET /api/payana-student-grid/{id}

Purpose:

Returns one active normal Payana student using StudentID.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No specific role is required by this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not directly specified.

\* Session dependency:

None directly used by this action.

\* The endpoint is nevertheless protected because [JwtSessionFilter] is explicitly applied.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID of the normal Payana student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 Bad Request is returned.

\* The SQL query requires StudentID = @StudentID.

\* Only records where Status = 1 are returned.

\* No pagination.

\* No search.

\* No sorting.

\* No duplicate validation.

Business Logic Notes:

\* Reads one record from PayanaStudents.

\* Performs the same LEFT JOINs used by the list endpoint.

\* Inactive/soft-deleted records where Status != 1 are not returned.

\* If no active student is found, 404 is returned.

Database Behavior:

SELECT from:

\* PayanaStudents

\* AreaTypeMaster

\* DistrictMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CasteCategoryMaster

\* CollegeTypeMaster

Success Response (200):

{

"success": true,

"data": {

"StudentID": 101,

"StudentName": "John Doe",

"DateOfBirth": "2008-06-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Email": "john@example.com",

"AreaTypeID": 1,

"AreaTypeName": "Rural",

"Address": "Main Road",

"CurrentAddress": "Current Address",

"DistrictID": 5,

"DistrictName": "Dharwad",

"OtherDistrict": "",

"Taluka": "Dharwad",

"PinCode": "580001",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 2,

"MotherOccupationID": 3,

"FatherOccupationName": "Farmer",

"MotherOccupationName": "Homemaker",

"FamilyMembers": 5,

"FamilyIncome": 120000.00,

"CasteCategoryID": 1,

"CategoryName": "Category",

"CollegeName": "Example College",

"CollegeTypeID": 1,

"CollegeTypeName": "Government",

"CollegeContactNumber": "9876500000",

"CourseSA": "B.Com",

"CourseStream": "Commerce",

"AnnualFees": 25000.00,

"TotalExpenses": 50000.00,

"ReferenceSourceOther": "",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": 82.50,

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BranchName": "Dharwad",

"StudentPhotoPath": "/uploads/student.jpg",

"MarksCardPath": "/uploads/marks.pdf",

"BankPassbookPath": "/uploads/passbook.pdf",

"AadharPath": "/uploads/aadhar.jpg",

"HousePhotoPath": "/uploads/house.jpg",

"ParentsBankBalance": 15000.00,

"HouseVisitLink": "/house-visits/101",

"ApproveStatus": "Approved",

"Remark": ""

}

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Student ID."

}

404 Not Found:

{

"success": false,

"message": "Payana Student not found."

}

401 Unauthorized:

Expected from [JwtSessionFilter] when authentication fails.

403 Forbidden:

Not explicitly generated by this action. Behavior depends on [JwtSessionFilter].

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

3. APPROVE NORMAL PAYANA STUDENT

================================

Endpoint:

POST /api/payana-student-grid/approve/{id}

Purpose:

Changes the normal Payana student's ApproveStatus to "Approved" and stores the supplied remark.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used by this action.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Approved after verification."

}

Request DTO:

RemarkRequest

Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| Remark | string | No | Yes | Remark to store with the approval. If request is null or Remark is null/whitespace, an empty string is stored. |

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark is not mandatory.

\* Whitespace-only Remark is converted to an empty string.

\* No maximum Remark length is defined in the controller.

\* No authorization role is checked directly.

\* No duplicate check is implemented.

\* No prior status validation is implemented.

Business Logic Notes:

The action calls:

UpdateNormalStudentStatus(id, "Approved", remark)

The database operation is:

UPDATE PayanaStudents

SET

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE StudentID = @StudentID

This is a status update, not a creation.

Success Response (200):

{

"success": true,

"message": "Student approved successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Student ID."

}

404 Not Found:

{

"success": false,

"message": "Payana Student not found."

}

This occurs when the UPDATE affects zero rows.

401 Unauthorized:

Expected from [JwtSessionFilter] if JWT authentication fails.

403 Forbidden:

Not explicitly generated by the controller.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

4. REJECT NORMAL PAYANA STUDENT

================================

Endpoint:

POST /api/payana-student-grid/reject/{id}

Purpose:

Changes the normal Payana student's ApproveStatus to "Rejected" and stores the supplied remark.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used by this action.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Rejected after verification."

}

Request DTO:

RemarkRequest

Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| Remark | string | No | Yes | Remark to store with the rejection. If request is null or Remark is null/whitespace, an empty string is stored. |

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark is optional.

\* No maximum Remark length is specified.

\* No prior approval-status validation.

\* No duplicate validation.

\* No role validation directly in the action.

Business Logic Notes:

The action calls:

UpdateNormalStudentStatus(id, "Rejected", remark)

Database operation:

UPDATE PayanaStudents

SET

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE StudentID = @StudentID

Success Response (200):

{

"success": true,

"message": "Student rejected successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Student ID."

}

404 Not Found:

{

"success": false,

"message": "Payana Student not found."

}

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly generated by the controller.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JWT filter.

=========================================================

5. DELETE NORMAL PAYANA STUDENT

================================

Endpoint:

POST /api/payana-student-grid/delete/{id}

Purpose:

Performs a soft delete of a normal Payana student by setting Status = 0.

Important:

Despite the operation being logically a DELETE, the controller explicitly uses HTTP POST.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role is checked by this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* No request body is required.

\* No dependency validation.

\* No role validation directly in controller.

\* No confirmation parameter.

\* No hard delete occurs.

Business Logic Notes:

The endpoint performs a soft delete:

UPDATE PayanaStudents

SET Status = 0

WHERE StudentID = @StudentID

The database record remains in PayanaStudents.

Normal list endpoints only return records where Status = 1, so the soft-deleted record will no longer appear in the normal student list.

Success Response (200):

{

"success": true,

"message": "Payana Student deleted successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Student ID."

}

404 Not Found:

{

"success": false,

"message": "Payana Student not found."

}

This occurs when zero rows are affected.

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly generated.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

6. GET IMPORTED PAYANA STUDENTS

================================

Endpoint:

GET /api/payana-student-grid/imported/list

Purpose:

Returns imported Payana student records from GoogleSheet\_Payana\_NewStudent.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No single role is required for access.

\* Branch Executive special restriction:

Yes.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values:

\* UserRole

\* UserID

\* UserRole determines whether the Branch Executive filter is applied.

\* UserID is used to identify the authenticated user's mapped districts.

\* Exact JWT claim-to-session mapping is not specified.

Branch Executive behavior:

If:

UserRole = "Branch Executives"

the endpoint only returns imported rows where the row's District matches a DistrictMaster record mapped to the authenticated UserID.

The SQL uses:

BranchExecutiveDistrictMapping

INNER JOIN DistrictMaster

and compares:

LTRIM(RTRIM(dm.DistrictName))

=

LTRIM(RTRIM(gp.District))

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

Validation Rules:

\* No pagination.

\* No search.

\* No sorting.

\* No date filters.

\* Branch Executive district restriction is applied using UserID.

\* All imported records are otherwise eligible because the base query starts with WHERE 1 = 1.

\* No explicit active/inactive filter exists on imported records.

Business Logic Notes:

Reads from:

GoogleSheet\_Payana\_NewStudent

Imported records contain the spreadsheet-style column names.

For Branch Executives, filtering is based on district name rather than a DistrictID stored in the imported table.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ImportID": 1,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "student@example.com",

"District": "Dharwad",

"Taluk": "Dharwad",

"StudentName": "John Doe",

"ResidentialAddress": "Residential Address",

"CurrentAddress": "Current Address",

"DateOfBirth": "2008-06-15",

"WhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"EmailId": "student@example.com",

"Place": "Dharwad",

"Caste": "Category",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyAnnualIncome": "120000",

"ParentsBankBalance": "15000",

"CollegeNameSchoolName": "Example College",

"CollegeSchoolType": "Government",

"CollegeContactNumber": "9876500000",

"CourseStudyingApplying": "B.Com",

"CourseStream": "Commerce",

"AnnualCollegeSchoolFees": "25000",

"TotalEducationalExpenses": "50000",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": "82.50",

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BankBranchName": "Dharwad",

"LatestMarkSheetPath": "/uploads/marks.pdf",

"StudentBankPassbookPath": "/uploads/passbook.pdf",

"StudentSelfiePhotoPath": "/uploads/photo.jpg",

"DwellingUnitPhotoPath": "/uploads/house.jpg",

"StudentAadharCardPath": "/uploads/aadhar.jpg",

"FeesReceiptPath": "/uploads/fees.pdf",

"Approve": "Approved",

"Remarks": ""

}

]

}

Failure Responses:

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly returned by the action. Exact filter behavior is not specified.

404 Not Found:

Not used by this endpoint.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 500

\* 401/403 may be generated by JWT filter.

=========================================================

7. GET ONE IMPORTED PAYANA STUDENT

=================================

Endpoint:

GET /api/payana-student-grid/imported/{id}

Purpose:

Returns one imported Payana student from GoogleSheet\_Payana\_NewStudent using ImportID.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction is implemented for this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not used by this action.

\* Authentication is enforced by [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, 400 is returned.

\* Record is searched by ImportID.

\* No active/inactive filter is applied.

\* No pagination.

\* No duplicate validation.

Business Logic Notes:

Reads from:

GoogleSheet\_Payana\_NewStudent

Success Response (200):

{

"success": true,

"data": {

"ImportID": 1,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "student@example.com",

"District": "Dharwad",

"Taluk": "Dharwad",

"StudentName": "John Doe",

"ResidentialAddress": "Residential Address",

"CurrentAddress": "Current Address",

"DateOfBirth": "2008-06-15",

"WhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"EmailId": "student@example.com",

"Place": "Dharwad",

"Caste": "Category",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyAnnualIncome": "120000",

"ParentsBankBalance": "15000",

"CollegeNameSchoolName": "Example College",

"CollegeSchoolType": "Government",

"CollegeContactNumber": "9876500000",

"CourseStudyingApplying": "B.Com",

"CourseStream": "Commerce",

"AnnualCollegeSchoolFees": "25000",

"TotalEducationalExpenses": "50000",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": "82.50",

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BankBranchName": "Dharwad",

"LatestMarkSheetPath": "/uploads/marks.pdf",

"StudentBankPassbookPath": "/uploads/passbook.pdf",

"StudentSelfiePhotoPath": "/uploads/photo.jpg",

"DwellingUnitPhotoPath": "/uploads/house.jpg",

"StudentAadharCardPath": "/uploads/aadhar.jpg",

"FeesReceiptPath": "/uploads/fees.pdf",

"Approve": "Approved",

"Remarks": ""

}

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Import ID."

}

404 Not Found:

{

"success": false,

"message": "Imported Payana Student not found."

}

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly generated.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

8. IMPORT EXCEL

================

Endpoint:

POST /api/payana-student-grid/import

Purpose:

Uploads an Excel .xlsx file, reads the first worksheet, maps spreadsheet headers to database columns, and inserts each non-empty student row into GoogleSheet\_Payana\_NewStudent.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used by the import action.

\* Authentication is enforced through [JwtSessionFilter].

Content-Type:

multipart/form-data

Request Body:

Multipart form-data.

The controller does not specify a fixed multipart field name. It retrieves the first uploaded file from:

provider.FileData.FirstOrDefault()

Therefore:

File field name:

Not specified/enforced in the controller.

A client should send one Excel file as multipart/form-data.

Normal Form Fields:

| Field | Type | Required | Description |

|-------|------|----------|-------------|

| None | - | - | No normal form fields are read by this endpoint. |

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|-------|------|----------|--------------------|----------|-------------|

| Uploaded Excel file | File | Yes | .xlsx | Not specified in controller | First uploaded multipart file is processed. |

Important:

The controller does NOT explicitly enforce a multipart field name.

File Rules:

\* Request must be multipart/form-data.

\* At least one file must be supplied.

\* Only .xlsx files are accepted.

\* .xls is rejected.

\* No explicit maximum file size is defined in this controller.

\* Only the first uploaded file is processed.

\* Multiple files may technically be sent, but only the first FileData item is selected.

\* Uploaded files are temporarily stored under:

~/App\_Data/TempUploads/

\* Temporary files are cleaned up after normal processing or validation failures where CleanupUploadedFiles(provider) is called.

\* If an unexpected outer exception occurs before cleanup, the controller's outer catch returns 500 without explicitly calling cleanup there.

Validation Rules:

1. Request.Content must exist and be multipart/form-data.

2. At least one file must be present.

3. The selected file must have .xlsx extension.

4. The first worksheet must exist.

5. The worksheet must contain a used range.

6. Empty rows are skipped if all of the following are blank:

\* Name of student

\* Email Address

\* Primary (What's app)Number

7. Excel headers are normalized by trimming and collapsing consecutive whitespace.

8. Header matching is case-insensitive.

9. Blank headers are ignored.

10. A header named "Column1" is ignored.

11. Duplicate normalized headers are not added again; the first occurrence is retained.

12. Individual row insertion errors do not stop processing of all rows.

13. Each failed row is counted in failedCount and its error message is added to errors.

14. At most the first 20 errors are returned in the response.

Requiredness of Excel columns:

The controller does NOT enforce that every listed header exists.

If a header is missing:

ExcelValue(headerName) returns an empty string.

Therefore, the Excel column fields are not controller-level mandatory columns.

However, database constraints may still cause an insertion to fail if a target database column has a NOT NULL or length constraint. Such database constraints are not visible in the supplied controller.

Excel Fields Read:

| Field | Type | Required by Controller | Description |

|-------|------|------------------------|-------------|

| Timestamp | string | No | Spreadsheet timestamp |

| Email Address | string | No | Email address |

| District | string | No | District |

| Taluk | string | No | Taluk |

| Name of student | string | No | Student name |

| Residential address | string | No | Residential address |

| Current address | string | No | Current address |

| Date of birth | string | No | Date of birth |

| Primary (What's app)Number | string | No | Primary/WhatsApp number |

| Alternate Number | string | No | Alternate number |

| Email id | string | No | Student email ID |

| Place | string | No | Place |

| Caste | string | No | Caste/category |

| Father's occupation | string | No | Father's occupation |

| Mother's occupation | string | No | Mother's occupation |

| Family annual income | string | No | Family annual income |

| Parents bank balance | string | No | Parents' bank balance |

| College Name/School Name | string | No | College or school |

| College/School type | string | No | College/school type |

| College Contact number | string | No | College contact number |

| Course Studying/Applying | string | No | Course |

| Course Stream | string | No | Course stream |

| Annual College/School fees | string | No | Annual fees |

| Total Educational Expenses for the year | string | No | Total educational expenses |

| Student Achievement in 2025-26 | string | No | Student achievement |

| Secured percentage in the academic year 2025-26 | string | No | Secured percentage |

| Account holder name as per Passbook | string | No | Bank account holder |

| Bank account number | string | No | Bank account number |

| IFSC Code | string | No | IFSC |

| Bank Name | string | No | Bank name |

| Bank Branch Name | string | No | Bank branch |

| Latest Mark sheet / Semester result | string | No | Marks/result path or value |

| Student Bank Passbook first page | string | No | Passbook path or value |

| Student latest selfie/photo | string | No | Student photo path or value |

| Dwelling Unit Photo in front of the house | string | No | House photo path or value |

| Student's Aadhar card photo | string | No | Aadhar path or value |

| Fees receipt | string | No | Fees receipt path or value |

Important Excel data behavior:

All imported values except Timestamp are read as strings and inserted using AddWithValue.

No explicit:

\* email validation

\* date validation

\* numeric validation

\* percentage range validation

\* phone-number validation

\* IFSC validation

\* file path validation

\* duplicate student validation

is performed by the controller.

Timestamp is inserted as DBNull.Value when blank.

Empty string values are generally inserted as empty strings.

Database Operation:

INSERT INTO GoogleSheet\_Payana\_NewStudent

Columns inserted:

\* Timestamp

\* Email Address

\* District

\* Taluk

\* Name of student

\* Residential address

\* Current address

\* Date of birth

\* Primary (What's app)Number

\* Alternate Number

\* Email id

\* Place

\* Caste

\* Father's occupation

\* Mother's occupation

\* Family annual income

\* Parents bank balance

\* College Name/School Name

\* College/School type

\* College Contact number

\* Course Studying/Applying

\* Course Stream

\* Annual College/School fees

\* Total Educational Expenses for the year

\* Student Achievement in 2025-26

\* Secured percentage in the academic year 2025-26

\* Account holder name as per Passbook

\* Bank account number

\* IFSC Code

\* Bank Name

\* Bank Branch Name

\* Latest Mark sheet / Semester result

\* Student Bank Passbook first page

\* Student latest selfie/photo

\* Dwelling Unit Photo in front of the house

\* Student's Aadhar card photo

\* Fees receipt

Transaction Behavior:

No explicit database transaction is implemented.

Each Excel row is inserted separately using its own SqlConnection and SqlCommand.

Therefore:

\* Successful rows remain inserted even if later rows fail.

\* There is no all-or-nothing transaction.

Success Response (200):

{

"success": true,

"message": "Excel import completed.\n\nInserted: 2\nFailed: 1\n\nErrors:\nRow 4: Example error",

"insertedCount": 2,

"failedCount": 1,

"errors": [

"Row 4: Example error"

]

}

Important:

The response uses:

success = insertedCount > 0

Therefore, an import with zero inserted rows returns success=false even though the HTTP response is still 200.

Example all-success response:

{

"success": true,

"message": "Excel import completed.\n\nInserted: 2\nFailed: 0",

"insertedCount": 2,

"failedCount": 0,

"errors": []

}

Example all-failed response:

{

"success": false,

"message": "Excel import completed.\n\nInserted: 0\nFailed: 2\n\nErrors:\nRow 2: Error 1\nRow 3: Error 2",

"insertedCount": 0,

"failedCount": 2,

"errors": [

"Row 2: Error 1",

"Row 3: Error 2"

]

}

Failure Responses:

400 Bad Request:

Returned when:

\* Request is not multipart/form-data.

\* No file is uploaded.

\* Uploaded file object is unavailable.

\* Extension is not .xlsx.

\* No worksheet exists.

\* Worksheet is empty.

Examples:

{

"success": false,

"message": "Request must use multipart/form-data."

}

{

"success": false,

"message": "Please select an Excel file."

}

{

"success": false,

"message": "Please select only .xlsx Excel file."

}

{

"success": false,

"message": "Excel worksheet not found."

}

{

"success": false,

"message": "Excel file is empty."

}

401 Unauthorized:

Expected from [JwtSessionFilter] if JWT authentication fails.

403 Forbidden:

Not explicitly generated by this action.

409 Conflict:

Not used.

500 Internal Server Error:

Returned for unexpected exceptions outside row-level processing.

{

"success": false,

"message": "Error message"

}

Important row-level failures:

Individual database/import errors are captured inside the row loop and do not cause an HTTP 500. They contribute to failedCount and errors.

Status Codes Used:

\* 200

\* 400

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

9. APPROVE IMPORTED STUDENT

============================

Endpoint:

POST /api/payana-student-grid/imported/approve/{id}

Purpose:

Changes an imported Payana student's Approve field to "Approved" and stores the supplied Remarks value.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Approved after verification."

}

Request DTO:

RemarkRequest

Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| Remark | string | No | Yes | Remark to store. If null/whitespace, database value becomes NULL. |

Validation Rules:

\* id must be greater than 0.

\* Request body can be null.

\* Remark is optional.

\* Whitespace/empty Remark is converted to DBNull.Value.

\* No maximum length is specified.

\* No role check is directly implemented.

\* No previous approval-state validation.

Business Logic Notes:

The action calls:

UpdateImportedStudentStatus(id, "Approved", remarks)

Database operation:

UPDATE GoogleSheet\_Payana\_NewStudent

SET

Approve = @Approve,

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student approved successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Import ID."

}

404 Not Found:

{

"success": false,

"message": "Imported student not found."

}

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly generated.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

10. REJECT IMPORTED STUDENT

============================

Endpoint:

POST /api/payana-student-grid/imported/reject/{id}

Purpose:

Changes an imported Payana student's Approve field to "Rejected" and stores the supplied Remarks value.

Authorization:

\* JWT Required

\* Authorization:

Bearer <JWT\_TOKEN>

\* Existing filter:

[JwtSessionFilter]

\* Filter scope:

Action-level

\* Required role:

No explicit role restriction in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Required Claims: Not directly specified.

\* Session values are not directly used.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters. |

Request Body:

{

"Remark": "Rejected after verification."

}

Request DTO:

RemarkRequest

Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| Remark | string | No | Yes | Remark to store. If null/whitespace, database value becomes NULL. |

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark is optional.

\* Whitespace/empty Remark becomes NULL.

\* No maximum length is defined.

\* No explicit role validation.

\* No previous status validation.

\* No duplicate validation.

Business Logic Notes:

The action calls:

UpdateImportedStudentStatus(id, "Rejected", remarks)

Database operation:

UPDATE GoogleSheet\_Payana\_NewStudent

SET

Approve = @Approve,

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student rejected successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid Import ID."

}

404 Not Found:

{

"success": false,

"message": "Imported student not found."

}

401 Unauthorized:

Expected from [JwtSessionFilter].

403 Forbidden:

Not explicitly generated.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the JWT filter.

=========================================================

COMMON DTOS

===========

DTO 1: RemarkRequest

====================

Purpose:

Request DTO used by the four approval/rejection endpoints to carry a remark.

Used By:

\* POST /api/payana-student-grid/approve/{id}

\* POST /api/payana-student-grid/reject/{id}

\* POST /api/payana-student-grid/imported/approve/{id}

\* POST /api/payana-student-grid/imported/reject/{id}

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Remark | string | No | Yes | Remark associated with approval/rejection. |

Sample Request:

{

"Remark": "Approved after verification."

}

Behavior:

For normal Payana students:

\* null/whitespace remark becomes "".

For imported Payana students:

\* null/whitespace remark becomes database NULL.

=========================================================

DTO 2: PayanaStudentDto

=======================

Purpose:

Represents a normal Payana student returned by the list and single-student endpoints.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Student identifier. Defaults to 0 if database value cannot be read. |

| StudentName | string | No | Yes | Student name. |

| DateOfBirth | DateTime | No | Yes | Student date of birth. |

| ContactNumber | string | No | Yes | Primary contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| Email | string | No | Yes | Email address. |

| AreaTypeID | int | No | Yes | Area type ID. |

| AreaTypeName | string | No | Yes | Area type name from AreaTypeMaster. |

| Address | string | No | Yes | Permanent/address information. |

| CurrentAddress | string | No | Yes | Current address. |

| DistrictID | int | No | Yes | District ID. |

| DistrictName | string | No | Yes | District name from DistrictMaster. |

| OtherDistrict | string | No | Yes | Other district value. |

| Taluka | string | No | Yes | Taluka. |

| PinCode | string | No | Yes | PIN code. |

| FatherName | string | No | Yes | Father's name. |

| MotherName | string | No | Yes | Mother's name. |

| FatherOccupationID | int | No | Yes | Father's occupation ID. |

| MotherOccupationID | int | No | Yes | Mother's occupation ID. |

| FatherOccupationName | string | No | Yes | Father's occupation name. |

| MotherOccupationName | string | No | Yes | Mother's occupation name. |

| FamilyMembers | int | No | Yes | Number of family members. |

| FamilyIncome | decimal | No | Yes | Family income. |

| CasteCategoryID | int | No | Yes | Caste category ID. |

| CategoryName | string | No | Yes | Caste category name. |

| CollegeName | string | No | Yes | College name. |

| CollegeTypeID | int | No | Yes | College type ID. |

| CollegeTypeName | string | No | Yes | College type name. |

| CollegeContactNumber | string | No | Yes | College contact number. |

| CourseSA | string | No | Yes | Course. |

| CourseStream | string | No | Yes | Course stream. |

| AnnualFees | decimal | No | Yes | Annual fees. |

| TotalExpenses | decimal | No | Yes | Total expenses. |

| ReferenceSourceOther | string | No | Yes | Other reference source. |

| StudentAchievement | string | No | Yes | Student achievement. |

| SecuredPercentage | decimal | No | Yes | Secured percentage. |

| AccountHolderName | string | No | Yes | Bank account holder name. |

| BankAccountNumber | string | No | Yes | Bank account number. |

| IFSCCode | string | No | Yes | IFSC code. |

| BankName | string | No | Yes | Bank name. |

| BranchName | string | No | Yes | Bank branch. |

| StudentPhotoPath | string | No | Yes | Student photo path. |

| MarksCardPath | string | No | Yes | Marks card path. |

| BankPassbookPath | string | No | Yes | Bank passbook path. |

| AadharPath | string | No | Yes | Aadhar document path. |

| HousePhotoPath | string | No | Yes | House photo path. |

| ParentsBankBalance | decimal | No | Yes | Parents' bank balance. |

| HouseVisitLink | string | No | Yes | House visit link. |

| ApproveStatus | string | No | Yes | Approval status. |

| Remark | string | No | Yes | Approval/rejection remark. |

Important:

Requiredness above refers to the DTO/controller contract. The controller does not perform required-field validation for these response fields.

Sample Response Item:

{

"StudentID": 101,

"StudentName": "John Doe",

"DateOfBirth": "2008-06-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Email": "john@example.com",

"AreaTypeID": 1,

"AreaTypeName": "Rural",

"Address": "Main Road",

"CurrentAddress": "Current Address",

"DistrictID": 5,

"DistrictName": "Dharwad",

"OtherDistrict": "",

"Taluka": "Dharwad",

"PinCode": "580001",

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 2,

"MotherOccupationID": 3,

"FatherOccupationName": "Farmer",

"MotherOccupationName": "Homemaker",

"FamilyMembers": 5,

"FamilyIncome": 120000.00,

"CasteCategoryID": 1,

"CategoryName": "Category",

"CollegeName": "Example College",

"CollegeTypeID": 1,

"CollegeTypeName": "Government",

"CollegeContactNumber": "9876500000",

"CourseSA": "B.Com",

"CourseStream": "Commerce",

"AnnualFees": 25000.00,

"TotalExpenses": 50000.00,

"ReferenceSourceOther": "",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": 82.50,

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BranchName": "Dharwad",

"StudentPhotoPath": "/uploads/student.jpg",

"MarksCardPath": "/uploads/marks.pdf",

"BankPassbookPath": "/uploads/passbook.pdf",

"AadharPath": "/uploads/aadhar.jpg",

"HousePhotoPath": "/uploads/house.jpg",

"ParentsBankBalance": 15000.00,

"HouseVisitLink": "/house-visits/101",

"ApproveStatus": "Approved",

"Remark": ""

}

=========================================================

DTO 3: PayanaImportedStudentDto

===============================

Purpose:

Represents a Payana student imported from GoogleSheet\_Payana\_NewStudent.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ImportID | int | Yes | No | Imported record identifier. |

| Timestamp | string | No | Yes | Import/spreadsheet timestamp. |

| EmailAddress | string | No | Yes | Email Address column. |

| District | string | No | Yes | District. |

| Taluk | string | No | Yes | Taluk. |

| StudentName | string | No | Yes | Student name. |

| ResidentialAddress | string | No | Yes | Residential address. |

| CurrentAddress | string | No | Yes | Current address. |

| DateOfBirth | string | No | Yes | Date of birth as imported string. |

| WhatsAppNumber | string | No | Yes | Primary WhatsApp number. |

| AlternateNumber | string | No | Yes | Alternate number. |

| EmailId | string | No | Yes | Email ID. |

| Place | string | No | Yes | Place. |

| Caste | string | No | Yes | Caste. |

| FatherOccupation | string | No | Yes | Father's occupation. |

| MotherOccupation | string | No | Yes | Mother's occupation. |

| FamilyAnnualIncome | string | No | Yes | Family annual income. |

| ParentsBankBalance | string | No | Yes | Parents' bank balance. |

| CollegeNameSchoolName | string | No | Yes | College/school name. |

| CollegeSchoolType | string | No | Yes | College/school type. |

| CollegeContactNumber | string | No | Yes | College contact number. |

| CourseStudyingApplying | string | No | Yes | Course studying/applying. |

| CourseStream | string | No | Yes | Course stream. |

| AnnualCollegeSchoolFees | string | No | Yes | Annual college/school fees. |

| TotalEducationalExpenses | string | No | Yes | Total educational expenses. |

| StudentAchievement | string | No | Yes | Student achievement. |

| SecuredPercentage | string | No | Yes | Secured percentage. |

| AccountHolderName | string | No | Yes | Account holder name. |

| BankAccountNumber | string | No | Yes | Bank account number. |

| IFSCCode | string | No | Yes | IFSC code. |

| BankName | string | No | Yes | Bank name. |

| BankBranchName | string | No | Yes | Bank branch. |

| LatestMarkSheetPath | string | No | Yes | Latest marksheet/result value/path. |

| StudentBankPassbookPath | string | No | Yes | Bank passbook value/path. |

| StudentSelfiePhotoPath | string | No | Yes | Student selfie/photo value/path. |

| DwellingUnitPhotoPath | string | No | Yes | Dwelling unit photo value/path. |

| StudentAadharCardPath | string | No | Yes | Aadhar photo value/path. |

| FeesReceiptPath | string | No | Yes | Fees receipt value/path. |

| Approve | string | No | Yes | Approval status. |

| Remarks | string | No | Yes | Approval/rejection remarks. |

Important:

All properties are response properties. The controller does not apply DTO-level required-field validation.

Sample Response Item:

{

"ImportID": 1,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "student@example.com",

"District": "Dharwad",

"Taluk": "Dharwad",

"StudentName": "John Doe",

"ResidentialAddress": "Residential Address",

"CurrentAddress": "Current Address",

"DateOfBirth": "2008-06-15",

"WhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"EmailId": "student@example.com",

"Place": "Dharwad",

"Caste": "Category",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyAnnualIncome": "120000",

"ParentsBankBalance": "15000",

"CollegeNameSchoolName": "Example College",

"CollegeSchoolType": "Government",

"CollegeContactNumber": "9876500000",

"CourseStudyingApplying": "B.Com",

"CourseStream": "Commerce",

"AnnualCollegeSchoolFees": "25000",

"TotalEducationalExpenses": "50000",

"StudentAchievement": "Good academic performance",

"SecuredPercentage": "82.50",

"AccountHolderName": "John Doe",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "State Bank",

"BankBranchName": "Dharwad",

"LatestMarkSheetPath": "/uploads/marks.pdf",

"StudentBankPassbookPath": "/uploads/passbook.pdf",

"StudentSelfiePhotoPath": "/uploads/photo.jpg",

"DwellingUnitPhotoPath": "/uploads/house.jpg",

"StudentAadharCardPath": "/uploads/aadhar.jpg",

"FeesReceiptPath": "/uploads/fees.pdf",

"Approve": "Approved",

"Remarks": ""

}

=========================================================

DROPDOWN APIs

============

No dropdown APIs are implemented in this controller.

The controller performs LEFT JOINs against master tables to return descriptive names, but it does not expose separate dropdown endpoints.

Therefore:

\* No dropdown endpoint exists.

\* No dropdown request parameters exist.

\* No dropdown response exists.

\* No "-- Select --" value is generated.

\* No active/inactive dropdown filtering is implemented.

\* No UserID/EmployeeID dropdown filtering is implemented.

=========================================================

PAGINATION / SEARCH / FILTERING / SORTING

===========================================

Pagination:

Not implemented.

Page Number:

Not specified.

Page Size:

Not specified.

Search:

Not implemented.

Sorting:

Not implemented.

Date Filters:

Not implemented.

Normal Student List Filtering:

\* Status = 1.

\* Branch Executive district restriction based on Session UserID.

Imported Student List Filtering:

\* No active/inactive filter.

\* Branch Executive district restriction based on Session UserID and DistrictMaster mapping.

=========================================================

DATABASE SUMMARY

================

Normal Student Table:

PayanaStudents

Related Master Tables:

\* AreaTypeMaster

\* DistrictMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CasteCategoryMaster

\* CollegeTypeMaster

Authorization Mapping Table:

BranchExecutiveDistrictMapping

Imported Student Table:

GoogleSheet\_Payana\_NewStudent

Operations:

SELECT:

\* Normal student list

\* Normal student by ID

\* Imported student list

\* Imported student by ImportID

UPDATE:

\* Normal student approval/rejection

\* Normal student soft deletion

\* Imported student approval/rejection

INSERT:

\* Excel import into GoogleSheet\_Payana\_NewStudent

DELETE:

No physical DELETE operation is implemented.

Soft Delete:

Normal Payana students use:

Status = 0

The controller refers to this as deletion, but the database row is retained.

=========================================================

AUTHENTICATION AND AUTHORIZATION SUMMARY

=========================================

Endpoint | JWT Required | Existing Filter | Role Requirement

----------|--------------|-----------------|-----------------

GET /api/payana-student-grid/list | Yes | [JwtSessionFilter] | No fixed role; Branch Executives are district-filtered

GET /api/payana-student-grid/{id} | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/approve/{id} | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/reject/{id} | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/delete/{id} | Yes | [JwtSessionFilter] | No explicit role

GET /api/payana-student-grid/imported/list | Yes | [JwtSessionFilter] | No fixed role; Branch Executives are district-filtered

GET /api/payana-student-grid/imported/{id} | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/import | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/imported/approve/{id} | Yes | [JwtSessionFilter] | No explicit role

POST /api/payana-student-grid/imported/reject/{id} | Yes | [JwtSessionFilter] | No explicit role

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | int | Required for Branch Executive filtering | Identifies the authenticated user whose district mappings are queried. Exact JWT claim name is not visible in this controller. |

| UserRole | string | Required for role-specific behavior | Determines whether the Branch Executive district filter is applied. Exact JWT claim name is not visible in this controller. |

Important:

The controller reads Session["UserID"] and Session["UserRole"], not JWT claims directly.

Therefore the contract should treat the following as an authentication dependency:

JWT

↓

JwtSessionFilter

↓

Session["UserID"]

Session["UserRole"]

↓

Controller role/district filtering

The exact implementation of this mapping is NOT specified in the supplied code.

=========================================================

VALIDATION / DEFAULT VALUE SUMMARY

===================================

ID Validation:

\* StudentID/ImportID must be greater than 0.

\* Invalid IDs produce 400.

Normal Student Active Status:

\* List endpoint only returns Status = 1.

Soft Delete:

\* POST delete sets Status = 0.

Approval Values:

Normal student:

\* "Approved"

\* "Rejected"

Imported student:

\* "Approved"

\* "Rejected"

Remark:

Normal student:

\* null/whitespace becomes empty string.

Imported student:

\* null/whitespace becomes DBNull.Value.

Excel:

\* Only .xlsx is accepted.

\* First worksheet is processed.

\* Missing headers are treated as empty values.

\* Rows with blank StudentName, Email Address, and Primary (What's app)Number are skipped.

\* Maximum returned error list: 20.

\* No explicit maximum Excel file size is specified.

Default Values:

| Value | Default |

|-------|---------|

| UserRole | "" if Session["UserRole"] is null |

| UserID | 0 if Session["UserID"] is null or cannot be parsed |

| Normal approval Remark | "" when null/whitespace |

| Imported approval Remarks | NULL when null/whitespace |

| Excel Timestamp | NULL when blank |

| Missing Excel field | "" |

| Empty-row behavior | Skip when StudentName, Email Address and Primary number are all blank |

=========================================================

HTTP STATUS CODE SUMMARY

========================

200 OK:

Used for successful list, get, approval, rejection, soft delete, and completed Excel import operations.

400 Bad Request:

Explicitly used for:

\* Invalid normal StudentID.

\* Invalid ImportID.

\* Non-multipart Excel request.

\* Missing Excel file.

\* Non-.xlsx file.

\* Missing worksheet.

\* Empty worksheet.

401 Unauthorized:

Not explicitly returned in the controller.

Expected to be generated by [JwtSessionFilter] when authentication fails, depending on the filter implementation.

403 Forbidden:

Not explicitly returned in the controller.

The controller does not perform explicit role rejection with Forbid/403.

Branch Executive restrictions are implemented as SQL filtering, not HTTP authorization rejection.

404 Not Found:

Explicitly used when:

\* Normal Payana student does not exist during GET by ID.

\* Normal Payana student does not exist during approval/rejection/delete.

\* Imported Payana student does not exist during GET by ID.

\* Imported Payana student does not exist during approval/rejection.

409 Conflict:

Not used.

500 Internal Server Error:

Returned when an unexpected exception reaches the controller's catch block.

Standard error structure:

{

"success": false,

"message": "Error message"

}

=========================================================

COMPLETE ENDPOINT INVENTORY

===========================

1. GET

/api/payana-student-grid/list

Normal Payana student list

JWT: Required

Branch Executive district filtering: Yes

2. GET

/api/payana-student-grid/{id}

Normal Payana student by ID

JWT: Required

3. POST

/api/payana-student-grid/approve/{id}

Approve normal Payana student

JWT: Required

4. POST

/api/payana-student-grid/reject/{id}

Reject normal Payana student

JWT: Required

5. POST

/api/payana-student-grid/delete/{id}

Soft-delete normal Payana student

JWT: Required

6. GET

/api/payana-student-grid/imported/list

Imported Payana student list

JWT: Required

Branch Executive district filtering: Yes

7. GET

/api/payana-student-grid/imported/{id}

Imported Payana student by ImportID

JWT: Required

8. POST

/api/payana-student-grid/import

Import Payana students from Excel

JWT: Required

Content-Type: multipart/form-data

Accepted file: .xlsx

9. POST

/api/payana-student-grid/imported/approve/{id}

Approve imported Payana student

JWT: Required

10. POST

/api/payana-student-grid/imported/reject/{id}

Reject imported Payana student

JWT: Required

=========================================================

FINAL AUTHORIZATION CONCLUSION

==============================

Based strictly on the supplied controller:

\* There are NO public endpoints in this controller.

\* Every action explicitly contains [JwtSessionFilter].

\* Therefore JWT authentication is currently required for all 10 endpoints.

\* The filter is applied at ACTION LEVEL, not controller level.

\* No controller-level [JwtSessionFilter] is present.

\* No endpoint explicitly requires a fixed role such as Admin.

\* "Branch Executives" is a special role used only for data filtering in:

\* GET /api/payana-student-grid/list

\* GET /api/payana-student-grid/imported/list

\* Branch Executives are not rejected from other endpoints by this controller.

\* The controller obtains UserID and UserRole from Session.

\* The actual JWT claim names and the mechanism used by JwtSessionFilter to populate Session are NOT specified in this controller.

\* No EmployeeID claim is used.

\* No CreatedBy or ModifiedBy field is populated from JWT.

\* No pagination, search, sorting, or date filtering is implemented.

\* No dropdown endpoint exists.

\* No hard DELETE exists for normal Payana students; deletion is a soft delete using Status = 0.

\* Excel import is row-by-row and does not use a database transaction.

\* Excel import accepts only .xlsx files and does not define a maximum file size.

\* The controller does not implement explicit email, phone, date, percentage, financial amount, or duplicate-record validation.

\* Database-level constraints, if any, are not visible and therefore cannot be documented as controller validations.