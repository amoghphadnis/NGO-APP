=========================================================

SEMI-PROFESSIONAL VOLUNTEER ASSIGNMENT API CONTRACT

=========================================================

Document Status:

Derived strictly from the supplied ASP.NET Web API controller.

Important:

This contract documents the behavior currently implemented in the supplied controller. Where behavior cannot be determined from the controller, it is explicitly marked "Not specified in controller."

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/semi-professional-volunteer-assignment

Authentication:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute.

Current Controller Scope:

No controller-level JWT filter is present.

Important:

All endpoints in the supplied controller have [JwtSessionFilter]. Therefore, based strictly on the supplied code, JWT authentication is currently required for every endpoint in this controller.

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Role-Based Authorization:

The controller does not use [Authorize(Roles = ...)] or an equivalent role attribute.

However, the following two endpoints contain explicit business-level Volunteer restrictions:

- GET /students

- GET /volunteers

For those endpoints, if the authenticated session UserRole is "Volunteer", the requested DistrictID is overridden with the authenticated user's Session DistrictID.

The controller does NOT explicitly reject non-Volunteer roles, and it does not explicitly require the "Volunteer" role.

=========================================================

AUTHENTICATION / SESSION DEPENDENCY

===================================

Existing Authorization Mechanism:

[JwtSessionFilter] is applied directly to every action.

JWT Required:

Yes, for every endpoint in the supplied controller.

JWT Claims:

The controller itself does not directly read JWT claims.

Session Values Used:

- UserRole

- DistrictID

The controller reads these values from:

HttpContext.Current.Session["UserRole"]

HttpContext.Current.Session["DistrictID"]

Therefore, the authentication/filter infrastructure is expected to populate these Session values before the actions execute.

JWT Claim-to-Session Mapping:

Not specified in controller.

Expected logical dependency:

JWT -> JwtSessionFilter -> Session["UserRole"] / Session["DistrictID"]

The exact JWT claim names, types, and mapping rules are not specified in the supplied controller.

=========================================================

[1]. GET INITIAL ASSIGNMENT PAGE DATA

=====================================

Endpoint:

GET /api/semi-professional-volunteer-assignment/initial-data

Purpose:

Returns the district dropdown/list data required to initialize the Semi-Professional Volunteer Assignment page.

The endpoint returns:

- A list of all districts from DistrictMaster.

- An empty data array for students.

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly specified.

- The endpoint does not perform an explicit role check.

- The endpoint does not read UserRole or DistrictID from Session.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not specified in controller.

Required Roles:

None explicitly specified.

How claims are used:

The action itself does not directly consume JWT claims or Session identity values.

Session Dependency:

None in the action.

Validation Rules:

- No request parameters are required.

- No request body is required.

- No explicit input validation is performed.

- The district query returns all rows from DistrictMaster.

- District ordering is alphabetical by DistrictName.

Business Logic Notes:

- Calls GetDistrictListInternal().

- Districts are retrieved from DistrictMaster.

- Results are ordered by DistrictName.

- The returned student data collection is intentionally empty:

"data": []

- No student filtering is performed by this endpoint.

- No UserID, EmployeeID, Role, or DistrictID filtering is performed.

Database Behavior:

Table accessed:

DistrictMaster

Operation:

SELECT

Query behavior:

SELECT DistrictID and DistrictName and ORDER BY DistrictName.

Request Body:

None.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint has no path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint has no query parameters. |

Success Response (200):

{

"success": true,

"districts": [

{

"DistrictID": 1,

"DistrictName": "Bengaluru Urban"

},

{

"DistrictID": 2,

"DistrictName": "Mysuru"

}

],

"data": []

}

Failure Responses:

500 Internal Server Error:

Returned when an unhandled exception occurs while retrieving district data.

Example:

{

"success": false,

"message": "Error message"

}

401 Unauthorized:

Authentication failure may occur through [JwtSessionFilter], but the exact 401 behavior is implemented by the filter and is not specified in this controller.

403 Forbidden:

Not explicitly returned by this action.

400 Bad Request:

Not explicitly returned by this action.

404 Not Found:

Not explicitly returned by this action.

409 Conflict:

Not explicitly returned by this action.

Status Codes Used / Applicable:

- 200 OK

- 401 Unauthorized (filter-level behavior; exact implementation not shown)

- 500 Internal Server Error

=========================================================

[2]. GET STUDENTS BY DISTRICT

=============================

Endpoint:

GET /api/semi-professional-volunteer-assignment/students?districtId={districtId}

Purpose:

Returns approved Semi-Professional students belonging to the requested district.

The endpoint combines records from:

1. NewSemiProfessionalApplication

2. GoogleSheet\_SemiProfessional

It also determines:

