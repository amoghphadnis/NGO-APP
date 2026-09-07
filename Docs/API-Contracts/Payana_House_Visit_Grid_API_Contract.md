**API CONTRACT**

**Payana House Visit Grid API**

*VP\_PayanaHouseVisitGridApiController*

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/payana-house-visit-grid |
| Controller | VP\_PayanaHouseVisitGridApiController |
| Authentication | JWT Required on all four actions via action-level [JwtSessionFilter] |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |

Authentication scope is action-level, not controller-level. All four actions explicitly contain [JwtSessionFilter]. The controller also reads UserRole and, for Branch Executives, UserId from ASP.NET Session.

# 1. Get Payana House Visit Grid

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/payana-house-visit-grid/list |
| Purpose | Returns the active Payana House Visit grid records, including family-member data. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter | Action-level [JwtSessionFilter] |

## Authorization & Business Logic

* JWT Required: Yes. Expected header: Authorization: Bearer <JWT\_TOKEN>.
* UserRole is read from Session.
* If UserRole == 'Branch Executives', UserId is read from Session and must parse to an integer greater than 0; otherwise 401 Unauthorized is returned.
* Branch Executives are restricted to districts mapped to their UserId through BranchExecutiveDistrictMapping.
* No explicit JWT claim names are read directly; the controller depends on Session values, which are expected to be populated by the authentication/session mechanism.
* No explicit role requirement is enforced for roles other than the special Branch Executives filtering rule.

## Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No path or query parameters. |

## Request Body

None.

## Database Logic

* Reads HouseVisitForm (hv).
* LEFT JOINs PayanaStudents (ps) on StudentID.
* LEFT JOINs DistrictMaster (dm) on DistrictID.
* Always filters hv.Status = 1.
* For Branch Executives, INNER JOINs BranchExecutiveDistrictMapping and adds bedm.UserId = @UserId.
* Loads related PayanaFamilyMembers for every returned HouseVisitID.

## Success Response (200)

{
 "success": true,
 "count": 1,
 "data": [
 {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Example",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000",
 "Totalfamily": "4",
 "PrimaryIncomeSource": "Employment",
 "NatureofIncome": "Regular",
 "AverageIncome": 25000.00,
 "PrimaryEarning": "Example",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "AnyOutstandingLoans": "No",
 "OutstandingLoanAmount": "0",
 "MonthlyEMI": "0",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "Example",
 "Extracurricular": "Example",
 "ConsentParticipation": "Yes",
 "StudentAspiration": "Example",
 "StudentMotivation": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example",
 "SupervisorJustification": "Example",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "ApproveStatus": "Approved",
 "RejectionRemark": "",
 "VolunteerApprovalStatus": "Approved",
 "Upload": "example.pdf",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "HouseVisitID": 101,
 "StudentID": 5001,
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
 }
 ]
 }
 ]
}

## Validation / Status Codes

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Successful retrieval, including an empty data list. |
| 401 Unauthorized | Branch Executive role is detected but a valid positive UserId cannot be obtained from Session. |
| 500 Internal Server Error | Unhandled exception during Session access, database query, mapping, or family-member retrieval. |
| 403 Forbidden | Not explicitly returned by this action; may be produced by authentication infrastructure/filter if implemented there. |
| 400 Bad Request | Not explicitly returned. |
| 404 Not Found | Not explicitly returned. |
| 409 Conflict | Not explicitly returned. |

# 2. Approve House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/payana-house-visit-grid/approve/{id} |
| Purpose | Sets ApproveStatus to 'Approved' and stores the optional remark in RejectionRemark. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

{
 "Remark": "Approved after verification"
}

The body may be omitted/null. If request is null or Remark is null, the controller uses an empty string.

## Request DTO: StatusRequest

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Remark stored in RejectionRemark. Defaults to empty string when request/property is null. |

## Business / Database Logic

* Updates HouseVisitForm.
* Sets ApproveStatus = 'Approved'.
* Sets RejectionRemark to the supplied Remark, or empty string when omitted/null.
* Updates the row using HouseVisitID = @HouseVisitID.
* No status precondition or duplicate/previous-approval check is implemented.

## Success Response (200)

{
 "success": true,
 "message": "Payana House Visit approved successfully."
}

## Failure Responses

|  |  |  |
| --- | --- | --- |
| **Status** | **When** | **Example** |
| 400 Bad Request | id <= 0. | {"success":false,"message":"Invalid House Visit ID."} |
| 404 Not Found | UPDATE affects zero rows. | {"success":false,"message":"House Visit record not found."} |
| 500 Internal Server Error | Unhandled exception. | {"success":false,"message":"<exception message>"} |
| 401 Unauthorized | JWT filter rejects authentication, if applicable. | Filter-defined response; not specified here. |
| 403 Forbidden | Only if filter/infrastructure enforces authorization beyond what is visible. | Not specified in controller. |
| 409 Conflict | Not implemented. | Not used. |

