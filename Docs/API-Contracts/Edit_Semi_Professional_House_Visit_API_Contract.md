**API CONTRACT**

**Edit Semi-Professional House Visit API**

*EditSemiProfessionalHouseVisitApiController*

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/edit-semi-professional-house-visits |
| Controller | EditSemiProfessionalHouseVisitApiController |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT filter is explicitly applied at action level to both endpoints. |

The supplied controller exposes two endpoints: a GET endpoint for retrieving one House Visit and a POST multipart/form-data endpoint for updating it. Both actions explicitly contain [JwtSessionFilter].

# ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Purpose** |
| 1 | GET | /api/edit-semi-professional-house-visits/{id} | Required | Retrieve one Semi-Professional House Visit and its family members. |
| 2 | POST | /api/edit-semi-professional-house-visits/{id}/update | Required | Update the House Visit, optionally upload files, and update existing family members. |

# 1. Get Semi-Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-semi-professional-house-visits/{id} |
| Purpose | Retrieves a HouseVisitDto by HouseVisitID and includes related SemiProfessionalFamilyMembers. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Authentication is enforced by the existing action-level [JwtSessionFilter].
* No explicit role requirement is checked in this action.
* No JWT claim is directly read by this controller.
* UserID/EmployeeID/Role session dependency is not present in this action.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No query parameters. |

## Request Body

None.

## Validation Rules

* id must be greater than 0; otherwise 400 Bad Request.
* If no matching HouseVisitForm\_SemiProfessional record exists, 404 Not Found is returned.
* No additional field validation, pagination, filtering, sorting, or duplicate checking is implemented.

## Database / Business Logic

* SELECT \* FROM HouseVisitForm\_SemiProfessional WHERE HouseVisitID = @HouseVisitID.
* After the master record is found, related records are loaded from SemiProfessionalFamilyMembers WHERE HouseVisitID = @HouseVisitID.
* The family list is assigned to HouseVisitDto.FamilyMembers.

## Success Response (200)

{
 "success": true,
 "data": {
 "HouseVisitID": 101,
 "StudentID": 5001,
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
 "Totalfamily": "4",
 "PrimaryEarning": "Employment",
 "AverageIncome": "25000",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "OutstandingLoanAmount": "0",
 "MonthlyEMI": "0",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "Example",
 "StudentAspiration": "Example",
 "ConsentParticipation": "Yes",
 "Remarks": "Example",
 "StudentMotivation": "Example",
 "SupervisorJustification": "Example",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Employment",
 "NatureofIncome": "Regular",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "AnyOutstandingLoans": "No",
 "Extracurricular": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example",
 "Upload": "example.pdf",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
 }
 ]
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | House Visit found and returned. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action; any behavior depends on the authentication infrastructure. |
| 404 Not Found | No HouseVisitForm\_SemiProfessional record matches the ID. |
| 409 Conflict | Not used. |
| 500 Internal Server Error | Unhandled exception. |

# 2. Update Semi-Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/edit-semi-professional-house-visits/{id}/update |
| Purpose | Updates the master House Visit record using multipart/form-data, optionally moves uploaded files into HouseDocUploads, and updates existing family-member rows. |
| Content-Type | multipart/form-data |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Authentication is enforced by the existing action-level [JwtSessionFilter].
* No explicit role requirement is checked by the update action.
* No JWT claim is directly read in this controller.
* UserID/EmployeeID/Role is not used to filter or modify the record in the visible update logic.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Request Body / Multipart Form

