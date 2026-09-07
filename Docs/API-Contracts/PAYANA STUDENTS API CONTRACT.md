=========================================================

PAYANA STUDENTS API CONTRACT

============================

API BASE ROUTE

==============

Route Prefix:

/api/payana-students

Authentication:

JWT authentication is applied only to endpoints that explicitly contain the [JwtSessionFilter] attribute.

Public endpoints:

1. POST /api/payana-students/create

2. GET /api/payana-students/dropdowns

Protected endpoint:

1. GET /api/payana-students/list

2. GET /api/payana-students/districts

Important:

The controller does NOT have a controller-level JWT filter. Therefore, JWT authentication is not automatically required for every endpoint.

=========================================================

1. CREATE PAYANA STUDENT

========================

Endpoint:

POST /api/payana-students/create

Purpose:

Submits a new Payana Student application. The endpoint accepts student information as multipart/form-data, optionally accepts uploaded documents/photos, checks whether the supplied email has already been registered, saves uploaded files, and inserts the application into the PayanaStudents database table.

Content-Type:

multipart/form-data

Authorization:

Not Required

JWT / Authorization Details:

JWT Required: No

Filter/Authorization Scope:

No JWT filter or [Authorize] attribute is applied to this action.

Reason:

The controller explicitly describes this endpoint as a public application submission endpoint.

Required Roles:

None.

JWT Claims:

None.

Session Dependency:

None.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not define any path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not define any query parameters. |

Request Body:

Content-Type must be multipart/form-data.

The request contains normal form fields and optional file fields.

There is no JSON request body for this endpoint because the controller explicitly requires multipart/form-data.

FORM DATA FIELDS

================

| Field | Type | Required | Description |

|-------|------|----------|-------------|

| StudentName | string | Required | Student's name. The controller rejects the request when this is null or whitespace. |

| DateOfBirth | DateTime | Optional / Nullable | Student date of birth. Parsed using DateTime.TryParse(). Invalid or empty values become null. |

| GenderID | int | Optional from controller | Gender master ID. GetInt() returns 0 if parsing fails or the field is missing. |

| ContactNumber | string | Required | Student contact number. The controller rejects the request when null or whitespace. |

| AlternateNumber | string | Optional | Alternate contact number. |

| Email | string | Required | Student email address. The controller rejects the request when null or whitespace and checks for duplicate registration. |

| RAddress | string | Optional from controller | Residential address. |

| CAddress | string | Optional from controller | Current address. |

| Taluka | string | Optional from controller | Taluka name. |

| DistrictID | int | Optional from controller | District master ID. GetInt() returns 0 if missing or invalid. |

| OtherDistrict | string | Optional / Nullable | Other district value. |

| PinCode | string | Optional / Nullable | PIN code. |

| AreaTypeID | int | Optional from controller | Area type master ID. GetInt() returns 0 if missing or invalid. |

| CasteCategoryID | int | Optional from controller | Caste category master ID. GetInt() returns 0 if missing or invalid. |

| HouseTypeID | int | Optional from controller | House type master ID. GetInt() returns 0 if missing or invalid. |

| FatherName | string | Optional from controller | Father's name. |

| MotherName | string | Optional from controller | Mother's name. |

| FatherOccupationID | int | Optional / Nullable | Father's occupation master ID. Invalid or missing value becomes null. |

| MotherOccupationID | int | Optional / Nullable | Mother's occupation master ID. Invalid or missing value becomes null. |

| FamilyMembers | int | Optional from controller | Number of family members. GetInt() returns 0 if missing or invalid. |

| FamilyIncome | decimal | Optional from controller | Family income. GetDecimal() returns 0 if missing or invalid. |

| ParentBank | decimal | Optional from controller | Parents' bank balance. GetDecimal() returns 0 if missing or invalid. |

| CollegeName | string | Optional / Nullable | College/school name. |

| CollegeTypeID | int | Optional from controller | College type master ID. |

| CollegeCNumber | string | Optional / Nullable | College contact number. |

| CourseSA | string | Optional from controller | Course information. |

| CourseStream | string | Optional / Nullable | Course stream. |

| AnnualFees | decimal | Optional from controller | Annual fees. GetDecimal() returns 0 if missing or invalid. |

| TotalExpenses | decimal | Optional from controller | Total expenses. GetDecimal() returns 0 if missing or invalid. |

| StudentAchivements | string | Optional from controller | Student achievements. Note: spelling exactly follows the controller property/parameter name. |

| securedPercentage | string | Optional | Secured percentage. It is initially received as a string and later parsed into decimal before database insertion. |

| AccountHolderName | string | Optional from controller | Bank account holder name. |

| bankaccountno | string | Optional from controller | Bank account number. |

| ifsccode | string | Optional from controller | IFSC code. |

| bankname | string | Optional from controller | Bank name. |

| branchname | string | Optional from controller | Bank branch name. |

| HouseVisitLink | string | Optional / Nullable | House visit link. |

| ReferenceSourceOther | string | Optional / Nullable | Other reference source information. |

FILE UPLOAD FIELDS

==================

| Field | Type | Required | Allowed Extensions | Max Size | Description |

|-------|------|----------|--------------------|----------|-------------|

| latestmarkscard | File | Optional | Not explicitly restricted in controller | Not specified in controller | Latest marks card document. |

