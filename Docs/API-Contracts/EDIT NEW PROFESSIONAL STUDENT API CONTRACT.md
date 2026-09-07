=========================================================

EDIT NEW PROFESSIONAL STUDENT API CONTRACT

===========

API Name:

Edit New Professional Student API

Technology:

ASP.NET Web API 2 / .NET Framework

API BASE ROUTE

==============

Route Prefix:

/api/edit-new-professional-student

Authentication:

JWT authentication is NOT applied at controller level.

The controller explicitly applies [JwtSessionFilter] at the action level on all three exposed endpoints:

1. GET /api/edit-new-professional-student/{id}

2. POST /api/edit-new-professional-student/update

3. GET /api/edit-new-professional-student/dropdowns

Therefore, JWT is currently required for all endpoints implemented in this controller.

The controller also contains an Index endpoint:

4. GET /api/edit-new-professional-student/index

This endpoint has [JwtSessionFilter] as well and therefore JWT is also required.

No role-based authorization is implemented in the supplied controller.

No JWT claims are directly read by these controller actions.

No Session values are directly accessed by these controller actions.

The exact claims/session values required internally by JwtSessionFilter are not specified in this controller.

=========================================================

1. GET NEW PROFESSIONAL STUDENT DETAILS

========================================

Endpoint:

GET /api/edit-new-professional-student/{id}

Purpose:

Retrieves the complete editable New Professional student/application details for the specified ApplicationID.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* JWT Filter:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

Not specified in controller

\* Required Claims:

Not specified in controller

\* JWT claims used directly by action:

None

\* Session values used directly by action:

None

\* Any claims/session validation performed internally by JwtSessionFilter:

Not specified in controller

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller

\* Required Roles: None specified

\* How claims are used: The action itself does not directly read JWT claims.

\* Session dependency: None visible in the action.

\* The exact authentication/claim requirements implemented by JwtSessionFilter cannot be determined from the supplied controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the New Professional student/application. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are used by this endpoint. |

Request Body:

None.

Sample Request:

GET /api/edit-new-professional-student/101

Authorization: Bearer <JWT\_TOKEN>

Validation Rules:

\* id is required as a route parameter.

\* id must be a valid integer.

\* id must be greater than 0.

\* If id is less than or equal to 0, the API returns HTTP 400.

\* The ApplicationID is used to query NewProfessionalApplication.

\* If no database record exists for the ApplicationID, HTTP 404 is returned.

\* No additional field validation is performed.

\* No role validation is implemented directly in this action.

\* No duplicate validation is implemented.

Database Behavior:

Table accessed:

NewProfessionalApplication

Operation:

SELECT

Filter:

WHERE ApplicationID = @ApplicationID

Fields selected:

\* ApplicationID

\* Email

\* StudentName

\* DOB

\* ContactNumber

\* AlternateNumber

\* ResidentialAddress

\* GoogleMapLink

\* AreaTypeID

\* DistrictID

\* OtherDistrict

\* GenderID

\* CasteCategoryID

\* FatherName

\* MotherName

\* FatherOccupationID

\* MotherOccupationID

\* FamilyMembers

\* HouseTypeID

\* MonthlyRent

\* FamilyIncome

\* PUPercentage

\* CETRank

\* NEETRank

\* CourseApplying

\* CourseStream

\* StudentSelfiePath

\* CETNEETRankSheetPath

\* DwellingUnitPhotoPath

\* MarksSheet12Path

\* RequestLetterPath

\* HouseVideoPath

\* ElectricityBillPath

\* IncomeCertificatePath

\* RationCardPath

Response Data Structure:

The response object contains:

\* success

\* message

\* data

The data object contains all fields listed above.

Success Response (200):

{

"success": true,

"message": "Student details retrieved successfully.",

"data": {

"ApplicationID": 101,

"Email": "student@example.com",

"StudentName": "John Student",

"DOB": "2005-06-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Example residential address",

"GoogleMapLink": "https://maps.google.com/example",

"AreaTypeID": 1,

"DistrictID": 10,

"OtherDistrict": "",

"GenderID": 1,

"CasteCategoryID": 2,

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 3,

"MotherOccupationID": 4,

"FamilyMembers": 5,

"HouseTypeID": 2,

"MonthlyRent": 5000.00,

"FamilyIncome": 25000.00,

"PUPercentage": 85.50,

"CETRank": 12345,

"NEETRank": 0,

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfiePath": "~/Uploads/NewProfessional/StudentSelfie/example.jpg",

"CETNEETRankSheetPath": "~/Uploads/NewProfessional/CETNEETRankSheet/example.pdf",

"DwellingUnitPhotoPath": "~/Uploads/NewProfessional/DwellingUnitPhoto/example.jpg",

"MarksSheet12Path": "~/Uploads/NewProfessional/MarksSheet12/example.pdf",

"RequestLetterPath": "~/Uploads/NewProfessional/RequestLetter/example.pdf",

"HouseVideoPath": "~/Uploads/NewProfessional/HouseVideo/example.mp4",

"ElectricityBillPath": "~/Uploads/NewProfessional/ElectricityBill/example.pdf",

"IncomeCertificatePath": "~/Uploads/NewProfessional/IncomeCertificate/example.pdf",

"RationCardPath": "~/Uploads/NewProfessional/RationCard/example.pdf"

}

}

