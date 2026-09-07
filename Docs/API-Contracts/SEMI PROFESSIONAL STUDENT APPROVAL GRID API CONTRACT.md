=========================================================

API CONTRACT

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/semi-professional-student-approval

Controller:

VP\_SemiProfessionalStudentApprovalGridApiController

Description:

This API provides student approval/rejection, soft deletion, and imported-student approval/rejection operations for Semi Professional student applications.

Authentication:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute.

Important:

All endpoints in this supplied controller currently have [JwtSessionFilter].

Therefore, based strictly on the supplied controller code, JWT authentication is REQUIRED for every endpoint documented below.

The controller does not contain any public endpoint.

The controller also uses ASP.NET Session values:

- UserRole

- UserID

These values are read through HttpContext.Current.Session. The supplied controller does not itself show the code that populates these Session values. Therefore, it is assumed that JwtSessionFilter or another authentication/session mechanism populates Session from the authenticated JWT. The exact JWT claim-to-Session mapping is NOT specified in this controller.

=========================================================

1. LIST SEMI PROFESSIONAL STUDENTS

==================================

Endpoint:

GET /api/semi-professional-student-approval/list

Purpose:

Returns active Semi Professional student applications from NewSemiProfessionalApplication.

The endpoint also applies district-based filtering when the authenticated user's role is "Branch Executives".

Content-Type:

Not applicable for GET request.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No single role is required for basic access according to the controller.

\* Special role behavior:

If UserRole = "Branch Executives", the result is restricted to districts assigned to the authenticated UserID.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

The controller does not directly read JWT claims.

\* Session values required:

- UserRole

- UserID

\* How identity is used:

UserRole determines whether district filtering is applied.

UserID is used as the parameter for BranchExecutiveDistrictMapping.

\* JWT-to-Session mapping:

The controller expects authentication/session infrastructure to populate:

- Session["UserRole"]

- Session["UserID"]

Exact claim names and mapping are not specified in the controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | The endpoint does not define query-string parameters. |

Request Body:

None.

Validation Rules:

\* No request body validation is required.

\* No ID validation is required because there are no request IDs.

\* Authentication is enforced by [JwtSessionFilter].

\* The controller attempts to read UserRole and UserID from Session.

\* If Session is unavailable, GetSessionValue returns null and GetSessionInt returns 0.

\* The controller does not explicitly return 401/403 when UserRole or UserID is missing.

\* No pagination is implemented.

\* No search parameter is implemented.

\* No sorting parameter is implemented.

\* No date filtering is implemented.

\* No duplicate validation is implemented.

Business Logic Notes:

1. Only records where:

np.Status = 1

are returned.

2. If:

UserRole = "Branch Executives"

comparison is case-insensitive, then only applications whose DistrictID belongs to a district mapped to the authenticated UserID are returned.

3. Branch Executive district filtering is implemented using:

BranchExecutiveDistrictMapping

4. The district filter is:

np.DistrictID IN

(

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

)

5. For non-Branch-Executive roles, no UserID-based district filter is applied.

6. The controller does not explicitly restrict the endpoint to Admin or any other named role.

7. No pagination is present.

8. No explicit default sorting is present.

9. No explicit status default is set.

10. Database operation:

SELECT only.

11. Tables referenced:

- NewSemiProfessionalApplication

- DistrictMaster

- GenderMaster

- CasteCategoryMaster

- AreaTypeMaster

- FatherOccupationMaster

- MotherOccupationMaster

- HouseTypeMaster

- BranchExecutiveDistrictMapping

12. LEFT JOIN is used for master-table information.

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ApplicationID": 25,

"StudentName": "Rahul Kumar",

"Email": "rahul@example.com",

"DOB": "2007-05-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Dharwad, Karnataka",

"GoogleMapLink": "https://maps.google.com/example",

"AreaTypeID": 1,

"DistrictID": 5,

"GenderID": 1,

"CasteCategoryID": 2,

"FatherOccupationID": 3,

"MotherOccupationID": 4,

"HouseTypeID": 1,

"DistrictName": "Dharwad",

"OtherDistrict": null,

"GenderName": "Male",

"CategoryName": "Category Example",

"AreaTypeName": "Urban",

"FatherName": "Ramesh Kumar",

"MotherName": "Sunitha Kumar",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyMembers": 5,

"HouseTypeName": "Own House",

"MonthlyRent": 0.0,

"FamilyIncome": 150000.0,

"PUPercentage": 82.5,

"CETRank": "12500",

"PTRank": "250",

"CourseApplying": "B.E.",

"CourseStream": "Computer Science",

"StudentSelfiePath": "/uploads/selfie.jpg",

"CETRankSheetPath": "/uploads/cet.pdf",

"PTRankSheetPath": "/uploads/ptrank.pdf",

"DwellingUnitPhotoPath": "/uploads/house.jpg",

"MarksSheet12Path": "/uploads/marksheet.pdf",

"HouseVideoPath": "/uploads/house.mp4",

"ElectricityBillPath": "/uploads/electricity.pdf",

"IncomeCertificatePath": "/uploads/income.pdf",

"RationCardPath": "/uploads/ration.pdf",

"Status": true,

"ApproveStatus": "Approved",

"Remark": "Verified",

"CreatedDate": "2026-08-20T10:30:00"

}

]

}

Response Structure:

| Property | Type | Description |

|----------|------|-------------|

| success | boolean | Indicates successful operation. |

