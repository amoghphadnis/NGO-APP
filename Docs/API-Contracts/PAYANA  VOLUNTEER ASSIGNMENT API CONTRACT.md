=========================================================

PAYANA VOLUNTEER ASSIGNMENT API CONTRACT

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/payana-volunteer-assignment

Controller:

PayanaAssignVolunteerForHouseVisitApiController

API Technology:

ASP.NET Web API

Content-Type:

application/json

Authentication:

JWT authentication/session validation is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute.

Important:

The controller does NOT contain a controller-level JWT filter. However, every action in this supplied controller explicitly has [JwtSessionFilter], therefore all currently exposed endpoints require the existing JWT/session filter.

Authorization Model:

- All endpoints are protected by [JwtSessionFilter].

- The controller additionally performs role-based/business authorization for users whose session UserRole is "Volunteer".

- For Volunteer users, DistrictID must be available in Session.

- Volunteer users cannot override their session district by supplying another districtId.

- Volunteer assignment operations verify that the selected volunteer belongs to the authenticated Volunteer user's district.

- The controller itself does not explicitly validate a UserID/EmployeeID JWT claim.

- The controller reads UserRole and DistrictID from HttpContext.Current.Session.

- Therefore, the JWT/session authentication mechanism is expected to populate these Session values before the controller action executes.

JWT EXPECTATION

===============

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Current Implementation:

[JwtSessionFilter] is applied individually to every action.

Session values consumed by this controller:

| Session Key | Type | Required | Purpose |

|-------------|------|----------|---------|

| UserRole | string | Conditionally | Determines whether Volunteer-specific district restrictions apply |

| DistrictID | int | Conditionally | Determines the authenticated Volunteer user's district |

Important:

The controller does not directly read JWT claims. It reads HttpContext.Current.Session["UserRole"] and HttpContext.Current.Session["DistrictID"].

For a user whose UserRole is "Volunteer":

- DistrictID must exist.

- DistrictID must be a positive integer.

- Student and volunteer district queries are forcibly restricted to the session DistrictID.

- Assignment/reassignment operations verify that the target volunteer belongs to the session DistrictID.

- A Volunteer cannot select a volunteer from another district.

For non-Volunteer users:

- The controller does not impose the Volunteer-specific district restriction.

- No specific non-Volunteer role is explicitly required by this controller.

No controller-level authorization attribute is present. The existing action-level [JwtSessionFilter] must be preserved.

=========================================================

1. GET INITIAL DATA

===================

Endpoint:

/api/payana-volunteer-assignment/initial-data

HTTP Method:

GET

Purpose:

Returns the initial data required by the Payana volunteer assignment screen.

The current implementation returns:

- The complete district list from DistrictMaster.

- An empty Payana student list.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No specific role is required by the controller.

- The endpoint is not public because [JwtSessionFilter] is explicitly applied.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Required Claims: Not directly specified in the controller.

\* Required Roles: None explicitly specified.

\* How claims are used: No JWT claim is directly consumed by this action.

\* Session dependency: The action itself does not read Session values, but the action is still protected by [JwtSessionFilter].

Path Parameters:

None.

Query Parameters:

None.

Request Body:

None.

Validation Rules:

- No request parameters are validated.

- Authentication/filter validation is handled by [JwtSessionFilter].

Business Logic Notes:

- Calls GetDistrictListInternal().

- Districts are selected from DistrictMaster.

- Returns an empty List<PayanaStudentDto>() as data.

- No district/user/role filtering is performed by this action.

Database Behavior:

SELECT DistrictID and DistrictName from DistrictMaster.

Success Response (200):

{

"success": true,

"districts": [

{

"DistrictID": 1,

"DistrictName": "Example District"

},

{

"DistrictID": 2,

"DistrictName": "Example District 2"

}

],

"data": []

}

Failure Responses:

401 Unauthorized:

- Applicable if [JwtSessionFilter] rejects a missing, invalid, or expired JWT/session authentication.

- Exact behavior is implemented by the filter and is not specified in this controller.

403 Forbidden:

- Not explicitly returned by this action.

- No Volunteer-specific authorization check is performed.

404 Not Found:

- Not used by this action.

409 Conflict:

- Not used by this action.

500 Internal Server Error:

- Returned when an unhandled Exception reaches the catch block.

- Response:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 500 Internal Server Error

- 401 Unauthorized may be produced by [JwtSessionFilter], but is not explicitly returned in this action.

=========================================================

2. GET STUDENTS BY DISTRICT

===========================

Endpoint:

/api/payana-volunteer-assignment/students

HTTP Method:

GET

Purpose:

Returns approved Payana students for a specified district, combining:

- New students from PayanaStudents.

- Students imported from GoogleSheet\_Payana\_NewStudent.

The response also includes volunteer assignment and house-visit status information.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No specific role is required for access.

- Additional district authorization applies when UserRole = Volunteer.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None for general access.

\* Volunteer-specific requirement: UserRole = Volunteer causes DistrictID to be read from Session.

\* Session values required for Volunteer:

- UserRole

- DistrictID

\* How claims are used:

The controller does not directly read JWT claims. The existing authentication/session infrastructure is expected to populate the relevant Session values.

Path Parameters:

None.

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District to retrieve students for. Must be greater than 0. For Volunteer users, this value is overridden by Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

- districtId must be greater than 0.

- If districtId <= 0, the endpoint returns 400 Bad Request.

- If UserRole = Volunteer:

- Session DistrictID must exist.

- Session DistrictID must be greater than 0.

- The supplied districtId is ignored/overridden.

- Students are restricted to records whose district matches the final districtId.

- Only PayanaStudents records with ApproveStatus = "Approved" are included.

- Only GoogleSheet\_Payana\_NewStudent records with Approve = "Approved" are included.

- Google Sheet records must resolve their District value to DistrictMaster.

- No pagination, search, sorting, date filtering, or page-size parameters are implemented.

- No duplicate validation is performed by the endpoint.

Business Logic Notes:

For non-Volunteer users:

- The requested districtId is used.

For Volunteer users:

- The supplied districtId cannot be used to access another district.

- The controller replaces districtId with Session["DistrictID"].

- If DistrictID is unavailable, the endpoint returns 403 Forbidden.

New Student records:

- Source is returned as "New Student".

- IsAssigned = 1 when a matching Payana\_StudentVolunteerAssignment.StudentID exists.

- VolunteerName is generated as:

Volunteer Name + " (" + Volunteer District Name + ")"

- IsHouseVisitCompleted = 1 when a HouseVisitForm record exists for the student with Status = 1.

Google Sheet records:

- Source is returned as "Google Sheet".

- Assignment is matched through ImportID.

- IsAssigned = 1 when a matching Payana\_StudentVolunteerAssignment.ImportID exists.

- IsHouseVisitCompleted is always 0.

- District is matched to DistrictMaster using trimmed district names.

- Only records with Approve = "Approved" are returned.

Database Tables Accessed:

- PayanaStudents

- DistrictMaster

- Payana\_StudentVolunteerAssignment

- Users

- HouseVisitForm

- GoogleSheet\_Payana\_NewStudent

SELECT behavior:

The query uses UNION ALL to combine New Student and Google Sheet records.

New Student filtering:

- s.ApproveStatus = 'Approved'

- s.DistrictID = @DistrictID

Google Sheet filtering:

- gp.Approve = 'Approved'

- dm.DistrictID = @DistrictID

Assignment information:

- New Student: Payana\_StudentVolunteerAssignment.StudentID

- Google Sheet: Payana\_StudentVolunteerAssignment.ImportID

Volunteer information:

- Users.Id

- Users.Name

- Users.DistrictID through DistrictMaster

- Users.Role is not used in the student query itself.

House visit:

- HouseVisitForm.StudentID = s.StudentID

- HouseVisitForm.Status = 1

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

"Taluka": "Example Taluka",

"DistrictName": "Example District",

"CollegeName": "Example College",

"FamilyIncome": 150000.00,

"SecuredPercentage": 82.50,

"IsAssigned": 1,

"IsHouseVisitCompleted": 0,

"VolunteerName": "Volunteer One (Example District)",

"Remark": "Eligible"

},

{

"StudentID": 5001,

"Source": "Google Sheet",

"StudentName": "Jane Doe",

"ContactNumber": "9876500000",

"Taluka": "Example Taluka",

"DistrictName": "Example District",

"CollegeName": "Example School",

"FamilyIncome": 120000.00,

"SecuredPercentage": 78.00,

"IsAssigned": 0,

"IsHouseVisitCompleted": 0,

"VolunteerName": null,

"Remark": "Imported student"

}

]

}

Nullable Response Fields:

- StudentName: nullable in database/result.

- ContactNumber: nullable.

- Taluka: nullable.

- DistrictName: nullable.

- CollegeName: nullable.

- FamilyIncome: nullable.

- SecuredPercentage: nullable.

- VolunteerName: nullable.

- Remark: nullable.

- Source is nullable at database-reading level, although the SQL explicitly supplies a value.

Failure Responses:

400 Bad Request:

When districtId <= 0.

{

"success": false,

"message": "Invalid District ID."

}

401 Unauthorized:

- Applicable if [JwtSessionFilter] rejects authentication.

- Exact filter behavior is not specified in this controller.

403 Forbidden:

When UserRole = Volunteer and Session DistrictID is missing or invalid.

{

"success": false,

"message": "Volunteer district information is not available."

}

404 Not Found:

- Not returned when no students exist.

- An empty list is returned with HTTP 200.

409 Conflict:

- Not used by this endpoint.

500 Internal Server Error:

Returned for other Exceptions.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 403 Forbidden

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

3. GET DISTRICTS

================

Endpoint:

/api/payana-volunteer-assignment/districts

HTTP Method:

GET

Purpose:

Returns the district dropdown/list from DistrictMaster.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No specific role is required by the controller.

- No UserID/EmployeeID filtering is performed.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None.

\* Session dependency: None in the action itself.

Path Parameters:

None.

Query Parameters:

None.

Request Body:

None.

Validation Rules:

- No request parameters.

- Authentication is handled by [JwtSessionFilter].

Business Logic Notes:

- Calls GetDistrictListInternal().

- Returns every row selected from DistrictMaster.

- No active/inactive filter is present.