Important Response Null Handling:

The controller converts database NULL values as follows:

\* String fields:

NULL -> ""

\* ApplicationID:

NULL -> 0, although ApplicationID is expected to be non-null

\* Nullable integer fields:

NULL -> null

\* Nullable decimal fields:

NULL -> null

\* DOB:

NULL -> null

Failure Responses:

400 Bad Request

Occurs when id <= 0.

Example:

{

"success": false,

"message": "Invalid Application ID."

}

401 Unauthorized

Applicable when the existing JwtSessionFilter rejects the request because authentication is missing or invalid.

Exact response body:

Not specified in controller because the response is generated by JwtSessionFilter/framework.

403 Forbidden

No explicit 403 response is generated by this action.

If JwtSessionFilter performs authorization/role checks internally and rejects the authenticated user, the exact behavior is not specified in the controller.

404 Not Found

Occurs when no NewProfessionalApplication record exists for the supplied ApplicationID.

Example:

{

"success": false,

"message": "New Professional Student not found."

}

409 Conflict

Not explicitly used by this endpoint.

500 Internal Server Error

Occurs when an unexpected exception is thrown while retrieving the student.

Example:

{

"success": false,

"message": "Error retrieving student details."

}

The exception details are not returned in the response.

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized - authentication filter/framework applicable

\* 403 Forbidden - only if authorization/filter implementation rejects access

\* 404 Not Found

\* 500 Internal Server Error

Controller explicitly generates:

200, 400, 404, 500.

---------------------------------------------------------

2. UPDATE NEW PROFESSIONAL STUDENT

==================================

Endpoint:

POST /api/edit-new-professional-student/update

Purpose:

Updates an existing New Professional student/application record using multipart/form-data.

The endpoint supports partial updates.

For normal form fields:

\* A missing or empty value is converted to NULL.

\* SQL COALESCE(@Parameter, Column) retains the existing database value when the parameter is NULL.

For uploaded files:

\* If a new file is not supplied, the existing file path is retained.

\* If a new file is supplied, it is saved and its generated path is written to the database.

Content-Type:

multipart/form-data

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* JWT Filter:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

Not specified in controller

\* Required Claims:

Not specified in controller

\* JWT claims used directly:

None

\* Session values used directly:

None

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller

\* Required Roles: None specified

\* How claims are used: The action does not directly access JWT claims.

\* Session dependency: No Session access is visible in the action.

\* Any internal JWT/session behavior belongs to JwtSessionFilter and is not specified in the supplied controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | ApplicationID is supplied as multipart form data rather than a route parameter. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are used. |

Request Body:

multipart/form-data

A. NORMAL FORM FIELDS

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| ApplicationID | int | Yes | No | Existing application ID to update. Must be greater than 0. |

| Email | string | No | Yes | Student email address. Empty/missing value results in NULL and existing value is retained. |

| StudentName | string | No | Yes | Student name. Empty/missing value results in NULL and existing value is retained. |

| DOB | date | No | Yes | Date of birth. Parsed using DateTime.TryParse. |

| ContactNumber | string | No | Yes | Primary contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| ResidentialAddress | string | No | Yes | Residential address. |

| GoogleMapLink | string | No | Yes | Google Maps link/location URL. |

| AreaTypeID | int | No | Yes | Area type master ID. |

| DistrictID | int | No | Yes | District master ID. |

| OtherDistrict | string | No | Yes | Other district value. |

| GenderID | int | No | Yes | Gender master ID. |

| CasteCategoryID | int | No | Yes | Caste category master ID. |

| FatherName | string | No | Yes | Father's name. |

| MotherName | string | No | Yes | Mother's name. |

| FatherOccupationID | int | No | Yes | Father occupation master ID. |

| MotherOccupationID | int | No | Yes | Mother occupation master ID. |

| FamilyMembers | int | No | Yes | Number of family members. |

| HouseTypeID | int | No | Yes | House type master ID. |

| MonthlyRent | decimal | No | Yes | Monthly rent amount. |

| FamilyIncome | decimal | No | Yes | Family income amount. |

| PUPercentage | decimal | No | Yes | PU percentage. |

| CETRank | int | No | Yes | CET rank. |

| NEETRank | int | No | Yes | NEET rank. |

| CourseApplying | string | No | Yes | Course being applied for. |

| CourseStream | string | No | Yes | Course stream. |

Important Requiredness Rule:

Only ApplicationID is explicitly required by the controller.

All other normal form fields are optional from the controller's perspective.

The controller does NOT require every existing database field to be included in the request.

B. FILE UPLOAD FIELDS

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|-------|------|----------|--------------------|----------|-------------|

