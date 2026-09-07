=========================================================

PAYANA RENEWAL API CONTRACT

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/payana-renewal

Controller:

PayanaRenewalApI1Controller

Technology:

ASP.NET Web API 2 / .NET Framework

Authentication:

JWT authentication is NOT applied at controller level.

Authentication is applied individually at action level using:

[JwtSessionFilter]

Public endpoints:

1. GET /api/payana-renewal

2. GET /api/payana-renewal/dropdowns

3. POST /api/payana-renewal/create

JWT-protected endpoints:

1. GET /api/payana-renewal/list

2. PUT /api/payana-renewal/approve/{id}

3. PUT /api/payana-renewal/reject/{id}

4. DELETE /api/payana-renewal/delete/{id}

5. POST /api/payana-renewal/import

6. GET /api/payana-renewal/import-grid

7. PUT /api/payana-renewal/import/{id}/approve

8. PUT /api/payana-renewal/import/{id}/reject

Important:

The supplied controller does not contain a controller-level JWT filter. Therefore JWT requirements are documented endpoint-by-endpoint exactly according to the supplied code.

=========================================================

1. PAYANA RENEWAL API HEALTH CHECK

=========================================================

Endpoint:

GET /api/payana-renewal

Purpose:

Checks whether the Payana Renewal API is running.

Content-Type:

No request body.

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Reason: The endpoint has no [JwtSessionFilter] or other authorization attribute.

\* The endpoint does not access Session, UserID, EmployeeID, or Role.

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

\* No validation is implemented.

Business Logic Notes:

\* No database access.

\* No authentication.

\* No authorization.

\* Simply returns a success message indicating that the API is working.

Success Response (200):

{

"success": true,

"message": "Payana Renewal API is working."

}

Failure Responses:

No explicit failure response is implemented by this action.

Status Codes Used:

\* 200 OK

=========================================================

2. GET PAYANA RENEWAL DROPDOWNS

=========================================================

Endpoint:

GET /api/payana-renewal/dropdowns

Purpose:

Returns all dropdown/master data required by the Payana Renewal application form.

Content-Type:

No request body.

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Reason: The action does not contain [JwtSessionFilter] and does not access authenticated Session/UserID information.

\* The dropdown data is public according to the supplied controller.

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

\* No request validation is implemented.

\* No UserID filtering.

\* No EmployeeID filtering.

\* No Role filtering.

\* No active/inactive filtering is specified.

\* No "-- Select --" option is added by the API.

Business Logic Notes:

The endpoint queries the following database tables:

1. DistrictMaster

2. AreaTypeMaster

3. CasteCategoryMaster

4. CollegeTypeMaster

5. PFatherOccupationMaster

6. MotherOccupationMaster

The endpoint returns:

\* districts

\* areaTypes

\* castes

\* collegeTypes

\* fatherOccupations

\* motherOccupations

The controller does not add any explicit ORDER BY clause.

Success Response (200):

{

"success": true,

"districts": [

{

"Id": 1,

"Name": "Example District"

}

],

"areaTypes": [

{

"Id": 1,

"Name": "Urban"

}

],

"castes": [

{

"Id": 1,

"Name": "Example Category"

}

],

"collegeTypes": [

{

"Id": 1,

"Name": "Government"

}

],

"fatherOccupations": [

{

"Id": 1,

"Name": "Example Occupation"

}

],

"motherOccupations": [

{

"Id": 1,

"Name": "Example Occupation"

}

]

}

Dropdown response structure:

districts:

List of DropdownModel

areaTypes:

List of DropdownModel

castes:

List of DropdownModel

collegeTypes:

List of DropdownModel

fatherOccupations:

List of DropdownModel

motherOccupations:

List of DropdownModel

Failure Responses:

500 Internal Server Error:

Returned when an exception occurs while reading dropdown data from the database.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

=========================================================

3. CREATE PAYANA RENEWAL

=========================================================

Endpoint:

POST /api/payana-renewal/create

Purpose:

Creates a new Payana Renewal application and uploads the associated student documents.

Content-Type:

multipart/form-data

Authorization:

Not Required

JWT / Authorization Details:

\* JWT Required: No

\* Reason: The action does not have [JwtSessionFilter].

\* The action does not read authenticated UserID, EmployeeID, or Role.

\* This is a public application submission endpoint.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

multipart/form-data

Form Data / Multipart Fields:

| Field | Type | Required | Description |

|------|------|----------|-------------|

| EmailId | string | Yes | Applicant/student email ID. Controller explicitly validates this field. |

| District | int | Optional | District ID. Parsed using int.TryParse; invalid/missing value becomes 0. |

| Taluk | string | Optional | Taluk name/value. |

| PayanaId | string | Yes | Payana ID. Controller explicitly validates this field. |

| StudentName | string | Optional | Student name. |

| ResidentialAddress | string | Optional | Residential address. |

| CurrentAddress | string | Optional | Current address. |

| PrimaryNumber | string | Optional | Primary WhatsApp/contact number. |

| AlternateNumber | string | Optional | Alternate contact number. |

| Place | int | Optional | Area/place type ID. Invalid/missing value becomes 0. |

| Caste | int | Optional | Caste category ID. Invalid/missing value becomes 0. |

| FatherOccupation | string | Optional | Father's occupation. |

| MotherOccupation | string | Optional | Mother's occupation. |

| FamilyIncome | decimal | Optional | Family annual income. Invalid/missing value becomes 0. |

| BankBalance | decimal | Optional | Parent/student bank balance. Invalid/missing value becomes 0. |

| CollegeName | string | Optional | College/school name. |

| CollegeType | int | Optional | College type ID. Invalid/missing value becomes 0. |

| CollegeContact | string | Optional | College contact number. |

| CourseS | string | Optional | Course being studied. |

| CourseStream | string | Optional | Course stream. |

| AnnualFees | decimal | Optional | Annual college/school fees. Invalid/missing value becomes 0. |

| TotalExpenses | decimal | Optional | Total educational expenses. Invalid/missing value becomes 0. |

| ScholarshipAmount | decimal/int | Optional | Scholarship amount. Controller reads it as decimal and casts it to int. |

| DonorName | string | Optional | Donor name. |

| LettersWritten | int | Optional | Number of letters written to donor. Invalid/missing value becomes 0. |

| Achievement | string | Optional | Student achievement information. |

| Percentage | decimal | Optional | Secured percentage. Invalid/missing value becomes 0. |

| AccountHolder | string | Optional | Bank account holder name. |

| AccountNumber | string | Optional | Bank account number. |

| IFSC | string | Optional | IFSC code. |

| BankName | string | Optional | Bank name. |

| Branch | string | Optional | Bank branch. |

| HouseVisitLink | string | Optional | House visit link. |

| CET\_NEET\_Rank | string | Optional | CET/NEET rank. |

| OtherDistrict | string | Optional/Nullable | Other district value. Stored as NULL when empty/whitespace. |

| InvitedToCamp | string | Optional | Whether student was invited to camp. |

| AttendedCamp | string | Optional | Whether student attended camp. |

