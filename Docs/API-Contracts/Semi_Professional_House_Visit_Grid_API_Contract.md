**API CONTRACT**

**Semi-Professional House Visit Grid API**

*VP\_SemiProfessionalHouseVisitGridApiController*

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/semi-professional-house-visits |
| Controller | VP\_SemiProfessionalHouseVisitGridApiController |
| Framework | ASP.NET Web API 2 (ApiController) |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT filter applied at action level to every endpoint in this controller |

The controller contains four endpoints. All four explicitly use [JwtSessionFilter]. The list endpoint additionally reads UserRole and UserId from HttpContext.Current.Session and applies a Branch Executives district restriction.

# ENDPOINT SUMMARY

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Roles / Restrictions** | **Purpose** |
| 1 | GET | /api/semi-professional-house-visits/list | Required | Branch Executives: district restriction via mapped UserId | List active Semi-Professional House Visits with family members. |
| 2 | POST | /api/semi-professional-house-visits/{id}/approve | Required | No explicit role gate in action | Approve a Semi-Professional House Visit. |
| 3 | POST | /api/semi-professional-house-visits/{id}/reject | Required | No explicit role gate in action | Reject a Semi-Professional House Visit. |
| 4 | DELETE | /api/semi-professional-house-visits/{id} | Required | No explicit role gate in action | Soft-delete a Semi-Professional House Visit by setting Status=0. |

# 1. Semi-Professional House Visit List

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/semi-professional-house-visits/list |
| Purpose | Returns active Semi-Professional House Visit records and loads related SemiProfessionalFamilyMembers for each record. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected authorization format: Authorization: Bearer <JWT\_TOKEN>.
* Filter is applied at action level.
* UserRole is read from HttpContext.Current.Session['UserRole'].
* UserId is read from HttpContext.Current.Session['UserId'].
* For role 'Branch Executives', UserId must exist, parse successfully to int, and be > 0; otherwise 401 Unauthorized.
* Branch Executives are restricted to records whose student's DistrictID is mapped to the authenticated UserId through BranchExecutiveDistrictMapping.
* No explicit role restriction is applied for other roles in this action.
* JWT claim names themselves are not decoded in this controller; it depends on Session values populated by the existing authentication/session mechanism.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No path parameters. |

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No query, search, pagination, sorting, or date-filter parameters are defined. |

## Request Body

None.

## Validation Rules

* Branch Executives: authenticated UserId is mandatory and must be a positive integer.
* Only HouseVisitForm\_SemiProfessional records with Status = 1 are returned.
* No client-supplied district filter exists.
* No pagination or page-size validation exists.
* No duplicate validation is implemented.

## Business Logic / Database Behavior

* Reads HouseVisitForm\_SemiProfessional as hv.
* LEFT JOINs SemiProfessionalStudents using hv.SemiProfessional\_StudentID = ps.StudentID.
* LEFT JOINs DistrictMaster using ps.DistrictID = dm.DistrictID.
* For Branch Executives, INNER JOINs BranchExecutiveDistrictMapping on ps.DistrictID = bedm.DistrictID and filters bedm.UserId = @UserId.
* Always filters hv.Status = 1.
* Maps SemiProfessional\_StudentID to the API property StudentID.
* Maps DistrictName into HouseVisitDto.
* Loads related SemiProfessionalFamilyMembers separately for each HouseVisitID.
* Returns success=true, count=list.Count, and data=list.

## Success Response (200)

