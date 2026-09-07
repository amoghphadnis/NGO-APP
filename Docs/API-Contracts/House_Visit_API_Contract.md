**HOUSE VISIT API CONTRACT**

**Student House Visit Creation and Button-Invocation Contract**

API Prefix: /api/housevisit

Authentication: JWT REQUIRED for House Visit APIs.

Content Types: application/json for GET responses; multipart/form-data for House Visit submission.

# 1. Purpose

This contract defines how the client application must determine whether to display the House Visit button and how it must open, pre-load, and submit the House Visit form. The House Visit button is controlled by the student's Visit status returned by the relevant student-list API. When Visit/IsVisited indicates that a House Visit is required, the client must allow the user to invoke the House Visit flow for that student.

# 2. House Visit Button / Visit Logic

|  |  |  |  |
| --- | --- | --- | --- |
| List Source | Source Value | Student Identifier | Button Rule |
| PUC Student List | PUC | StudentID | Show/enable House Visit when Visit = true / equivalent visit-required flag. |
| Semi-Professional Student List | SemiProfessional | StudentID/Application ID as defined by that list API | Show/enable House Visit when Visit = true / equivalent visit-required flag. |
| Professional Student List | Professional | ApplicationID | Show/enable House Visit when Visit = true / equivalent visit-required flag. |
| Payana Student List | Payana | StudentID | Show/enable House Visit when Visit = true / equivalent visit-required flag. |

Important: The House Visit API does not decide which list row displays the button. The list API must expose a visit-required/visit-status field. The frontend developer uses that field to render the House Visit button. The House Visit API is then invoked with the student identifier and source.

# 3. GET – Prepare House Visit Form

Endpoint: GET /api/housevisit/create?studentId={id}&source={source}

Purpose: Validate the selected student/source combination and return the student name/source needed to initialise the House Visit form.

JWT: REQUIRED

Allowed source values: PUC, Payana, Professional.

Note: The current controller does NOT yet support SemiProfessional. A SemiProfessional branch/table mapping must be added before the client can use source=SemiProfessional.

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| Parameter | Type | Required | Validation |
| studentId | integer | Yes | Must be greater than 0. |
| source | string | Yes | PUC, Payana, or Professional. Case-insensitive. |

## Response – 200 OK

{
 "studentID": 1,
 "studentName": "Student Name",
 "source": "Payana"
}

## Errors

* 400 Bad Request – Invalid Student ID.
* 400 Bad Request – Source is required.
* 400 Bad Request – Invalid Source.
* 404 Not Found – Student not found.
* 500 Internal Server Error – Server/database error.

# 4. POST – Submit House Visit

Endpoint: POST /api/housevisit/create

Purpose: Submit a completed House Visit form, including family-member details and uploaded documents/photos.

JWT: REQUIRED

Content-Type: multipart/form-data

Required multipart field: source

Required multipart field: StudentID (must be > 0)

Optional multipart JSON field: FamilyMembers

File fields: UploadedFile (one or more documents), HousePhoto (optional image; JPG/JPEG/PNG only).

# 5. Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| Field | Type | Required | Description / Validation |
| source | string | Yes | PUC / Payana / Professional. SemiProfessional requires controller support to be added. |
| StudentID | integer | Yes | Must be greater than 0. |
| StudentName | string | No | Student name. |
| CourseInstitution | string | No | Course/institution. |
| Address | string | No | House/address visited. |
| VisitDate | datetime | No | Date of house visit. |
| FieldSupervisorName | string | No | Field supervisor. |
| PersonsInteracted | string | No | Persons interacted with during visit. |
| HouseType | string | No | House type. |
| Ownership | string | No | Ownership status. |
| Rooms | string | No | Number/details of rooms. |
| Floor | string | No | Floor information. |
| RationCardType | string | No | Ration card type. |
| DigitalAccess | string | No | Digital access details. |
| LivingCondition | string | No | Living condition. |
| LatestElecBill | string | No | Latest electricity bill information. |
| ElecUnitsCons | string | No | Electricity units consumed. |
| InternetBillCharges | string | No | Internet bill/charges. |
| RemarkGeneralLivingCondition | string | No | General living-condition remarks. |
| Totalfamily | string | No | Total family information. |
| PrimaryEarning | string | No | Primary earning information. |
| AverageIncome | string | No | Average income. |
| OtherLandHoldings | string | No | Other land holdings. |
| TotalChildrenStudying | string | No | Children studying. |
| AnnualEducationExpense | string | No | Annual education expense. |
| ScholarshipSupport | string | No | Scholarship support. |
| GovernmentSchemes | string | No | Government schemes. |
| EducationalLoanAmount | string | No | Educational loan amount. |
| OutstandingLoanAmount | string | No | Outstanding loan amount. |
| MonthlyEMI | string | No | Monthly EMI. |
| HealthVulnerability | string | No | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Health vulnerability remarks. |
| Assets | string | No | Assets. |
| StudentAspiration | string | No | Student aspiration. |
| ConsentParticipation | string | No | Consent/participation. |
| Remarks | string | No | General remarks. |
| StudentMotivation | string | No | Student motivation. |
| SupervisorJustification | string | No | Supervisor justification. |
| DeclarationConfirmation | string | No | Declaration confirmation. |
| DeclarationDate | datetime | No | Declaration date. |
| PrimaryIncomeSource | string | No | Primary income source. |
| NatureofIncome | string | No | Nature of income. |
| IncomeShocks | string | No | Income shocks. |
| AgriculturalLand | string | No | Agricultural land. |
| WaterSource | string | No | Water source. |
| CropPattern | string | No | Crop pattern. |
| AnyOutstandingLoans | string | No | Outstanding loans. |
| Extracurricular | string | No | Extracurricular activities. |
| HouseholdVulnerabilityLevel | string | No | Household vulnerability level. |
| Recommendation | string | No | Recommendation. |
| VolunteerApprovalStatus | string | No | Volunteer approval status. |