| CampCount | string | Optional | Camp attendance count/value. |

| CampPlace | string | Optional | Camp place. |

| VDSSAttended | string | Optional | Whether VDSS was attended. |

| VDSS\_Topics | string | Optional | VDSS topics. |

| OtherOccupation | string | Optional | Other occupation information. |

| DateOfBirth | date/string | Optional | Date of birth. Parsed using DateTime.TryParse. |

DateOfBirth behavior:

\* If DateOfBirth can be parsed using DateTime.TryParse, it is stored as a DateTime.

\* If parsing fails, vm.DateOfBirth remains null.

\* No explicit error is returned for an invalid date format.

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|------|------|----------|--------------------|----------|-------------|

| MarksheetFile | file | Optional | Not explicitly validated | Not specified in controller | Latest marksheet/result file. |

| FeesReceiptFile | file | Optional | Not explicitly validated | Not specified in controller | Fees receipt file. |

| PassbookFile | file | Optional | Not explicitly validated | Not specified in controller | Bank passbook file. |

| SelfieFile | file | Optional | Not explicitly validated | Not specified in controller | Student selfie/photo. |

| AadhaarFile | file | Optional | Not explicitly validated | Not specified in controller | Aadhaar document. |

| ThankingLetter | file | Optional | Not explicitly validated | Not specified in controller | Thanking letter document. |

| CET\_NEET\_RankSheetPath | file | Optional | Not explicitly validated | Not specified in controller | CET/NEET rank sheet. |

File behavior:

\* No file is explicitly mandatory in the controller.

\* If a file field is not supplied, SaveUploadedFile returns null.

\* There is no explicit extension whitelist in this action.

\* There is no explicit maximum file-size validation in this action.

\* Multiple files with the same field are not intentionally supported; SaveUploadedFile returns the first matching file.

\* Files are initially received into:

~/App\_Data/PayanaTemp/

\* The final upload folder is:

~/Uploads/Payana/

Generated file name:

original-file-name-without-extension\_GUID.extension

Example:

Marksheet\_550e8400-e29b-41d4-a716-446655440000.pdf

Stored database path format:

/Uploads/Payana/<generated-file-name>

Important:

The controller uses Path.GetFileName() before constructing the final file name.

Validation Rules:

1. Request must be multipart/form-data.

2. EmailId is required.

3. PayanaId is required.

4. EmailId must not be whitespace.

5. PayanaId must not be whitespace.

6. DateOfBirth is optional.

7. Numeric fields are parsed using TryParse.

8. Invalid numeric values are silently converted to 0.

9. OtherDistrict is stored as NULL when blank.

10. No explicit email-format validation is implemented.

11. No explicit maximum/minimum length validation is implemented.

12. No explicit file extension validation is implemented.

13. No explicit file size validation is implemented.

Duplicate Check:

The controller executes:

SELECT COUNT(\*)

FROM PayanaRenewal

WHERE LOWER(EmailId) = LOWER(@EmailId)

OR PayanaId = @PayanaId

Therefore an application is considered duplicate when:

\* EmailId matches an existing EmailId case-insensitively; OR

\* PayanaId matches an existing PayanaId.

The controller returns HTTP 409 Conflict when a duplicate is found.

Important:

Although the query checks both EmailId and PayanaId, the response message specifically says:

"This Email ID is already registered. Student can apply only once."

Database Operation:

INSERT INTO:

PayanaRenewal

Inserted fields include:

EmailId

District

Taluk

PayanaId

StudentName

DateOfBirth

ResidentialAddress

CurrentAddress

PrimaryNumber

AlternateNumber

Place

Caste

FatherOccupation

MotherOccupation

FamilyIncome

BankBalance

CollegeName

CollegeType

CollegeContact

CourseS

CourseStream

AnnualFees

TotalExpenses

ScholarshipAmount

DonorName

LettersWritten

Achievement

Percentage

AccountHolder

AccountNumber

IFSC

BankName

Branch

MarksheetPath

FeesReceiptPath

PassbookPath

SelfiePath

AadhaarPath

ThankingLetterPath

HouseVisitLink

CET\_NEET\_Rank

CET\_NEET\_RankSheetPath

OtherDistrict

InvitedToCamp

AttendedCamp

CampCount

CampPlace

VDSSAttended

VDSS\_Topics

OtherOccupation

Transaction:

No explicit SQL transaction is used.

Success Response (201):

{

"success": true,

"message": "Payana Renewal submitted successfully."

}

Failure Responses:

400 Bad Request:

When request is not multipart/form-data:

{

"success": false,

"message": "Request must be multipart/form-data."

}

When EmailId is missing:

{

"success": false,

"message": "EmailId is required."

}

When PayanaId is missing:

{

"success": false,

"message": "PayanaId is required."

}

409 Conflict:

When an existing PayanaRenewal record has the same EmailId or PayanaId:

{

"success": false,

"message": "This Email ID is already registered. Student can apply only once."

}

500 Internal Server Error:

For unhandled exceptions:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 201 Created

\* 400 Bad Request

\* 409 Conflict

\* 500 Internal Server Error

401 Unauthorized:

Not explicitly returned by this action because JWT is not required.

403 Forbidden:

Not explicitly returned by this action because JWT is not required.

404 Not Found:

Not used by this action.

=========================================================

4. GET PAYANA RENEWAL LIST

=========================================================

Endpoint:

GET /api/payana-renewal/list

Purpose:

Returns Payana Renewal records for the authenticated user/role.

Content-Type:

No request body.

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: The controller indirectly requires authenticated session values containing UserRole and UserId/UserID.

\* Required Roles: Branch Executives receive special district filtering.

\* Other roles are not explicitly restricted by the controller.

\* The endpoint reads:

HttpContext.Current.Session["UserRole"]

HttpContext.Current.Session["UserId"]

\* The supplied controller assumes these Session values are populated by the JWT/session authentication mechanism.

Session dependency:

The JWT/session authentication layer is expected to populate:

\* UserRole

\* UserId

Important:

The exact JWT claim names and the code that maps claims into Session are NOT specified in this controller.

Role behavior:

If UserRole equals:

"Branch Executives"

case-insensitively, records are restricted to districts mapped to the authenticated UserId through:

BranchExecutiveDistrictMapping

For other roles, the controller does not add a role-specific WHERE restriction.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filtering:

Not implemented.

Request Body:

None.

Validation Rules:

\* JWT/session authentication is required through [JwtSessionFilter].

\* id-level validation is not applicable.

\* UserID is converted using Convert.ToInt32().

\* If the required Session UserID is missing or invalid, an exception may occur.

Business Logic Notes:

Database table:

PayanaRenewal

LEFT JOIN tables:

1. DistrictMaster

2. AreaTypeMaster

3. CasteCategoryMaster

4. CollegeTypeMaster

Returned records include:

\* PayanaRenewalId

\* student/application information

\* bank information

\* document paths

\* approval status

\* remarks

\* corresponding district/area/caste/college display names

Branch Executive filtering:

For role "Branch Executives":

AND EXISTS

