=========================================================

RENEWAL PUC API CONTRACT

========================

API BASE ROUTE

==============

Route Prefix:

/api/renewalpuc

Application:

Vidya Poshak / Renewal PUC

Technology:

ASP.NET Web API 2 / .NET Framework

Authentication Overview:

JWT authentication is NOT applied at controller level.

Authentication is applied only to the following actions through the existing

[JwtSessionFilter] attribute:

1. GET /api/renewalpuc/list

2. POST /api/renewalpuc/approve/{id}

3. POST /api/renewalpuc/reject/{id}

4. POST /api/renewalpuc/delete/{id}

5. POST /api/renewalpuc/import

6. GET /api/renewalpuc/import-grid

7. POST /api/renewalpuc/import-grid/approve/{id}

8. POST /api/renewalpuc/import-grid/reject/{id}

The following endpoints are public because no JWT filter is present:

1. GET /api/renewalpuc/index

2. GET /api/renewalpuc/Getcreate

3. POST /api/renewalpuc/create

4. GET /api/renewalpuc/districts

IMPORTANT:

The controller uses HttpContext.Current.Session for authenticated endpoints.

The JwtSessionFilter is therefore expected to establish/populate session values

such as UserID/UserId and UserRole before the protected action executes.

No JWT claim names are directly read from the controller. The controller reads:

Session["UserID"]

Session["UserId"]

Session["UserRole"]

Therefore, the exact JWT-to-Session claim mapping is NOT specified in this

controller and depends on the implementation of JwtSessionFilter.

=========================================================

1. API HEALTH / INDEX

=====================

Endpoint:

GET /api/renewalpuc/index

Purpose:

Checks whether the Renewal PUC API is available and returns a simple success

message.

Content-Type:

No request body.

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Filter/Authorization Scope: None

\* Required Claims: None

\* Required Roles: None

\* Reason: No [JwtSessionFilter] or other authorization attribute is applied.

Path Parameters:

None

Query Parameters:

None

Request Body:

None

Validation Rules:

\* No input validation is implemented.

\* No database access is performed.

Business Logic Notes:

\* This is a public health/status endpoint.

\* It always returns the configured success response unless an infrastructure

level error occurs.

Success Response (200):

{

"success": true,

"message": "Renewal PUC API is working."

}

Failure Responses:

500 Internal Server Error:

Not explicitly handled by this action. Framework-level errors are possible,

but no controller-specific 500 response is implemented.

Status Codes Used:

\* 200 OK

=========================================================

2. GET CREATE / RENEWAL PUC FORM DATA

=====================================

Endpoint:

GET /api/renewalpuc/Getcreate

Purpose:

Loads the district list required by the Renewal PUC application form.

IMPORTANT:

Although the controller comment says:

GET: api/renewalpuc/create

the actual route attribute is:

[Route("Getcreate")]

Therefore the actual endpoint is:

GET /api/renewalpuc/Getcreate

Content-Type:

No request body.

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Filter/Authorization Scope: None

\* Required Claims: None

\* Required Roles: None

\* Reason: The action does not contain [JwtSessionFilter].

Path Parameters:

None

Query Parameters:

None

Request Body:

None

Validation Rules:

\* No request parameters are validated.

\* District data is loaded directly from DistrictMaster.

Business Logic Notes:

\* Calls the private GetDistricts() method.

\* Reads:

- DistrictID

- DistrictName

from DistrictMaster.

\* No active/inactive filtering is implemented.

\* No "-- Select --" item is added by the controller.

\* No UserID, EmployeeID, or Role filtering is applied.

\* No pagination or sorting is applied.

Database Behavior:

Table:

DistrictMaster

Operation:

SELECT

SQL behavior:

SELECT

DistrictID,

DistrictName

FROM DistrictMaster

Success Response (200):

{

"success": true,

"districts": [

{

"DistrictID": 1,

"DistrictName": "Dharwad"

},

{

"DistrictID": 2,

"DistrictName": "Belagavi"

}

]

}

Failure Responses:

500 Internal Server Error:

{

"success": false,

"message": "Unable to load Renewal PUC form data."

}

Occurs when an exception is raised while loading districts.

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

=========================================================

3. CREATE RENEWAL PUC APPLICATION

=================================

Endpoint:

POST /api/renewalpuc/create

Purpose:

Creates and stores a Renewal PUC application together with optional uploaded

documents/files.

Content-Type:

multipart/form-data

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Filter/Authorization Scope: None

\* Required Claims: None

\* Required Roles: None

\* Reason: The action does not contain [JwtSessionFilter].

\* This is intentionally public according to the supplied controller.

Path Parameters:

None

Query Parameters:

None

Request Body:

multipart/form-data

A. NORMAL FORM FIELDS

| Field | Type | Required | Nullable | Description |

|---|---|---:|---:|---|

| Email | string | Yes | No | Applicant email. Used for duplicate registration check. |

| ApplicantName | string | Yes | No | Applicant/student name. |

| VPID | string | No | Yes | Vidya Poshak ID. |

| WhatsApp | string | No | Yes | WhatsApp contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| District | integer | Yes | No | DistrictID. Must be parseable as an integer. |

| Taluk | string | No | Yes | Taluk name. |

| Address | string | No | Yes | Residential address. |

| CurrentAddress | string | No | Yes | Current address. |

| Gender | string | No | Yes | Gender value. No allowed values are enforced by controller. |

| DOB | date/date-time string | No | Yes | Date of birth. If supplied, must be parseable by DateTime.TryParse. |

| LatestResult | string | No | Yes | Latest result/semester result. |

| ScholarshipAmount | decimal | No | Yes | Scholarship amount. Invalid decimal values silently become 0. |

| DonorName | string | No | Yes | Donor name. |

| LettersCount | integer | No | Yes | Number of letters. Invalid integer values silently become 0. |

| Course | string | No | Yes | Course name. |

| CourseYear | string | No | Yes | Current course year. |

| CourseStream | string | No | Yes | Course stream. |

| CollegeName | string | No | Yes | College name. |

| CollegeContact | string | No | Yes | College contact number. |

| CollegeType | string | No | Yes | College type. |

| CollegeFees | decimal | No | Yes | College fees. Invalid decimal values silently become 0. |

| TotalExpenses | decimal | No | Yes | Total educational expenses. Invalid decimal values silently become 0. |

| Achievements | string | No | Yes | Student achievements. |

| InvitedToCamp | string | No | Yes | Camp invitation response/value. |

| AttendedCamp | string | No | Yes | Camp attendance response/value. |

| CampCount | string | No | Yes | Number of camps attended. Stored as string. |

| CampPlace | string | No | Yes | Camp location. |

| CampDate | date/date-time string | No | Yes | Camp date. If supplied, must be parseable by DateTime.TryParse. |

| VDSSAttended | string | No | Yes | VDSS attendance response/value. |

| VDSS\_Topics | string | No | Yes | VDSS topics. |

| AccountHolderName | string | No | Yes | Bank account holder name. |

| AccountNumber | string | No | Yes | Bank account number. |

| IFSC | string | No | Yes | IFSC code. |