# 6. FamilyMembers JSON

Send FamilyMembers as a multipart text field containing a JSON array.

[
 {
 "Name": "John",
 "Relation": "Father",
 "Age": "50",
 "Education": "10th",
 "Occupation": "Farmer",
 "MonthlyIncome": "15000"
 }
]

If supplied, the JSON must be valid. Invalid JSON returns 400 Bad Request.

# 7. File Upload Contract

|  |  |  |  |
| --- | --- | --- | --- |
| Field | Multiplicity | Allowed Type | Rule |
| UploadedFile | One or more | Any file type currently accepted by controller | Files are saved under HouseDocUploads and stored as comma-separated file names. |
| HousePhoto | Zero or one | JPG, JPEG, PNG only | Invalid extension returns 400 Bad Request. |

# 8. POST Success Response – 200 OK

{
 "success": true,
 "message": "House visit created successfully.",
 "houseVisitID": 123,
 "redirectController": "PayanaStudents",
 "redirectAction": "StudentList"
}

The redirectController is returned according to source. The client may use it for navigation, but the API contract does not require the client to perform a server-side MVC redirect.

# 9. POST Error Responses

* 400 Bad Request – Request must be multipart/form-data.
* 400 Bad Request – Source is required.
* 400 Bad Request – Invalid Source.
* 400 Bad Request – Valid StudentID is required.
* 400 Bad Request – Invalid FamilyMembers JSON format.
* 400 Bad Request – Only JPG, JPEG and PNG images are allowed for HousePhoto.
* 500 Internal Server Error – Database/file/transaction error.

# 10. Client-Side House Visit Flow

1. Call the appropriate student-list API.
2. Read the Visit / IsVisited / visit-required flag returned for each student.
3. If the flag is true (or the API's documented equivalent means House Visit is required), display/enable the House Visit button.
4. When the user clicks House Visit, pass the student's identifier and the correct source value.
5. Call GET /api/housevisit/create?studentId={id}&source={source} to validate and obtain the student name.
6. Open the House Visit form and populate the returned StudentID, StudentName and Source.
7. Submit the completed form using POST /api/housevisit/create as multipart/form-data.
8. Include FamilyMembers as JSON text if family-member rows are present.
9. Attach UploadedFile and HousePhoto using their exact multipart field names.
10. On successful submission, refresh the student list so the Visit status/button is updated.

# 11. Critical Source Mapping

|  |  |  |  |
| --- | --- | --- | --- |
| Source | Student Table | Identifier | House Visit Table |
| PUC | New\_Students | StudentID | HouseVisitForm\_PUC |
| Payana | PayanaStudents | StudentID | HouseVisitForm |
| Professional | NewProfessionalApplication | ApplicationID | HouseVisitForm\_Professional |
| SemiProfessional | NOT IMPLEMENTED IN CURRENT CONTROLLER | Must be defined | Must be defined |

IMPORTANT IMPLEMENTATION NOTE: The supplied HouseVisitController currently supports only PUC, Payana and Professional. It does not contain a SemiProfessional source branch. Because the requirement is for House Visit to be available from PUC, SemiProfessional, Professional and Payana lists, the backend must add the SemiProfessional mapping before the frontend is expected to invoke this API for SemiProfessional students.

# 12. Authentication and Authorization

House Visit endpoints should be protected with the same JWT/session authentication mechanism used by the application's authenticated APIs. The JWT must be supplied in the Authorization header:

Authorization: Bearer <JWT\_TOKEN>

The token must identify the logged-in user. Volunteer users must only be able to create House Visits for students they are permitted to access according to the application's existing district/assignment rules. The current supplied controller does not itself perform this student-level authorization check; that should be enforced before production use.

# 13. Developer Acceptance Criteria

* House Visit button is not shown/enabled merely because a student exists; it is controlled by the list API's Visit-required status.
* Correct source is always sent with the House Visit request.
* Volunteer users can access only the student-list functionality permitted to them, plus the House Visit flow for permitted students.
* GET create validates student/source before the form is submitted.
* POST create uses multipart/form-data.
* FamilyMembers is sent as a valid JSON array when family members are entered.
* HousePhoto accepts only JPG/JPEG/PNG.
* After successful creation, the client refreshes the list and reflects the new visit status.
* SemiProfessional support must be added to the backend before its House Visit button is wired to this contract.

# 14. Quick API Summary

|  |  |  |  |
| --- | --- | --- | --- |
| Method | Endpoint | JWT | Purpose |
| GET | /api/housevisit/create?studentId={id}&source={source} | Yes | Validate student/source and initialise House Visit form. |
| POST | /api/housevisit/create | Yes | Create House Visit and save family members/files. |

**End of House Visit API Contract**