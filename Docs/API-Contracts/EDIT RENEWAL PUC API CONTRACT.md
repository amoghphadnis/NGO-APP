=========================================================

API CONTRACT — EDIT / RENEWAL PUC

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/renewal-puc

Authentication Scope:

JWT authentication is NOT applied at controller level.

JWT is explicitly applied only to:

1. GET /api/renewal-puc/{id}

2. POST /api/renewal-puc/update

The following endpoint does NOT have JwtSessionFilter in the supplied controller:

3. GET /api/renewal-puc/districts

No role-based authorization or JWT claim usage is visible in this controller.

Important:

The supplied controller uses [JwtSessionFilter] on the two record-specific endpoints, but the implementation of JwtSessionFilter is not supplied. Therefore, the exact JWT claims, session values, token validation rules, and roles enforced by that filter are NOT specified in this controller.

=========================================================

1. GET RENEWAL PUC RECORD

=========================================================

Endpoint:

GET /api/renewal-puc/{id}

Purpose:

Retrieves a single RenewalPUC record from the RenewalPUC database table using its Id.

Content-Type:

Not applicable for the request.

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* JWT is applied at ACTION LEVEL through [JwtSessionFilter].

\* No controller-level JWT filter is present.

\* No explicit role requirement is specified in this controller.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: The action itself does not directly read JWT claims.

\* Session dependency: No session values are directly read by this action.

\* Exact behavior of JwtSessionFilter is not available in the supplied code.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | RenewalPUC record ID. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are used. |

Request Body:

None.

Validation Rules:

\* id must be a valid integer.

\* id must be greater than 0.

\* If id <= 0, the API returns 400 Bad Request.

\* The database is queried using parameterized SQL.

\* If no RenewalPUC record exists for the supplied Id, the API returns 404 Not Found.

\* No additional business validation is implemented in this action.

Database Behavior:

Table accessed:

RenewalPUC

SQL operation:

SELECT

Filter:

WHERE Id = @Id

The endpoint retrieves all columns using SELECT \* and maps the returned database record into the RenewalPUC model using MapRenewalPUC().

Success Response (200):

{

"success": true,

"data": {

"Id": 156,

"Email": "student@example.com",

"ApplicantName": "John Doe",

"VPID": "VP12345",

"WhatsApp": "9876543210",

"AlternateNumber": "9123456780",

"District": 5,

"Taluk": "Dharwad",

"Address": "Main Road, Dharwad",

"Gender": "Male",

"DOB": "2005-06-15T00:00:00",

"LatestResult": "85%",

"ScholarshipAmount": 15000.00,

"DonorName": "ABC Donor",

"LettersCount": 2,

"Course": "PUC",

"CourseYear": "2nd Year",

"CourseStream": "Science",

"CollegeName": "ABC College",

"CollegeContact": "9876543210",

"CollegeType": "Government",

"CollegeFees": 25000.00,

"TotalExpenses": 40000.00,

"Achievements": "District Level Achievement",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"CampCount": "2",

"CampPlace": "Dharwad",

"CampDate": "2026-06-15T00:00:00",

"VDSSAttended": "Yes",

"VDSS\_Topics": "Career Guidance",

"AccountHolderName": "John Doe",

"AccountNumber": "123456789012",

"IFSC": "SBIN0001234",

"BankName": "State Bank of India",

"BranchName": "Dharwad",

"ParentBankBalance": 5000.00,

"MarksheetPath": "/Uploads/marksheet-file.pdf",

"ThankingLetterPath": "/Uploads/thanking-letter.pdf",

"PassbookPath": "/Uploads/passbook.pdf",

"PhotoPath": "/Uploads/photo.jpg",

"FeesReceiptPath": "/Uploads/fees-receipt.pdf",

"ThankingVideoPath": "/Uploads/video.mp4",

"HouseVisitLink": "https://example.com/housevisit"

}

}

Failure Responses:

400 Bad Request

Occurs when id is <= 0.

Example:

{

"success": false,

"message": "Invalid Renewal PUC ID."

}

401 Unauthorized

