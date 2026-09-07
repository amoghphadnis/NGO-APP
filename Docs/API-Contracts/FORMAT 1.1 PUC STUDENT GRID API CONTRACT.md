=========================================================

API CONTRACT

FORMAT 1.1 PUC STUDENT GRID API

=========================================================

API BASE ROUTE

==============

Route Prefix:

/api/format1-1-puc

Controller:

VP\_Format1\_1PUC\_GridAPIController

Authentication:

JWT authentication is applied at ACTION LEVEL through the existing [JwtSessionFilter] attribute.

IMPORTANT:

All three endpoints in this controller explicitly have [JwtSessionFilter]. Therefore, based on the supplied controller code, JWT authentication is REQUIRED for all endpoints.

There is NO controller-level [JwtSessionFilter]. The filter is applied individually to each action.

Authorization:

The controller does not contain [Authorize(Roles = "...")] or an equivalent explicit role restriction.

However, the GET /list endpoint reads UserRole and UserID from ASP.NET Session and applies additional district filtering when the role is "Branch Executives".

The approve, reject, and delete endpoints require the existing JwtSessionFilter but do not explicitly restrict the operation to a particular role in the supplied controller.

Expected Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

=========================================================

1. GET STUDENTS LIST

=========================================================

Endpoint:

GET /api/format1-1-puc/list

Purpose:

Retrieves the Format 1.1 PUC student records from the Format1\_1\_PUC database table.

The endpoint returns student personal information, family information, education information, college information, uploaded document paths, approval status, remarks, and creation date.

For users whose session role is "Branch Executives", the result is restricted to districts assigned to the authenticated UserID through the BranchExecutiveDistrictMapping table.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Format:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Authorization Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read from JWT in this controller.

\* Required Roles: No single role is mandatory for access.

\* Role-specific behavior: "Branch Executives" receives district-restricted data.

\* UserID requirement: Yes, because the endpoint requires HttpContext.Current.Session["UserID"].

\* UserRole requirement: The endpoint reads HttpContext.Current.Session["UserRole"]. If the role is "Branch Executives", UserID is used to filter districts.

\* JWT-to-Session mapping: The controller expects the authentication/session mechanism, represented by JwtSessionFilter, to populate the required Session values. The exact JWT claim-to-session mapping is not implemented in this controller and is therefore Not specified in controller.

Session Values Used:

| Session Value | Type | Required | Purpose |

|---------------|------|----------|---------|

| UserID | int/object | Yes | Identifies the authenticated user. |

| UserRole | string | Conditionally | Determines whether Branch Executive district filtering is applied. |

JWT Claims:

| Claim | Type | Required | Purpose |

|-------|------|----------|---------|

| UserID | int | Yes, indirectly | Must ultimately be available through Session["UserID"]. Exact JWT claim name is Not specified in controller. |

| Role/UserRole | string | Conditionally | Must ultimately be available through Session["UserRole"] when role-based filtering is required. Exact JWT claim name is Not specified in controller. |

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | This endpoint does not have path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are implemented. |

Request Body:

None.

Pagination:

Not implemented in the controller.

The endpoint does not accept:

\* page number

\* page size

\* search term

\* sorting

\* date range

\* status filter

\* district query parameter

Filtering:

The endpoint starts with:

WHERE 1 = 1

For users whose Session["UserRole"] is exactly:

Branch Executives

the following restriction is added:

AND f.DistrictID IN

(

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

)

The @UserId parameter is populated using the authenticated user's Session["UserID"].

For roles other than "Branch Executives", this district restriction is NOT added.

Validation Rules:

1. JWT/session authentication must pass the existing JwtSessionFilter.

2. Session["UserID"] must exist.

3. If Session["UserID"] is missing, the API returns 401 Unauthorized.

4. Session["UserID"] must be convertible to a positive integer.

5. If UserID cannot be parsed or is less than or equal to zero, the API returns 401 Unauthorized.

6. UserRole is read from Session.

7. If UserRole equals "Branch Executives", the authenticated UserID is used for district filtering.

8. No request body validation is required.

9. No query parameter validation exists.

10. No pagination validation exists.

11. No search validation exists.

12. No duplicate validation exists.

13. No email validation is performed by this endpoint.

14. No explicit database transaction is used.

Business Logic Notes:

1. Data is retrieved from Format1\_1\_PUC.

2. Lookup/display information is obtained using LEFT JOINs.

3. Gender is resolved through GenderMaster.

4. Caste category is resolved through CasteCategoryMaster.

5. District is resolved through DistrictMaster.

6. Father occupation is resolved through FatherOccupationMaster.

7. Mother occupation is resolved through MotherOccupationMaster.

8. Course is resolved through CourseMaster.

9. College type is resolved through CollegeTypeMaster.

