# PAYANA STUDENTS API CONTRACT

Base Route: api/payana-students

Authentication: JWT Bearer Token is required only for authenticated endpoints explicitly marked below.

## Authorization Summary:

## Endpoint JWT Volunteer

POST /api/payana-students/create NO NO GET /api/payana-students/dropdowns NO NO GET /api/payana-students/list YES YES GET /api/payana-students/districts YES NO ————————————————————

IMPORTANT: For users with the role “Volunteer”, the Student List endpoint is the only endpoint that is required/available for their operational access.

The Student List API automatically restricts Volunteers to students belonging to the district stored in the authenticated user’s session.

============================================================ 1. CREATE PAYANA STUDENT APPLICATION ============================================================

Endpoint: POST /api/payana-students/create

Purpose: Creates/submits a new Payana student application.

Authentication: JWT NOT REQUIRED.

Access: Public.

Content-Type: multipart/form-data

Request Type: Multipart form-data containing student information and optional document uploads.

|  |
| --- |
| REQUEST FORM FIELDS |

## BASIC STUDENT DETAILS

Field: StudentName Type: string Required: YES Description: Full name of the student.

Validation:

* Must not be null, empty, or whitespace.
* Application is rejected if missing.

Example: StudentName=Rahul Kumar

Field: DateOfBirth Type: date Required: NO Description: Student’s date of birth.

Accepted by API: DateTime.Parse-compatible date value.

Example: DateOfBirth=2005-06-15

Field: GenderID Type: int Required: NO Description: ID of the student’s gender from GenderMaster.

Default if invalid/not supplied: 0

Field: ContactNumber Type: string Required: YES Description: Primary contact number.

Validation:

* Must not be null, empty, or whitespace.

Example: ContactNumber=9876543210

Field: AlternateNumber Type: string Required: NO Description: Alternate contact number.

Example: AlternateNumber=9988776655

Field: Email Type: string Required: YES Description: Student’s email address.

Validation:

* Must not be null, empty, or whitespace.
* Email must not already exist in PayanaStudents.
* Email comparison is case-insensitive.

Duplicate Behaviour: If the email already exists:

HTTP Status: 409 Conflict

Response: { “success”: false, “message”: “This Email ID is already registered. Student can apply only once.” }

|  |
| --- |
| ADDRESS DETAILS |

Field: RAddress Type: string Required: NO Description: Residential address.

Field: CAddress Type: string Required: NO Description: Current address.

Field: Taluka Type: string Required: NO Description: Taluka of the student.

Field: DistrictID Type: int Required: NO Description: District master ID.

Field: OtherDistrict Type: string Required: NO Description: Other district information, if applicable.

Field: PinCode Type: string Required: NO Description: Postal PIN code.

|  |
| --- |
| CATEGORY DETAILS |

Field: AreaTypeID Type: int Required: NO Description: Area type master ID.

Field: CasteCategoryID Type: int Required: NO Description: Caste category master ID.

Field: HouseTypeID Type: int Required: NO Description: House type master ID.

|  |
| --- |
| FAMILY DETAILS |

Field: FatherName Type: string Required: NO

Field: MotherName Type: string Required: NO

Field: FatherOccupationID Type: int Required: NO Description: Father occupation master ID.

Field: MotherOccupationID Type: int Required: NO Description: Mother occupation master ID.

Field: FamilyMembers Type: int Required: NO Description: Number of family members.

Default: 0

Field: FamilyIncome Type: decimal Required: NO Description: Family income.

Default: 0

Field: ParentBank Type: decimal Required: NO Description: Parents’ bank balance.

Default: 0

|  |
| --- |
| EDUCATION DETAILS |

Field: CollegeName Type: string Required: NO

Field: CollegeTypeID Type: int Required: NO Description: College type master ID.

Field: CollegeCNumber Type: string Required: NO Description: College contact number.

Field: CourseSA Type: string Required: NO Description: Course information.

Field: CourseStream Type: string Required: NO Description: Course stream.

Field: AnnualFees Type: decimal Required: NO Description: Annual college/course fees.

Default: 0

Field: TotalExpenses Type: decimal Required: NO Description: Total expenses.

Default: 0

Field: StudentAchivements Type: string Required: NO Description: Student achievements.

Field: securedPercentage Type: decimal/string Required: NO Description: Percentage secured by the student.

Processing: The API attempts to convert the supplied value to decimal.

If conversion fails: The value is stored as NULL.