| studentpassbookFP | File | Optional | Not explicitly restricted in controller | Not specified in controller | Student bank passbook document/photo. |

| StudentPhoto | File | Optional | Not explicitly restricted in controller | Not specified in controller | Student photograph. |

| dwellingunit | File | Optional | Not explicitly restricted in controller | Not specified in controller | Dwelling/house photograph/document. |

| adharcard | File | Optional | Not explicitly restricted in controller | Not specified in controller | Aadhaar card document. |

File rules:

\* None of the file fields is explicitly validated as mandatory.

\* The controller does not check file extension against an allowed-extension list.

\* The controller does not check MIME type.

\* The controller does not define a maximum file size.

\* Multiple files with the same field name are not processed as a collection. SaveUploadedFile() returns after saving the first matching file.

\* The uploaded file is first written to ~/App\_Data/TempUploads by MultipartFormDataStreamProvider.

\* The matching file is then moved to ~/Uploads/.

\* A new GUID-based file name is generated.

\* The original file extension is retained.

\* The generated physical file name is:

GUID without hyphens + original extension.

\* The database stores the relative path:

/Uploads/{generated-file-name}

\* If no matching file is supplied, the method returns null and the corresponding database column receives DBNull.Value.

\* Existing files are not applicable because this is a create endpoint.

\* The controller does not explicitly delete temporary files when no matching file is processed.

\* Maximum upload size is Not specified in controller.

Validation Rules:

1. Request must use multipart/form-data.

2. StudentName is required and cannot be null, empty, or whitespace.

3. Email is required and cannot be null, empty, or whitespace.

4. ContactNumber is required and cannot be null, empty, or whitespace.

5. Email is checked against PayanaStudents using a case-insensitive comparison:

LOWER(Email) = LOWER(@Email)

6. If the email already exists, the request is rejected with HTTP 409 Conflict.

7. DateOfBirth is parsed using DateTime.TryParse(). Invalid/missing values become null.

8. Integer fields are parsed using int.TryParse().

9. Invalid/missing non-nullable-style integer form fields are converted to 0 by GetInt().

10. FatherOccupationID and MotherOccupationID are nullable and invalid/missing values become null.

11. Decimal fields are parsed using decimal.TryParse().

12. Invalid/missing decimal form values become 0.

13. securedPercentage is received as a string. If it can be parsed using decimal.TryParse(), the parsed decimal is inserted. Otherwise, null is inserted.

14. There is no explicit email-format validation using MailAddress, regex, or another email validator.

15. There is no explicit phone-number format validation.

16. There is no explicit PIN code format validation.

17. There is no explicit master-ID existence validation in the controller.

18. There is no explicit file extension validation.

19. There is no explicit file-size validation.

20. Database-level constraints may still reject invalid data, but such constraints are not visible in this controller.

Business Logic Notes:

1. The endpoint is intentionally public.

2. Duplicate email registration is prevented before insertion.

3. Duplicate checking is case-insensitive because LOWER() is used on both database Email and supplied Email.

4. The email is trimmed for the duplicate check:

model.Email.Trim()

5. The original model.Email value is used for the subsequent INSERT.

6. Uploaded files are saved before the database INSERT.

7. If the database INSERT fails after files have been saved, this controller does not delete those files. Therefore, orphaned files may remain.

8. Files are renamed using a GUID to avoid collisions.

9. The original file extension is preserved.

10. The database table used for creation is PayanaStudents.

11. No CreatedBy, ModifiedBy, UserID, EmployeeID, or JWT identity is populated by this endpoint.

12. No transaction is explicitly created around file saving and database insertion.

13. No status value is explicitly assigned by the controller.

14. No pagination is applicable.

15. No role filtering is applicable.

16. No authenticated-user filtering is applicable.

DATABASE BEHAVIOR

=================

Table accessed:

PayanaStudents

Operation:

INSERT

Duplicate validation query:

SELECT COUNT(\*)

FROM PayanaStudents

WHERE LOWER(Email) = LOWER(@Email)

Inserted database columns include:

StudentName

DateOfBirth

GenderID

ContactNumber

AlternateNumber

Email

Address

CurrentAddress

Taluka

DistrictID

OtherDistrict

PinCode

AreaTypeID

CasteCategoryID

HouseTypeID

FatherName

MotherName

FatherOccupationID

MotherOccupationID

FamilyMembers

FamilyIncome

ParentsBankBalance

CollegeName

CollegeTypeID

CollegeContactNumber

CourseSA

CourseStream

AnnualFees

TotalExpenses

StudentAchievement

SecuredPercentage

AccountHolderName

BankAccountNumber

IFSCCode

BankName

BranchName

MarksCardPath

BankPassbookPath

StudentPhotoPath

HousePhotoPath

AadharPath

HouseVisitLink

ReferenceSourceOther

SUCCESS RESPONSE (200)

======================

{

"success": true,

"message": "Payana Student Application Submitted Successfully!"

}

FAILURE RESPONSES

=================

400 Bad Request

Occurs when:

\* Content-Type is not multipart/form-data.

\* StudentName is missing or whitespace.

\* Email is missing or whitespace.

\* ContactNumber is missing or whitespace.

Example:

{

"success": false,

"message": "Request must be multipart/form-data."

}

or:

{

"success": false,

"message": "StudentName is required."

}

or:

{

"success": false,

"message": "Email is required."

}

or:

{

"success": false,

"message": "ContactNumber is required."

}

409 Conflict

Occurs when the supplied email already exists in PayanaStudents.

Response:

{

"success": false,

"message": "This Email ID is already registered. Student can apply only once."

}

401 Unauthorized

Not explicitly returned by the action.

JWT is not required for this endpoint, so the controller does not explicitly generate a 401 response.

403 Forbidden

Not explicitly returned by the action.

There is no role-based authorization or authorization attribute on this action.

404 Not Found

Not explicitly returned by the action.

500 Internal Server Error

Occurs when an unhandled exception is caught by the action.

Response:

{

"success": false,

"message": "Error message"

}

The actual exception message is returned through ex.Message.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 409 Conflict

\* 500 Internal Server Error

401, 403, and 404 are not explicitly generated by this action.

=========================================================

2. GET DROPDOWNS

================

Endpoint:

GET /api/payana-students/dropdowns

Purpose:

Returns all dropdown/master data required by the Payana Student application form.

Content-Type:

application/json

Authorization:

Not Required

JWT / Authorization Details:

JWT Required: No

Filter/Authorization Scope:

No JWT filter or authorization attribute is applied.

Reason:

The controller explicitly documents this endpoint as Public and JWT NOT REQUIRED.

Required Roles:

None.

JWT Claims:

None.

Session Dependency:

None.

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

Dropdown Data Sources:

1. GenderMaster

2. CasteCategoryMaster

3. AreaTypeMaster

4. HouseTypeMaster

5. CollegeTypeMaster

6. DistrictMaster

7. PFatherOccupationMaster WHERE Status=1

8. MotherOccupationMaster WHERE Status=1

Dropdown response object structure:

Each item returned by GetDropdown() has:

{

"Value": "database first-column value",

"Text": "database second-column value"

}

Important:

The controller uses SELECT \* for most master tables and assumes:

\* column 0 is the dropdown value

\* column 1 is the dropdown text

The exact database column names are not exposed by this controller for those SELECT \* queries.

Filtering:

\* GenderMaster: No explicit Status filter.

\* CasteCategoryMaster: No explicit Status filter.

\* AreaTypeMaster: No explicit Status filter.

\* HouseTypeMaster: No explicit Status filter.

\* CollegeTypeMaster: No explicit Status filter.

\* DistrictMaster: No explicit Status filter.

\* PFatherOccupationMaster: Status = 1.

\* MotherOccupationMaster: Status = 1.

UserID/EmployeeID/Role filtering:

None.

Default "-- Select --" option:

Not specified in controller.

Sorting:

Not specified in controller for these dropdown queries.

SUCCESS RESPONSE (200)

======================

The exact database values depend on the master tables.

Example structure:

{

"success": true,

"genders": [

{

"Value": "1",

"Text": "Male"

},

{

"Value": "2",

"Text": "Female"

}

],

"casteCategories": [

{

"Value": "1",

"Text": "Category Example"

}

],

"areaTypes": [

{

"Value": "1",

"Text": "Urban"

}

],

"houseTypes": [

{

"Value": "1",

"Text": "House Type Example"

}

],

"collegeTypes": [

{

"Value": "1",

"Text": "Government"

}

],

"districts": [

{

"Value": "1",

"Text": "District Example"

}

],

"fatherOccupations": [

{

"Value": "1",

"Text": "Occupation Example"

}

],

"motherOccupations": [

{

"Value": "1",

"Text": "Occupation Example"

}

]

}

The above values are illustrative only. The controller does not specify the actual master-table values.

FAILURE RESPONSES

=================

500 Internal Server Error

Occurs when a database/query or other exception is thrown.

Response:

{

"success": false,

"message": "Error message"

}

401 Unauthorized:

Not explicitly used because JWT is not required.

403 Forbidden:

Not explicitly used.

404 Not Found:

Not explicitly used.

400 Bad Request:

Not explicitly used.

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

=========================================================

3. STUDENT LIST

================

Endpoint:

GET /api/payana-students/list

Purpose:

Returns a combined list of Payana Students and approved Google Sheet Payana students.

The endpoint:

\* Retrieves records from PayanaStudents.

\* Retrieves approved records from GoogleSheet\_Payana\_NewStudent.

\* Combines both result sets using UNION ALL.

\* Adds volunteer assignment information for PayanaStudents.

\* Adds district information.

\* Adds house-visit information.

\* Supports name searching.

\* Supports district filtering.

\* Applies district-based filtering automatically for Volunteer users.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level existing [JwtSessionFilter].

Existing controller attribute:

[JwtSessionFilter]

This filter is applied directly to StudentList() and is NOT applied at controller level.

Required Claims:

The controller itself does not directly read JWT claims.

However, the action reads:

HttpContext.Current.Session["UserRole"]

HttpContext.Current.Session["District"]

Therefore, the JWT/session authentication mechanism is expected to populate these Session values before this action executes.

Required Roles:

No single role is universally required by the controller.

Special role behavior:

If Session["UserRole"] equals exactly "Volunteer", the result is automatically restricted to the district stored in Session["District"].

How claims/session values are used:

\* UserRole is read from Session.

\* District is read from Session.

\* If UserRole == "Volunteer", query condition:

AND T.DistrictName = @District

