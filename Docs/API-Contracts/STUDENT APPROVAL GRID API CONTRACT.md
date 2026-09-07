API CONTRACT DOCUMENT

Student Approval Grid API

=========================================================

API BASE ROUTE

=========================================================

Route Prefix:

/api/student-approval-grid

Technology:

ASP.NET Web API 2 / .NET Framework / ADO.NET / SQL Server

Authentication Overview:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute.

Important:

- The controller does NOT use a controller-level JWT filter.

- All currently exposed endpoints in this controller have [JwtSessionFilter].

- Therefore, based strictly on the supplied controller code, JWT authentication is currently required for every endpoint in this controller.

- The filter implementation itself is not supplied, so the exact JWT claim names validated by the filter cannot be fully determined.

- Several endpoints additionally depend on ASP.NET Session values that are expected to be populated by the JWT/session authentication mechanism.

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Role-Based Authorization:

- The role "Branch Executives" has special district-based data filtering on the list and import-grid endpoints.

- No explicit role restriction is implemented for approve, reject, delete, edit, dropdown, or import actions.

- The controller checks the role value from:

HttpContext.Current.Session["UserRole"]

Session User Identity:

- The list and import-grid endpoints require:

HttpContext.Current.Session["UserID"]

- The controller parses this value into an integer UserID.

- If UserID is unavailable or cannot be parsed, the endpoint returns 401 Unauthorized.

=========================================================

ENDPOINT 1. Student Approval Grid

=========================================================

Endpoint:

GET /api/student-approval-grid/list

Purpose:

Returns active students from New\_Students for the student approval grid.

Branch Executive behavior:

If the authenticated user's role is "Branch Executives", only students whose DistrictID is mapped to the logged-in UserID through BranchExecutiveDistrictMapping are returned.

For other roles, the controller does not apply a role-specific district filter.

Content-Type:

Not applicable for GET request.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: The exact claims validated by JwtSessionFilter are not specified in the supplied controller.

\* Session values required:

- UserID

- UserRole

\* The controller expects the JWT/session authentication mechanism to populate these Session values.

\* UserID is required for this endpoint for all roles because TryGetSessionUserId() is executed before querying the database.

\* UserRole determines whether Branch Executive district filtering is applied.

Required Roles:

No single role is required.

Special Role:

Branch Executives

How the role is used:

If UserRole equals "Branch Executives" case-insensitively, the query is restricted to DistrictID values contained in BranchExecutiveDistrictMapping for the authenticated UserID.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameter is used. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are supported. |

Request Body:

None.

Validation Rules:

\* Authenticated UserID must exist in Session.

\* UserID must be convertible to integer.

\* If UserID is missing or invalid, 401 Unauthorized is returned.

\* Only records with ns.Status = 1 are selected.

\* No pagination validation is implemented.

\* No search parameter is implemented.

\* No sorting parameter is implemented.

\* No date filtering is implemented.

\* No explicit duplicate validation is implemented.

\* No ModelState validation is implemented.

\* No request body validation is required because this is a GET request.

Business Logic Notes:

\* Reads from New\_Students.

\* Uses LEFT JOINs to retrieve descriptive values from master tables.

\* Only active records are returned:

ns.Status = 1

\* Branch Executives are restricted to districts mapped through BranchExecutiveDistrictMapping.

\* Branch Executive filtering is based on authenticated UserID.

\* Other roles are not explicitly restricted by this controller.

\* No pagination is implemented.

\* No total-count field is separately calculated; count equals the number of records returned.

\* The count is returned as students.Count.

Database Tables Accessed:

\* New\_Students

\* GenderMaster

\* DistrictMaster

\* AreaTypeMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CasteCategoryMaster

\* HouseTypeMaster

\* ReferenceSourceMaster

\* CourseMaster

\* CollegeTypeMaster

\* BranchExecutiveDistrictMapping

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"StudentID": 101,

"StudentName": "Rahul Kumar",

"DateOfBirth": "2008-06-15T00:00:00",

"GenderID": 1,

"GenderName": "Male",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Email": "rahul@example.com",

"Address": "Main Road, Village",

"AreaTypeName": "Rural",

"District": "Dharwad",

"OtherDistrict": "",

"Taluka": "Dharwad",

"PinCode": "580001",

"FatherName": "Ramesh Kumar",

"MotherName": "Suma Kumar",

"FamilyIncome": 15000.00,

"FamilyMembers": 5,

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"CategoryName": "OBC",

"HouseTypeName": "Own",

"MonthlyRent": "",

"SourceName": "Volunteer",

"CourseName": "Science",

"CollegeName": "ABC College",

"CollegeTypeName": "Government",

"ExpectedFees": 25000.00,

"SecuredPercentage": 85.50,

"TotalMarks": 510,

"Status": "1",

"ApprovalStatus": "Pending",

"StudentPhotoPath": "/uploads/student/photo.jpg",

"SSLCMarksCardPath": "/uploads/student/sslc.pdf",

"ElectricityBillPath": "/uploads/student/electricity.jpg",

"RationCardPath": "/uploads/student/ration.jpg",

"IncomeCertificatePath": "/uploads/student/income.pdf",

"FamilyPhotoPath": "/uploads/student/family.jpg",

"HouseVideoPath": "/uploads/student/house.mp4",

"HouseVisitLink": "/house-visits/101",

"Remark": ""

}

]

}

Failure Responses:

401 Unauthorized:

Occurs when Session["UserID"] is missing or cannot be parsed.

{

"success": false,

"message": "Authenticated UserID was not found."

}

403 Forbidden:

Not explicitly returned by this action. It may be generated by JwtSessionFilter if the authenticated request does not satisfy the filter's authorization rules. Exact behavior is not specified in the supplied controller.

404 Not Found:

Not explicitly returned by this endpoint.

409 Conflict:

Not used by this endpoint.

500 Internal Server Error:

Occurs when an unexpected exception is raised while loading the grid.

{

"success": false,

"message": "Unable to load student approval grid."

}