- Whether a volunteer is assigned.

- The assigned volunteer's name and district.

- Whether a house visit has been completed for New Student records.

- CET and Practical Test rank information.

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Explicit role-sensitive business logic exists for Role = "Volunteer".

Required Role:

No single role is explicitly required.

Role-Based Rule:

If Session["UserRole"] equals "Volunteer" (case-insensitive), the supplied districtId is ignored/replaced by Session["DistrictID"].

Therefore:

- Volunteer users can only retrieve students for their session district.

- Non-Volunteer users are not restricted by this specific business rule.

- The controller does not explicitly require Admin, Employee, or any other role.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not directly specified.

Required Session Values for Volunteer:

- UserRole

- DistrictID

How claims are used:

The controller does not directly read JWT claims. It reads Session values expected to have been populated by the authentication infrastructure.

Session Dependency:

Yes, conditionally.

If UserRole = "Volunteer":

- Session["DistrictID"] must exist.

- DistrictID must parse to an integer greater than 0.

- The request districtId is replaced by the Session DistrictID.

If the Volunteer session DistrictID is unavailable:

HTTP 403 Forbidden is returned.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | districtId is a query parameter, not a path parameter. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District ID used to filter students. Must be greater than 0. For Volunteer users, this value is overridden with Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

- districtId is required.

- districtId must be greater than 0.

- If districtId <= 0, HTTP 400 is returned.

- For a Volunteer:

- Session DistrictID must exist.

- Session DistrictID must be greater than 0.

- Otherwise HTTP 403 is returned.

- For a Volunteer, the supplied districtId cannot be used to access another district because it is overwritten by the session district.

- No explicit validation is performed to verify that the requested district exists before executing the query.

- No pagination is implemented.

- No search parameter is implemented.

- No sorting parameter is exposed.

- No date filtering is implemented.

Business Logic Notes:

NEW STUDENT SOURCE:

Source value:

"New Student"

Records come from:

NewSemiProfessionalApplication

Filter:

s.ApproveStatus = 'Approved'

District filter:

s.DistrictID = @DistrictID

ApplicationID is exposed as StudentID.

Volunteer assignment:

SemiProfessional\_StudentVolunteerAssignment.StudentID is joined against s.ApplicationID.

Volunteer:

Users.Id is joined against sva.VolunteerID.

Volunteer district:

Users.DistrictID is joined against DistrictMaster.DistrictID.

Volunteer display:

u.Name + " (" + DistrictName + ")"

IsAssigned:

1 when a matching assignment exists; otherwise 0.

House visit:

A student is considered to have completed a house visit when a matching record exists in HouseVisitForm\_SemiProfessional with:

- SemiProfessional\_StudentID = ApplicationID

- Status = 1

GOOGLE SHEET SOURCE:

Source value:

"Google Sheet"

Records come from:

GoogleSheet\_SemiProfessional

Filter:

gp.Approve = 'Approved'

District filter:

GoogleSheet\_SemiProfessional.District is trimmed and matched against DistrictMaster.DistrictName, then DistrictMaster.DistrictID is compared with @DistrictID.

ImportID is exposed as StudentID.

Volunteer assignment:

SemiProfessional\_StudentVolunteerAssignment.ImportID is joined against gp.ImportID.

IsAssigned:

1 when a matching ImportID assignment exists; otherwise 0.

House visit:

Always returned as 0 for Google Sheet records.

Income conversion:

FamilyIncomeMonthly is converted to decimal after:

- Removing commas.

- Removing "/-".

12th percentage conversion:

SecuredPercentage12th is converted to decimal after removing "%".

Rank:

CETRank and PracticalTestRank are combined into CET\_NEET\_Rank.

Examples:

- CET rank only: "CET: 100"

- PT rank only: "PT: 20"

- Both: "CET: 100 | PT: 20"

- Neither: ""

No pagination:

The endpoint returns all matching records.

Database Behavior:

Tables accessed:

- NewSemiProfessionalApplication

- DistrictMaster

- SemiProfessional\_StudentVolunteerAssignment

- Users

- HouseVisitForm\_SemiProfessional

- GoogleSheet\_SemiProfessional

Operations:

SELECT only.

No INSERT, UPDATE, or DELETE occurs in this endpoint.

Response DTO:

SemiProfessionalStudentDto

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"StudentID": 123,

"Source": "New Student",

"StudentName": "John Doe",

"ContactNumber": "9876543210",

"DistrictName": "Bengaluru Urban",

"AnnualIncome": 180000.00,

"PUPercentage": 82.50,

"IsAssigned": 1,

"IsHouseVisitCompleted": 1,

"CET\_NEET\_Rank": "CET: 1250 | PT: 45",

"VolunteerName": "Volunteer Name (Bengaluru Urban)",