- No "-- Select --" default option is generated.

- No UserID, EmployeeID, Role, or DistrictID filtering is performed.

- No pagination or sorting is implemented.

Database Behavior:

SELECT

DistrictID,

DistrictName

FROM DistrictMaster

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"DistrictID": 1,

"DistrictName": "Example District"

},

{

"DistrictID": 2,

"DistrictName": "Example District 2"

}

]

}

Dropdown Notes:

- This is a district dropdown/list endpoint.

- There is no "-- Select --" option generated by the API.

- Active/inactive filtering is not specified in the controller.

- User-specific filtering is not performed.

Failure Responses:

400 Bad Request:

- Not used.

401 Unauthorized:

- May be returned by [JwtSessionFilter] when authentication fails.

- Not explicitly returned by this action.

403 Forbidden:

- Not used by this action.

404 Not Found:

- Not used.

- Empty district lists result in 200 with an empty data array.

409 Conflict:

- Not used.

500 Internal Server Error:

Returned for exceptions.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

4. GET VOLUNTEERS BY DISTRICT

=============================

Endpoint:

/api/payana-volunteer-assignment/volunteers

HTTP Method:

GET

Purpose:

Returns Volunteers belonging to a specified district.

The endpoint is used to populate the volunteer selection/dropdown for assignment.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No single mandatory role is specified for access.

- Volunteer users are restricted to their Session DistrictID.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None explicitly required.

\* Conditional role logic:

If Session["UserRole"] = "Volunteer", the endpoint ignores the supplied districtId and uses Session["DistrictID"].

\* Required Session values for Volunteer:

- UserRole

- DistrictID

Path Parameters:

None.

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| districtId | int | Yes | District whose Volunteers should be returned. Must be greater than 0. For Volunteer users, this value is overridden with Session["DistrictID"]. |

Request Body:

None.

Validation Rules:

- districtId must be greater than 0.

- If districtId <= 0, returns 400.

- If UserRole = Volunteer:

- Session DistrictID must exist.

- Session DistrictID must be greater than 0.

- Supplied districtId is overridden.

- Only Users with Role = "Volunteer" are returned.

- Volunteer district is matched through the DistrictName stored in Users.District against the DistrictMaster district name.

- No pagination/search/sorting parameters are supported.

- No active/inactive filtering is implemented.

Business Logic Notes:

- For Volunteer users, district security is enforced using Session DistrictID.

- For non-Volunteer users, the requested districtId is used.

- The query finds the DistrictName corresponding to @DistrictId.

- Users are returned only where Role = 'Volunteer'.

- Results are ordered by Name.

- The response contains Id, Name, Taluk and a computed DisplayName property in the DTO.

- DisplayName is not populated by the SQL reader and is therefore computed by the DTO property when serialized.

Database Behavior:

SELECT

Id,

Name,

Taluk

FROM Users

WHERE Role = 'Volunteer'

AND District =

(

SELECT DistrictName

FROM DistrictMaster

WHERE DistrictID = @DistrictId

)

ORDER BY Name

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"Id": 11,

"Name": "Volunteer One",

"Taluk": "Example Taluka",

"DisplayName": "Volunteer One (Example Taluka)"

},

{

"Id": 12,

"Name": "Volunteer Two",

"Taluk": null,

"DisplayName": "Volunteer Two"

}

]

}

Dropdown Notes:

- This is a Volunteer dropdown/list endpoint.

- There is no "-- Select --" option generated by the API.

- Only Users with Role = "Volunteer" are selected.

- Results are sorted by Name.

- No active/inactive filtering is present.

- For Volunteer users, results are filtered to their session DistrictID.

- For non-Volunteer users, results are filtered using the supplied districtId.

Failure Responses:

400 Bad Request:

When districtId <= 0.

{

"success": false,

"message": "Invalid District ID."

}

401 Unauthorized:

- May be generated by [JwtSessionFilter] if authentication fails.

- Not explicitly returned by the action.

403 Forbidden:

When UserRole = Volunteer and Session DistrictID is missing or invalid.

{

"success": false,

"message": "Volunteer district information is not available."

}

404 Not Found:

- Not used when no Volunteers exist.

- Empty list returns 200.

409 Conflict:

- Not used.

500 Internal Server Error:

Returned for exceptions.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 403 Forbidden

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

5. ASSIGN VOLUNTEER

===================

Endpoint:

/api/payana-volunteer-assignment/assign

HTTP Method:

POST

Purpose:

Assigns a Volunteer to a Payana student.

The student can originate from:

- PayanaStudents ("New Student")

- GoogleSheet\_Payana\_NewStudent ("Google Sheet")

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No explicit role is required for all callers.

- If UserRole = "Volunteer", the selected Volunteer must belong to the authenticated Volunteer user's district.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None explicitly required.

\* Conditional Volunteer authorization:

- Session["UserRole"] must identify the user as Volunteer.

- Session["DistrictID"] must be available and valid.

- request.VolunteerId must identify a Volunteer belonging to that district.

\* Session dependency:

ValidateVolunteerDistrict() reads UserRole and DistrictID from Session.

Request Body:

{

"StudentId": 101,

"VolunteerId": 11,

"Source": "New Student"

}