(

SELECT 1

FROM BranchExecutiveDistrictMapping bedm

WHERE bedm.DistrictID = pr.District

AND bedm.UserId = @UserId

)

Therefore Branch Executives only see records belonging to their mapped districts.

For non-Branch-Executive roles:

No additional role filter is implemented.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"PayanaRenewalId": 101,

"EmailId": "student@example.com",

"District": 5,

"OtherDistrict": null,

"Taluk": "Example Taluk",

"PayanaId": "PAY12345",

"StudentName": "Student Name",

"DateOfBirth": "2005-01-15T00:00:00",

"ResidentialAddress": "Residential address",

"CurrentAddress": "Current address",

"PrimaryNumber": "9876543210",

"AlternateNumber": "9123456780",

"Place": 1,

"Caste": 2,

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"OtherOccupation": null,

"FamilyIncome": 150000.00,

"BankBalance": 25000.00,

"CollegeName": "Example College",

"CollegeType": 1,

"CollegeContact": "9876500000",

"CourseS": "B.Com",

"CourseStream": "Commerce",

"AnnualFees": 50000.00,

"TotalExpenses": 70000.00,

"ScholarshipAmount": 20000,

"DonorName": "Donor Name",

"LettersWritten": 2,

"Achievement": "Good academic performance",

"Percentage": 85.50,

"CET\_NEET\_Rank": "12345",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"CampCount": "2",

"CampPlace": "Dharwad",

"VDSSAttended": "Yes",

"VDSS\_Topics": "Career Guidance",

"AccountHolder": "Student Name",

"AccountNumber": "1234567890",

"IFSC": "SBIN0000001",

"BankName": "Example Bank",

"Branch": "Main Branch",

"MarksheetFile": "/Uploads/Payana/marksheet.pdf",

"FeesReceiptFile": "/Uploads/Payana/fees.pdf",

"PassbookFile": "/Uploads/Payana/passbook.pdf",

"SelfieFile": "/Uploads/Payana/selfie.jpg",

"AadhaarFile": "/Uploads/Payana/aadhaar.pdf",

"ThankingLetter": "/Uploads/Payana/letter.pdf",

"CET\_NEET\_RankSheetPath": "/Uploads/Payana/rank.pdf",

"DistrictName": "Example District",

"AreaTypeName": "Urban",

"CategoryName": "Example Category",

"CollegeTypeName": "Government",

"ApproveStatus": "Approved",

"Remark": "Approved after verification"

}

]

}

Failure Responses:

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request because authentication is missing/invalid.

Example:

{

"success": false,

"message": "Unauthorized"

}

The exact 401 response body is not specified in this controller.

403 Forbidden:

Potentially applicable if the authentication filter itself implements permission/role rejection.

However, this controller does not explicitly return 403.

404 Not Found:

Not used because the endpoint returns a list.

500 Internal Server Error:

Possible when:

\* Session UserRole is unavailable.

\* Session UserId/UserID is invalid.

\* Database access fails.

\* SQL execution fails.

\* Data conversion fails.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 401 Unauthorized - applicable through JWT filter

\* 403 Forbidden - potentially applicable through authorization/filter implementation

\* 500 Internal Server Error

=========================================================

5. APPROVE PAYANA RENEWAL

=========================================================

Endpoint:

PUT /api/payana-renewal/approve/{id}

Purpose:

Approves a Payana Renewal record and stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly read by this action.

\* Required Roles: No explicit role requirement is implemented in the action.

\* The controller relies on [JwtSessionFilter] for authentication.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | PayanaRenewalId to approve. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Approved after verification."

}

Request DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* request may be null.

\* Remark may be null.

\* If request is null, an empty string is passed to the database.

\* No explicit maximum remark length is implemented.

\* No explicit role check is implemented in this action.

Business Logic:

The action calls:

UpdateStatus(

id,

"Approved",

request == null ? "" : request.Remark

)

Database operation:

UPDATE PayanaRenewal

SET ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE PayanaRenewalId = @PayanaRenewalId

No transaction is used.

Success Response (200):

{

"success": true,

"message": "Student approved successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid PayanaRenewalId."

}

404 Not Found:

Returned when no PayanaRenewal row matches the supplied ID.

{

"success": false,

"message": "Payana renewal record not found."

}

401 Unauthorized:

Applicable if [JwtSessionFilter] rejects an unauthenticated request.

403 Forbidden:

Potentially applicable through authorization/filter implementation, but not explicitly returned by the controller.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

6. REJECT PAYANA RENEWAL

=========================================================

Endpoint:

PUT /api/payana-renewal/reject/{id}

Purpose:

Rejects a Payana Renewal record and stores an optional remark.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly read by this action.

\* Required Roles: No explicit role requirement is implemented in this action.

\* Authentication is delegated to [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | PayanaRenewalId to reject. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Required documents are incomplete."

}

Request DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* request may be null.

\* Remark may be null.

\* If request is null, empty string is used.

\* No explicit maximum remark length is implemented.

\* No explicit role validation is implemented in the action.

Business Logic:

The action calls:

UpdateStatus(

id,

"Rejected",

request == null ? "" : request.Remark

)

Database operation:

UPDATE PayanaRenewal

SET ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE PayanaRenewalId = @PayanaRenewalId

Success Response (200):

{

"success": true,

"message": "Student rejected successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid PayanaRenewalId."

}

404 Not Found:

{

"success": false,

"message": "Payana renewal record not found."

}

401 Unauthorized:

Applicable through [JwtSessionFilter] if authentication fails.

403 Forbidden:

Potentially applicable through authorization/filter implementation; not explicitly returned by controller.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

7. DELETE PAYANA RENEWAL

=========================================================

Endpoint:

DELETE /api/payana-renewal/delete/{id}

Purpose:

Performs a soft delete of a Payana Renewal record.

Content-Type:

No request body.

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly accessed by the action.

\* Required Roles: No explicit role is implemented in the controller.