10. Branch Executive users are restricted to districts assigned in BranchExecutiveDistrictMapping.

11. The Branch Executive filter is based on UserID, not directly on a district supplied by the client.

12. No explicit Status = 1 filter is present.

13. Therefore, records whose Status was changed to 0 by the DELETE endpoint are not excluded by this GET query unless database/business logic outside this controller handles them.

14. Results are returned in the order supplied by SQL Server because no ORDER BY clause is implemented.

15. There is no pagination.

16. There is no explicit maximum record count.

17. All database operations are performed using ADO.NET SqlConnection, SqlCommand, and SqlDataReader.

18. The query uses a parameterized @UserId value for Branch Executive filtering.

19. Other roles receive all records visible to the SQL query.

20. Null database values are converted to empty strings, zero values, or DateTime.MinValue depending on the destination property.

Database Tables Accessed:

Primary table:

Format1\_1\_PUC

Lookup tables:

\* GenderMaster

\* CasteCategoryMaster

\* DistrictMaster

\* FatherOccupationMaster

\* MotherOccupationMaster

\* CourseMaster

\* CollegeTypeMaster

Authorization/filtering table:

\* BranchExecutiveDistrictMapping

Database Operation:

SELECT

Database Modification:

None.

Response Data Fields:

| Field | Type | Description |

|-------|------|-------------|

| StudentFormat1ID | int | Format 1.1 PUC student record identifier. |

| StudentName | string | Student name. |

| Email | string | Student email address. |

| DateOfBirth | DateTime | Student date of birth. |

| ContactNumber | string | Student contact number. |

| AlternateNumber | string | Alternate contact number. |

| GenderName | string | Gender display name from GenderMaster. |

| CategoryName | string | Caste category display name from CasteCategoryMaster. |

| DistrictName | string | District display name from DistrictMaster. |

| OtherDistrict | string | Other district value stored in the student record. |

| Taluk | string | Taluk. |

| ResidentialAddress | string | Residential address. |

| FatherOccupation | string | Father occupation name. |

| MotherOccupation | string | Mother occupation name. |

| TotalFamilyMembers | int | Total number of family members. |

| FamilyAnnualIncome | decimal | Annual family income. |

| SSLCPercentage | decimal | SSLC percentage. |

| CourseName | string | Course name from CourseMaster. |

| CollegeName | string | College name. |

| CollegeTypeName | string | College type display name. |

| CollegeFees | decimal | College fees. |

| CollegeContactNumber | string | College contact number. |

| Achievement | string | Student achievement information. |

| ParentsBankBalance | decimal | Parents' bank balance. |

| StudentSelfiePath | string | Student selfie file path. |

| SSLCMarksCardPath | string | SSLC marks card file path. |

| FeeReceiptPath | string | Fee receipt file path. |

| BankPassbookPath | string | Bank passbook file path. |

| AadhaarCardPath | string | Aadhaar card file path. |

| Status | string | Record status value converted to string. |

| CreatedDate | DateTime | Record creation date. |

| Remark | string | Approval/rejection remark. |

| ApproveStatus | string | Approval status. |

Null Handling:

The controller explicitly checks DBNull.Value.

String fields:

NULL database values are returned as "".

Numeric fields:

NULL database values are returned as 0.

DateTime fields:

NULL database values are returned as DateTime.MinValue.

Success Response (200):

{

"success": true,

"count": 2,

"data": [

{

"StudentFormat1ID": 156,

"StudentName": "Rahul Kumar",

"Email": "rahul@example.com",

"DateOfBirth": "2007-05-15T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"GenderName": "Male",

"CategoryName": "General",

"DistrictName": "Dharwad",

"OtherDistrict": "",

"Taluk": "Dharwad",

"ResidentialAddress": "Dharwad, Karnataka",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"TotalFamilyMembers": 5,

"FamilyAnnualIncome": 150000.00,

"SSLCPercentage": 82.50,

"CourseName": "PUC Science",

"CollegeName": "Example PU College",

"CollegeTypeName": "Private",

"CollegeFees": 25000.00,

"CollegeContactNumber": "0836-1234567",

"Achievement": "District level sports participant",

"ParentsBankBalance": 12000.00,

"StudentSelfiePath": "/uploads/student/selfie.jpg",

"SSLCMarksCardPath": "/uploads/student/sslc.pdf",

"FeeReceiptPath": "/uploads/student/fee-receipt.pdf",

"BankPassbookPath": "/uploads/student/passbook.pdf",

"AadhaarCardPath": "/uploads/student/aadhaar.pdf",

"Status": "1",

"CreatedDate": "2026-08-28T10:30:00",

"Remark": "",

"ApproveStatus": "Pending"

},

{

"StudentFormat1ID": 157,

"StudentName": "Priya Sharma",

"Email": "priya@example.com",

"DateOfBirth": "2007-08-20T00:00:00",

"ContactNumber": "9876501234",

"AlternateNumber": "",

"GenderName": "Female",

"CategoryName": "OBC",

"DistrictName": "Belagavi",

"OtherDistrict": "",

"Taluk": "Belagavi",

"ResidentialAddress": "Belagavi, Karnataka",

"FatherOccupation": "Driver",

"MotherOccupation": "Homemaker",

"TotalFamilyMembers": 4,

"FamilyAnnualIncome": 180000.00,

"SSLCPercentage": 88.00,

"CourseName": "PUC Commerce",

"CollegeName": "Example College",

"CollegeTypeName": "Government",

"CollegeFees": 18000.00,

"CollegeContactNumber": "0831-9876543",

"Achievement": "",

"ParentsBankBalance": 8000.00,

"StudentSelfiePath": "/uploads/student/selfie2.jpg",

"SSLCMarksCardPath": "/uploads/student/sslc2.pdf",

"FeeReceiptPath": "/uploads/student/fee2.pdf",

"BankPassbookPath": "/uploads/student/passbook2.pdf",

"AadhaarCardPath": "/uploads/student/aadhaar2.pdf",

"Status": "1",

"CreatedDate": "2026-08-28T11:00:00",

"Remark": "",

"ApproveStatus": "Pending"

}

]

}