"Remark": "Eligible"

},

{

"StudentID": 456,

"Source": "Google Sheet",

"StudentName": "Jane Doe",

"ContactNumber": "9988776655",

"DistrictName": "Bengaluru Urban",

"AnnualIncome": 150000.00,

"PUPercentage": 78.00,

"IsAssigned": 0,

"IsHouseVisitCompleted": 0,

"CET\_NEET\_Rank": "CET: 2400",

"VolunteerName": null,

"Remark": "Pending"

}

]

}

Failure Responses:

400 Bad Request:

Occurs when:

- districtId <= 0.

Example:

{

"success": false,

"message": "Invalid District ID."

}

403 Forbidden:

Occurs when the authenticated user has UserRole = "Volunteer" but Session["DistrictID"] is missing, invalid, or <= 0.

Example:

{

"success": false,

"message": "Volunteer district information is not available."

}

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails. Exact filter behavior is not specified in controller.

404 Not Found:

Not explicitly returned when no students exist. An empty data array with count 0 is expected.

409 Conflict:

Not explicitly returned.

500 Internal Server Error:

Returned when an unexpected exception occurs.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 200 OK

- 400 Bad Request

- 401 Unauthorized (filter-level behavior)

- 403 Forbidden

- 500 Internal Server Error

=========================================================

[3]. GET DISTRICTS

==================

Endpoint:

GET /api/semi-professional-volunteer-assignment/districts

Purpose:

Returns the complete district list from DistrictMaster.

This is a dropdown/reference-data endpoint.

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly specified.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not specified in controller.

Required Roles:

None explicitly specified.

How claims are used:

No JWT claims or Session values are read by this endpoint.

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

Validation Rules:

- No input validation is required.

- All DistrictMaster rows are returned.

- Districts are sorted by DistrictName.

- No active/inactive filter is implemented.

- No default "-- Select --" record is added by the controller.

- No UserID, EmployeeID, or Role filtering is implemented.

Dropdown Behavior:

- Source table: DistrictMaster

- Fields returned: DistrictID, DistrictName

- Sorting: DistrictName ascending

- Active/inactive filtering: Not implemented.

- User-specific filtering: Not implemented.

- Default "-- Select --" option: Not added by API.

Database Behavior:

Table:

DistrictMaster

Operation:

SELECT

Query:

SELECT DistrictID, DistrictName

FROM DistrictMaster

ORDER BY DistrictName

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"DistrictID": 1,

"DistrictName": "Bengaluru Urban"

},

{

"DistrictID": 2,

"DistrictName": "Mysuru"

}

]

}

Failure Responses:

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails. Exact behavior is not specified in controller.

400 Bad Request:

Not explicitly returned.

403 Forbidden:

Not explicitly returned.

404 Not Found:

Not returned when there are no districts. The expected response is an empty data array with count 0.

409 Conflict:

Not explicitly returned.

500 Internal Server Error:

Returned when an unexpected exception occurs while loading districts.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 200 OK

- 401 Unauthorized (filter-level behavior)

- 500 Internal Server Error

=========================================================

[4]. GET VOLUNTEERS BY DISTRICT

================================

Endpoint:

GET /api/semi-professional-volunteer-assignment/volunteers?districtId={districtId}

Purpose:

Returns Volunteer users belonging to the requested district.

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly required.

- Explicit Volunteer-specific district restriction exists.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not directly specified.

Required Session Values for Volunteer:

- UserRole

- DistrictID

How claims are used:

The controller reads Session["UserRole"] and Session["DistrictID"].

If UserRole = "Volunteer":

- Session["DistrictID"] must be present and > 0.

- The requested districtId is replaced with Session["DistrictID"].

Required Roles:

No explicit required role.

Session Dependency:

Conditional for Volunteer users.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | districtId is a query parameter. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District ID used to identify the district whose Volunteers are returned. Must be greater than 0. For Volunteer users, it is overridden with Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

- districtId must be greater than 0.

- If districtId <= 0, HTTP 400 is returned.

- If UserRole = Volunteer:

- Session DistrictID must exist.

- Session DistrictID must be greater than 0.

- Otherwise HTTP 403 is returned.

- Volunteer users cannot select another district through the query parameter.

- No explicit district existence validation is performed.

- No pagination is implemented.

- No search/filter parameters other than districtId are implemented.

Business Logic Notes:

The query selects:

- Users.Id

- Users.Name

- Users.Taluk

Filters:

- Users.Role = 'Volunteer'

- Users.District matches the DistrictName corresponding to @DistrictId.

The district lookup is:

SELECT DistrictName

FROM DistrictMaster

WHERE DistrictID = @DistrictId

Important database detail:

The Users table is filtered using its District string field, not Users.DistrictID.

