=========================================================

ASSIGN VOLUNTEER FOR HOUSE VISIT API CONTRACT

=====================

Controller:

AssignVolunteerForHouseVisitApIController

API BASE ROUTE

==============

Route Prefix:

/api/assign-volunteer-house-visit

Authentication:

JWT authentication is NOT applied at controller level.

JWT is explicitly required on every public action in this controller through the action-level [JwtSessionFilter] attribute.

Therefore:

\* GET /districts → JWT Required

\* GET /students → JWT Required

\* GET /volunteers → JWT Required

\* POST /assign → JWT Required

\* PUT /reassign → JWT Required

\* DELETE /cancel → JWT Required

No public endpoint is implemented in this controller.

The controller uses the EnvisageDb connection string and performs direct SQL operations against the database.

=========================================================

1. GET DISTRICTS

================

Endpoint:

/api/assign-volunteer-house-visit/districts

HTTP Method:

GET

Purpose:

Returns the complete list of districts from the DistrictMaster table for use in the district dropdown.

Content-Type:

No request body.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by this endpoint.

\* Required Roles: Not specified in controller.

\* How claims are used: The action itself does not directly read JWT claims or Session values.

\* Session dependency: No direct Session dependency in this endpoint.

\* Important: Although the action does not use JWT claims itself, the existing [JwtSessionFilter] explicitly protects the endpoint.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters are used. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No query parameters are used. |

Request Body:

None.

Validation Rules:

\* No request parameters are validated.

\* Database access is performed directly against DistrictMaster.

\* No role-specific filtering is implemented.

\* No active/inactive filtering is implemented.

\* No "-- Select --" option is added by the controller.

Business Logic Notes:

\* The endpoint calls GetDistrictList().

\* DistrictMaster is queried using:

SELECT DistrictID, DistrictName FROM DistrictMaster

\* Every returned row is converted to SelectListItemDto.

\* DistrictID is returned as the Value property converted to string.

\* DistrictName is returned as the Text property.

\* The result count is returned in the count property.

\* No UserID, EmployeeID, Role, or DistrictID from Session is used to filter this endpoint.

\* No sorting is explicitly specified in the SQL query.

\* No pagination is implemented.

Database Behavior:

Table accessed:

DistrictMaster

Operation:

SELECT

Fields selected:

\* DistrictID

\* DistrictName

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Bengaluru"

}

]

}

The example values above illustrate the response structure. Actual district values come from the database.

Failure Responses:

401 Unauthorized:

Occurs when the request does not satisfy the [JwtSessionFilter] authentication requirements.

Example:

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Not explicitly returned by this action.

400 Bad Request:

Not explicitly returned by this action.

404 Not Found:

Not explicitly returned by this action. An empty DistrictMaster table results in a successful response with count = 0.

500 Internal Server Error:

Occurs when an exception is thrown while retrieving the district list or accessing the database.

Example:

{

"success": false,

"message": "Error message"

}

The controller returns ex.Message directly.

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

Authentication-related 401/403 behavior depends on the implementation of [JwtSessionFilter] and is not explicitly returned inside this action.

=========================================================

2. GET STUDENTS BY DISTRICT

============================

Endpoint:

/api/assign-volunteer-house-visit/students?districtId={districtId}

HTTP Method:

GET

Purpose:

Returns approved and active students belonging to the requested district.

The endpoint combines:

\* New Student records from New\_Students

\* Google Sheet student records from GoogleSheet\_PUC

It also returns assignment information, volunteer information, house-visit completion information, and student details.

Content-Type:

No request body.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly accessed by the action.

\* Required Roles: No explicit role restriction is implemented.

\* Session values used:

UserRole

DistrictID

How authorization/business filtering works:

The action reads UserRole from Session.

If the authenticated user's Session UserRole is "Volunteer", the supplied districtId is ignored and replaced with DistrictID from Session.

Therefore a Volunteer cannot request students from another district through the districtId query parameter.

If the Volunteer does not have a valid DistrictID in Session, the endpoint returns 403 Forbidden.

Session dependency:

\* Session["UserRole"] is read.

\* Session["DistrictID"] is read for Volunteer users.

\* The controller comments indicate these values are expected to be populated through the JWT/session authentication mechanism.

Required Claims:

The controller does not directly read JWT claims. It reads Session values.

