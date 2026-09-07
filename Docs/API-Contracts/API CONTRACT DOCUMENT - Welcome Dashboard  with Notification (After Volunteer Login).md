=========================================================

API CONTRACT DOCUMENT

=========================================================

API Module:

Welcome Dashboard / Notifications

Base Route:

api/welcome-dashboard

Controller:

WelcomeDashboardController

Authentication:

JWT-based authentication is required for all endpoints in this controller.

The JwtSessionFilter populates the logged-in user's information into the server-side session.

Content Type:

application/json

Notes:

- These APIs are notification/count APIs.

- No request body is required.

- No path parameters are used.

- No query parameters are used.

- The APIs return notification counts only.

- User-specific notification counts are calculated using the logged-in user's JWT/session information where applicable.

=========================================================

1. GET NOTIFICATIONS

=========================================================

Endpoint:

GET /api/welcome-dashboard/notifications

Purpose:

Returns notification counts for the logged-in user.

The endpoint provides pending counts for:

- PUC student applications

- Payana student applications

- Professional student applications

- PUC house visits

- Payana house visits

- PUC renewals

- Payana renewals

- Approved PUC students whose house visit is pending

- Approved Payana students whose house visit is pending

Authorization:

JWT Token Required

Authentication Mechanism:

JwtSessionFilter

The JWT/session is used to obtain:

- UserID

- UserRole

- District

- OtherDistrict

- DistrictID

Content-Type:

application/json

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not use path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not use query parameters. |

Request Body:

No request body is required.

Example:

{}

Important:

The logged-in user's identity and district information are obtained from the JWT/session and are NOT supplied by the client.

Validation Rules:

1. JWT authentication is required.

2. JwtSessionFilter must successfully authenticate the request.

3. UserID is obtained from:

Session["UserID"]

4. UserRole is obtained from:

Session["UserRole"]

5. District is obtained from:

Session["District"]

6. OtherDistrict is obtained from:

Session["OtherDistrict"]

7. DistrictID is first obtained from:

Session["DistrictID"]

8. If Session["DistrictID"] is unavailable or <= 0, the API attempts to resolve DistrictID using DistrictMaster:

DistrictName = Session["District"]

9. If DistrictID still resolves to 0, the API returns all notification counts as zero.

10. No client-supplied DistrictID is accepted.

11. No client-supplied UserID is accepted.

12. No client-supplied role is accepted.

13. Notification counts are calculated directly from the database.

Business Logic Notes:

1. District Resolution:

The API first checks Session["DistrictID"].

If a valid DistrictID exists:

DistrictID = Session["DistrictID"]

Otherwise, if a district name exists:

SELECT DistrictID

FROM DistrictMaster

WHERE DistrictName = @District

is executed.

2. No DistrictID:

If DistrictID is 0 after the above resolution, the API immediately returns:

- pendingPUC = 0

- pendingPayana = 0

- pendingProfessional = 0

- pendingHousePUC = 0

- pendingHousePayana = 0

- pendingPUCRenewal = 0

- pendingPayanaRenewal = 0

- pendingVisitPUC = 0

- pendingVisitPayana = 0

- totalPending = 0

3. PUC Pending Applications:

Counts records from New\_Students where:

ApprovalStatus IS NULL

and the student's district is mapped to the logged-in user through:

BranchExecutiveDistrictMapping

using:

UserId = logged-in UserID

4. Payana Pending Applications:

Counts records from PayanaStudents where:

ApproveStatus IS NULL

and the student's district is mapped to the logged-in user.

5. Professional Pending Applications:

Counts records from NewProfessionalApplication where:

ApproveStatus IS NULL

and the application's district is mapped to the logged-in user.

6. PUC House Visit Pending:

Counts HouseVisitForm\_PUC records where:

ApproveStatus IS NULL

The PUC student is joined through:

HouseVisitForm\_PUC.PUC\_StudentID

-> New\_Students.StudentID