The controller does not directly filter Users.DistrictID.

Dropdown Behavior:

- This endpoint provides Volunteer reference data suitable for assignment dropdowns.

- Returned DTO is VolunteerDto.

- No "-- Select --" option is added.

- No active/inactive filtering is performed.

- No UserID/EmployeeID filtering is performed.

- Volunteers are ordered by Users.Id ascending.

- DisplayName is computed in the DTO as:

Name + " (" + Taluk + ")"

when Taluk is non-empty.

- DisplayName is not explicitly selected from SQL; it is a computed DTO property.

Database Behavior:

Tables:

- Users

- DistrictMaster

Operation:

SELECT

No INSERT, UPDATE, or DELETE is performed.

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"Id": 15,

"Name": "Volunteer One",

"Taluk": "Bengaluru",

"DisplayName": "Volunteer One (Bengaluru)"

},

{

"Id": 20,

"Name": "Volunteer Two",

"Taluk": "Anekal",

"DisplayName": "Volunteer Two (Anekal)"

}

]

}

Failure Responses:

400 Bad Request:

Occurs when districtId <= 0.

Example:

{

"success": false,

"message": "Invalid District ID."

}

403 Forbidden:

Occurs when UserRole = Volunteer but Session["DistrictID"] is unavailable or invalid.

Example:

{

"success": false,

"message": "Volunteer district information is not available."

}

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails. Exact behavior is not specified in controller.

404 Not Found:

Not explicitly returned if no Volunteers exist. Expected behavior is a successful response with count 0 and an empty data array.

409 Conflict:

Not explicitly returned.

500 Internal Server Error:

Returned for unexpected exceptions.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 200 OK

- 400 Bad Request

- 401 Unauthorized (filter-level behavior)

- 403 Forbidden

- 500 Internal Server Error

=========================================================

[5]. ASSIGN VOLUNTEER

=====================

Endpoint:

POST /api/semi-professional-volunteer-assignment/assign

Purpose:

Creates a volunteer assignment for a Semi-Professional student.

The assignment storage column depends on Source:

- "New Student" -> StudentID

- "Google Sheet" -> ImportID

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly specified.

- No explicit role check is performed inside this action.

- No UserID is recorded by this action.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not specified in controller.

Required Roles:

None explicitly specified.

How claims are used:

The action itself does not read JWT claims or Session values.

Session Dependency:

None directly in this action.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | All inputs are supplied in the JSON request body. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

Content-Type: application/json

DTO:

AssignVolunteerRequest

Full JSON sample:

{

"StudentId": 123,

"VolunteerId": 15,

"Source": "New Student"

}

Google Sheet example:

{

"StudentId": 456,

"VolunteerId": 20,

"Source": "Google Sheet"

}

Request Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| StudentId | int | Yes | No | Student identifier. For "New Student", this is stored in StudentID. For "Google Sheet", this is stored in ImportID. Must be > 0. |

| VolunteerId | int | Yes | No | Users.Id of the Volunteer to assign. Must be > 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitively. |

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- VolunteerId must be greater than 0.

- Source must not be null or whitespace.

- Source must equal:

- "New Student"

OR

- "Google Sheet"

- Source comparison is case-insensitive.

- No maximum length is explicitly enforced by the controller.

- No explicit verification that StudentId exists is performed before INSERT.

- No explicit verification that VolunteerId belongs to a Volunteer is performed before INSERT.

- No explicit district compatibility check between student and Volunteer is performed.

- No explicit duplicate check is performed in controller.

- Database constraints/exceptions may therefore determine whether duplicate or invalid assignments are accepted.

Business Logic Notes:

If Source = "New Student":

INSERT INTO SemiProfessional\_StudentVolunteerAssignment

(

StudentID,

VolunteerID

)

If Source = "Google Sheet":

INSERT INTO SemiProfessional\_StudentVolunteerAssignment

(

ImportID,

VolunteerID

)

The controller does not set:

- CreatedBy

- ModifiedBy

- CreatedDate

- ModifiedDate

- Status

- UserID

Any defaults or database-side values for these fields are not visible in the controller.

Transaction:

No explicit transaction is created.

Success Response (201):

{

"success": true,

"message": "Volunteer assigned successfully."

}

Failure Responses:

400 Bad Request:

Occurs when:

- Request body is null.

- StudentId <= 0.

- VolunteerId <= 0.

- Source is missing/invalid.

Examples:

{

"success": false,

"message": "Request body is required."

}

{

"success": false,

"message": "Invalid Student ID."

}

{

"success": false,

"message": "Invalid Volunteer ID."

}

{

"success": false,

"message": "Source must be either 'New Student' or 'Google Sheet'."

}

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails.

409 Conflict:

Any SqlException is converted to HTTP 409 Conflict.

Example:

{

"success": false,

"message": "SQL/database error message"

}

Important:

The controller does not distinguish duplicate-key errors from other SQL errors. Every SqlException is returned as 409.

404 Not Found:

Not explicitly returned.

403 Forbidden:

Not explicitly returned by the action.

500 Internal Server Error:

Returned for non-SQL exceptions.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 201 Created

- 400 Bad Request

- 401 Unauthorized (filter-level behavior)

- 409 Conflict

- 500 Internal Server Error

=========================================================

[6]. REASSIGN VOLUNTEER

=======================

Endpoint:

POST /api/semi-professional-volunteer-assignment/reassign

Purpose:

Updates an existing volunteer assignment to a different Volunteer.

The assignment lookup column depends on Source:

- "New Student" -> StudentID

- "Google Sheet" -> ImportID

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly specified.

- No explicit role check is performed.

- No UserID is recorded.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not specified in controller.

Required Roles:

None explicitly specified.

How claims are used:

No JWT claims or Session values are directly read.

Session Dependency:

None.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | Inputs are supplied in the JSON request body. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

Content-Type: application/json

{

"StudentId": 123,

"VolunteerId": 20,

"Source": "New Student"

}

Google Sheet example:

{

"StudentId": 456,

"VolunteerId": 25,

"Source": "Google Sheet"

}

Request Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| StudentId | int | Yes | No | Existing assignment identifier. Maps to StudentID for New Student and ImportID for Google Sheet. Must be > 0. |

| VolunteerId | int | Yes | No | New Volunteer Users.Id. Must be > 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitively. |

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- VolunteerId must be greater than 0.

- Source must be "New Student" or "Google Sheet", case-insensitively.

- No explicit validation confirms that VolunteerId belongs to a Volunteer.

- No explicit district validation is performed.

- No explicit student existence check occurs before UPDATE.

- Existing assignment must match the supplied StudentId/ImportID; otherwise rowsAffected = 0 and HTTP 404 is returned.

Business Logic Notes:

If Source = "New Student":

UPDATE SemiProfessional\_StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE StudentID = @StudentID

If Source = "Google Sheet":

UPDATE SemiProfessional\_StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE ImportID = @ImportID

Only VolunteerID is updated.

The controller does not update:

- CreatedBy

- ModifiedBy

- ModifiedDate

- Status

- UserID

No explicit transaction is used.

Success Response (200):

{

"success": true,

"message": "Volunteer reassigned successfully."

}

Failure Responses:

400 Bad Request:

Returned for null request, invalid StudentId, invalid VolunteerId, or invalid Source.

Examples:

{

"success": false,

"message": "Request body is required."

}

{

"success": false,

"message": "Invalid Student ID."

}

{

"success": false,

"message": "Invalid Volunteer ID."

}

{

"success": false,

"message": "Source must be either 'New Student' or 'Google Sheet'."

}

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails.

404 Not Found:

Returned when the UPDATE affects zero rows.

Example:

{

"success": false,

"message": "No existing volunteer assignment found."

}

403 Forbidden:

Not explicitly returned by this action.

409 Conflict:

Not explicitly returned by this action.

500 Internal Server Error:

Returned for unexpected non-validation exceptions.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 200 OK

- 400 Bad Request

- 401 Unauthorized (filter-level behavior)

- 404 Not Found

- 500 Internal Server Error

=========================================================

[7]. CANCEL ASSIGNMENT

======================

Endpoint:

POST /api/semi-professional-volunteer-assignment/cancel

Purpose:

Deletes an existing volunteer assignment.

The assignment lookup column depends on Source:

- "New Student" -> StudentID

- "Google Sheet" -> ImportID

This is a HARD DELETE from:

SemiProfessional\_StudentVolunteerAssignment

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Existing Filter: [JwtSessionFilter]

- Filter Scope: Action-level

- Required Role: None explicitly specified.

- No explicit role check is performed.

JWT / Authorization Details:

JWT Required: Yes

Filter/Authorization Scope:

Action-level [JwtSessionFilter].

Required Claims:

Not specified in controller.

Required Roles:

None explicitly specified.

How claims are used:

No JWT claims or Session values are directly read.

Session Dependency:

None.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | Inputs are supplied in the JSON request body. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters. |

Request Body:

Content-Type: application/json

{

"StudentId": 123,

"Source": "New Student"

}

Google Sheet example:

{

"StudentId": 456,

"Source": "Google Sheet"

}

Request Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| StudentId | int | Yes | No | Assignment identifier. Maps to StudentID for New Student and ImportID for Google Sheet. Must be > 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitively. |

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- Source must be valid.

- Source comparison is case-insensitive.