Status Codes Used:

\* 200 OK

\* 401 Unauthorized

\* 500 Internal Server Error

\* 403 may be generated by JwtSessionFilter, but is not explicitly returned by the action.

=========================================================

ENDPOINT 2. Approve Student

=========================================================

Endpoint:

POST /api/student-approval-grid/approve/{id}

Purpose:

Approves a student by updating New\_Students.ApprovalStatus to "Approved" and saving an optional remark.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified in the controller.

\* Session dependency: None directly used by the action.

\* Role requirement: None explicitly implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID of the student to approve. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are supported. |

Request Body:

{

"Remark": "Documents verified and approved."

}

Request Body DTO:

RemarkRequest

Validation Rules:

\* id is required.

\* id must be greater than 0.

\* Remark is optional.

\* If request is null, an empty remark is used.

\* If Remark is null, empty, or whitespace, NULL is stored in the database.

\* No maximum Remark length is enforced by the controller.

\* No duplicate approval check is implemented.

\* No explicit role check is implemented.

\* JwtSessionFilter performs authentication/filter validation.

Business Logic Notes:

\* Calls UpdateStatus(id, "Approved", remark).

\* Updates:

- ApprovalStatus = "Approved"

- Remark = supplied remark or NULL

\* Updates New\_Students based on StudentID.

\* No Status field change occurs.

\* No audit UserID/ModifiedBy value is written by this controller.

\* No transaction is explicitly created.

\* If no row is updated, the endpoint returns 404.

Database Operation:

UPDATE New\_Students

SET

ApprovalStatus = @ApprovalStatus,

Remark = @Remark

WHERE StudentID = @StudentID

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

Occurs when id <= 0.

401 Unauthorized:

May be generated by JwtSessionFilter when authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter if authorization fails. No explicit role-based 403 is implemented by the action.

404 Not Found:

{

"success": false,

"message": "Student not found."

}

Occurs when UPDATE affects zero rows.

409 Conflict:

Not used.

500 Internal Server Error:

{

"success": false,

"message": "Unable to approve student."

}

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by the authentication filter.

=========================================================

ENDPOINT 3. Reject Student

=========================================================

Endpoint:

POST /api/student-approval-grid/reject/{id}

Purpose:

Rejects a student by updating New\_Students.ApprovalStatus to "Rejected" and saving an optional remark.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified in controller.

\* Session dependency: None directly used.

\* Required Roles: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Required documents are incomplete."

}

Validation Rules:

\* id must be greater than 0.

\* Remark is optional.

\* Null/empty/whitespace Remark is stored as NULL.

\* No maximum Remark length is enforced.

\* No duplicate validation is implemented.

\* No explicit role check is implemented.

Business Logic Notes:

\* Calls UpdateStatus(id, "Rejected", remark).

\* Updates New\_Students:

- ApprovalStatus = "Rejected"

- Remark = supplied remark or NULL

\* No hard deletion occurs.

\* No audit information is written by this action.

Success Response (200):

{

"success": true,

"message": "Student rejected successfully."

}

Failure Responses:

400:

{

"success": false,

"message": "Invalid Student ID."

}

401:

Authentication failure may be returned by JwtSessionFilter.

403:

Authorization failure may be returned by JwtSessionFilter.

404:

{

"success": false,

"message": "Student not found."

}

500:

{

"success": false,

"message": "Unable to reject student."

}

409:

Not used.

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 4. Delete Student

=========================================================

Endpoint:

POST /api/student-approval-grid/delete/{id}

Purpose:

Performs a soft delete of a student by setting New\_Students.Status to 0.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* Session dependency: None directly used by the action.

\* Required Roles: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None required.

Validation Rules:

\* id must be greater than 0.

\* No dependency check is performed.

\* No confirmation parameter is required.

\* No role check is performed inside the action.

\* No hard DELETE is performed.

Business Logic Notes:

\* This is a SOFT DELETE.

\* The database record remains in New\_Students.

\* Only Status is changed:

Status = 0

\* The list endpoint excludes these records because it selects Status = 1.

\* No audit UserID is stored by this action.

\* No transaction is explicitly created.

Database Operation:

UPDATE New\_Students

SET Status = 0

WHERE StudentID = @StudentID

Success Response (200):

{

"success": true,

"message": "Student deleted successfully."

}

Failure Responses:

400:

{

"success": false,

"message": "Invalid Student ID."

}

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

404:

{

"success": false,

"message": "Student not found."

}

500:

{

"success": false,

"message": "Unable to delete student."

}

409:

Not used.

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 5. Edit / Get Student

=========================================================

Endpoint:

GET /api/student-approval-grid/edit/{id}

Purpose:

Retrieves editable student information from New\_Students for the specified StudentID.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* Session dependency: None directly used by the action.

\* Required Roles: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* StudentID must exist.

\* If no matching student exists, 404 is returned.

\* No Status = 1 filter is applied.

\* Therefore, a record with Status = 0 can still be returned if the StudentID exists.

\* No additional authorization/business ownership check is implemented in this action.

Fields Retrieved:

\* StudentID

\* StudentName

\* DateOfBirth

\* GenderID

\* ContactNumber

\* AlternateNumber

\* Email

\* Address

\* AreaTypeID

\* DistrictID

\* Taluka

\* PinCode

\* StudentPhotoPath

\* SSLCMarksCardPath

\* ElectricityBillPath

\* RationCardPath

\* IncomeCertificatePath

\* FamilyPhotoPath

\* HouseVideoPath

Business Logic Notes:

\* Executes:

SELECT \* FROM New\_Students WHERE StudentID = @id

\* Uses the columns listed above from the result.

\* Other columns returned by SELECT \* are not mapped into StudentViewModel by this action.

\* No update operation occurs in this endpoint.

\* No file replacement logic occurs here.

\* No dropdown data is returned with this response.

Success Response (200):

