**API CONTRACT**

**PUC House Visit Grid API**

*VP\_PUCHouseVisitGridApiController*

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/puc-housevisits-grid |
| Controller | VP\_PUCHouseVisitGridApiController |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT filter is explicitly applied at action level to all four endpoints. |

The supplied controller exposes four protected endpoints: list, get by ID, approve, reject, and delete. Each action explicitly contains [JwtSessionFilter]. The list endpoint additionally reads UserRole and UserId from HttpContext.Current.Session.

# ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Purpose** |
| 1 | GET | /api/puc-housevisits-grid/list | Required | Return active PUC House Visits, with role-based filtering for Branch Executives. |
| 2 | GET | /api/puc-housevisits-grid/{id} | Required | Return one active PUC House Visit and its family members. |
| 3 | POST | /api/puc-housevisits-grid/{id}/approve | Required | Set ApproveStatus to Approved and save an optional remark. |
| 4 | POST | /api/puc-housevisits-grid/{id}/reject | Required | Set ApproveStatus to Rejected and save an optional remark. |
| 5 | POST | /api/puc-housevisits-grid/{id}/delete | Required | Soft-delete a PUC House Visit by setting Status = 0. |

# 1. PUC House Visit Grid / List

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/puc-housevisits-grid/list |
| Purpose | Retrieves all active PUC House Visits. Branch Executives receive only records belonging to districts mapped to their UserId. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Filter/authorization is action-level via [JwtSessionFilter].
* The action reads Session["UserRole"] and Session["UserId"].
* UserId must be parseable as an integer; otherwise 401 Unauthorized is returned.
* No explicit role whitelist is enforced, but the role value Branch Executives triggers additional data filtering.
* JWT claims themselves are not directly read in this controller; the controller depends on the existing JWT/session infrastructure to populate the session values.

## Path / Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No path or query parameters. |

## Request Body

None.

## Validation & Business Rules

* Session UserId must parse to an integer; invalid/missing session identity returns 401.
* Only records with hv.Status = 1 are returned.
* If UserRole == "Branch Executives", the query joins BranchExecutiveDistrictMapping and filters bedm.UserId = @UserId.
* For roles other than Branch Executives, no UserId filter is added by this action.
* Family members are loaded after the main SQL reader is closed.
* No pagination, search, sorting, date filters, duplicate checks, or explicit role-denial logic are implemented.

## Database Behavior

* Main table: HouseVisitForm\_PUC.
* Joined table: New\_Students using hv.PUC\_StudentID = ps.StudentID.
* Joined table: DistrictMaster using ps.DistrictID = dm.DistrictID.
* Branch Executive filtering uses BranchExecutiveDistrictMapping.DistrictID and UserId.
* Returned student/location fields include Address, Place, District, Taluka, PinCode and HouseVisitLink.

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
 "Place": "Example Place",
 "District": "Example District",
 "DistrictName": "Example District",
 "Taluka": "Example Taluka",
 "PinCode": "560001",
 "HouseVisitLink": "Example Link",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Owned",
 "Ownership": "Self",
 "Rooms": "3",
 "Floor": "Ground",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
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
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "Upload": "example.pdf",
 "ApproveStatus": "Approved",
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
| 200 OK | List retrieval succeeds. |
| 401 Unauthorized | Session UserId cannot be parsed as an integer. |
| 403 Forbidden | Not explicitly returned by the action; behavior depends on authentication infrastructure. |
| 500 Internal Server Error | Unhandled exception. |

# 2. Get Single PUC House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/puc-housevisits-grid/{id} |
| Purpose | Retrieves one active PUC House Visit and related family members. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Query Parameters / Request Body

No query parameters. No request body.

## Validation & Business Rules

* id <= 0 returns 400 Bad Request.
* The SQL query requires HouseVisitID = @HouseVisitID AND Status = 1.
* Only active records are returned.
* Family members are loaded from HouseVisitFamilyMembers for the returned HouseVisitID.
* No UserId/Role filtering is applied in this action.

## Success Response (200)

