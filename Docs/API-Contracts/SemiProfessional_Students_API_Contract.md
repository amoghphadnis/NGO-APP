**API CONTRACT DOCUMENT**

**Semi-Professional Students API**

Document Scope: Complete contract for the controller api/semi-professional-students, based strictly on the supplied Web API implementation.

# BASE ROUTE

/api/semi-professional-students

|  |  |
| --- | --- |
| **Item** | **Specification** |
| Authentication | JWT Token Required |
| Authorization / Session Filter | JwtSessionFilter is applied to every endpoint |
| Content-Type | application/json |
| Database | EnvisageDb connection string |
| Controller | SemiProfessional\_StudentListController |

# 1. GET SEMI-PROFESSIONAL STUDENT LIST

**Endpoint:**

GET /api/semi-professional-students/list

**Purpose:**

Retrieves approved semi-professional students from both the normal application table and the imported Google Sheet table. The results can be searched by student name and filtered by district. Volunteer users are restricted to students assigned to their logged-in VolunteerID. The response also reports house-visit status.

**Content-Type:**

application/json

**Authorization:**

JWT Token Required. JwtSessionFilter must establish the user session.

## Path Parameters

None.

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| search | string | No | Optional student-name search. The API trims the value and performs a contains search using LIKE %search%. |
| districtId | integer | No | Optional DistrictID filter. Ignored when the logged-in user's role is Volunteer. |

## Request Body

None. This is a GET endpoint.

## Form Data / Multipart Fields

None.

## File Upload Fields

None.

## Validation Rules

• search is optional and may be null/empty.

• search is trimmed before being sent to SQL.

• districtId is optional and must be an integer when supplied.

• Only records with approval status 'Approved' are selected from both source tables.

• If the logged-in role is Volunteer, UserID must exist in HttpContext.Current.Session['UserID'].

• If Volunteer UserID is missing, the endpoint returns 401 Unauthorized.

• For Volunteer users, districtId is ignored and the result is filtered by VolunteerID from the session.

• No explicit maximum/minimum length validation is implemented for search.

• No explicit range validation is implemented for districtId.

## Business Logic Notes

• The API combines two data sources using UNION ALL.

• Normal records come from NewSemiProfessionalApplication and SemiProfessional\_StudentVolunteerAssignment.

• Imported records come from GoogleSheet\_SemiProfessional and SemiProfessional\_StudentVolunteerAssignment.

• Imported district names are matched to DistrictMaster after LTRIM/RTRIM normalization.

• Normal house-visit records are matched using SemiProfessional\_StudentID.

• Imported house-visit records are matched using ImportID.

• IsVisited is 1/true when a corresponding house-visit record exists; otherwise it is 0/false.

• CourseApplying is returned as CollegeName.

• FamilyIncome is nullable and imported FamilyIncomeMonthly is converted to decimal after removing the ₹ symbol and commas; TRY\_CONVERT is used.

• Imported SecuredPercentage12th is converted to decimal using TRY\_CONVERT and is returned as SecuredPercentage.

• Imported CETRank and PracticalTestRank are converted to integer values in SQL, but these fields are not exposed in the PayanaStudentListVM response.

• Place, Taluka and PinCode are not available in this implementation and are returned as empty strings.

• HouseVideoPath/HomeAddressGoogleMapLink is returned as HouseVisitLink.

• NULL string fields are mapped to empty strings.

• NULL FamilyIncome and PUPercentage values are mapped to nullable decimal values.

• Results are ordered by StudentName.

## Success Response (200)

{
 "success": true,
 "count": 2,
 "data": [
 {
 "StudentID": 101,
 "StudentName": "Rahul Kumar",
 "ContactNumber": "9876543210",
 "Address": "Bengaluru, Karnataka",
 "Place": "",
 "Taluka": "",
 "PinCode": "",
 "HouseVisitLink": "https://example.com/housevisit/101",
 "DistrictName": "Bengaluru Urban",
 "CollegeName": "B.Com",
 "FamilyIncome": 180000.00,
 "SecuredPercentage": 82.50,
 "IsVisited": true,
 "ApproveStatus": "Approved"
 },
 {
 "StudentID": 102,
 "StudentName": "Sneha Patil",
 "ContactNumber": "9988776655",
 "Address": "Belagavi, Karnataka",
 "Place": "",
 "Taluka": "",
 "PinCode": "",
 "HouseVisitLink": "",
 "DistrictName": "Belagavi",
 "CollegeName": "BBA",
 "FamilyIncome": 120000.00,
 "SecuredPercentage": 78.25,
 "IsVisited": false,
 "ApproveStatus": ""
 }
 ]
}

## Empty Result Response (200)

{
 "success": true,
 "count": 0,
 "data": []
}

## Volunteer Unauthorized Response (401)

{
 "success": false,
 "message": "User session not found."
}