The student's district must be mapped to the logged-in user.

7. Payana House Visit Pending:

Counts HouseVisitForm records where:

ApproveStatus IS NULL

The Payana student is joined through:

HouseVisitForm.StudentID

-> PayanaStudents.StudentID

The student's district must be mapped to the logged-in user.

8. PUC Renewal Pending:

Counts RenewalPUC records where:

ApproveStatus IS NULL

and:

RenewalPUC.District

exists in the districts mapped to the logged-in user.

9. Payana Renewal Pending:

Counts PayanaRenewal records where:

ApproveStatus IS NULL

and:

PayanaRenewal.District

exists in the districts mapped to the logged-in user.

10. Payana House Visit Not Visited:

Counts approved Payana students who:

- have a volunteer assignment

- have ApproveStatus = "Approved"

- have no corresponding HouseVisitForm record

- belong to the resolved DistrictID

The relevant condition is:

hv.StudentID IS NULL

11. PUC House Visit Not Visited:

Counts approved PUC students who:

- have a volunteer assignment

- have ApprovalStatus = "Approved"

- have no corresponding HouseVisitForm\_PUC record

- belong to the resolved DistrictID

The relevant condition is:

hv.PUC\_StudentID IS NULL

12. Total Pending:

The API calculates:

totalPending =

pendingPUC

+ pendingPayana

+ pendingProfessional

+ pendingHousePUC

+ pendingHousePayana

+ pendingPUCRenewal

+ pendingPayanaRenewal

+ pendingVisitPUC

+ pendingVisitPayana

Success Response (200):

Example:

{

"success": true,

"notifications": {

"pendingPUC": 5,

"pendingPayana": 8,

"pendingProfessional": 2,

"pendingHousePUC": 3,

"pendingHousePayana": 4,

"pendingPUCRenewal": 1,

"pendingPayanaRenewal": 2,

"pendingVisitPUC": 6,

"pendingVisitPayana": 7

},

"totalPending": 38

}

Success Response When DistrictID Is Not Available (200):

{

"success": true,

"notifications": {

"pendingPUC": 0,

"pendingPayana": 0,

"pendingProfessional": 0,

"pendingHousePUC": 0,

"pendingHousePayana": 0,

"pendingPUCRenewal": 0,

"pendingPayanaRenewal": 0,

"pendingVisitPUC": 0,

"pendingVisitPayana": 0

},

"totalPending": 0

}

Response Field Description:

| Field | Type | Description |

|-------|------|-------------|

| success | boolean | Indicates whether the API request was successfully processed. |

| notifications | object | Contains all individual notification counts. |

| notifications.pendingPUC | integer | Number of pending PUC student applications. |

| notifications.pendingPayana | integer | Number of pending Payana student applications. |

| notifications.pendingProfessional | integer | Number of pending professional student applications. |

| notifications.pendingHousePUC | integer | Number of pending PUC house visit approvals. |

| notifications.pendingHousePayana | integer | Number of pending Payana house visit approvals. |

| notifications.pendingPUCRenewal | integer | Number of pending PUC renewal applications. |

| notifications.pendingPayanaRenewal | integer | Number of pending Payana renewal applications. |

| notifications.pendingVisitPUC | integer | Number of approved PUC students who have not yet received a house visit. |

| notifications.pendingVisitPayana | integer | Number of approved Payana students who have not yet received a house visit. |

| totalPending | integer | Sum of all notification counts. |

Failure Responses:

400 Bad Request:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Bad request."

}

401 Unauthorized:

Returned by the authentication layer/filter if the JWT token is missing, invalid, expired, or authentication fails.

Example:

{

"success": false,

"message": "Unauthorized."

}

403 Forbidden:

Not explicitly returned by this controller method.

May be returned by the authentication/authorization infrastructure if the authenticated user is not permitted to access the endpoint.

Example:

{

"success": false,

"message": "Forbidden."

}

404 Not Found:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Resource not found."

}

409 Conflict:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Conflict."

}