The request must be multipart/form-data. The controller first loads the existing record, then builds the update model from submitted form values. A submitted field replaces the existing value; an omitted field retains the existing value.

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| StudentName | string | No | Retains existing value when omitted. |
| CourseInstitution | string | No | Retains existing value when omitted. |
| Address | string | No | Retains existing value when omitted. |
| VisitDate | date/date-time | No | Parsed with DateTime.TryParse; invalid submitted date retains existing value. |
| FieldSupervisorName | string | No | Retains existing value when omitted. |
| PersonsInteracted | string | No | Retains existing value when omitted. |
| HouseType | string | No | Retains existing value when omitted. |
| Ownership | string | No | Retains existing value when omitted. |
| Rooms | string | No | Retains existing value when omitted. |
| Floor | string | No | Retains existing value when omitted. |
| RationCardType | string | No | Retains existing value when omitted. |
| DigitalAccess | string | No | Retains existing value when omitted. |
| LivingCondition | string | No | Retains existing value when omitted. |
| LatestElecBill | string | No | Retains existing value when omitted. |
| ElecUnitsCons | string | No | Retains existing value when omitted. |
| InternetBillCharges | string | No | Retains existing value when omitted. |
| RemarkGeneralLivingCondition | string | No | Retains existing value when omitted. |
| Totalfamily | string | No | Retains existing value when omitted. |
| PrimaryEarning | string | No | Retains existing value when omitted. |
| AverageIncome | string | No | Retains existing value when omitted. |
| OtherLandHoldings | string | No | Retains existing value when omitted. |
| TotalChildrenStudying | string | No | Retains existing value when omitted. |
| AnnualEducationExpense | string | No | Retains existing value when omitted. |
| ScholarshipSupport | string | No | Retains existing value when omitted. |
| GovernmentSchemes | string | No | Retains existing value when omitted. |
| EducationalLoanAmount | string | No | Retains existing value when omitted. |
| OutstandingLoanAmount | string | No | Retains existing value when omitted. |
| MonthlyEMI | string | No | Retains existing value when omitted. |
| HealthVulnerability | string | No | Retains existing value when omitted. |
| HealthVulnerabilityRemarks | string | No | Retains existing value when omitted. |
| Assets | string | No | Retains existing value when omitted. |
| StudentAspiration | string | No | Retains existing value when omitted. |
| ConsentParticipation | string | No | Retains existing value when omitted. |
| Remarks | string | No | Retains existing value when omitted. |
| StudentMotivation | string | No | Retains existing value when omitted. |
| SupervisorJustification | string | No | Retains existing value when omitted. |
| DeclarationConfirmation | string | No | Retains existing value when omitted. |
| DeclarationDate | date/date-time | No | Parsed with DateTime.TryParse; invalid submitted date retains existing value. |
| PrimaryIncomeSource | string | No | Retains existing value when omitted. |
| NatureofIncome | string | No | Retains existing value when omitted. |
| IncomeShocks | string | No | Retains existing value when omitted. |
| AgriculturalLand | string | No | Retains existing value when omitted. |
| WaterSource | string | No | Retains existing value when omitted. |
| CropPattern | string | No | Retains existing value when omitted. |
| AnyOutstandingLoans | string | No | Retains existing value when omitted. |
| Extracurricular | string | No | Retains existing value when omitted. |
| HouseholdVulnerabilityLevel | string | No | Retains existing value when omitted. |
| Recommendation | string | No | Retains existing value when omitted. |

## Family Member Multipart Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field Pattern** | **Type** | **Required** | **Description** |
| FamilyMembers[i].FamilyID | int | Conditionally required | Required to identify an existing family member for update; invalid/non-positive IDs are skipped. |
| FamilyMembers[i].Name | string | No | Updates the identified family member; omitted value retains current value. |
| FamilyMembers[i].Relation | string | No | Updates relation; omitted value retains current value. |
| FamilyMembers[i].Age | string | No | Updates age; omitted value retains current value. |
| FamilyMembers[i].Education | string | No | Updates education; omitted value retains current value. |
| FamilyMembers[i].Occupation | string | No | Updates occupation; omitted value retains current value. |
| FamilyMembers[i].MonthlyIncome | string | No | Updates monthly income; omitted value retains current value. |

The parser checks indexes 0 through 99. Existing family members are first copied into the update list. Submitted FamilyID values are matched against that list; new FamilyMemberDto objects may be created in memory for submitted positive IDs, but the database operation is an UPDATE by FamilyID.

## File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| Unnamed multipart file part / file name supplied by client | File | No | Any extension (no extension whitelist in controller) | Not specified | Each valid MultipartFileData is moved to HouseDocUploads with a generated GUID filename while preserving the original extension. |

* File upload is optional.
* No file is provided → the existing Upload value is retained.
* Multiple files are supported because the controller loops through provider.FileData.
* Existing Upload filenames are retained and new generated filenames are appended using commas.
* Temporary files are read from ~/App\_Data/TempUploads.
* Final files are moved to ~/HouseDocUploads.
* Generated filename format: GUID without hyphens + original extension.
* Maximum file size is not specified in the controller.
* No extension allow-list is implemented.