| count | integer | Number of records returned. |

| data | array | Array of NewSemiProfessionalApplicationDto objects. |

Failure Responses:

400 Bad Request:

Not explicitly returned by this endpoint.

401 Unauthorized:

Applicable when [JwtSessionFilter] rejects the request because authentication is missing or invalid.

Example:

{

"success": false,

"message": "Unauthorized"

}

403 Forbidden:

Potentially applicable if JwtSessionFilter performs role/permission rejection. The controller itself does not explicitly return 403.

404 Not Found:

Not explicitly returned by this endpoint. An empty result is returned as HTTP 200 with count = 0.

409 Conflict:

Not used by this endpoint.

500 Internal Server Error:

Returned when an unhandled exception occurs in the try/catch.

The controller returns:

InternalServerError(ex)

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

\* 401/403 may be generated by the existing JwtSessionFilter/authentication pipeline.

=========================================================

2. APPROVE SEMI PROFESSIONAL STUDENT

==================================

Endpoint:

POST /api/semi-professional-student-approval/approve/{id}

Purpose:

Updates the approval status of a Semi Professional student application to "Approved" and optionally stores remarks.

Content-Type:

No request body is required.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

Not directly read by the action.

\* Session values:

Not used by Approve() itself.

\* Role:

No explicit role check is performed in this action.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the student application to approve. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| remarks | string | No | Optional approval remark. Defaults to an empty string. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, the controller returns 400 Bad Request with:

"Invalid Application ID."

\* remarks is optional.

\* Null remarks are converted to an empty string.

\* No maximum remarks length is enforced by controller code.

\* No explicit role validation is implemented.

\* No duplicate approval validation is implemented.

\* No check is made that the current ApproveStatus is pending.

\* No check is made that Status = 1 before approval.

\* No JWT claim is directly used by this action.

Business Logic Notes:

1. Approve() calls:

SetApprovalStatus(id, "Approved", remarks)

2. Database operation:

UPDATE NewSemiProfessionalApplication

3. Fields updated:

- ApproveStatus = "Approved"

- Remark = supplied remarks or ""

4. The record is identified by:

ApplicationID = id

5. The controller does not update Status.

6. The controller does not record ModifiedBy/UserID.

7. The controller does not record ModifiedDate.

8. There is no transaction explicitly implemented.

Success Response (200):

{

"success": true,

"message": "Student approved successfully.",

"ApplicationID": 25,

"ApproveStatus": "Approved",

"Remark": "Documents verified."

}

Failure Responses:

400 Bad Request:

When id <= 0.

Example:

{

"message": "Invalid Application ID."

}

401 Unauthorized:

Generated by authentication/filter infrastructure when JWT authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter if the filter implements authorization restrictions. No explicit 403 is returned by the action.

404 Not Found:

Returned when the UPDATE affects zero rows.

500 Internal Server Error:

Returned when an exception occurs during database processing.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

3. REJECT SEMI PROFESSIONAL STUDENT

==================================

Endpoint:

POST /api/semi-professional-student-approval/reject/{id}

Purpose:

Updates the approval status of a Semi Professional student application to "Rejected" and optionally stores remarks.

Content-Type:

No request body is required.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No explicit role restriction is implemented in this action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

Not directly read by the action.

\* Session values:

Not used by Reject() itself.

\* Role:

No explicit role check is implemented.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the student application to reject. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| remarks | string | No | Optional rejection remark. Defaults to an empty string. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, returns 400 Bad Request.

\* remarks is optional.

\* Null remarks are converted to an empty string.

\* No explicit maximum remarks length is enforced.

\* No explicit role validation is present.

\* No duplicate/status-transition validation is present.

Business Logic Notes:

1. Reject() calls:

SetApprovalStatus(id, "Rejected", remarks)

2. Database operation:

UPDATE NewSemiProfessionalApplication

3. Fields updated:

- ApproveStatus = "Rejected"

- Remark = supplied remarks or ""

4. No Status change occurs.

5. No ModifiedBy/UserID is stored.

6. No ModifiedDate is stored.

Success Response (200):

{

"success": true,

"message": "Student rejected successfully.",

"ApplicationID": 25,

"ApproveStatus": "Rejected",

"Remark": "Required documents are incomplete."

}

Failure Responses:

400 Bad Request:

{

"message": "Invalid Application ID."

}

401 Unauthorized:

Generated by JwtSessionFilter/authentication infrastructure when JWT authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter if applicable. No explicit 403 is returned by the action.

404 Not Found:

Returned if no database row is updated.

500 Internal Server Error:

Returned on an exception.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

4. DELETE SEMI PROFESSIONAL STUDENT

==================================

Endpoint:

POST /api/semi-professional-student-approval/delete/{id}

Purpose:

Soft-deletes/deactivates a Semi Professional student application by changing its Status from its current value to 0.

This is NOT a physical database DELETE.

Content-Type:

No request body is required.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No explicit role restriction is implemented in the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

Not directly read by the action.

\* Session values:

Not used by Delete() itself.

\* Required Role:

Not explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ApplicationID of the student application to soft-delete. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are defined. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, returns 400 Bad Request.

\* No explicit role validation is present.

\* No dependency check is implemented.

\* No confirmation parameter is required.

\* No hard-delete operation is performed.

Business Logic Notes:

1. The endpoint performs a soft delete.

2. SQL:

UPDATE NewSemiProfessionalApplication

SET Status = 0