Failure Responses:

401 Unauthorized:

Occurs when Session["UserID"] is missing.

Example:

{

"success": false,

"message": "User session has expired or UserID is missing."

}

Also occurs when Session["UserID"] cannot be parsed as a positive integer.

Example:

{

"success": false,

"message": "Invalid logged-in UserID."

}

403 Forbidden:

Not explicitly returned by this action.

If JwtSessionFilter itself rejects an authenticated user due to authorization rules, a 403 may potentially be produced by the filter, but this behavior is Not specified in controller.

404 Not Found:

Not explicitly returned by this endpoint.

An empty list is returned with HTTP 200 rather than 404.

409 Conflict:

Not explicitly used.

500 Internal Server Error:

Returned when an unhandled exception occurs in the try/catch block.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 401 Unauthorized

\* 500 Internal Server Error

Potential framework/filter status:

\* 403 Forbidden may be produced by JwtSessionFilter depending on its implementation, but this is Not specified in controller.

=========================================================

2. APPROVE STUDENT

=========================================================

Endpoint:

POST /api/format1-1-puc/approve/{id}

Purpose:

Approves a Format 1.1 PUC student record by updating ApproveStatus to "Approved" and saving the supplied remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Format:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Authorization Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: None explicitly specified in this controller.

\* User identity: Not directly used by ApproveStudent.

\* Session dependency: No Session value is directly read by ApproveStudent.

\* The exact authentication behavior of JwtSessionFilter is Not specified in controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentFormat1ID of the record to approve. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are implemented. |

Request Body:

DTO:

ApprovalRemarkRequest

Full JSON sample:

{

"Remark": "Documents verified and approved."

}

Request Body Requiredness:

The request object itself is optional according to the controller.

If request is null, or request.Remark is null, the controller uses:

Remark = ""

Therefore:

\* Request body: Optional

\* Remark: Optional

\* Null Remark: Converted to empty string

\* Empty Remark: Accepted

\* No explicit maximum length is implemented in the controller.

Validation Rules:

1. id must be greater than 0.

2. If id <= 0, HTTP 400 is returned.

3. ApprovalRemarkRequest may be null.

4. Remark may be null.

5. Null Remark is replaced with an empty string.

6. No ModelState validation is explicitly performed.

7. No duplicate check is performed.

8. No explicit role validation is performed.

9. No ownership check is performed.

10. No UserID check is performed.

11. No database transaction is explicitly used.

Business Logic Notes:

1. The endpoint calls UpdateStatus(id, "Approved", remark).

2. The database UPDATE changes only:

\* ApproveStatus

\* Remark

3. The record is located using StudentFormat1ID.

4. If no record matches the supplied ID, ExecuteNonQuery returns 0 and the API returns 404.

5. The endpoint does not modify Status.

6. The endpoint does not modify CreatedDate.

7. The endpoint does not record ModifiedBy.

8. The endpoint does not record the authenticated UserID.

9. The endpoint does not perform an explicit role check.

10. The endpoint does not check whether the record is already approved or rejected before updating.

11. The endpoint does not validate the current approval status.

12. No confirmation parameter is required.

Database Operation:

UPDATE Format1\_1\_PUC

SET:

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE:

StudentFormat1ID = @StudentFormat1ID

Success Response (200):

{

"success": true,

"message": "Student approved successfully.",

"studentFormat1ID": 156,

"approveStatus": "Approved",

"remark": "Documents verified and approved."

}