\* Authentication is enforced through [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | PayanaRenewalId to soft-delete. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

Business Logic:

This endpoint does NOT physically delete the database record.

It performs:

UPDATE PayanaRenewal

SET Status = 0

WHERE PayanaRenewalId = @PayanaRenewalId

Therefore this is a SOFT DELETE.

No transaction is used.

Important:

The list endpoint does not explicitly contain:

WHERE Status <> 0

Therefore the supplied controller does not demonstrate that soft-deleted records are excluded from GET /list.

Success Response (200):

{

"success": true,

"message": "Renewal Payana deleted successfully."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid PayanaRenewalId."

}

404 Not Found:

Returned when no record is updated.

{

"success": false,

"message": "Delete failed. Student not found."

}

401 Unauthorized:

Applicable through [JwtSessionFilter].

403 Forbidden:

Potentially applicable through authorization/filter implementation, but not explicitly returned.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

8. IMPORT PAYANA RENEWAL STUDENTS

=========================================================

Endpoint:

POST /api/payana-renewal/import

Purpose:

Imports Payana Renewal student records from an Excel .xlsx file into the GoogleSheet\_PayanaRenewal database table.

Content-Type:

multipart/form-data

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: No explicit role requirement is implemented in this action.

\* Authentication is enforced through [JwtSessionFilter].

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

|------|------|----------|-------------|

| file | file | Yes | Excel .xlsx file containing Payana Renewal student data. |

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|------|------|----------|--------------------|----------|-------------|

| file | file | Yes | .xlsx | Not specified in controller | Excel workbook used for import. |

File validation:

\* Request must be multipart/form-data.

\* A file field named "file" is required.

\* Only .xlsx extension is accepted.

\* .xls is rejected.

\* No maximum file size is explicitly checked by the controller.

\* Workbook is opened using ClosedXML.

\* First worksheet is processed.

Excel structure:

The controller expects data beginning from row 2.

Column mapping:

| Column | Excel Field |

|--------|-------------|

| 1 | Timestamp |

| 2 | Email Address |

| 3 | District |

| 4 | Taluk |

| 5 | Payana ID Number |

| 6 | Name of student |

| 7 | Residential address |

| 8 | Current address |

| 9 | Date of birth |

| 10 | Primary WhatsApp Number |

| 11 | Alternate Number |

| 12 | Email id |

| 13 | Place |

| 14 | Caste |

| 15 | Father's occupation |

| 16 | Mother's occupation |

| 17 | Family annual income |

| 18 | Parents bank balance |

| 19 | College Name/School Name |

| 20 | College/School type |

| 21 | College Contact number |

| 22 | Course Studying |

| 23 | Course Stream |

| 24 | Annual College/School fees |

| 25 | Total Educational Expenses for the year |

| 26 | Total Scholarship amount received in 2025-26 |

| 27 | Donor Name |

| 28 | How many letters you wrote to donor in last year |

| 29 | Student Achievement in 2025-26 |

| 30 | Secured percentage in the academic year 2025-26 |

| 31 | Account holder name as per Passbook |

| 32 | Bank account number |

| 33 | IFSC Code |

| 34 | Bank Name |

| 35 | Bank Branch Name |

| 36 | Latest Mark sheet / Semester result |

| 37 | Fees Receipt |

| 38 | Student Bank Passbook first page |

| 39 | Student latest selfie/photo |

| 40 | Student's Aadhar card photo |

Important:

The controller reads cells by column number, not by header name.

Validation Rules:

\* Request must be multipart/form-data.

\* "file" multipart field must exist.

\* File extension must be .xlsx.

\* Workbook must contain a usable first worksheet.

\* Empty worksheets are rejected.

\* Rows where both StudentName and Email Address are blank are skipped.

\* Individual row errors do not stop the entire import.

\* Invalid rows increment failedCount.

\* Row-specific exception messages are returned in errors.

\* No explicit duplicate check is implemented before inserting imported rows.

\* No explicit email validation is implemented.

\* No explicit numeric validation is implemented because all imported values are read as strings.

\* No explicit maximum field length validation is implemented.

Database:

INSERT INTO:

GoogleSheet\_PayanaRenewal

All 40 imported Excel values are inserted into the corresponding database columns.

Transaction:

No explicit transaction is used.

Row processing:

For every row from 2 through LastRowUsed:

\* Read all 40 columns.

\* If StudentName AND Email Address are blank, skip the row.

\* Attempt INSERT.

\* If INSERT succeeds, increment insertedCount.

\* If INSERT fails, increment failedCount and append:

"Row <row number> | <error message>"

Database information:

The endpoint executes:

SELECT DB\_NAME()

The returned database name is included in the response.

Success Response (200):

{

"success": true,

"database": "ENVISAGE",

"insertedCount": 25,

"failedCount": 2,

"message": "Database: ENVISAGE | Inserted: 25 | Failed: 2",

"errors": [

"Row 5 | Error message",

"Row 12 | Error message"

]

}

Important:

The controller returns HTTP 200 even if some rows fail.

The success property is:

insertedCount > 0

Therefore:

\* insertedCount > 0 => success = true

\* insertedCount = 0 => success = false

Failure Responses:

400 Bad Request:

Non-multipart request:

{

"success": false,

"message": "Request must be multipart/form-data."

}

No file:

{

"success": false,

"message": "Excel file is required."

}

Wrong extension:

{

"success": false,

"message": "Only .xlsx Excel files are supported."

}

Empty workbook:

{

"success": false,

"message": "Excel file is empty."

}

500 Internal Server Error:

Unexpected exception outside the row-level processing:

{

"success": false,

"message": "Error message",

"insertedCount": 0,

"failedCount": 0,

"errors": []

}

401 Unauthorized:

Applicable through [JwtSessionFilter].

403 Forbidden:

Potentially applicable through authorization/filter implementation, but no explicit role restriction is coded.

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 500 Internal Server Error

=========================================================

9. GET IMPORTED PAYANA RENEWAL GRID

=========================================================

Endpoint:

GET /api/payana-renewal/import-grid

Purpose:

Returns imported Payana Renewal student records from GoogleSheet\_PayanaRenewal.

Content-Type:

No request body.

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Authenticated identity must be available through Session.

\* The action reads:

HttpContext.Current.Session["UserRole"]

HttpContext.Current.Session["UserID"]

\* Required Roles: Branch Executives receive district-specific filtering.

\* Exact JWT claim names are not specified in the controller.

\* The controller expects JWT/session middleware/filter to populate UserRole and UserID.

Role-based behavior:

If role equals "Branch Executives", the query is restricted to records whose District text matches a DistrictMaster record mapped to the authenticated UserID.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filtering:

Not implemented.

Request Body:

None.

Validation Rules:

\* JWT authentication required through [JwtSessionFilter].

\* For Branch Executives, UserID is converted using Convert.ToInt32().

\* If UserID is unavailable/invalid, an exception may occur.

\* No explicit ID validation is required because this is a list endpoint.

Business Logic:

Database table:

GoogleSheet\_PayanaRenewal

Returned fields:

ImportID

Timestamp

Email Address

District

Taluk

Payana ID Number

Name of student

Residential address

Current address

Date of birth

Primary WhatsApp Number

Alternate Number

Email id

Place

Caste

Father's occupation

Mother's occupation

Family annual income

Parents bank balance

College Name/School Name

College/School type

College Contact number

Course Studying

Course Stream

Annual College/School fees

Total Educational Expenses for the year

Total Scholarship amount received in 2025-26

Donor Name

How many letters you wrote to donor in last year

Student Achievement in 2025-26

Secured percentage in the academic year 2025-26

Account holder name as per Passbook

Bank account number

IFSC Code

Bank Name

Bank Branch Name

Latest Mark sheet / Semester result

Fees Receipt

Student Bank Passbook first page

Student latest selfie/photo

Student's Aadhar card photo

ImportedDate

Approve

Remarks

Branch Executive query:

For role "Branch Executives":

The endpoint joins:

BranchExecutiveDistrictMapping

DistrictMaster

and compares:

DistrictMaster.DistrictName

with

GoogleSheet\_PayanaRenewal.District

using LTRIM/RTRIM.

It filters by authenticated UserID.

For other roles:

No additional filtering is implemented.

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

"PayanaIDNumber": "PAY12345",

"StudentName": "Student Name",

"ResidentialAddress": "Residential address",

"CurrentAddress": "Current address",

"DateOfBirth": "2005-01-15",

"PrimaryWhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"EmailId": "student@example.com",

"Place": "Urban",

"Caste": "General",

"FathersOccupation": "Farmer",

"MothersOccupation": "Homemaker",

"FamilyAnnualIncome": "150000",

"ParentsBankBalance": "25000",

"CollegeName": "Example College",

"CollegeSchoolType": "Government",

"CollegeContactNumber": "9876500000",

"CourseStudying": "B.Com",

"CourseStream": "Commerce",

"AnnualCollegeSchoolFees": "50000",

"TotalEducationalExpensesForTheYear": "70000",

"TotalScholarshipAmountReceived202526": "20000",

"DonorName": "Donor Name",

"HowManyLettersYouWroteToDonorInLastYear": "2",

"StudentAchievement202526": "Good academic performance",

"SecuredPercentageAcademicYear202526": "85.5",

"AccountHolderNameAsPerPassbook": "Student Name",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "Example Bank",

"BankBranchName": "Main Branch",

"LatestMarkSheetSemesterResultPath": "/Uploads/mark.pdf",

"FeesReceiptPath": "/Uploads/fees.pdf",

"StudentBankPassbookFirstPagePath": "/Uploads/passbook.pdf",

"StudentLatestSelfiePhotoPath": "/Uploads/selfie.jpg",

"StudentAadharCardPhotoPath": "/Uploads/aadhaar.pdf",

"ImportedDate": "2026-08-28T10:30:00",

"Approve": "Approved",

"Remarks": "Verified"

}

]

}