is added.

\* If UserRole is not "Volunteer", a supplied districtId query parameter can be used.

Important:

The controller does not explicitly verify that Session["UserRole"] or Session["District"] exists.

If those session values are null, a Volunteer user receives an empty district value through:

district ?? "".

JWT Claims:

Exact JWT claim names are Not specified in this controller.

The authentication/filter implementation is expected to establish the Session values.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| search | string | Optional | Searches StudentName using SQL LIKE. The value is trimmed and surrounded with % characters. |

| districtId | int | Optional | Filters T.DistrictID when supplied and when the authenticated session role is not Volunteer. |

Request Body:

None.

Pagination:

Not implemented.

Page number:

Not specified.

Page size:

Not specified.

Total count:

Returned as the count property in the response, representing the number of records returned in the current result.

Sorting:

Always:

ORDER BY T.StudentName

Therefore, results are sorted by StudentName ascending unless database collation produces a different ordering behavior.

Date filtering:

Not implemented.

DATABASE QUERY BEHAVIOR

=======================

The endpoint uses a UNION ALL query.

Source 1:

PayanaStudents

Joins:

\* LEFT JOIN Payana\_StudentVolunteerAssignment sva

ON s.StudentID = sva.StudentID

\* LEFT JOIN DistrictMaster d

ON s.DistrictID = d.DistrictID

\* LEFT JOIN HouseVisitForm hv

ON hv.StudentID = s.StudentID

Source 2:

GoogleSheet\_Payana\_NewStudent

Only records satisfying:

gs.Approve = 'Approved'

are included.

PayanaStudents fields returned:

\* StudentID

\* StudentName

\* ContactNumber

\* Address

\* PinCode

\* HouseVisitLink

\* Taluka

\* DistrictName

\* DistrictID

\* CollegeName

\* FamilyIncome

\* SecuredPercentage

\* VolunteerID

\* ApproveStatus

\* IsVisited

\* Source = "PayanaStudents"

Google Sheet fields returned:

\* ImportID mapped to StudentID

\* Name of student mapped to StudentName