WHERE ApplicationID = @ApplicationID

3. The actual database record remains in the table.

4. Future List() requests exclude the record because List() contains:

WHERE np.Status = 1

5. ApproveStatus is not changed.

6. Remark is not changed.

7. No DeletedBy/UserID is stored.

8. No DeletedDate is stored.

9. No transaction is explicitly implemented.

Success Response (200):

{

"success": true,

"message": "New Semi Professional Student deleted successfully.",

"ApplicationID": 25

}

Failure Responses:

400 Bad Request:

{

"message": "Invalid Application ID."

}

401 Unauthorized:

Generated by JwtSessionFilter when authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter. No explicit 403 is returned by the action.

404 Not Found:

Returned when no row is affected by the UPDATE.

500 Internal Server Error:

Returned when an exception occurs.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

5. LIST IMPORTED SEMI PROFESSIONAL STUDENTS

==================================

Endpoint:

GET /api/semi-professional-student-approval/import-grid

Purpose:

Returns records imported into GoogleSheet\_SemiProfessional.

For authenticated Branch Executives, records are filtered by the districts assigned to their UserID.

Content-Type:

Not applicable for GET request.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No single role is required for access.

\* Special role:

Branch Executives receive district-restricted results.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

The controller does not directly read JWT claims.

\* Session values:

- UserRole

- UserID

\* How identity is used:

UserRole determines whether the Branch Executive district restriction is applied.

UserID is used to find mapped districts.

\* JWT-to-Session mapping:

Not implemented visibly in this controller. It must be supplied by the authentication/session infrastructure.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are defined. |

Request Body:

None.

Validation Rules:

\* No request body validation.

\* No pagination.

\* No search.

\* No sorting.

\* No date filtering.

\* No explicit role rejection.

\* Authentication is handled through [JwtSessionFilter].

\* UserRole and UserID are obtained from Session.

\* No explicit validation occurs if UserID cannot be parsed; GetSessionInt returns 0.

Business Logic Notes:

1. Source table:

GoogleSheet\_SemiProfessional

2. Base condition:

WHERE 1 = 1

3. If UserRole equals "Branch Executives" case-insensitively, the query adds an EXISTS condition.

4. The Branch Executive is restricted by district using:

BranchExecutiveDistrictMapping

INNER JOIN DistrictMaster

5. District matching is performed using trimmed district names:

LTRIM(RTRIM(dm.DistrictName)) =

LTRIM(RTRIM(gp.District))

6. For non-Branch-Executive roles, no district filtering is added.

7. This endpoint performs SELECT only.

8. No modification is performed.

9. No pagination or sorting is implemented.

10. Database tables referenced:

- GoogleSheet\_SemiProfessional

- BranchExecutiveDistrictMapping

- DistrictMaster

Success Response (200):

{

"success": true,

"count": 1,

"data": [

{

"ImportID": 25,

"Timestamp": "2026-08-20 10:30:00",

"EmailAddress": "rahul@example.com",

"StudentName": "Rahul Kumar",

"DateOfBirth": "2007-05-15",

"ResidentialAddress": "Dharwad, Karnataka",

"HomeAddressGoogleMapLink": "https://maps.google.com/example",

"Place": "Dharwad",

"District": "Dharwad",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Gender": "Male",

"CasteCategory": "Category Example",

"FatherName": "Ramesh Kumar",

"MotherName": "Sunitha Kumar",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"TotalFamilyMembers": "5",

"HouseType": "Own House",

"MonthlyRent": "0",

"FamilyIncomeMonthly": "150000",

"SecuredPercentage12th": "82.5",

"CETRank": "12500",

"PracticalTestRank": "250",

"CourseApplying": "B.E.",

"CourseStream": "Computer Science",

"StudentSelfiePath": "/uploads/selfie.jpg",

"CETRankSheetPath": "/uploads/cet.pdf",

"DwellingUnitPhotographPath": "/uploads/house.jpg",

"MarksSheet12thPath": "/uploads/marksheet.pdf",

"HouseVideoPath": "/uploads/house.mp4",

"ElectricityBillPath": "/uploads/electricity.pdf",

"IncomeCertificatePath": "/uploads/income.pdf",

"RationCardPath": "/uploads/ration.pdf",

"ImportedDate": "2026-08-20T10:30:00",

"Approve": "Approved",

"Remarks": "Verified"

}

]

}

Failure Responses:

400 Bad Request:

Not explicitly returned.

401 Unauthorized:

Generated by JwtSessionFilter if authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter. No explicit 403 is returned in the controller.

404 Not Found:

Not returned for an empty result. Empty result returns HTTP 200 with count = 0.

409 Conflict:

Not used.

500 Internal Server Error:

Returned when an exception occurs.

Status Codes Used:

\* 200 OK

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

6. APPROVE IMPORTED STUDENT

==================================

Endpoint:

POST /api/semi-professional-student-approval/import/approve/{id}

Purpose:

Updates the approval state of an imported Semi Professional student record in GoogleSheet\_SemiProfessional to "Approved".

Optional remarks may be supplied through the query string.

Content-Type:

No request body is required.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No explicit role restriction is implemented in the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

Not directly read by the action.

\* Session values:

Not used by ApproveImported() itself.

\* Required Role:

Not explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| remarks | string | No | Optional approval remarks. Defaults to an empty string. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, returns 400 Bad Request.

\* remarks is optional.