| BankName | string | No | Yes | Bank name. |

| BranchName | string | No | Yes | Branch name. |

| ParentBankBalance | decimal | No | Yes | Parent bank balance. Invalid decimal values silently become 0. |

| HouseVisitLink | string | No | Yes | House visit link. |

| OtherDistrict | string | No | Yes | Other district value. Stored as NULL when blank. |

B. FILE UPLOAD FIELDS

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|---|---|---:|---|---|---|

| Marksheet | file | No | Not specified in controller | Not specified | Latest marksheet file. Saved with generated GUID filename. |

| ThankingLetter | file(s) | No | Not specified in controller | Not specified | Supports multiple files. Paths are joined with commas. |

| Passbook | file | No | Not specified in controller | Not specified | Student bank passbook. |

| Photo | file | No | Not specified in controller | Not specified | Student photo. |

| ThankingVideo | file | No | Not specified in controller | Not specified | Thanking video. |

| FeesReceiptPath | file | No | Not specified in controller | Not specified | Fees receipt file. |

| ThankingVolunteerLetterPath | file | No | Not specified in controller | Not specified | Thanking volunteer letter. |

File Validation:

\* The controller does NOT validate file extensions.

\* The controller does NOT define a maximum file size.

\* All listed files are optional according to the controller.

\* ThankingLetter supports multiple files.

\* The other file fields use FirstOrDefault and therefore only the first matching

file is saved.

\* Original filenames are NOT used as final storage filenames.

\* A GUID-based filename is generated.

\* The original extension is retained.

\* Files are stored under:

/Uploads/

\* Physical folder:

~/Uploads/

\* The database stores paths such as:

/Uploads/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.pdf

\* No existing-file replacement logic applies because this is a create endpoint.

\* No file is retained from an existing record.

\* Temporary multipart files are deleted after a successful database operation.

\* If an exception occurs before cleanup, temporary files may remain.

Validation Rules:

1. Request must be multipart/form-data.

If not:

{

"success": false,

"message": "Request must be multipart/form-data."

}

2. Email is required.

If blank:

{

"success": false,

"message": "Email is required."

}

3. ApplicantName is required.

If blank:

{

"success": false,

"message": "ApplicantName is required."

}

4. District is required in practical terms because the controller attempts to

parse it as an integer.

If invalid:

{

"success": false,

"message": "Invalid District."

}

5. DOB is optional.

If supplied but invalid:

{

"success": false,

"message": "Invalid DOB."

}

6. CampDate is optional.

If supplied but invalid:

{

"success": false,

"message": "Invalid CampDate."

}

7. Numeric fields:

\* ScholarshipAmount

\* LettersCount

\* CollegeFees

\* TotalExpenses

\* ParentBankBalance

Invalid numeric values are NOT rejected. The controller converts them to 0.

8. Email format is NOT validated using an email-validation rule. Only

non-empty validation and duplicate checking are performed.

9. No explicit maximum/minimum lengths are validated in the controller.

Parameter lengths passed to SQL commands are visible, but the controller

itself does not reject longer input before database execution.

10. Duplicate Email Check:

The controller executes:

SELECT COUNT(\*)

FROM RenewalPUC

WHERE LOWER(Email) = LOWER(@Email)

If the email already exists:

409 Conflict

{

"success": false,

"message": "This Email ID is already registered. Student can apply only once."

}

11. No explicit validation is performed for:

\* Gender

\* Course

\* CollegeType

\* IFSC

\* AccountNumber

\* WhatsApp

\* AlternateNumber

\* File presence

\* File extension

\* File size

\* HouseVisitLink

\* OtherDistrict

12. Database constraints may still cause an error if database-level

requirements are violated.

Business Logic Notes:

\* Upload folder is created automatically if it does not exist.

\* Temporary multipart upload folder is:

~/Uploads/\_TempApiUploads

\* CreatedDate is automatically set using GETDATE().

\* Status is automatically set to 1.

\* OtherDistrict is stored as NULL when blank.

\* ThankingLetter paths are stored as a comma-separated string.

\* File names are generated using:

Guid.NewGuid().ToString("N") + original extension.

\* No JWT/UserID/EmployeeID is stored with this application.

\* No authenticated-user ownership check is performed.

\* No transaction is explicitly used.

\* Database insert and file operations are not wrapped in a SQL transaction.

Database Behavior:

Table:

RenewalPUC

Operation:

INSERT

Important database fields include:

Email

ApplicantName

VPID

WhatsApp

AlternateNumber

District

Taluk

Address

CurrentAddress

Gender

DOB

LatestResult

ScholarshipAmount

DonorName

LettersCount

Course

CourseYear

CourseStream

CollegeName

CollegeContact

CollegeType

CollegeFees

TotalExpenses

Achievements

InvitedToCamp

AttendedCamp

CampCount

CampPlace

CampDate

VDSSAttended

VDSS\_Topics

AccountHolderName

AccountNumber

IFSC

BankName

BranchName

ParentBankBalance

MarksheetPath

ThankingLetterPath

PassbookPath

PhotoPath

ThankingVideoPath

FeesReceiptPath

CreatedDate

HouseVisitLink

Status

OtherDistrict

ThankingVolunteerLetterPath

Default values set by API:

CreatedDate = GETDATE()

Status = 1

Success Response (201):

{

"success": true,

"message": "PUC Renewal Form Submitted Successfully!"

}

Failure Responses:

400 Bad Request:

Used when:

\* Request is not multipart/form-data.

\* District is invalid.

\* DOB is invalid.

\* CampDate is invalid.

\* Email is missing.

\* ApplicantName is missing.

Example:

{

"success": false,

"message": "Email is required."

}

409 Conflict:

Used when the supplied email already exists in RenewalPUC.

{

"success": false,

"message": "This Email ID is already registered. Student can apply only once."

}

500 Internal Server Error:

Used for unexpected errors while uploading, saving files, querying the

database, or inserting the application.

{

"success": false,

"message": "An error occurred while submitting the Renewal PUC application."

}

Status Codes Used:

\* 201 Created

\* 400 Bad Request

\* 409 Conflict

\* 500 Internal Server Error

401/403/404:

Not used by this action in the controller.

=========================================================

4. GET DISTRICTS

================

Endpoint:

GET /api/renewalpuc/districts

Purpose:

Returns all districts from DistrictMaster for dropdown usage.

Content-Type:

No request body.

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Filter/Authorization Scope: None

\* Required Claims: None

\* Required Roles: None

\* Reason: No JwtSessionFilter is applied.

Path Parameters:

None

Query Parameters:

None

Request Body:

None

Validation Rules:

\* No request parameters.

\* No UserID/Role filtering.

\* No active/inactive filtering.

Business Logic Notes:

\* Calls GetDistricts().

\* Returns the number of districts in "count".

\* Does not add a "-- Select --" item.

\* Does not paginate or sort.

Database Behavior:

Table:

DistrictMaster

Operation:

SELECT DistrictID, DistrictName

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"DistrictID": 1,

"DistrictName": "Dharwad"

},

