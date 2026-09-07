**API CONTRACTS
PROFESSIONAL / SEMI-PROFESSIONAL / PUC STUDENT LIST**

*House Visit Button Rules and API Navigation*

This document defines the student-list API contracts and explicitly documents when the House Visit action must be enabled, when it must be disabled, and the exact House Visit API call to be made when the user selects the action.

# 1. Professional Students

**Endpoint:** GET api/professional-students/list

**Authentication:** JWT authentication/session validation via JwtSessionFilter.

**Content-Type:** application/json

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Parameter** | **Type** | **Required** | **Description** |
| search | string | No | Optional student-name search. Applied as a LIKE filter. |
| districtId | integer | No | Optional district filter. The district filter is applied only when the caller is not a Volunteer. |

## House Visit Button Rule

The student-list response contains IsVisited. The frontend must use this field to control the House Visit action.

|  |  |  |
| --- | --- | --- |
| **IsVisited** | **House Visit Button** | **Frontend Action** |
| false | ENABLED | Allow the user to select/click House Visit. |
| true | DISABLED / COMPLETED | Do not allow creation of another House Visit from this action. |

**Important:** HouseVisitLink is NOT the House Visit Form URL. It is the student record's existing house/video/map link. It must not be used to decide whether the House Visit button is enabled.

## Exact API Call When House Visit Is Clicked

GET /api/housevisit/create?studentId={StudentID}&source=Professional

|  |  |
| --- | --- |
| **Field** | **Value** |
| HTTP Method | GET |
| Route | /api/housevisit/create |
| studentId | Use the selected student's StudentID returned by the list API. |
| source | Professional |
| Purpose | Fetch the student name/details required to initialize the House Visit form. |

## House Visit API Response Handling

If the GET House Visit endpoint succeeds, the client should open the House Visit form using the returned StudentID, StudentName and Source. The API itself does not perform an MVC browser redirect.

Example success response:

{
 "studentID": 123,
 "studentName": "Student Name",
 "source": "Professional"
}

## House Visit Submission

After the form is completed, submit the House Visit using:

**POST /api/housevisit/create**

Content-Type: multipart/form-data. The request contains source, StudentID, House Visit form fields, optional FamilyMembers JSON, UploadedFile document(s), and optional HousePhoto.

## Student List Response Fields Relevant to House Visit

|  |  |  |
| --- | --- | --- |
| **Field** | **Type** | **Description** |
| StudentID | integer | ApplicationID from the Professional student source is exposed as StudentID in the list response. |
| StudentName | string | Student name. |
| HouseVisitLink | string | Existing house/video/map link; NOT the House Visit form URL. |
| IsVisited | boolean | true when a House Visit record exists; false when no visit exists. |
| ApproveStatus | string | Approval status returned by the underlying student/house-visit data. |

## Role / Filtering Rules

For Volunteer users, the list is restricted to records assigned to the logged-in VolunteerID. Non-Volunteer users are not restricted by VolunteerID.

## Example Frontend Decision

if (student.IsVisited === false) { enable House Visit button; } else { disable House Visit button; }

## Error Handling

|  |  |  |
| --- | --- | --- |
| **HTTP Status** | **Condition** | **Expected Action** |
| 400 | Invalid StudentID, missing/invalid source, or invalid request. | Display validation message; do not open form. |
| 404 | Student not found for the supplied StudentID/source. | Display 'Student not found'; do not open form. |
| 401 | Authentication/session is missing or invalid where protected. | Require authentication. |
| 500 | Unexpected server/database error. | Display generic server error and log technical details. |

# 2. Semi-Professional Students

**Endpoint:** GET api/semi-professional-students/list

**Authentication:** JWT authentication/session validation via JwtSessionFilter.

**Content-Type:** application/json

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Parameter** | **Type** | **Required** | **Description** |
| search | string | No | Optional student-name search. Applied as a LIKE filter. |
| districtId | integer | No | Optional district filter. The supplied controller applies district filtering only when the caller is not a Volunteer. |

## House Visit Button Rule

The student-list response contains IsVisited. The frontend must use this field to control the House Visit action.