\* If remarks is null/empty/whitespace, database Remarks is stored as NULL.

\* No explicit maximum length is enforced by controller code.

\* No explicit role validation is performed.

\* No duplicate/status-transition validation is performed.

Business Logic Notes:

1. ApproveImported() calls:

SetImportStatus(id, "Approved", remarks)

2. Database operation:

UPDATE GoogleSheet\_SemiProfessional

3. Fields updated:

- Approve = "Approved"

- Remarks = supplied remarks or NULL when blank/whitespace

4. The record is identified by ImportID.

5. No ImportedDate modification occurs.

6. No UserID/ModifiedBy is stored.

7. No transaction is explicitly implemented.

Success Response (200):

{

"success": true,

"message": "Imported student approved successfully.",

"ImportID": 25,

"Approve": "Approved",

"Remarks": "Documents verified."

}

Failure Responses:

400 Bad Request:

{

"message": "Invalid Import ID."

}

401 Unauthorized:

Generated by JwtSessionFilter if JWT authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter. No explicit 403 is returned by this action.

404 Not Found:

Returned when the UPDATE affects zero rows.

500 Internal Server Error:

Returned for an exception.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

7. REJECT IMPORTED STUDENT

==================================

Endpoint:

POST /api/semi-professional-student-approval/import/reject/{id}

Purpose:

Updates the approval state of an imported Semi Professional student record in GoogleSheet\_SemiProfessional to "Rejected".

Optional remarks may be supplied through the query string.

Content-Type:

No request body is required.

Authorization:

\* JWT Required

\* Authorization Header:

Bearer <JWT\_TOKEN>

\* Existing authorization mechanism:

[JwtSessionFilter]

\* Filter Scope:

Action-level

\* Required Role:

No explicit role restriction is implemented in the action.

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level [JwtSessionFilter]

\* Required Claims:

Not directly read by the action.

\* Session values:

Not used by RejectImported() itself.

\* Required Role:

Not explicitly specified.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | ImportID of the imported student. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| remarks | string | No | Optional rejection remarks. Defaults to an empty string at action level. |

Request Body:

None.

Validation Rules:

\* id must be greater than 0.

\* If id <= 0, returns 400 Bad Request.

\* remarks is optional.

\* Blank/whitespace remarks are stored as NULL in the database.

\* No explicit maximum length is enforced by controller code.

\* No explicit role validation is present.

\* No duplicate/status-transition validation is present.

Business Logic Notes:

1. RejectImported() calls:

SetImportStatus(id, "Rejected", remarks)

2. Database operation:

UPDATE GoogleSheet\_SemiProfessional

3. Fields updated:

- Approve = "Rejected"

- Remarks = supplied remarks or NULL when blank/whitespace

4. The record is identified by ImportID.

5. No UserID/ModifiedBy is stored.

6. No ImportedDate modification occurs.

7. No transaction is explicitly implemented.

Success Response (200):

{

"success": true,

"message": "Imported student rejected successfully.",

"ImportID": 25,

"Approve": "Rejected",

"Remarks": "Required documents are incomplete."

}

Failure Responses:

400 Bad Request:

{

"message": "Invalid Import ID."

}

401 Unauthorized:

Generated by JwtSessionFilter when JWT authentication fails.

403 Forbidden:

May be generated by JwtSessionFilter. No explicit 403 is returned by the action.

404 Not Found:

Returned when no row is affected by the UPDATE.

500 Internal Server Error:

Returned when an exception occurs.

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

\* 401/403 may be generated by JwtSessionFilter.

=========================================================

COMMON AUTHORIZATION / JWT DETAILS

=========================================================

JWT Requirement Summary:

| Endpoint | JWT Required | Existing Filter | Explicit Role Requirement |

|----------|--------------|-----------------|---------------------------|

| GET /api/semi-professional-student-approval/list | Yes | [JwtSessionFilter] | No |

| POST /api/semi-professional-student-approval/approve/{id} | Yes | [JwtSessionFilter] | No |

| POST /api/semi-professional-student-approval/reject/{id} | Yes | [JwtSessionFilter] | No |

| POST /api/semi-professional-student-approval/delete/{id} | Yes | [JwtSessionFilter] | No |

| GET /api/semi-professional-student-approval/import-grid | Yes | [JwtSessionFilter] | No |

| POST /api/semi-professional-student-approval/import/approve/{id} | Yes | [JwtSessionFilter] | No |

| POST /api/semi-professional-student-approval/import/reject/{id} | Yes | [JwtSessionFilter] | No |

Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

Important Authorization Observation:

The controller has [JwtSessionFilter] directly on every public action.

Therefore:

- JWT is currently implemented at ACTION LEVEL.

- A controller-level JWT filter should NOT be added based on this controller.

- There are no intentionally public endpoints in the supplied controller.

However, the controller's own business logic does NOT explicitly reject non-Branch-Executive users. Therefore, the following distinction is important:

Authentication:

JWT required for all actions because [JwtSessionFilter] is present.

Application role authorization:

No explicit role restriction is implemented in the action methods.

Branch Executive filtering:

Only affects returned data in List() and ImportGrid(); it does not prevent access to the endpoint.

=========================================================

JWT CLAIMS AND SESSION DEPENDENCY

=========================================================

The controller does not directly access JWT claims.

Instead, two Session values are accessed:

| Session Key | Expected Type | Required | Purpose |

|-------------|---------------|----------|---------|