Failure Responses:

400 Bad Request:

Occurs when id <= 0.

Example:

{

"success": false,

"message": "Invalid StudentFormat1ID."

}

401 Unauthorized:

The controller itself does not explicitly return 401 in this action.

However, JwtSessionFilter is present and may reject an unauthenticated request. Exact filter behavior is Not specified in controller.

403 Forbidden:

Not explicitly returned by the action.

A 403 may be produced by JwtSessionFilter if that filter implements authorization restrictions. Exact behavior is Not specified in controller.

404 Not Found:

Occurs when the supplied StudentFormat1ID does not match any record.

Example:

{

"success": false,

"message": "Student record not found."

}

409 Conflict:

Not explicitly used.

500 Internal Server Error:

Returned when an exception occurs.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

Authentication/filter-related 401/403 behavior is dependent on JwtSessionFilter and is not explicitly generated by this action.

=========================================================

3. REJECT STUDENT

=========================================================

Endpoint:

POST /api/format1-1-puc/reject/{id}

Purpose:

Rejects a Format 1.1 PUC student record by updating ApproveStatus to "Rejected" and saving the supplied remark.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Format:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Authorization Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by the action.

\* Required Roles: None explicitly specified in this controller.

\* User identity: Not directly used by RejectStudent.

\* Session dependency: No Session value is directly read by RejectStudent.

\* Exact JWT claim mapping is Not specified in controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentFormat1ID of the record to reject. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are implemented. |

Request Body:

DTO:

ApprovalRemarkRequest

Full JSON sample:

{

"Remark": "Required documents are incomplete."

}

Request Body Requiredness:

The request object is optional.

Remark is optional.

If request is null or request.Remark is null, the controller sets:

Remark = ""

Therefore:

\* Request body: Optional

\* Remark: Optional

\* Null Remark: Converted to empty string

\* Empty Remark: Accepted

\* Maximum length: Not specified in controller.

Validation Rules:

1. id must be greater than 0.

2. If id <= 0, HTTP 400 is returned.

3. ApprovalRemarkRequest can be null.

4. Remark can be null.

5. Null Remark becomes an empty string.

6. No ModelState validation is explicitly performed.

7. No duplicate validation is performed.

8. No explicit role validation is performed.

9. No ownership check is performed.

10. No UserID check is performed.

11. No transaction is explicitly used.

Business Logic Notes:

1. The endpoint calls UpdateStatus(id, "Rejected", remark).

2. The database UPDATE changes:

\* ApproveStatus

\* Remark

3. Status is not changed.

4. CreatedDate is not changed.

5. ModifiedBy is not recorded.

6. Authenticated UserID is not recorded.

7. Current approval status is not checked.

8. Already rejected/approved records can be updated because no status restriction exists.

9. The record is identified by StudentFormat1ID.

10. If no matching record exists, HTTP 404 is returned.

Database Operation:

UPDATE Format1\_1\_PUC

SET:

ApproveStatus = @ApproveStatus,

Remark = @Remark

WHERE:

StudentFormat1ID = @StudentFormat1ID

Success Response (200):

{

"success": true,

"message": "Student rejected successfully.",

"studentFormat1ID": 156,

"approveStatus": "Rejected",

"remark": "Required documents are incomplete."

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid StudentFormat1ID."

}

401 Unauthorized:

Not explicitly returned by the action.

JwtSessionFilter may reject unauthenticated requests. Exact behavior is Not specified in controller.

403 Forbidden:

Not explicitly returned by the action.

A 403 may be produced by JwtSessionFilter if implemented by that filter. Exact behavior is Not specified in controller.

404 Not Found:

{

"success": false,

"message": "Student record not found."

}

409 Conflict:

Not explicitly used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

Authentication/filter-related 401/403 behavior is dependent on JwtSessionFilter.

=========================================================

4. DELETE STUDENT — SOFT DELETE

=========================================================

Endpoint:

DELETE /api/format1-1-puc/delete/{id}

Purpose:

Performs a soft delete of a Format 1.1 PUC student record.

The record is NOT physically deleted.

The controller updates:

Status = 0

for the specified StudentFormat1ID.

Content-Type:

application/json

Authorization:

JWT Required

Expected Authorization Format:

Authorization: Bearer <JWT\_TOKEN>

JWT / Authorization Details:

\* JWT Required: Yes

\* Filter/Authorization Scope: Action-level

\* Existing Authorization Attribute: [JwtSessionFilter]

\* Required Claims: Not directly read by this action.

\* Required Roles: None explicitly specified in this controller.

\* UserID: Not directly used by this action.

\* Session dependency: No Session value is directly read by this action.

\* Exact JWT claim-to-session mapping is Not specified in controller.

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| id | int | Yes | StudentFormat1ID of the record to soft-delete. Must be greater than 0. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | - | No query parameters are implemented. |