# 3. Reject House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/payana-house-visit-grid/reject/{id} |
| Purpose | Sets ApproveStatus to 'Rejected' and stores the optional remark in RejectionRemark. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

{
 "Remark": "Required corrections"
}

The body may be omitted/null. If request is null or Remark is null, the controller uses an empty string.

## Business / Database Logic

* Updates HouseVisitForm.
* Sets ApproveStatus = 'Rejected'.
* Sets RejectionRemark to supplied Remark, or empty string when omitted/null.
* Updates by HouseVisitID.
* No status precondition or duplicate/previous-rejection check is implemented.

## Success Response (200)

{
 "success": true,
 "message": "Payana House Visit rejected successfully."
}

## Failure Responses

|  |  |  |
| --- | --- | --- |
| **Status** | **When** | **Example** |
| 400 Bad Request | id <= 0. | {"success":false,"message":"Invalid House Visit ID."} |
| 404 Not Found | UPDATE affects zero rows. | {"success":false,"message":"House Visit record not found."} |
| 500 Internal Server Error | Unhandled exception. | {"success":false,"message":"<exception message>"} |
| 401 Unauthorized | JWT filter rejects authentication, if applicable. | Filter-defined response; not specified. |
| 403 Forbidden | Only if filter/infrastructure enforces it. | Not specified. |
| 409 Conflict | Not implemented. | Not used. |

# 4. Delete / Soft Delete House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/payana-house-visit-grid/delete/{id} |
| Purpose | Soft-deletes a House Visit by setting its Status to 0. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

None.

## Business / Database Logic

* This is a soft delete, not a physical DELETE.
* Executes UPDATE HouseVisitForm SET Status = 0 WHERE HouseVisitID = @HouseVisitID.
* Family-member rows are not deleted.
* The grid endpoint subsequently excludes the record because it filters hv.Status = 1.

## Success Response (200)

{
 "success": true,
 "message": "Payana House Visit deleted successfully."
}

## Failure Responses

|  |  |  |
| --- | --- | --- |
| **Status** | **When** | **Example** |
| 400 Bad Request | id <= 0. | {"success":false,"message":"Invalid House Visit ID."} |
| 404 Not Found | UPDATE affects zero rows. | {"success":false,"message":"House Visit record not found."} |
| 500 Internal Server Error | Unhandled exception. | {"success":false,"message":"<exception message>"} |
| 401 Unauthorized | JWT filter rejects authentication, if applicable. | Filter-defined response; not specified. |
| 403 Forbidden | Only if filter/infrastructure enforces it. | Not specified. |
| 409 Conflict | Not implemented. | Not used. |

# COMMON DTOS

## 1. StatusRequest

Purpose: Request model used by Approve and Reject endpoints.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Optional remark. Null/missing request or Remark becomes an empty string. |

{
 "Remark": "Example remark"
}

## 2. HouseVisitGridDto