{
 "success": true,
 "count": 1,
 "data": [
 {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "DistrictName": "Example District",
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Owned",
 "Ownership": "Self",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example",
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
 "PrimaryEarning": "Employment",
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
 "Remarks": "Example",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "Upload": "example.pdf",
 "ApproveStatus": "Pending",
 "RejectionRemark": "",
 "VolunteerApprovalStatus": "Pending",
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

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Successful retrieval, including when no active records are found (count may be 0). |
| 401 Unauthorized | Explicitly returned when role is Branch Executives and UserId is missing, invalid, or <= 0. |
| 403 Forbidden | Not explicitly returned by the action; may be handled by authentication infrastructure if configured. |
| 400 Bad Request | Not explicitly returned by this action. |
| 404 Not Found | Not explicitly returned; empty list is a successful 200 response. |
| 409 Conflict | Not used. |
| 500 Internal Server Error | Unhandled exception; response contains success=false and the exception message. |

# 2. Approve Semi-Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/semi-professional-house-visits/{id}/approve |
| Purpose | Sets ApproveStatus to 'Approved' and updates RejectionRemark. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

{
 "Remark": "Approved after verification"
}

The request body is optional. If request or Remark is null, the controller uses an empty string.

## Request DTO: StatusRequest

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Remark stored in RejectionRemark. Defaults to empty string. |

## Business Logic

* Calls UpdateSemiProfessionalStatus(id, 'Approved', remark).
* Sets ApproveStatus = 'Approved'.
* Sets RejectionRemark = supplied Remark or empty string.
* Updates by HouseVisitID.
* If no row is updated, returns 404.

## Success Response (200)

{
 "success": true,
 "message": "Semi Professional House Visit approved successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Update affects one or more rows. |
| 400 Bad Request | id <= 0. |
| 404 Not Found | No HouseVisitForm\_SemiProfessional row matches the supplied HouseVisitID. |
| 401 Unauthorized | JWT filter rejects the request; exact filter response is not defined here. |
| 403 Forbidden | Not explicitly returned by the action. |
| 409 Conflict | Not implemented. |
| 500 Internal Server Error | Unhandled exception. |

# 3. Reject Semi-Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/semi-professional-house-visits/{id}/reject |
| Purpose | Sets ApproveStatus to 'Rejected' and updates RejectionRemark. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

{
 "Remark": "Required corrections"
}

The request body is optional. If request or Remark is null, the controller uses an empty string.

## Business Logic

* Calls UpdateSemiProfessionalStatus(id, 'Rejected', remark).
* Sets ApproveStatus = 'Rejected'.
* Sets RejectionRemark = supplied Remark or empty string.
* Updates by HouseVisitID.
* If no row is updated, returns 404.

## Success Response (200)

{
 "success": true,
 "message": "Semi Professional House Visit rejected successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Update affects one or more rows. |
| 400 Bad Request | id <= 0. |
| 404 Not Found | No HouseVisitForm\_SemiProfessional row matches the supplied HouseVisitID. |
| 401 Unauthorized | JWT filter rejects the request; exact filter response is not defined here. |
| 403 Forbidden | Not explicitly returned by the action. |
| 409 Conflict | Not implemented. |
| 500 Internal Server Error | Unhandled exception. |

# 4. Delete Semi-Professional House Visit (Soft Delete)

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | DELETE /api/semi-professional-house-visits/{id} |
| Purpose | Soft-deletes a Semi-Professional House Visit by setting Status = 0. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body

None.

## Business Logic

* Executes UPDATE HouseVisitForm\_SemiProfessional SET Status = 0 WHERE HouseVisitID = @HouseVisitID.
* This is a soft delete; no physical DELETE statement is used.
* Related SemiProfessionalFamilyMembers are not deleted by this endpoint.
* Because the list endpoint requires Status = 1, a successfully soft-deleted record no longer appears in the grid.

## Success Response (200)

{
 "success": true,
 "message": "Semi Professional House Visit deleted successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Status update affects one or more rows. |
| 400 Bad Request | id <= 0. |
| 404 Not Found | No matching HouseVisitForm\_SemiProfessional row exists. |
| 401 Unauthorized | JWT filter rejects the request; exact filter response is not defined here. |
| 403 Forbidden | Not explicitly returned by the action. |
| 409 Conflict | Not implemented. |
| 500 Internal Server Error | Unhandled exception. |

# COMMON DTOS

## 1. HouseVisitDto

Purpose: Response/list item representing a Semi-Professional House Visit plus its related family members.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | No | No | House Visit identifier. |
| StudentID | int | No | No | Mapped from SemiProfessional\_StudentID. |
| DistrictName | string | No | Yes | District name from DistrictMaster. |
| StudentName | string | No | Yes | Student name. |
| CourseInstitution | string | No | Yes | Course/institution. |
| Address | string | No | Yes | Address. |
| VisitDate | DateTime? | No | Yes | Visit date. |
| FieldSupervisorName | string | No | Yes | Field supervisor. |
| PersonsInteracted | string | No | Yes | Persons interacted with. |
| HouseType | string | No | Yes | House type. |
| Ownership | string | No | Yes | Ownership. |
| Rooms | string | No | Yes | Rooms. |
| Floor | string | No | Yes | Floor. |
| RationCardType | string | No | Yes | Ration card type. |
| DigitalAccess | string | No | Yes | Digital access. |
| LivingCondition | string | No | Yes | Living condition. |
| LatestElecBill | string | No | Yes | Latest electricity bill. |
| ElecUnitsCons | string | No | Yes | Electricity units consumed. |
| InternetBillCharges | string | No | Yes | Internet bill charges. |
| RemarkGeneralLivingCondition | string | No | Yes | General living-condition remark. |
| Name | string | No | Yes | Family-member-style name field mapped from main record. |
| Relation | string | No | Yes | Family-member-style relation field mapped from main record. |
| Age | string | No | Yes | Family-member-style age field mapped from main record. |
| Education | string | No | Yes | Family-member-style education field mapped from main record. |
| Occupation | string | No | Yes | Family-member-style occupation field mapped from main record. |
| MonthlyIncome | string | No | Yes | Family-member-style income field mapped from main record. |
| Totalfamily | string | No | Yes | Total family. |
| PrimaryIncomeSource | string | No | Yes | Primary income source. |
| NatureofIncome | string | No | Yes | Nature of income. |
| AverageIncome | decimal? | No | Yes | Average income. |
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
| AnyOutstandingLoans | string | No | Yes | Outstanding loans. |
| OutstandingLoanAmount | string | No | Yes | Outstanding loan amount. |
| MonthlyEMI | string | No | Yes | Monthly EMI. |
| HealthVulnerability | string | No | Yes | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Yes | Health vulnerability remarks. |
| Assets | string | No | Yes | Assets. |
| Extracurricular | string | No | Yes | Extracurricular. |
| ConsentParticipation | string | No | Yes | Consent/participation. |
| StudentAspiration | string | No | Yes | Student aspiration. |
| StudentMotivation | string | No | Yes | Student motivation. |
| HouseholdVulnerabilityLevel | string | No | Yes | Household vulnerability. |
| Recommendation | string | No | Yes | Recommendation. |
| SupervisorJustification | string | No | Yes | Supervisor justification. |
| Remarks | string | No | Yes | Remarks. |
| DeclarationConfirmation | string | No | Yes | Declaration confirmation. |
| DeclarationDate | DateTime? | No | Yes | Declaration date. |
| Upload | string | No | Yes | Upload value. |
| ApproveStatus | string | No | Yes | Approval status. |
| RejectionRemark | string | No | Yes | Rejection remark. |
| VolunteerApprovalStatus | string | No | Yes | Volunteer approval status. |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related family members. |

## 2. FamilyMemberDto

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | No | No | Family member identifier. |
| HouseVisitID | int | No | No | Parent House Visit identifier. |
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

## 3. StatusRequest

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Optional approval/rejection remark. Null/missing request is treated as an empty string. |

{
 "Remark": "Example approval or rejection remark"
}

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Behavior** |
| Main table | HouseVisitForm\_SemiProfessional |
| Student join | SemiProfessionalStudents via SemiProfessional\_StudentID = StudentID |
| District join | DistrictMaster via DistrictID |
| Branch Executive mapping | BranchExecutiveDistrictMapping via DistrictID and UserId |
| Family table | SemiProfessionalFamilyMembers |
| List filter | hv.Status = 1 |
| Branch Executive filter | bedm.UserId = authenticated Session UserId |
| Approve | ApproveStatus='Approved', RejectionRemark=@Remark |
| Reject | ApproveStatus='Rejected', RejectionRemark=@Remark |
| Delete | Status=0 (soft delete) |
| Transactions | No explicit transaction in this controller |
| Pagination | Not implemented |
| Search/Sorting | Not implemented |
| Duplicate checks | Not implemented |
| CreatedBy/ModifiedBy | Not populated by this controller |
| File upload | None in this controller |
| Dropdown APIs | None in this controller |

# JWT / AUTHORIZATION SUMMARY

* All four endpoints currently have [JwtSessionFilter] at action level.
* The controller does not contain a controller-level authentication attribute.
* The list endpoint is the only endpoint that visibly reads Session UserRole and UserId.
* Branch Executives must have a valid positive UserId in Session and are restricted to their mapped districts.
* Approve, Reject, and Delete do not visibly perform role, district, UserId, or EmployeeId checks beyond the JWT filter.
* No JWT claim names are explicitly decoded in this controller.

# POTENTIAL ISSUES / REVIEW NOTES

* The list endpoint applies Branch Executive district filtering, but Approve, Reject, and Delete do not repeat that district restriction. This is an authorization/business-rule observation from the supplied controller, not a claim that the endpoints are broken.
* The controller maps Name, Relation, Age, Education, Occupation, and MonthlyIncome directly from the main HouseVisitForm\_SemiProfessional row while also separately loading FamilyMembers. This is existing response behavior.
* InternalServerErrorResponse returns the exception message to the client.
* The list endpoint performs one additional family-member query per returned house visit.

# FINAL QUALITY CHECK

* All four controller endpoints are included.
* HTTP methods and routes match the controller.
* Route prefix is /api/semi-professional-house-visits.
* JWT is documented as action-level because [JwtSessionFilter] appears on every action.
* Branch Executive UserId/session and district filtering are documented only where the controller actually implements them.
* No public endpoint exists in this controller.
* No dropdown or file-upload endpoint exists in this controller.
* All DTO properties defined by the controller are included.
* No unsupported fields or behavior were invented.