| UserRole | string | Yes for role-specific filtering | Determines whether Branch Executive district filtering is applied. |

| UserID | int | Yes for Branch Executive filtering | Identifies the authenticated user for district mapping. |

Expected authentication flow:

JWT

->

JwtSessionFilter

->

Session["UserRole"]

Session["UserID"]

->

Controller

The exact JWT claim names and mapping to these Session keys are NOT specified in the supplied controller.

The controller methods:

GetSessionValue("UserRole")

GetSessionInt("UserID")

are used to retrieve these values.

GetSessionInt() returns 0 if UserID is missing or cannot be parsed.

No explicit error is returned by the controller when UserID is missing.

=========================================================

ROLE-BASED BUSINESS LOGIC

=========================================================

Recognized role in controller:

Branch Executives

Comparison:

Case-insensitive using StringComparison.OrdinalIgnoreCase.

For Branch Executives:

1. List() filters NewSemiProfessionalApplication by DistrictID.

2. The authenticated UserID is used against BranchExecutiveDistrictMapping.

For ImportGrid():

1. The authenticated UserID is used against BranchExecutiveDistrictMapping.

2. The mapping is joined to DistrictMaster.

3. The imported record's District string is compared against DistrictMaster.DistrictName.

4. Both values are trimmed before comparison.

For all other roles:

The controller does not apply a role-specific district restriction.

Required Roles:

No explicit "Admin", "Manager", "Branch Executive", or other role requirement is enforced by the action methods themselves.

403 behavior:

Not explicitly implemented in this controller.

=========================================================

DATABASE BEHAVIOR

=========================================================

Database Connection:

ConfigurationManager.ConnectionStrings["EnvisageDb"].ConnectionString

Database Provider:

SQL Server using System.Data.SqlClient.

Tables Referenced:

1. NewSemiProfessionalApplication

2. DistrictMaster

3. GenderMaster

4. CasteCategoryMaster

5. AreaTypeMaster

6. FatherOccupationMaster

7. MotherOccupationMaster

8. HouseTypeMaster

9. BranchExecutiveDistrictMapping

10. GoogleSheet\_SemiProfessional

Database Operations:

LIST:

SELECT from NewSemiProfessionalApplication with multiple LEFT JOINs.

APPROVE:

UPDATE NewSemiProfessionalApplication

SET:

- ApproveStatus

- Remark

REJECT:

UPDATE NewSemiProfessionalApplication

SET:

- ApproveStatus

- Remark

DELETE:

UPDATE NewSemiProfessionalApplication

SET:

- Status = 0

IMPORT GRID:

SELECT from GoogleSheet\_SemiProfessional with optional Branch Executive district filtering.

IMPORT APPROVE:

UPDATE GoogleSheet\_SemiProfessional

SET:

- Approve

- Remarks

IMPORT REJECT:

UPDATE GoogleSheet\_SemiProfessional

SET:

- Approve

- Remarks

Transactions:

No explicit database transaction is implemented.

Stored Procedures:

None are used.

Hard Delete:

None.

Soft Delete:

Yes, the Delete endpoint sets Status = 0.

=========================================================

PAGINATION / SEARCH / SORTING / FILTERING

=========================================================

Pagination:

Not specified in controller.

Page Number:

Not implemented.

Page Size:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date Filter:

Not implemented.

General Query Filters:

Not implemented through query-string parameters.

Role-Based Filtering:

Implemented internally for Branch Executives in:

- list

- import-grid

Total Count:

The response includes "count", representing the number of records returned in the current response.

There is no separate total-record count for pagination because pagination is not implemented.

=========================================================

FILE UPLOADS

=========================================================

No endpoint in this controller accepts multipart/form-data.

No endpoint uploads files.

No file validation is implemented.

No file size validation is implemented.

No file extension validation is implemented.

No file replacement logic is implemented.

The following fields are returned as paths/strings only:

NewSemiProfessionalApplication:

- StudentSelfiePath

- CETRankSheetPath

- PTRankSheetPath

- DwellingUnitPhotoPath

- MarksSheet12Path

- HouseVideoPath

- ElectricityBillPath

- IncomeCertificatePath

- RationCardPath

GoogleSheet\_SemiProfessional:

- StudentSelfiePath

- CETRankSheetPath

- DwellingUnitPhotographPath

- MarksSheet12thPath

- HouseVideoPath

- ElectricityBillPath

- IncomeCertificatePath

- RationCardPath

Allowed Extensions:

Not specified in this controller.

Maximum File Size:

Not specified in this controller.

=========================================================

DROPDOWN APIs

=========================================================

No dropdown endpoints exist in this controller.

The controller only reads descriptive master-table values through SQL LEFT JOINs.

There is no endpoint returning a standalone dropdown structure such as:

{

"id": 1,

"name": "Example"

}

No default "-- Select --" option is implemented.

No active/inactive dropdown filtering is implemented.

Master tables used for descriptive information:

- DistrictMaster

- GenderMaster

- CasteCategoryMaster

- AreaTypeMaster

- FatherOccupationMaster

- MotherOccupationMaster

- HouseTypeMaster

=========================================================

COMMON DTOS

=========================================================

DTO Name:

NewSemiProfessionalApplicationDto

Purpose:

Represents a Semi Professional student application returned by the /list endpoint.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ApplicationID | int | Yes | No | Application identifier. |

| StudentName | string | No | Yes | Student name. Controller does not enforce requiredness. |

