=========================================================

BRANCH EXECUTIVE DISTRICT MAPPING API CONTRACT

=========================================================

API Name:

Branch Executive District Mapping API

Controller:

BranchExecutiveDistrictMappingApIController

Namespace:

VP\_WebAPI.Controllers

API BASE ROUTE

==============

Route Prefix:

/api/branch-executive-district-mapping

Authentication:

JWT authentication is NOT applied at controller level.

JWT authentication is applied individually at ACTION LEVEL because

each of the three endpoints contains the [JwtSessionFilter] attribute.

Therefore, based strictly on the supplied controller:

\* GET /api/branch-executive-district-mapping/assign-districts

-> JWT Required

\* POST /api/branch-executive-district-mapping/assign-districts

-> JWT Required

\* GET /api/branch-executive-district-mapping/assigned-districts/{userId}

-> JWT Required

No public endpoint is identified in the supplied controller.

Important Authorization Note:

The actual implementation of JwtSessionFilter was not supplied.

Therefore, the exact JWT claims, token validation rules, Session mapping,

and role/permission requirements cannot be determined from this controller.

The controller itself does not directly read JWT claims, Session values,

UserID claims, EmployeeID claims, or Role claims.

=========================================================

1. GET ASSIGN DISTRICTS DATA

============================

Endpoint:

GET /api/branch-executive-district-mapping/assign-districts

Purpose:

Loads the data required to assign districts to Branch Executives.

The endpoint returns:

\* Active Branch Executives from the Users table.

\* All districts from the DistrictMaster table.

The returned data is represented by BranchExecutiveVM.

Content-Type:

Not applicable.

Response Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter scope:

Action-level.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: The controller does not directly access JWT claims.

\* Session dependency: Not specified in controller.

\* UserID filtering from JWT: Not implemented.

\* EmployeeID filtering from JWT: Not implemented.

\* Role filtering based on JWT: Not implemented.

Important:

The database query itself filters the executive list using:

Role = 'Branch Executives'

AND Status = 1

This is database filtering and should not be interpreted as a JWT role

authorization requirement.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint has no path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

None.

Validation Rules:

\* No request body is required.

\* No query parameters are accepted.

\* No pagination validation is implemented.

\* No search validation is implemented.

\* No sorting validation is implemented.

\* JWT authentication is handled by [JwtSessionFilter].

\* Branch Executives are filtered by Role = 'Branch Executives'.

\* Branch Executives are filtered by Status = 1.

\* Districts have no Status filter in the supplied query.

\* No UserID-based filtering is implemented.

\* No EmployeeID-based filtering is implemented.

\* No duplicate validation is applicable to this GET operation.

Business Logic Notes:

1. A BranchExecutiveVM object is created.

2. model.Executives is initialized as:

List<System.Web.Mvc.SelectListItem>

3. model.Districts is initialized as:

List<System.Web.Mvc.SelectListItem>

4. Branch Executives are loaded from:

Users

5. Only users satisfying:

Role = 'Branch Executives'

AND Status = 1

are returned.

6. Executive values are mapped as:

Value = Users.Id

Text = Users.Name

7. Districts are loaded from:

DistrictMaster

8. District values are mapped as:

Value = DistrictMaster.DistrictID

Text = DistrictMaster.DistrictName

9. No default "-- Select --" option is added by this controller.

10. No explicit sorting is implemented.

11. No pagination is implemented.

12. No authenticated-user filtering is implemented.

13. No role-based authorization is explicitly implemented beyond the

database filter used to identify Branch Executives.

Database Behavior:

Table 1:

Users

Query:

SELECT Id, Name

FROM Users

WHERE Role = 'Branch Executives'

AND Status = 1

Table 2:

DistrictMaster

Query:

SELECT DistrictID, DistrictName

FROM DistrictMaster

Operations:

SELECT only.

Success Response (200):

{

"success": true,

"data": {

"Executives": [

{

"Value": "7027",

"Text": "Branch Executive 1"

},

{

"Value": "7028",

"Text": "Branch Executive 2"

}

],

"Districts": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Hubballi"

}

]

}

}

Response Structure:

success:

Boolean indicating whether the operation succeeded.

data.Executives:

List of System.Web.Mvc.SelectListItem objects.

data.Districts:

List of System.Web.Mvc.SelectListItem objects.

Executive SelectListItem:

| Property | Type | Description |

|----------|------|-------------|