Failure Responses:

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects authentication.

403 Forbidden:

Potentially applicable through authorization/filter implementation; not explicitly returned by controller.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 500 Internal Server Error

=========================================================

10. APPROVE IMPORTED PAYANA STUDENT

=========================================================

Endpoint:

PUT /api/payana-renewal/import/{id}/approve

Purpose:

Updates the approval status of an imported Payana Renewal student to Approved.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: No explicit role is implemented in this action.

\* Authentication is enforced by [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Imported student verified and approved."

}

Request DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* request may be null.

\* Remark may be null.

\* Blank remark is converted to NULL before database update.

\* No explicit remark length validation.

\* No explicit role check.

Business Logic:

The action calls:

UpdateImportedStudentStatus(

id,

"Approved",

request == null ? "" : request.Remark

)

Database operation:

UPDATE GoogleSheet\_PayanaRenewal

SET Approve = @Approve,

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

Applicable through [JwtSessionFilter].

403 Forbidden:

Potentially applicable through authorization/filter implementation.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

11. REJECT IMPORTED PAYANA STUDENT

=========================================================

Endpoint:

PUT /api/payana-renewal/import/{id}/reject

Purpose:

Updates the approval status of an imported Payana Renewal student to Rejected.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: No explicit role is implemented in this action.

\* Authentication is enforced by [JwtSessionFilter].

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

{

"Remark": "Documents are incomplete."

}

Request DTO:

RemarkRequest

Validation Rules:

\* id must be greater than 0.

\* request may be null.

\* Remark may be null.

\* Blank remark is stored as NULL.

\* No explicit remark length validation.

\* No explicit role check.

Business Logic:

The action calls:

UpdateImportedStudentStatus(

id,

"Rejected",

request == null ? "" : request.Remark

)

Database operation:

UPDATE GoogleSheet\_PayanaRenewal

SET Approve = @Approve,

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

Applicable through [JwtSessionFilter].

403 Forbidden:

Potentially applicable through authorization/filter implementation.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used/Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized

\* 403 Forbidden - potentially through filter

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

COMMON DTOS

=========================================================

DTO 1: PayanaRenewalVM

=====================

Purpose:

Represents a Payana Renewal application and is used by the create/list functionality.

Important:

The complete PayanaRenewalVM class was not included in the supplied controller. The following properties are directly referenced by the controller.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| PayanaRenewalId | int | Optional | No | Renewal record ID. |

| EmailId | string | Required for create | Yes | Student/application email. |

| District | int | Optional | No | District ID. |

| OtherDistrict | string | Optional | Yes | Other district. Empty value is stored as NULL. |

| Taluk | string | Optional | Yes | Taluk. |

| PayanaId | string | Required for create | Yes | Payana ID. |

| StudentName | string | Optional | Yes | Student name. |

| DateOfBirth | DateTime? | Optional | Yes | Date of birth. |

| ResidentialAddress | string | Optional | Yes | Residential address. |

| CurrentAddress | string | Optional | Yes | Current address. |

| PrimaryNumber | string | Optional | Yes | Primary WhatsApp/contact number. |

| AlternateNumber | string | Optional | Yes | Alternate contact number. |

| Place | int | Optional | No | Place/area type ID. |

| Caste | int | Optional | No | Caste category ID. |

| FatherOccupation | string | Optional | Yes | Father's occupation. |

| MotherOccupation | string | Optional | Yes | Mother's occupation. |

| OtherOccupation | string | Optional | Yes | Other occupation. |

| FamilyIncome | decimal | Optional | No | Family income. |

| BankBalance | decimal | Optional | No | Bank balance. |

| CollegeName | string | Optional | Yes | College/school name. |

| CollegeType | int | Optional | No | College type ID. |

| CollegeContact | string | Optional | Yes | College contact number. |

| CourseS | string | Optional | Yes | Course studied. |

| CourseStream | string | Optional | Yes | Course stream. |

| AnnualFees | decimal | Optional | No | Annual fees. |

| TotalExpenses | decimal | Optional | No | Total educational expenses. |

| ScholarshipAmount | int | Optional | No | Scholarship amount. |

| DonorName | string | Optional | Yes | Donor name. |

| LettersWritten | int | Optional | No | Number of letters written. |

| Achievement | string | Optional | Yes | Student achievement. |

| Percentage | decimal | Optional | No | Secured percentage. |

| AccountHolder | string | Optional | Yes | Bank account holder. |

| AccountNumber | string | Optional | Yes | Bank account number. |

| IFSC | string | Optional | Yes | IFSC code. |

| BankName | string | Optional | Yes | Bank name. |

| Branch | string | Optional | Yes | Bank branch. |

| MarksheetFile | string | Optional | Yes | Stored marksheet path. |

| FeesReceiptFile | string | Optional | Yes | Stored fees receipt path. |

| PassbookFile | string | Optional | Yes | Stored passbook path. |

| SelfieFile | string | Optional | Yes | Stored selfie path. |

| AadhaarFile | string | Optional | Yes | Stored Aadhaar path. |

| ThankingLetter | string | Optional | Yes | Stored thanking letter path. |

| HouseVisitLink | string | Optional | Yes | House visit URL/link. |

| CET\_NEET\_Rank | string | Optional | Yes | CET/NEET rank. |

| CET\_NEET\_RankSheetPath | string | Optional | Yes | Stored rank sheet path. |