{

"DistrictID": 2,

"DistrictName": "Belagavi"

}

]

}

Failure Response:

500 Internal Server Error:

{

"success": false,

"message": "Unable to load districts."

}

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

=========================================================

5. RENEWAL PUC GRID

===================

Endpoint:

GET /api/renewalpuc/list

Purpose:

Returns active Renewal PUC applications from RenewalPUC.

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute:

[JwtSessionFilter]

\* Required Claims: Not directly specified in controller.

\* Required Roles: No exclusive role is required for access.

\* Special role behavior:

Users whose Session["UserRole"] equals "Branch Executives" receive

district-restricted results.

\* Session dependencies:

Session["UserID"] or Session["UserId"]

Session["UserRole"]

UserID Validation:

The action calls TryGetSessionUserId().

It first checks:

Session["UserID"]

If unavailable, it checks:

Session["UserId"]

If neither exists or the value cannot be parsed as an integer:

401 Unauthorized

Therefore the authenticated JWT/filter processing must result in a usable

UserID/UserId session value for this endpoint.

Path Parameters:

None

Query Parameters:

None

Request Body:

None

Pagination:

Not implemented.

Search:

Not implemented.

Filtering:

The base query filters:

WHERE r.Status = 1

Branch Executives receive an additional district mapping filter.

Sorting:

Not implemented.

Validation Rules:

\* Authentication filter must execute.

\* Session UserID/UserId must exist and be an integer.

\* Active records are limited to Status = 1.

Role-Based Business Logic:

If:

Session["UserRole"] == "Branch Executives"

then records are restricted to districts where:

BranchExecutiveDistrictMapping.UserId = authenticated UserID

AND

BranchExecutiveDistrictMapping.DistrictID = RenewalPUC.District

Other roles do not receive this additional district filter in the controller.

Required Role:

No single role is required.

Special Role:

"Branch Executives"

Business Logic Notes:

\* JWT itself is not read directly by this action.

\* JwtSessionFilter is responsible for authentication/session setup.

\* UserID is taken from Session, not directly from JWT claims.

\* Branch Executive filtering is performed using UserID.

\* Only RenewalPUC records with Status = 1 are returned.

\* DistrictName is retrieved using DistrictMaster.

\* No pagination is applied.

\* No explicit sorting is applied.

Database Behavior:

Tables:

RenewalPUC

DistrictMaster

BranchExecutiveDistrictMapping

Base query:

SELECT r.\*, dm.DistrictName

FROM RenewalPUC r

INNER JOIN DistrictMaster dm

ON r.District = dm.DistrictID

WHERE r.Status = 1

Branch Executive restriction:

EXISTS

(

SELECT 1

FROM BranchExecutiveDistrictMapping bedm

WHERE bedm.DistrictID = r.District

AND bedm.UserId = @UserId

)

Response Structure:

{

"success": true,

"count": 1,

"data": [

{

"Id": 1,

"ApplicantName": "Student Name",

"Email": "student@example.com",

"VPID": "VP12345",

"WhatsApp": "9876543210",

"AlternateNumber": "9123456780",

"District": 1,

"DistrictName": "Dharwad",

"OtherDistrict": null,

"Taluk": "Dharwad",

"Address": "Student Address",

"CurrentAddress": "Current Address",

"Gender": "Male",

"DOB": "2005-01-15T00:00:00",

"LatestResult": "85%",

"ScholarshipAmount": 25000.00,

"DonorName": "Donor Name",

"LettersCount": 2,

"Course": "B.Com",

"CourseYear": "2nd Year",

"CourseStream": "Commerce",

"CollegeName": "College Name",

"CollegeContact": "9876543210",

"CollegeType": "Degree",

"CollegeFees": 30000.00,

"TotalExpenses": 50000.00,

"Achievements": "Achievement details",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"CampCount": "2",

"CampPlace": "Dharwad",

"CampDate": "2026-06-15T00:00:00",

"VDSSAttended": "Yes",

"VDSS\_Topics": "Communication, Leadership",

"AccountHolderName": "Student Name",

"AccountNumber": "1234567890",

"IFSC": "SBIN0001234",

"BankName": "State Bank",

"BranchName": "Dharwad",

"ParentBankBalance": 5000.00,

"MarksheetPath": "/Uploads/marksheet.pdf",

"ThankingLetterPath": "/Uploads/letter1.pdf,/Uploads/letter2.pdf",

"ThankingVolunteerLetterPath": "/Uploads/volunteer.pdf",

"PassbookPath": "/Uploads/passbook.pdf",

"PhotoPath": "/Uploads/photo.jpg",

"FeesReceiptPath": "/Uploads/fees.pdf",

"ThankingVideoPath": "/Uploads/video.mp4",

"Remark": "Approved",

"ApproveStatus": "Approved"

}

]

}

Field Notes:

\* District is returned as integer DistrictID.

\* DistrictName is returned separately.

\* DOB and CampDate are nullable DateTime values.

\* Numeric decimal fields are returned as decimal values.

\* Remark and ApproveStatus are read from RenewalPUC.

Failure Responses:

401 Unauthorized:

Occurs when Session["UserID"] and Session["UserId"] are both missing or

cannot be converted to an integer.

{

"success": false,

"message": "Authenticated UserID was not found."

}

403 Forbidden:

Not explicitly returned by the controller. If JwtSessionFilter implements

role/authorization denial, it may return 403, but that behavior is not

specified in this controller.

500 Internal Server Error:

{

"success": false,

"message": "Unable to load Renewal PUC students."

}

Status Codes Used / Applicable:

\* 200 OK

\* 401 Unauthorized

\* 403 Forbidden if enforced by JwtSessionFilter

\* 500 Internal Server Error

=========================================================

6. APPROVE RENEWAL PUC STUDENT

==============================

Endpoint:

POST /api/renewalpuc/approve/{id}

Purpose:

Approves a Renewal PUC application and stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: Not explicitly specified.

\* UserID is not directly used by the action.

\* Session values are not directly accessed by this action.

Path Parameters:

| Name | Type | Required | Description |

|---|---|---:|---|

| id | integer | Yes | RenewalPUC record Id. Must be greater than 0. |

Query Parameters:

None

Request Body:

{

"Remark": "Documents verified and approved."

}

Request Body DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark may be null/empty.

\* No maximum remark length is validated by controller.

\* No explicit role validation exists in the action.

\* Actual authentication is handled by JwtSessionFilter.

Business Logic:

Calls:

UpdateStatus(id, "Approved", request.Remark)

Database operation:

UPDATE RenewalPUC

SET

ApproveStatus = 'Approved',

Remark = @Remark

WHERE Id = @Id

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

"message": "Student not found."

}

Occurs when the UPDATE affects zero rows.

401 Unauthorized:

May be returned by JwtSessionFilter when authentication fails.

403 Forbidden:

Not explicitly returned by the action. May be returned by JwtSessionFilter

if that filter implements role restrictions.

500 Internal Server Error:

{

"success": false,

"message": "Unable to approve student."

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

7. REJECT RENEWAL PUC STUDENT

=============================

Endpoint:

POST /api/renewalpuc/reject/{id}

Purpose:

Rejects a Renewal PUC application and stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: Not explicitly specified.

\* UserID is not directly accessed by the action.

\* Session values are not directly accessed by the action.

Path Parameters:

| Name | Type | Required | Description |

|---|---|---:|---|

| id | integer | Yes | RenewalPUC record Id. Must be greater than 0. |

Query Parameters:

None

Request Body:

{

"Remark": "Required documents are incomplete."

}

Request Body DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark is optional.

\* No explicit remark length validation.

\* Authentication is delegated to JwtSessionFilter.

\* No explicit role validation in this action.

Business Logic:

Calls:

UpdateStatus(id, "Rejected", request.Remark)

Database operation:

UPDATE RenewalPUC

SET

ApproveStatus = 'Rejected',

Remark = @Remark

WHERE Id = @Id

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

"message": "Student not found."

}

401 Unauthorized:

May be returned by JwtSessionFilter if authentication fails.

403 Forbidden:

Not explicitly returned by the action. May be returned by JwtSessionFilter

if it implements role restrictions.

500 Internal Server Error:

{

"success": false,

"message": "Unable to reject student."

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

8. DELETE RENEWAL PUC STUDENT

=============================

Endpoint:

POST /api/renewalpuc/delete/{id}

Purpose:

Performs a soft delete of a Renewal PUC record.

Content-Type:

No request body.

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: Not explicitly specified.

\* UserID is not used by the action.

\* Session values are not directly accessed by the action.

Path Parameters:

| Name | Type | Required | Description |

|---|---|---:|---|

| id | integer | Yes | RenewalPUC record Id. Must be greater than 0. |

Query Parameters:

None

Request Body:

None

Validation Rules:

\* id must be greater than 0.

\* No dependency check is implemented.

\* No confirmation parameter is required.

\* No role validation is implemented directly.

Business Logic Notes:

This is NOT a hard delete.

The controller executes:

UPDATE RenewalPUC

SET Status = 0

WHERE Id = @Id

Therefore:

Status = 0 means the record is soft-deleted/inactive.

The RenewalPUC grid only selects:

WHERE r.Status = 1

Therefore a deleted record will no longer appear in the main Renewal PUC grid.

Success Response (200):

{

"success": true,

"message": "Renewal PUC deleted successfully."

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

"message": "Student not found."

}

401 Unauthorized:

May be returned by JwtSessionFilter.

403 Forbidden:

Not explicitly implemented by action; may be returned by JwtSessionFilter.

500 Internal Server Error:

{

"success": false,

"message": "Unable to delete student."

}

Database Behavior:

Table:

RenewalPUC

Operation:

UPDATE

No DELETE statement is executed.

Status is changed from its current value to 0.

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

9. IMPORT RENEWAL PUC STUDENTS FROM EXCEL

==========================================

Endpoint:

POST /api/renewalpuc/import

Purpose:

Uploads an Excel workbook and imports each spreadsheet row into

GoogleSheet\_VP\_Renewal.

Content-Type:

multipart/form-data

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: No explicit role is checked by this action.

\* UserID is not read directly by this action.

\* Session values are not directly accessed by this action.

Form Data:

| Field | Type | Required | Description |

|---|---|---:|---|

| file | file | Yes | Excel workbook to import. |

File Upload:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|---|---|---:|---|---|---|

| file | file | Yes | .xlsx, .xlsm | Not specified | Excel workbook. First uploaded file is selected. |

File Validation:

\* Request must be multipart/form-data.

\* At least one file is required.

\* Only .xlsx and .xlsm extensions are accepted.

\* Maximum file size is NOT specified in the controller.

\* Only the first uploaded file is processed.

\* The controller uses ClosedXML.XLWorkbook.

\* First worksheet only is processed.

\* The workbook must contain at least one used row.

\* Header validation is NOT performed.

\* Column names are NOT checked.

\* Import is position-based using Excel column numbers.

Excel Data Mapping:

| Excel Column | Field |

|---:|---|

| 1 | Timestamp |

| 2 | EmailAddress |

| 3 | ApplicantName |

| 4 | VPIDNumber |

| 5 | WhatsAppNumber |

| 6 | AlternateNumber |

| 7 | District |

| 8 | Taluk |

| 9 | ResidentialAddress |

| 10 | Gender |

| 11 | DateOfBirth |

| 12 | LatestResultSemesterResult |

| 13 | TotalScholarshipReceivedLastYear |

| 14 | LastYearDonorName |

| 15 | LettersWrittenToDonorLastYear |

| 16 | CourseStudyingApplying |

| 17 | CurrentCourseYear |

| 18 | CourseStream |

| 19 | CollegeName |

| 20 | CollegeContactNumber |

| 21 | CollegeType |

| 22 | ExpectedCollegeFees |

| 23 | TotalEducationalExpenses |

| 24 | Achievements |

| 25 | InvitedToCamp |

| 26 | AttendedCamp |

| 27 | NumberOfCampsAttended |

| 28 | CampPlace |

| 29 | CampDate |

| 30 | AttendedVDSSSession |

| 31 | VDSSSessionTopics |

| 32 | AccountHolderName |

| 33 | BankAccountNumber |

| 34 | IFSCCode |

| 35 | BankName |

| 36 | BranchName |

| 37 | ParentsBankBalance |

| 38 | LatestMarksheetPath |

| 39 | ThankingLetterDonorPath |

| 40 | ThankingLetterVolunteerPath |

| 41 | StudentBankPassbookPath |

Import Row Logic:

\* Processing begins at row 2.

\* Row 1 is assumed to be the header.

\* If both ApplicantName and EmailAddress are blank, the row is skipped.

\* Each row is inserted independently.

\* A failure in one row does not stop processing of subsequent rows.

\* failedCount is incremented when a row throws an exception.

\* The exception message is stored in the errors array.

\* insertedCount is incremented when ExecuteNonQuery() returns greater than 0.

\* No SQL transaction is used.

\* The controller does not perform duplicate-email checking during import.

\* The controller does not validate email format.

\* No required-field validation is performed for individual import fields.

\* Excel values are read as formatted strings.

\* All imported database parameters are sent as NVARCHAR.

\* The controller does not parse imported numeric/date values before insertion.

\* Database schema determines whether the string values are accepted.

Business Logic Notes:

\* Database name is retrieved using:

SELECT DB\_NAME()

\* The database name is included in the API response.

\* A temporary folder is created under:

Path.GetTempPath() + "RenewalPUCExcelImport"

\* Temporary import file cleanup is NOT explicitly performed in this action.

\* The controller imports into GoogleSheet\_VP\_Renewal.

\* No ImportedDate value is explicitly inserted by this controller.

\* No Approve value is explicitly inserted by this controller.

\* No Remarks value is explicitly inserted by this controller.

\* Those fields therefore depend on database defaults/triggers if they exist.

\* No district-based restriction is applied during import itself.

\* No authenticated UserID is stored with the imported record.

Database Behavior:

Table:

GoogleSheet\_VP\_Renewal

Operation:

INSERT

Success Response (200):

{

"success": true,

"database": "ENVISAGE",

"insertedCount": 10,

"failedCount": 2,

"message": "Database: ENVISAGE | Inserted: 10 | Failed: 2",

"errors": [

"Row 5 | String or binary data would be truncated.",

"Row 8 | Conversion failed when converting..."

]

}

Important:

The success property is:

insertedCount > 0

Therefore if at least one row succeeds, success=true even when other rows fail.

If zero rows are inserted, success=false.

Empty Excel:

If LastRowUsed() is null:

400 Bad Request

{

"success": false,

"message": "Excel file is empty."

}

Invalid Content-Type:

400 Bad Request

{

"success": false,

"message": "Request must be multipart/form-data."

}

No file:

400 Bad Request

{

"success": false,

"message": "Excel file is required."

}

Invalid extension:

400 Bad Request

{

"success": false,

"message": "Only .xlsx or .xlsm Excel files are allowed."

}

500 Internal Server Error:

{

"success": false,

"message": "An error occurred while importing the Excel file.",

"insertedCount": 0,

"failedCount": 0,

"errors": []

}

401 Unauthorized:

May be returned by JwtSessionFilter.

403 Forbidden:

Not explicitly implemented by action. May be returned by JwtSessionFilter.

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 500 Internal Server Error

=========================================================

10. GET IMPORTED RENEWAL PUC GRID

=================================

Endpoint:

GET /api/renewalpuc/import-grid

Purpose:

Returns records imported into GoogleSheet\_VP\_Renewal.

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: No exclusive role is required.

\* Special role: "Branch Executives"

\* Session values required:

Session["UserID"] or Session["UserId"]

Session["UserRole"]

UserID Requirement:

If both UserID and UserId session values are unavailable or invalid:

401 Unauthorized

{

"success": false,

"message": "Authenticated UserID was not found."

}

Role-Based Filtering:

If:

Session["UserRole"] == "Branch Executives"

then only imported records whose District value matches a district assigned to

the authenticated UserID are returned.

The mapping is:

BranchExecutiveDistrictMapping

INNER JOIN DistrictMaster

Comparison:

LTRIM(RTRIM(dm.DistrictName))

=

LTRIM(RTRIM(gp.District))

Path Parameters:

None

Query Parameters:

None

Request Body:

None

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filtering:

Not implemented.

Validation Rules:

\* JWT/session authentication required.

\* UserID/UserId must be available and parseable as integer.

\* No other request input validation.

Business Logic Notes:

\* Non-Branch-Executive users receive all rows returned by the query.

\* Branch Executives are restricted by district.

\* District matching is string-based, not DistrictID-based.

\* LTRIM/RTRIM are used on both values.

\* No active/inactive filter is applied.

\* No pagination is implemented.

Database Behavior:

Table:

GoogleSheet\_VP\_Renewal

Additional tables for Branch Executive filtering:

BranchExecutiveDistrictMapping

DistrictMaster

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ImportID": 1,

"Timestamp": "2026-08-28 10:00:00",

"EmailAddress": "student@example.com",

"ApplicantName": "Student Name",

"VPIDNumber": "VP12345",

"WhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"District": "Dharwad",

"Taluk": "Dharwad",

"ResidentialAddress": "Address",

"Gender": "Female",

"DateOfBirth": "2005-01-01",

"LatestResultSemesterResult": "85%",

"TotalScholarshipReceivedLastYear": "25000",

"LastYearDonorName": "Donor Name",

"LettersWrittenToDonorLastYear": "2",

"CourseStudyingApplying": "B.Com",

"CurrentCourseYear": "2nd Year",

"CourseStream": "Commerce",

"CollegeName": "College Name",

"CollegeContactNumber": "9876543210",

"CollegeType": "Degree",

"ExpectedCollegeFees": "30000",

"TotalEducationalExpenses": "50000",

"Achievements": "Achievement details",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"NumberOfCampsAttended": "2",

"CampPlace": "Dharwad",

"CampDate": "2026-06-15",

"AttendedVDSSSession": "Yes",

"VDSSSessionTopics": "Leadership",

"AccountHolderName": "Student Name",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0001234",

"BankName": "State Bank",

"BranchName": "Dharwad",

"ParentsBankBalance": "5000",

"LatestMarksheetPath": "/Uploads/marksheet.pdf",

"ThankingLetterDonorPath": "/Uploads/donor-letter.pdf",

"ThankingLetterVolunteerPath": "/Uploads/volunteer-letter.pdf",

"StudentBankPassbookPath": "/Uploads/passbook.pdf",

"ImportedDate": "2026-08-28T10:30:00",

"Approve": "Approved",

"Remarks": "Verified"

}

]

}