| Value | string | Users.Id converted to string. |

| Text | string | Users.Name converted to string. |

District SelectListItem:

| Property | Type | Description |

|----------|------|-------------|

| Value | string | DistrictMaster.DistrictID converted to string. |

| Text | string | DistrictMaster.DistrictName converted to string. |

Dropdown Behavior:

Endpoint:

GET /api/branch-executive-district-mapping/assign-districts

Authorization:

JWT Required.

Executive Dropdown:

\* Source table: Users.

\* ID/value: Id.

\* Display/text: Name.

\* Active filtering: Yes.

\* Condition: Status = 1.

\* Role filtering: Yes.

\* Required database role value: Branch Executives.

\* UserID filtering: No.

\* EmployeeID filtering: No.

\* Default "-- Select --" option: No.

\* Sorting: Not specified.

\* Pagination: No.

District Dropdown:

\* Source table: DistrictMaster.

\* ID/value: DistrictID.

\* Display/text: DistrictName.

\* Active filtering: No.

\* Role filtering: No.

\* UserID filtering: No.

\* EmployeeID filtering: No.

\* Default "-- Select --" option: No.

\* Sorting: Not specified.

\* Pagination: No.

Failure Responses:

401 Unauthorized:

Applicable when JwtSessionFilter rejects an unauthenticated or invalid request.

Example:

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if JwtSessionFilter performs authorization/role checks.

No explicit role check is present in this action.

Example:

{

"success": false,

"message": "Forbidden"

}

500 Internal Server Error:

Returned when an exception occurs while loading the executives

or districts.

Actual controller response structure:

{

"success": false,

"message": "Error message"

}

400 Bad Request:

Not explicitly returned by this endpoint.

404 Not Found:

Not explicitly returned by this endpoint.

409 Conflict:

Not explicitly returned by this endpoint.

Status Codes Used / Applicable:

\* 200 OK - Data successfully loaded.

\* 401 Unauthorized - JWT filter rejects authentication.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

2. ASSIGN DISTRICTS TO BRANCH EXECUTIVE

=======================================

Endpoint:

POST /api/branch-executive-district-mapping/assign-districts

Purpose:

Assigns one or more districts to a Branch Executive.

The existing mappings for the selected user are first deleted.

The selected district mappings are then inserted.

This endpoint therefore performs a replacement operation rather than

simply adding new mappings.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter scope:

Action-level.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: The controller does not directly access JWT claims.

\* Session dependency: Not specified in controller.

\* UserID from JWT: Not used.

\* EmployeeID from JWT: Not used.

\* Role from JWT: Not used.

Important:

Although the endpoint operates on a Branch Executive User ID, the

SelectedUserId is supplied in the request body. It is NOT obtained from

a JWT claim by this controller.

The controller does not independently verify that SelectedUserId belongs

to a user whose Role is 'Branch Executives'.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | SelectedUserId is supplied in the request body. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

{

"SelectedUserId": 7027,

"SelectedDistrictIds": [

1,

2,

5

]

}

Request Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| SelectedUserId | int | Yes | No | User ID of the Branch Executive whose district mappings are being assigned. Must be greater than 0. |

| SelectedDistrictIds | array of int | Yes | No | List of district IDs to assign. Must contain at least one item. |

Validation Rules:

1. Request body is required.

If model == null:

{

"success": false,

"message": "Request body is required."

}

2. SelectedUserId must be greater than 0.

If SelectedUserId <= 0:

{

"success": false,

"message": "Valid Branch Executive User ID is required."

}

3. SelectedDistrictIds must not be null.

4. SelectedDistrictIds must contain at least one item.

If null or empty:

{

"success": false,

"message": "At least one district must be selected."

}

5. Each districtId in SelectedDistrictIds is checked.

6. District IDs less than or equal to zero are skipped during insertion.

Specifically:

if (districtId <= 0)

continue;

7. The controller does not return a validation error for invalid district

IDs contained in the array. Such values are simply skipped.

8. No minimum or maximum number of district IDs is specified.

9. No duplicate district validation is implemented.

10. No explicit verification that each DistrictID exists in DistrictMaster

is performed by the controller.

11. No explicit verification that SelectedUserId exists in Users is performed.

12. No explicit verification that SelectedUserId has:

Role = 'Branch Executives'

13. No explicit role check is performed in this action.

14. JWT authentication is enforced by [JwtSessionFilter].