|  |
| --- |
| BANK DETAILS |

Field: AccountHolderName Type: string Required: NO

Field: bankaccountno Type: string Required: NO

Field: ifsccode Type: string Required: NO

Field: bankname Type: string Required: NO

Field: branchname Type: string Required: NO

|  |
| --- |
| OTHER DETAILS |

Field: HouseVisitLink Type: string Required: NO Description: House Visit-related link/path associated with the student.

Important: This field is stored during student creation but this controller does not provide an API endpoint for creating or editing a House Visit.

Field: ReferenceSourceOther Type: string Required: NO Description: Other reference source information.

|  |
| --- |
| FILE UPLOADS |

The endpoint accepts the following multipart file fields:

1. latestmarkscard
2. studentpassbookFP
3. StudentPhoto
4. dwellingunit
5. adharcard

Content-Type: multipart/form-data

File Processing:

* Uploaded files are temporarily processed.
* Files are moved to the application’s /Uploads/ folder.
* A GUID-based filename is generated.
* The database stores the generated /Uploads/ path.

Example: latestmarkscard = studentpassbookFP = StudentPhoto = dwellingunit = adharcard =

|  |
| --- |
| SUCCESS RESPONSE |

HTTP Status: 200 OK

Response:

{ “success”: true, “message”: “Payana Student Application Submitted Successfully!” }

|  |
| --- |
| VALIDATION / ERROR RESPONSES |

Missing StudentName:

HTTP Status: 400 Bad Request

{ “success”: false, “message”: “StudentName is required.” }

Missing Email:

HTTP Status: 400 Bad Request

{ “success”: false, “message”: “Email is required.” }

Missing ContactNumber:

HTTP Status: 400 Bad Request

{ “success”: false, “message”: “ContactNumber is required.” }

Duplicate Email:

HTTP Status: 409 Conflict

{ “success”: false, “message”: “This Email ID is already registered. Student can apply only once.” }

Invalid Content Type:

HTTP Status: 400 Bad Request

{ “success”: false, “message”: “Request must be multipart/form-data.” }

Unexpected Server Error:

HTTP Status: 500 Internal Server Error

{ “success”: false, “message”: “” }

============================================================ 2. GET PAYANA STUDENT DROPDOWNS ============================================================

Endpoint: GET /api/payana-students/dropdowns

Purpose: Returns all master-data dropdown values required by the Payana student application form.

Authentication: JWT NOT REQUIRED.

Access: Public.

HTTP Method: GET

Request Parameters: None.

|  |
| --- |
| RESPONSE |

HTTP Status: 200 OK

Response Structure:

{ “success”: true, “genders”: [], “casteCategories”: [], “areaTypes”: [], “houseTypes”: [], “collegeTypes”: [], “districts”: [], “fatherOccupations”: [], “motherOccupations”: [] }

|  |
| --- |
| DROPDOWN SOURCES |

genders: GenderMaster

casteCategories: CasteCategoryMaster

areaTypes: AreaTypeMaster

houseTypes: HouseTypeMaster

collegeTypes: CollegeTypeMaster

districts: DistrictMaster

fatherOccupations: PFatherOccupationMaster

Filter: Status = 1

motherOccupations: MotherOccupationMaster

Filter: Status = 1

|  |
| --- |
| DROPDOWN ITEM FORMAT |

Each dropdown item is returned as:

{ “Value”: “”, “Text”: “” }

The exact database columns used are the first and second columns returned by the respective SQL query.

|  |
| --- |
| ERROR RESPONSE |

HTTP Status: 500 Internal Server Error

{ “success”: false, “message”: “” }

============================================================ 3. GET PAYANA STUDENT LIST ============================================================

Endpoint: GET /api/payana-students/list

Purpose: Returns the Payana student list for authenticated users.

This is the PRIMARY student-list API.

Authentication: JWT REQUIRED.

Authorization: Authenticated users.

Volunteer Access: YES.

IMPORTANT VOLUNTEER RULE: For a user whose role is “Volunteer”, this is the only student-list endpoint required for their operational access.

The API automatically obtains the following values from the authenticated session:

UserRole: HttpContext.Current.Session[“UserRole”]

District: HttpContext.Current.Session[“District”]

|  |
| --- |
| QUERY PARAMETERS |

Parameter: search Type: string Required: NO

Description: Searches students by StudentName.

Filtering: StudentName LIKE ‘%search%’

Example:

GET /api/payana-students/list?search=Rahul