{
 "success": true,
 "data": {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "Place": "Example Place",
 "District": "Example District",
 "DistrictName": "Example District",
 "Taluka": "Example Taluka",
 "PinCode": "560001",
 "HouseVisitLink": "Example Link",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Owned",
 "Ownership": "Self",
 "Rooms": "3",
 "Floor": "Ground",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
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
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "Upload": "example.pdf",
 "ApproveStatus": "Approved",
 "RejectionRemark": "",
 "VolunteerApprovalStatus": "Pending",
 "FamilyMembers": []
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Active record found. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | No active record matches the HouseVisitID. |
| 500 Internal Server Error | Unhandled exception. |

# 3. Approve PUC House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/puc-housevisits-grid/{id}/approve |
| Purpose | Updates ApproveStatus to Approved and stores the supplied remark. |
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
 "Remark": "Example remark"
}

## Request Fields

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Remark stored in RejectionRemark. If request is null, an empty string is used; if Remark itself is null, empty string is stored. |

## Validation & Business Logic

* id <= 0 returns 400 Bad Request.
* The request body is not explicitly required. A null ApprovalRequest is accepted.
* ApproveStatus is set to Approved.
* RejectionRemark is set to request.Remark, or an empty string when request is null/Remark is null.
* The update is performed by HouseVisitID.
* No explicit role check, duplicate check, or status precondition is implemented.

## Database Behavior

UPDATE HouseVisitForm\_PUC
SET ApproveStatus = @ApproveStatus,
 RejectionRemark = @RejectionRemark
WHERE HouseVisitID = @HouseVisitID

## Success Response (200)

{
 "success": true,
 "message": "PUC House Visit approved successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Status update succeeds for an existing HouseVisitID. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | UPDATE affects zero rows. |
| 500 Internal Server Error | Unhandled exception. |

# 4. Reject PUC House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/puc-housevisits-grid/{id}/reject |
| Purpose | Updates ApproveStatus to Rejected and stores the supplied remark. |
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
 "Remark": "Example remark"
}

## Request Fields

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Remark stored in RejectionRemark. If request is null, an empty string is used; if Remark itself is null, empty string is stored. |

## Validation & Business Logic

* id <= 0 returns 400 Bad Request.
* The request body is not explicitly required. A null ApprovalRequest is accepted.
* ApproveStatus is set to Rejected.
* RejectionRemark is set to request.Remark, or an empty string when request is null/Remark is null.
* The update is performed by HouseVisitID.
* No explicit role check, duplicate check, or status precondition is implemented.

## Database Behavior

UPDATE HouseVisitForm\_PUC
SET ApproveStatus = @ApproveStatus,
 RejectionRemark = @RejectionRemark
WHERE HouseVisitID = @HouseVisitID

## Success Response (200)

{
 "success": true,
 "message": "PUC House Visit rejected successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Status update succeeds for an existing HouseVisitID. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | UPDATE affects zero rows. |
| 500 Internal Server Error | Unhandled exception. |

# 5. Delete / Soft Delete PUC House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/puc-housevisits-grid/{id}/delete |
| Purpose | Performs a soft delete by changing Status from its current value to 0. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body / Query Parameters

No request body and no query parameters.

## Validation & Business Logic

* id <= 0 returns 400 Bad Request.
* This is a soft delete, not a physical DELETE statement.
* The database operation executes UPDATE HouseVisitForm\_PUC SET Status = 0 WHERE HouseVisitID = @HouseVisitID.
* No dependency check or confirmation parameter is implemented.
* No role check is implemented in the action.

## Success Response (200)

{
 "success": true,
 "message": "PUC House Visit deleted successfully."
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | UPDATE affects one or more rows. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | UPDATE affects zero rows; response message is "Delete failed." |
| 500 Internal Server Error | Unhandled exception. |

# COMMON DTOS

## 1. ApprovalRequest

Purpose: Request DTO used by the approve and reject endpoints.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Remark | string | No | Yes | Approval/rejection remark. Null request or null Remark results in an empty string being passed to UpdateStatus. |

{
 "Remark": "Documents are incomplete"
}

## 2. HouseVisitDto

Purpose: Response DTO representing a PUC House Visit and its related family members.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | No | No | House Visit identifier. |
| StudentID | int | No | No | Mapped from PUC\_StudentID. |
| StudentName | string | No | Yes | Student name. |
| CourseInstitution | string | No | Yes | Course/institution. |
| Address | string | No | Yes | Address from New\_Students. |
| Place | string | No | Yes | Place from New\_Students. |
| District | string | No | Yes | District from New\_Students. |
| DistrictName | string | No | Yes | District name from DistrictMaster. |
| Taluka | string | No | Yes | Taluka from New\_Students. |
| PinCode | string | No | Yes | PIN code from New\_Students. |
| HouseVisitLink | string | No | Yes | House visit link from New\_Students. |
| VisitDate | DateTime? | No | Yes | Visit date. |
| FieldSupervisorName | string | No | Yes | Field supervisor. |
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
| Totalfamily | string | No | Yes | Total family. |
| PrimaryIncomeSource | string | No | Yes | Primary income source. |
| NatureofIncome | string | No | Yes | Nature of income. |
| AverageIncome | decimal? | No | Yes | Average income; nullable decimal. |
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
| AnyOutstandingLoans | string | No | Yes | Any outstanding loans. |
| OutstandingLoanAmount | string | No | Yes | Outstanding loan amount. |
| MonthlyEMI | string | No | Yes | Monthly EMI. |
| HealthVulnerability | string | No | Yes | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Yes | Health vulnerability remarks. |
| Assets | string | No | Yes | Assets. |
| Extracurricular | string | No | Yes | Extracurricular. |
| ConsentParticipation | string | No | Yes | Consent/participation. |
| StudentAspiration | string | No | Yes | Student aspiration. |
| StudentMotivation | string | No | Yes | Student motivation. |
| HouseholdVulnerabilityLevel | string | No | Yes | Household vulnerability level. |
| Recommendation | string | No | Yes | Recommendation. |
| SupervisorJustification | string | No | Yes | Supervisor justification. |
| DeclarationConfirmation | string | No | Yes | Declaration confirmation. |
| DeclarationDate | DateTime? | No | Yes | Declaration date. |
| Upload | string | No | Yes | Upload filename/value. |
| ApproveStatus | string | No | Yes | Approval status. |
| RejectionRemark | string | No | Yes | Rejection remark. |
| VolunteerApprovalStatus | string | No | Yes | Volunteer approval status. |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related family members. |

## 3. FamilyMemberDto

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | No | No | Family member identifier. |
| HouseVisitID | int | No | No | Associated House Visit ID. |
| StudentID | int | No | No | Associated Student ID. |
| Name | string | No | Yes | Family member name. |
| Relation | string | No | Yes | Relation to student. |
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
| **Area** | **Behavior** |
| Main table | HouseVisitForm\_PUC |
| Student table | New\_Students |
| District table | DistrictMaster |
| Family table | HouseVisitFamilyMembers |
| Role mapping table | BranchExecutiveDistrictMapping |
| List filter | HouseVisitForm\_PUC.Status = 1 |
| Branch Executive filter | BranchExecutiveDistrictMapping.UserId = Session UserId, joined through student DistrictID |
| Single-record filter | HouseVisitID + Status = 1 |
| Approve | UPDATE ApproveStatus = Approved + RejectionRemark |
| Reject | UPDATE ApproveStatus = Rejected + RejectionRemark |
| Delete | Soft delete: UPDATE Status = 0 |
| Pagination | Not implemented |
| Search / sorting | Not implemented |
| Duplicate checks | Not implemented |
| Transactions | No explicit transaction |
| CreatedBy / ModifiedBy | Not updated |
| JWT | Action-level [JwtSessionFilter] on every endpoint |
| Session dependency | List endpoint reads UserRole and UserId from HttpContext.Current.Session |

# STATUS CODE MATRIX

|  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Endpoint** | **200** | **400** | **401** | **403** | **404** | **409** | **500** |
| List | Yes | No | Yes | Not explicitly | No | No | Yes |
| Get by ID | Yes | Yes | Yes | Not explicitly | Yes | No | Yes |
| Approve | Yes | Yes | Yes | Not explicitly | Yes | No | Yes |
| Reject | Yes | Yes | Yes | Not explicitly | Yes | No | Yes |
| Delete | Yes | Yes | Yes | Not explicitly | Yes | No | Yes |

# FINAL QUALITY CHECK

* All five actual controller endpoints are included.
* Route prefix is /api/puc-housevisits-grid.
* JWT is documented as action-level because [JwtSessionFilter] appears on each action.
* The list endpoint's Session UserRole/UserId dependency and Branch Executive district filtering are documented.
* Active-record filtering (Status = 1) is documented.
* Approve and Reject use the same ApprovalRequest DTO with an optional Remark.
* Delete is documented as a soft delete using Status = 0.
* All DTO properties visible in the controller are included.
* No dropdown or multipart/file-upload endpoint exists in this controller.
* No pagination, search, sorting, duplicate checks, explicit roles beyond Branch Executives filtering, or transaction behavior has been invented.