Applicable when the existing JwtSessionFilter rejects the request because the JWT is missing, invalid, expired, or otherwise fails authentication.

Exact 401 behavior is controlled by JwtSessionFilter and is not implemented directly in this action.

403 Forbidden

Applicable if JwtSessionFilter or the application's authorization pipeline denies an authenticated user.

No explicit role restriction is visible in this controller.

404 Not Found

Occurs when no RenewalPUC record exists for the supplied Id.

Example:

{

"success": false,

"message": "Renewal PUC record not found."

}

409 Conflict

Not explicitly used by this action.

500 Internal Server Error

Occurs when an unexpected exception is thrown while processing the request or reading the database.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized — filter/pipeline level

\* 403 Forbidden — filter/pipeline level

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

2. GET DISTRICTS

=========================================================

Endpoint:

GET /api/renewal-puc/districts

Purpose:

Returns the district list from DistrictMaster.

Content-Type:

Not applicable for the request.

Authorization:

\* Not Required

\* No [JwtSessionFilter] or [Authorize] attribute is present on this action.

\* No JWT claims are used.

\* No UserID, EmployeeID, or Role filtering is performed.

JWT / Authorization Details:

\* JWT Required: No

\* Reason: The action contains no authentication or authorization attribute and performs a general DistrictMaster lookup.

\* Required Claims: None.

\* Required Roles: None.

\* Session dependency: None.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are used. |

Request Body:

None.

Validation Rules:

\* No request parameters are validated.

\* No UserID filtering exists.

\* No EmployeeID filtering exists.

\* No Role filtering exists.

\* No active/inactive filtering is implemented.

\* No "-- Select --" option is added by this controller.

\* District records are returned directly from DistrictMaster.

Database Behavior:

Table accessed:

DistrictMaster

SQL operation:

SELECT

Query:

SELECT DistrictID, DistrictName

FROM DistrictMaster

No WHERE clause is present.

Therefore all rows returned by the database query are included.

Success Response (200):

{

"success": true,

"count": 3,

"data": [

{

"DistrictID": 1,

"DistrictName": "Dharwad"

},

{

"DistrictID": 2,

"DistrictName": "Belagavi"

},

{

"DistrictID": 3,

"DistrictName": "Haveri"

}

]

}

Dropdown Details:

\* Endpoint: GET /api/renewal-puc/districts

\* Authorization: Not Required

\* UserID filtering: No

\* EmployeeID filtering: No

\* Role filtering: No

\* Active/inactive filtering: No

\* Default "-- Select --" option: Not added by API

\* Data source: DistrictMaster

\* Returned fields: DistrictID, DistrictName

Failure Responses:

400 Bad Request

Not explicitly returned by this endpoint.

401 Unauthorized

Not expected from this action because no JWT filter or authorization attribute is applied.

403 Forbidden

Not explicitly implemented by this action.

404 Not Found

Not explicitly returned by this action.

409 Conflict

Not explicitly returned by this action.

500 Internal Server Error

Occurs when an unexpected database or application exception occurs.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK

\* 500 Internal Server Error

=========================================================

3. UPDATE RENEWAL PUC

=========================================================

Endpoint:

POST /api/renewal-puc/update

Purpose:

Updates an existing RenewalPUC record.

The endpoint accepts multipart/form-data so that normal RenewalPUC fields and optional file uploads can be submitted in the same request.

Only fields supplied in the multipart request are changed in memory before the database UPDATE. Fields that are not supplied retain their existing database values.

Content-Type:

multipart/form-data

Authorization:

\* JWT Required

\* Expected format:

Authorization: Bearer <JWT\_TOKEN>

\* JWT is applied at ACTION LEVEL through [JwtSessionFilter].

\* No controller-level JWT filter is present.

\* No explicit role requirement is specified in this controller.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: The action itself does not directly read JWT claims.

\* Session dependency: No Session values are directly read by the action.

\* Exact authentication/authorization behavior depends on JwtSessionFilter implementation, which is not supplied.

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | The record ID is supplied as multipart form data, not as a route parameter. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are used. |

Request Body:

The request must be multipart/form-data.