Therefore the exact JWT claim names that populate Session["UserRole"] and Session["DistrictID"] are not specified in this controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters are used. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District ID used to retrieve students. Must be greater than 0. For Volunteer users, this value is overridden by Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

\* districtId must be greater than 0.

\* If districtId <= 0, the endpoint returns 400 Bad Request.

\* If UserRole is Volunteer:

\* Session["DistrictID"] must exist.

\* Session["DistrictID"] must be convertible to an integer.

\* Session["DistrictID"] must be greater than 0.

\* If Volunteer district information is unavailable, the endpoint returns 403 Forbidden.

\* No validation is performed on individual database student fields.

\* FamilyIncome is converted to decimal when a database value is not NULL.

\* SecuredPercentage is converted to decimal when a database value is not NULL.

Business Logic Notes:

1. The endpoint first validates districtId.

2. The user's UserRole is retrieved from Session.

3. If UserRole equals "Volunteer" case-insensitively:

\* The requested districtId is ignored.

\* Session["DistrictID"] becomes the effective district ID.

4. Students are then loaded for the effective district.

5. The endpoint combines New\_Students and GoogleSheet\_PUC records using UNION ALL.

6. New Student records must satisfy:

\* ApprovalStatus = 'Approved'

\* DistrictID = requested/effective district

\* Status = 1

7. Google Sheet records must satisfy:

\* Approve = 'Approved'

\* District name must match DistrictMaster.

\* The matched DistrictID must equal the requested/effective district.

8. Assignment status is determined from StudentVolunteerAssignment.

9. VolunteerName is obtained by joining Users and DistrictMaster.

10. For New Student records, IsHouseVisitCompleted is determined from HouseVisitForm\_PUC.

11. For Google Sheet records, IsHouseVisitCompleted is always 0.

12. No pagination is implemented.

13. No search parameter is implemented.

14. No sorting parameter is implemented.

15. No date filtering is implemented.

Database Behavior:

Tables accessed:

\* New\_Students

\* DistrictMaster

\* StudentVolunteerAssignment

\* Users

\* HouseVisitForm\_PUC

\* GoogleSheet\_PUC

Operations:

SELECT only.

New Student joins:

\* New\_Students → DistrictMaster using DistrictID

\* New\_Students → StudentVolunteerAssignment using StudentID

\* StudentVolunteerAssignment → Users using VolunteerID

\* Users → DistrictMaster using volunteer DistrictID

\* HouseVisitForm\_PUC checked using PUC\_StudentID

Google Sheet joins:

\* GoogleSheet\_PUC → DistrictMaster by trimmed district name

\* GoogleSheet\_PUC → StudentVolunteerAssignment using ImportID

\* StudentVolunteerAssignment → Users using VolunteerID

\* Users → DistrictMaster using volunteer DistrictID

New Student filtering:

ApprovalStatus = 'Approved'

AND DistrictID = @DistrictID

AND Status = 1

Google Sheet filtering:

Approve = 'Approved'

AND matching DistrictMaster.DistrictID = @DistrictID

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"StudentID": 101,

"Source": "New Student",

"StudentName": "John Doe",

"ContactNumber": "9876543210",

"Taluka": "Dharwad",

"DistrictName": "Dharwad",

"CollegeName": "ABC College",

"FamilyIncome": 120000.00,

"SecuredPercentage": 85.50,

"Remark": "Eligible",

"VolunteerName": "Volunteer Name (Dharwad)",

"IsAssigned": 1,

"IsHouseVisitCompleted": 1

},

{

"StudentID": 205,

"Source": "Google Sheet",

"StudentName": "Jane Doe",

"ContactNumber": "9876543211",

"Taluka": "Hubballi",

"DistrictName": "Dharwad",

"CollegeName": "XYZ College",

"FamilyIncome": 150000.00,

"SecuredPercentage": 82.00,

"Remark": "Approved",

"VolunteerName": null,

"IsAssigned": 0,

"IsHouseVisitCompleted": 0

}

]

}

Nullable/Optional Response Fields:

\* Source may be null.

\* StudentName may be null.

\* ContactNumber may be null.

\* Taluka may be null.

\* DistrictName may be null.

\* CollegeName may be null.

\* FamilyIncome may be null when the database value is NULL.