Request Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | StudentID for a New Student or ImportID for a Google Sheet student. Must be greater than 0. |

| VolunteerId | int | Yes | No | Users.Id of the Volunteer to assign. Must be greater than 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitive. |

Path Parameters:

None.

Query Parameters:

None.

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- VolunteerId must be greater than 0.

- Source must be one of:

- "New Student"

- "Google Sheet"

- Source comparison is case-insensitive.

- Volunteer district authorization is performed by ValidateVolunteerDistrict().

- If UserRole = Volunteer:

- Session DistrictID must exist and be greater than 0.

- VolunteerId must correspond to a User where:

- Id = VolunteerId

- Role = "Volunteer"

- District matches the authenticated user's DistrictID.

- The controller does not explicitly check whether the student exists before INSERT.

- The controller does not explicitly check whether the student belongs to the authenticated Volunteer user's district.

- Duplicate assignment handling is delegated to the database and/or database constraints.

- No transaction is explicitly created.

- No explicit existence check is performed for the target Volunteer for non-Volunteer users beyond the Volunteer-specific validation behavior.

Business Logic Notes:

If Source = "New Student":

The API executes:

INSERT INTO Payana\_StudentVolunteerAssignment

(

StudentID,

VolunteerID

)

VALUES

(

@StudentID,

@VolunteerID

)

StudentId is interpreted as StudentID.

If Source = "Google Sheet":

The API executes:

INSERT INTO Payana\_StudentVolunteerAssignment

(

ImportID,

VolunteerID

)

VALUES

(

@ImportID,

@VolunteerID

)

StudentId is interpreted as ImportID.

No CreatedBy, ModifiedBy, assignment date, or audit field is populated by this controller.

No status field is explicitly set.

Success Response (201 Created):

{

"success": true,

"message": "Volunteer assigned successfully."

}

Failure Responses:

400 Bad Request:

Possible reasons:

- Request body is missing.

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

- May be generated by [JwtSessionFilter] for authentication failure.

- Not explicitly returned in the action.

403 Forbidden:

- Volunteer Session DistrictID missing/invalid.

- Selected Volunteer does not belong to authenticated Volunteer user's district.

Examples:

{

"success": false,

"message": "Volunteer district information is not available."

}

{

"success": false,

"message": "Volunteer does not belong to your assigned district."

}

404 Not Found:

- Not explicitly returned by this endpoint.

- Student existence is not explicitly checked.

409 Conflict:

- Any SqlException is converted to 409 Conflict.

- This may include duplicate assignment/database constraint failures or other SQL errors.

{

"success": false,

"message": "SQL error message"

}

500 Internal Server Error:

- Returned for non-SqlException failures.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 201 Created

- 400 Bad Request

- 403 Forbidden

- 409 Conflict

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

6. REASSIGN VOLUNTEER

=====================

Endpoint:

/api/payana-volunteer-assignment/reassign

HTTP Method:

POST

Purpose:

Changes the Volunteer assigned to an existing Payana student assignment.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No explicit mandatory role is defined.

- Volunteer users are restricted by district when selecting the replacement Volunteer.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None explicitly specified.

\* Volunteer-specific authorization:

ValidateVolunteerDistrict() checks Session["UserRole"] and Session["DistrictID"].

\* Session dependency:

UserRole and DistrictID are read from Session.

Request Body:

{

"StudentId": 101,

"VolunteerId": 12,

"Source": "New Student"

}

Request Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | StudentID for New Student or ImportID for Google Sheet. Must be greater than 0. |

| VolunteerId | int | Yes | No | New Volunteer Users.Id. Must be greater than 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitive. |

Path Parameters:

None.

Query Parameters:

None.

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- VolunteerId must be greater than 0.

- Source must be "New Student" or "Google Sheet".

- If UserRole = Volunteer:

- Session DistrictID must be present and positive.

- Replacement Volunteer must belong to the authenticated Volunteer user's district.

- Existing assignment must exist.

- UPDATE returns NotFound if zero rows are affected.

- No explicit student existence validation is performed before UPDATE.

- No explicit validation is performed to ensure the student belongs to the Volunteer user's district.

- No transaction is explicitly created.

Business Logic Notes:

If Source = "New Student":

UPDATE Payana\_StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE StudentID = @StudentID

If Source = "Google Sheet":

UPDATE Payana\_StudentVolunteerAssignment

SET VolunteerID = @VolunteerID

WHERE ImportID = @ImportID

Only VolunteerID is modified.

The controller does not populate:

- ModifiedBy

- ModifiedDate

- Audit fields

- Status

Success Response (200):

{

"success": true,

"message": "Volunteer reassigned successfully."

}

Failure Responses:

400 Bad Request:

Request validation failures.

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

- May be generated by [JwtSessionFilter].

- Not explicitly returned by this action.

403 Forbidden:

- Volunteer Session DistrictID missing/invalid.

- Replacement Volunteer is outside the authenticated Volunteer user's district.

{

"success": false,

"message": "Volunteer district information is not available."

}

{

"success": false,

"message": "Volunteer does not belong to your assigned district."

}

404 Not Found:

Returned when the UPDATE affects zero rows.

{

"success": false,

"message": "No existing volunteer assignment found."

}