The Id field is mandatory because the endpoint uses provider.FormData["Id"] to identify the existing RenewalPUC record.

Example multipart form-data:

Id=156

Email=student@example.com

ApplicantName=John Doe

VPID=VP12345

WhatsApp=9876543210

AlternateNumber=9123456780

District=5

Taluk=Dharwad

Address=Main Road

Gender=Male

DOB=2005-06-15

LatestResult=85%

ScholarshipAmount=15000

DonorName=ABC Donor

LettersCount=2

Course=PUC

CourseYear=2nd Year

CourseStream=Science

CollegeName=ABC College

CollegeContact=9876543210

CollegeType=Government

CollegeFees=25000

TotalExpenses=40000

Achievements=District Level Achievement

InvitedToCamp=Yes

AttendedCamp=Yes

CampCount=2

CampPlace=Dharwad

CampDate=2026-06-15

VDSSAttended=Yes

VDSS\_Topics=Career Guidance

AccountHolderName=John Doe

AccountNumber=123456789012

IFSC=SBIN0001234

BankName=State Bank of India

BranchName=Dharwad

ParentBankBalance=5000

HouseVisitLink=https://example.com/housevisit

Form Data / Multipart Fields:

| Field | Type | Required | Description |

|------|------|----------|-------------|

| Id | int | Yes | RenewalPUC record ID. Must be greater than 0 and must exist in RenewalPUC. |

| Email | string | Optional | Applicant email address. |

| ApplicantName | string | Optional | Applicant name. |

| VPID | string | Optional | Vidya Poshak/application identifier. |

| WhatsApp | string | Optional | WhatsApp contact number. |

| AlternateNumber | string | Optional | Alternate contact number. |

| District | int | Optional | District ID. Must be a valid integer if supplied. |

| Taluk | string | Optional | Taluk name. |

| Address | string | Optional | Address. |

| Gender | string | Optional | Gender value. No allowed-value validation is implemented. |

| DOB | date | Optional / Nullable | Date of birth. Empty value sets DOB to null. |

| LatestResult | string | Optional | Latest academic result. |

| ScholarshipAmount | decimal | Optional | Scholarship amount. Must be a valid decimal if supplied. |

| DonorName | string | Optional | Donor name. |

| LettersCount | int | Optional | Number of letters. Must be a valid integer if supplied. |

| Course | string | Optional | Course name. |

| CourseYear | string | Optional | Course year. |

| CourseStream | string | Optional | Course stream. |

| CollegeName | string | Optional | College name. |

| CollegeContact | string | Optional | College contact number. |

| CollegeType | string | Optional | College type. |

| CollegeFees | decimal | Optional | College fees. Must be a valid decimal if supplied. |

| TotalExpenses | decimal | Optional | Total expenses. Must be a valid decimal if supplied. |

| Achievements | string | Optional | Achievements. |

| InvitedToCamp | string | Optional | Camp invitation status/value. |

| AttendedCamp | string | Optional | Camp attendance status/value. |

| CampCount | string | Optional | Camp count. Stored/handled as string by the controller. |

| CampPlace | string | Optional | Camp location. |

| CampDate | date | Optional / Nullable\* | Camp date. |

| VDSSAttended | string | Optional | VDSS attendance information. |

| VDSS\_Topics | string | Optional | VDSS topics. |

| AccountHolderName | string | Optional | Bank account holder name. |

| AccountNumber | string | Optional | Bank account number. |

| IFSC | string | Optional | Bank IFSC code. |

| BankName | string | Optional | Bank name. |

| BranchName | string | Optional | Bank branch name. |

| ParentBankBalance | decimal | Optional | Parent bank balance. Must be a valid decimal if supplied. |

| HouseVisitLink | string | Optional | House visit URL/link. |

\*Important CampDate behavior:

If CampDate is omitted, the existing value is retained.

If CampDate is supplied as a non-empty valid date, it is updated.

If CampDate is supplied as an empty string, the controller sets vm.CampDate = DateTime.MinValue. If CampDate is a nullable DateTime property, the later database code checks HasValue and therefore DateTime.MinValue is sent to SQL rather than DBNull. This is an implementation detail/edge case of the supplied controller.

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|------|------|----------|--------------------|----------|-------------|

