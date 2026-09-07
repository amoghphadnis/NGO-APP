=========================================================

SEMI PROFESSIONAL COURSES API CONTRACT

=========================================================

API Name:

Semi Professional Courses API

API Base Route:

/api/semi-professional-courses

Controller:

VP\_SemiProfessionalCoursesApIController

DTO:

SemiProfessionalCourseModel

Authentication Overview:

JWT authentication is applied at ACTION LEVEL through [JwtSessionFilter].

The supplied controller places [JwtSessionFilter] on every endpoint in this controller.

Therefore, based strictly on the supplied controller code:

\* GET /list → JWT Required

\* POST /create → JWT Required

\* DELETE /delete/{id} → JWT Required

\* GET /{id} → JWT Required

\* PUT /update → JWT Required

There is no public endpoint in this controller according to the supplied code.

Important:

The controller does not show any role checks, JWT claim extraction, UserID filtering, EmployeeID filtering, or explicit Session access. Therefore, no specific role or JWT claim is documented as required beyond whatever validation is internally performed by the existing JwtSessionFilter.

=========================================================

1. LIST SEMI PROFESSIONAL COURSES

==================================

Endpoint:

GET /api/semi-professional-courses/list

Purpose:

Retrieves all active Semi Professional Courses from the

SemiProfessionalCourses\_Master table.

Content-Type:

Not applicable.

Response Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Authentication is enforced by the action-level [JwtSessionFilter] attribute.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: Not specified in controller.

\* Session dependency: Not specified in controller.

\* UserID/EmployeeID filtering: Not implemented in this action.

\* Role-based filtering: Not implemented in this action.

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

\* No request body validation is required.

\* No query parameter validation is implemented.

\* Authentication is handled by [JwtSessionFilter].

\* Only records with Status = 1 are returned.

\* CourseId is converted to Int32 when reading from the database.

\* CourseName is converted to string.

\* No pagination is implemented.

\* No search parameter is implemented.

\* No sorting parameter is implemented.

\* No date filtering is implemented.

\* No UserID/EmployeeID filtering is implemented.

Business Logic Notes:

\* Reads from SemiProfessionalCourses\_Master.

\* Selects CourseId and CourseName.

\* Only active records are returned.

\* Active records are identified using:

Status = 1

\* The endpoint returns the total number of returned records through the count property.

\* No pagination is implemented.

\* No default page size exists.

\* No filtering based on the authenticated user is implemented.

\* No role-specific filtering is implemented.

Database Operation:

SELECT:

CourseId, CourseName

Table:

SemiProfessionalCourses\_Master

Filter:

Status = 1

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"CourseId": 1,

"CourseName": "Computer Applications"

},

{

"CourseId": 2,

"CourseName": "Medical Laboratory Technology"

}

]

}

Note:

The values above are illustrative examples of the response structure.

The controller does not define fixed course records.

Failure Responses:

401 Unauthorized:

Returned if the [JwtSessionFilter] rejects the request because authentication is missing or invalid.

Example:

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if the existing JwtSessionFilter performs authorization/role checks.

No explicit role check is present in this controller.

Example:

{

"success": false,

"message": "Forbidden"

}

500 Internal Server Error:

Returned when an unhandled exception occurs inside the try/catch block.

Actual response structure:

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK - Successful retrieval.

\* 401 Unauthorized - Authentication failure through JwtSessionFilter.

\* 403 Forbidden - Only if the existing JwtSessionFilter performs authorization checks.

\* 500 Internal Server Error - Exception while processing the request.

=========================================================

2. CREATE SEMI PROFESSIONAL COURSE

==================================

Endpoint:

POST /api/semi-professional-courses/create

Purpose:

Creates a new active Semi Professional Course in the

SemiProfessionalCourses\_Master table.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Authentication is enforced by the action-level [JwtSessionFilter] attribute.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* How claims are used: Not specified in controller.