500 Internal Server Error:

Returned when an unhandled exception occurs during database access or notification processing.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 500 Internal Server Error

Authentication-related status codes may also be generated by JwtSessionFilter/framework infrastructure:

- 401 Unauthorized

- 403 Forbidden

The controller itself does not explicitly return 400, 403, 404, or 409.

=========================================================

2. GET ADMIN NOTIFICATIONS

=========================================================

Endpoint:

GET /api/welcome-dashboard/admin-notifications

Purpose:

Returns overall notification counts for the administrator dashboard.

Unlike the user-specific /notifications endpoint, this endpoint does NOT filter notification counts by the logged-in user's district or UserID.

It returns global counts for:

- PUC student applications

- Payana student applications

- Professional student applications

- PUC house visits

- Payana house visits

- PUC renewals

- Payana renewals

Authorization:

JWT Token Required

Authentication Mechanism:

JwtSessionFilter

Content-Type:

application/json

Path Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not use path parameters. |

Query Parameters:

| Name | Type | Required | Description |

|------|------|----------|-------------|

| None | - | No | This endpoint does not use query parameters. |

Request Body:

No request body is required.

Example:

{}

Form Data / Multipart Fields:

None.

File Upload Fields:

None.

Validation Rules:

1. JWT authentication is required.

2. JwtSessionFilter must successfully authenticate the request.

3. No request parameters are required.

4. No request body is required.

5. The API does not accept a UserID from the client.

6. The API does not accept a DistrictID from the client.

7. The API does not apply a district filter.

8. The API counts all applicable records in the database.

Business Logic Notes:

1. PUC Pending:

Counts all records from:

New\_Students

where:

ApprovalStatus IS NULL

2. Payana Pending:

Counts all records from:

PayanaStudents

where:

ApproveStatus IS NULL

3. Professional Pending:

Counts all records from:

NewProfessionalApplication

where:

ApproveStatus IS NULL

4. PUC House Visit Pending:

Counts all records from:

HouseVisitForm\_PUC

where:

ApproveStatus IS NULL

5. Payana House Visit Pending:

Counts all records from:

HouseVisitForm

where:

ApproveStatus IS NULL

6. PUC Renewal Pending:

Counts all records from:

RenewalPUC

where:

ApproveStatus IS NULL

7. Payana Renewal Pending:

Counts all records from:

PayanaRenewal

where:

ApproveStatus IS NULL

8. No District Filtering:

This endpoint intentionally does not use:

- UserID

- DistrictID

- District mapping

- UserRole

Therefore the returned counts represent global pending notifications.

Success Response (200):

Example:

{

"success": true,

"notifications": {

"pendingPUC": 25,

"pendingPayana": 30,

"pendingProfessional": 8,

"pendingHousePUC": 12,

"pendingHousePayana": 15,

"pendingPUCRenewal": 6,

"pendingPayanaRenewal": 9

},

"totalPending": 105

}

Response Field Description:

| Field | Type | Description |

|-------|------|-------------|

| success | boolean | Indicates whether the API request was successfully processed. |

| notifications | object | Contains all administrator notification counts. |

| notifications.pendingPUC | integer | Number of all pending PUC student applications. |

| notifications.pendingPayana | integer | Number of all pending Payana student applications. |

| notifications.pendingProfessional | integer | Number of all pending professional student applications. |

| notifications.pendingHousePUC | integer | Number of all pending PUC house visits. |

| notifications.pendingHousePayana | integer | Number of all pending Payana house visits. |

| notifications.pendingPUCRenewal | integer | Number of all pending PUC renewals. |

| notifications.pendingPayanaRenewal | integer | Number of all pending Payana renewals. |

| totalPending | integer | Sum of all seven notification counts. |

Failure Responses:

400 Bad Request:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Bad request."

}

401 Unauthorized:

Returned by the authentication layer/filter if the JWT token is missing, invalid, expired, or authentication fails.

Example:

{

"success": false,

"message": "Unauthorized."

}

403 Forbidden:

Not explicitly returned by this controller method.

May be returned by the authentication/authorization infrastructure if the authenticated user is not permitted to access the endpoint.

Example:

{

"success": false,

"message": "Forbidden."

}

404 Not Found:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Resource not found."

}

409 Conflict:

Not explicitly returned by this controller method.

Example:

{

"success": false,

"message": "Conflict."

}

500 Internal Server Error:

Returned when an exception occurs during database access or notification processing.

Example:

{

"success": false,

"message": "Error message"

}

Status Codes Used:

- 200 OK

- 500 Internal Server Error

Authentication-related status codes may also be generated by JwtSessionFilter/framework infrastructure:

- 401 Unauthorized

- 403 Forbidden

The controller itself does not explicitly return 400, 403, 404, or 409.

=========================================================

COMMON API BEHAVIOR

=========================================================

Authentication:

Both endpoints use:

[JwtSessionFilter]

Therefore a valid JWT token is required.

The controller does not accept UserID, DistrictID, UserRole, District, or OtherDistrict as request parameters.

These values are obtained from the authenticated user's server-side session populated by JwtSessionFilter.

Common Request Headers:

| Header | Required | Description |

|--------|----------|-------------|

| Authorization | Yes | JWT bearer token used to authenticate the user. |

| Content-Type | No request body | application/json is the expected API content type. |

Typical Authorization Header:

Authorization: Bearer <JWT\_TOKEN>

No Path Parameters:

Neither endpoint has path parameters.

No Query Parameters:

Neither endpoint has query parameters.

No Request Body:

Neither endpoint accepts a request body.

No Form Data:

Neither endpoint accepts multipart/form-data.

No File Upload:

Neither endpoint accepts file uploads.

=========================================================

NOTIFICATION DEFINITIONS

=========================================================

| Notification | Source | Condition |

|--------------|--------|-----------|

| pendingPUC | New\_Students | ApprovalStatus IS NULL |

| pendingPayana | PayanaStudents | ApproveStatus IS NULL |

| pendingProfessional | NewProfessionalApplication | ApproveStatus IS NULL |

| pendingHousePUC | HouseVisitForm\_PUC | ApproveStatus IS NULL |

| pendingHousePayana | HouseVisitForm | ApproveStatus IS NULL |

| pendingPUCRenewal | RenewalPUC | ApproveStatus IS NULL |

| pendingPayanaRenewal | PayanaRenewal | ApproveStatus IS NULL |

| pendingVisitPUC | StudentVolunteerAssignment + New\_Students + HouseVisitForm\_PUC | Student approved and no house visit exists |

| pendingVisitPayana | Payana\_StudentVolunteerAssignment + PayanaStudents + HouseVisitForm | Student approved and no house visit exists |

=========================================================

SECURITY / ACCESS CONTROL NOTES

=========================================================

1. Both endpoints are protected by JwtSessionFilter.

2. /notifications is user/district scoped.

3. /notifications uses BranchExecutiveDistrictMapping for the following notification categories:

- PUC

- Payana

- Professional

- PUC House Visit

- Payana House Visit

- PUC Renewal

- Payana Renewal

4. /notifications uses the resolved DistrictID for:

- Pending PUC house visits not yet visited

- Pending Payana house visits not yet visited

5. /admin-notifications does not apply district mapping.

6. /admin-notifications returns global counts.

7. UserRole is read by /notifications but is not directly used in the SQL filtering logic.

8. OtherDistrict is read by /notifications but is not directly used after retrieval.

9. The client cannot override the logged-in user's UserID or DistrictID through request parameters.

=========================================================

COMMON DTOS

=========================================================

Note:

The controller does not define dedicated C# DTO classes for these responses. The responses are anonymous objects created directly inside IHttpActionResult.

The following DTO representations describe the JSON contracts exposed by the controller.

---------------------------------------------------------