\* Primary (What's app)Number mapped to ContactNumber

\* Residential address mapped to Address

\* PinCode = NULL

\* HouseVisitLink = NULL

\* Taluk mapped to Taluka

\* District mapped to DistrictName

\* DistrictID = NULL

\* College Name/School Name mapped to CollegeName

\* Family annual income converted to decimal(18,2)

\* Secured percentage in the academic year 2025-26 converted to decimal(5,2)

\* VolunteerID = NULL

\* ApproveStatus = NULL

\* IsVisited = 0

\* Source = "GoogleSheet"

Volunteer filtering:

If:

Session["UserRole"] == "Volunteer"

then:

AND T.DistrictName = @District

is added.

The district comes from:

Session["District"]

Search filtering:

If search is supplied:

AND T.StudentName LIKE @Search

Parameter:

@Search = "%" + search.Trim() + "%"

District filtering:

If districtId.HasValue AND role != "Volunteer":

AND T.DistrictID = @DistrictID

Parameter:

@DistrictID = districtId.Value

Important Volunteer rule:

A Volunteer cannot override the district restriction by supplying districtId because the districtId filter is only applied when role != "Volunteer".

Validation Rules:

1. JWT/session authentication is required because [JwtSessionFilter] is present.

2. Search is optional.

3. districtId is optional.

4. If role is Volunteer, districtId is ignored.

5. Volunteer results are restricted using Session["District"].

6. Search uses LIKE and is therefore a partial-name search.

7. No explicit validation exists for whether districtId corresponds to a valid DistrictMaster record.

8. No explicit validation exists for the search string length.

9. No pagination validation exists because pagination is not implemented.

10. Google Sheet records are included only when Approve = 'Approved'.

11. Google Sheet Family annual income is converted using TRY\_CONVERT(decimal(18,2), ...).

12. Google Sheet secured percentage is converted using TRY\_CONVERT(decimal(5,2), ...).

13. Conversion failures produce NULL rather than causing the query to fail.

SUCCESS RESPONSE (200)

======================

{

"success": true,

"count": 2,

"data": [

{

"StudentID": 101,

"Source": "PayanaStudents",

"StudentName": "Example Student",

"ContactNumber": "9876543210",

"Address": "Example Address",

"PinCode": "580001",

"HouseVisitLink": "/housevisit/example",

"Taluka": "Example Taluka",

"DistrictName": "Dharwad",

"CollegeName": "Example College",

"FamilyIncome": 250000.00,

"SecuredPercentage": 78.50,

"IsVisited": true,

"ApproveStatus": "Approved"

},

{

"StudentID": 5001,

"Source": "GoogleSheet",

"StudentName": "Another Student",

"ContactNumber": "9876543211",

"Address": "Another Address",

"PinCode": "",

"HouseVisitLink": "",

"Taluka": "Example Taluka",

"DistrictName": "Dharwad",

"CollegeName": "Example School",

"FamilyIncome": 180000.00,

"SecuredPercentage": 82.00,

"IsVisited": false,

"ApproveStatus": ""

}

]

}

Important:

The exact StudentID, names, values, and records depend on database contents.

Response Property Details:

| Property | Type | Description |

|----------|------|-------------|

| success | boolean | Indicates successful processing. |

| count | int | Number of records returned. |

| data | array | Array of PayanaStudentListVM objects. |

FAILURE RESPONSES

=================

401 Unauthorized

Applicable when:

The [JwtSessionFilter] rejects the request because the request is not authenticated or the authentication/session requirements are not satisfied.

The exact 401 response body is not specified in this controller because it is generated by the JwtSessionFilter implementation.

403 Forbidden

Potentially applicable if JwtSessionFilter implements role/permission rejection.

However, this action itself does not explicitly return HttpStatusCode.Forbidden.

Therefore:

403 behavior is Not specified in this controller.

400 Bad Request

Not explicitly returned by StudentList().

Invalid query values generally fall back to framework/model-binding behavior, but no explicit BadRequest() call exists in the action.

404 Not Found

Not explicitly returned.

500 Internal Server Error

Occurs when an exception is thrown inside the action and reaches the catch block.

Response:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK

\* 401 Unauthorized through JwtSessionFilter, depending on filter implementation

\* 403 Forbidden potentially through JwtSessionFilter, if implemented there

\* 500 Internal Server Error

400 and 404 are not explicitly generated by this action.

=========================================================

4. GET DISTRICTS

================

Endpoint:

GET /api/payana-students/districts

Purpose:

Returns all districts from DistrictMaster for authenticated users.

Content-Type:

application/json

Authorization:

JWT Required

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level existing [JwtSessionFilter].

Existing attribute:

[JwtSessionFilter]

The filter is applied only to GetDistricts() and other individually decorated actions.

Required Claims:

The controller does not directly read JWT claims.

Required Roles:

No specific role is enforced by the action.

Session dependency:

None directly used inside GetDistricts().

Important:

Although JWT is required by the existing [JwtSessionFilter], the action itself does not use UserID, EmployeeID, Role, or Session values to filter the district list.

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

Database Behavior:

Table:

DistrictMaster

Query:

SELECT

DistrictID,

DistrictName

FROM DistrictMaster

ORDER BY DistrictName

Operation:

SELECT only.

Filtering:

None.

UserID filtering:

None.

EmployeeID filtering:

None.

Role filtering:

None.

Status filtering:

None.

Sorting:

DistrictName ascending.

SUCCESS RESPONSE (200)

======================

{

"success": true,

"count": 3,

"data": [

{

"DistrictID": 1,

"DistrictName": "Belagavi"

},

{

"DistrictID": 2,

"DistrictName": "Dharwad"

},

{

"DistrictID": 3,

"DistrictName": "Gadag"

}

]

}

The actual district values depend on DistrictMaster.

FAILURE RESPONSES

=================

401 Unauthorized

Potentially generated by [JwtSessionFilter] when authentication fails.

The exact response body is not specified in this controller.

403 Forbidden

Not explicitly returned by GetDistricts().

May be generated by JwtSessionFilter depending on its implementation.

400 Bad Request

Not explicitly returned.

404 Not Found

Not explicitly returned.

500 Internal Server Error

Occurs when a database or other exception is caught.

Response:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK

\* 500 Internal Server Error

\* 401 Unauthorized through JwtSessionFilter, depending on filter implementation

\* 403 Forbidden potentially through JwtSessionFilter

400 and 404 are not explicitly generated.

=========================================================

COMMON DTOS

===========

DTO 1: PayanaStudentViewModel

=============================

Purpose:

Represents the Payana Student application data assembled from multipart/form-data before insertion into PayanaStudents.

The complete property definitions cannot be determined from the supplied controller because the actual PayanaStudentViewModel class was not supplied.

The following properties are explicitly referenced by the controller.

Properties:

| Property | Type Used by Controller | Required | Nullable | Description |

|----------|-------------------------|----------|----------|-------------|

| StudentName | string | Required | No | Student name. Explicitly validated. |

| DateOfBirth | DateTime? | Optional | Yes | Date of birth. |

| GenderID | int | Optional from controller | No | Gender master ID. Missing/invalid input becomes 0. |

| ContactNumber | string | Required | No | Contact number. Explicitly validated. |

| AlternateNumber | string | Optional | Yes | Alternate number. |

| Email | string | Required | No | Email address. Explicitly validated and checked for duplicates. |

| RAddress | string | Optional | Yes | Residential address. |

| CAddress | string | Optional | Yes | Current address. |

| Taluka | string | Optional | Yes | Taluka. |

| DistrictID | int | Optional from controller | No | District master ID. |

| OtherDistrict | string | Optional | Yes | Other district. |

| PinCode | string | Optional | Yes | PIN code. |

| AreaTypeID | int | Optional from controller | No | Area type ID. |

| CasteCategoryID | int | Optional from controller | No | Caste category ID. |

| HouseTypeID | int | Optional from controller | No | House type ID. |

| FatherName | string | Optional | Yes | Father's name. |

| MotherName | string | Optional | Yes | Mother's name. |

| FatherOccupationID | int? | Optional | Yes | Father's occupation ID. |

| MotherOccupationID | int? | Optional | Yes | Mother's occupation ID. |

| FamilyMembers | int | Optional from controller | No | Family member count. |

| FamilyIncome | decimal | Optional from controller | No | Family income. |

| ParentBank | decimal | Optional from controller | No | Parents' bank balance. |

| CollegeName | string | Optional | Yes | College/school name. |

| CollegeTypeID | int | Optional from controller | No | College type ID. |

| CollegeCNumber | string | Optional | Yes | College contact number. |

| CourseSA | string | Optional | Yes | Course information. |

| CourseStream | string | Optional | Yes | Course stream. |

| AnnualFees | decimal | Optional from controller | No | Annual fees. |

| TotalExpenses | decimal | Optional from controller | No | Total expenses. |

| StudentAchivements | string | Optional | Yes | Student achievements. |

| securedPercentage | string | Optional | Yes | Secured percentage supplied as string and converted to decimal before insertion. |

| AccountHolderName | string | Optional | Yes | Bank account holder name. |

| bankaccountno | string | Optional | Yes | Bank account number. |

| ifsccode | string | Optional | Yes | IFSC code. |

| bankname | string | Optional | Yes | Bank name. |

| branchname | string | Optional | Yes | Bank branch name. |

| HouseVisitLink | string | Optional | Yes | House visit link. |

| ReferenceSourceOther | string | Optional | Yes | Other reference source. |

Important:

The exact C# declared types of every property are inferred from how the controller uses them. The actual DTO source was not supplied.

Sample Request Model:

This model is not sent as JSON directly. It is represented as multipart/form-data.

Representative logical structure:

{

"StudentName": "Example Student",

"DateOfBirth": "2008-05-10",

"GenderID": 1,

"ContactNumber": "9876543210",

"AlternateNumber": "9876543211",

"Email": "student@example.com",

"RAddress": "Residential Address",

"CAddress": "Current Address",

"Taluka": "Example Taluka",

"DistrictID": 2,

"OtherDistrict": null,

"PinCode": "580001",

"AreaTypeID": 1,

"CasteCategoryID": 2,

"HouseTypeID": 1,

"FatherName": "Father Name",

"MotherName": "Mother Name",

"FatherOccupationID": 1,

"MotherOccupationID": 2,

"FamilyMembers": 5,

"FamilyIncome": 250000.00,

"ParentBank": 50000.00,

"CollegeName": "Example College",

"CollegeTypeID": 1,

"CollegeCNumber": "0836XXXXXXX",

"CourseSA": "B.Sc",

"CourseStream": "Science",

"AnnualFees": 30000.00,

"TotalExpenses": 50000.00,

"StudentAchivements": "Academic achievement",

"securedPercentage": "82.50",

"AccountHolderName": "Example Student",

"bankaccountno": "1234567890",

"ifsccode": "EXAMPLE0001",

"bankname": "Example Bank",

"branchname": "Example Branch",

"HouseVisitLink": "https://example.com/housevisit",

"ReferenceSourceOther": "Other source"

}

DTO 2: PayanaStudentListVM

===========================

Purpose:

Represents one item in the combined student list returned by GET /api/payana-students/list.

Properties explicitly populated by the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes in response | No | Student ID from PayanaStudents.StudentID or GoogleSheet\_Payana\_NewStudent.ImportID. |

| Source | string | Yes in response | No | Identifies source as "PayanaStudents" or "GoogleSheet". |

| StudentName | string | Yes in response | No | Student name. DBNull becomes empty string. |

| ContactNumber | string | Yes in response | No | Contact number. DBNull becomes empty string. |

| Address | string | Yes in response | No | Address. DBNull becomes empty string. |

| PinCode | string | Yes in response | No | PIN code. DBNull becomes empty string. |

| HouseVisitLink | string | Yes in response | No | House visit link. DBNull becomes empty string. |

| Taluka | string | Yes in response | No | Taluka. DBNull becomes empty string. |

| DistrictName | string | Yes in response | No | District name. DBNull becomes empty string. |

| CollegeName | string | Yes in response | No | College name. DBNull becomes empty string. |

| FamilyIncome | decimal? | Optional / Nullable | Yes | Family income. |

| SecuredPercentage | decimal? | Optional / Nullable | Yes | Secured percentage. |

| IsVisited | bool | Yes in response | No | True when IsVisited database value equals 1. |

| ApproveStatus | string | Yes in response | No | Approval status. DBNull becomes empty string. |

Important:

VolunteerID and DistrictID are selected by the SQL query but are NOT assigned to PayanaStudentListVM in the shown controller. Therefore, they should not be considered part of the exposed response unless the DTO itself contains separately populated/default properties. Their final API exposure is not specified by this controller.

Sample Response Item:

{

"StudentID": 101,

"Source": "PayanaStudents",

"StudentName": "Example Student",

"ContactNumber": "9876543210",

"Address": "Example Address",

"PinCode": "580001",

"HouseVisitLink": "/Uploads/housevisit.pdf",

"Taluka": "Example Taluka",

"DistrictName": "Dharwad",

"CollegeName": "Example College",

"FamilyIncome": 250000.00,

"SecuredPercentage": 82.50,

"IsVisited": true,

"ApproveStatus": "Approved"

}

DTO 3: Dropdown Item

====================

Purpose:

GetDropdown() creates anonymous objects rather than a named DTO.

Structure:

| Property | Type | Description |

|----------|------|-------------|

| Value | string | First column returned by the corresponding dropdown query. |

| Text | string | Second column returned by the corresponding dropdown query. |

Sample:

{

"Value": "1",

"Text": "Example"

}

Important:

This is an anonymous object and not a named C# DTO in the supplied controller.

DTO 4: District Item

====================

Purpose:

GetDistricts() creates anonymous district objects rather than using a named DTO.

Structure:

| Property | Type | Description |

|----------|------|-------------|

| DistrictID | int | District identifier. |

| DistrictName | string | District name. |

Sample:

{

"DistrictID": 1,

"DistrictName": "Dharwad"

}

Important:

This is an anonymous object and not a named C# DTO in the supplied controller.

=========================================================

AUTHORIZATION SUMMARY

=====================

Endpoint | HTTP Method | JWT Required | Existing Filter | Role Rules

---------|-------------|--------------|-----------------|------------

/api/payana-students/create | POST | No | None | Public

/api/payana-students/dropdowns | GET | No | None | Public

/api/payana-students/list | GET | Yes | [JwtSessionFilter] | Volunteer receives district-restricted results

/api/payana-students/districts | GET | Yes | [JwtSessionFilter] | No specific role enforced

Important:

There is NO controller-level [JwtSessionFilter].

JWT is therefore not required for the create or dropdown endpoints based on the supplied controller.

The list and districts endpoints explicitly contain [JwtSessionFilter] and therefore require authentication according to the current implementation.

=========================================================

JWT / SESSION DEPENDENCY DETAILS

================================

For:

GET /api/payana-students/list

The action executes:

string role =

HttpContext.Current.Session["UserRole"]?.ToString();

string district =

HttpContext.Current.Session["District"]?.ToString();

The authenticated user's session therefore needs to contain:

Session["UserRole"]

Session["District"]

The controller does not show the code that creates these Session values.

Therefore:

JWT Claim Names:

Not specified in controller.

Expected authentication flow:

1. Client sends:

Authorization: Bearer <JWT\_TOKEN>

2. JwtSessionFilter processes the JWT.

3. The filter is expected to authenticate the user.

4. The filter/session mechanism is expected to populate Session values.

5. StudentList() reads UserRole and District from Session.

6. If UserRole is "Volunteer", district filtering is automatically applied.

Required Role:

No single role is required for access to StudentList() by the action itself.

Special role:

Volunteer

Volunteer business rule:

When UserRole == "Volunteer":

\* districtId query parameter does not override the restriction.

\* Results are filtered by Session["District"].

\* The comparison is against DistrictName, not DistrictID.

=========================================================

FILE STORAGE SUMMARY

====================

Temporary upload folder:

~/App\_Data/TempUploads

Final upload folder:

~/Uploads/

Physical path resolution:

HttpContext.Current.Server.MapPath(...)

Generated file name:

Guid.NewGuid().ToString("N") + original extension

Example:

8f7a1e2c3d4b5a67890123456789abcd.pdf

Stored database path:

/Uploads/8f7a1e2c3d4b5a67890123456789abcd.pdf

File name source:

Original filename is used only to obtain the extension.

Security/validation:

\* No extension whitelist is implemented.

\* No MIME-type whitelist is implemented.

\* No file-size check is implemented.

\* No explicit filename sanitization is required because the generated filename does not use the original filename.

\* Multiple matching files are not all processed; the first matching file is returned.

\* Files are optional.

\* Files are saved before database insertion.

\* No cleanup/rollback of saved files occurs if database insertion subsequently fails.

=========================================================

DATABASE TABLE SUMMARY

======================

1. PayanaStudents

-----------------

Used by:

POST /api/payana-students/create

GET /api/payana-students/list

Operations:

\* INSERT

\* SELECT

\* Duplicate email COUNT query

Important fields used:

StudentID

StudentName

DateOfBirth

GenderID

ContactNumber

AlternateNumber

Email

Address

CurrentAddress

Taluka

DistrictID

OtherDistrict

PinCode

AreaTypeID

CasteCategoryID

HouseTypeID

FatherName

MotherName

FatherOccupationID

MotherOccupationID

FamilyMembers

FamilyIncome

ParentsBankBalance

CollegeName

CollegeTypeID

CollegeContactNumber

CourseSA

CourseStream

AnnualFees

TotalExpenses

StudentAchievement

SecuredPercentage

AccountHolderName

BankAccountNumber

IFSCCode

BankName

BranchName

MarksCardPath

BankPassbookPath

StudentPhotoPath

HousePhotoPath

AadharPath

HouseVisitLink

ReferenceSourceOther

2. Payana\_StudentVolunteerAssignment

------------------------------------

Used by:

GET /api/payana-students/list

Operation:

LEFT JOIN

Join:

Payana\_StudentVolunteerAssignment.StudentID

=

PayanaStudents.StudentID

Field exposed in SQL:

VolunteerID

The controller does not map VolunteerID into the shown PayanaStudentListVM object.

3. DistrictMaster

------------------

Used by:

GET /api/payana-students/dropdowns

GET /api/payana-students/list

GET /api/payana-students/districts

Operations:

\* SELECT

\* LEFT JOIN

GetDistricts query:

SELECT DistrictID, DistrictName

FROM DistrictMaster

ORDER BY DistrictName

4. HouseVisitForm

-----------------

Used by:

GET /api/payana-students/list

Operation:

LEFT JOIN

Join:

HouseVisitForm.StudentID

=

PayanaStudents.StudentID

Used to determine:

IsVisited

Logic:

WHEN hv.StudentID IS NOT NULL THEN 1

ELSE 0

5. GoogleSheet\_Payana\_NewStudent

--------------------------------

Used by:

GET /api/payana-students/list

Operation:

SELECT

Filter:

Approve = 'Approved'

Important conversions:

Family annual income:

TRY\_CONVERT(decimal(18,2), gs.[Family annual income])

Secured percentage:

TRY\_CONVERT(decimal(5,2), gs.[Secured percentage in the academic year 2025-26])

6. GenderMaster

----------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM GenderMaster

7. CasteCategoryMaster

----------------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM CasteCategoryMaster

8. AreaTypeMaster

-----------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM AreaTypeMaster

9. HouseTypeMaster

------------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM HouseTypeMaster

10. CollegeTypeMaster

---------------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM CollegeTypeMaster

11. PFatherOccupationMaster

---------------------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM PFatherOccupationMaster WHERE Status=1

Only active records where Status = 1 are returned.

12. MotherOccupationMaster

---------------------------

Used by:

GET /api/payana-students/dropdowns

Query:

SELECT \* FROM MotherOccupationMaster WHERE Status=1

Only active records where Status = 1 are returned.

=========================================================

HTTP STATUS CODE SUMMARY

========================

POST /api/payana-students/create:

\* 200 OK

\* 400 Bad Request

\* 409 Conflict

\* 500 Internal Server Error

GET /api/payana-students/dropdowns:

\* 200 OK

\* 500 Internal Server Error

GET /api/payana-students/list:

\* 200 OK

\* 401 Unauthorized may be produced by JwtSessionFilter

\* 403 Forbidden may be produced by JwtSessionFilter depending on implementation

\* 500 Internal Server Error

GET /api/payana-students/districts:

\* 200 OK

\* 401 Unauthorized may be produced by JwtSessionFilter

\* 403 Forbidden may be produced by JwtSessionFilter depending on implementation

\* 500 Internal Server Error

=========================================================

COMPLETE ENDPOINT INVENTORY

===========================

1. POST /api/payana-students/create

Purpose: Public Payana student application submission.

JWT: NOT REQUIRED

Content-Type: multipart/form-data

2. GET /api/payana-students/dropdowns

Purpose: Public application dropdown/master data.

JWT: NOT REQUIRED

Content-Type: application/json

3. GET /api/payana-students/list

Purpose: Authenticated Payana/Google Sheet student listing with search and district filtering.

JWT: REQUIRED

Existing Filter: [JwtSessionFilter]

Role-specific behavior: Volunteer district restriction.

4. GET /api/payana-students/districts

Purpose: Authenticated district list.

JWT: REQUIRED

Existing Filter: [JwtSessionFilter]

Role-specific behavior: None.

=========================================================

IMPORTANT IMPLEMENTATION NOTES

==============================

1. No JWT filter should be added to the controller class because the supplied controller does not apply authentication to every endpoint.

2. The existing action-level [JwtSessionFilter] must remain on:

\* StudentList()

\* GetDistricts()

3. The following endpoints are public based on the supplied controller:

\* CreatePayanaStudent()

\* GetDropdowns()

4. The list endpoint relies on Session["UserRole"] and Session["District"]. The implementation of JwtSessionFilter is not supplied, so the exact JWT claim-to-session mapping cannot be documented beyond stating that the session values are required by StudentList().

5. The controller does not explicitly enforce a specific role for StudentList(). It changes query behavior when the role equals "Volunteer".

6. The districts endpoint requires JWT because of [JwtSessionFilter], but its own code does not use the authenticated identity for filtering.

7. The controller does not implement pagination for the student list.

8. The student list is sorted by StudentName.

9. Search is case/collation dependent because SQL LIKE is used without an explicit LOWER/UPPER conversion.

10. Google Sheet records are included only when Approve = "Approved".

11. The Google Sheet source does not have DistrictID, so districtId filtering may exclude Google Sheet records when a districtId is supplied because their T.DistrictID is NULL.

12. A Volunteer is filtered by DistrictName instead of DistrictID.

13. The controller does not explicitly validate foreign-key/master-table IDs before inserting a new student.

14. The controller does not explicitly validate email format.

15. The controller does not explicitly validate file extensions, MIME types, or file sizes.

16. The controller uses AddWithValue for SQL parameters.

17. No explicit SQL transaction is used.

18. File saving and database insertion are not atomic. If database insertion fails after file saving, uploaded files may remain in ~/Uploads/.

19. The controller returns ex.Message directly in HTTP 500 responses. This may expose internal exception details and should be reviewed for production environments.

20. The actual definitions of PayanaStudentViewModel and PayanaStudentListVM were not included in the supplied source. Therefore, their exact C# property declarations, attributes such as [Required], [StringLength], [Range], and any additional properties not referenced by this controller cannot be determined from the controller alone.

21. No default status, CreatedBy, ModifiedBy, UserID, EmployeeID, or CreatedDate values are assigned by this controller unless the database itself supplies defaults. Such database defaults are not visible here.

22. No update or delete endpoints exist in this controller.

23. No explicit 404 Not Found response is implemented by any endpoint.

24. No explicit 403 Forbidden response is implemented by any endpoint. Any 403 response for protected actions would have to originate from JwtSessionFilter or other pipeline authorization not shown in this controller.

=========================================================

END OF API CONTRACT

=========================================================