\* Session dependency: Not specified in controller.

\* UserID/EmployeeID filtering: Not implemented.

\* CreatedBy/ModifiedBy from JWT: Not implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint has no path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

{

"CourseId": 0,

"CourseName": "Computer Applications"

}

Field Requiredness:

CourseName:

Required.

CourseId:

Not required for creation.

The controller does not read model.CourseId during INSERT.

The database is responsible for generating the ID if CourseId is an identity column.

Validation Rules:

\* Request body must be present.

\* If the request body is null, HTTP 400 is returned.

\* CourseName is required.

\* CourseName cannot be null, empty, or whitespace.

\* No explicit minimum length is specified.

\* No explicit maximum length is specified.

\* No duplicate CourseName validation is implemented.

\* No CourseId validation is performed during creation.

\* No role validation is implemented in the controller.

\* JWT authentication is enforced by [JwtSessionFilter].

\* Status is automatically set to 1.

\* No CreatedBy value is supplied.

\* No CreatedDate value is supplied.

\* No user identity is stored by this controller.

Database Operation:

INSERT INTO:

SemiProfessionalCourses\_Master

Inserted columns:

\* CourseName

\* Status

Values:

\* CourseName = model.CourseName

\* Status = 1

Business Logic Notes:

\* Every successfully created course is inserted with Status = 1.

\* Status is not taken from the request body.

\* The request's CourseId is ignored during INSERT.

\* The controller does not return the newly generated CourseId.

\* No transaction is explicitly created in the controller.

\* No duplicate check is performed.

\* Any database constraint or SQL exception is returned as HTTP 500.

Success Response (201):

{

"success": true,

"message": "Semi Professional Course created successfully."

}

Failure Responses:

400 Bad Request:

Occurs when the request body is missing.

{

"success": false,

"message": "Request body is required."

}

400 Bad Request:

Occurs when CourseName is missing, empty, or whitespace.

{

"success": false,

"message": "CourseName is required."

}

401 Unauthorized:

Occurs when [JwtSessionFilter] rejects an unauthenticated/invalid JWT request.

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if the existing JwtSessionFilter performs authorization checks.

No explicit role requirement is present in this controller.

{

"success": false,

"message": "Forbidden"

}

500 Internal Server Error:

Occurs when a database or other unexpected exception is thrown.

{

"success": false,

"message": "Error message"

}

409 Conflict:

Not explicitly implemented by the controller.

No duplicate-course conflict check is present.

Status Codes Used / Applicable:

\* 201 Created - Course created successfully.

\* 400 Bad Request - Missing request body or CourseName.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if enforced by JwtSessionFilter.

\* 409 Conflict - Not implemented.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

3. DELETE SEMI PROFESSIONAL COURSE

==================================

Endpoint:

DELETE /api/semi-professional-courses/delete/{id}

Purpose:

Soft-deletes a Semi Professional Course by changing its

Status from its current value to 0.

Content-Type:

Not applicable.

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Authentication is enforced by the action-level [JwtSessionFilter] attribute.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* UserID/EmployeeID usage: Not implemented.

\* Session dependency: Not specified.

\* Role-based authorization: Not explicitly implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | CourseId of the course to be soft-deleted. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, HTTP 400 is returned.

\* No additional business validation is performed.

\* No dependency validation is performed.

\* No explicit authorization role is checked.

\* JWT authentication is enforced by [JwtSessionFilter].

\* No hard DELETE SQL statement is used.

Database Operation:

UPDATE SemiProfessionalCourses\_Master

SET:

Status = 0

WHERE:

CourseId = @CourseId

Business Logic Notes:

\* This is a SOFT DELETE.

\* The database row is not physically deleted.

\* Status is changed to 0.

\* The List endpoint only returns Status = 1 records, so the deleted course will no longer appear in the active course list.

\* The controller does not check the current Status before performing the update.

\* The controller does not check foreign-key/dependency relationships before updating.