\* SecuredPercentage may be null when the database value is NULL.

\* VolunteerName may be null.

\* Remark may be null.

Failure Responses:

400 Bad Request:

Occurs when districtId <= 0.

{

"success": false,

"message": "Invalid District ID."

}

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects an unauthenticated/invalid request.

403 Forbidden:

Occurs when UserRole is Volunteer but Session["DistrictID"] is missing, invalid, or <= 0.

{

"success": false,

"message": "Volunteer district information is not available."

}

404 Not Found:

Not explicitly returned. If no students are found, the endpoint returns 200 with an empty data array.

Example:

{

"success": true,

"count": 0,

"data": []

}

500 Internal Server Error:

Occurs when an exception is thrown during database access or processing.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 403 Forbidden

\* 500 Internal Server Error

401 may be produced by the existing JwtSessionFilter, but it is not explicitly returned in the action.

=========================================================

3. GET VOLUNTEERS BY DISTRICT

==============================

Endpoint:

/api/assign-volunteer-house-visit/volunteers?districtId={districtId}

HTTP Method:

GET

Purpose:

Returns all users having Role = "Volunteer" for the specified district.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by this action.

\* Required Roles: No explicit role restriction is implemented.

\* Session values used:

UserRole

DistrictID

Volunteer-specific restriction:

If the authenticated user's UserRole is "Volunteer", the requested districtId is replaced with Session["DistrictID"].

Therefore Volunteers can only retrieve Volunteers belonging to their own Session district.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters are used. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District ID from which Volunteers should be retrieved. Must be greater than 0. For Volunteer users, the value is overridden by Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

\* districtId must be greater than 0.

\* If districtId <= 0:

400 Bad Request.

\* For Volunteer users:

\* Session["DistrictID"] must exist.

\* Session["DistrictID"] must be a valid integer.

\* Session["DistrictID"] must be greater than 0.

\* Missing/invalid Volunteer district information results in 403 Forbidden.

Business Logic Notes:

\* Reads UserRole from Session.

\* If UserRole is Volunteer, uses Session["DistrictID"] instead of the supplied districtId.

\* Calls GetVolunteersByDistrictInternal().

\* Retrieves only Users where Role = 'Volunteer'.

\* The user's District value is matched against DistrictMaster.DistrictName for the requested DistrictID.

\* No pagination is implemented.

\* No search or sorting parameters exist.

\* No explicit active/inactive filtering is implemented.

Database Behavior:

Tables accessed:

\* Users

\* DistrictMaster

Operation:

SELECT

SQL logic:

Users.Role = 'Volunteer'

and:

Users.District =

(

SELECT DistrictName

FROM DistrictMaster

WHERE DistrictID = @DistrictId

)

Returned database fields:

\* Users.Id

\* Users.Name

\* Users.Taluk

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"Value": "101",

"Text": "Ramesh (Dharwad)"

},

{

"Value": "102",

"Text": "Suresh (Dharwad)"

}

]

}

Dropdown Response Structure:

Each item is:

{

"Value": "Volunteer User ID",

"Text": "Volunteer Name (Taluk)"

}

There is no "-- Select --" item generated by the controller.

There is no explicit active/inactive filtering.

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid District ID."

}

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request.

403 Forbidden:

{

"success": false,

"message": "Volunteer district information is not available."

}

404 Not Found:

Not explicitly returned. No Volunteers produces:

{

"success": true,

"count": 0,

"data": []

}

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 403 Forbidden

\* 500 Internal Server Error

401 may be produced by [JwtSessionFilter].

=========================================================

4. ASSIGN VOLUNTEER

===================

Endpoint:

/api/assign-volunteer-house-visit/assign

HTTP Method:

POST

Purpose:

Creates a StudentVolunteerAssignment record linking a student/import record to a Volunteer.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by this action.

\* Required Roles: Not specified in controller.

\* Session values used: None directly in this action.

\* The controller does not perform an explicit role check before inserting the assignment.

Content-Type:

application/json

Request Body DTO:

AssignVolunteerRequest

Request Body:

{

"StudentID": 101,

"VolunteerID": 205,

"Source": "New Student"

}

For Google Sheet:

{

"StudentID": 5001,

"VolunteerID": 205,

"Source": "Google Sheet"

}

Important:

Although the request property is named StudentID, when Source = "Google Sheet", the value is actually used as ImportID.

Validation Rules:

\* Request body must not be null.

\* StudentID must be greater than 0.

\* VolunteerID must be greater than 0.

\* Source is required and cannot be null, empty, or whitespace.

\* Source must be one of:

\* New Student

\* Google Sheet

\* Source comparison for validation is case-insensitive.

\* Database insert is conditional on the Source value.

Request Body Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Must be greater than 0. For New Student, inserted into StudentVolunteerAssignment.StudentID. For Google Sheet, the same request value is inserted into StudentVolunteerAssignment.ImportID. |

| VolunteerID | int | Yes | No | Volunteer user ID. Must be greater than 0. |

| Source | string | Yes | No | Identifies the source record. Allowed values: "New Student" or "Google Sheet". |

Business Logic Notes:

If Source = "New Student":

INSERT INTO StudentVolunteerAssignment

(

StudentID,

VolunteerID

)

Values:

StudentID = request.StudentID

VolunteerID = request.VolunteerID

If Source = "Google Sheet":

INSERT INTO StudentVolunteerAssignment

(

ImportID,

VolunteerID

)

Values:

ImportID = request.StudentID

VolunteerID = request.VolunteerID

Important:

The controller does not check for an existing assignment before inserting.

Any duplicate/foreign-key/database constraint failure is handled as a SQL exception and returned as 500 Internal Server Error.

The controller does not explicitly validate that:

\* StudentID exists.

\* ImportID exists.

\* VolunteerID exists.

\* Volunteer belongs to the same district.

\* Student belongs to the Volunteer district.

\* User has a specific role.

Those validations are not visible in this controller.

Database Behavior:

Table:

StudentVolunteerAssignment

Operation:

INSERT

No explicit transaction is implemented in the controller.

Success Response (201):

{

"success": true,

"message": "Volunteer assigned successfully."

}

Failure Responses:

400 Bad Request:

If request body is missing:

{

"success": false,

"message": "Request body is required."

}

If StudentID <= 0:

{

"success": false,

"message": "Invalid Student ID."

}

If VolunteerID <= 0:

{

"success": false,

"message": "Invalid Volunteer ID."

}

If Source is missing:

{

"success": false,

"message": "Source is required."

}

If Source is invalid:

{

"success": false,

"message": "Invalid source. Allowed values are 'New Student' and 'Google Sheet'."

}

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request.

403 Forbidden:

Not explicitly returned by this action.

404 Not Found:

Not explicitly returned.

409 Conflict:

{

"success": false,

"message": "Volunteer assignment was not created."

}

This is returned only when ExecuteNonQuery() returns 0 or fewer rows.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Returned for SqlException or general Exception.

The exact SQL exception message is exposed through ex.Message.

Status Codes Used:

\* 201 Created

\* 400 Bad Request

\* 409 Conflict

\* 500 Internal Server Error

401 may be produced by [JwtSessionFilter].

=========================================================

5. REASSIGN VOLUNTEER

=====================

Endpoint:

/api/assign-volunteer-house-visit/reassign

HTTP Method:

PUT

Purpose:

Updates an existing StudentVolunteerAssignment record so that the student/import record is assigned to a different Volunteer.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: Not specified in controller.

\* Session values used: None directly in this action.

\* No explicit role validation is performed by the controller.

Content-Type:

application/json

Request Body DTO:

AssignVolunteerRequest

Request Body Example:

{

"StudentID": 101,

"VolunteerID": 208,

"Source": "New Student"

}

Google Sheet example:

{

"StudentID": 5001,

"VolunteerID": 208,

"Source": "Google Sheet"

}

Request Body Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Must be greater than 0. Used as StudentID for New Student and ImportID for Google Sheet. |

| VolunteerID | int | Yes | No | New Volunteer ID. Must be greater than 0. |

| Source | string | Yes | No | Allowed values: "New Student" or "Google Sheet". |

Validation Rules:

\* Request body is required.

\* StudentID must be greater than 0.

\* VolunteerID must be greater than 0.

\* Source is required.

\* Source must be "New Student" or "Google Sheet".

\* Source validation is case-insensitive.

\* No explicit existence validation for StudentID, ImportID, or VolunteerID is performed.

\* No explicit district validation is performed.