| Email | string | No | Yes | Student email. |

| DOB | DateTime? | No | Yes | Date of birth. |

| ContactNumber | string | No | Yes | Primary contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| ResidentialAddress | string | No | Yes | Residential address. |

| GoogleMapLink | string | No | Yes | Google Maps link. |

| AreaTypeID | int? | No | Yes | Area type identifier. |

| DistrictID | int? | No | Yes | District identifier. |

| GenderID | int? | No | Yes | Gender identifier. |

| CasteCategoryID | int? | No | Yes | Caste category identifier. |

| FatherOccupationID | int? | No | Yes | Father occupation identifier. |

| MotherOccupationID | int? | No | Yes | Mother occupation identifier. |

| HouseTypeID | int? | No | Yes | House type identifier. |

| DistrictName | string | No | Yes | District name from DistrictMaster. |

| OtherDistrict | string | No | Yes | Other district value. |

| GenderName | string | No | Yes | Gender name from GenderMaster. |

| CategoryName | string | No | Yes | Category name from CasteCategoryMaster. |

| AreaTypeName | string | No | Yes | Area type name from AreaTypeMaster. |

| FatherName | string | No | Yes | Father's name. |

| MotherName | string | No | Yes | Mother's name. |

| FatherOccupation | string | No | Yes | Father's occupation name. |

| MotherOccupation | string | No | Yes | Mother's occupation name. |

| FamilyMembers | int? | No | Yes | Number of family members. |

| HouseTypeName | string | No | Yes | House type name. |

| MonthlyRent | decimal? | No | Yes | Monthly rent. |

| FamilyIncome | decimal? | No | Yes | Family income. |

| PUPercentage | decimal? | No | Yes | PUC percentage. |

| CETRank | string | No | Yes | CET rank. |

| PTRank | string | No | Yes | Practical test rank. |

| CourseApplying | string | No | Yes | Course being applied for. |

| CourseStream | string | No | Yes | Course stream. |

| StudentSelfiePath | string | No | Yes | Stored path to student selfie. |

| CETRankSheetPath | string | No | Yes | Stored path to CET rank sheet. |

| PTRankSheetPath | string | No | Yes | Stored path to practical test rank sheet. |

| DwellingUnitPhotoPath | string | No | Yes | Stored path to dwelling-unit photograph. |

| MarksSheet12Path | string | No | Yes | Stored path to 12th marks sheet. |

| HouseVideoPath | string | No | Yes | Stored path to house video. |

| ElectricityBillPath | string | No | Yes | Stored path to electricity bill. |

| IncomeCertificatePath | string | No | Yes | Stored path to income certificate. |

| RationCardPath | string | No | Yes | Stored path to ration card. |

| Status | bool? | No | Yes | Application active/status flag. |

| ApproveStatus | string | No | Yes | Approval status. |

| Remark | string | No | Yes | Approval/rejection remark. |

| CreatedDate | DateTime? | No | Yes | Application creation date. |

Requiredness:

The DTO itself contains no [Required] attributes.

Therefore, the controller does not establish mandatory request fields for this DTO because it is used as a response DTO.

Nullable:

All reference-type string properties can contain null because GetString() returns null for DBNull.

Nullable value types can contain null.

Sample Response Item:

{

"ApplicationID": 25,

"StudentName": "Rahul Kumar",

"Email": "rahul@example.com",

"DOB": "2007-05-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"ResidentialAddress": "Dharwad, Karnataka",

"GoogleMapLink": "https://maps.google.com/example",

"AreaTypeID": 1,

"DistrictID": 5,

"GenderID": 1,

"CasteCategoryID": 2,

"FatherOccupationID": 3,

"MotherOccupationID": 4,

"HouseTypeID": 1,

"DistrictName": "Dharwad",

"OtherDistrict": null,

"GenderName": "Male",

"CategoryName": "Category Example",

"AreaTypeName": "Urban",

"FatherName": "Ramesh Kumar",

"MotherName": "Sunitha Kumar",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"FamilyMembers": 5,

"HouseTypeName": "Own House",

"MonthlyRent": 0,

"FamilyIncome": 150000,

"PUPercentage": 82.5,

"CETRank": "12500",

"PTRank": "250",

"CourseApplying": "B.E.",

"CourseStream": "Computer Science",

"StudentSelfiePath": "/uploads/selfie.jpg",

"CETRankSheetPath": "/uploads/cet.pdf",

"PTRankSheetPath": "/uploads/ptrank.pdf",

"DwellingUnitPhotoPath": "/uploads/house.jpg",

"MarksSheet12Path": "/uploads/marksheet.pdf",

"HouseVideoPath": "/uploads/house.mp4",

"ElectricityBillPath": "/uploads/electricity.pdf",

"IncomeCertificatePath": "/uploads/income.pdf",

"RationCardPath": "/uploads/ration.pdf",

"Status": true,

"ApproveStatus": "Approved",

"Remark": "Verified",

"CreatedDate": "2026-08-20T10:30:00"

}

=========================================================

DTO Name:

SemiProfessionalStudentImportGridDto

Purpose:

Represents an imported Semi Professional student record returned by the /import-grid endpoint.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| ImportID | int | Yes | No | Imported record identifier. |

| Timestamp | string | No | Yes | Import/source timestamp. |

| EmailAddress | string | No | Yes | Email address. |

| StudentName | string | No | Yes | Student name. |

| DateOfBirth | string | No | Yes | Date of birth as stored/read by the controller. |