| Marksheet | File | Optional | Not validated in controller | Not specified | New marksheet file. |

| Passbook | File | Optional | Not validated in controller | Not specified | New passbook file. |

| Photo | File | Optional | Not validated in controller | Not specified | New applicant photo. |

| FeesReceiptPath | File | Optional | Not validated in controller | Not specified | New fees receipt file. |

| ThankingVideo | File | Optional | Not validated in controller | Not specified | New thanking video file. |

| ThankingLetter | File | Optional | Not validated in controller | Not specified | New thanking letter file. |

File Upload Rules:

\* All six file fields are optional.

\* There is no mandatory file validation in the controller.

\* Multiple files for the same field are not intentionally supported by the controller; GetUploadedFile() returns the first matching file.

\* File extension validation is NOT implemented.

\* MIME type validation is NOT implemented.

\* File size validation is NOT implemented.

\* Maximum file size is NOT specified in the controller.

\* The server/application/IIS/ASP.NET configuration may still impose upload-size limits, but those limits are not defined here.

\* A GUID is generated for each newly saved file.

\* The original extension is preserved using Path.GetExtension(file.FileName).

\* The physical file is stored under:

~/Uploads/

\* The returned database path is:

/Uploads/{generated-file-name}

\* Existing database file paths are retained when a corresponding new file is not supplied.

\* When a new file is supplied, its generated path replaces the existing database path.

\* The controller does NOT delete the old physical file when a new file replaces it.

\* File names are not preserved; a GUID-based filename is generated.

Generated File Name Logic:

{GUID}{original-extension}

Example:

c6d8deaa-be3a-49f8-81ed-4041285e8cb8.pdf

Physical location:

~/Uploads/c6d8deaa-be3a-49f8-81ed-4041285e8cb8.pdf

Database value:

/Uploads/c6d8deaa-be3a-49f8-81ed-4041285e8cb8.pdf

Validation Rules:

Request Content-Type:

\* Must be multipart/form-data.

\* Otherwise 400 Bad Request is returned.

Id:

\* Id must be present.

\* Id must parse successfully as an integer.

\* Id must be greater than 0.

\* If invalid, 400 Bad Request is returned.

\* The Id must correspond to an existing RenewalPUC record.

\* If the record does not exist, 404 Not Found is returned.

District:

\* Optional.

\* If supplied, it must parse successfully as an integer.

\* Invalid District produces 400 Bad Request.

\* No validation is performed to verify that the District exists in DistrictMaster.

LettersCount:

\* Optional.

\* If supplied, it must parse successfully as an integer.

\* Invalid LettersCount produces 400 Bad Request.

ScholarshipAmount:

\* Optional.

\* If supplied, it must parse successfully as a decimal.

\* Invalid value produces 400 Bad Request.

CollegeFees:

\* Optional.

\* If supplied, it must parse successfully as a decimal.

\* Invalid value produces 400 Bad Request.

TotalExpenses:

\* Optional.

\* If supplied, it must parse successfully as a decimal.

\* Invalid value produces 400 Bad Request.

ParentBankBalance:

\* Optional.

\* If supplied, it must parse successfully as a decimal.

\* Invalid value produces 400 Bad Request.

DOB:

\* Optional.

\* If supplied as a non-empty value, it must parse using DateTime.TryParse().

\* Invalid DOB produces 400 Bad Request.

\* Empty DOB explicitly sets vm.DOB = null.

CampDate:

\* Optional.

\* If supplied as a non-empty value, it must parse using DateTime.TryParse().

\* Invalid CampDate produces 400 Bad Request.

\* Empty CampDate is converted to DateTime.MinValue by the supplied controller.

String fields:

\* Optional.

\* If a field is omitted, its existing value is retained.

\* If a string field is supplied, including an empty string, the supplied value replaces the existing value.

\* No minimum length or maximum length validation is implemented.

\* No email-format validation is implemented for Email.

\* No phone-number validation is implemented.