- No confirmation flag is required.

- No explicit student existence validation is performed.

- No explicit authorization based on assignment ownership is performed.

- No soft-delete behavior is implemented.

- Existing assignment must be found; otherwise rowsAffected = 0 and HTTP 404 is returned.

Business Logic Notes:

If Source = "New Student":

DELETE FROM SemiProfessional\_StudentVolunteerAssignment

WHERE StudentID = @StudentID

If Source = "Google Sheet":

DELETE FROM SemiProfessional\_StudentVolunteerAssignment

WHERE ImportID = @ImportID

This is a hard DELETE.

The controller does not:

- Set a deleted status.

- Set audit fields.

- Check UserID ownership.

- Check Volunteer ownership.

- Check Role before deleting.

- Use a transaction.

Success Response (200):

{

"success": true,

"message": "Assignment cancelled successfully."

}

Failure Responses:

400 Bad Request:

Returned for:

- Null request.

- StudentId <= 0.

- Invalid/missing Source.

Examples:

{

"success": false,

"message": "Request body is required."

}

{

"success": false,

"message": "Invalid Student ID."

}

{

"success": false,

"message": "Source must be either 'New Student' or 'Google Sheet'."

}

401 Unauthorized:

May be returned by [JwtSessionFilter] if authentication fails.

404 Not Found:

Returned when no assignment is deleted.

Example:

{

"success": false,

"message": "No volunteer assignment found."

}

403 Forbidden:

Not explicitly returned.

409 Conflict:

Not explicitly returned.

500 Internal Server Error:

Returned for unexpected exceptions.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

- 200 OK

- 400 Bad Request

- 401 Unauthorized (filter-level behavior)

- 404 Not Found

- 500 Internal Server Error

=========================================================

COMMON DTOs

===========

DTO 1: DistrictDto

------------------

Purpose:

Represents a district returned by the district/reference-data endpoints.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| DistrictID | int | Yes | No | District identifier returned from DistrictMaster.DistrictID. |

| DistrictName | string | No | Yes | District name returned from DistrictMaster.DistrictName. The controller maps DBNull to null. |

Sample Object:

{

"DistrictID": 1,

"DistrictName": "Bengaluru Urban"

}

Database Source:

DistrictMaster

Fields:

- DistrictID

- DistrictName

=========================================================

DTO 2: VolunteerDto

===================

Purpose:

Represents a Volunteer returned by the Volunteers-by-District endpoint.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Id | int | Yes | No | Users.Id of the Volunteer. |

| Name | string | No | Yes | Volunteer name from Users.Name. |

| Taluk | string | No | Yes | Taluk from Users.Taluk. |

| DisplayName | string | Computed | Depends on Name/Taluk | Computed property. If Taluk is blank, returns Name; otherwise returns Name + " (" + Taluk + ")". |

Sample Object:

{

"Id": 15,

"Name": "Volunteer One",

"Taluk": "Bengaluru",

"DisplayName": "Volunteer One (Bengaluru)"

}

DisplayName Logic:

If Taluk is null/empty/whitespace:

DisplayName = Name

Otherwise:

DisplayName = Name + " (" + Taluk + ")"

=========================================================

DTO 3: SemiProfessionalStudentDto

=================================

Purpose:

Represents a Semi-Professional student returned by the Students-by-District endpoint.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | ApplicationID for New Student records or ImportID for Google Sheet records. |

| Source | string | No | Yes | Source of the record: "New Student" or "Google Sheet". |

| StudentName | string | No | Yes | Student name. |

| ContactNumber | string | No | Yes | Student contact number. |

| DistrictName | string | No | Yes | District name. |

| AnnualIncome | decimal? | No | Yes | Family income value converted to decimal where available. |

| PUPercentage | decimal? | No | Yes | PU/12th percentage converted to decimal where available. |

| IsAssigned | int | Yes | No | 1 if a volunteer assignment exists; otherwise 0. |

| IsHouseVisitCompleted | int | Yes | No | 1 if house visit status = 1 for New Student; Google Sheet records always return 0. |

| CET\_NEET\_Rank | string | Yes | No | Combined rank string generated from CETRank and PTRank. May be an empty string. |

| VolunteerName | string | No | Yes | Assigned volunteer name plus volunteer district, or null if unassigned. |

| Remark | string | No | Yes | Remark from the underlying student record. |

Sample Object:

{

"StudentID": 123,

"Source": "New Student",

"StudentName": "John Doe",

"ContactNumber": "9876543210",

"DistrictName": "Bengaluru Urban",

"AnnualIncome": 180000.00,

"PUPercentage": 82.50,

"IsAssigned": 1,

"IsHouseVisitCompleted": 1,

"CET\_NEET\_Rank": "CET: 1250 | PT: 45",

"VolunteerName": "Volunteer One (Bengaluru Urban)",

"Remark": "Eligible"

}