Parameter: districtId Type: int Required: NO

Description: Filters students by DistrictID.

IMPORTANT: This parameter is ignored for users whose role is “Volunteer”.

For Volunteers, district filtering is automatically applied using the authenticated user’s session District.

|  |
| --- |
| VOLUNTEER AUTHORIZATION AND FILTERING |

When:

UserRole = “Volunteer”

The API automatically applies:

DistrictName = authenticated user’s Session[“District”]

Therefore, a Volunteer cannot select another district through:

districtId

The API does not use the supplied districtId for Volunteer users.

Example:

Authenticated Volunteer session:

UserRole = Volunteer District = Bengaluru

Request:

GET /api/payana-students/list

Result: Only approved Payana students whose DistrictName is Bengaluru are returned.

|  |
| --- |
| NON-VOLUNTEER DISTRICT FILTERING |

For authenticated users whose role is NOT “Volunteer”:

If districtId is supplied:

GET /api/payana-students/list?districtId=5

The API applies:

DistrictID = 5

If districtId is not supplied: No districtId filter is applied.

|  |
| --- |
| SEARCH + DISTRICT EXAMPLE |

GET:

/api/payana-students/list?search=Rahul&districtId=5

For non-Volunteer:

* Student name is filtered using search.
* DistrictID is filtered using districtId.

For Volunteer:

* Student name is filtered using search.
* districtId is ignored.
* Session District is used instead.

|  |
| --- |
| DATA SOURCES |

The API combines two student sources using UNION ALL:

1. PayanaStudents
2. GoogleSheet\_Payana\_NewStudent

PayanaStudents

|  |
| --- |
| PAYANA STUDENTS SOURCE |

Conditions: ApproveStatus = ‘Approved’

Additional joins:

Payana\_StudentVolunteerAssignment

DistrictMaster

HouseVisitForm

GoogleSheet\_Payana\_NewStudent

|  |
| --- |
| GOOGLE SHEET STUDENT SOURCE |

Condition: Approve = ‘Approved’

For Google Sheet records:

Source: GoogleSheet

StudentID: ImportID

HouseVisitLink: NULL

IsVisited: 0

|  |
| --- |
| HOUSE VISIT INFORMATION IN STUDENT LIST |

The Student List API exposes House Visit information.

Field: HouseVisitLink

Description: House Visit link/path stored for the student.

For Google Sheet students: HouseVisitLink is NULL.

Field: IsVisited

Type: boolean

Description: Indicates whether a House Visit record exists.

For PayanaStudents:

If a matching record exists in HouseVisitForm:

IsVisited = true

Otherwise:

IsVisited = false.

For Google Sheet students:

IsVisited = false.

IMPORTANT: This API only exposes the House Visit status/link in the student list.

There is NO House Visit create/update endpoint implemented in the supplied PayanaStudentsApiController.

Therefore, the client application must not assume that:

POST /api/payana-students/housevisit

or any other House Visit endpoint exists unless a separate House Visit controller/API is implemented.

|  |
| --- |
| STUDENT LIST RESPONSE |

HTTP Status: 200 OK

Response:

{ “success”: true, “count”: 2, “data”: [ { “StudentID”: 101, “Source”: “PayanaStudents”, “StudentName”: “Rahul Kumar”, “ContactNumber”: “9876543210”, “Address”: “Bengaluru”, “PinCode”: “560001”, “HouseVisitLink”: “/HouseVisit/101”, “Taluka”: “Bengaluru North”, “DistrictName”: “Bengaluru”, “CollegeName”: “ABC College”, “FamilyIncome”: 250000.00, “SecuredPercentage”: 82.50, “IsVisited”: true, “ApproveStatus”: “Approved” } ] }

|  |
| --- |
| RESPONSE FIELD DEFINITIONS |

StudentID Type: int Description: Unique student ID.

For PayanaStudents: StudentID

For GoogleSheet\_Payana\_NewStudent: ImportID

Source Type: string

Possible values currently returned:

* PayanaStudents
* GoogleSheet

StudentName Type: string

ContactNumber Type: string

Address Type: string

PinCode Type: string

HouseVisitLink Type: string

Taluka Type: string

DistrictName Type: string

CollegeName Type: string

FamilyIncome Type: decimal/null

SecuredPercentage Type: decimal/null

IsVisited Type: boolean

true: A HouseVisitForm record exists for the Payana student.

false: No HouseVisitForm record exists.

ApproveStatus Type: string