{

"success": true,

"data": {

"StudentID": 101,

"StudentName": "Rahul Kumar",

"DateOfBirth": "2008-06-15T00:00:00",

"GenderID": 1,

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Email": "rahul@example.com",

"Address": "Main Road, Village",

"AreaTypeID": 1,

"DistrictID": 5,

"Taluka": "Dharwad",

"PinCode": "580001",

"StudentPhotoPath": "/uploads/student/photo.jpg",

"SSLCMarksCardPath": "/uploads/student/sslc.pdf",

"ElectricityBillPath": "/uploads/student/electricity.jpg",

"RationCardPath": "/uploads/student/ration.jpg",

"IncomeCertificatePath": "/uploads/student/income.pdf",

"FamilyPhotoPath": "/uploads/student/family.jpg",

"HouseVideoPath": "/uploads/student/house.mp4"

}

}

Failure Responses:

400:

{

"success": false,

"message": "Invalid Student ID."

}

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

404:

{

"success": false,

"message": "Student not found."

}

500:

{

"success": false,

"message": "Unable to load student."

}

409:

Not used.

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 6. Get Gender Dropdown

=========================================================

Endpoint:

GET /api/student-approval-grid/genders

Purpose:

Returns the active gender values from GenderMaster.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* Session UserID is NOT directly accessed by this action.

\* Role-based filtering is not implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* No request validation.

\* Only GenderMaster records where Status = 1 are returned.

\* No default "-- Select --" option is added by the API.

\* No UserID filtering.

\* No EmployeeID filtering.

\* No role filtering.

Database Operation:

SELECT GenderID, GenderName

FROM GenderMaster

WHERE Status = 1

Success Response (200):

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Male"

},

{

"Value": "2",

"Text": "Female"

}

]

}

Failure Responses:

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

500:

{

"success": false,

"message": "Unable to load gender list."

}

400:

Not used.

404:

Not used.

409:

Not used.

Status Codes Used:

\* 200

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 7. Get District Dropdown

=========================================================

Endpoint:

GET /api/student-approval-grid/districts

Purpose:

Returns district values from DistrictMaster.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* UserID is not directly read by this action.

\* Role-based filtering is not implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* No request parameters.

\* No Status filter is applied.

\* All records returned by SELECT DistrictID, DistrictName are included.

\* No default "-- Select --" option is added.

\* No UserID/EmployeeID/Role filtering.

Database Operation:

SELECT DistrictID, DistrictName

FROM DistrictMaster

Success Response (200):

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Belagavi"

}

]

}

Failure Responses:

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

500:

{

"success": false,

"message": "Unable to load district list."

}

400:

Not used.

404:

Not used.

409:

Not used.

Status Codes Used:

\* 200

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 8. Get Area Dropdown

=========================================================

Endpoint:

GET /api/student-approval-grid/areas

Purpose:

Returns active area types from AreaTypeMaster.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* UserID is not directly read by this action.

\* Role-based filtering is not implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* No request parameters.

\* Only AreaTypeMaster records with Status = 1 are returned.

\* No default "-- Select --" option is added.

\* No UserID/EmployeeID/Role filtering.

Database Operation:

SELECT AreaTypeID, AreaTypeName

FROM AreaTypeMaster

WHERE Status = 1

Success Response (200):

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Urban"

},

{

"Value": "2",

"Text": "Rural"

}

]

}

Failure Responses:

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

500:

{

"success": false,

"message": "Unable to load area list."

}

400:

Not used.

404:

Not used.

409:

Not used.

Status Codes Used:

\* 200

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 9. Import Students from Excel

=========================================================

Endpoint:

POST /api/student-approval-grid/import

Purpose:

Imports student information from an Excel .xlsx file into dbo.GoogleSheet\_PUC.

Content-Type:

multipart/form-data

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented in this action.

\* UserID/UserRole are not directly read by the import action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified by the controller.

\* Session dependency: None directly used by this action.

\* Required Role: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Form Data / Multipart Fields:

| Field | Type | Required | Description |

|-------|------|----------|-------------|

| file | File | Yes | Excel workbook that must be supplied using the "file" multipart form field. |

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|-------|------|----------|--------------------|----------|-------------|

| file | Excel file | Yes | .xlsx | Not specified in controller | Excel workbook containing the student import data. |

File Upload Behavior:

\* Request must be multipart/form-data.

\* The file must be supplied using the form field name "file".

\* Only .xlsx files are accepted.

\* The uploaded file is temporarily stored under:

~/App\_Data/\_TempApiExcelUploads

\* MultipartFormDataStreamProvider is used.

\* The temporary file is deleted in the finally block after processing.

\* Multiple uploaded files are not intentionally processed; FirstOrDefault() is used.

\* If no file is supplied, the request fails.

\* Maximum file size is not specified in the controller.

\* No permanent Excel file is stored by this endpoint.

Validation Rules:

\* Content-Type must be multipart/form-data.

\* A file must be present.

\* File field name must be exactly "file", case-insensitive.

\* File extension must be .xlsx.

\* Excel workbook must contain at least one used range.

\* First worksheet is processed.

\* Header row is row 1.

\* Header "Name of the student" is mandatory.

\* Rows without a StudentName are skipped.

\* Other headers are retrieved by exact header text, case-insensitive after trimming.

\* Missing optional Excel headers produce null values.

\* Each database row is inserted independently.

\* A failure in one row does not stop processing of subsequent rows.

\* No duplicate validation is performed.

\* No explicit email validation is performed.

\* No explicit numeric/date validation is performed by the controller before INSERT.

\* Database validation/type constraints may still cause a row to fail.

\* No transaction is used around the entire import.

Required Excel Header:

Name of the student

Excel Columns Read:

| Excel Header | Target Database Column | Required |

|---------------|------------------------|----------|

| Timestamp | Timestamp | Optional |

| Email Address | EmailAddress | Optional |

| Name of the student | StudentName | Required |

| Date of birth | DateOfBirth | Optional |

| Residential Address( Mention house no, Street name, Village/City name, Land mark near your house, Post, Taluka, District, Pin code etc) | ResidentialAddress | Optional |

| Place | Place | Optional |