=========================================================

DTO 4: AssignVolunteerRequest

=============================

Purpose:

Request payload used by:

- AssignVolunteer

- ReassignVolunteer

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | Student/application/import identifier. Must be > 0. |

| VolunteerId | int | Yes | No | Volunteer Users.Id. Must be > 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitively. |

Sample Request:

{

"StudentId": 123,

"VolunteerId": 15,

"Source": "New Student"

}

Alternative:

{

"StudentId": 456,

"VolunteerId": 20,

"Source": "Google Sheet"

}

=========================================================

DTO 5: CancelAssignmentRequest

==============================

Purpose:

Request payload used by CancelAssignment.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | Student/application/import identifier. Must be > 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitively. |

Sample Request:

{

"StudentId": 123,

"Source": "New Student"

}

=========================================================

COMMON RESPONSE STRUCTURES

==========================

Initial Data Response:

{

"success": true,

"districts": [

{

"DistrictID": 1,

"DistrictName": "Bengaluru Urban"

}

],

"data": []

}

District List Response:

{

"success": true,

"count": 1,

"data": [

{

"DistrictID": 1,

"DistrictName": "Bengaluru Urban"

}

]

}

Student List Response:

{

"success": true,

"count": 1,

"data": [

{

"StudentID": 123,

"Source": "New Student",

"StudentName": "John Doe",

"ContactNumber": "9876543210",

"DistrictName": "Bengaluru Urban",

"AnnualIncome": 180000.00,

"PUPercentage": 82.50,

"IsAssigned": 1,

"IsHouseVisitCompleted": 1,

"CET\_NEET\_Rank": "CET: 1250 | PT: 45",

"VolunteerName": "Volunteer One (Bengaluru Urban)",

"Remark": "Eligible"

}

]

}

Volunteer List Response:

{

"success": true,

"count": 1,

"data": [

{

"Id": 15,

"Name": "Volunteer One",

"Taluk": "Bengaluru",

"DisplayName": "Volunteer One (Bengaluru)"

}

]

}

Assignment Success Response:

{

"success": true,

"message": "Volunteer assigned successfully."

}

Reassignment Success Response:

{

"success": true,

"message": "Volunteer reassigned successfully."

}

Cancellation Success Response:

{

"success": true,

"message": "Assignment cancelled successfully."

}

Common Error Response:

{

"success": false,

"message": "Error message"

}

=========================================================

DATABASE TABLES AND OPERATIONS SUMMARY

=======================================

1. DistrictMaster

Used by:

- initial-data

- districts

- students

- volunteers

Operations:

SELECT only.

Relevant fields:

- DistrictID

- DistrictName

2. NewSemiProfessionalApplication

Used by:

- students

Operation:

SELECT.

Important filters:

- ApproveStatus = 'Approved'

- DistrictID = requested/effective DistrictID

Relevant fields:

- ApplicationID

- StudentName

- ContactNumber

- DistrictID

- FamilyIncome

- PUPercentage

- CETRank

- PTRank

- Remark

- ApproveStatus

3. GoogleSheet\_SemiProfessional

Used by:

- students

Operation:

SELECT.

Important filters:

- Approve = 'Approved'

- District name matched to DistrictMaster

- DistrictMaster.DistrictID = requested/effective DistrictID

Relevant fields:

- ImportID

- StudentName

- ContactNumber

- District

- FamilyIncomeMonthly

- SecuredPercentage12th

- CETRank

- PracticalTestRank

- Remarks

- Approve

4. SemiProfessional\_StudentVolunteerAssignment

Used by:

- students

- assign

- reassign

- cancel

Operations:

- SELECT

- INSERT

- UPDATE

- DELETE

Relevant fields:

- StudentID

- ImportID

- VolunteerID

Assignment mapping:

- New Student -> StudentID

- Google Sheet -> ImportID

5. Users

Used by:

- students

- volunteers

Operations:

SELECT only.

Relevant fields:

- Id

- Name

- Taluk

- Role

- District

- DistrictID

6. HouseVisitForm\_SemiProfessional

Used by:

- students

Operation:

SELECT through EXISTS.

House visit completion condition:

SemiProfessional\_StudentID = NewSemiProfessionalApplication.ApplicationID

AND Status = 1

=========================================================

GLOBAL VALIDATION AND BUSINESS RULE SUMMARY

=============================================

Authentication:

- Every action has [JwtSessionFilter].

- JWT is therefore currently required at action level for all seven endpoints.

- No controller-level [JwtSessionFilter] exists.

- The controller does not itself define the JWT token validation implementation.

Role Handling:

- No action explicitly requires a specific role through an authorization attribute.

- UserRole is read only in:

- students

- volunteers

- The special role value recognized is:

"Volunteer"

Volunteer District Restriction:

For:

- GET /students

- GET /volunteers

If:

Session["UserRole"] = "Volunteer"

Then:

- Session["DistrictID"] is required.

- Session DistrictID must be a valid integer > 0.

- The incoming districtId is overridden by Session DistrictID.

Failure:

403 Forbidden.

Other Roles:

No explicit role restriction is implemented by these actions.

District Validation:

- districtId <= 0 -> 400 Bad Request.

- District existence is not explicitly validated in controller.

- A non-existent positive district ID can therefore produce an empty result set.

Source Validation:

Valid values:

- "New Student"

- "Google Sheet"

Comparison:

Case-insensitive.

Invalid/missing Source:

400 Bad Request.

Student ID Validation:

StudentId <= 0:

400 Bad Request.

Volunteer ID Validation:

VolunteerId <= 0:

400 Bad Request.

Assignment Creation:

- INSERT is performed.

- No explicit duplicate check.

- Database exceptions are returned as 409 Conflict.

- No explicit transaction.

- No audit-user field is populated by controller.

Assignment Reassignment:

- UPDATE only changes VolunteerID.

- If no matching assignment exists -> 404 Not Found.

- No explicit Volunteer validation.

- No explicit role validation.

- No explicit transaction.

Assignment Cancellation:

- Performs hard DELETE.

- No soft delete.

- No confirmation field.

- No ownership validation.

- If no matching assignment exists -> 404 Not Found.

- No explicit transaction.

Pagination:

Not implemented by any endpoint.

Search:

Not implemented.

Sorting:

Students:

No explicit ORDER BY in either UNION query.

Districts:

ORDER BY DistrictName.

Volunteers:

ORDER BY Id.

Date Filtering:

Not implemented.

UserID Filtering:

Not implemented.

EmployeeID Filtering:

Not implemented.

CreatedBy / ModifiedBy:

Not populated by controller.

Default Status Values:

No default status is set by controller.

Default Dates:

No date defaults are set by controller.

File Uploads:

No multipart/form-data endpoints exist.

No file fields exist.

No file validation exists.

Soft Delete:

Not implemented for assignment cancellation.

Dropdown Defaults:

No "-- Select --" option is generated by the API.

Active/Inactive Filtering:

No active/inactive filtering is visible in the controller.

Error Exposure:

InternalServerErrorResponse returns:

ex.Message

The actual exception message is therefore exposed to the API consumer for 500 responses.

SQL Exception Handling:

AssignVolunteer catches SqlException separately and returns:

409 Conflict

with:

{

"success": false,

"message": ex.Message

}

Other actions do not have a dedicated SqlException handler and therefore return 500 through the common exception handler.

=========================================================

ENDPOINT INVENTORY

==================

Total Endpoints: 7

1. GET /api/semi-professional-volunteer-assignment/initial-data

Purpose: Initial page data / districts + empty student list

JWT: Required

Role: None explicitly required

2. GET /api/semi-professional-volunteer-assignment/students

Purpose: Get approved students by district

JWT: Required

Role: None explicitly required

Volunteer restriction: Session DistrictID enforced

3. GET /api/semi-professional-volunteer-assignment/districts

Purpose: Get all districts

JWT: Required

Role: None explicitly required

4. GET /api/semi-professional-volunteer-assignment/volunteers

Purpose: Get Volunteers by district

JWT: Required

Role: None explicitly required

Volunteer restriction: Session DistrictID enforced

5. POST /api/semi-professional-volunteer-assignment/assign

Purpose: Create volunteer assignment

JWT: Required

Role: None explicitly required

6. POST /api/semi-professional-volunteer-assignment/reassign

Purpose: Change assigned Volunteer

JWT: Required

Role: None explicitly required

7. POST /api/semi-professional-volunteer-assignment/cancel

Purpose: Hard-delete volunteer assignment

JWT: Required

Role: None explicitly required

=========================================================

FINAL AUTHORIZATION CONCLUSION

==============================

The supplied controller explicitly decorates EVERY action with:

[JwtSessionFilter]

Therefore, the current implementation indicates:

- JWT Required: Yes for all 7 endpoints.

- JWT Scope: Action-level.

- Controller-level JWT filter: Not present.

- Explicit role attribute: Not present.

- Explicit required role: None.

- Special Volunteer business restriction: Present only in students and volunteers.

- Session values used for Volunteer authorization:

- UserRole

- DistrictID

- JWT claim names and JWT-to-Session mapping: Not specified in controller.

No endpoint in the supplied controller can be accurately documented as public without contradicting the existing [JwtSessionFilter] attributes.