\* No IFSC-format validation is implemented.

\* No URL validation is implemented for HouseVisitLink.

\* No allowed-value validation is implemented for Gender, CollegeType, InvitedToCamp, AttendedCamp, VDSSAttended, etc.

Files:

\* Optional.

\* No extension validation.

\* No MIME validation.

\* No file-size validation.

\* No required-file rule.

\* Existing file path retained if no replacement file is uploaded.

Authentication:

\* JWT is required because [JwtSessionFilter] is explicitly applied to this action.

\* Exact token claims and roles are not specified in the supplied controller.

Business Logic Notes:

1. The endpoint first verifies multipart/form-data.

2. It creates ~/Uploads/ if it does not exist.

3. It creates ~/Uploads/Temp if it does not exist.

4. Multipart data is parsed using MultipartFormDataStreamProvider.

5. Uploaded files are initially stored by the multipart provider in the Temp folder.

6. The controller loads the existing RenewalPUC record using Id.

7. The database record is mapped into RenewalPUC.

8. Only supplied form fields are assigned to the model.

9. Fields not supplied remain unchanged because the existing model values are retained.

10. New files are saved to ~/Uploads/ using GUID-based filenames.

11. The final SQL UPDATE updates all listed RenewalPUC fields using the values in the model.

12. File columns use ISNULL(@FilePath, ExistingFilePath), so a missing replacement file retains the existing database path.

13. A supplied replacement file changes the database path.

14. The controller does not delete replaced physical files.

15. There is no explicit transaction around file saving and database updating.

16. Therefore, if file saving succeeds but database update fails, the newly saved file can remain on disk without the database pointing to it.

17. Conversely, database update and file operations are not atomic.

18. No CreatedBy or ModifiedBy value is populated by this controller.

19. No UserID is populated from JWT.

20. No EmployeeID is populated from JWT.

21. No Role is read directly by this action.

22. No duplicate-record check is performed.

23. No status change is performed.

24. No audit timestamp is explicitly set by this controller.

25. No soft-delete logic is present.

26. No pagination, searching, sorting, or filtering is present.

27. The update is performed using a parameterized SQL UPDATE statement.

28. rowsAffected is checked after ExecuteNonQuery().

29. If rowsAffected == 0, the endpoint returns 404 Not Found.

Database Behavior:

Table:

RenewalPUC

Operation:

UPDATE

WHERE condition:

WHERE Id = @Id

Updated columns:

\* Email

\* ApplicantName

\* VPID

\* WhatsApp

\* AlternateNumber

\* District

\* Taluk

\* Address

\* Gender

\* DOB

\* LatestResult

\* ScholarshipAmount

\* DonorName

\* LettersCount

\* Course

\* CourseYear

\* CourseStream

\* CollegeName

\* CollegeContact

\* CollegeType

\* CollegeFees

\* TotalExpenses

\* Achievements

\* InvitedToCamp

\* AttendedCamp

\* CampCount

\* CampPlace

\* CampDate

\* VDSSAttended

\* VDSS\_Topics

\* AccountHolderName

\* AccountNumber

\* IFSC

\* BankName

\* BranchName

\* ParentBankBalance

\* HouseVisitLink

\* MarksheetPath

\* ThankingLetterPath

\* PassbookPath

\* PhotoPath

\* FeesReceiptPath

\* ThankingVideoPath

No explicit transaction is used.

Success Response (200):

{

"success": true,

"message": "Renewal PUC Updated Successfully",

"id": 156

}

Failure Responses:

400 Bad Request

Possible reasons:

1. Request is not multipart/form-data.

2. Id is missing.

3. Id is not a valid integer.

4. Id is <= 0.

5. District is not a valid integer.

6. LettersCount is not a valid integer.

7. ScholarshipAmount is not a valid decimal.

8. CollegeFees is not a valid decimal.

9. TotalExpenses is not a valid decimal.

10. ParentBankBalance is not a valid decimal.

11. DOB is not a valid date.

12. CampDate is not a valid date.

Example:

{

"success": false,

"message": "Invalid District value."

}

Another example:

{

"success": false,

"message": "Request must use multipart/form-data."

}

401 Unauthorized

Applicable when the existing JwtSessionFilter rejects the request due to missing, invalid, expired, or otherwise unacceptable authentication credentials.

Exact behavior is determined by JwtSessionFilter.

403 Forbidden

Applicable if the application's authorization/filter pipeline denies an authenticated user.

No specific role is defined in this controller.

404 Not Found

Possible reasons:

1. The RenewalPUC record does not exist for the supplied Id.

2. ExecuteNonQuery() returns zero affected rows.

Example:

{

"success": false,

"message": "Renewal PUC record not found."

}

409 Conflict

Not explicitly implemented.

500 Internal Server Error

Occurs for unhandled exceptions, including possible database, file-system, multipart-processing, or other runtime errors.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized — authentication filter/pipeline

\* 403 Forbidden — authorization filter/pipeline

\* 404 Not Found

\* 500 Internal Server Error

=========================================================

COMMON DTOs / MODELS

=========================================================

DTO / Model Name:

RenewalPUC

Purpose:

Represents a Renewal PUC record loaded from the RenewalPUC database table and returned by the GET endpoint. It is also used internally as the in-memory model during the update operation.

Important:

The actual RenewalPUC class definition was NOT supplied with the controller. Therefore, the exact CLR property types, attributes such as [Required], maximum lengths, and nullable declarations cannot be fully verified from the controller alone.

The properties below are determined from the controller's MapRenewalPUC() method and update logic.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Id | int | Yes for record identification | No | RenewalPUC record identifier. |

| Email | string | Optional | Yes | Applicant email. No email-format validation is implemented. |

| ApplicantName | string | Optional | Yes | Applicant name. |

| VPID | string | Optional | Yes | VPID/application identifier. |

| WhatsApp | string | Optional | Yes | WhatsApp contact number. |

| AlternateNumber | string | Optional | Yes | Alternate contact number. |

| District | int | Optional | No in mapped model | District identifier. Database NULL maps to 0. |

| Taluk | string | Optional | Yes | Taluk. |

| Address | string | Optional | Yes | Address. |

| Gender | string | Optional | Yes | Gender. |

| DOB | DateTime? | Optional | Yes | Date of birth when database value is non-null. |

| LatestResult | string | Optional | Yes | Latest result. |

| ScholarshipAmount | decimal | Optional | No in mapped model | Scholarship amount. Database NULL maps to 0. |

| DonorName | string | Optional | Yes | Donor name. |

| LettersCount | int | Optional | No in mapped model | Letter count. Database NULL maps to 0. |

| Course | string | Optional | Yes | Course. |

| CourseYear | string | Optional | Yes | Course year. |

| CourseStream | string | Optional | Yes | Course stream. |

| CollegeName | string | Optional | Yes | College name. |

| CollegeContact | string | Optional | Yes | College contact. |

| CollegeType | string | Optional | Yes | College type. |

| CollegeFees | decimal | Optional | No in mapped model | College fees. Database NULL maps to 0. |

| TotalExpenses | decimal | Optional | No in mapped model | Total expenses. Database NULL maps to 0. |

| Achievements | string | Optional | Yes | Achievements. |

| InvitedToCamp | string | Optional | Yes | Camp invitation information. |

| AttendedCamp | string | Optional | Yes | Camp attendance information. |

| CampCount | string | Optional | Yes | Camp count stored/handled as string. |

| CampPlace | string | Optional | Yes | Camp location. |

| CampDate | DateTime? | Optional | Yes | Camp date. |

| VDSSAttended | string | Optional | Yes | VDSS attendance information. |

| VDSS\_Topics | string | Optional | Yes | VDSS topics. |

| AccountHolderName | string | Optional | Yes | Bank account holder name. |

| AccountNumber | string | Optional | Yes | Bank account number. |

| IFSC | string | Optional | Yes | Bank IFSC code. |

| BankName | string | Optional | Yes | Bank name. |

| BranchName | string | Optional | Yes | Bank branch name. |