## Update Validation Rules

* id must be greater than 0; otherwise 400 Bad Request.
* Request must be multipart/form-data; otherwise 400 Bad Request.
* The target House Visit must exist before form parsing; otherwise 404 Not Found.
* Most form fields are optional in the controller because omitted values retain the existing database value.
* Date fields are parsed using DateTime.TryParse; invalid supplied values fall back to existing dates rather than generating a validation error.
* FamilyMembers FamilyID must parse to a positive integer to be processed.
* Family-member parsing supports indexes 0–99.
* No [Required] attributes, ModelState validation, email validation, duplicate checks, or explicit length limits are present.
* Database update failure for the master record throws InvalidOperationException and is returned as 500.

## Update Business Logic

* Existing HouseVisitDto is loaded before processing the multipart form.
* BuildHouseVisitFromForm starts from the existing record, so omitted form fields are preserved.
* StudentID and HouseVisitID are taken from the existing/route values and are not changed from submitted form fields.
* Master record is updated in HouseVisitForm\_SemiProfessional by HouseVisitID.
* Family member rows are updated in SemiProfessionalFamilyMembers by FamilyID.
* Only existing rows that have a valid FamilyID can actually be updated by the database UPDATE statement.
* After updates, the controller reloads the record and returns the updated HouseVisitDto.
* No explicit SQL transaction wraps the master and family updates.
* CreatedBy, ModifiedBy, Status, ApproveStatus, RejectionRemark, or VolunteerApprovalStatus are not updated by this controller.

## Success Response (200)

{
 "success": true,
 "message": "Semi Professional House Visit updated successfully.",
 "data": {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Updated Student",
 "CourseInstitution": "Updated Institution",
 "Address": "Updated Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Updated Supervisor",
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
 "Totalfamily": "4",
 "PrimaryEarning": "Employment",
 "AverageIncome": "25000",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "OutstandingLoanAmount": "0",
 "MonthlyEMI": "0",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "Example",
 "StudentAspiration": "Example",
 "ConsentParticipation": "Yes",
 "Remarks": "Updated",
 "StudentMotivation": "Example",
 "SupervisorJustification": "Example",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Employment",
 "NatureofIncome": "Regular",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "AnyOutstandingLoans": "No",
 "Extracurricular": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example",
 "Upload": "generated-file-name.pdf",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Updated Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
 }
 ]
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Master update and family-member processing complete; updated record is reloaded and returned. |
| 400 Bad Request | id <= 0, or request is not multipart/form-data. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | House Visit does not exist before update. |
| 409 Conflict | Not implemented. |
| 500 Internal Server Error | Unhandled exception, including master-record update failure. |

# COMMON DTOS

## 1. HouseVisitDto

Purpose: Represents the editable Semi-Professional House Visit record returned by the GET and update endpoints.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | No | No | House Visit identifier; route ID controls the update record. |
| StudentID | int | No | No | Student identifier; retained from existing record during update. |
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
| RemarkGeneralLivingCondition | string | No | Yes | General living condition remark. |
| Totalfamily | string | No | Yes | Total family. |
| PrimaryEarning | string | No | Yes | Primary earning. |
| AverageIncome | string | No | Yes | Average income; represented as string in this DTO. |
| OtherLandHoldings | string | No | Yes | Other land holdings. |
| TotalChildrenStudying | string | No | Yes | Total children studying. |
| AnnualEducationExpense | string | No | Yes | Annual education expense. |
| ScholarshipSupport | string | No | Yes | Scholarship support. |
| GovernmentSchemes | string | No | Yes | Government schemes. |
| EducationalLoanAmount | string | No | Yes | Educational loan amount. |
| OutstandingLoanAmount | string | No | Yes | Outstanding loan amount. |
| MonthlyEMI | string | No | Yes | Monthly EMI. |
| HealthVulnerability | string | No | Yes | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Yes | Health vulnerability remarks. |
| Assets | string | No | Yes | Assets. |
| StudentAspiration | string | No | Yes | Student aspiration. |
| ConsentParticipation | string | No | Yes | Consent/participation. |
| Remarks | string | No | Yes | Remarks. |
| StudentMotivation | string | No | Yes | Student motivation. |
| SupervisorJustification | string | No | Yes | Supervisor justification. |
| DeclarationConfirmation | string | No | Yes | Declaration confirmation. |
| DeclarationDate | DateTime? | No | Yes | Declaration date. |
| PrimaryIncomeSource | string | No | Yes | Primary income source. |
| NatureofIncome | string | No | Yes | Nature of income. |
| IncomeShocks | string | No | Yes | Income shocks. |
| AgriculturalLand | string | No | Yes | Agricultural land. |
| WaterSource | string | No | Yes | Water source. |
| CropPattern | string | No | Yes | Crop pattern. |
| AnyOutstandingLoans | string | No | Yes | Outstanding loans. |
| Extracurricular | string | No | Yes | Extracurricular. |
| HouseholdVulnerabilityLevel | string | No | Yes | Household vulnerability level. |
| Recommendation | string | No | Yes | Recommendation. |
| Upload | string | No | Yes | Stored/generated upload filename(s). |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related family members. |