\* The controller does not require a separate delete confirmation value.

\* The controller does not record DeletedBy or DeletedDate.

\* No transaction is explicitly created.

Success Response (200):

{

"success": true,

"message": "Semi Professional Course deleted successfully."

}

Failure Responses:

400 Bad Request:

Occurs when id <= 0.

{

"success": false,

"message": "Invalid Course ID."

}

401 Unauthorized:

Occurs when [JwtSessionFilter] rejects authentication.

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if the existing JwtSessionFilter performs authorization checks.

{

"success": false,

"message": "Forbidden"

}

404 Not Found:

Occurs when ExecuteNonQuery() affects zero rows.

{

"success": false,

"message": "Semi Professional Course not found."

}

Important:

The controller treats rowsAffected == 0 as "not found".

The SQL itself only filters by CourseId and does not filter by Status.

500 Internal Server Error:

Occurs when an unexpected/database exception occurs.

{

"success": false,

"message": "Error message"

}

409 Conflict:

Not implemented.

Status Codes Used / Applicable:

\* 200 OK - Soft delete successful.

\* 400 Bad Request - Invalid Course ID.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 404 Not Found - No row was affected.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

4. GET SEMI PROFESSIONAL COURSE BY ID

==================================

Endpoint:

GET /api/semi-professional-courses/{id}

Purpose:

Retrieves one active Semi Professional Course by CourseId.

Content-Type:

Not applicable.

Response Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Authentication is enforced by the action-level [JwtSessionFilter] attribute.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* UserID/EmployeeID filtering: Not implemented.

\* Session dependency: Not specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | CourseId of the requested active course. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, HTTP 400 is returned.

\* Only Status = 1 records are returned.

\* No UserID/EmployeeID filtering is implemented.

\* No role-specific validation is implemented.

\* JWT authentication is enforced by [JwtSessionFilter].

Database Operation:

SELECT:

CourseId, CourseName

FROM:

SemiProfessionalCourses\_Master

WHERE:

CourseId = @CourseId

AND Status = 1

Business Logic Notes:

\* Only active courses can be retrieved.

\* A course with Status = 0 is treated as not found.

\* The controller returns a single SemiProfessionalCourseModel.

\* No pagination applies.

\* No search or sorting parameters apply.

Success Response (200):

{

"success": true,

"data": {

"CourseId": 1,

"CourseName": "Computer Applications"

}

}

Failure Responses:

400 Bad Request:

Occurs when id <= 0.

{

"success": false,

"message": "Invalid Course ID."

}

401 Unauthorized:

Occurs when [JwtSessionFilter] rejects authentication.

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if the existing JwtSessionFilter performs authorization checks.

{

"success": false,

"message": "Forbidden"

}

404 Not Found:

Occurs when no active course is found for the specified CourseId.

This includes cases where:

\* CourseId does not exist.

\* CourseId exists but Status is 0.

{

"success": false,

"message": "Semi Professional Course not found."

}

500 Internal Server Error:

Occurs when an unexpected/database exception occurs.

{

"success": false,

"message": "Error message"

}

409 Conflict:

Not applicable/not implemented.

Status Codes Used / Applicable:

\* 200 OK - Course found.

\* 400 Bad Request - Invalid Course ID.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 404 Not Found - Active course does not exist.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

5. UPDATE SEMI PROFESSIONAL COURSE

==================================

Endpoint:

PUT /api/semi-professional-courses/update

Purpose:

Updates the CourseName of an existing Semi Professional Course.

Content-Type:

application/json

Authorization:

\* JWT Required

\* Authorization format:

Bearer <JWT\_TOKEN>

\* Authentication is enforced by the action-level [JwtSessionFilter] attribute.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Attribute: [JwtSessionFilter]

\* Required Claims: Not specified in controller.

\* Required Roles: Not specified in controller.

\* UserID/EmployeeID usage: Not implemented.