| District | District | Optional |

| Taluka | Taluka | Optional |

| Contact number(WhatsApp number) | ContactNumber | Optional |

| Alternate number | AlternateNumber | Optional |

| Father's name | FatherName | Optional |

| Mother's name | MotherName | Optional |

| Father's occupation | FatherOccupation | Optional |

| Mother's occupation | MotherOccupation | Optional |

| Family income (Monthly) | FamilyIncome | Optional |

| Number of family members | FamilyMembers | Optional |

| Gender | Gender | Optional |

| Caste & Category | CasteCategory | Optional |

| How did you came to know about scholarship(Example: Volunteers, students or website etc) | ReferenceSource | Optional |

| House type | HouseType | Optional |

| If you are staying in rented house, kindly mention your monthly rent amount | MonthlyRent | Optional |

| Course | Course | Optional |

| Others (Course) | OtherCourse | Optional |

| College name(Likely to join) | CollegeName | Optional |

| College type(Likely to join) | CollegeType | Optional |

| Expected/ Approximate College fees | ExpectedFees | Optional |

| Secured percentage | SecuredPercentage | Optional |

| Total marks secured | TotalMarks | Optional |

| SSLC Marks card copy | SSLCMarksCardPath | Optional |

| Student Photo | StudentPhotoPath | Optional |

| Recent Electricity bill photo | ElectricityBillPath | Optional |

| Ration card photo(Upload two sides photos of ration card) | RationCardPath | Optional |

| Income Certificate | IncomeCertificatePath | Optional |

| Family photo in front of dwelling unit/House | FamilyPhotoPath | Optional |

| Full Video of the dwelling unit/House video (In video outside and inside the house should be covered) | HouseVideoPath | Optional |

Database Behavior:

INSERT INTO dbo.GoogleSheet\_PUC

(

Timestamp,

EmailAddress,

StudentName,

DateOfBirth,

ResidentialAddress,

Place,

District,

Taluka,

ContactNumber,

AlternateNumber,

FatherName,

MotherName,

FatherOccupation,

MotherOccupation,

FamilyIncome,

FamilyMembers,

Gender,

CasteCategory,

ReferenceSource,

HouseType,

MonthlyRent,

Course,

OtherCourse,

CollegeName,

CollegeType,

ExpectedFees,

SecuredPercentage,

TotalMarks,

SSLCMarksCardPath,

StudentPhotoPath,

ElectricityBillPath,

RationCardPath,

IncomeCertificatePath,

FamilyPhotoPath,

HouseVideoPath,

ImportedDate

)

ImportedDate:

Automatically populated by SQL Server using GETDATE().

Success Response (200):

{

"success": true,

"message": "2 student(s) imported successfully.",

"insertedCount": 2,

"failedCount": 0

}

Partial Success Response (200):

{

"success": true,

"message": "2 student(s) imported successfully.\n\n1 row(s) failed.\n\nErrors:\nExcel Row 4: Conversion failed...",

"insertedCount": 2,

"failedCount": 1

}

Failure Responses:

400 Bad Request - wrong content type:

{

"success": false,

"message": "Request must be multipart/form-data."

}

400 - no file:

{

"success": false,

"message": "Please select an Excel file."

}

400 - wrong form field:

{

"success": false,

"message": "Excel file must be sent using the 'file' form field."

}

400 - wrong extension:

{

"success": false,

"message": "Please upload only .xlsx Excel files."

}

400 - empty workbook:

{

"success": false,

"message": "The Excel file is empty."

}

400 - mandatory header missing:

{

"success": false,

"message": "Excel header 'Name of the student' was not found. Please check the first row of your Excel file."

}

400 - no rows imported:

{

"success": false,

"message": "No Excel rows were imported.\n\n...",

"insertedCount": 0,

"failedCount": 1

}

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

404:

Not explicitly used.

409:

Not explicitly used.

500:

{

"success": false,

"message": "Excel import failed.",

"insertedCount": 0,

"failedCount": 0,

"errors": []

}

Status Codes Used:

\* 200

\* 400

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 10. Imported Student Grid

=========================================================

Endpoint:

GET /api/student-approval-grid/import-grid

Purpose:

Returns student records imported into dbo.GoogleSheet\_PUC.

Branch Executive behavior:

For the role "Branch Executives", records are returned only when the imported District value matches the DistrictName of a district mapped to the authenticated UserID.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Session values:

- UserID

- UserRole

\* UserID is parsed using TryGetSessionUserId().

\* If UserID is missing or invalid, 401 is returned.

\* UserRole controls district filtering.

\* JWT claims themselves are not directly read; the controller relies on Session values.

Required Role:

No single role is required.

Special Role:

Branch Executives

Branch Executive filter:

\* Joins BranchExecutiveDistrictMapping to DistrictMaster.

\* Matches mapped DistrictName against GoogleSheet\_PUC.District.

\* Matching uses LTRIM/RTRIM on both values.

\* The authenticated UserID is used in BranchExecutiveDistrictMapping.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* Session UserID is required.

\* UserID must parse to an integer.

\* No pagination.

\* No search.

\* No sorting.

\* No date filtering.

\* No status filtering.

\* No duplicate validation.

\* No explicit approval-status filter.

\* Branch Executive filtering is applied by district name.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ImportID": 1001,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "student@example.com",

"StudentName": "Rahul Kumar",

"DateOfBirth": "2008-06-15",

"ResidentialAddress": "Main Road, Village",

"Place": "Dharwad",

"District": "Dharwad",

"Taluka": "Dharwad",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"FatherName": "Ramesh Kumar",

"MotherName": "Suma Kumar",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyIncome": "15000",

"FamilyMembers": "5",

"Gender": "Male",

"CasteCategory": "OBC",

"ReferenceSource": "Volunteer",

"HouseType": "Own",

"MonthlyRent": "",

"Course": "Science",

"OtherCourse": "",

"CollegeName": "ABC College",

"CollegeType": "Government",

"ExpectedFees": "25000",