409 Conflict:

- Not explicitly returned by the action.

- Unlike AssignVolunteer(), this action does not have a dedicated SqlException-to-409 catch block.

500 Internal Server Error:

Returned for exceptions.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 403 Forbidden

- 404 Not Found

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

7. CANCEL ASSIGNMENT

====================

Endpoint:

/api/payana-volunteer-assignment/cancel

HTTP Method:

POST

Purpose:

Deletes/cancels the Volunteer assignment for a Payana student.

Despite the operation being named "cancel", the controller performs a hard DELETE from Payana\_StudentVolunteerAssignment. It does not implement soft-delete behavior.

Content-Type:

application/json

Authorization:

- JWT Required

- Authorization Header: Bearer <JWT\_TOKEN>

- Filter/Authorization Scope: Action-level [JwtSessionFilter]

- No explicit role validation is performed inside this action.

- No Volunteer district validation is performed for cancellation.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims: Not directly specified.

\* Required Roles: None explicitly specified.

\* Session dependency: The action does not directly read UserRole or DistrictID.

Request Body:

{

"StudentId": 101,

"Source": "New Student"

}

Request Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | StudentID for New Student or ImportID for Google Sheet. Must be greater than 0. |

| Source | string | Yes | No | Must be "New Student" or "Google Sheet", case-insensitive. |

Path Parameters:

None.

Query Parameters:

None.

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

- Request body must not be null.

- StudentId must be greater than 0.

- Source must be "New Student" or "Google Sheet".

- Source comparison is case-insensitive.

- If Source = "New Student", deletion uses StudentID.

- If Source = "Google Sheet", deletion uses ImportID.

- No explicit role validation is performed.

- No district authorization is performed.

- No transaction is explicitly created.

- No confirmation parameter is required.

- No soft-delete status is used.

Business Logic Notes:

If Source = "New Student":

DELETE FROM Payana\_StudentVolunteerAssignment

WHERE StudentID = @StudentID

If Source = "Google Sheet":

DELETE FROM Payana\_StudentVolunteerAssignment

WHERE ImportID = @ImportID

This is a hard delete.

The controller does not populate or update:

- Status

- IsActive

- CancelledBy

- CancelledDate

- ModifiedBy

- ModifiedDate

No audit information is supplied.

Success Response (200):

{

"success": true,

"message": "Assignment cancelled successfully."

}

Failure Responses:

400 Bad Request:

Possible causes:

- Request body missing.

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

- May be generated by [JwtSessionFilter].

- Not explicitly returned by this action.

403 Forbidden:

- Not explicitly returned by this action.

- There is no Volunteer district authorization check here.

404 Not Found:

Returned when no assignment was deleted.

{

"success": false,

"message": "No volunteer assignment found."

}

409 Conflict:

- Not explicitly returned.

500 Internal Server Error:

Returned for exceptions.

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 400 Bad Request

- 404 Not Found

- 500 Internal Server Error

- 401 Unauthorized may be generated by [JwtSessionFilter].

=========================================================

COMMON VALIDATION AND AUTHORIZATION RULES

=========================================

JWT Authentication:

All seven endpoints explicitly contain [JwtSessionFilter].

Therefore:

1. GET /initial-data

JWT Required.

2. GET /students

JWT Required.

3. GET /districts

JWT Required.

4. GET /volunteers

JWT Required.

5. POST /assign

JWT Required.

6. POST /reassign

JWT Required.

7. POST /cancel

JWT Required.

There is NO public endpoint in the supplied controller.

Important distinction:

The controller does not show the internal implementation of [JwtSessionFilter]. Therefore, the exact JWT validation mechanism, claim names, expiration handling, and exact HTTP status returned by the filter cannot be determined from this controller.

The controller itself directly accesses:

- HttpContext.Current.Session["UserRole"]

- HttpContext.Current.Session["DistrictID"]

It does not directly access:

- JWT token

- UserID

- EmployeeID

- NameIdentifier

- Email

- any other JWT claim

JWT-to-Session Mapping:

Not specified in the controller.

The authentication infrastructure is expected to make the following Session values available:

- UserRole

- DistrictID

No controller-level [JwtSessionFilter] should be added because the supplied controller already applies the filter individually at action level. The current action-level scope should be preserved.

=========================================================

COMMON SOURCE RULE

==================

The Source property is used by AssignVolunteer, ReassignVolunteer, and CancelAssignment.

Allowed values:

- "New Student"

- "Google Sheet"

Comparison:

Case-insensitive.

Source = "New Student":

The StudentId refers to PayanaStudents.StudentID and the assignment table's StudentID column is used.

Source = "Google Sheet":

The StudentId refers to GoogleSheet\_Payana\_NewStudent.ImportID and the assignment table's ImportID column is used.

No other Source value is accepted.

=========================================================

COMMON DATABASE BEHAVIOR

========================

DistrictMaster:

Used to:

- Return district dropdown values.

- Resolve district names.

- Determine Volunteer district.

- Filter student results.

PayanaStudents:

Used by the student list endpoint.

GoogleSheet\_Payana\_NewStudent:

Used by the student list endpoint for imported students.

Users:

Used to:

- Retrieve Volunteers.

- Retrieve assigned Volunteer information.