\* Session dependency: Not specified.

\* CreatedBy/ModifiedBy: Not updated.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | CourseId is supplied in the JSON request body rather than the URL. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not accept query parameters. |

Request Body:

{

"CourseId": 1,

"CourseName": "Advanced Computer Applications"

}

Request Fields:

| Field | Type | Required | Nullable | Description |

|-------|------|----------|----------|-------------|

| CourseId | int | Yes | No | ID of the course to update. Must be greater than 0. |

| CourseName | string | Yes | No | New course name. Must not be null, empty, or whitespace. |

Validation Rules:

\* Request body must be present.

\* If model is null, HTTP 400 is returned.

\* CourseId must be greater than 0.

\* CourseName must not be null, empty, or whitespace.

\* No explicit minimum length is specified.

\* No explicit maximum length is specified.

\* No duplicate CourseName check is implemented.

\* No validation that the course is currently active is implemented.

\* No role-based validation is implemented.

\* JWT authentication is enforced by [JwtSessionFilter].

\* Status is not changed during update.

\* CourseId is used to identify the record.

\* Only CourseName is updated.

Database Operation:

UPDATE SemiProfessionalCourses\_Master

SET:

CourseName = @CourseName

WHERE:

CourseId = @CourseId

Fields NOT changed:

\* Status

\* CreatedBy

\* CreatedDate

\* ModifiedBy

\* ModifiedDate

Important:

The controller only explicitly updates CourseName.

Business Logic Notes:

\* The original course ID remains unchanged.

\* Status is deliberately not changed by this endpoint.

\* A course with Status = 0 can technically be updated because the SQL WHERE clause only checks CourseId.

\* The controller does not filter the update by Status = 1.

\* No duplicate-course validation is performed.

\* No audit information is populated.

\* No transaction is explicitly created.

\* The controller does not return the updated object.

Success Response (200):

{

"success": true,

"message": "Semi Professional Course updated successfully."

}

Failure Responses:

400 Bad Request:

When the request body is missing.

{

"success": false,

"message": "Request body is required."

}

400 Bad Request:

When CourseId is zero or negative.

{

"success": false,

"message": "Invalid Course ID."

}

400 Bad Request:

When CourseName is null, empty, or whitespace.

{

"success": false,

"message": "CourseName is required."

}

401 Unauthorized:

Occurs when [JwtSessionFilter] rejects authentication.

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if JwtSessionFilter performs authorization checks.

{

"success": false,

"message": "Forbidden"

}

404 Not Found:

Occurs when ExecuteNonQuery() affects zero rows.

{

"success": false,

"message": "Semi Professional Course not found."

}

Important:

The SQL update checks only CourseId. Therefore, rowsAffected == 0 means that no database row matched the supplied CourseId.

409 Conflict:

Not implemented because no duplicate-course conflict validation exists.

500 Internal Server Error:

Occurs when a database or unexpected exception occurs.

{

"success": false,

"message": "Error message"

}

Status Codes Used / Applicable:

\* 200 OK - Update successful.

\* 400 Bad Request - Missing body, invalid CourseId, or missing CourseName.

\* 401 Unauthorized - JWT authentication failure.

\* 403 Forbidden - Only if JwtSessionFilter performs authorization checks.

\* 404 Not Found - CourseId did not match a database row.

\* 409 Conflict - Not implemented.

\* 500 Internal Server Error - Unexpected/database exception.

=========================================================

COMMON DTOs

=========================================================

DTO Name:

SemiProfessionalCourseModel

Purpose:

Represents a Semi Professional Course and is used by the

create, update, list, and get-by-ID operations.

Namespace:

VP\_WebAPI.Models

Properties visible from the controller:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| CourseId | int | Conditional | No | Course identifier. Required for update and returned by GET/list. It is not used during create. |

| CourseName | string | Yes for Create/Update | Potentially nullable at model level, but validated by controller for Create/Update | Name of the Semi Professional Course. |