Request Body:

None.

Validation Rules:

1. id is required as a route parameter.

2. id must be greater than 0.

3. If id <= 0, HTTP 400 is returned.

4. No request body is accepted or required.

5. No role validation is explicitly performed.

6. No ownership check is performed.

7. No UserID check is performed.

8. No dependency check is performed.

9. No confirmation field is required.

10. No database transaction is explicitly used.

Business Logic Notes:

1. This is a SOFT DELETE.

2. The database record remains in Format1\_1\_PUC.

3. Only Status is changed.

4. Status is set to numeric value 0.

5. StudentFormat1ID is used to identify the record.

6. No physical DELETE statement is executed.

7. No CreatedDate modification occurs.

8. No ModifiedDate is recorded.

9. No ModifiedBy is recorded.

10. No authenticated UserID is stored.

11. No role-specific restriction is implemented in this action.

12. No dependency checks are performed.

13. No explicit check is made for the current Status.

14. If the ID does not exist, ExecuteNonQuery returns 0 and HTTP 404 is returned.

15. IMPORTANT: The GET /list query does not contain a Status filter. Therefore, setting Status = 0 does not automatically remove the record from the GET /list result.

Database Operation:

UPDATE Format1\_1\_PUC

SET:

Status = 0

WHERE:

StudentFormat1ID = @StudentFormat1ID

Success Response (200):

{

"success": true,

"message": "Format 1.1 PUC Student deleted successfully.",

"studentFormat1ID": 156

}

Failure Responses:

400 Bad Request:

{

"success": false,

"message": "Invalid StudentFormat1ID."

}

401 Unauthorized:

Not explicitly returned by the action.

JwtSessionFilter may reject unauthenticated requests. Exact behavior is Not specified in controller.

403 Forbidden:

Not explicitly returned by the action.

A 403 may be produced by JwtSessionFilter if implemented by that filter. Exact behavior is Not specified in controller.

404 Not Found:

{

"success": false,

"message": "Student record not found."

}

409 Conflict:

Not explicitly used.

500 Internal Server Error:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

\* 200 OK

\* 400 Bad Request

\* 404 Not Found

\* 500 Internal Server Error

Authentication/filter-related 401/403 behavior is dependent on JwtSessionFilter.

=========================================================

COMMON DTOS

=========================================================

DTO 1:

Format1\_1PUCModel

Purpose:

Represents a Format 1.1 PUC student record returned by the GET /api/format1-1-puc/list endpoint.

The controller explicitly populates the following properties.

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| StudentFormat1ID | int | Yes in response | No in model assignment | Student record identifier. Database NULL becomes 0. |

| StudentName | string | No | Yes at database level | Student name. Database NULL becomes "". |

| Email | string | No | Yes at database level | Student email. Database NULL becomes "". |

| DateOfBirth | DateTime | No | Yes at database level | Date of birth. Database NULL becomes DateTime.MinValue. |

| ContactNumber | string | No | Yes at database level | Contact number. Database NULL becomes "". |

| AlternateNumber | string | No | Yes at database level | Alternate contact number. Database NULL becomes "". |

| GenderName | string | No | Yes at database level | Gender name from GenderMaster. Database NULL becomes "". |

| CategoryName | string | No | Yes at database level | Category name from CasteCategoryMaster. Database NULL becomes "". |

| DistrictName | string | No | Yes at database level | District name from DistrictMaster. Database NULL becomes "". |

| OtherDistrict | string | No | Yes at database level | Other district value. Database NULL becomes "". |

| Taluk | string | No | Yes at database level | Taluk. Database NULL becomes "". |

| ResidentialAddress | string | No | Yes at database level | Residential address. Database NULL becomes "". |

| FatherOccupation | string | No | Yes at database level | Father occupation name. Database NULL becomes "". |

| MotherOccupation | string | No | Yes at database level | Mother occupation name. Database NULL becomes "". |

| TotalFamilyMembers | int | No | Yes at database level | Number of family members. Database NULL becomes 0. |

| FamilyAnnualIncome | decimal | No | Yes at database level | Annual family income. Database NULL becomes 0. |

| SSLCPercentage | decimal | No | Yes at database level | SSLC percentage. Database NULL becomes 0. |

| CourseName | string | No | Yes at database level | Course name. Database NULL becomes "". |

| CollegeName | string | No | Yes at database level | College name. Database NULL becomes "". |

| CollegeTypeName | string | No | Yes at database level | College type name. Database NULL becomes "". |

| CollegeFees | decimal | No | Yes at database level | College fees. Database NULL becomes 0. |

| CollegeContactNumber | string | No | Yes at database level | College contact number. Database NULL becomes "". |