"SecuredPercentage": "85.5",

"TotalMarks": "510",

"SSLCMarksCardPath": "/uploads/sslc.pdf",

"StudentPhotoPath": "/uploads/photo.jpg",

"ElectricityBillPath": "/uploads/electricity.jpg",

"RationCardPath": "/uploads/ration.jpg",

"IncomeCertificatePath": "/uploads/income.pdf",

"FamilyPhotoPath": "/uploads/family.jpg",

"HouseVideoPath": "/uploads/house.mp4",

"ImportedDate": "2026-08-28T10:35:00",

"Approve": "Pending",

"Remarks": ""

}

]

}

Failure Responses:

401:

{

"success": false,

"message": "Authenticated UserID was not found."

}

Occurs when Session["UserID"] is missing or invalid.

403:

May be generated by JwtSessionFilter.

500:

{

"success": false,

"message": "Unable to load imported student data."

}

400:

Not explicitly used.

404:

Not explicitly used.

409:

Not explicitly used.

Status Codes Used:

\* 200

\* 401

\* 500

\* 403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 11. Approve Imported Student

=========================================================

Endpoint:

POST /api/student-approval-grid/import-grid/approve/{id}

Purpose:

Marks an imported GoogleSheet\_PUC record as approved and stores an optional remark.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role check is implemented by the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* Session dependency: None directly used by this action.

\* Required Roles: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Imported student verified and approved."

}

Validation Rules:

\* id must be greater than 0.

\* Remark is optional.

\* If request is null, NULL is stored.

\* If Remark is empty or whitespace, NULL is stored.

\* No maximum Remark length is enforced by the controller.

\* No duplicate approval validation is implemented.

\* No explicit role validation is implemented.

Business Logic Notes:

Updates GoogleSheet\_PUC:

Approve = 'Approved'

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student approved successfully."

}

Failure Responses:

400:

{

"success": false,

"message": "Invalid ImportID."

}

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

404:

{

"success": false,

"message": "Student not found."

}

500:

{

"success": false,

"message": "Unable to approve imported student."

}

409:

Not used.

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

ENDPOINT 12. Reject Imported Student

=========================================================

Endpoint:

POST /api/student-approval-grid/import-grid/reject/{id}

Purpose:

Marks an imported GoogleSheet\_PUC record as rejected and stores an optional remark.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* Existing authorization: Action-level [JwtSessionFilter]

\* No explicit role restriction is implemented.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not specified.

\* Session dependency: None directly used.

\* Required Roles: None explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Imported student documents are incomplete."

}

Validation Rules:

\* id must be greater than 0.

\* Remark is optional.

\* Empty/whitespace Remark is stored as NULL.

\* No maximum Remark length is enforced.

\* No duplicate validation is implemented.

\* No explicit role check is implemented.

Business Logic Notes:

Updates GoogleSheet\_PUC:

Approve = 'Rejected'

Remarks = @Remarks

WHERE ImportID = @ImportID

Success Response (200):

{

"success": true,

"message": "Student rejected successfully."

}

Failure Responses:

400:

{

"success": false,

"message": "Invalid ImportID."

}

401:

May be generated by JwtSessionFilter.

403:

May be generated by JwtSessionFilter.

404:

{

"success": false,

"message": "Student not found."

}

500:

{

"success": false,

"message": "Unable to reject imported student."

}

409:

Not used.

Status Codes Used:

\* 200

\* 400

\* 404

\* 500

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

COMMON JWT / AUTHORIZATION DETAILS

=========================================================

JWT Authentication:

All 12 endpoints currently have:

[JwtSessionFilter]

The attribute is applied separately at action level.

Therefore:

\* JWT is currently required for all endpoints.

\* There is no controller-level [JwtSessionFilter].

\* No endpoint in the supplied controller is explicitly public.

Expected HTTP Header:

Authorization: Bearer <JWT\_TOKEN>

Important distinction:

The supplied controller does not show the implementation of JwtSessionFilter. Therefore, the following cannot be determined from this controller alone:

\* Exact JWT signing algorithm

\* Issuer

\* Audience

\* Token expiration rules

\* Exact JWT claim names

\* Whether Role itself is a JWT claim

\* Whether UserID is a JWT claim

\* Whether the filter directly validates roles

\* Exact 403 behavior of the filter

Session Dependency:

The following actions explicitly access Session:

1. GET /api/student-approval-grid/list

2. GET /api/student-approval-grid/import-grid

Both use:

HttpContext.Current.Session["UserID"]

Both also use:

HttpContext.Current.Session["UserRole"]

The controller therefore depends on the authentication/session mechanism to make these values available.

JWT Claims / Session Mapping:

| Claim / Identity | Type | Required | Usage |

|------------------|------|----------|-------|

| UserID | int | Yes for list/import-grid | Used to identify the authenticated user and filter Branch Executive data |

| UserRole | string | Yes for role-specific filtering | Determines whether Branch Executive district filtering is applied |

| EmployeeID | Not specified | Not specified | Not used by this controller |

Recommended conceptual mapping:

JWT UserID claim -> Session["UserID"]

JWT Role claim -> Session["UserRole"]

However, the actual mapping is not visible in the supplied controller and must be confirmed from JwtSessionFilter.

=========================================================

COMMON DTOS

=========================================================

DTO 1: RemarkRequest

Purpose:

Request DTO used by approve and reject endpoints to receive an optional remark.

Used By:

\* POST /api/student-approval-grid/approve/{id}

\* POST /api/student-approval-grid/reject/{id}

\* POST /api/student-approval-grid/import-grid/approve/{id}

\* POST /api/student-approval-grid/import-grid/reject/{id}

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Remark | string | No | Yes | Approval/rejection remark. Empty or whitespace values are stored as NULL. |

Sample Request:

{

"Remark": "Documents verified."

}

Empty Request:

{}

Null Request:

The controller permits request == null.

Validation:

No [Required] attribute or explicit maximum length is visible in the supplied controller.

=========================================================

DTO 2: StudentApprovalViewModel