| InvitedToCamp | string | Optional | Yes | Camp invitation status. |

| AttendedCamp | string | Optional | Yes | Camp attendance status. |

| CampCount | string | Optional | Yes | Camp count. |

| CampPlace | string | Optional | Yes | Camp place. |

| VDSSAttended | string | Optional | Yes | VDSS attendance. |

| VDSS\_Topics | string | Optional | Yes | VDSS topics. |

| DistrictName | string | Response only | Yes | Joined district display name. |

| AreaTypeName | string | Response only | Yes | Joined area type display name. |

| CategoryName | string | Response only | Yes | Joined caste/category display name. |

| CollegeTypeName | string | Response only | Yes | Joined college type display name. |

| ApproveStatus | string | Response only | Yes | Approval status. |

| Remark | string | Response only | Yes | Approval/rejection remark. |

Note:

Required/optional status above is based on actual controller validation and usage. The complete model's DataAnnotation attributes were not supplied.

Sample Response:

{

"PayanaRenewalId": 101,

"EmailId": "student@example.com",

"District": 5,

"OtherDistrict": null,

"Taluk": "Dharwad",

"PayanaId": "PAY12345",

"StudentName": "Student Name",

"DateOfBirth": "2005-01-15T00:00:00",

"ResidentialAddress": "Residential address",

"CurrentAddress": "Current address",

"PrimaryNumber": "9876543210",

"AlternateNumber": "9123456780",

"Place": 1,

"Caste": 2,

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"OtherOccupation": null,

"FamilyIncome": 150000.00,

"BankBalance": 25000.00,

"CollegeName": "Example College",

"CollegeType": 1,

"CollegeContact": "9876500000",

"CourseS": "B.Com",

"CourseStream": "Commerce",

"AnnualFees": 50000.00,

"TotalExpenses": 70000.00,

"ScholarshipAmount": 20000,

"DonorName": "Donor Name",

"LettersWritten": 2,

"Achievement": "Good performance",

"Percentage": 85.50,

"AccountHolder": "Student Name",

"AccountNumber": "1234567890",

"IFSC": "SBIN0000001",

"BankName": "Example Bank",

"Branch": "Main Branch",

"MarksheetFile": "/Uploads/Payana/marksheet.pdf",

"FeesReceiptFile": "/Uploads/Payana/fees.pdf",

"PassbookFile": "/Uploads/Payana/passbook.pdf",

"SelfieFile": "/Uploads/Payana/selfie.jpg",

"AadhaarFile": "/Uploads/Payana/aadhaar.pdf",

"ThankingLetter": "/Uploads/Payana/letter.pdf",

"CET\_NEET\_RankSheetPath": "/Uploads/Payana/rank.pdf",

"HouseVisitLink": "https://example.com/housevisit",

"CET\_NEET\_Rank": "12345",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"CampCount": "2",

"CampPlace": "Dharwad",

"VDSSAttended": "Yes",

"VDSS\_Topics": "Career Guidance",

"DistrictName": "Example District",

"AreaTypeName": "Urban",

"CategoryName": "General",

"CollegeTypeName": "Government",

"ApproveStatus": "Approved",

"Remark": "Verified"

}

=========================================================

DTO 2: PayanaRenewalStudentImportGridModel

=========================================================

Purpose:

Represents a row returned by GET /api/payana-renewal/import-grid.

The complete class definition was not supplied, but the controller directly assigns the following properties.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ImportID | int | Response | No | Imported record ID. |

| Timestamp | string | Response | Yes | Imported timestamp. |

| EmailAddress | string | Response | Yes | Email Address column. |

| District | string | Response | Yes | District text. |

| Taluk | string | Response | Yes | Taluk. |

| PayanaIDNumber | string | Response | Yes | Payana ID. |

| StudentName | string | Response | Yes | Student name. |

| ResidentialAddress | string | Response | Yes | Residential address. |

| CurrentAddress | string | Response | Yes | Current address. |

| DateOfBirth | string | Response | Yes | Date of birth text. |

| PrimaryWhatsAppNumber | string | Response | Yes | Primary WhatsApp number. |

| AlternateNumber | string | Response | Yes | Alternate number. |

| EmailId | string | Response | Yes | Email ID. |

| Place | string | Response | Yes | Place. |

| Caste | string | Response | Yes | Caste. |

| FathersOccupation | string | Response | Yes | Father's occupation. |

| MothersOccupation | string | Response | Yes | Mother's occupation. |

| FamilyAnnualIncome | string | Response | Yes | Family annual income. |

| ParentsBankBalance | string | Response | Yes | Parent bank balance. |

| CollegeName | string | Response | Yes | College/school name. |

| CollegeSchoolType | string | Response | Yes | College/school type. |

| CollegeContactNumber | string | Response | Yes | College contact number. |

| CourseStudying | string | Response | Yes | Course. |

| CourseStream | string | Response | Yes | Course stream. |

| AnnualCollegeSchoolFees | string | Response | Yes | Annual fees. |

| TotalEducationalExpensesForTheYear | string | Response | Yes | Total educational expenses. |

| TotalScholarshipAmountReceived202526 | string | Response | Yes | Scholarship received. |

| DonorName | string | Response | Yes | Donor name. |

| HowManyLettersYouWroteToDonorInLastYear | string | Response | Yes | Number of letters. |

| StudentAchievement202526 | string | Response | Yes | Achievement. |

| SecuredPercentageAcademicYear202526 | string | Response | Yes | Secured percentage. |

| AccountHolderNameAsPerPassbook | string | Response | Yes | Account holder. |

| BankAccountNumber | string | Response | Yes | Bank account number. |

| IFSCCode | string | Response | Yes | IFSC code. |

| BankName | string | Response | Yes | Bank name. |

| BankBranchName | string | Response | Yes | Bank branch. |

| LatestMarkSheetSemesterResultPath | string | Response | Yes | Marks/result path. |

| FeesReceiptPath | string | Response | Yes | Fees receipt path. |

| StudentBankPassbookFirstPagePath | string | Response | Yes | Passbook path. |

| StudentLatestSelfiePhotoPath | string | Response | Yes | Selfie/photo path. |

| StudentAadharCardPhotoPath | string | Response | Yes | Aadhaar path. |

| ImportedDate | DateTime? | Response | Yes | Imported date. |

| Approve | string | Response | Yes | Approval status. |

| Remarks | string | Response | Yes | Approval/rejection remark. |

Sample Response:

{

"ImportID": 1,

"Timestamp": "2026-08-28 10:30:00",

"EmailAddress": "student@example.com",

"District": "Dharwad",

"Taluk": "Dharwad",

"PayanaIDNumber": "PAY12345",

"StudentName": "Student Name",

"ResidentialAddress": "Residential address",

"CurrentAddress": "Current address",

"DateOfBirth": "2005-01-15",

"PrimaryWhatsAppNumber": "9876543210",

"AlternateNumber": "9123456780",

"EmailId": "student@example.com",

"Place": "Urban",

"Caste": "General",

"FathersOccupation": "Farmer",

"MothersOccupation": "Homemaker",

"FamilyAnnualIncome": "150000",

"ParentsBankBalance": "25000",

"CollegeName": "Example College",

"CollegeSchoolType": "Government",

"CollegeContactNumber": "9876500000",

"CourseStudying": "B.Com",

"CourseStream": "Commerce",

"AnnualCollegeSchoolFees": "50000",

"TotalEducationalExpensesForTheYear": "70000",

"TotalScholarshipAmountReceived202526": "20000",

"DonorName": "Donor Name",

"HowManyLettersYouWroteToDonorInLastYear": "2",

"StudentAchievement202526": "Good performance",

"SecuredPercentageAcademicYear202526": "85.5",

"AccountHolderNameAsPerPassbook": "Student Name",

"BankAccountNumber": "1234567890",

"IFSCCode": "SBIN0000001",

"BankName": "Example Bank",

"BankBranchName": "Main Branch",

"LatestMarkSheetSemesterResultPath": "/Uploads/mark.pdf",

"FeesReceiptPath": "/Uploads/fees.pdf",

"StudentBankPassbookFirstPagePath": "/Uploads/passbook.pdf",

"StudentLatestSelfiePhotoPath": "/Uploads/selfie.jpg",

"StudentAadharCardPhotoPath": "/Uploads/aadhaar.pdf",

"ImportedDate": "2026-08-28T10:30:00",

"Approve": "Approved",

"Remarks": "Verified"

}

=========================================================

DTO 3: DropdownModel

=========================================================

Purpose:

Common DTO used internally by the dropdown endpoint.

Important:

This class is declared as a private nested class inside the controller. It is nevertheless exposed through the JSON response.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Id | int | Response | No | ID of the master record. |

| Name | string | Response | Yes | Display name of the master record. |

Sample:

{

"Id": 1,

"Name": "Example"

}

=========================================================

DTO 4: RemarkRequest

=========================================================

Purpose:

Request DTO used by approval and rejection endpoints.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Remark | string | Optional | Yes | Approval/rejection remark. |

Sample Request:

{

"Remark": "Approved after verification."

}

Important behavior:

For PayanaRenewal approval/rejection:

\* null request => empty string

\* null Remark => empty string is passed to UpdateStatus

\* empty Remark => empty string is stored

For imported student approval/rejection:

\* null request => empty string

\* blank Remark => DBNull.Value, resulting in database NULL

=========================================================

AUTHORIZATION SUMMARY

=========================================================

Endpoint-level JWT requirements:

| Endpoint | Method | JWT Required | Filter | Role Requirement |

|----------|--------|--------------|--------|------------------|

| /api/payana-renewal | GET | No | None | None |

| /api/payana-renewal/dropdowns | GET | No | None | None |

| /api/payana-renewal/create | POST | No | None | None |

| /api/payana-renewal/list | GET | Yes | [JwtSessionFilter] | Branch Executives receive district filtering |

| /api/payana-renewal/approve/{id} | PUT | Yes | [JwtSessionFilter] | No explicit role |

| /api/payana-renewal/reject/{id} | PUT | Yes | [JwtSessionFilter] | No explicit role |

| /api/payana-renewal/delete/{id} | DELETE | Yes | [JwtSessionFilter] | No explicit role |

| /api/payana-renewal/import | POST | Yes | [JwtSessionFilter] | No explicit role |

| /api/payana-renewal/import-grid | GET | Yes | [JwtSessionFilter] | Branch Executives receive district filtering |

| /api/payana-renewal/import/{id}/approve | PUT | Yes | [JwtSessionFilter] | No explicit role |

| /api/payana-renewal/import/{id}/reject | PUT | Yes | [JwtSessionFilter] | No explicit role |

=========================================================

JWT / SESSION DEPENDENCY

=========================================================

The controller uses a custom:

[JwtSessionFilter]

on protected actions.

The controller itself does not directly read JWT claims.

Instead, protected list endpoints read authenticated identity from:

HttpContext.Current.Session["UserRole"]

and:

HttpContext.Current.Session["UserId"]

or:

HttpContext.Current.Session["UserID"]

Therefore the authentication infrastructure is expected to perform a mapping similar to:

JWT claims

↓

JwtSessionFilter

↓

HttpContext.Current.Session

↓

UserID/UserId and UserRole

Exact claim names:

Not specified in the supplied controller.

Exact JWT generation/login implementation:

Not specified in the supplied controller.

Exact 401/403 response format from JwtSessionFilter:

Not specified in the supplied controller.

Recommended Authorization Header for protected endpoints:

Authorization: Bearer <JWT\_TOKEN>

=========================================================

DATABASE TABLE SUMMARY

=========================================================

1. PayanaRenewal

Used for:

\* duplicate checking

\* creating renewal applications

\* listing renewal applications

\* approving applications

\* rejecting applications

\* soft deletion

Operations:

SELECT

INSERT

UPDATE

Duplicate condition:

LOWER(EmailId) = LOWER(@EmailId)

OR

PayanaId = @PayanaId

Approval update:

ApproveStatus

Remark

Soft delete:

Status = 0

2. GoogleSheet\_PayanaRenewal

Used for:

\* Excel import

\* imported student grid

\* imported student approval

\* imported student rejection

Operations:

INSERT

SELECT

UPDATE

Approval update:

Approve

Remarks

3. DistrictMaster

Used for:

\* dropdown data

\* joining district name to PayanaRenewal

\* Branch Executive filtering for imported records

4. AreaTypeMaster

Used for:

\* dropdown data

\* joining area type name to PayanaRenewal

5. CasteCategoryMaster

Used for:

\* dropdown data

\* joining caste/category name to PayanaRenewal

6. CollegeTypeMaster

Used for:

\* dropdown data

\* joining college type name to PayanaRenewal

7. PFatherOccupationMaster

Used for:

Father occupation dropdown.

8. MotherOccupationMaster

Used for:

Mother occupation dropdown.

9. BranchExecutiveDistrictMapping

Used for:

Restricting Branch Executives to their mapped districts.

=========================================================

FILE STORAGE SUMMARY

=========================================================

Temporary upload directory:

~/App\_Data/PayanaTemp/

Final upload directory:

~/Uploads/Payana/

Returned/stored relative path:

/Uploads/Payana/<generated-file-name>

File name generation:

<original-file-name-without-extension>\_<GUID><extension>

Example:

student\_marksheet\_550e8400-e29b-41d4-a716-446655440000.pdf

File name safety:

Path.GetFileName() is used to remove directory components from the original file name.

File extension validation:

CREATE endpoint:

No extension whitelist is implemented.

IMPORT endpoint:

Only .xlsx is accepted.

Maximum file size:

Not specified in the controller.

Multiple files:

The SaveUploadedFile helper returns the first matching multipart file for a field.

Existing file replacement:

Not applicable because the create endpoint only creates a new record and does not update existing files.

=========================================================

PAGINATION / SEARCH / FILTER SUMMARY

=========================================================

GET /api/payana-renewal/list:

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filters:

Not implemented.

Role filtering:

Implemented for Branch Executives.

UserID filtering:

Implemented indirectly for Branch Executives.

GET /api/payana-renewal/import-grid:

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filters:

Not implemented.

Role filtering:

Implemented for Branch Executives.

UserID filtering:

Implemented for Branch Executives.

=========================================================

DEFAULT VALUES AND AUTOMATIC VALUES

=========================================================

Create endpoint:

Invalid/missing int values:

0

Invalid/missing decimal values:

0

Invalid/missing LettersWritten:

0

Invalid DateOfBirth:

null

Blank OtherDistrict:

DBNull.Value / database NULL

Missing string form fields:

""

Missing uploaded files:

null

Imported endpoint:

Rows with both StudentName and Email Address blank:

Skipped

Row failure:

failedCount incremented and error added.

Approval:

PayanaRenewal ApproveStatus:

"Approved"

PayanaRenewal Reject ApproveStatus:

"Rejected"

Imported student Approve:

"Approved"

Imported student Reject:

"Rejected"

Delete:

Status:

0

No automatic CreatedDate, ModifiedDate, CreatedBy, or ModifiedBy is populated by this controller.

=========================================================

COMPLETE ENDPOINT LIST

=========================================================

1. GET

/api/payana-renewal

Authentication:

Not Required

Purpose:

API health check.

2. GET

/api/payana-renewal/dropdowns

Authentication:

Not Required

Purpose:

Returns application dropdown/master data.

3. POST

/api/payana-renewal/create

Authentication:

Not Required

Purpose:

Creates a Payana Renewal application with optional document uploads.

4. GET

/api/payana-renewal/list

Authentication:

JWT Required

Purpose:

Returns Payana Renewal records.

Branch Executive behavior:

Filters by authenticated UserID and mapped district.

5. PUT

/api/payana-renewal/approve/{id}

Authentication:

JWT Required

Purpose:

Approves a Payana Renewal record.

6. PUT

/api/payana-renewal/reject/{id}

Authentication:

JWT Required

Purpose:

Rejects a Payana Renewal record.

7. DELETE

/api/payana-renewal/delete/{id}

Authentication:

JWT Required

Purpose:

Soft-deletes a Payana Renewal record by setting Status = 0.

8. POST

/api/payana-renewal/import

Authentication:

JWT Required

Purpose:

Imports .xlsx Payana Renewal data into GoogleSheet\_PayanaRenewal.

9. GET

/api/payana-renewal/import-grid

Authentication:

JWT Required

Purpose:

Returns imported Payana Renewal records.

Branch Executive behavior:

Filters imported records by authenticated UserID and mapped district.

10. PUT

/api/payana-renewal/import/{id}/approve

Authentication:

JWT Required

Purpose:

Approves an imported Payana Renewal record.

11. PUT

/api/payana-renewal/import/{id}/reject

Authentication:

JWT Required

Purpose:

Rejects an imported Payana Renewal record.

=========================================================

FINAL CONTRACT VERIFICATION

=========================================================

Controller endpoints reviewed:

11

Public endpoints:

3

JWT-protected endpoints:

8

Controller-level JWT filter:

None

Action-level JWT filter:

Yes, on protected endpoints through [JwtSessionFilter]

Public endpoints intentionally left without JWT:

\* GET /api/payana-renewal

\* GET /api/payana-renewal/dropdowns

\* POST /api/payana-renewal/create

Branch Executive-specific filtering:

\* GET /api/payana-renewal/list

\* GET /api/payana-renewal/import-grid

User identity/session dependencies:

\* Session["UserRole"]

\* Session["UserId"]

\* Session["UserID"]

Soft delete:

Yes

Soft-delete column:

PayanaRenewal.Status = 0

Excel import:

Yes

Excel format:

.xlsx only

File upload:

Yes

Create upload fields:

7

Explicitly mandatory create form fields:

\* EmailId

\* PayanaId

Explicitly mandatory create files:

None

Duplicate check:

Yes

Duplicate keys:

\* EmailId, case-insensitive

\* PayanaId

Pagination:

Not implemented

Search:

Not implemented

Sorting:

Not implemented

Transactions:

No explicit SQL transactions

Stored procedures:

None

CreatedBy/ModifiedBy:

Not implemented in supplied controller

JWT claims directly read in controller:

None

JWT-to-Session mapping:

Expected through JwtSessionFilter/authentication infrastructure, but exact implementation is not included.

Maximum file sizes:

Not specified in controller.

File extension validation for create:

Not specified/implemented.

File extension validation for import:

.xlsx only.

Database tables directly visible:

\* PayanaRenewal

\* GoogleSheet\_PayanaRenewal

\* DistrictMaster

\* AreaTypeMaster

\* CasteCategoryMaster

\* CollegeTypeMaster

\* PFatherOccupationMaster

\* MotherOccupationMaster

\* BranchExecutiveDistrictMapping

=========================================================

IMPORTANT IMPLEMENTATION NOTES

=========================================================

1. The controller does NOT apply JWT globally.

2. GET /dropdowns and POST /create are public because no JWT filter is applied to those actions.

3. GET /list and GET /import-grid are the only endpoints that explicitly use authenticated Session values inside the controller.

4. Branch Executive filtering is implemented only when the session role exactly matches "Branch Executives" using case-insensitive comparison.

5. There is no explicit Admin-only, Manager-only, or Employee-only authorization in the supplied controller.

6. The approval, rejection, deletion, and import operations are protected by JwtSessionFilter, but no specific role restriction is explicitly implemented inside these actions.

7. The exact authorization behavior of JwtSessionFilter is outside the supplied controller and therefore cannot be documented beyond its visible usage.

8. The create endpoint performs a duplicate check before inserting.

9. The duplicate check treats EmailId case-insensitively but PayanaId comparison is performed directly.

10. The create endpoint does not explicitly validate email format.

11. The create endpoint does not explicitly validate uploaded file extensions.

12. The create endpoint does not explicitly validate uploaded file sizes.

13. The import endpoint processes the first worksheet only.

14. The import endpoint starts processing from row 2, assuming row 1 contains headers.

15. The import endpoint does not actually validate header names; it relies entirely on fixed column positions.

16. Import row errors do not abort the entire import.

17. The import endpoint can return HTTP 200 even when some rows fail.

18. Delete is a soft delete, not a physical DELETE.

19. The supplied GET /list SQL does not explicitly filter Status = 0, so the controller does not prove that soft-deleted records are excluded from the list.

20. No pagination, search, sorting, or date-filter functionality exists in the supplied controller.

21. No database transaction is explicitly used.

22. No CreatedBy, ModifiedBy, CreatedDate, or ModifiedDate is populated by this controller.

23. Exact property types and DataAnnotation requirements of PayanaRenewalVM and PayanaRenewalStudentImportGridModel cannot be completely verified because their class definitions were not included in the supplied code. The contract therefore distinguishes fields directly used by the controller from requirements that are not specified.

24. Exact JWT claim names cannot be determined because the JwtSessionFilter implementation was not included.

25. Exact 401/403 response bodies cannot be determined because they are controlled by the authentication/authorization filter and are not returned explicitly by the controller.