Purpose: Response model for the grid endpoint.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | No | No | House Visit identifier. |
| StudentID | int | No | No | Student identifier. |
| StudentName | string | No | Yes | Student name. |
| CourseInstitution | string | No | Yes | Course/institution. |
| Address | string | No | Yes | Address. |
| VisitDate | DateTime? | No | Yes | Nullable visit date. |
| FieldSupervisorName | string | No | Yes | Field supervisor name. |
| PersonsInteracted | string | No | Yes | Persons interacted with. |
| HouseType | string | No | Yes | House type. |
| Ownership | string | No | Yes | Ownership. |
| Rooms | string | No | Yes | Rooms. |
| Floor | string | No | Yes | Floor. |
| LatestElecBill | string | No | Yes | Latest electricity bill. |
| ElecUnitsCons | string | No | Yes | Electricity units consumed. |
| InternetBillCharges | string | No | Yes | Internet bill charges. |
| RemarkGeneralLivingCondition | string | No | Yes | General living condition remark. |
| RationCardType | string | No | Yes | Ration card type. |
| DigitalAccess | string | No | Yes | Digital access. |
| LivingCondition | string | No | Yes | Living condition. |
| Name | string | No | Yes | Family-member name mapped into the grid row. |
| Relation | string | No | Yes | Family-member relation. |
| Age | string | No | Yes | Family-member age. |
| Education | string | No | Yes | Family-member education. |
| Occupation | string | No | Yes | Family-member occupation. |
| MonthlyIncome | string | No | Yes | Family-member monthly income. |
| Totalfamily | string | No | Yes | Total family. |
| PrimaryIncomeSource | string | No | Yes | Primary income source. |
| NatureofIncome | string | No | Yes | Nature of income. |
| AverageIncome | decimal? | No | Yes | Nullable average income. |
| PrimaryEarning | string | No | Yes | Primary earning. |
| IncomeShocks | string | No | Yes | Income shocks. |
| AgriculturalLand | string | No | Yes | Agricultural land. |
| WaterSource | string | No | Yes | Water source. |
| CropPattern | string | No | Yes | Crop pattern. |
| OtherLandHoldings | string | No | Yes | Other land holdings. |
| TotalChildrenStudying | string | No | Yes | Total children studying. |
| AnnualEducationExpense | string | No | Yes | Annual education expense. |
| ScholarshipSupport | string | No | Yes | Scholarship support. |
| GovernmentSchemes | string | No | Yes | Government schemes. |
| EducationalLoanAmount | string | No | Yes | Educational loan amount. |
| AnyOutstandingLoans | string | No | Yes | Outstanding-loan indicator/details. |
| OutstandingLoanAmount | string | No | Yes | Outstanding loan amount. |
| MonthlyEMI | string | No | Yes | Monthly EMI. |
| HealthVulnerability | string | No | Yes | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Yes | Health vulnerability remarks. |
| Assets | string | No | Yes | Assets. |
| Extracurricular | string | No | Yes | Extracurricular information. |
| ConsentParticipation | string | No | Yes | Consent/participation. |
| StudentAspiration | string | No | Yes | Student aspiration. |
| StudentMotivation | string | No | Yes | Student motivation. |
| HouseholdVulnerabilityLevel | string | No | Yes | Household vulnerability level. |
| Recommendation | string | No | Yes | Recommendation. |
| SupervisorJustification | string | No | Yes | Supervisor justification. |
| DeclarationConfirmation | string | No | Yes | Declaration confirmation. |
| DeclarationDate | DateTime | Yes\* | No | Declaration date; controller uses DateTime and returns DateTime.MinValue when database value is NULL. |
| Upload | string | No | Yes | Stored upload filename(s). |
| ApproveStatus | string | No | Yes | Approval status. |
| RejectionRemark | string | No | Yes | Rejection remark. |
| VolunteerApprovalStatus | string | No | Yes | Volunteer approval status. |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related family members loaded separately. |

\* The DTO property itself is a non-nullable DateTime, but the database mapping explicitly substitutes DateTime.MinValue when the DB value is NULL. It is therefore not a client-request required field; it is a response mapping detail.

## 3. FamilyMemberDto

Purpose: Represents a PayanaFamilyMembers record returned inside each HouseVisitGridDto.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | No | No | Family member identifier. |
| HouseVisitID | int | No | No | House Visit identifier. |
| StudentID | int | No | No | Student identifier. |
| Name | string | No | Yes | Family member name. |
| Relation | string | No | Yes | Relation. |
| Age | string | No | Yes | Age. |
| Education | string | No | Yes | Education. |
| Occupation | string | No | Yes | Occupation. |
| MonthlyIncome | string | No | Yes | Monthly income. |

{
 "FamilyID": 1,
 "HouseVisitID": 101,
 "StudentID": 5001,
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
}

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Controller Behavior** |
| Tables | HouseVisitForm, PayanaStudents, DistrictMaster, BranchExecutiveDistrictMapping, PayanaFamilyMembers |
| SELECT | Grid selects active HouseVisitForm records and related district information; family members are selected by HouseVisitID. |
| UPDATE | Approve/Reject update ApproveStatus and RejectionRemark. Delete sets Status = 0. |
| INSERT | None. |
| DELETE | No physical DELETE statement. |
| Soft Delete | Yes — Status = 0. |
| Transactions | No explicit transaction. |
| Pagination | Not implemented. |
| Search/Sorting/Filters | No request-driven search, sorting, or query filters. Branch Executive district filtering is role/session based. |
| Duplicate Validation | Not implemented. |
| CreatedBy/ModifiedBy | Not populated in visible controller. |
| JWT Claims | Not directly read. Session UserRole/UserId are read. |
| Role Logic | Branch Executives receive only records in their mapped districts. |

# FINAL ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Route** | **JWT** | **Purpose** |
| 1 | GET | /api/payana-house-visit-grid/list | Required | List active Payana House Visits with family members. |
| 2 | POST | /api/payana-house-visit-grid/approve/{id} | Required | Approve a House Visit. |
| 3 | POST | /api/payana-house-visit-grid/reject/{id} | Required | Reject a House Visit. |
| 4 | POST | /api/payana-house-visit-grid/delete/{id} | Required | Soft-delete a House Visit by setting Status=0. |

# CONTRACT NOTES

* All four endpoints explicitly use [JwtSessionFilter]; authentication is therefore documented as currently implemented at action level.
* No controller-level JWT filter is claimed.
* No role is documented as universally required because the controller does not enforce a role gate. The Branch Executives role is explicitly handled for data filtering.
* All fields shown above are taken from the controller's DTOs/mappings. The controller does not provide [Required] attributes, length rules, enum restrictions, file rules, pagination, or duplicate validation.
* Where a behavior is not specified in the controller, it is marked accordingly rather than invented.