Common DTO 1: NotificationCountsDto

---------------------------------------------------------

{

"pendingPUC": 0,

"pendingPayana": 0,

"pendingProfessional": 0,

"pendingHousePUC": 0,

"pendingHousePayana": 0,

"pendingPUCRenewal": 0,

"pendingPayanaRenewal": 0,

"pendingVisitPUC": 0,

"pendingVisitPayana": 0

}

Fields:

| Field | Type | Nullable | Description |

|-------|------|----------|-------------|

| pendingPUC | integer | No | Pending PUC student applications. |

| pendingPayana | integer | No | Pending Payana student applications. |

| pendingProfessional | integer | No | Pending professional student applications. |

| pendingHousePUC | integer | No | Pending PUC house visit approvals. |

| pendingHousePayana | integer | No | Pending Payana house visit approvals. |

| pendingPUCRenewal | integer | No | Pending PUC renewal applications. |

| pendingPayanaRenewal | integer | No | Pending Payana renewal applications. |

| pendingVisitPUC | integer | No | Approved PUC students without a house visit. |

| pendingVisitPayana | integer | No | Approved Payana students without a house visit. |

---------------------------------------------------------

Common DTO 2: AdminNotificationCountsDto

---------------------------------------------------------

{

"pendingPUC": 0,

"pendingPayana": 0,

"pendingProfessional": 0,

"pendingHousePUC": 0,

"pendingHousePayana": 0,

"pendingPUCRenewal": 0,

"pendingPayanaRenewal": 0

}

Fields:

| Field | Type | Nullable | Description |

|-------|------|----------|-------------|

| pendingPUC | integer | No | Global pending PUC student applications. |

| pendingPayana | integer | No | Global pending Payana student applications. |

| pendingProfessional | integer | No | Global pending professional student applications. |

| pendingHousePUC | integer | No | Global pending PUC house visit approvals. |

| pendingHousePayana | integer | No | Global pending Payana house visit approvals. |

| pendingPUCRenewal | integer | No | Global pending PUC renewal applications. |

| pendingPayanaRenewal | integer | No | Global pending Payana renewal applications. |

---------------------------------------------------------

Common DTO 3: NotificationsResponseDto

---------------------------------------------------------

{

"success": true,

"notifications": {

"pendingPUC": 5,

"pendingPayana": 8,

"pendingProfessional": 2,

"pendingHousePUC": 3,

"pendingHousePayana": 4,

"pendingPUCRenewal": 1,

"pendingPayanaRenewal": 2,

"pendingVisitPUC": 6,

"pendingVisitPayana": 7

},

"totalPending": 38

}

Fields:

| Field | Type | Nullable | Description |

|-------|------|----------|-------------|

| success | boolean | No | Indicates whether the operation succeeded. |

| notifications | object | No | NotificationCountsDto object. |

| totalPending | integer | No | Total number of notifications. |

---------------------------------------------------------

Common DTO 4: AdminNotificationsResponseDto

---------------------------------------------------------

{

"success": true,

"notifications": {

"pendingPUC": 25,

"pendingPayana": 30,

"pendingProfessional": 8,

"pendingHousePUC": 12,

"pendingHousePayana": 15,

"pendingPUCRenewal": 6,

"pendingPayanaRenewal": 9

},

"totalPending": 105

}

Fields:

| Field | Type | Nullable | Description |

|-------|------|----------|-------------|

| success | boolean | No | Indicates whether the operation succeeded. |

| notifications | object | No | AdminNotificationCountsDto object. |

| totalPending | integer | No | Total number of global pending notifications. |

---------------------------------------------------------

Common DTO 5: ErrorResponseDto

---------------------------------------------------------

{

"success": false,

"message": "Error message"

}

Fields:

| Field | Type | Nullable | Description |

|-------|------|----------|-------------|

| success | boolean | No | Always false for controller-generated errors. |

| message | string | No | Error description. |

=========================================================

END OF API CONTRACT

=========================================================