\* No explicit role validation is performed.

Business Logic Notes:

If Source = "New Student":

UPDATE StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE StudentID = @StudentID

If Source = "Google Sheet":

UPDATE StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE ImportID = @ImportID

For Google Sheet:

request.StudentID is used as @ImportID.

The controller does not update any other fields.

The controller does not set:

\* ModifiedBy

\* ModifiedDate

\* UpdatedDate

\* Status

unless those are automatically handled by database triggers, which are not visible in the controller.

No transaction is explicitly implemented.

Database Behavior:

Table:

StudentVolunteerAssignment

Operation:

UPDATE

Success Response (200):

{

"success": true,

"message": "Volunteer reassigned successfully."

}

Failure Responses:

400 Bad Request:

Request body missing:

{

"success": false,

"message": "Request body is required."

}

Invalid StudentID:

{

"success": false,

"message": "Invalid Student ID."

}

Invalid VolunteerID:

{

"success": false,

"message": "Invalid Volunteer ID."

}

Missing Source:

{

"success": false,

"message": "Source is required."

}

Invalid Source:

{

"success": false,

"message": "Invalid source. Allowed values are 'New Student' and 'Google Sheet'."

}

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request.

403 Forbidden:

Not explicitly returned.

404 Not Found:

{

"success": false,

"message": "Volunteer assignment not found."

}

Returned when ExecuteNonQuery() returns 0.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Returned for SqlException or general Exception.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

401 may be produced by [JwtSessionFilter].

=========================================================

6. CANCEL VOLUNTEER ASSIGNMENT

==============================

Endpoint:

/api/assign-volunteer-house-visit/cancel

HTTP Method:

DELETE

Purpose:

Deletes an existing StudentVolunteerAssignment record for a New Student or Google Sheet record.

Authorization:

\* JWT Required

\* Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: Not specified in controller.

\* Session values used: None directly in this action.

\* No explicit role check is implemented.

Content-Type:

No request body.

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| studentId | int | Yes | Record identifier. Must be greater than 0. For New Student it maps to StudentID; for Google Sheet it maps to ImportID. |

| source | string | Yes | Assignment source. Allowed values: "New Student" or "Google Sheet". |

Request URL Example:

/api/assign-volunteer-house-visit/cancel?studentId=101&source=New%20Student

Google Sheet Example:

/api/assign-volunteer-house-visit/cancel?studentId=5001&source=Google%20Sheet

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | No path parameters are used. |

Request Body:

None.

Validation Rules:

\* studentId must be greater than 0.

\* source is required.

\* source must be:

\* New Student

\* Google Sheet

\* Source validation is case-insensitive.

Business Logic Notes:

If source = "New Student":

DELETE FROM StudentVolunteerAssignment

WHERE StudentID = @StudentID

If source = "Google Sheet":

DELETE FROM StudentVolunteerAssignment

WHERE ImportID = @ImportID

The operation is a hard DELETE.

There is no soft-delete field or status update in the controller.

The controller does not explicitly check:

\* whether the current user owns the assignment.

\* whether the user is an Admin.

\* whether the user is a Volunteer.

\* whether the Volunteer belongs to the same district.

\* whether the Student belongs to the user's district.

Those authorization rules are not implemented explicitly in this action.

No transaction is explicitly implemented.

Database Behavior:

Table:

StudentVolunteerAssignment

Operation:

DELETE

Success Response (200):

{

"success": true,

"message": "Volunteer assignment cancelled successfully."

}

Failure Responses:

400 Bad Request:

Invalid studentId:

{

"success": false,

"message": "Invalid Student ID."

}

Missing source:

{

"success": false,

"message": "Source is required."

}

Invalid source:

{

"success": false,

"message": "Invalid source. Allowed values are 'New Student' and 'Google Sheet'."

}

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request.

403 Forbidden:

Not explicitly returned by this action.

404 Not Found:

{

"success": false,

"message": "Volunteer assignment not found."

}

Returned when ExecuteNonQuery() returns 0.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Returned for SqlException or general Exception.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

401 may be produced by [JwtSessionFilter].

=========================================================

COMMON DTOs

===========

1. AssignVolunteerRequest

-------------------------

DTO Name:

AssignVolunteerRequest

Purpose:

Request model used by the Assign Volunteer and Reassign Volunteer endpoints.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Identifier of the New Student record. When Source = "Google Sheet", this value is used as ImportID. Controller requires value > 0. |

| VolunteerID | int | Yes | No | ID of the Volunteer user. Controller requires value > 0. |

| Source | string | Yes | No | Identifies the source type. Allowed values: "New Student" and "Google Sheet". |

Important:

The DTO itself has no [Required] attributes shown in the controller source. Requiredness is enforced explicitly by the controller.

Sample Request:

{

"StudentID": 101,

"VolunteerID": 205,

"Source": "New Student"

}

Google Sheet Sample:

{

"StudentID": 5001,

"VolunteerID": 205,

"Source": "Google Sheet"

}

=========================================================

2. SelectListItemDto

=====================

DTO Name:

SelectListItemDto

Purpose:

Generic dropdown item DTO used for District and Volunteer dropdown responses.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Value | string | No | Yes | Identifier represented as a string. DistrictID or Volunteer User ID depending on endpoint. |

| Text | string | No | Yes | Display text for the dropdown item. |

Sample District Item:

{

"Value": "1",

"Text": "Dharwad"

}

Sample Volunteer Item:

{

"Value": "205",

"Text": "Volunteer Name (Dharwad)"

}

=========================================================

3. PayanaStudentListVM

=======================

DTO Name:

PayanaStudentListVM

Purpose:

Represents a student returned by the Get Students By District endpoint.

The class definition itself is not included in the supplied controller source. The properties populated by this controller can nevertheless be identified from the SQL reader mapping.

Properties Populated By This Controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | StudentID for New Student records or ImportID for Google Sheet records. |

| Source | string | No | Yes | "New Student" or "Google Sheet". |

| StudentName | string | No | Yes | Student name. |

| ContactNumber | string | No | Yes | Student contact number. |

| Taluka | string | No | Yes | Taluka associated with the student. |

| DistrictName | string | No | Yes | District name. |

| CollegeName | string | No | Yes | College name. |

| FamilyIncome | decimal | No | Yes | Family income. Assigned only when database value is not NULL. |

| SecuredPercentage | decimal | No | Yes | Secured percentage. Assigned only when database value is not NULL. |

| Remark | string | No | Yes | Remark. For New Student, comes from New\_Students.Remark; for Google Sheet, comes from GoogleSheet\_PUC.Remarks. |

| VolunteerName | string | No | Yes | Assigned Volunteer name with district in parentheses. NULL when no matching Volunteer exists. |

| IsAssigned | int | Yes | No | 1 when an assignment exists, otherwise 0. |

| IsHouseVisitCompleted | int | Yes | No | 1 when a completed PUC house visit exists for New Student; always 0 for Google Sheet records. |

Important:

The complete class declaration of PayanaStudentListVM is not included in the supplied controller. Therefore any additional properties that may exist in the model are not specified in this contract.

=========================================================

DROPDOWN APIs

============

DISTRICT DROPDOWN

-----------------

Endpoint:

GET /api/assign-volunteer-house-visit/districts

Authorization:

JWT Required.

Response:

{

"success": true,

"count": 2,

"data": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Bengaluru"

}

]

}

Filtering:

No UserID, EmployeeID, Role, or DistrictID filtering.

Active/Inactive Filtering:

Not implemented.

Default "-- Select --" Option:

Not implemented.

Data Source:

DistrictMaster.

VOLUNTEER DROPDOWN

------------------

Endpoint:

GET /api/assign-volunteer-house-visit/volunteers?districtId=1

Authorization:

JWT Required.

Request Parameter:

| Parameter | Type | Required | Description |

|-----------|------|----------|-------------|

| districtId | int | Yes | District ID. Must be greater than 0. Volunteer users are restricted to Session["DistrictID"]. |

Response:

{

"success": true,

"count": 2,

"data": [

{

"Value": "101",

"Text": "Ramesh (Dharwad)"

},

{

"Value": "102",

"Text": "Suresh (Dharwad)"

}

]

}

Filtering:

\* Users.Role = "Volunteer"

\* Users.District must equal the DistrictMaster.DistrictName corresponding to the requested DistrictID.

\* If the current user is a Volunteer, the requested district is overridden by Session["DistrictID"].

Active/Inactive Filtering:

Not implemented.