| ResidentialAddress | string | No | Yes | Residential address. |

| HomeAddressGoogleMapLink | string | No | Yes | Google Maps link. |

| Place | string | No | Yes | Place. |

| District | string | No | Yes | District name/text. |

| ContactNumber | string | No | Yes | Primary contact number. |

| AlternateNumber | string | No | Yes | Alternate contact number. |

| Gender | string | No | Yes | Gender text. |

| CasteCategory | string | No | Yes | Caste category text. |

| FatherName | string | No | Yes | Father's name. |

| MotherName | string | No | Yes | Mother's name. |

| FatherOccupation | string | No | Yes | Father's occupation. |

| MotherOccupation | string | No | Yes | Mother's occupation. |

| TotalFamilyMembers | string | No | Yes | Total family members. |

| HouseType | string | No | Yes | House type. |

| MonthlyRent | string | No | Yes | Monthly rent. |

| FamilyIncomeMonthly | string | No | Yes | Monthly family income. |

| SecuredPercentage12th | string | No | Yes | 12th secured percentage. |

| CETRank | string | No | Yes | CET rank. |

| PracticalTestRank | string | No | Yes | Practical test rank. |

| CourseApplying | string | No | Yes | Course applying for. |

| CourseStream | string | No | Yes | Course stream. |

| StudentSelfiePath | string | No | Yes | Student selfie path. |

| CETRankSheetPath | string | No | Yes | CET rank sheet path. |

| DwellingUnitPhotographPath | string | No | Yes | Dwelling-unit photograph path. |

| MarksSheet12thPath | string | No | Yes | 12th marks sheet path. |

| HouseVideoPath | string | No | Yes | House video path. |

| ElectricityBillPath | string | No | Yes | Electricity bill path. |

| IncomeCertificatePath | string | No | Yes | Income certificate path. |

| RationCardPath | string | No | Yes | Ration card path. |

| ImportedDate | DateTime? | No | Yes | Date/time the record was imported. |

| Approve | string | No | Yes | Approval status. |

| Remarks | string | No | Yes | Approval/rejection remarks. |

Requiredness:

This DTO is response-only in the supplied controller. No [Required] attributes or request validation apply.

Nullable:

String values can be null because GetString() returns null for DBNull.

ImportedDate can be null.

Sample Response Item:

{

"ImportID": 25,

"Timestamp": "2026-08-20 10:30:00",

"EmailAddress": "rahul@example.com",

"StudentName": "Rahul Kumar",

"DateOfBirth": "2007-05-15",

"ResidentialAddress": "Dharwad, Karnataka",

"HomeAddressGoogleMapLink": "https://maps.google.com/example",

"Place": "Dharwad",

"District": "Dharwad",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"Gender": "Male",

"CasteCategory": "Category Example",

"FatherName": "Ramesh Kumar",

"MotherName": "Sunitha Kumar",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"TotalFamilyMembers": "5",

"HouseType": "Own House",

"MonthlyRent": "0",

"FamilyIncomeMonthly": "150000",

"SecuredPercentage12th": "82.5",

"CETRank": "12500",

"PracticalTestRank": "250",

"CourseApplying": "B.E.",

"CourseStream": "Computer Science",

"StudentSelfiePath": "/uploads/selfie.jpg",

"CETRankSheetPath": "/uploads/cet.pdf",

"DwellingUnitPhotographPath": "/uploads/house.jpg",

"MarksSheet12thPath": "/uploads/marksheet.pdf",

"HouseVideoPath": "/uploads/house.mp4",

"ElectricityBillPath": "/uploads/electricity.pdf",

"IncomeCertificatePath": "/uploads/income.pdf",

"RationCardPath": "/uploads/ration.pdf",

"ImportedDate": "2026-08-20T10:30:00",

"Approve": "Approved",

"Remarks": "Verified"

}

=========================================================

REQUEST DTO SUMMARY

=========================================================

No dedicated request DTO classes are defined in the supplied controller.

The mutation endpoints use:

1. Path parameter:

id

2. Optional query-string parameter:

remarks

No JSON request body DTO is used.

Approval endpoints:

- Approve

- Reject

- ApproveImported

- RejectImported

All use the same parameter pattern:

POST route/{id}?remarks=optional text

=========================================================

APPROVAL STATUS VALUES

=========================================================

The controller explicitly writes the following values:

NewSemiProfessionalApplication.ApproveStatus:

- "Approved"

- "Rejected"

GoogleSheet\_SemiProfessional.Approve:

- "Approved"

- "Rejected"

No other approval-status values are written by this controller.

The controller does not explicitly validate existing values before changing them.

=========================================================

DEFAULT VALUES

=========================================================

List():

No explicit default database values are assigned by the controller.

Approve():

remarks defaults to:

""

Reject():

remarks defaults to:

""

ApproveImported():

remarks defaults to:

""

RejectImported():

remarks defaults to:

""

SetApprovalStatus():

If remarks is null:

Remark = ""

SetImportStatus():

If remarks is null, empty, or whitespace:

Remarks = NULL in the database.

Delete():

Status is explicitly set to:

0

=========================================================

ERROR HANDLING SUMMARY

=========================================================

400 Bad Request:

Used by mutation endpoints when the supplied ID is <= 0.

Messages:

Application operations:

"Invalid Application ID."

Imported operations:

"Invalid Import ID."

401 Unauthorized:

Not explicitly returned by controller methods.