Important DTO Requiredness:

CourseId:

\* Create: Not required by controller.

\* Update: Required and must be greater than 0.

\* Get/List response: Returned by the API.

\* Delete: Supplied as the URL path parameter rather than as a DTO field.

CourseName:

\* Create: Required.

\* Update: Required.

\* List response: Returned.

\* Get-by-ID response: Returned.

No other properties of SemiProfessionalCourseModel are visible or used by this controller.

Therefore, additional properties, if present in the actual model class, are:

"Not specified in controller."

Sample Create Request:

{

"CourseName": "Computer Applications"

}

Sample Update Request:

{

"CourseId": 1,

"CourseName": "Advanced Computer Applications"

}

Sample List Response:

{

"success": true,

"count": 2,

"data": [

{

"CourseId": 1,

"CourseName": "Computer Applications"

},

{

"CourseId": 2,

"CourseName": "Medical Laboratory Technology"

}

]

}

Sample Get-by-ID Response:

{

"success": true,

"data": {

"CourseId": 1,

"CourseName": "Computer Applications"

}

}

=========================================================

DATABASE CONTRACT

=========================================================

Database Table:

SemiProfessionalCourses\_Master

Columns explicitly referenced by the controller:

| Column | Usage | Details |

|--------|-------|---------|

| CourseId | SELECT/UPDATE filter | Used as the course identifier. |

| CourseName | SELECT/INSERT/UPDATE | Course name. |

| Status | SELECT/INSERT/UPDATE | 1 = active for list/get; 1 is assigned during create; 0 is assigned during soft delete. |

Database Operations:

1. LIST

SELECT CourseId, CourseName

FROM SemiProfessionalCourses\_Master

WHERE Status = 1

2. CREATE

INSERT INTO SemiProfessionalCourses\_Master

(

CourseName,

Status

)

VALUES

(

@CourseName,

@Status

)

Status is set to 1.

3. DELETE

UPDATE SemiProfessionalCourses\_Master

SET Status = 0

WHERE CourseId = @CourseId

This is a soft delete.

4. GET BY ID

SELECT CourseId, CourseName

FROM SemiProfessionalCourses\_Master

WHERE CourseId = @CourseId

AND Status = 1

5. UPDATE

UPDATE SemiProfessionalCourses\_Master

SET CourseName = @CourseName

WHERE CourseId = @CourseId

Status is not changed by the update endpoint.

=========================================================

AUTHENTICATION AND AUTHORIZATION SUMMARY

=========================================================

Controller-level authentication:

No controller-level [JwtSessionFilter] attribute is present.

Action-level authentication:

All five actions individually contain [JwtSessionFilter].

| Endpoint | JWT Required | Filter Scope | Required Role | JWT Claims Used in Controller |

|----------|--------------|--------------|---------------|-------------------------------|

| GET /list | Yes | Action-level | Not specified | None explicitly accessed |

| POST /create | Yes | Action-level | Not specified | None explicitly accessed |

| DELETE /delete/{id} | Yes | Action-level | Not specified | None explicitly accessed |

| GET /{id} | Yes | Action-level | Not specified | None explicitly accessed |

| PUT /update | Yes | Action-level | Not specified | None explicitly accessed |

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | Not specified | Not specified | Not accessed by this controller. |

| EmployeeID | Not specified | Not specified | Not accessed by this controller. |

| Role | Not specified | Not specified | No role check exists in this controller. |

Important Authorization Note:

The supplied controller only proves that [JwtSessionFilter] is attached to each action.

The actual implementation of JwtSessionFilter was not supplied.

Therefore:

\* The exact JWT claim names are not specified.

\* The JWT token signing/validation rules are not specified.

\* Token expiration behavior is not specified.

\* Required roles are not specified.

\* Whether the filter creates Session values is not specified.

\* Whether the filter returns 401 or 403 under particular conditions is not specified.