=========================================================

Purpose:

Response DTO used by the main student approval grid.

Used By:

GET /api/student-approval-grid/list

The complete property declarations are not supplied, but the controller explicitly assigns the following properties.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Student identifier |

| StudentName | string | Not specified | Yes | Student name |

| DateOfBirth | DateTime? | No | Yes | Date of birth |

| GenderID | int | No | No | Gender identifier; defaults to 0 when database value is NULL |

| GenderName | string | No | Yes | Gender description |

| ContactNumber | string | No | Yes | Contact number |

| AlternateNumber | string | No | Yes | Alternate contact number |

| Email | string | No | Yes | Email address |

| Address | string | No | Yes | Address |

| AreaTypeName | string | No | Yes | Area type description |

| District | string | No | Yes | District name |

| OtherDistrict | string | No | Yes | Other district value |

| Taluka | string | No | Yes | Taluka |

| PinCode | string | No | Yes | PIN code |

| FatherName | string | No | Yes | Father's name |

| MotherName | string | No | Yes | Mother's name |

| FamilyIncome | decimal | No | No | Family income; defaults to 0 when NULL |

| FamilyMembers | int | No | No | Number of family members; defaults to 0 when NULL |

| FatherOccupation | string | No | Yes | Father's occupation |

| MotherOccupation | string | No | Yes | Mother's occupation |

| CategoryName | string | No | Yes | Caste/category description |

| HouseTypeName | string | No | Yes | House type description |

| MonthlyRent | string | No | Yes | Monthly rent |

| SourceName | string | No | Yes | Reference source |

| CourseName | string | No | Yes | Course description |

| CollegeName | string | No | Yes | College name |

| CollegeTypeName | string | No | Yes | College type description |

| ExpectedFees | decimal | No | No | Expected fees; defaults to 0 when NULL |

| SecuredPercentage | decimal | No | No | Secured percentage; defaults to 0 when NULL |

| TotalMarks | int | No | No | Total marks; defaults to 0 when NULL |

| Status | string | No | Yes | Student record status |

| ApprovalStatus | string | No | Yes | Approval status |

| StudentPhotoPath | string | No | Yes | Student photo path |

| SSLCMarksCardPath | string | No | Yes | SSLC marks card path |

| ElectricityBillPath | string | No | Yes | Electricity bill path |

| RationCardPath | string | No | Yes | Ration card path |

| IncomeCertificatePath | string | No | Yes | Income certificate path |

| FamilyPhotoPath | string | No | Yes | Family photo path |

| HouseVideoPath | string | No | Yes | House video path |

| HouseVisitLink | string | No | Yes | House visit link |

| Remark | string | No | Yes | Approval/rejection remark |

Note:

Requiredness above describes API/database mapping behavior visible in the controller, not necessarily model-level [Required] attributes. The actual StudentApprovalViewModel declaration was not supplied.

=========================================================

DTO 3: StudentViewModel

=========================================================

Purpose:

Response DTO used by the edit/get student endpoint.

Used By:

GET /api/student-approval-grid/edit/{id}

Properties populated by the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Student identifier |

| StudentName | string | No | Yes | Student name |

| DateOfBirth | DateTime? | No | Yes | Date of birth |

| GenderID | int | No | No | Gender ID; defaults to 0 when NULL |

| ContactNumber | string | No | Yes | Contact number |

| AlternateNumber | string | No | Yes | Alternate number |

| Email | string | No | Yes | Email address |

| Address | string | No | Yes | Residential address |

| AreaTypeID | int | No | No | Area type ID; defaults to 0 when NULL |

| DistrictID | int | No | No | District ID; defaults to 0 when NULL |

| Taluka | string | No | Yes | Taluka |

| PinCode | string | No | Yes | PIN code |

| StudentPhotoPath | string | No | Yes | Student photo path |

| SSLCMarksCardPath | string | No | Yes | SSLC marks card path |

| ElectricityBillPath | string | No | Yes | Electricity bill path |

| RationCardPath | string | No | Yes | Ration card path |

| IncomeCertificatePath | string | No | Yes | Income certificate path |

| FamilyPhotoPath | string | No | Yes | Family photo path |

| HouseVideoPath | string | No | Yes | House video path |

Important:

The controller executes SELECT \* but only maps the properties listed above. Any additional columns in New\_Students are not exposed through this action unless they are populated elsewhere by serialization/model behavior. Based strictly on the supplied code, only the listed properties are assigned.

=========================================================

DTO 4: PUCStudentImportGridViewModel

=========================================================

Purpose:

Response DTO representing imported records from GoogleSheet\_PUC.

Used By:

GET /api/student-approval-grid/import-grid

Properties populated by the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ImportID | int | No | No | Import record identifier |

| Timestamp | string | No | Yes | Original Excel timestamp |

| EmailAddress | string | No | Yes | Email address |

| StudentName | string | No | Yes | Student name |

| DateOfBirth | DateTime? | No | Yes | Parsed date of birth |

| ResidentialAddress | string | No | Yes | Residential address |

| Place | string | No | Yes | Place |

| District | string | No | Yes | District text |

| Taluka | string | No | Yes | Taluka |

| ContactNumber | string | No | Yes | Contact number |

| AlternateNumber | string | No | Yes | Alternate number |

| FatherName | string | No | Yes | Father's name |

| MotherName | string | No | Yes | Mother's name |

| FatherOccupation | string | No | Yes | Father's occupation |

| MotherOccupation | string | No | Yes | Mother's occupation |

| FamilyIncome | string | No | Yes | Family income |

| FamilyMembers | string | No | Yes | Family member count |

| Gender | string | No | Yes | Gender |

| CasteCategory | string | No | Yes | Caste/category |

| ReferenceSource | string | No | Yes | Scholarship reference source |

| HouseType | string | No | Yes | House type |

| MonthlyRent | string | No | Yes | Monthly rent |

| Course | string | No | Yes | Course |

| OtherCourse | string | No | Yes | Other course |

| CollegeName | string | No | Yes | College name |