May be returned by [JwtSessionFilter] or the Web API authentication pipeline when JWT authentication is missing, invalid, expired, or rejected.

403 Forbidden:

Not explicitly returned by controller methods.

May be returned by [JwtSessionFilter] if its implementation performs authorization/role checks.

404 Not Found:

Used by update/delete operations when ExecuteNonQuery() returns 0 affected rows.

This means no database row matching the supplied ID was updated.

409 Conflict:

Not used by any endpoint in this controller.

No duplicate checking or conflict detection is implemented.

500 Internal Server Error:

Used by all database/list endpoints when an exception is caught.

The controller returns:

InternalServerError(ex)

Note:

The exact serialized 500 response format is framework/configuration dependent and is not explicitly constructed as:

{

"success": false,

"message": "..."

}

by the controller.

=========================================================

COMPLETE ENDPOINT SUMMARY

=========================================================

| # | Method | Route | JWT | Role Behavior |

|---|--------|-------|-----|---------------|

| 1 | GET | /api/semi-professional-student-approval/list | Required | Branch Executives filtered by mapped UserID districts |

| 2 | POST | /api/semi-professional-student-approval/approve/{id} | Required | No explicit role check |

| 3 | POST | /api/semi-professional-student-approval/reject/{id} | Required | No explicit role check |

| 4 | POST | /api/semi-professional-student-approval/delete/{id} | Required | No explicit role check |

| 5 | GET | /api/semi-professional-student-approval/import-grid | Required | Branch Executives filtered by mapped UserID districts |

| 6 | POST | /api/semi-professional-student-approval/import/approve/{id} | Required | No explicit role check |

| 7 | POST | /api/semi-professional-student-approval/import/reject/{id} | Required | No explicit role check |

Total Endpoints:

7

GET Endpoints:

2

POST Endpoints:

5

PUT Endpoints:

0

DELETE HTTP Endpoints:

0

PATCH Endpoints:

0

Multipart/Form-Data Endpoints:

0

Dropdown Endpoints:

0

Public Endpoints:

0

JWT-Protected Endpoints:

7

=========================================================

SECURITY OBSERVATIONS

=========================================================

1. Every action in the supplied controller explicitly has [JwtSessionFilter].

2. Therefore, JWT is currently required at action level for all seven endpoints.

3. No controller-level [JwtSessionFilter] should be added merely for documentation purposes because the supplied implementation already applies it to each action.

4. Only the List and ImportGrid actions use authenticated session identity for data filtering.

5. The approval, rejection, and soft-delete operations authenticate the caller through JwtSessionFilter but do not themselves verify UserID ownership or Branch Executive district ownership.

6. Consequently, from the supplied controller alone, there is no explicit check that the authenticated user:

- owns the ApplicationID,

- belongs to the application's district,

- has a specific administrator role,

- is a Branch Executive,

- or is otherwise authorized to approve/reject/delete a particular record.

7. Whether JwtSessionFilter performs additional authorization cannot be determined from this controller.

8. The controller reads UserRole and UserID from ASP.NET Session only in:

- List()

- ImportGrid()

9. The controller does not directly access JWT claims.

10. Exact JWT claim names are not specified.

11. Exact JwtSessionFilter behavior is not specified.

12. If JwtSessionFilter does not populate Session["UserRole"] and Session["UserID"], Branch Executive filtering may not work as intended.

13. The controller does not explicitly return 401 or 403 itself.

14. No CSRF protection, rate limiting, audit logging, or transaction handling is visible in this controller.

15. No explicit authorization check exists before soft deletion.

16. No explicit authorization check exists before changing approval status.

These observations describe only behavior visible in the supplied controller and do not imply missing functionality elsewhere in the application.

=========================================================

FINAL CONTRACT VALIDATION

=========================================================

Controller reviewed:

VP\_SemiProfessionalStudentApprovalGridApiController

Route Prefix verified:

/api/semi-professional-student-approval

Endpoints included:

7 of 7

Authentication:

All 7 actions contain [JwtSessionFilter].

Controller-level JWT filter:

Not required based on the supplied code because authentication is already applied individually at action level.

Public endpoints:

None.

Branch Executive filtering:

Implemented only in:

- /list

- /import-grid

Session dependencies:

- UserRole

- UserID

Direct JWT claim access:

None visible.

Pagination:

Not implemented.

Search:

Not implemented.

Sorting:

Not implemented.

Date filtering:

Not implemented.

File uploads:

None.

Dropdown endpoints:

None.

Soft delete:

Implemented by:

POST /delete/{id}

Approval:

Implemented by:

POST /approve/{id}

Rejection:

Implemented by:

POST /reject/{id}

Imported approval:

Implemented by:

POST /import/approve/{id}

Imported rejection:

Implemented by:

POST /import/reject/{id}

DTOs:

- NewSemiProfessionalApplicationDto

- SemiProfessionalStudentImportGridDto

Request DTO classes:

None.

Stored procedures:

None.

Transactions:

None visible.

Hard delete:

None.

Explicit duplicate validation:

None.

Explicit foreign-key validation:

None.

Explicit email validation:

None.

Explicit file validation:

None.

Explicit role authorization:

None in the action methods.

JWT/session-based district filtering:

Yes, for Branch Executives in the two GET endpoints.

All required/optional request parameters visible in the controller:

Documented above.

Any behavior not determinable from the controller:

Explicitly identified as "Not specified in controller."