- Validate a Volunteer during assignment/reassignment.

Payana\_StudentVolunteerAssignment:

Used to:

- Determine whether a student is assigned.

- Retrieve assigned Volunteer information.

- Insert assignments.

- Update assignments.

- Delete assignments.

HouseVisitForm:

Used only for New Student records to determine whether a house visit has been completed.

HouseVisitForm rule:

A house visit is considered completed when a row exists where:

- HouseVisitForm.StudentID = student StudentID

- HouseVisitForm.Status = 1

No stored procedures are used.

No explicit database transaction is used.

No explicit CreatedBy/ModifiedBy/audit fields are populated.

No soft-delete logic is implemented for cancellation.

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

- Student list: No ORDER BY is specified.

- District list: No ORDER BY is specified.

- Volunteer list: ORDER BY Name is specified.

Date Filtering:

Not implemented.

Total Count:

- Student endpoint returns count = list.Count.

- District endpoint returns count = list.Count.

- Volunteer endpoint returns count = volunteers.Count.

- Assignment/reassignment/cancel endpoints do not return count.

=========================================================

COMPLETE ENDPOINT SUMMARY

=========================

| # | Method | Route | JWT | Role Requirement | Main Function |

|---|--------|-------|-----|------------------|---------------|

| 1 | GET | /api/payana-volunteer-assignment/initial-data | Required | None explicitly required | Returns districts and empty student list |

| 2 | GET | /api/payana-volunteer-assignment/students | Required | None explicitly required; Volunteer district restriction applies | Returns approved students for a district |

| 3 | GET | /api/payana-volunteer-assignment/districts | Required | None explicitly required | Returns district list |

| 4 | GET | /api/payana-volunteer-assignment/volunteers | Required | None explicitly required; Volunteer district restriction applies | Returns Volunteers for a district |

| 5 | POST | /api/payana-volunteer-assignment/assign | Required | None explicitly required; Volunteer district restriction applies | Creates assignment |

| 6 | POST | /api/payana-volunteer-assignment/reassign | Required | None explicitly required; Volunteer district restriction applies | Updates assignment |

| 7 | POST | /api/payana-volunteer-assignment/cancel | Required | None explicitly required | Hard-deletes assignment |

=========================================================

COMMON DTOS

===========

---------------------------------------------------------

DTO 1: DistrictDto

---------------------------------------------------------

Purpose:

Represents a district returned by the district-related APIs.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| DistrictID | int | Yes | No | District identifier returned from DistrictMaster.DistrictID |

| DistrictName | string | No | Yes | District name. The controller maps DBNull to null. |

Sample Response:

{

"DistrictID": 1,

"DistrictName": "Example District"

}

---------------------------------------------------------

DTO 2: VolunteerDto

---------------------------------------------------------

Purpose:

Represents a Volunteer returned by the Volunteer dropdown/list API.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Id | int | Yes | No | Users.Id |

| Name | string | No | Yes | Volunteer name |

| Taluk | string | No | Yes | Volunteer taluk |

| DisplayName | string | Computed | No/derived | Returns Name when Taluk is empty; otherwise Name + " (" + Taluk + ")" |

DisplayName Logic:

If Taluk is null, empty, or whitespace:

DisplayName = Name

Otherwise:

DisplayName = Name + " (" + Taluk + ")"

Sample Response:

{

"Id": 11,

"Name": "Volunteer One",

"Taluk": "Example Taluka",

"DisplayName": "Volunteer One (Example Taluka)"

}

Sample Response With No Taluk:

{

"Id": 12,

"Name": "Volunteer Two",

"Taluk": null,

"DisplayName": "Volunteer Two"

}

---------------------------------------------------------

DTO 3: PayanaStudentDto

---------------------------------------------------------

Purpose:

Represents a student returned by GET /students.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentID | int | Yes | No | Student identifier. For Google Sheet records this contains ImportID. |

| Source | string | No | Yes | "New Student" or "Google Sheet" |

| StudentName | string | No | Yes | Student name |

| ContactNumber | string | No | Yes | Student contact/WhatsApp number |

| Taluka | string | No | Yes | Student taluka |

| DistrictName | string | No | Yes | District name |

| CollegeName | string | No | Yes | College/school name |

| FamilyIncome | decimal | No | Yes | Family annual income |

| SecuredPercentage | decimal | No | Yes | Academic secured percentage |

| IsAssigned | int | Yes | No | 1 if assignment exists, otherwise 0 |

| IsHouseVisitCompleted | int | Yes | No | 1 when a completed house visit exists, otherwise 0 |

| VolunteerName | string | No | Yes | Assigned Volunteer formatted with district |

| Remark | string | No | Yes | Student remark |

Important:

IsAssigned and IsHouseVisitCompleted are represented as int values, not Boolean values.

Typical values:

- 1 = true/yes

- 0 = false/no

Sample Response Item:

{

"StudentID": 101,

"Source": "New Student",

"StudentName": "John Doe",

"ContactNumber": "9876543210",

"Taluka": "Example Taluka",

"DistrictName": "Example District",

"CollegeName": "Example College",

"FamilyIncome": 150000.00,

"SecuredPercentage": 82.50,

"IsAssigned": 1,

"IsHouseVisitCompleted": 1,

"VolunteerName": "Volunteer One (Example District)",

"Remark": "Eligible"

}