15. No email, date, file, or string-length validation applies.

Business Logic Notes:

IMPORTANT REPLACEMENT BEHAVIOR:

The endpoint does not append mappings to existing mappings.

The operation is:

Step 1:

Delete all existing mappings for SelectedUserId.

Step 2:

Loop through SelectedDistrictIds.

Step 3:

For every districtId greater than 0, insert a new mapping.

Therefore, the submitted district list becomes the new mapping set.

Example:

Existing mappings:

UserId 7027:

District 1

District 2

District 3

Request:

{

"SelectedUserId": 7027,

"SelectedDistrictIds": [4, 5]

}

After successful execution:

UserId 7027:

District 4

District 5

Previous mappings 1, 2, and 3 are deleted.

Database Operation 1 - Delete Existing Mappings:

DELETE FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

Parameter:

@UserId = model.SelectedUserId

Database Operation 2 - Insert New Mappings:

INSERT INTO BranchExecutiveDistrictMapping

(

UserId,

DistrictID

)

VALUES

(

@UserId,

@DistrictID

)

Parameters:

@UserId = model.SelectedUserId

@DistrictID = districtId

Tables Accessed:

\* BranchExecutiveDistrictMapping

The Users and DistrictMaster tables are NOT queried by this POST action.

Soft Delete:

No.

Hard Delete:

The old mappings are physically deleted using DELETE.

This is not a soft delete.

Transaction:

No explicit SQL transaction is implemented.

Important Atomicity Note:

The controller performs the DELETE and subsequent INSERT operations

without an explicit transaction. If an exception occurs after the old

mappings have been deleted but before all new mappings are inserted,

the database could contain only partially recreated mappings.

Duplicate Check:

Not implemented.

Foreign Key Validation:

Not explicitly implemented in the controller.

Database constraints, if present, may reject invalid UserId or DistrictID.

Success Response (200):

{

"success": true,

"message": "Assigned Districts successfully!"

}

Failure Responses:

400 Bad Request - Missing Request Body:

{

"success": false,

"message": "Request body is required."

}

400 Bad Request - Invalid User ID:

{

"success": false,

"message": "Valid Branch Executive User ID is required."

}

400 Bad Request - No District Selected:

{

"success": false,

"message": "At least one district must be selected."

}

401 Unauthorized:

Applicable when JwtSessionFilter rejects authentication.

Example:

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if JwtSessionFilter performs authorization checks.

No explicit role check is present in the controller.

Example:

{

"success": false,

"message": "Forbidden"

}

404 Not Found:

Not explicitly implemented.

A non-existent UserId or DistrictID may instead cause a database

constraint exception, depending on the database schema.

409 Conflict:

Not explicitly implemented.

No duplicate conflict handling exists in the controller.

500 Internal Server Error:

Returned for unexpected exceptions, including possible database

constraint or connection errors.

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK - District mappings successfully replaced.

\* 400 Bad Request - Invalid request body/User ID/no districts.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 404 Not Found - Not explicitly implemented.

\* 409 Conflict - Not explicitly implemented.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

3. GET ASSIGNED DISTRICTS

=========================

Endpoint:

GET /api/branch-executive-district-mapping/assigned-districts/{userId}

Purpose:

Retrieves the district IDs assigned to a specified user.

The endpoint uses a two-step lookup:

1. It first checks BranchExecutiveDistrictMapping.

2. If no mapping exists, it falls back to the DistrictID stored in

the Users table for the specified Branch Executive.

Content-Type:

Not applicable.

Response Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter scope:

Action-level.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: The controller does not directly access JWT claims.

\* Session dependency: Not specified in controller.

\* UserID from JWT: Not used.

\* EmployeeID from JWT: Not used.

\* Role from JWT: Not used.

Important:

The userId in this endpoint is supplied directly as a path parameter.

The controller does not compare it against the authenticated user's ID.

Therefore, the supplied controller does not implement an explicit

"current user can only retrieve their own districts" rule.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| userId | int | Yes | User ID whose assigned districts should be retrieved. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

None.

Validation Rules:

1. userId must be greater than 0.

2. If userId <= 0:

{

"success": false,

"message": "Invalid User ID."

}

3. The controller first searches the mapping table.

4. If one or more mappings are found, those DistrictID values are returned.

5. If zero mappings are found, the controller queries the Users table.

6. The fallback Users query requires:

Role = 'Branch Executives'