| Achievement | string | No | Yes at database level | Achievement information. Database NULL becomes "". |

| ParentsBankBalance | decimal | No | Yes at database level | Parents' bank balance. Database NULL becomes 0. |

| StudentSelfiePath | string | No | Yes at database level | Student selfie path. Database NULL becomes "". |

| SSLCMarksCardPath | string | No | Yes at database level | SSLC marks card path. Database NULL becomes "". |

| FeeReceiptPath | string | No | Yes at database level | Fee receipt path. Database NULL becomes "". |

| BankPassbookPath | string | No | Yes at database level | Bank passbook path. Database NULL becomes "". |

| AadhaarCardPath | string | No | Yes at database level | Aadhaar card path. Database NULL becomes "". |

| Status | string | No | Yes at database level | Record status converted to string. Database NULL becomes "". |

| CreatedDate | DateTime | No | Yes at database level | Creation date. Database NULL becomes DateTime.MinValue. |

| Remark | string | No | Yes at database level | Approval/rejection remark. Database NULL becomes "". |

| ApproveStatus | string | No | Yes at database level | Approval status. Database NULL becomes "". |

Important:

The supplied controller does not provide the declaration of Format1\_1PUCModel. Therefore, the exact C# property nullability, attributes, serialization attributes, and validation attributes cannot be determined from this controller.

The types above are based on the explicit assignments performed by the controller.

=========================================================

DTO 2:

ApprovalRemarkRequest

=========================================================

Purpose:

Request DTO used by the approve and reject endpoints to receive an optional remark.

Used By:

POST /api/format1-1-puc/approve/{id}

POST /api/format1-1-puc/reject/{id}

Properties:

| Property | Type | Required | Nullable | Description |

|----------|------|----------|----------|-------------|

| Remark | string | No | Yes | Approval or rejection remark. If request is null or Remark is null, the controller uses an empty string. |

Sample Request:

{

"Remark": "Documents verified and approved."

}

Alternative valid request:

{

"Remark": ""

}

Because the controller checks for null, the following is also effectively accepted:

{}

The following situation is also handled:

Request body = null

In that case:

Remark = ""

=========================================================

COMMON RESPONSE STRUCTURES

=========================================================

LIST RESPONSE:

{

"success": true,

"count": 2,

"data": [

{

"StudentFormat1ID": 156,

"StudentName": "Rahul Kumar",

"Email": "rahul@example.com",

"DateOfBirth": "2026-08-28T00:00:00",

"ContactNumber": "9876543210",

"AlternateNumber": "9123456780",

"GenderName": "Male",

"CategoryName": "General",

"DistrictName": "Dharwad",

"OtherDistrict": "",

"Taluk": "Dharwad",

"ResidentialAddress": "Dharwad, Karnataka",

"FatherOccupation": "Farmer",

"MotherOccupation": "Homemaker",

"TotalFamilyMembers": 5,

"FamilyAnnualIncome": 150000.00,

"SSLCPercentage": 82.50,

"CourseName": "PUC Science",

"CollegeName": "Example PU College",

"CollegeTypeName": "Private",

"CollegeFees": 25000.00,

"CollegeContactNumber": "0836-1234567",

"Achievement": "District level sports participant",

"ParentsBankBalance": 12000.00,

"StudentSelfiePath": "/uploads/student/selfie.jpg",

"SSLCMarksCardPath": "/uploads/student/sslc.pdf",

"FeeReceiptPath": "/uploads/student/fee-receipt.pdf",

"BankPassbookPath": "/uploads/student/passbook.pdf",

"AadhaarCardPath": "/uploads/student/aadhaar.pdf",

"Status": "1",

"CreatedDate": "2026-08-28T10:30:00",

"Remark": "",

"ApproveStatus": "Pending"

}

]

}

APPROVE RESPONSE:

{

"success": true,

"message": "Student approved successfully.",

"studentFormat1ID": 156,

"approveStatus": "Approved",

"remark": "Documents verified and approved."

}

REJECT RESPONSE:

{

"success": true,

"message": "Student rejected successfully.",

"studentFormat1ID": 156,

"approveStatus": "Rejected",

"remark": "Required documents are incomplete."

}

DELETE RESPONSE:

{

"success": true,

"message": "Format 1.1 PUC Student deleted successfully.",

"studentFormat1ID": 156

}

=========================================================

AUTHENTICATION AND AUTHORIZATION SUMMARY

=========================================================

| Endpoint | JWT Required | Existing Filter | Role Requirement | Session Dependency |

|----------|--------------|-----------------|------------------|-------------------|

| GET /api/format1-1-puc/list | Yes | [JwtSessionFilter] action-level | No fixed required role; Branch Executives receive special filtering | UserID required; UserRole used |

| POST /api/format1-1-puc/approve/{id} | Yes | [JwtSessionFilter] action-level | No explicit role restriction | No direct Session usage |