## 2. FamilyMemberDto

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | No | No | Family member identifier used for database update. |
| Name | string | No | Yes | Family member name. |
| Relation | string | No | Yes | Relation. |
| Age | string | No | Yes | Age. |
| Education | string | No | Yes | Education. |
| Occupation | string | No | Yes | Occupation. |
| MonthlyIncome | string | No | Yes | Monthly income. |

{
 "FamilyID": 1,
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
}

## Complete Multipart Update Example

Example Postman form-data fields:

|  |  |  |
| --- | --- | --- |
| **Key** | **Example Value** | **Type** |
| StudentName | Updated Student | Text |
| CourseInstitution | Updated Institution | Text |
| Address | Updated Address | Text |
| VisitDate | 2026-08-31 | Text |
| HouseType | Owned | Text |
| Ownership | Self | Text |
| Rooms | 3 | Text |
| Floor | Ground | Text |
| AverageIncome | 25000 | Text |
| Remarks | Updated remark | Text |
| FamilyMembers[0].FamilyID | 1 | Text |
| FamilyMembers[0].Name | Updated Member | Text |
| FamilyMembers[0].Relation | Parent | Text |
| FamilyMembers[0].Age | 45 | Text |
| FamilyMembers[0].Education | Graduate | Text |
| FamilyMembers[0].Occupation | Employee | Text |
| FamilyMembers[0].MonthlyIncome | 20000 | Text |
| file | example.pdf | File |

The controller does not define a fixed multipart field name for uploaded files; it processes every entry in provider.FileData.

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Behavior** |
| Master table | HouseVisitForm\_SemiProfessional |
| Family table | SemiProfessionalFamilyMembers |
| GET query | SELECT \* by HouseVisitID |
| Master update | UPDATE by HouseVisitID |
| Family update | UPDATE by FamilyID |
| Soft delete | Not implemented in this controller |
| Pagination | Not implemented |
| Search / sorting | Not implemented |
| Duplicate validation | Not implemented |
| CreatedBy / ModifiedBy | Not updated |
| Transactions | No explicit transaction |
| File storage | ~/HouseDocUploads |
| Temporary upload storage | ~/App\_Data/TempUploads |
| File naming | GUID + original extension |
| JWT | Action-level [JwtSessionFilter] on both endpoints |
| Role checks | None explicitly implemented in these actions |

# FINAL QUALITY CHECK

* All controller endpoints are included: GET by ID and POST multipart update.
* Route prefix and action routes match the supplied controller.
* JWT is documented at action level, not invented as a controller-level attribute.
* No role requirement has been invented.
* All visible HouseVisitDto and FamilyMemberDto properties are documented.
* Multipart fields and family-member indexed fields are documented.
* File behavior, retention, generated naming, and absence of size/extension restrictions are documented.
* Requiredness is based on actual controller validation; DTO properties are not falsely marked required.
* Database tables and UPDATE/SELECT behavior visible in the controller are documented.
* Pagination, dropdowns, duplicate checks, and transaction behavior are explicitly identified as absent/not implemented.