---------------------------------------------------------

DTO 4: AssignVolunteerRequest

---------------------------------------------------------

Purpose:

Request model used by:

- POST /assign

- POST /reassign

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | StudentID or ImportID depending on Source |

| VolunteerId | int | Yes | No | Target Volunteer Users.Id |

| Source | string | Yes | No | "New Student" or "Google Sheet" |

Important:

The C# DTO itself contains no [Required] attributes. Requiredness is established by explicit controller validation:

- request must not be null.

- StudentId > 0.

- VolunteerId > 0.

- Source must be one of the two allowed values.

Sample Request:

{

"StudentId": 101,

"VolunteerId": 11,

"Source": "New Student"

}

Sample Google Sheet Request:

{

"StudentId": 5001,

"VolunteerId": 11,

"Source": "Google Sheet"

}

---------------------------------------------------------

DTO 5: CancelAssignmentRequest

---------------------------------------------------------

Purpose:

Request model used by POST /cancel.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentId | int | Yes | No | StudentID or ImportID depending on Source |

| Source | string | Yes | No | "New Student" or "Google Sheet" |

Important:

The DTO contains no [Required] attributes. Requiredness is established by explicit controller validation.

Sample Request:

{

"StudentId": 101,

"Source": "New Student"

}

Sample Google Sheet Request:

{

"StudentId": 5001,

"Source": "Google Sheet"

}

=========================================================

COMMON RESPONSE STRUCTURES

==========================

Successful List Response:

{

"success": true,

"count": 2,

"data": [

{}

]

}

Used by:

- GET /students

- GET /districts

- GET /volunteers

Initial Data Response:

{

"success": true,

"districts": [

{

"DistrictID": 1,

"DistrictName": "Example District"

}

],

"data": []

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

=========================================================

STANDARD ERROR RESPONSE

=======================

The controller generally uses the following error structure:

{

"success": false,

"message": "Error message"

}

The exact exception message is returned by the controller for InternalServerErrorResponse() and, for AssignVolunteer(), SQL exception messages are returned in the 409 response.

Security Note:

Returning raw exception messages can expose database/internal implementation details. This behavior is present in the supplied controller and is therefore documented as implemented behavior; changing it is outside the scope of this API contract.

=========================================================

HTTP STATUS CODE SUMMARY

========================

200 OK:

Used for:

- Initial data

- Student list

- District list

- Volunteer list

- Successful reassignment

- Successful cancellation

201 Created:

Used for:

- Successful Volunteer assignment

400 Bad Request:

Used for:

- Missing request body

- Invalid StudentId

- Invalid VolunteerId

- Invalid Source

- Invalid districtId

401 Unauthorized:

Not explicitly generated by controller actions.

May be generated by the existing [JwtSessionFilter] when JWT authentication fails.

Exact behavior is not specified in the supplied controller.

403 Forbidden:

Used when:

- A Volunteer has no valid Session DistrictID.

- A Volunteer attempts to select a Volunteer outside their assigned district.

404 Not Found:

Used when:

- Reassignment updates zero assignment records.

- Cancellation deletes zero assignment records.

409 Conflict:

Used specifically by AssignVolunteer() when a SqlException occurs.

500 Internal Server Error:

Used for general unhandled exceptions caught by the controller.

=========================================================

SECURITY / AUTHORIZATION OBSERVATIONS

=====================================

1. All actions have [JwtSessionFilter].

Therefore, all seven endpoints currently require JWT/session authentication.

2. There is no controller-level [JwtSessionFilter].

Authentication is applied at action level.

3. The controller does not directly parse JWT claims.

4. The controller relies on:

HttpContext.Current.Session["UserRole"]

HttpContext.Current.Session["DistrictID"]

5. The authentication/session layer is therefore expected to map authenticated JWT information into these Session values.

6. For UserRole = "Volunteer":

- GET /students overrides the requested districtId with Session DistrictID.

- GET /volunteers overrides the requested districtId with Session DistrictID.

- POST /assign validates the selected Volunteer against Session DistrictID.

- POST /reassign validates the selected Volunteer against Session DistrictID.

7. POST /cancel does NOT perform the same Volunteer district validation.

It only relies on [JwtSessionFilter].

8. No endpoint explicitly requires the role "Admin", "Employee", or another named role.

9. "Volunteer" is not a universally required role for these endpoints.

Rather, Volunteer is a conditional role that activates additional district restrictions.

10. No UserID or EmployeeID is used by the controller.

11. No CreatedBy, ModifiedBy, UserID, EmployeeID, or audit identity is written to the database.

12. The exact claims contained in the JWT are Not specified in controller.

13. The exact implementation of [JwtSessionFilter] is Not specified in controller.

=========================================================

DATABASE / BUSINESS RULE SUMMARY

================================

Student Sources:

New Student:

- Table: PayanaStudents

- Identifier: StudentID

- Approval condition: ApproveStatus = 'Approved'

Google Sheet:

- Table: GoogleSheet\_Payana\_NewStudent

- Identifier: ImportID

- Approval condition: Approve = 'Approved'

District filtering:

- New Student uses PayanaStudents.DistrictID.

- Google Sheet uses GoogleSheet\_Payana\_NewStudent.District matched against DistrictMaster.DistrictName after LTRIM/RTRIM.

- Volunteer users are restricted to Session DistrictID for district-based endpoints.

Volunteer:

- Table: Users

- Required role in volunteer selection query: Role = 'Volunteer'

- District association is determined through Users.District and DistrictMaster.DistrictName.

Assignment:

- Table: Payana\_StudentVolunteerAssignment

- New Student key: StudentID

- Google Sheet key: ImportID

- Volunteer key: VolunteerID

House Visit:

- Table: HouseVisitForm

- Completed when Status = 1 for the matching New Student StudentID.

Cancellation:

- Hard DELETE from Payana\_StudentVolunteerAssignment.

- No soft delete.

Transactions:

- No explicit transaction is implemented.

Audit:

- No audit fields are populated by this controller.

Duplicate Validation:

- No explicit duplicate check exists.

- Database errors during AssignVolunteer() are converted to HTTP 409 Conflict.

Pagination:

- Not implemented.

Search:

- Not implemented.

Date filters:

- Not implemented.

Sorting:

- Volunteer list is sorted by Name.

- Other lists have no explicit ORDER BY.

Default Values:

- No application-level default values are explicitly assigned to request fields.

- IsAssigned and IsHouseVisitCompleted are calculated by SQL.

- Google Sheet IsHouseVisitCompleted is explicitly returned as 0.

- No status default is assigned by these APIs.

=========================================================

ENDPOINT CONTRACT QUICK REFERENCE

==================================

GET /api/payana-volunteer-assignment/initial-data

- JWT: Required

- Parameters: None

- Returns: districts + empty data array

- Success: 200

GET /api/payana-volunteer-assignment/students?districtId={districtId}

- JWT: Required

- districtId: Required, > 0

- Volunteer users: districtId overridden by Session DistrictID

- Returns: approved New Student + Google Sheet student records

- Success: 200

- Invalid district: 400

- Volunteer district unavailable: 403

GET /api/payana-volunteer-assignment/districts

- JWT: Required

- Parameters: None

- Returns: DistrictMaster records

- Success: 200

GET /api/payana-volunteer-assignment/volunteers?districtId={districtId}

- JWT: Required

- districtId: Required, > 0

- Volunteer users: districtId overridden by Session DistrictID

- Returns: Users with Role = Volunteer

- Success: 200

- Invalid district: 400

- Volunteer district unavailable: 403

POST /api/payana-volunteer-assignment/assign

- JWT: Required

- Body: StudentId, VolunteerId, Source

- Source: New Student / Google Sheet

- Volunteer users: target Volunteer must be in session district

- Success: 201

- Validation: 400

- Authorization: 403

- SQL error: 409

- Other exception: 500

POST /api/payana-volunteer-assignment/reassign

- JWT: Required

- Body: StudentId, VolunteerId, Source

- Source: New Student / Google Sheet

- Volunteer users: target Volunteer must be in session district

- Success: 200

- Validation: 400

- Authorization: 403

- Assignment not found: 404

- Other exception: 500

POST /api/payana-volunteer-assignment/cancel

- JWT: Required

- Body: StudentId, Source

- Source: New Student / Google Sheet

- Performs hard DELETE

- Success: 200

- Validation: 400

- Assignment not found: 404

- Other exception: 500

=========================================================

FINAL CONTRACT VERIFICATION

============================

Controller endpoints included:

1. GET /initial-data

2. GET /students

3. GET /districts

4. GET /volunteers

5. POST /assign

6. POST /reassign

7. POST /cancel

Authentication:

- All seven actions explicitly contain [JwtSessionFilter].

- No controller-level JWT filter has been invented.

- No endpoint has been incorrectly marked public.

Role-based authorization:

- No endpoint has a universally required named role.

- Volunteer-specific authorization has been documented where implemented.

- Volunteer district restrictions have been documented.

- The absence of Volunteer district validation in /cancel has been explicitly documented.

JWT/session dependency:

- UserRole and DistrictID are read from Session.

- Direct JWT claim names are not specified.

- JWT-to-Session mapping is not specified in the controller.

Request models:

- AssignVolunteerRequest documented.

- CancelAssignmentRequest documented.

Response models:

- DistrictDto documented.

- VolunteerDto documented.

- PayanaStudentDto documented.

- Anonymous response envelopes documented.

Multipart:

- No multipart/form-data endpoints exist.

- No file uploads exist.

Pagination/search/filtering:

- No pagination, search, date filters, or configurable sorting are implemented.

- District filtering and Volunteer-specific district restrictions are documented.

Database operations:

- SELECT, INSERT, UPDATE, DELETE behavior is documented.

- Relevant tables are identified.

- No stored procedures or explicit transactions are present.

Defaults:

- No controller-level request defaults are defined.

- Calculated status fields and Google Sheet house-visit default are documented.

Soft delete:

- Not implemented.

- Cancellation performs a hard DELETE.

Fields:

- No additional request or response fields have been invented.

- Where behavior cannot be determined from the controller, it is explicitly identified as not specified.