| POST /api/format1-1-puc/reject/{id} | Yes | [JwtSessionFilter] action-level | No explicit role restriction | No direct Session usage |

| DELETE /api/format1-1-puc/delete/{id} | Yes | [JwtSessionFilter] action-level | No explicit role restriction | No direct Session usage |

Important Authorization Conclusion:

The supplied controller contains [JwtSessionFilter] on every action.

Therefore:

\* GET /list is protected.

\* POST /approve/{id} is protected.

\* POST /reject/{id} is protected.

\* DELETE /delete/{id} is protected.

There is no public endpoint in this controller based on the supplied code.

There is no controller-level JWT filter.

There is no explicit Admin-only, Branch Executive-only, or other role-only authorization attribute on the approve, reject, or delete actions.

Only the GET /list action contains explicit role-dependent business logic.

=========================================================

ROLE-BASED BUSINESS LOGIC

=========================================================

Role:

Branch Executives

Endpoint:

GET /api/format1-1-puc/list

Behavior:

If:

HttpContext.Current.Session["UserRole"] == "Branch Executives"

then:

1. Session["UserID"] must be present.

2. UserID must be a valid positive integer.

3. The SQL query adds a district restriction.

4. Only records whose DistrictID exists in BranchExecutiveDistrictMapping for that UserID are returned.

SQL logic:

AND f.DistrictID IN

(

SELECT DistrictID

FROM BranchExecutiveDistrictMapping

WHERE UserId = @UserId

)

For users with other roles:

The BranchExecutiveDistrictMapping restriction is not applied.

Important:

The controller does not explicitly define what happens for an invalid or missing UserRole. Since only UserID is explicitly validated, the exact authentication behavior beyond the existing JwtSessionFilter is Not specified in controller.

=========================================================

DATABASE BEHAVIOR SUMMARY

=========================================================

Primary Database:

EnvisageDb connection string.

Connection string is obtained using:

ConfigurationManager.ConnectionStrings["EnvisageDb"].ConnectionString

Tables Read:

1. Format1\_1\_PUC

2. GenderMaster

3. CasteCategoryMaster

4. DistrictMaster

5. FatherOccupationMaster

6. MotherOccupationMaster

7. CourseMaster

8. CollegeTypeMaster

Table Used for Authorization Filtering:

9. BranchExecutiveDistrictMapping

Database Operations:

GET /list:

SELECT

POST /approve/{id}:

UPDATE Format1\_1\_PUC

POST /reject/{id}:

UPDATE Format1\_1\_PUC

DELETE /delete/{id}:

UPDATE Format1\_1\_PUC

Stored Procedures:

None used.

Transactions:

No explicit SQL transaction is used.

Duplicate Checks:

None implemented.

Foreign-Key Validation:

No explicit foreign-key validation is implemented in the controller.

Audit Fields:

No CreatedBy, ModifiedBy, or ModifiedDate fields are updated by the approve, reject, or delete operations.

User Audit:

Approve/reject/delete operations do not store the authenticated UserID in the supplied code.

=========================================================

FILE UPLOAD CONTRACT

=========================================================

Multipart/form-data:

Not used.

File upload endpoints:

None.

File upload fields:

None.

The GET /list endpoint only RETURNS file path properties:

\* StudentSelfiePath

\* SSLCMarksCardPath

\* FeeReceiptPath

\* BankPassbookPath

\* AadhaarCardPath

No file is uploaded, validated, renamed, replaced, or deleted by this controller.

Allowed file extensions:

Not specified in this controller.

Maximum file size:

Not specified in this controller.

Multiple files:

Not supported by any endpoint in this controller.

=========================================================

PAGINATION / SEARCH / SORTING

=========================================================

Pagination:

Not implemented.

Search:

Not implemented.

District query filter:

Not implemented as a client-supplied query parameter.

District filtering:

Implemented internally only for users whose Session["UserRole"] equals "Branch Executives".

Sorting:

Not implemented.

Date filtering:

Not implemented.

Status filtering:

Not implemented in GET /list.

Total records:

The list endpoint returns:

count

which contains the number of records returned in the data collection.

There is no separate database total count for pagination.

=========================================================

STATUS / APPROVAL BEHAVIOR

=========================================================

Record Status:

The DELETE endpoint performs:

Status = 0

This is a soft delete.

Approval Status:

Approve endpoint sets:

ApproveStatus = "Approved"

Reject endpoint sets:

ApproveStatus = "Rejected"

Remark:

Approve and Reject endpoints update:

Remark = supplied Remark

If Remark is null:

Remark = ""

Important:

Approve/reject operations do NOT modify Status.

Delete operation does NOT modify ApproveStatus.

Delete operation does NOT modify Remark.