Default "-- Select --" Option:

Not implemented.

Data Source:

\* Users

\* DistrictMaster

=========================================================

JWT / AUTHORIZATION SUMMARY

===========================

Controller-Level JWT:

Not applied.

Action-Level JWT:

Applied to all six controller actions using [JwtSessionFilter].

Endpoint Authentication Matrix:

| Endpoint | Method | JWT Required | Existing Filter | Role Restriction |

|----------|--------|--------------|-----------------|------------------|

| /api/assign-volunteer-house-visit/districts | GET | Yes | [JwtSessionFilter] | None explicitly specified |

| /api/assign-volunteer-house-visit/students | GET | Yes | [JwtSessionFilter] | Volunteer has district restriction |

| /api/assign-volunteer-house-visit/volunteers | GET | Yes | [JwtSessionFilter] | Volunteer has district restriction |

| /api/assign-volunteer-house-visit/assign | POST | Yes | [JwtSessionFilter] | None explicitly specified |

| /api/assign-volunteer-house-visit/reassign | PUT | Yes | [JwtSessionFilter] | None explicitly specified |

| /api/assign-volunteer-house-visit/cancel | DELETE | Yes | [JwtSessionFilter] | None explicitly specified |

Required Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | Not specified | Not directly used by this controller | Not directly referenced in the supplied controller. |

| EmployeeID | Not specified | Not directly used by this controller | Not directly referenced in the supplied controller. |

| Role/UserRole | string | Required for Volunteer-specific session behavior if populated by authentication | The controller reads Session["UserRole"]. |

| DistrictID | int | Required for Volunteer-specific access to students/volunteers | The controller reads Session["DistrictID"] when UserRole = Volunteer. |

Important:

The controller does not directly access JWT claims.

It accesses:

HttpContext.Current.Session["UserRole"]

and:

HttpContext.Current.Session["DistrictID"]

The controller comments indicate that Volunteer district information is expected to originate from JWT/Session authentication.

The exact JWT-to-Session mapping is not implemented in this controller and is therefore:

"Not specified in controller."

=========================================================

DATABASE SUMMARY

================

Connection String:

EnvisageDb

Connection Type:

System.Data.SqlClient.SqlConnection

Database Operations:

1. District listing:

SELECT from DistrictMaster

2. Student listing:

SELECT from:

\* New\_Students

\* DistrictMaster

\* StudentVolunteerAssignment

\* Users

\* HouseVisitForm\_PUC

\* GoogleSheet\_PUC

3. Volunteer listing:

SELECT from:

\* Users

\* DistrictMaster

4. Assign Volunteer:

INSERT into StudentVolunteerAssignment

5. Reassign Volunteer:

UPDATE StudentVolunteerAssignment

6. Cancel Assignment:

DELETE from StudentVolunteerAssignment

=========================================================

SOURCE VALUES

============

The controller supports exactly two Source values:

1. New Student

2. Google Sheet

Source validation is case-insensitive.

Source controls which database key is used:

| Source | Identifier Field | Assignment Table Field |

|--------|------------------|------------------------|

| New Student | StudentID | StudentVolunteerAssignment.StudentID |

| Google Sheet | StudentID request property | StudentVolunteerAssignment.ImportID |

Important:

For Google Sheet operations, the request property remains StudentID, but the controller treats its value as ImportID.

=========================================================

ERROR RESPONSE STANDARD

=======================

The controller generally uses the following structure for errors:

{

"success": false,

"message": "Error message"

}

The exact message depends on the validation or exception.

Known controller-generated validation messages:

\* "Request body is required."

\* "Invalid Student ID."

\* "Invalid Volunteer ID."

\* "Source is required."

\* "Invalid source. Allowed values are 'New Student' and 'Google Sheet'."

\* "Invalid District ID."

\* "Volunteer district information is not available."

\* "Volunteer assignment was not created."

\* "Volunteer assignment not found."

For unhandled database/general exceptions, the controller exposes:

ex.Message

=========================================================

COMPLETE ENDPOINT SUMMARY

=========================

| # | HTTP Method | Endpoint | Purpose | JWT |

|---|-------------|----------|---------|-----|

| 1 | GET | /api/assign-volunteer-house-visit/districts | Get district dropdown data | Required |