These details must be taken from the actual JwtSessionFilter implementation before adding more specific authorization requirements.

=========================================================

GLOBAL API BEHAVIOR SUMMARY

=========================================================

Total Endpoints:

5

Endpoints:

1. GET /api/semi-professional-courses/list

2. POST /api/semi-professional-courses/create

3. DELETE /api/semi-professional-courses/delete/{id}

4. GET /api/semi-professional-courses/{id}

5. PUT /api/semi-professional-courses/update

Authentication:

JWT is required for all five endpoints because [JwtSessionFilter]

is explicitly applied to each action.

Public Endpoints:

None identified in the supplied controller.

Role-Based Authorization:

No explicit role checks are present.

User-Specific Filtering:

Not implemented.

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date Filtering:

Not implemented.

File Upload:

Not implemented.

Multipart/Form Data:

Not implemented.

Dropdown Endpoint:

There is no dedicated dropdown endpoint in this controller.

The GET /list endpoint can provide active courses for a dropdown,

but it is not explicitly implemented or named as a dropdown API.

Default Values:

Create:

Status = 1

Delete:

Status = 0

Update:

Status is unchanged.

List:

Only Status = 1 records are returned.

Get By ID:

Only Status = 1 records are returned.

Soft Delete:

Yes.

Hard Delete:

No.

Transactions:

No explicit transaction is implemented.

Duplicate Validation:

Not implemented.

Foreign-Key/Dependency Validation:

Not implemented.

Audit Fields:

No CreatedBy, ModifiedBy, DeletedBy, CreatedDate, ModifiedDate,

or DeletedDate logic is visible in the controller.

Pagination Metadata:

Only the List endpoint returns:

count = number of records returned.

No total database count, page number, page size, or pagination metadata is returned.

=========================================================

ERROR RESPONSE STANDARD

=========================================================

The controller uses the following explicit application error structure:

{

"success": false,

"message": "Error message"

}

For successful operations, the structure depends on the endpoint.

List:

{

"success": true,

"count": 0,

"data": []

}

Get By ID:

{

"success": true,

"data": {

"CourseId": 1,

"CourseName": "Example Course"

}

}

Create:

{

"success": true,

"message": "Semi Professional Course created successfully."

}

Update:

{

"success": true,

"message": "Semi Professional Course updated successfully."

}

Delete:

{

"success": true,

"message": "Semi Professional Course deleted successfully."

}

=========================================================

FINAL CONTRACT VERIFICATION

=========================================================

Controller endpoints verified:

YES - All 5 endpoints are included.

HTTP methods verified:

YES.

Route prefix verified:

YES.

Action routes verified:

YES.

JWT requirements verified:

YES.

Controller-level JWT filter:

NO.

Action-level JWT filters:

YES - All 5 actions contain [JwtSessionFilter].

Public endpoints:

None according to the supplied controller.

Role requirements:

Not specified; no role checks are present.

JWT claims:

No claims are directly accessed by the controller.

Session dependency:

Not specified in the supplied controller.

Path parameters:

id documented for DELETE and GET by ID.

Query parameters:

None.

Request body:

Documented for CREATE and UPDATE.

Multipart/form-data:

Not used.

File uploads:

None.

Required fields:

CourseName required for CREATE and UPDATE.

CourseId > 0 required for UPDATE.

Delete/Get ID > 0 required.

Default values:

Create Status = 1.

Delete Status = 0.

Soft delete:

Yes.

Hard delete:

No.

Active filtering:

List and Get By ID use Status = 1.

Update status behavior:

Status is not changed.

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

User filtering:

Not implemented.

Duplicate checks:

Not implemented.

Database table:

SemiProfessionalCourses\_Master.

DTO:

SemiProfessionalCourseModel.

No fields or JWT claims beyond those visible in the supplied controller have been invented.

Where the controller does not provide information, the contract explicitly states:

"Not specified in controller."