Failure Responses:

401 Unauthorized:

{

"success": false,

"message": "Authenticated UserID was not found."

}

403 Forbidden:

Not explicitly returned by action; may be generated by JwtSessionFilter.

500 Internal Server Error:

{

"success": false,

"message": "Unable to load imported Renewal PUC students."

}

Status Codes Used / Applicable:

\* 200 OK

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 500 Internal Server Error

=========================================================

11. APPROVE IMPORTED STUDENT

============================

Endpoint:

POST /api/renewalpuc/import-grid/approve/{id}

Purpose:

Sets the Approve value of an imported Renewal PUC record to "Approved" and

stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: Not explicitly specified.

\* UserID is not directly used by the action.

\* Session values are not directly accessed by the action.

Path Parameters:

| Name | Type | Required | Description |

|---|---|---:|---|

| id | integer | Yes | GoogleSheet\_VP\_Renewal.ImportID. Must be greater than 0. |

Query Parameters:

None

Request Body:

{

"Remark": "Imported student verified and approved."

}

Request Body DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark may be null or blank.

\* Blank/null remark is stored as SQL NULL.

\* No explicit maximum remark length is validated.

\* No explicit role validation is implemented.

Business Logic:

UPDATE GoogleSheet\_VP\_Renewal

SET

Approve = 'Approved',

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

"message": "Invalid ImportID."

}

404 Not Found:

{

"success": false,

"message": "Student not found."

}

401 Unauthorized:

May be returned by JwtSessionFilter.

403 Forbidden:

Not explicitly implemented by the action; may be returned by JwtSessionFilter.

500 Internal Server Error:

{

"success": false,

"message": "Unable to approve imported student."

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

12. REJECT IMPORTED STUDENT

===========================

Endpoint:

POST /api/renewalpuc/import-grid/reject/{id}

Purpose:

Sets the Approve value of an imported Renewal PUC record to "Rejected" and

stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing attribute: [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: Not explicitly specified.

\* UserID is not directly used by the action.

\* Session values are not directly accessed by the action.

Path Parameters:

| Name | Type | Required | Description |

|---|---|---:|---|

| id | integer | Yes | GoogleSheet\_VP\_Renewal.ImportID. Must be greater than 0. |

Query Parameters:

None

Request Body:

{

"Remark": "Required information is missing."

}

Request Body DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* Request body may be null.

\* Remark may be null or blank.

\* Blank/null remark is stored as SQL NULL.

\* No explicit maximum remark length is validated.

\* No explicit role validation is implemented.

Business Logic:

UPDATE GoogleSheet\_VP\_Renewal

SET

Approve = 'Rejected',

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

"message": "Invalid ImportID."

}

404 Not Found:

{

"success": false,

"message": "Student not found."

}

401 Unauthorized:

May be returned by JwtSessionFilter.

403 Forbidden:

Not explicitly implemented by action; may be returned by JwtSessionFilter.

500 Internal Server Error:

{

"success": false,

"message": "Unable to reject imported student."

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden if filter enforces it

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

COMMON DTOs

==========

IMPORTANT:

The controller references the following models:

\* RenewalPUC

\* VPRenewalStudentImportGridModel

\* RemarkRequest

\* DistrictApiModel

Only RemarkRequest and DistrictApiModel are defined in the supplied controller.

The complete class definitions of RenewalPUC and

VPRenewalStudentImportGridModel were NOT supplied.

Therefore, their complete data annotations, nullable/reference-type

configuration, validation attributes, and exact property types cannot be

determined beyond how the controller uses them.

The properties below are the properties directly accessed by the controller.

=========================================================

DTO 1: RemarkRequest

====================

Purpose:

Request DTO used when approving or rejecting Renewal PUC records.

Properties:

| Property | Type | Required | Nullable | Description |

|---|---|---:|---:|---|

| Remark | string | No | Yes | Approval/rejection remark. |

Sample Request:

{

"Remark": "Documents verified."

}

Notes:

\* The controller allows request to be null.

\* Remark may also be null/blank.

\* No [Required] attribute is shown.

\* No maximum length is specified by the DTO in the supplied controller.

=========================================================

DTO 2: DistrictApiModel

=======================

Purpose:

Represents a district returned by the public district dropdown endpoints.

Properties:

| Property | Type | Required | Nullable | Description |

|---|---|---:|---:|---|

| DistrictID | int | Yes | No | District identifier. |

| DistrictName | string | No | Yes | District name. |

Sample Response Item:

{

"DistrictID": 1,

"DistrictName": "Dharwad"

}

Sample Dropdown Response:

{

"success": true,

"count": 2,

"data": [

{

"DistrictID": 1,

"DistrictName": "Dharwad"

},

{

"DistrictID": 2,

"DistrictName": "Belagavi"

}

]

}

Dropdown Rules:

\* Public.

\* No JWT required.

\* No UserID filtering.

\* No EmployeeID filtering.

\* No Role filtering.

\* No active/inactive filtering.

\* No default "-- Select --" option is added by the API.

\* No pagination.

\* No sorting is explicitly defined.

=========================================================

DTO 3: RenewalPUC

=================

Purpose:

Main Renewal PUC application model used for creating and returning Renewal

PUC records.

Exact DTO declaration was not included in the supplied controller.

The following properties are directly accessed by the controller.

Properties:

| Property | Type Used by Controller | Required | Nullable | Description |

|---|---|---:|---:|---|

| Id | int | No | No | RenewalPUC database ID. |

| Email | string | Yes for Create | Yes in model usage | Applicant email. |

| ApplicantName | string | Yes for Create | Yes in model usage | Applicant/student name. |

| VPID | string | No | Yes | Vidya Poshak ID. |

| WhatsApp | string | No | Yes | WhatsApp number. |

| AlternateNumber | string | No | Yes | Alternate number. |

| District | int | Yes for Create | No | DistrictID. |

| DistrictName | string | Response only | Yes | District name joined from DistrictMaster. |

| OtherDistrict | string | No | Yes | Other district. |

| Taluk | string | No | Yes | Taluk. |

| Address | string | No | Yes | Address. |

| CurrentAddress | string | No | Yes | Current address. |

| Gender | string | No | Yes | Gender. |

| DOB | DateTime? | No | Yes | Date of birth. |

| LatestResult | string | No | Yes | Latest result. |

| ScholarshipAmount | decimal | No | No | Scholarship amount; invalid input becomes 0. |

| DonorName | string | No | Yes | Donor name. |

| LettersCount | int | No | No | Number of letters; invalid input becomes 0. |

| Course | string | No | Yes | Course. |

| CourseYear | string | No | Yes | Course year. |

| CourseStream | string | No | Yes | Course stream. |

| CollegeName | string | No | Yes | College name. |

| CollegeContact | string | No | Yes | College contact. |

| CollegeType | string | No | Yes | College type. |

| CollegeFees | decimal | No | No | College fees; invalid input becomes 0. |

| TotalExpenses | decimal | No | No | Total expenses; invalid input becomes 0. |

| Achievements | string | No | Yes | Achievements. |

| InvitedToCamp | string | No | Yes | Camp invitation value. |

| AttendedCamp | string | No | Yes | Camp attendance value. |

| CampCount | string | No | Yes | Camp count. |

| CampPlace | string | No | Yes | Camp place. |

| CampDate | DateTime? | No | Yes | Camp date. |

| VDSSAttended | string | No | Yes | VDSS attendance. |

| VDSS\_Topics | string | No | Yes | VDSS topics. |

| AccountHolderName | string | No | Yes | Bank account holder. |

| AccountNumber | string | No | Yes | Bank account number. |

| IFSC | string | No | Yes | IFSC code. |

| BankName | string | No | Yes | Bank name. |

| BranchName | string | No | Yes | Bank branch. |

| ParentBankBalance | decimal | No | No | Parent bank balance; invalid input becomes 0. |

| MarksheetPath | string | No | Yes | Stored marksheet path. |

| ThankingLetterPath | string | No | Yes | Comma-separated thanking letter paths. |

| PassbookPath | string | No | Yes | Passbook path. |

| PhotoPath | string | No | Yes | Photo path. |

| ThankingVideoPath | string | No | Yes | Thanking video path. |

| FeesReceiptPath | string | No | Yes | Fees receipt path. |

| ThankingVolunteerLetterPath | string | No | Yes | Volunteer thanking letter path. |

| HouseVisitLink | string | No | Yes | House visit link. |

| Remark | string | Response only | Yes | Approval/rejection remark. |

| ApproveStatus | string | Response only | Yes | Approval status. |

Important:

The actual C# property declarations and any [Required], [StringLength],

[Range], [EmailAddress], or other validation attributes are not present in

the supplied controller.

Therefore the Required values above are based on controller behavior, not on

unseen DTO annotations.

=========================================================

DTO 4: VPRenewalStudentImportGridModel

======================================

Purpose:

Response model used by:

GET /api/renewalpuc/import-grid

The exact class declaration was not supplied. The following fields are

directly populated by the controller.

Properties:

| Property | Type Used by Controller | Required | Nullable | Description |

|---|---|---:|---:|---|

| ImportID | int | Yes | No | Imported record ID. |

| Timestamp | string | No | Yes | Imported spreadsheet timestamp. |

| EmailAddress | string | No | Yes | Applicant email. |

| ApplicantName | string | No | Yes | Applicant name. |

| VPIDNumber | string | No | Yes | VP ID. |

| WhatsAppNumber | string | No | Yes | WhatsApp number. |

| AlternateNumber | string | No | Yes | Alternate number. |

| District | string | No | Yes | District text from imported spreadsheet. |

| Taluk | string | No | Yes | Taluk. |

| ResidentialAddress | string | No | Yes | Residential address. |

| Gender | string | No | Yes | Gender. |

| DateOfBirth | string | No | Yes | Date of birth as imported text. |

| LatestResultSemesterResult | string | No | Yes | Latest result. |

| TotalScholarshipReceivedLastYear | string | No | Yes | Previous scholarship amount. |

| LastYearDonorName | string | No | Yes | Previous donor name. |

| LettersWrittenToDonorLastYear | string | No | Yes | Number of letters. |

| CourseStudyingApplying | string | No | Yes | Course. |

| CurrentCourseYear | string | No | Yes | Current course year. |

| CourseStream | string | No | Yes | Stream. |

| CollegeName | string | No | Yes | College. |

| CollegeContactNumber | string | No | Yes | College contact. |

| CollegeType | string | No | Yes | College type. |

| ExpectedCollegeFees | string | No | Yes | Expected fees. |

| TotalEducationalExpenses | string | No | Yes | Total expenses. |

| Achievements | string | No | Yes | Achievements. |

| InvitedToCamp | string | No | Yes | Camp invitation. |

| AttendedCamp | string | No | Yes | Camp attendance. |

| NumberOfCampsAttended | string | No | Yes | Number of camps. |

| CampPlace | string | No | Yes | Camp place. |

| CampDate | string | No | Yes | Camp date. |

| AttendedVDSSSession | string | No | Yes | VDSS attendance. |

| VDSSSessionTopics | string | No | Yes | VDSS topics. |

| AccountHolderName | string | No | Yes | Bank account holder. |

| BankAccountNumber | string | No | Yes | Bank account number. |

| IFSCCode | string | No | Yes | IFSC. |

| BankName | string | No | Yes | Bank name. |

| BranchName | string | No | Yes | Bank branch. |

| ParentsBankBalance | string | No | Yes | Parents' bank balance. |

| LatestMarksheetPath | string | No | Yes | Marksheet path. |

| ThankingLetterDonorPath | string | No | Yes | Donor thanking letter path. |

| ThankingLetterVolunteerPath | string | No | Yes | Volunteer thanking letter path. |

| StudentBankPassbookPath | string | No | Yes | Passbook path. |

| ImportedDate | DateTime | No | Yes | Imported date when database value is not NULL. |

| Approve | string | No | Yes | Approval status. |

| Remarks | string | No | Yes | Approval/rejection remarks. |

Important:

Exact nullability and attributes of this DTO are not specified because its

class declaration was not supplied.

=========================================================

DATABASE TABLES USED

====================

1. RenewalPUC

Operations performed:

\* SELECT

\* INSERT

\* UPDATE

Used by:

\* CreateRenewal

\* RenewalPUCGrid

\* ApproveStudent

\* RejectStudent

\* DeleteStudent

Important fields visible in controller:

Email

ApplicantName

VPID

WhatsApp

AlternateNumber

District

Taluk

Address

CurrentAddress

Gender

DOB

LatestResult

ScholarshipAmount

DonorName

LettersCount

Course

CourseYear

CourseStream

CollegeName

CollegeContact

CollegeType

CollegeFees

TotalExpenses

Achievements

InvitedToCamp

AttendedCamp

CampCount

CampPlace

CampDate

VDSSAttended

VDSS\_Topics

AccountHolderName

AccountNumber

IFSC

BankName

BranchName

ParentBankBalance

MarksheetPath

ThankingLetterPath

PassbookPath

PhotoPath

ThankingVideoPath

FeesReceiptPath

CreatedDate

HouseVisitLink

Status

OtherDistrict

ThankingVolunteerLetterPath

Remark

ApproveStatus

Id

2. DistrictMaster

Operation:

SELECT

Used by:

\* GetCreateRenewal

\* GetDistrictList

\* RenewalPUCGrid

\* VP\_RenewalStudentImportGrid

Fields used:

DistrictID

DistrictName

3. BranchExecutiveDistrictMapping

Operation:

SELECT / EXISTS filtering

Used by:

\* RenewalPUCGrid

\* VP\_RenewalStudentImportGrid

Fields used:

UserId

DistrictID

4. GoogleSheet\_VP\_Renewal

Operation:

\* INSERT

\* SELECT

\* UPDATE

Used by:

\* ImportStudents

\* VP\_RenewalStudentImportGrid

\* ApproveStudentI

\* RejectStudentI

=========================================================

AUTHORIZATION MATRIX

====================

| Endpoint | JWT Required | JwtSessionFilter | Role Requirement | Session UserID Required |

|---|---:|---:|---|---:|

| GET /api/renewalpuc/index | No | No | None | No |

| GET /api/renewalpuc/Getcreate | No | No | None | No |

| POST /api/renewalpuc/create | No | No | None | No |

| GET /api/renewalpuc/districts | No | No | None | No |

| GET /api/renewalpuc/list | Yes | Yes | No exclusive role; Branch Executives are district-filtered | Yes |

| POST /api/renewalpuc/approve/{id} | Yes | Yes | Not specified | No direct session access |

| POST /api/renewalpuc/reject/{id} | Yes | Yes | Not specified | No direct session access |

| POST /api/renewalpuc/delete/{id} | Yes | Yes | Not specified | No direct session access |

| POST /api/renewalpuc/import | Yes | Yes | Not specified | No direct session access |

| GET /api/renewalpuc/import-grid | Yes | Yes | No exclusive role; Branch Executives are district-filtered | Yes |

| POST /api/renewalpuc/import-grid/approve/{id} | Yes | Yes | Not specified | No direct session access |

| POST /api/renewalpuc/import-grid/reject/{id} | Yes | Yes | Not specified | No direct session access |

=========================================================

JWT / SESSION DETAILS

=====================

The controller does not directly access JWT claims.

Instead, protected list endpoints access ASP.NET Session:

Session["UserID"]

Session["UserId"]

Session["UserRole"]

TryGetSessionUserId() behavior:

1. Read Session["UserID"].

2. If null, read Session["UserId"].

3. If both are null, return false.

4. Attempt int.TryParse().

5. If parsing fails, return false.

Therefore the JwtSessionFilter must establish a valid session identity before

these endpoints can operate.

The exact implementation of JwtSessionFilter is outside the supplied

controller, so the exact JWT claim names and mapping cannot be determined.

JWT Header:

Authorization: Bearer <JWT\_TOKEN>

JWT Claims:

| Claim | Type | Required | Purpose |

|---|---|---:|---|

| UserID | int | Expected for user-filtered endpoints | Expected to be mapped into Session["UserID"] or Session["UserId"]. |

| Role | string | Expected for role-specific filtering | Expected to be mapped into Session["UserRole"]. |

| EmployeeID | Not specified | Not specified | Not used by this controller. |

IMPORTANT:

UserID and Role above describe the expected authentication/session dependency,

not claims explicitly read from JWT by this controller. The actual mapping is

determined by JwtSessionFilter.

=========================================================

DEFAULT VALUES

==============

Create Renewal PUC:

CreatedDate:

GETDATE()

Status:

1

OtherDistrict:

NULL when empty/whitespace.

Numeric parsing defaults:

ScholarshipAmount:

0 when empty/invalid.

LettersCount:

0 when empty/invalid.

CollegeFees:

0 when empty/invalid.

TotalExpenses:

0 when empty/invalid.

ParentBankBalance:

0 when empty/invalid.

Nullable dates:

DOB:

NULL when not supplied.

CampDate:

NULL when not supplied.

=========================================================

FILE STORAGE LOGIC

==================

Create endpoint upload folder:

~/Uploads/

Temporary multipart folder:

~/Uploads/\_TempApiUploads

Generated filename:

Guid.NewGuid().ToString("N") + original extension

Example:

Original:

marksheet.pdf

Generated:

a8d4f9e7c1b24c9f8e1234567890abcd.pdf

Stored API path:

/Uploads/a8d4f9e7c1b24c9f8e1234567890abcd.pdf

Original filenames are not stored as the final filename.

ThankingLetter:

Multiple files are supported and their generated paths are joined using:

,

comma separator.

No maximum file size is defined.

No allowed extension list is enforced by CreateRenewal.

The Import endpoint independently restricts the Excel file to:

.xlsx

.xlsm

=========================================================

PAGINATION / SEARCH / SORTING

=============================

The controller does NOT implement:

\* page number

\* page size

\* offset

\* limit

\* search text

\* date filters

\* sorting parameters

\* total pages

\* next page

\* previous page

The list endpoints return the complete matching dataset.

=========================================================

IMPORTANT IMPLEMENTATION NOTES

==============================

1. Public endpoints are not protected by JwtSessionFilter.

2. JwtSessionFilter is action-level only on protected endpoints.

3. Branch Executive behavior exists on the two grid/list endpoints only.

4. Branch Executive role comparison is case-insensitive:

StringComparison.OrdinalIgnoreCase

5. Main Renewal PUC grid filters records using:

Status = 1

6. Delete is a soft delete:

Status = 0

7. Approve/reject of normal RenewalPUC records modifies:

ApproveStatus

Remark

8. Approve/reject of imported records modifies:

Approve

Remarks

9. The normal Create endpoint performs duplicate email checking.

10. The Excel Import endpoint does NOT perform duplicate email checking.

11. The Create endpoint requires Email and ApplicantName.

12. District must be an integer for Create.

13. Invalid decimal and integer form values are converted to 0 rather than

rejected.

14. Invalid DOB and CampDate values are rejected.

15. Create file uploads are optional according to the controller.

16. No file extension or maximum size validation exists for Create uploads.

17. Excel import only accepts .xlsx and .xlsm.

18. Excel import starts from row 2 and assumes row 1 is the header.

19. Excel import uses fixed column positions rather than header names.

20. Excel import processes only worksheet 1.

21. Blank rows where both ApplicantName and Email are empty are skipped.

22. Excel import continues after row-level errors.

23. Excel import returns insertedCount, failedCount and row-level error

messages.

24. Excel import's success property is true only when insertedCount > 0.

25. No explicit SQL transaction is used for Excel import.

26. No explicit SQL transaction is used for Renewal PUC creation.

27. No explicit ownership check is performed for approve/reject/delete

operations.

28. No explicit role requirement such as Admin, Branch Executive, or Manager

is enforced by those actions in the supplied controller.

29. The "Branch Executives" role is used only to restrict grid/list results.

30. Exact JWT claim names cannot be determined because JwtSessionFilter is not

included.

31. Exact validation attributes for RenewalPUC and

VPRenewalStudentImportGridModel cannot be determined because their class

definitions were not included.

32. Exact database column data types are not completely determinable from the

controller.

33. Database-level constraints, triggers, indexes, and foreign keys are not

visible in the supplied controller and therefore are not documented as

guaranteed behavior.

34. The GetCreateRenewal comment says "api/renewalpuc/create", but its actual

route attribute is "Getcreate". The actual route is:

GET /api/renewalpuc/Getcreate

35. The CreateRenewal endpoint uses route "create" and POST, so:

POST /api/renewalpuc/create

is the actual create endpoint.

36. The Import endpoint does not explicitly delete its temporary Excel file

after processing.

37. The normal Create endpoint deletes temporary multipart files after the

database operation succeeds.

38. No update endpoint exists in this controller.

39. No hard-delete endpoint exists in this controller.

40. No separate authentication/login endpoint exists in this controller.

=========================================================

COMPLETE ENDPOINT SUMMARY

=========================

| # | Method | Route | Purpose | JWT |

|---:|---|---|---|---|

| 1 | GET | /api/renewalpuc/index | API health/status | Not Required |

| 2 | GET | /api/renewalpuc/Getcreate | Load Renewal PUC form districts | Not Required |

| 3 | POST | /api/renewalpuc/create | Create Renewal PUC application | Not Required |

| 4 | GET | /api/renewalpuc/districts | Load district dropdown | Not Required |

| 5 | GET | /api/renewalpuc/list | List active Renewal PUC applications | Required |

| 6 | POST | /api/renewalpuc/approve/{id} | Approve normal Renewal PUC record | Required |

| 7 | POST | /api/renewalpuc/reject/{id} | Reject normal Renewal PUC record | Required |

| 8 | POST | /api/renewalpuc/delete/{id} | Soft-delete Renewal PUC record | Required |

| 9 | POST | /api/renewalpuc/import | Import Renewal PUC records from Excel | Required |

| 10 | GET | /api/renewalpuc/import-grid | List imported Renewal PUC records | Required |

| 11 | POST | /api/renewalpuc/import-grid/approve/{id} | Approve imported record | Required |

| 12 | POST | /api/renewalpuc/import-grid/reject/{id} | Reject imported record | Required |

=========================================================

FINAL AUTHORIZATION CONCLUSION

==============================

The supplied controller DOES NOT require JWT authentication for the entire

controller.

Public endpoints:

\* /api/renewalpuc/index

\* /api/renewalpuc/Getcreate

\* /api/renewalpuc/create

\* /api/renewalpuc/districts

JWT-protected endpoints:

\* /api/renewalpuc/list

\* /api/renewalpuc/approve/{id}

\* /api/renewalpuc/reject/{id}

\* /api/renewalpuc/delete/{id}

\* /api/renewalpuc/import

\* /api/renewalpuc/import-grid

\* /api/renewalpuc/import-grid/approve/{id}

\* /api/renewalpuc/import-grid/reject/{id}

Existing authorization mechanism:

[JwtSessionFilter]

Scope:

Action-level only.

No controller-level JWT filter is present in the supplied code.

For the two grid/list endpoints, authenticated UserID and UserRole are

required through ASP.NET Session. The exact mechanism that maps JWT claims to

these session values is implemented outside this controller and is therefore

not specified here.

No explicit role is required for the protected endpoints based on the

controller code. The role "Branch Executives" receives special district-based

filtering on the list/import-grid endpoints.