|  |  |  |
| --- | --- | --- |
| **IsVisited** | **House Visit Button** | **Frontend Action** |
| false | ENABLED | Allow the user to select/click House Visit. |
| true | DISABLED / COMPLETED | Do not allow creation of another House Visit from this action. |

**Important:** HouseVisitLink is NOT the House Visit Form URL. It is the student record's existing house/video/map link. It must not be used to decide whether the House Visit button is enabled.

## Exact API Call When House Visit Is Clicked

GET /api/housevisit/create?studentId={StudentID}&source=SemiProfessional

|  |  |
| --- | --- |
| **Field** | **Value** |
| HTTP Method | GET |
| Route | /api/housevisit/create |
| studentId | Use the selected student's StudentID returned by the list API. |
| source | SemiProfessional |
| Purpose | Fetch the student name/details required to initialize the House Visit form. |

## House Visit API Response Handling

If the GET House Visit endpoint succeeds, the client should open the House Visit form using the returned StudentID, StudentName and Source. The API itself does not perform an MVC browser redirect.

Example success response:

{
 "studentID": 123,
 "studentName": "Student Name",
 "source": "SemiProfessional"
}

## House Visit Submission

After the form is completed, submit the House Visit using:

**POST /api/housevisit/create**

Content-Type: multipart/form-data. The request contains source, StudentID, House Visit form fields, optional FamilyMembers JSON, UploadedFile document(s), and optional HousePhoto.

## Student List Response Fields Relevant to House Visit

|  |  |  |
| --- | --- | --- |
| **Field** | **Type** | **Description** |
| StudentID | integer | ApplicationID/ImportID is exposed as StudentID in the unified student-list response. |
| StudentName | string | Student name. |
| HouseVisitLink | string | Existing house/video/map link; NOT the House Visit form URL. |
| IsVisited | boolean | true when a House Visit record exists; false when no visit exists. |
| ApproveStatus | string | Approval status returned by the underlying student/house-visit data. |

## Role / Filtering Rules

For Volunteer users, the list is restricted to records assigned to the logged-in VolunteerID.

## Example Frontend Decision

if (student.IsVisited === false) { enable House Visit button; } else { disable House Visit button; }

## Error Handling

|  |  |  |
| --- | --- | --- |
| **HTTP Status** | **Condition** | **Expected Action** |
| 400 | Invalid StudentID, missing/invalid source, or invalid request. | Display validation message; do not open form. |
| 404 | Student not found for the supplied StudentID/source. | Display 'Student not found'; do not open form. |
| 401 | Authentication/session is missing or invalid where protected. | Require authentication. |
| 500 | Unexpected server/database error. | Display generic server error and log technical details. |

# 3. PUC Students

**Endpoint:** GET api/puc-students/list

**Authentication:** JWT authentication/session validation via JwtSessionFilter.

**Content-Type:** application/json

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Parameter** | **Type** | **Required** | **Description** |
| search | string | No | Optional student-name search. Applied as a LIKE filter. |
| districtId | integer | No | Use the PUC student-list controller's existing district filtering rules. |

## House Visit Button Rule

The student-list response contains IsVisited. The frontend must use this field to control the House Visit action.

|  |  |  |
| --- | --- | --- |
| **IsVisited** | **House Visit Button** | **Frontend Action** |
| false | ENABLED | Allow the user to select/click House Visit. |
| true | DISABLED / COMPLETED | Do not allow creation of another House Visit from this action. |

**Important:** HouseVisitLink is NOT the House Visit Form URL. It is the student record's existing house/video/map link. It must not be used to decide whether the House Visit button is enabled.

## Exact API Call When House Visit Is Clicked

GET /api/housevisit/create?studentId={StudentID}&source=PUC

|  |  |
| --- | --- |
| **Field** | **Value** |
| HTTP Method | GET |
| Route | /api/housevisit/create |
| studentId | Use the selected student's StudentID returned by the list API. |
| source | PUC |
| Purpose | Fetch the student name/details required to initialize the House Visit form. |

## House Visit API Response Handling

If the GET House Visit endpoint succeeds, the client should open the House Visit form using the returned StudentID, StudentName and Source. The API itself does not perform an MVC browser redirect.