| StudentSelfie | File | No | Not restricted in controller | Not specified | New student selfie. |

| CETNEETRankSheet | File | No | Not restricted in controller | Not specified | New CET/NEET rank sheet. |

| DwellingUnitPhoto | File | No | Not restricted in controller | Not specified | New dwelling unit photo. |

| MarksSheet12 | File | No | Not restricted in controller | Not specified | New Class 12 marks sheet. |

| RequestLetter | File | No | Not restricted in controller | Not specified | New request letter. |

| HouseVideo | File | No | Not restricted in controller | Not specified | New house video. |

| ElectricityBill | File | No | Not restricted in controller | Not specified | New electricity bill. |

| IncomeCertificate | File | No | Not restricted in controller | Not specified | New income certificate. |

| RationCard | File | No | Not restricted in controller | Not specified | New ration card. |

File Validation:

The supplied controller does NOT explicitly validate:

\* file extension

\* MIME type

\* maximum file size

\* image dimensions

\* video duration

\* number of files

\* virus/malware content

Therefore:

Allowed Extensions:

Not specified/restricted in controller.

Maximum File Size:

Not specified in controller.

Multiple Files:

The GetUploadedFile method selects the first matching file for each field name. Multiple files for the same field are not intentionally processed.

Mandatory Files:

None.

If no file is supplied:

The old database path is retained.

If a new file is supplied:

The file is saved and the database path is replaced with the new generated path.

Form Data Request Example:

ApplicationID=101

Email=student@example.com

StudentName=John Student

DOB=2005-06-15

ContactNumber=9876543210

AlternateNumber=9123456780

ResidentialAddress=Example residential address

GoogleMapLink=https://maps.google.com/example

AreaTypeID=1

DistrictID=10

OtherDistrict=

GenderID=1

CasteCategoryID=2

FatherName=Father Name

MotherName=Mother Name

FatherOccupationID=3

MotherOccupationID=4

FamilyMembers=5

HouseTypeID=2

MonthlyRent=5000

FamilyIncome=25000

PUPercentage=85.50

CETRank=12345

NEETRank=0

CourseApplying=Engineering

CourseStream=Science

Optional files may be attached using the file field names documented above.

Validation Rules:

ApplicationID:

\* Required.

\* Must parse successfully as integer.

\* Must be greater than 0.

\* Invalid/missing ApplicationID returns HTTP 400.

Multipart Content:

\* Request must be multipart/form-data.

\* If the request is not multipart/form-data, HTTP 400 is returned.

String fields:

\* Empty or whitespace-only values are converted to NULL.

\* NULL values are passed to SQL.

\* SQL COALESCE retains the existing database value.

Integer fields:

\* Empty/missing values become null.

\* Non-numeric values result in a FormatException.

\* Numeric values are accepted.

\* No range validation is implemented.

Decimal fields:

\* Empty/missing values become null.

\* Parsing uses decimal.TryParse with NumberStyles.Any and InvariantCulture.

\* Invalid decimal values cause a FormatException.

\* No minimum/maximum validation is implemented.

DOB:

\* Empty/missing value becomes null.

\* Parsing uses DateTime.TryParse.

\* Invalid date values cause a FormatException.

\* No age validation is implemented.

String length:

\* No explicit minimum length is implemented.

\* No explicit maximum length is implemented.

\* Database column limits may still apply, but those limits are not visible in the controller.

Email:

\* No email-format validation is implemented.

Phone numbers:

\* No phone-number format or length validation is implemented.

IDs:

\* AreaTypeID, DistrictID, GenderID, CasteCategoryID, FatherOccupationID, MotherOccupationID and HouseTypeID are parsed as integers.

\* No explicit foreign-key existence validation is performed in the controller.

Ranks:

\* CETRank and NEETRank are parsed as integers.

\* No positive/zero/range validation is implemented.

File validation:

\* A supplied file must have an extension.

\* If the extension is missing, an InvalidOperationException is thrown.

\* File extension allowlisting is NOT implemented.

\* File size restriction is NOT implemented.

Conditional / Business Rules:

\* ApplicationID is mandatory.

\* All other form fields are optional.

\* Missing/empty normal form values do not overwrite existing values.

\* Missing files do not overwrite existing file paths.

\* New files replace the corresponding existing path in the database.

\* Existing file deletion is NOT performed when a replacement file is uploaded.

\* No duplicate student/application check is performed.

\* No status field is updated.

\* No CreatedBy field is updated.

\* No ModifiedBy field is updated.

\* No ModifiedDate field is updated.

\* No UserID/EmployeeID is assigned to the record.

\* No role-specific update rule is implemented in this action.

\* No transaction is used around file saving and database update.

Database Behavior:

Table:

NewProfessionalApplication

Operations:

1. SELECT existing file paths.

2. UPDATE application record.

Initial SELECT:

WHERE ApplicationID = @ApplicationID

Existing file columns retrieved:

\* StudentSelfiePath

\* CETNEETRankSheetPath