7. If the fallback query returns a non-null DistrictID, it is added to

the response.

8. No validation is performed to ensure that userId belongs to the

authenticated user.

9. No explicit role authorization is implemented.

10. JWT authentication is enforced by [JwtSessionFilter].

Business Logic Notes:

FIRST LOOKUP:

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserID = @UserID

If one or more rows are found:

Return all DistrictID values from the mapping table.

FALLBACK LOOKUP:

If no mapping rows are found:

SELECT DistrictID

FROM Users

WHERE Id = @UserID

AND Role = 'Branch Executives'

If the query returns a non-null DistrictID:

Add that DistrictID to the result list.

Important:

The fallback does not check Users.Status.

Therefore, the fallback query only checks:

\* Id = supplied userId

\* Role = 'Branch Executives'

It does not check:

Status = 1.

Important Result Behavior:

Case 1:

Mapping records exist.

Response:

{

"success": true,

"data": [1, 2, 5]

}

Case 2:

No mapping records exist, but the Branch Executive has a non-null

DistrictID in Users.

Response:

{

"success": true,

"data": [3]

}

Case 3:

No mapping records exist and the fallback does not return a DistrictID.

Response:

{

"success": true,

"data": []

}

The controller still returns HTTP 200 in Case 3.

Case 4:

The userId is invalid.

Response:

HTTP 400.

Database Behavior:

Table 1:

BranchExecutiveDistrictMapping

Query:

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserID = @UserID

Table 2:

Users

Fallback query:

SELECT DistrictID

FROM Users

WHERE Id = @UserID

AND Role = 'Branch Executives'

Operations:

SELECT only.

No INSERT, UPDATE, or DELETE is performed.

Success Response (200):

{

"success": true,

"data": [

1,

2,

5

]

}

Empty Success Response:

{

"success": true,

"data": []

}

Failure Responses:

400 Bad Request - Invalid User ID:

{

"success": false,

"message": "Invalid User ID."

}

401 Unauthorized:

Applicable when JwtSessionFilter rejects authentication.

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if JwtSessionFilter performs authorization checks.

No explicit role check is present in this controller.

{

"success": false,

"message": "Forbidden"

}

404 Not Found:

Not implemented.

If no districts are found, the controller returns 200 with an empty array.

409 Conflict:

Not applicable/not implemented.

500 Internal Server Error:

Returned when an unexpected/database exception occurs.

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK - District IDs successfully retrieved, including an empty list.

\* 400 Bad Request - Invalid User ID.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 404 Not Found - Not implemented.

\* 409 Conflict - Not applicable/not implemented.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

COMMON DTOS

===========

DTO Name:

BranchExecutiveVM

Namespace:

VP\_WebAPI.Models

Purpose:

Represents the data used for Branch Executive district assignment

and for loading the Executive and District selection lists.

The controller explicitly accesses the following properties:

\* Executives

\* Districts

\* SelectedUserId

\* SelectedDistrictIds

Only these properties can be confirmed from the supplied controller.

Any additional properties in the actual BranchExecutiveVM class are:

"Not specified in controller."

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Executives | List<System.Web.Mvc.SelectListItem> | No for POST; populated by GET | Initialized by GET | List of active Branch Executives returned by the GET assign-districts endpoint. |

| Districts | List<System.Web.Mvc.SelectListItem> | No for POST; populated by GET | Initialized by GET | List of districts returned by the GET assign-districts endpoint. |

| SelectedUserId | int | Yes for POST | No | Branch Executive User ID whose district mappings are being replaced. Must be greater than 0. |

| SelectedDistrictIds | List<int> | Yes for POST | Conditionally nullable | District IDs to assign. Must not be null or empty for the POST endpoint. |

Important:

The controller does not validate or use Executives or Districts from the

incoming POST request.

The POST action only uses:

\* model.SelectedUserId

\* model.SelectedDistrictIds

The GET action creates and populates:

\* model.Executives

\* model.Districts

No DTO property is automatically populated from JWT claims by the

controller.

---------------------------------------------------------

COMMON DTO: System.Web.Mvc.SelectListItem

---------------------------------------------------------

Purpose:

Used by BranchExecutiveVM to represent dropdown options for Branch

Executives and Districts.

Properties actually populated by the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Value | string | No | Potentially nullable at model level | ID value represented as a string. |

| Text | string | No | Potentially nullable at model level | Display name represented as a string. |

Important:

The controller uses the ASP.NET MVC SelectListItem type even though this

is an ASP.NET Web API controller.

For Executives:

Value:

Users.Id.ToString()

Text:

Users.Name.ToString()

For Districts:

Value:

DistrictMaster.DistrictID.ToString()

Text:

DistrictMaster.DistrictName.ToString()

=========================================================

COMPLETE REQUEST EXAMPLES

=========================================================

GET Assign Districts:

GET /api/branch-executive-district-mapping/assign-districts

Authorization:

Bearer <JWT\_TOKEN>

Request Body:

None.

POST Assign Districts:

POST /api/branch-executive-district-mapping/assign-districts

Authorization:

Bearer <JWT\_TOKEN>

Content-Type:

application/json

Request:

{

"SelectedUserId": 7027,

"SelectedDistrictIds": [

1,

2,

5

]

}

GET Assigned Districts:

GET /api/branch-executive-district-mapping/assigned-districts/7027

Authorization:

Bearer <JWT\_TOKEN>

Request Body:

None.

=========================================================

COMPLETE RESPONSE EXAMPLES

=========================================================

GET Assign Districts:

{

"success": true,

"data": {

"Executives": [

{

"Value": "7027",

"Text": "Branch Executive 1"

},

{

"Value": "7028",

"Text": "Branch Executive 2"

}

],

"Districts": [

{

"Value": "1",

"Text": "Dharwad"

},

{

"Value": "2",

"Text": "Hubballi"

}

]

}

}

POST Assign Districts:

{

"success": true,

"message": "Assigned Districts successfully!"

}

GET Assigned Districts:

{

"success": true,

"data": [

1,

2,

5

]

}

=========================================================

DATABASE CONTRACT

=========================================================

1. Users

Columns explicitly referenced:

| Column | Usage |

|--------|-------|

| Id | Executive identifier and fallback User ID lookup. |

| Name | Executive dropdown display text. |

| Role | Filters Branch Executives and fallback lookup. |

| Status | Filters active Branch Executives in GET assign-districts. |

| DistrictID | Fallback district ID in GET assigned-districts. |

Users query for Executive dropdown:

SELECT Id, Name

FROM Users

WHERE Role = 'Branch Executives'

AND Status = 1

Users fallback query:

SELECT DistrictID

FROM Users

WHERE Id = @UserID

AND Role = 'Branch Executives'

2. DistrictMaster

Columns explicitly referenced:

| Column | Usage |

|--------|-------|

| DistrictID | District dropdown value. |

| DistrictName | District dropdown display text. |

Query:

SELECT DistrictID, DistrictName

FROM DistrictMaster

3. BranchExecutiveDistrictMapping

Columns explicitly referenced:

| Column | Usage |

|--------|-------|

| UserId/UserID | Identifies the Branch Executive. |

| DistrictID | Identifies the assigned district. |

Existing mapping query:

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserID = @UserID

Delete query:

DELETE FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

Insert query:

INSERT INTO BranchExecutiveDistrictMapping

(

UserId,

DistrictID

)

VALUES

(

@UserId,

@DistrictID

)

=========================================================

BUSINESS RULE SUMMARY

=========================================================

Branch Executive Definition:

For the GET assign-districts endpoint, a Branch Executive is selected

from Users where:

Role = 'Branch Executives'

AND Status = 1

District Assignment:

A Branch Executive can have one or more district IDs.

The POST assignment operation completely replaces the user's existing

district mappings.

Existing mappings:

Deleted first.

New mappings:

Inserted afterward.

Invalid District IDs:

District IDs <= 0 are silently skipped during insertion.

Example:

Request:

{

"SelectedUserId": 7027,

"SelectedDistrictIds": [

1,

0,

-5,

2

]

}

Only district IDs 1 and 2 are inserted.

No 400 response is generated for 0 or negative district IDs.

Empty District List:

An empty SelectedDistrictIds list is rejected before the database

operation begins.

Null District List:

A null SelectedDistrictIds list is rejected.

User ID:

SelectedUserId must be greater than 0.

GET assigned-districts userId:

Must be greater than 0.

Fallback District:

If no BranchExecutiveDistrictMapping records exist, the API attempts

to obtain DistrictID from Users for a Branch Executive.

No Mapping:

If no mapping and no fallback DistrictID exist, the endpoint returns:

{

"success": true,

"data": []

}

Active Status:

The executive dropdown uses Status = 1.