| ParentBankBalance | decimal | Optional | No in mapped model | Parent bank balance. Database NULL maps to 0. |

| MarksheetPath | string | Optional | Yes | Stored marksheet file path. |

| ThankingLetterPath | string | Optional | Yes | Stored thanking letter path. |

| PassbookPath | string | Optional | Yes | Stored passbook path. |

| PhotoPath | string | Optional | Yes | Stored photo path. |

| FeesReceiptPath | string | Optional | Yes | Stored fees receipt path. |

| ThankingVideoPath | string | Optional | Yes | Stored thanking video path. |

| HouseVisitLink | string | Optional | Yes | House visit link. |

Sample GET Response Model:

{

"Id": 156,

"Email": "student@example.com",

"ApplicantName": "John Doe",

"VPID": "VP12345",

"WhatsApp": "9876543210",

"AlternateNumber": "9123456780",

"District": 5,

"Taluk": "Dharwad",

"Address": "Main Road, Dharwad",

"Gender": "Male",

"DOB": "2005-06-15T00:00:00",

"LatestResult": "85%",

"ScholarshipAmount": 15000.00,

"DonorName": "ABC Donor",

"LettersCount": 2,

"Course": "PUC",

"CourseYear": "2nd Year",

"CourseStream": "Science",

"CollegeName": "ABC College",

"CollegeContact": "9876543210",

"CollegeType": "Government",

"CollegeFees": 25000.00,

"TotalExpenses": 40000.00,

"Achievements": "District Level Achievement",

"InvitedToCamp": "Yes",

"AttendedCamp": "Yes",

"CampCount": "2",

"CampPlace": "Dharwad",

"CampDate": "2026-06-15T00:00:00",

"VDSSAttended": "Yes",

"VDSS\_Topics": "Career Guidance",

"AccountHolderName": "John Doe",

"AccountNumber": "123456789012",

"IFSC": "SBIN0001234",

"BankName": "State Bank of India",

"BranchName": "Dharwad",

"ParentBankBalance": 5000.00,

"MarksheetPath": "/Uploads/marksheet-file.pdf",

"ThankingLetterPath": "/Uploads/thanking-letter.pdf",

"PassbookPath": "/Uploads/passbook.pdf",

"PhotoPath": "/Uploads/photo.jpg",

"FeesReceiptPath": "/Uploads/fees-receipt.pdf",

"ThankingVideoPath": "/Uploads/video.mp4",

"HouseVisitLink": "https://example.com/housevisit"

}

=========================================================

DROPDOWN / LOOKUP API SUMMARY

=========================================================

Dropdown Endpoint:

GET /api/renewal-puc/districts

Authorization:

Not Required.

Source:

DistrictMaster

Returned properties:

| Property | Type | Description |

|----------|------|-------------|

| DistrictID | int | District identifier. |

| DistrictName | string | District display name. |

Response:

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

No default "-- Select --" record is added.

No active/inactive condition is present.

No UserID, EmployeeID, or Role filtering is present.

=========================================================

AUTHENTICATION SUMMARY

=========================================================

Endpoint Authentication Matrix:

| Endpoint | HTTP Method | JWT Required | JWT Filter Scope | Role Required |

|----------|-------------|--------------|------------------|---------------|

| /api/renewal-puc/{id} | GET | Yes | Action-level [JwtSessionFilter] | Not specified |

| /api/renewal-puc/districts | GET | No | No JWT filter | None |

| /api/renewal-puc/update | POST | Yes | Action-level [JwtSessionFilter] | Not specified |

Important Authorization Conclusion:

The controller does NOT contain a controller-level [JwtSessionFilter].

Therefore:

\* GET /api/renewal-puc/{id} is protected.

\* POST /api/renewal-puc/update is protected.

\* GET /api/renewal-puc/districts is public according to the supplied controller.

The controller does not directly access JWT claims such as UserID, EmployeeID, or Role.

The controller does not directly read Session values populated from JWT claims.

The controller does not contain [Authorize(Roles = "...")] or any explicit role check.

Any additional authentication or role behavior would have to come from the implementation of JwtSessionFilter or global Web API configuration, neither of which is supplied here.