\* DwellingUnitPhotoPath

\* MarksSheet12Path

\* RequestLetterPath

\* HouseVideoPath

\* ElectricityBillPath

\* IncomeCertificatePath

\* RationCardPath

UPDATE:

WHERE ApplicationID = @ApplicationID

Updated columns:

\* Email

\* StudentName

\* DOB

\* ContactNumber

\* AlternateNumber

\* ResidentialAddress

\* GoogleMapLink

\* AreaTypeID

\* DistrictID

\* OtherDistrict

\* GenderID

\* CasteCategoryID

\* FatherName

\* MotherName

\* FatherOccupationID

\* MotherOccupationID

\* FamilyMembers

\* HouseTypeID

\* MonthlyRent

\* FamilyIncome

\* PUPercentage

\* CETRank

\* NEETRank

\* CourseApplying

\* CourseStream

\* StudentSelfiePath

\* CETNEETRankSheetPath

\* DwellingUnitPhotoPath

\* MarksSheet12Path

\* RequestLetterPath

\* HouseVideoPath

\* ElectricityBillPath

\* IncomeCertificatePath

\* RationCardPath

COALESCE Update Logic:

For each field:

COALESCE(@Parameter, ExistingColumn)

Therefore:

Parameter has a non-null value:

Existing value is replaced.

Parameter is NULL:

Existing database value remains unchanged.

File Saving Logic:

Temporary multipart upload directory:

%TEMP%\NewProfessional\_<GUID>

Uploaded files are first stored by MultipartFormDataStreamProvider in the temporary directory.

After processing, the temporary directory is deleted in a finally block.

Permanent upload root:

~/Uploads/NewProfessional/

Each file type receives its own folder:

~/Uploads/NewProfessional/StudentSelfie/

~/Uploads/NewProfessional/CETNEETRankSheet/

~/Uploads/NewProfessional/DwellingUnitPhoto/

~/Uploads/NewProfessional/MarksSheet12/

~/Uploads/NewProfessional/RequestLetter/

~/Uploads/NewProfessional/HouseVideo/

~/Uploads/NewProfessional/ElectricityBill/

~/Uploads/NewProfessional/IncomeCertificate/

~/Uploads/NewProfessional/RationCard/

Generated file name:

<GUID without hyphens><original extension>

Example:

8f4e8a3c7f3b4d4f8c1a123456789abc.pdf

The original filename is not retained as the saved filename.

The returned database path uses the application-relative path:

~/Uploads/NewProfessional/<FolderName>/<GeneratedFileName>

Important File Replacement Behavior:

\* Old file is NOT deleted from permanent storage when a replacement is uploaded.

\* Only the database path is changed to the new file.

\* If no replacement is uploaded, the old database path is retained.

\* Temporary multipart files are deleted after processing.

\* If permanent file saving succeeds but the subsequent database update fails, the controller does not perform rollback/deletion of the newly saved permanent file.

\* No database transaction coordinates file storage and SQL update.

Success Response (200):

{

"success": true,

"message": "Student details updated successfully.",

"applicationId": 101

}

Failure Responses:

400 Bad Request

Occurs when:

\* Request is not multipart/form-data.

\* ApplicationID is missing.

\* ApplicationID cannot be parsed as an integer.

\* ApplicationID is less than or equal to 0.

Examples:

{

"success": false,

"message": "Request must be multipart/form-data."

}

or:

{

"success": false,

"message": "ApplicationID is required and must be valid."

}

401 Unauthorized

Applicable when JwtSessionFilter rejects a request because authentication is missing/invalid.

Exact response body is not specified in the supplied controller.

403 Forbidden

No explicit 403 response is generated by this action.

If JwtSessionFilter internally implements authorization/role restrictions, the exact behavior is not specified.

404 Not Found

Occurs when no student/application exists for the supplied ApplicationID during the initial SELECT.

Example:

{

"success": false,

"message": "Student not found."

}

A second logical 404 is also possible when ExecuteNonQuery returns zero rows:

{

"success": false,

"message": "Student record was not found or was not updated."

}

409 Conflict

Not explicitly used.

No duplicate/conflict check is implemented.

500 Internal Server Error

Occurs for unexpected exceptions, including possible:

\* invalid integer values

\* invalid decimal values

\* invalid date values

\* missing file extension

\* upload directory errors

\* file save errors

\* SQL/database errors

\* other unhandled exceptions

Example:

{

"success": false,

"message": "Error updating student."

}

The actual exception details are not returned to the client.

Status Codes Used / Applicable:

\* 200 OK

\* 400 Bad Request

\* 401 Unauthorized - authentication filter/framework applicable

\* 403 Forbidden - only if filter/framework performs authorization

\* 404 Not Found

\* 409 Conflict - not implemented

\* 500 Internal Server Error

Controller explicitly generates:

200, 400, 404, 500.

---------------------------------------------------------

3. GET DROPDOWNS

================

Endpoint:

GET /api/edit-new-professional-student/dropdowns

Purpose:

Retrieves all master-data dropdown lists required by the Edit New Professional Student screen.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* JWT Filter:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

Not specified in controller

\* Required Claims:

Not specified in controller

\* UserID/EmployeeID filtering:

None

\* Session filtering:

None

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller

\* Required Roles: None specified

\* How claims are used: No JWT claim is directly accessed.

\* User-specific filtering: None visible.

\* Role-specific filtering: None visible.

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

Dropdowns Returned:

1. areas

2. districts

3. genders

4. castes

5. fatherOccupations

6. motherOccupations

7. houseTypes

Dropdown Database Queries:

Areas:

SELECT AreaTypeID AS ID, AreaTypeName AS Name

FROM AreaTypeMaster

ORDER BY AreaTypeName

Districts:

SELECT DistrictID AS ID, DistrictName AS Name

FROM DistrictMaster

ORDER BY DistrictName

Genders:

SELECT GenderID AS ID, GenderName AS Name

FROM GenderMaster

ORDER BY GenderName

Castes:

SELECT CasteCategoryID AS ID, CategoryName AS Name

FROM CasteCategoryMaster

ORDER BY CategoryName

Father Occupations:

SELECT FatherOccupationID AS ID, OccupationName AS Name

FROM FatherOccupationMaster

ORDER BY OccupationName

Mother Occupations:

SELECT MotherOccupationID AS ID, OccupationName AS Name

FROM MotherOccupationMaster

ORDER BY OccupationName

House Types:

SELECT HouseTypeID AS ID, HouseTypeName AS Name

FROM HouseTypeMaster

ORDER BY HouseTypeName

Dropdown Item Structure:

Each dropdown item has:

\* id

\* name

No "-- Select --" option is generated by the API.

The frontend may add its own default selection, but that is not implemented in this controller.

No active/inactive filtering is implemented.

No UserID filtering is implemented.

No EmployeeID filtering is implemented.

No Role filtering is implemented.

Success Response (200):

{

"success": true,

"areas": [

{

"id": 1,

"name": "Urban"

},

{

"id": 2,

"name": "Rural"

}

],

"districts": [

{

"id": 1,

"name": "Dharwad"

},

{

"id": 2,

"name": "Belagavi"

}

],

"genders": [

{

"id": 1,

"name": "Male"

},

{

"id": 2,

"name": "Female"

}

],

"castes": [

{

"id": 1,

"name": "Category Example 1"

},

{

"id": 2,

"name": "Category Example 2"

}

],

"fatherOccupations": [

{

"id": 1,

"name": "Occupation Example 1"

},

{

"id": 2,

"name": "Occupation Example 2"

}

],

"motherOccupations": [

{

"id": 1,

"name": "Occupation Example 1"

},

{

"id": 2,

"name": "Occupation Example 2"

}

],

"houseTypes": [

{

"id": 1,

"name": "House Type Example 1"

},

{

"id": 2,

"name": "House Type Example 2"

}

]

}

Dropdown Response Notes:

The exact database contents are not defined by the controller, so the sample names above are illustrative.

The response property names are exact:

\* areas

\* districts

\* genders

\* castes

\* fatherOccupations

\* motherOccupations

\* houseTypes

Each item uses:

{

"id": <integer>,

"name": "<string>"

}

Validation Rules:

\* No request parameters are required.

\* No request body is required.

\* Database query failures result in HTTP 500.

\* No filtering by authenticated user is performed.

\* No filtering by role is performed.

\* No active/inactive filtering is performed.

\* Results are sorted alphabetically by their Name column.

Failure Responses:

400 Bad Request:

Not explicitly generated by this action.

401 Unauthorized:

Applicable when JwtSessionFilter rejects authentication.

403 Forbidden:

Not explicitly generated by this action. May be applicable only if JwtSessionFilter implements authorization internally.

404 Not Found:

Not explicitly generated.

409 Conflict:

Not applicable.

500 Internal Server Error:

Occurs when an exception occurs while loading dropdown data.

Example:

{

"success": false,

"message": "Error loading dropdown data."

}

Status Codes Used / Applicable:

\* 200 OK

\* 401 Unauthorized - authentication filter/framework applicable

\* 403 Forbidden - only if filter/framework performs authorization

\* 500 Internal Server Error

Controller explicitly generates:

200, 500.

---------------------------------------------------------

4. INDEX / API AVAILABILITY CHECK

================================

Endpoint:

GET /api/edit-new-professional-student/index

Purpose:

Returns a simple response indicating that the Edit New Professional Student API is available.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* JWT Filter:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

Not specified in controller

\* Required Claims:

Not specified in controller

\* JWT claims used directly:

None

\* Session values used directly:

None

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller

\* Required Roles: None specified

\* Direct JWT usage: None.

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

Success Response (200):

{

"success": true,

"message": "Edit New Professional Student API is available."

}

Failure Responses:

401 Unauthorized:

Applicable when JwtSessionFilter rejects the request.

403 Forbidden:

Not explicitly generated by the action. Could be generated by JwtSessionFilter if it contains authorization logic.

500 Internal Server Error:

No explicit try/catch exists in Index, so an unexpected framework/runtime exception is not explicitly converted by this action.

400:

Not explicitly used.

404:

Not explicitly used.

409:

Not applicable.

Status Codes Used / Applicable:

\* 200 OK

\* 401 Unauthorized - filter/framework applicable

\* 403 Forbidden - filter/framework applicable if authorization exists

Controller explicitly generates:

200.

=========================================================

COMMON DTOS

===========

IMPORTANT DTO NOTE:

The supplied controller does NOT define or reference any custom request/response DTO classes.

The API uses:

\* Anonymous response objects

\* MultipartFormDataStreamProvider

\* HttpPostedFileBase

\* MultipartPostedFile

Therefore, there are no named DTO classes to document from the supplied controller.

The following are the effective API data contracts.

---------------------------------------------------------

COMMON RESPONSE OBJECT: STUDENT DETAILS

========================================

Purpose:

Represents the student/application data returned by the GET endpoint.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ApplicationID | int | Yes | No | Application identifier. |

| Email | string | No | No in response | Email address. Database NULL is returned as empty string. |

| StudentName | string | No | No in response | Student name. |

| DOB | datetime | No | Yes | Date of birth. |

| ContactNumber | string | No | No in response | Primary contact number. |

| AlternateNumber | string | No | No in response | Alternate contact number. |

| ResidentialAddress | string | No | No in response | Residential address. |

| GoogleMapLink | string | No | No in response | Google Maps link. |

| AreaTypeID | int | No | Yes | Area type identifier. |

| DistrictID | int | No | Yes | District identifier. |

| OtherDistrict | string | No | No in response | Other district. |

| GenderID | int | No | Yes | Gender identifier. |

| CasteCategoryID | int | No | Yes | Caste category identifier. |

| FatherName | string | No | No in response | Father's name. |

| MotherName | string | No | No in response | Mother's name. |

| FatherOccupationID | int | No | Yes | Father's occupation identifier. |

| MotherOccupationID | int | No | Yes | Mother's occupation identifier. |

| FamilyMembers | int | No | Yes | Number of family members. |

| HouseTypeID | int | No | Yes | House type identifier. |

| MonthlyRent | decimal | No | Yes | Monthly rent. |

| FamilyIncome | decimal | No | Yes | Family income. |

| PUPercentage | decimal | No | Yes | PU percentage. |

| CETRank | int | No | Yes | CET rank. |

| NEETRank | int | No | Yes | NEET rank. |

| CourseApplying | string | No | No in response | Course applying for. |

| CourseStream | string | No | No in response | Course stream. |

| StudentSelfiePath | string | No | No in response | Stored relative path of student selfie. |

| CETNEETRankSheetPath | string | No | No in response | Stored relative path of rank sheet. |

| DwellingUnitPhotoPath | string | No | No in response | Stored relative path of dwelling unit photo. |

| MarksSheet12Path | string | No | No in response | Stored relative path of Class 12 marks sheet. |

| RequestLetterPath | string | No | No in response | Stored relative path of request letter. |

| HouseVideoPath | string | No | No in response | Stored relative path of house video. |

| ElectricityBillPath | string | No | No in response | Stored relative path of electricity bill. |

| IncomeCertificatePath | string | No | No in response | Stored relative path of income certificate. |

| RationCardPath | string | No | No in response | Stored relative path of ration card. |

Sample Response:

{

"success": true,

"message": "Student details retrieved successfully.",

"data": {

"ApplicationID": 101,

"Email": "student@example.com",

"StudentName": "John Student",

"DOB": "2005-06-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Example residential address",

"GoogleMapLink": "https://maps.google.com/example",

"AreaTypeID": 1,

"DistrictID": 10,

"OtherDistrict": "",

"GenderID": 1,

"CasteCategoryID": 2,

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 3,

"MotherOccupationID": 4,

"FamilyMembers": 5,

"HouseTypeID": 2,

"MonthlyRent": 5000.00,

"FamilyIncome": 25000.00,

"PUPercentage": 85.50,

"CETRank": 12345,

"NEETRank": 0,

"CourseApplying": "Engineering",

"CourseStream": "Science",

"StudentSelfiePath": "~/Uploads/NewProfessional/StudentSelfie/example.jpg",

"CETNEETRankSheetPath": "~/Uploads/NewProfessional/CETNEETRankSheet/example.pdf",

"DwellingUnitPhotoPath": "~/Uploads/NewProfessional/DwellingUnitPhoto/example.jpg",

"MarksSheet12Path": "~/Uploads/NewProfessional/MarksSheet12/example.pdf",

"RequestLetterPath": "~/Uploads/NewProfessional/RequestLetter/example.pdf",

"HouseVideoPath": "~/Uploads/NewProfessional/HouseVideo/example.mp4",

"ElectricityBillPath": "~/Uploads/NewProfessional/ElectricityBill/example.pdf",

"IncomeCertificatePath": "~/Uploads/NewProfessional/IncomeCertificate/example.pdf",

"RationCardPath": "~/Uploads/NewProfessional/RationCard/example.pdf"

}

}