The assigned-district fallback query does NOT check Status.

DistrictMaster:

No Status filtering is present in the supplied controller.

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filtering:

Not implemented.

User-specific JWT filtering:

Not implemented.

EmployeeID filtering:

Not implemented.

Role-based authorization:

Not explicitly implemented.

Duplicate mapping validation:

Not implemented.

Audit fields:

Not implemented.

CreatedBy:

Not implemented.

ModifiedBy:

Not implemented.

DeletedBy:

Not implemented.

Transactions:

Not implemented.

File Upload:

Not supported.

Multipart:

Not supported.

=========================================================

AUTHORIZATION SUMMARY

=========================================================

| Endpoint | HTTP Method | JWT Required | Existing Filter | Required Role |

|----------|-------------|--------------|-----------------|---------------|

| /api/branch-executive-district-mapping/assign-districts | GET | Yes | [JwtSessionFilter] action-level | Not specified |

| /api/branch-executive-district-mapping/assign-districts | POST | Yes | [JwtSessionFilter] action-level | Not specified |

| /api/branch-executive-district-mapping/assigned-districts/{userId} | GET | Yes | [JwtSessionFilter] action-level | Not specified |

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | Not specified | Not specified | Not directly accessed by controller. |

| EmployeeID | Not specified | Not specified | Not directly accessed by controller. |

| Role | Not specified | Not specified | Not directly accessed from JWT. |

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Important Distinction:

The controller contains a database condition:

Role = 'Branch Executives'

This determines which users appear in the executive dropdown and which

user is accepted by the fallback Users query.

It does NOT establish that the authenticated JWT user must have the

Branch Executives role.

No [Authorize(Roles = "...")] or equivalent role authorization is

present in the supplied controller.

Actual JWT behavior beyond the presence of [JwtSessionFilter] depends

on the implementation of JwtSessionFilter, which is not included here.

=========================================================

ERROR RESPONSE STANDARD

=========================================================

Common controller-generated error structure:

{

"success": false,

"message": "Error message"

}

Explicit error messages in the controller:

1. GET assigned-districts:

"Invalid User ID."

2. POST assign-districts:

"Request body is required."

3. POST assign-districts:

"Valid Branch Executive User ID is required."

4. POST assign-districts:

"At least one district must be selected."

5. Database/unexpected exception:

The actual exception message is returned through:

ex.Message

Therefore, in production environments, exposing raw exception messages

may reveal implementation/database information and should be reviewed

from a security perspective.

=========================================================

FINAL QUALITY CHECK

=========================================================

ALL CONTROLLER ENDPOINTS:

3 of 3 included.

Endpoint 1:

GET /api/branch-executive-district-mapping/assign-districts

Included.

Endpoint 2:

POST /api/branch-executive-district-mapping/assign-districts

Included.

Endpoint 3:

GET /api/branch-executive-district-mapping/assigned-districts/{userId}

Included.

HTTP methods:

Verified.

Route prefix:

Verified.

JWT:

Applied at action level exactly as present in the controller.

Controller-level JWT:

Not added.

Public endpoints:

None identified because every supplied action contains

[JwtSessionFilter].

Roles:

No explicit authorization roles identified.

JWT claims:

No JWT claims directly accessed by controller.

Session:

No Session values directly accessed by controller.

Path parameters:

userId documented.

Query parameters:

None.

Request body:

BranchExecutiveVM documented.

Request fields:

SelectedUserId documented.

SelectedDistrictIds documented.

Dropdown data:

Executives and Districts documented.

Dropdown filtering:

Executives -> Role = 'Branch Executives' and Status = 1.

Districts -> No filtering.

Default dropdown option:

None added by controller.

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

File upload:

None.

Multipart:

None.

Required fields:

SelectedUserId > 0.

SelectedDistrictIds non-null and non-empty.

Conditional behavior:

GET assigned-districts uses a mapping-table-first lookup followed by a

Users-table fallback.

Soft delete:

No.

Hard delete:

Old district mappings are physically deleted.

Status defaults:

No general default status is set by these endpoints.

Transactions:

No explicit transaction.

Duplicate checks:

None.

Database tables:

Users.

DistrictMaster.

BranchExecutiveDistrictMapping.

DTOs:

BranchExecutiveVM.

System.Web.Mvc.SelectListItem.

No additional DTOs, properties, JWT claims, roles, or business rules

have been invented where they are not visible in the supplied controller.