| 2 | GET | /api/assign-volunteer-house-visit/students?districtId={districtId} | Get New Student + Google Sheet students by district | Required |

| 3 | GET | /api/assign-volunteer-house-visit/volunteers?districtId={districtId} | Get Volunteers by district | Required |

| 4 | POST | /api/assign-volunteer-house-visit/assign | Create Volunteer assignment | Required |

| 5 | PUT | /api/assign-volunteer-house-visit/reassign | Change assigned Volunteer | Required |

| 6 | DELETE | /api/assign-volunteer-house-visit/cancel?studentId={studentId}&source={source} | Delete/cancel Volunteer assignment | Required |

=========================================================

HTTP STATUS CODE SUMMARY

========================

200 OK:

Used for successful GET, PUT, and DELETE operations.

201 Created:

Used when a Volunteer assignment is successfully created.

400 Bad Request:

Used for invalid/missing request values such as:

\* Missing request body

\* Invalid StudentID

\* Invalid VolunteerID

\* Invalid DistrictID

\* Missing Source

\* Invalid Source

401 Unauthorized:

Not explicitly returned inside the controller actions, but may be returned by the existing [JwtSessionFilter] when authentication fails.

403 Forbidden:

Explicitly returned by the Students and Volunteers endpoints when a Volunteer does not have valid district information in Session.

404 Not Found:

Used by Reassign and Cancel when no matching assignment exists.

409 Conflict:

Used by Assign when ExecuteNonQuery() reports that no assignment was created.

500 Internal Server Error:

Used for SQL exceptions and general exceptions.

The controller returns the exception message directly in the response.

=========================================================

MULTIPART / FILE UPLOAD

=======================

Multipart/form-data:

Not used by any endpoint in this controller.

File Uploads:

None.

Normal Form Fields:

None.

File Fields:

None.

Therefore:

\* No file is mandatory.

\* No file extension validation exists.

\* No maximum file size is defined.

\* Multiple file upload is not supported by these endpoints.

\* No existing file replacement/retention logic exists.

=========================================================

PAGINATION / SEARCH / SORTING

=============================

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

Total Count:

The list endpoints return a count property containing the number of returned records.

Example:

{

"success": true,

"count": 10,

"data": [...]

}

=========================================================

FINAL CONTRACT VALIDATION

=========================

Controller endpoints verified:

1. GET /districts

2. GET /students

3. GET /volunteers

4. POST /assign

5. PUT /reassign

6. DELETE /cancel

Authentication verified:

\* No controller-level JWT filter.

\* [JwtSessionFilter] is applied individually to all six actions.

\* All six endpoints therefore require JWT according to the supplied controller.

\* No endpoint is intentionally public according to the supplied controller.

Role behavior verified:

\* No explicit Admin/Employee role authorization is implemented.

\* "Volunteer" is specifically checked in GetStudentsByDistrict().

\* "Volunteer" is specifically checked in GetVolunteersByDistrict().

\* Volunteers are restricted to Session["DistrictID"].

\* The supplied districtId is overridden for Volunteer users.

\* Missing/invalid Volunteer district information results in 403 Forbidden.

JWT claim behavior verified:

\* JWT claims are not directly accessed by these actions.

\* Session["UserRole"] and Session["DistrictID"] are accessed.

\* The exact JWT claims that populate these Session values are not specified in the supplied controller.

Database behavior verified:

\* Direct ADO.NET / SqlConnection / SqlCommand usage.

\* DistrictMaster SELECT.

\* Student data SELECT with UNION ALL.

\* StudentVolunteerAssignment INSERT.

\* StudentVolunteerAssignment UPDATE.

\* StudentVolunteerAssignment DELETE.

\* No explicit transaction.

\* No explicit duplicate pre-check.

\* No explicit CreatedBy/ModifiedBy handling.

\* No explicit audit fields.

\* No explicit soft-delete logic.

File upload verified:

\* No multipart/form-data endpoint.

\* No file upload fields.

DTOs verified:

\* AssignVolunteerRequest

\* SelectListItemDto

\* PayanaStudentListVM is referenced and populated by the controller, but its complete class definition is not present in the supplied source. Only properties actually populated by this controller are documented above.

No additional fields, JWT roles, claims, validation rules, database behavior, file behavior, pagination, or endpoints have been inferred beyond what is visible in the supplied controller.