## Failure Responses

|  |  |
| --- | --- |
| **Status Code** | **Meaning / Controller Behavior** |
| 400 Bad Request | Not explicitly returned by the controller. May occur at the framework/model-binding level for an invalid query parameter type, such as a non-integer districtId. |
| 401 Unauthorized | Explicitly returned when role is Volunteer and UserID is missing from the session. JWT/filter authentication failure may also result in 401. |
| 403 Forbidden | Not explicitly returned by this controller. |
| 404 Not Found | Not explicitly returned by this controller. |
| 409 Conflict | Not explicitly returned by this controller. |
| 500 Internal Server Error | Explicitly returned when an exception occurs. The exception message is returned in the response. |

**Example 500 Error:**

{
 "success": false,
 "message": "Error message"
}

## Status Codes Used

• 200 OK

• 401 Unauthorized

• 500 Internal Server Error

Framework-level responses that may be applicable: 400 Bad Request, 403 Forbidden, 404 Not Found, 409 Conflict.

# 2. GET DISTRICT LIST

**Endpoint:**

GET /api/semi-professional-students/districts

**Purpose:**

Retrieves all districts from DistrictMaster for use in the district dropdown/filter associated with the Semi-Professional Students list.

**Content-Type:**

application/json

**Authorization:**

JWT Token Required. JwtSessionFilter is applied.

## Path Parameters

None.

## Query Parameters

None.

## Request Body

None.

## Form Data / Multipart Fields

None.

## File Upload Fields

None.

## Validation Rules

• No request parameters are required.

• DistrictID is returned as an integer.

• DistrictName is returned as an empty string when the database value is NULL.

• Districts are ordered alphabetically by DistrictName.

• No role-specific filtering is implemented.

## Business Logic Notes

• Data is read directly from DistrictMaster.

• The endpoint returns every district available in DistrictMaster.

• The response is intended for a dropdown/filter.

• No request body is accepted.

## Success Response (200)

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
 "DistrictName": "Bengaluru Urban"
 },
 {
 "DistrictID": 3,
 "DistrictName": "Mysuru"
 }
 ]
}

## Empty Result Response (200)

{
 "success": true,
 "count": 0,
 "data": []
}

## Failure Responses

|  |  |
| --- | --- |
| **Status Code** | **Meaning / Controller Behavior** |
| 400 Bad Request | Not explicitly returned by the controller. |
| 401 Unauthorized | JWT/filter authentication may reject an unauthenticated request. |
| 403 Forbidden | Not explicitly returned by this controller. |
| 404 Not Found | Not explicitly returned by this controller. |
| 409 Conflict | Not explicitly returned by this controller. |
| 500 Internal Server Error | Returned when an exception occurs while retrieving districts. |

## Status Codes Used

• 200 OK

• 500 Internal Server Error

# COMMON DTOS

## 1. SemiProfessionalStudentListDTO

{
 "StudentID": 0,
 "StudentName": "",
 "ContactNumber": "",
 "Address": "",
 "Place": "",
 "Taluka": "",
 "PinCode": "",
 "HouseVisitLink": "",
 "DistrictName": "",
 "CollegeName": "",
 "FamilyIncome": 0.00,
 "SecuredPercentage": 0.00,
 "IsVisited": false,
 "ApproveStatus": ""
}

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Nullable / Optional** | **Description** |
| StudentID | integer | No | ApplicationID for normal records or ImportID for imported records. |
| StudentName | string | Yes | Student name; NULL is mapped to empty string. |
| ContactNumber | string | Yes | Student contact number. |
| Address | string | Yes | Residential address. |
| Place | string | Yes | Not available in this implementation; returned as empty string. |
| Taluka | string | Yes | Not available in this implementation; returned as empty string. |
| PinCode | string | Yes | Not available in this implementation; returned as empty string. |
| HouseVisitLink | string | Yes | House video/path/link from the relevant source. |
| DistrictName | string | Yes | District name from DistrictMaster. |
| CollegeName | string | Yes | Maps from CourseApplying. |
| FamilyIncome | decimal | Yes | Family income. Imported monthly value is converted using TRY\_CONVERT after removing ₹ and commas. |
| SecuredPercentage | decimal | Yes | Maps from PUPercentage / SecuredPercentage12th. |
| IsVisited | boolean | No | True when a matching house-visit record exists. |
| ApproveStatus | string | Yes | House-visit approval status; NULL is returned as empty string. |

## 2. DistrictDTO

{
 "DistrictID": 1,
 "DistrictName": "Belagavi"
}

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| DistrictID | integer | Yes | Unique district identifier. |
| DistrictName | string | No | District name; NULL database values are returned as empty string. |

# END OF API CONTRACT

This contract reflects the supplied controller implementation. No additional validation, authorization, pagination, sorting parameter, or DTO fields have been inferred beyond the code.