| CollegeType | string | No | Yes | College type |

| ExpectedFees | string | No | Yes | Expected fees |

| SecuredPercentage | string | No | Yes | Secured percentage |

| TotalMarks | string | No | Yes | Total marks |

| SSLCMarksCardPath | string | No | Yes | SSLC marks card path |

| StudentPhotoPath | string | No | Yes | Student photo path |

| ElectricityBillPath | string | No | Yes | Electricity bill path |

| RationCardPath | string | No | Yes | Ration card path |

| IncomeCertificatePath | string | No | Yes | Income certificate path |

| FamilyPhotoPath | string | No | Yes | Family photo path |

| HouseVideoPath | string | No | Yes | House video path |

| ImportedDate | DateTime? | No | Yes | Date imported into database |

| Approve | string | No | Yes | Imported record approval state |

| Remarks | string | No | Yes | Approval/rejection remark |

Note:

The exact property declarations are not supplied. Types are inferred from how the controller assigns values.

=========================================================

DTO 5: DropdownItem

=========================================================

Purpose:

Common dropdown item used by gender, district, and area dropdown APIs.

Defined inside the controller.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Value | string | No | Yes | Identifier represented as a string |

| Text | string | No | Yes | Display name |

Sample:

{

"Value": "1",

"Text": "Male"

}

=========================================================

DROPDOWN API SUMMARY

=========================================================

1. Gender Dropdown

GET /api/student-approval-grid/genders

Authentication:

JWT Required.

Filtering:

Status = 1.

UserID filtering:

No.

EmployeeID filtering:

No.

Role filtering:

No.

Default "-- Select --":

Not added by API.

Response:

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Male"

},

{

"Value": "2",

"Text": "Female"

}

]

}

2. District Dropdown

GET /api/student-approval-grid/districts

Authentication:

JWT Required.

Filtering:

No Status filter.

UserID filtering:

No.

EmployeeID filtering:

No.

Role filtering:

No.

Default "-- Select --":

Not added by API.

Response:

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Belagavi"

}

]

}

3. Area Dropdown

GET /api/student-approval-grid/areas

Authentication:

JWT Required.

Filtering:

Status = 1.

UserID filtering:

No.

EmployeeID filtering:

No.

Role filtering:

No.

Default "-- Select --":

Not added by API.

Response:

{

"success": true,

"data": [

{

"Value": "1",

"Text": "Urban"

},

{

"Value": "2",

"Text": "Rural"

}

]

}

=========================================================

DATABASE BEHAVIOR SUMMARY

=========================================================

Main Student Grid:

SELECT operation from New\_Students with LEFT JOINs to master tables.

Primary filter:

ns.Status = 1

Additional Branch Executive filter:

ns.DistrictID IN

(

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

)

Approval:

UPDATE New\_Students

SET

ApprovalStatus = @ApprovalStatus,

Remark = @Remark

WHERE StudentID = @StudentID

Approval values:

Approved

Rejection values:

Rejected

Student Delete:

UPDATE New\_Students

SET Status = 0

WHERE StudentID = @StudentID

Delete Type:

Soft delete.

Imported Student Insert:

INSERT INTO dbo.GoogleSheet\_PUC (...)

ImportedDate:

GETDATE()

Imported Grid:

SELECT records from dbo.GoogleSheet\_PUC.

Branch Executive filter:

Matches mapped DistrictMaster.DistrictName to GoogleSheet\_PUC.District using trimmed strings.

Imported Approval:

UPDATE GoogleSheet\_PUC

SET

Approve = 'Approved',

Remarks = @Remarks

WHERE ImportID = @ImportID

Imported Rejection:

UPDATE GoogleSheet\_PUC

SET

Approve = 'Rejected',

Remarks = @Remarks

WHERE ImportID = @ImportID

=========================================================

PAGINATION / SEARCH / SORTING

=========================================================

Pagination:

Not implemented.

Page Number:

Not specified in controller.

Page Size:

Not specified in controller.

Search:

Not implemented.

Sorting:

Not implemented.

Date Filtering:

Not implemented.

Total Records:

The list endpoints return:

count

The value is the number of records loaded into the response list.

No separate database COUNT query is executed.

=========================================================

FILE UPLOAD SUMMARY

=========================================================

Only one endpoint accepts a file:

POST /api/student-approval-grid/import

Content-Type:

multipart/form-data

Multipart field:

file

Required:

Yes

Allowed extension:

.xlsx only

Maximum size:

Not specified in controller.

Multiple files:

Not intentionally supported. The controller processes only the first file returned by provider.FileData.

Temporary location:

~/App\_Data/\_TempApiExcelUploads

Permanent Excel storage:

No.

Cleanup:

The temporary file is deleted in the finally block.

Excel processing:

\* First worksheet only.

\* First row is treated as the header row.

\* Data starts at row 2.

\* "Name of the student" is mandatory.

\* Rows without a student name are skipped.

\* Individual row failures are collected and processing continues.

=========================================================

IMPORTANT VALIDATION / REQUIREDNESS SUMMARY

=========================================================

Required by controller:

Student Approval:

\* StudentID/path ID must be > 0.

\* Remark is optional.

Student Rejection:

\* StudentID/path ID must be > 0.

\* Remark is optional.

Student Delete:

\* StudentID/path ID must be > 0.

Edit Student:

\* StudentID/path ID must be > 0.

\* Student must exist.

Gender/District/Area:

\* No request fields.

Excel Import:

\* multipart/form-data required.

\* file field required.

\* file must have .xlsx extension.

\* workbook must not be empty.

\* "Name of the student" Excel header is required.

\* Student name must be non-empty for a row to be inserted.

Imported Approval:

\* ImportID must be > 0.

\* Remark is optional.

Imported Rejection:

\* ImportID must be > 0.

\* Remark is optional.

=========================================================

DEFAULT VALUES

=========================================================

Student Grid:

\* FamilyIncome -> 0 when database value is NULL.

\* FamilyMembers -> 0 when database value is NULL.