=========================================================

HTTP STATUS CODE SUMMARY

=========================================================

200 OK:

Used for successful GET, approve, reject, and delete operations.

400 Bad Request:

Used when:

\* approve id <= 0

\* reject id <= 0

\* delete id <= 0

401 Unauthorized:

Explicitly returned by GET /list when:

\* Session["UserID"] is missing.

\* Session["UserID"] is not a valid positive integer.

The other endpoints rely on JwtSessionFilter for authentication rejection behavior.

403 Forbidden:

Not explicitly returned by controller actions.

May be produced by JwtSessionFilter depending on its implementation.

404 Not Found:

Used when:

\* approve ID does not match a database record.

\* reject ID does not match a database record.

\* delete ID does not match a database record.

GET /list does not return 404 for an empty result.

409 Conflict:

Not used by any supplied endpoint.

500 Internal Server Error:

Used when an exception occurs inside the controller's try/catch block.

Example:

{

"success": false,

"message": "Error message"

}

=========================================================

ENDPOINT QUICK REFERENCE

=========================================================

| # | Method | Route | JWT | Role Restriction | Operation |

|---|--------|-------|-----|------------------|-----------|

| 1 | GET | /api/format1-1-puc/list | Required | Branch Executives receive district filtering | SELECT |

| 2 | POST | /api/format1-1-puc/approve/{id} | Required | No explicit role restriction | UPDATE ApproveStatus |

| 3 | POST | /api/format1-1-puc/reject/{id} | Required | No explicit role restriction | UPDATE ApproveStatus |

| 4 | DELETE | /api/format1-1-puc/delete/{id} | Required | No explicit role restriction | Soft DELETE via Status = 0 |

=========================================================

IMPLEMENTATION NOTES / CONTRACT LIMITATIONS

=========================================================

1. The supplied controller is ASP.NET Web API 2 using ApiController.

2. Routing is action-level under /api/format1-1-puc.

3. JwtSessionFilter is applied directly to every action.

4. No endpoint in the supplied controller is intentionally public.

5. The exact implementation of JwtSessionFilter is not included, so the exact JWT signing algorithm, issuer, audience, expiration validation, claim names, and 401/403 behavior cannot be determined.

6. The exact implementation of Format1\_1PUCModel is not included, so model-level validation attributes cannot be determined.

7. The exact implementation of ApprovalRemarkRequest is not included, so any attributes such as [Required], [StringLength], or [MaxLength] cannot be determined.

8. No multipart/form-data request is implemented.

9. No dropdown APIs are implemented.

10. No stored procedures are used.

11. No explicit pagination is implemented.

12. No explicit sorting is implemented.

13. No explicit search is implemented.

14. No explicit duplicate checking is implemented.

15. No explicit role authorization is implemented for approve, reject, or delete.

16. The Branch Executive restriction is implemented as SQL filtering based on Session["UserID"].

17. GET /list validates the existence and numeric validity of Session["UserID"].

18. Approve, reject, and delete do not directly access Session values.

19. Soft deletion sets Status to 0 instead of physically deleting the database row.

20. GET /list does not filter Status, so soft-deleted records may still appear in the list.

21. No explicit audit information is recorded during approval, rejection, or deletion.

22. No explicit transaction is used for database updates.

23. No file upload or file validation is performed.

24. No default values are set during INSERT because this controller contains no INSERT operation.

25. No default page number or page size exists.

26. No default sorting exists.

27. No explicit HTTP 409 Conflict response exists.

28. No explicit HTTP 403 response exists in the controller.

29. Any additional authentication/authorization behavior supplied by JwtSessionFilter is outside the supplied controller and must be documented separately if the filter implementation is provided.

=========================================================

FINAL API CONTRACT SUMMARY

=========================================================

BASE ROUTE:

/api/format1-1-puc

TOTAL ENDPOINTS:

4

ENDPOINTS:

1. GET /api/format1-1-puc/list

JWT: Required

Operation: Retrieve Format 1.1 PUC students

Special logic: Branch Executive district filtering using Session UserID

2. POST /api/format1-1-puc/approve/{id}

JWT: Required

Operation: Set ApproveStatus = "Approved"

Request DTO: ApprovalRemarkRequest

3. POST /api/format1-1-puc/reject/{id}

JWT: Required

Operation: Set ApproveStatus = "Rejected"

Request DTO: ApprovalRemarkRequest

4. DELETE /api/format1-1-puc/delete/{id}

JWT: Required

Operation: Soft delete by setting Status = 0

No dropdown endpoints exist.

No multipart/form-data endpoints exist.

No file-upload endpoints exist.

No public endpoints exist based on the supplied controller.

No controller-level JWT filter exists.

JWT is explicitly applied at ACTION LEVEL through [JwtSessionFilter] on all four actions.