---------------------------------------------------------

COMMON DTO: DROPDOWN ITEM

=========================

Purpose:

Represents an individual dropdown option.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| id | int | Yes | No | Database ID of the dropdown item. |

| name | string | Yes | No | Display name of the dropdown item. |

Sample:

{

"id": 1,

"name": "Example"

}

---------------------------------------------------------

COMMON MULTIPART UPDATE CONTRACT

================================

Purpose:

Represents the effective request contract for the update endpoint.

There is no named DTO class. Multipart form data is read directly using provider.FormData.

Normal form properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ApplicationID | int | Yes | No | Existing application ID. |

| Email | string | No | Yes | Student email. |

| StudentName | string | No | Yes | Student name. |

| DOB | date | No | Yes | Date of birth. |

| ContactNumber | string | No | Yes | Contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| ResidentialAddress | string | No | Yes | Residential address. |

| GoogleMapLink | string | No | Yes | Google Maps link. |

| AreaTypeID | int | No | Yes | Area type ID. |

| DistrictID | int | No | Yes | District ID. |

| OtherDistrict | string | No | Yes | Other district. |

| GenderID | int | No | Yes | Gender ID. |

| CasteCategoryID | int | No | Yes | Caste category ID. |

| FatherName | string | No | Yes | Father's name. |

| MotherName | string | No | Yes | Mother's name. |

| FatherOccupationID | int | No | Yes | Father occupation ID. |

| MotherOccupationID | int | No | Yes | Mother occupation ID. |

| FamilyMembers | int | No | Yes | Family member count. |

| HouseTypeID | int | No | Yes | House type ID. |

| MonthlyRent | decimal | No | Yes | Monthly rent. |

| FamilyIncome | decimal | No | Yes | Family income. |

| PUPercentage | decimal | No | Yes | PU percentage. |

| CETRank | int | No | Yes | CET rank. |

| NEETRank | int | No | Yes | NEET rank. |

| CourseApplying | string | No | Yes | Course applying for. |

| CourseStream | string | No | Yes | Course stream. |

File properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentSelfie | File | No | Yes | New student selfie. |

| CETNEETRankSheet | File | No | Yes | New CET/NEET rank sheet. |

| DwellingUnitPhoto | File | No | Yes | New dwelling unit photo. |

| MarksSheet12 | File | No | Yes | New Class 12 marks sheet. |

| RequestLetter | File | No | Yes | New request letter. |

| HouseVideo | File | No | Yes | New house video. |

| ElectricityBill | File | No | Yes | New electricity bill. |

| IncomeCertificate | File | No | Yes | New income certificate. |

| RationCard | File | No | Yes | New ration card. |

---------------------------------------------------------

COMMON DTO: ERROR RESPONSE

==========================

Purpose:

Standard error structure returned by controller-generated error responses.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| success | bool | Yes | No | Always false for controller-generated errors. |

| message | string | Yes | No | Human-readable error message. |

Sample:

{

"success": false,

"message": "Error updating student."

}

=========================================================

AUTHORIZATION SUMMARY

=====================

Endpoint Authentication Matrix:

| Endpoint | JWT Required | Existing Filter | Role Required | JWT Claims Directly Used |

|----------|--------------|------------------|---------------|---------------------------|

| GET /api/edit-new-professional-student/{id} | Yes | [JwtSessionFilter] | Not specified | None |

| POST /api/edit-new-professional-student/update | Yes | [JwtSessionFilter] | Not specified | None |

| GET /api/edit-new-professional-student/dropdowns | Yes | [JwtSessionFilter] | Not specified | None |

| GET /api/edit-new-professional-student/index | Yes | [JwtSessionFilter] | Not specified | None |

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Important:

The controller does NOT contain:

\* [Authorize]

\* role attributes

\* explicit UserID extraction

\* explicit EmployeeID extraction

\* explicit Role extraction

\* explicit JWT claim parsing

\* Session["UserID"] access

\* Session["EmployeeID"] access

\* Session["Role"] access

\* user-specific SQL filtering

Therefore, no specific JWT claim or role can be documented as required based solely on this controller.

The actual authentication requirements of JwtSessionFilter must be obtained from the implementation of JwtSessionFilter.

=========================================================

PAGINATION / SEARCH / FILTERING

===============================

Pagination:

Not specified in controller.

Search:

Not specified in controller.

Sorting:

No API-level sorting parameters are exposed.

Filtering:

The student GET endpoint filters by ApplicationID only.

Dropdown sorting:

Dropdown queries explicitly sort by the display-name column in ascending order.

UserID filtering:

Not implemented.

EmployeeID filtering:

Not implemented.

Role filtering:

Not implemented.

=========================================================

DEFAULT VALUES

==============

No application-level default values are assigned for:

\* Status