For PayanaStudents: The value comes from PayanaStudents.ApproveStatus.

For Google Sheet students: NULL / empty.

|  |
| --- |
| HOUSE VISIT BUTTON RULE |

The Student List response provides:

IsVisited HouseVisitLink Source StudentID

The frontend can use these fields to determine the House Visit button state.

IMPORTANT: The supplied controller does NOT define the actual House Visit button click endpoint.

Therefore, this contract documents only the House Visit information returned by the student-list API and does not invent a click API.

|  |
| --- |
| EMPTY LIST RESPONSE |

HTTP Status: 200 OK

Example:

{ “success”: true, “count”: 0, “data”: [] }

|  |
| --- |
| ERROR RESPONSE |

HTTP Status: 500 Internal Server Error

{ “success”: false, “message”: “” }

============================================================ 4. GET DISTRICTS ============================================================

Endpoint: GET /api/payana-students/districts

Purpose: Returns the complete district master list.

Authentication: JWT REQUIRED.

Access: Authenticated users.

Volunteer: NOT REQUIRED.

IMPORTANT: The supplied controller does not mark this endpoint as a Volunteer-specific endpoint.

The Volunteer Student List API obtains the Volunteer district automatically from the authenticated session and therefore does not require this endpoint to determine the Volunteer district.

|  |
| --- |
| REQUEST PARAMETERS |

None.

|  |
| --- |
| RESPONSE |

HTTP Status: 200 OK

Response:

{ “success”: true, “count”: 3, “data”: [ { “DistrictID”: 1, “DistrictName”: “Bengaluru” }, { “DistrictID”: 2, “DistrictName”: “Mysuru” } ] }

|  |
| --- |
| RESPONSE FIELDS |

DistrictID Type: int Description: District master ID.

DistrictName Type: string Description: District display name.

|  |
| --- |
| ERROR RESPONSE |

HTTP Status: 500 Internal Server Error

{ “success”: false, “message”: “” }

============================================================ JWT AUTHENTICATION CONTRACT ============================================================

JWT is required for:

1. GET /api/payana-students/list
2. GET /api/payana-students/districts

JWT is NOT required for:

1. POST /api/payana-students/create
2. GET /api/payana-students/dropdowns

|  |
| --- |
| AUTHENTICATED REQUEST FORMAT |

For JWT-protected endpoints, send:

Authorization: Bearer

Example:

GET /api/payana-students/list

Authorization: Bearer eyJhbGciOi…

|  |
| --- |
| VOLUNTEER ACCESS RULE |

Volunteer users require access to:

GET /api/payana-students/list

The API identifies the Volunteer through:

HttpContext.Current.Session[“UserRole”]

When:

UserRole = “Volunteer”

the API also obtains:

HttpContext.Current.Session[“District”]

The returned student list is automatically restricted to:

DistrictName = Session[“District”]

The Volunteer cannot override this restriction by supplying:

districtId

Therefore:

GET /api/payana-students/list?districtId=10

does NOT allow a Volunteer to retrieve district 10 if their authenticated session district is different.

============================================================ ENDPOINT SUMMARY ============================================================

1. POST /api/payana-students/create

Purpose: Public Payana student application submission.

JWT: NO

Content-Type: multipart/form-data

1. GET /api/payana-students/dropdowns

Purpose: Returns application dropdown/master data.

JWT: NO

1. GET /api/payana-students/list

Purpose: Returns approved Payana students.

JWT: YES

Volunteer: YES

Volunteer filtering: Automatic district restriction from authenticated session.

1. GET /api/payana-students/districts

Purpose: Returns district master list.

JWT: YES

Volunteer: Not required for Volunteer student-list functionality.

============================================================ COMPLETE VOLUNTEER FLOW ============================================================

Step 1: Volunteer logs into the application and receives a JWT.

Step 2: JWT is supplied in the Authorization header.

Step 3: Frontend calls:

GET /api/payana-students/list

Step 4: API validates the authenticated session/JWT.

Step 5: API identifies:

UserRole = Volunteer

Step 6: API reads the Volunteer district from:

Session[“District”]

Step 7: API returns only approved students belonging to that district.

Step 8: Frontend displays the returned student list.

Step 9: For each student, the frontend can inspect:

StudentID Source HouseVisitLink IsVisited

to determine the current House Visit status.

NOTE: The actual House Visit creation/submission API is not part of this controller and therefore is not defined in this contract. ============================================================ END OF API CONTRACT ============================================================