=========================================================

COMPLETE ENDPOINT LIST

=========================================================

1. GET /api/renewal-puc/{id}

Purpose: Retrieve a RenewalPUC record.

JWT: Required.

Filter: Action-level [JwtSessionFilter].

2. GET /api/renewal-puc/districts

Purpose: Retrieve all districts.

JWT: Not Required.

Filter: None.

3. POST /api/renewal-puc/update

Purpose: Update an existing RenewalPUC record with optional replacement files.

JWT: Required.

Filter: Action-level [JwtSessionFilter].

Content-Type: multipart/form-data.

=========================================================

IMPLEMENTATION NOTES / CONTRACT LIMITATIONS

=========================================================

1. The actual RenewalPUC model class was not supplied. Required attributes, database nullability, maximum string lengths, and exact property types that are not directly inferable cannot be confirmed.

2. No explicit [Required] attributes are visible in the controller.

3. The only explicitly required update field implemented by the controller is Id.

4. All other update fields are optional from the controller's perspective.

5. The controller does not validate Email format.

6. The controller does not validate phone-number format.

7. The controller does not validate IFSC format.

8. The controller does not validate HouseVisitLink as a URL.

9. The controller does not validate that District exists in DistrictMaster.

10. The controller does not validate that numeric values are positive or within a business-specific range. It only verifies that the values can be parsed as int/decimal.

11. The controller does not validate date ranges.

12. The controller does not validate file extensions.

13. The controller does not validate MIME types.

14. The controller does not enforce a maximum upload size.

15. The controller does not require any uploaded file.

16. If a file is not supplied during update, the existing database file path is retained.

17. If a new file is supplied, a new GUID-based filename is generated.

18. The old physical file is not deleted when replaced.

19. Uploaded multipart temporary files are handled through MultipartFormDataStreamProvider.

20. The controller creates ~/Uploads/ and ~/Uploads/Temp/ if they do not exist.

21. There is no explicit transaction covering file operations and database update.

22. There is no explicit duplicate check.

23. There is no explicit status update.

24. There is no explicit CreatedBy or ModifiedBy update.

25. There is no explicit UserID/EmployeeID filtering.

26. There is no pagination.

27. There is no sorting.

28. There is no search functionality.

29. There are no date filters.

30. The districts endpoint returns every row from DistrictMaster because it has no WHERE clause.

31. No role requirements are visible in the supplied controller.

32. The exact 401/403 behavior for protected endpoints depends on JwtSessionFilter and the application's Web API authentication configuration.

33. The GET record endpoint uses SELECT \* from RenewalPUC.

34. The update endpoint updates the RenewalPUC table using a parameterized UPDATE statement.

35. Database operations use SqlConnection and SqlCommand with the EnvisageDb connection string.

=========================================================

FINAL API CONTRACT CHECK

=========================================================

\* All 3 controller endpoints are documented.

\* HTTP methods are documented.

\* Route prefix is documented.

\* Exact routes are documented.

\* JWT is applied only where [JwtSessionFilter] is actually present.

\* GET /districts is explicitly identified as public.

\* No controller-level JWT requirement has been invented.

\* No role requirement has been invented.

\* JWT claims are documented as not specified because the filter implementation is unavailable.

\* No Session dependency is claimed because none is directly used.

\* Path parameters are documented.

\* Query parameters are documented.

\* Multipart request requirements are documented.

\* All normal form fields visible in the update action are documented.

\* All file fields visible in the update action are documented.

\* File requiredness is documented.

\* File extension and size validation limitations are documented.

\* Existing-file retention behavior is documented.

\* GUID filename generation is documented.

\* Default/null behavior is documented where visible.

\* District dropdown behavior is documented.

\* Database tables and SQL operations visible in the controller are documented.

\* Success responses are documented.

\* Failure responses are documented.

\* Status codes are documented.

\* RenewalPUC model properties exposed by the controller are documented.

\* No DTO or field not visible in the supplied controller has been intentionally invented.

\* Where the actual model/filter implementation is unavailable, the contract explicitly states "Not specified in controller."