\* ExpectedFees -> 0 when database value is NULL.

\* SecuredPercentage -> 0 when database value is NULL.

\* TotalMarks -> 0 when database value is NULL.

\* GenderID -> 0 when database value is NULL.

Edit Student:

\* GenderID -> 0 when NULL.

\* AreaTypeID -> 0 when NULL.

\* DistrictID -> 0 when NULL.

Approval/Rejection:

\* Missing/empty Remark -> NULL.

Excel Import:

\* ImportedDate -> SQL Server GETDATE().

Imported Grid:

\* ImportID is assigned from database when not NULL.

\* Date fields are populated only when DateTime.TryParse succeeds.

\* String database values that are NULL are represented as empty strings by GetValue().

=========================================================

ERROR HANDLING SUMMARY

=========================================================

400 Bad Request:

Used for invalid IDs and invalid Excel upload requests.

401 Unauthorized:

Explicitly used by list and import-grid when Session["UserID"] is missing or invalid.

JwtSessionFilter may also return authentication-related 401 responses.

403 Forbidden:

Not explicitly returned in controller actions.

May be generated by JwtSessionFilter depending on its implementation.

404 Not Found:

Used when requested StudentID or ImportID does not update/find a record.

409 Conflict:

Not used anywhere in the supplied controller.

500 Internal Server Error:

Used for unexpected database, Excel, or application exceptions.

Error responses generally follow:

{

"success": false,

"message": "Error message"

}

=========================================================

COMPLETE ENDPOINT INVENTORY

=========================================================

| # | Method | Route | JWT | Role-Specific Logic |

|---|--------|-------|-----|---------------------|

| 1 | GET | /api/student-approval-grid/list | Required | Branch Executives filtered by UserID/District |

| 2 | POST | /api/student-approval-grid/approve/{id} | Required | No explicit role restriction |

| 3 | POST | /api/student-approval-grid/reject/{id} | Required | No explicit role restriction |

| 4 | POST | /api/student-approval-grid/delete/{id} | Required | No explicit role restriction |

| 5 | GET | /api/student-approval-grid/edit/{id} | Required | No explicit role restriction |

| 6 | GET | /api/student-approval-grid/genders | Required | No |

| 7 | GET | /api/student-approval-grid/districts | Required | No |

| 8 | GET | /api/student-approval-grid/areas | Required | No |

| 9 | POST | /api/student-approval-grid/import | Required | No explicit role restriction |

| 10 | GET | /api/student-approval-grid/import-grid | Required | Branch Executives filtered by UserID/District |

| 11 | POST | /api/student-approval-grid/import-grid/approve/{id} | Required | No explicit role restriction |

| 12 | POST | /api/student-approval-grid/import-grid/reject/{id} | Required | No explicit role restriction |

=========================================================

FINAL AUTHORIZATION CONCLUSION

=========================================================

Currently Implemented:

All endpoints explicitly contain [JwtSessionFilter] at ACTION LEVEL.

Therefore JWT authentication is required for all 12 endpoints in the supplied controller.

There is NO controller-level JWT filter.

Public Endpoints:

None are indicated by the supplied controller.

Branch Executive Authorization:

Only these endpoints contain explicit Branch Executive-specific business filtering:

1. GET /api/student-approval-grid/list

2. GET /api/student-approval-grid/import-grid

For these endpoints:

Session["UserRole"] is checked.

If the role equals "Branch Executives":

\* Session["UserID"] is required.

\* UserID is used to identify mapped districts.

\* Main student grid filters by DistrictID.

\* Imported student grid filters by DistrictName.

Other roles:

The controller does not explicitly restrict them to a specific role and does not apply the Branch Executive district filter.

JWT Claim Details:

The exact JWT claims cannot be conclusively documented because JwtSessionFilter implementation is not supplied.

However, the controller requires the authenticated identity to be available through:

Session["UserID"]

and:

Session["UserRole"]

for the two role-aware grid endpoints.

Recommended documentation statement:

"JWT authentication is currently implemented through the action-level JwtSessionFilter. The controller relies on session values populated by the authentication mechanism for UserID and UserRole. Exact JWT claim names and claim-to-session mapping are not specified in the supplied controller and must be confirmed from JwtSessionFilter."

=========================================================

FINAL QUALITY CHECK

=========================================================

\* All 12 controller endpoints are included.

\* HTTP methods match the controller.

\* Route prefix is /api/student-approval-grid.

\* JWT requirements are documented endpoint-by-endpoint.

\* JWT is not incorrectly applied as a controller-level filter.

\* All endpoints are marked JWT Required because every action contains [JwtSessionFilter].

\* No endpoint is incorrectly identified as public.

\* Branch Executive logic is documented only where it actually exists.

\* UserID Session dependency is documented for list and import-grid.

\* UserRole Session dependency is documented for list and import-grid.

\* Path parameters are documented.

\* Query parameters are documented.

\* Request bodies are documented.

\* Multipart file upload is documented.

\* Excel form field "file" is documented.

\* Excel mandatory header "Name of the student" is documented.

\* File extension validation is documented.

\* Maximum file size is explicitly marked as not specified.

\* Optional and required request fields are identified based on controller logic.

\* Approval and rejection behavior is documented.

\* Student deletion is correctly identified as a soft delete.

\* Pagination, search, sorting, and date filtering are correctly identified as not implemented.

\* Dropdown endpoints are documented with active/inactive behavior.

\* Gender and area dropdowns use Status = 1.

\* District dropdown has no Status filter.

\* Success responses are documented.

\* Failure responses are documented.

\* 400, 401, 403, 404, 409, and 500 behavior is distinguished between explicitly implemented and potentially filter-generated behavior.

\* Database tables and operations visible in the controller are documented.

\* ImportedDate GETDATE() behavior is documented.

\* Common DTOs referenced by the controller are documented.

\* No unsupported EmployeeID requirement has been invented.

\* Exact JWT claim names are not invented because JwtSessionFilter source was not supplied.

\* No controller-level JWT requirement has been invented.