\* CreatedBy

\* ModifiedBy

\* CreatedDate

\* ModifiedDate

\* UserID

\* EmployeeID

\* Role

\* Page number

\* Page size

\* Dropdown selection

Update-specific default behavior:

\* Missing/empty normal form values -> NULL -> existing database value retained through COALESCE.

\* Missing file -> existing database file path retained.

\* New file -> new GUID-based path stored.

\* Multipart temporary directory -> automatically generated using a GUID.

\* Uploaded file name -> GUID without hyphens + original extension.

=========================================================

DATABASE TABLES

===============

Tables directly accessed by the supplied controller:

1. NewProfessionalApplication

Used by:

\* GET student details

\* UPDATE student details

2. AreaTypeMaster

Used by:

\* Dropdown API

3. DistrictMaster

Used by:

\* Dropdown API

4. GenderMaster

Used by:

\* Dropdown API

5. CasteCategoryMaster

Used by:

\* Dropdown API

6. FatherOccupationMaster

Used by:

\* Dropdown API

7. MotherOccupationMaster

Used by:

\* Dropdown API

8. HouseTypeMaster

Used by:

\* Dropdown API

Database Operations:

GET student:

SELECT

UPDATE student:

SELECT old file paths

UPDATE record

Dropdown API:

SELECT

No stored procedures are used.

No explicit SQL transaction is used.

No INSERT is performed.

No DELETE is performed.

No soft delete is implemented.

No duplicate check is implemented.

No audit-user update is implemented.

=========================================================

FILE STORAGE SUMMARY

=====================

Permanent Root:

~/Uploads/NewProfessional/

Folders:

\* StudentSelfie

\* CETNEETRankSheet

\* DwellingUnitPhoto

\* MarksSheet12

\* RequestLetter

\* HouseVideo

\* ElectricityBill

\* IncomeCertificate

\* RationCard

File Name:

GUID + original extension

Example:

f3a2e4c8d6b94e7a9a1b2c3d4e5f6789.pdf

Stored Path Example:

~/Uploads/NewProfessional/MarksSheet12/f3a2e4c8d6b94e7a9a1b2c3d4e5f6789.pdf

File Extension:

The controller preserves the extension supplied by the uploaded file.

Extension allowlist:

Not implemented.

MIME validation:

Not implemented.

Maximum file size:

Not specified.

Multiple files per field:

Not intentionally supported; first matching file is selected.

Old file deletion:

Not implemented.

Replacement:

Database path is replaced when a new file is uploaded.

No replacement:

Existing path is retained.

=========================================================

COMPLETE ENDPOINT LIST

======================

1. GET

/api/edit-new-professional-student/{id}

Purpose: Retrieve student/application details.

JWT: Required.

2. POST

/api/edit-new-professional-student/update

Purpose: Partially update student/application details and optionally replace uploaded files.

JWT: Required.

Content-Type: multipart/form-data.

3. GET

/api/edit-new-professional-student/dropdowns

Purpose: Retrieve all edit-page dropdown master data.

JWT: Required.

4. GET

/api/edit-new-professional-student/index

Purpose: API availability/status response.

JWT: Required.

=========================================================

OVERALL API CONTRACT NOTES

==========================

1. The controller does NOT use a controller-level JWT filter.

2. [JwtSessionFilter] is applied individually to each action.

3. Based strictly on the supplied controller, all four endpoints currently have JWT protection.

4. No specific JWT claim names are visible in this controller.

5. No specific role names are visible in this controller.

6. No UserID, EmployeeID, or Role is directly read by any action.

7. No endpoint performs user-specific data filtering.

8. The update endpoint uses partial-update semantics.

9. ApplicationID is the only explicitly required update field.

10. All other update form fields are optional from controller validation.

11. Empty strings/whitespace are converted to NULL for string parameters.

12. NULL parameters preserve existing database values through COALESCE.

13. No file is mandatory.

14. If a file is omitted, the existing file path remains unchanged.

15. If a new file is uploaded, a GUID filename is generated.

16. The original file extension is preserved.

17. The controller does not restrict file extensions.

18. The controller does not define maximum upload size.

19. The controller does not delete old permanent files after replacement.

20. The controller does not use a database transaction for file/database synchronization.

21. No duplicate validation is implemented.

22. No email validation is implemented.

23. No phone validation is implemented.

24. No age validation is implemented.

25. No numeric range validation is implemented for income, rent, percentage, ranks, or family members.

26. Dropdown APIs are not filtered by UserID, EmployeeID, or Role.

27. Dropdown APIs do not add a "-- Select --" option.

28. Dropdown APIs do not filter active/inactive records.

29. Dropdown records are ordered by their display-name columns.

30. No pagination is implemented.

31. No search parameters are implemented.

32. No explicit 409 Conflict response is implemented.

33. Error response bodies intentionally expose only success=false and a message; exception details are not returned.

34. The exact behavior of JwtSessionFilter is outside the supplied controller and therefore cannot be documented beyond its presence at action level.