Example success response:

{
 "studentID": 123,
 "studentName": "Student Name",
 "source": "PUC"
}

## House Visit Submission

After the form is completed, submit the House Visit using:

**POST /api/housevisit/create**

Content-Type: multipart/form-data. The request contains source, StudentID, House Visit form fields, optional FamilyMembers JSON, UploadedFile document(s), and optional HousePhoto.

## Student List Response Fields Relevant to House Visit

|  |  |  |
| --- | --- | --- |
| **Field** | **Type** | **Description** |
| StudentID | integer | The StudentID returned by the PUC student-list API must be passed unchanged to the House Visit API. |
| StudentName | string | Student name. |
| HouseVisitLink | string | Existing house/video/map link; NOT the House Visit form URL. |
| IsVisited | boolean | true when a House Visit record exists; false when no visit exists. |
| ApproveStatus | string | Approval status returned by the underlying student/house-visit data. |

## Role / Filtering Rules

Use the PUC student-list controller's existing role/assignment rules. The House Visit navigation rule is independent of the role filter.

## Example Frontend Decision

if (student.IsVisited === false) { enable House Visit button; } else { disable House Visit button; }

## Error Handling

|  |  |  |
| --- | --- | --- |
| **HTTP Status** | **Condition** | **Expected Action** |
| 400 | Invalid StudentID, missing/invalid source, or invalid request. | Display validation message; do not open form. |
| 404 | Student not found for the supplied StudentID/source. | Display 'Student not found'; do not open form. |
| 401 | Authentication/session is missing or invalid where protected. | Require authentication. |
| 500 | Unexpected server/database error. | Display generic server error and log technical details. |

# 4. Unified House Visit Navigation Flow

The following sequence is the required client-side behavior for all three student lists:

1. Call the appropriate student-list endpoint.

2. Read StudentID and IsVisited from each returned student record.

3. If IsVisited = false, render the House Visit action as enabled.

4. If IsVisited = true, render the action as disabled/completed.

5. When an enabled House Visit action is clicked, call GET /api/housevisit/create?studentId={StudentID}&source={PUC|Payana|Professional}.

6. Use the successful response to initialize/open the House Visit form.

7. Submit the completed form using POST /api/housevisit/create with multipart/form-data.

8. On successful creation, treat the House Visit as completed and refresh the student list so IsVisited becomes true.

# 5. Source Mapping

|  |  |  |  |
| --- | --- | --- | --- |
| **Student List** | **Source Value** | **House Visit GET** | **House Visit POST** |
| Professional | Professional | /api/housevisit/create?studentId={StudentID}&source=Professional | /api/housevisit/create |
| Semi-Professional | SemiProfessional | /api/housevisit/create?studentId={StudentID}&source=SemiProfessional | /api/housevisit/create |
| PUC | PUC | /api/housevisit/create?studentId={StudentID}&source=PUC | /api/housevisit/create |
| Payana | Payana | /api/housevisit/create?studentId={StudentID}&source=Payana | /api/housevisit/create |

Important implementation note: The currently supplied HouseVisitController accepts PUC, Payana and Professional as source values. It does NOT currently accept "SemiProfessional" in its source validation. Therefore the Semi-Professional student-list contract should not instruct the frontend to call the SemiProfessional House Visit route until the HouseVisitController is updated to support that source.

# 6. Current API Contract Limitation for Semi-Professional

The Semi-Professional student-list API can expose IsVisited, but the supplied HouseVisitController currently has no SemiProfessional branch. To support the same House Visit flow for Semi-Professional students, the HouseVisitController must be extended with the appropriate source/table mappings, including the SemiProfessional HouseVisit table and family-member table. Until that is done, the Semi-Professional House Visit button should remain disabled or be marked as not yet supported rather than calling an endpoint that will return an invalid-source error.

# 7. Recommended UI Labels

|  |  |
| --- | --- |
| **Condition** | **Suggested UI** |
| IsVisited = false | House Visit — Enabled |
| IsVisited = true | House Visit Completed — Disabled |
| Semi-Professional source not yet supported by HouseVisitController | House Visit — Not Available |