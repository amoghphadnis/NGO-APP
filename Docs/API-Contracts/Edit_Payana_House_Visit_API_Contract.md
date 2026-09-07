**API CONTRACT**

**Edit Payana House Visit API**

*ASP.NET Web API 2 • ADO.NET • SQL Server*

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/edit-payana-house-visits |
| Controller | EditPayanaHouseVisitApiController |
| Framework | ASP.NET Web API 2 (ApiController) |
| Authentication Scope | Action-level JWT session filter |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |

**Authentication note:** The controller explicitly applies [JwtSessionFilter] to both public action methods. Therefore JWT authentication is required for both endpoints. There is no controller-level JWT attribute, and no role requirement or JWT claim usage is explicitly visible in this controller.

# 1. Get Payana House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-payana-house-visits/{id} |
| Purpose | Retrieves one HouseVisitForm record by HouseVisitID and includes its related PayanaFamilyMembers. |
| Content-Type | application/json |
| Authorization | JWT Required |
| JWT Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |
| Request Body | None |

## Authorization

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Filter/Authorization Scope: Action-level existing [JwtSessionFilter].
* Required Claims: Not specified in this controller.
* Required Roles: Not specified in this controller.
* The action does not directly read JWT claims or Session values in the visible code.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID of the record to retrieve. Must be greater than 0. |

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No query parameters are defined. |

## Request Body

**None.**

## Validation Rules

* id <= 0 returns 400 Bad Request with 'Invalid House Visit ID.'.
* The HouseVisitForm record is selected using HouseVisitID = @HouseVisitID.
* If no record is found, the endpoint returns 404 Not Found.
* No explicit length, email, enum, duplicate, or role validation is implemented.

## Business / Database Logic

* Reads from HouseVisitForm.
* Then reads related records from PayanaFamilyMembers using the same HouseVisitID.
* Family members are returned as a list inside the HouseVisitDto.
* The controller uses SELECT \* for both database queries.

## Success Response (200)

The response contains success=true and the complete HouseVisitDto. The following sample shows the complete DTO shape; values are illustrative because the controller does not provide actual database values.

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
 "HouseType": "Example",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example remarks",
 "Totalfamily": "4",
 "PrimaryEarning": "Example",
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
 "Assets": "Example assets",
 "StudentAspiration": "Example aspiration",
 "ConsentParticipation": "Yes",
 "Remarks": "Example remarks",
 "StudentMotivation": "Example motivation",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Example",
 "NatureofIncome": "Example",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "AnyOutstandingLoans": "No",
 "Extracurricular": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example recommendation",
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

## Failure Responses

|  |  |  |
| --- | --- | --- |
| **Status** | **When it occurs** | **Example** |
| 400 Bad Request | id is 0 or negative. | {"success":false,"message":"Invalid House Visit ID."} |
| 401 Unauthorized | JWT authentication/filter rejects the request. Exact filter behavior is not specified in this controller. | Authentication failure response is not specified in controller. |
| 403 Forbidden | Only if the existing JwtSessionFilter independently enforces authorization; no role rule is visible here. | Not specified in controller. |
| 404 Not Found | No HouseVisitForm row exists for the supplied HouseVisitID. | {"success":false,"message":"House Visit record not found."} |
| 409 Conflict | Not implemented. | Not used by controller. |
| 500 Internal Server Error | Unhandled exception during database retrieval or processing. | {"success":false,"message":"<exception message>"} |

## Status Codes Used

* 200 OK
* 400 Bad Request
* 404 Not Found
* 500 Internal Server Error

401/403 are authentication-layer possibilities because [JwtSessionFilter] is present, but exact responses are not implemented in this action.

# 2. Update Payana House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/edit-payana-house-visits/{id}/update |
| Purpose | Updates an existing HouseVisitForm record, optionally uploads one or more files, and updates supplied PayanaFamilyMembers. |
| Content-Type | multipart/form-data |
| Authorization | JWT Required |
| JWT Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |
| Request Body | Multipart form-data. |

## Authorization

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Filter/Authorization Scope: Action-level existing [JwtSessionFilter].
* Required Claims: Not specified in this controller.
* Required Roles: Not specified in this controller.
* No JWT claim or Session value is directly read by the Update action.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID of the record to update. Must be greater than 0. |

## Query Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| None | — | — | No query parameters are defined. |

## Multipart Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| model | JSON object | Optional | A JSON-serialized HouseVisitDto. When supplied, only fields explicitly represented in the multipart request are applied; omitted fields retain existing values. |
| StudentName | string | Optional | Student name. |
| CourseInstitution | string | Optional | Course/institution. |
| Address | string | Optional | Address. |
| VisitDate | date/date-time | Optional | Visit date. Invalid date text causes an exception and therefore 500. |
| FieldSupervisorName | string | Optional | Field supervisor name. |
| PersonsInteracted | string | Optional | Persons interacted with. |
| HouseType | string | Optional | House type. |
| Ownership | string | Optional | Ownership information. |
| Rooms | string | Optional | Rooms. |
| Floor | string | Optional | Floor. |
| RationCardType | string | Optional | Ration card type. |
| DigitalAccess | string | Optional | Digital access information. |
| LivingCondition | string | Optional | Living condition. |
| LatestElecBill | string | Optional | Latest electricity bill. |
| ElecUnitsCons | string | Optional | Electricity units consumed. |
| InternetBillCharges | string | Optional | Internet bill charges. |
| RemarkGeneralLivingCondition | string | Optional | General living condition remarks. |
| Totalfamily | string | Optional | Total family count/value. |
| PrimaryEarning | string | Optional | Primary earning information. |
| AverageIncome | string | Optional | Average income. |
| OtherLandHoldings | string | Optional | Other land holdings. |
| TotalChildrenStudying | string | Optional | Total children studying. |
| AnnualEducationExpense | string | Optional | Annual education expense. |
| ScholarshipSupport | string | Optional | Scholarship/support information. |
| GovernmentSchemes | string | Optional | Government schemes. |
| EducationalLoanAmount | string | Optional | Educational loan amount. |
| OutstandingLoanAmount | string | Optional | Outstanding loan amount. |
| MonthlyEMI | string | Optional | Monthly EMI. |
| HealthVulnerability | string | Optional | Health vulnerability. |
| HealthVulnerabilityRemarks | string | Optional | Health vulnerability remarks. |
| Assets | string | Optional | Assets. |
| StudentAspiration | string | Optional | Student aspiration. |
| ConsentParticipation | string | Optional | Consent/participation. |
| Remarks | string | Optional | Remarks. |
| StudentMotivation | string | Optional | Student motivation. |
| SupervisorJustification | string | Optional | Supervisor justification. |
| DeclarationConfirmation | string | Optional | Declaration confirmation. |
| DeclarationDate | date/date-time | Optional | Declaration date. Invalid date text causes an exception and therefore 500. |
| PrimaryIncomeSource | string | Optional | Primary income source. |
| NatureofIncome | string | Optional | Nature of income. |
| IncomeShocks | string | Optional | Income shocks. |
| AgriculturalLand | string | Optional | Agricultural land information. |
| WaterSource | string | Optional | Water source. |
| CropPattern | string | Optional | Crop pattern. |
| AnyOutstandingLoans | string | Optional | Outstanding loans indicator/details. |
| Extracurricular | string | Optional | Extracurricular information. |
| HouseholdVulnerabilityLevel | string | Optional | Household vulnerability level. |
| Recommendation | string | Optional | Recommendation. |
| FamilyMembers | JSON array | Optional | JSON array of FamilyMemberDto objects. If supplied, the listed family members are updated by FamilyID. |

## File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| UploadedFile | File | Optional | Any extension | Not specified in controller | Each uploaded file is given a GUID filename while preserving its original extension. Multiple UploadedFile fields are supported. |

* File is optional.
* No file extension whitelist is implemented.
* No maximum file size is implemented in this controller.
* Multiple UploadedFile file fields are supported because the code iterates through provider.FileData.
* If no new file is provided, the existing Upload value is retained.
* New files are moved to ~/HouseDocUploads/.
* Generated filename = GUID + original extension.
* Multiple generated filenames are stored as a comma-separated string in Upload.
* The controller does not delete/replace old physical files; it retains the existing Upload string and appends new filenames.

## Request Body Example

model:
{
 "StudentName": "Updated Student",
 "Address": "Updated Address",
 "VisitDate": "2026-08-31T00:00:00",
 "Remarks": "Updated remarks",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Updated Member",
 "Relation": "Parent",
 "Age": "46",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "22000"
 }
 ]
}

UploadedFile:
<binary file data>

## Validation Rules

* id <= 0 returns 400 Bad Request.
* Content-Type must be multipart/form-data; otherwise 400 Bad Request is returned.
* The HouseVisitForm record must exist; otherwise 404 Not Found.
* If the model field is supplied, it must contain valid JSON that deserializes to HouseVisitDto; invalid JSON returns 400 Bad Request.
* VisitDate and DeclarationDate are parsed with DateTime.TryParse when supplied as individual form-data fields; invalid values throw FormatException and are caught by the general exception handler, resulting in 500.
* No [Required] attributes, ModelState validation, string length validation, email validation, duplicate validation, enum validation, or role validation is implemented in this controller.
* Family members are updated by FamilyID and HouseVisitID. No explicit existence validation is performed before UPDATE.
* No explicit file size or extension validation is implemented.

## Business Logic Notes

* Existing HouseVisitForm data is loaded before update.
* The update is intentionally partial: the existing record is cloned, then only fields supplied in the multipart request are applied.
* HouseVisitID and StudentID are forced back to their existing values, so they are not changed through the supplied model.
* Existing FamilyMembers are preserved unless a FamilyMembers form field is explicitly supplied.
* If FamilyMembers is supplied, each supplied FamilyMemberDto is updated in PayanaFamilyMembers using FamilyID + HouseVisitID.
* The controller does not INSERT new family members; it only performs UPDATE statements for supplied family members.
* The controller does not DELETE family members.
* The Upload database value retains existing filenames and appends newly uploaded filenames with commas.
* Uploaded files are first stored temporarily under App\_Data/TempUploads and then moved to HouseDocUploads.
* Temporary files are cleaned after a successful database update. Cleanup failure is intentionally ignored.
* The database update uses parameterized SQL commands.
* No transaction is used across the HouseVisitForm update, family-member updates, and file operations.

## Success Response (200)

{
 "success": true,
 "message": "Payana House Visit updated successfully.",
 "data": {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Updated Student",
 "CourseInstitution": "Example Institution",
 "Address": "Updated Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Example",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example remarks",
 "Totalfamily": "4",
 "PrimaryEarning": "Example",
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
 "Assets": "Example assets",
 "StudentAspiration": "Example aspiration",
 "ConsentParticipation": "Yes",
 "Remarks": "Updated remarks",
 "StudentMotivation": "Example motivation",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Example",
 "NatureofIncome": "Example",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "AnyOutstandingLoans": "No",
 "Extracurricular": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example recommendation",
 "Upload": "existing.pdf,new-file.jpg",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Updated Member",
 "Relation": "Parent",
 "Age": "46",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "22000"
 }
 ]
 }
}

## Failure Responses

|  |  |  |
| --- | --- | --- |
| **Status** | **When it occurs** | **Example** |
| 400 Bad Request | id <= 0, request is not multipart/form-data, or model contains invalid JSON. | {"success":false,"message":"Request must use multipart/form-data."} |
| 401 Unauthorized | JWT authentication/filter rejects request. Exact filter behavior is not specified in controller. | Authentication failure response not specified. |
| 403 Forbidden | Only if JwtSessionFilter enforces authorization beyond authentication; no role rule is visible here. | Not specified in controller. |
| 404 Not Found | No HouseVisitForm record exists for the supplied ID. | {"success":false,"message":"House Visit record not found."} |
| 409 Conflict | Not implemented. | Not used by controller. |
| 500 Internal Server Error | Unhandled exception, database error, invalid date parsing, file operation failure, etc. | {"success":false,"message":"<exception message>"} |

## Status Codes Used

* 200 OK
* 400 Bad Request
* 404 Not Found
* 500 Internal Server Error

401/403 are authentication-layer possibilities because [JwtSessionFilter] is present, but their exact behavior is not implemented in the controller.

# COMMON DTOS

## DTO 1: HouseVisitDto

Purpose: Represents a HouseVisitForm record plus its related PayanaFamilyMembers. It is used for GET responses and for the JSON 'model' payload in the multipart update.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | No | No | Existing record identifier. Forced to existing value during update. |
| StudentID | int | No | No | Student identifier. Forced to existing value during update. |
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
| RemarkGeneralLivingCondition | string | No | Yes | General living condition remarks. |
| Totalfamily | string | No | Yes | Total family. |
| PrimaryEarning | string | No | Yes | Primary earning. |
| AverageIncome | string | No | Yes | Average income. |
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
| Upload | string | No | Yes | Stored filename(s), comma-separated when multiple. |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related family-member records. |

## Sample HouseVisitDto

{
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Updated Student",
 "CourseInstitution": "Example Institution",
 "Address": "Updated Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Example",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "Example",
 "DigitalAccess": "Yes",
 "LivingCondition": "Good",
 "LatestElecBill": "1000",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "800",
 "RemarkGeneralLivingCondition": "Example remarks",
 "Totalfamily": "4",
 "PrimaryEarning": "Example",
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
 "Assets": "Example assets",
 "StudentAspiration": "Example aspiration",
 "ConsentParticipation": "Yes",
 "Remarks": "Updated remarks",
 "StudentMotivation": "Example motivation",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Example",
 "NatureofIncome": "Example",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Example",
 "CropPattern": "Example",
 "AnyOutstandingLoans": "No",
 "Extracurricular": "Example",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Example recommendation",
 "Upload": "existing.pdf,new-file.jpg",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Updated Member",
 "Relation": "Parent",
 "Age": "46",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "22000"
 }
 ]
}

## DTO 2: FamilyMemberDto

Purpose: Represents a related record in PayanaFamilyMembers.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | No | No | Family member identifier used to locate the row for update. |
| Name | string | No | Yes | Family member name. |
| Relation | string | No | Yes | Relation to the student. |
| Age | string | No | Yes | Age. |
| Education | string | No | Yes | Education. |
| Occupation | string | No | Yes | Occupation. |
| MonthlyIncome | string | No | Yes | Monthly income. |

## Sample FamilyMemberDto

{
 "FamilyID": 1,
 "Name": "Example Member",
 "Relation": "Parent",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "20000"
}

# DATABASE BEHAVIOR

|  |  |  |
| --- | --- | --- |
| **Operation** | **Table** | **SQL Behavior** |
| Get main record | HouseVisitForm | SELECT \* WHERE HouseVisitID = @HouseVisitID |
| Get family members | PayanaFamilyMembers | SELECT \* WHERE HouseVisitID = @HouseVisitID |
| Update main record | HouseVisitForm | UPDATE all exposed fields WHERE HouseVisitID = @HouseVisitID |
| Update family members | PayanaFamilyMembers | UPDATE Name, Relation, Age, Education, Occupation, MonthlyIncome WHERE FamilyID = @FamilyID AND HouseVisitID = @HouseVisitID |

# DEFAULTS / CONDITIONALS / SECURITY

* No default Status, IsActive, CreatedDate, ModifiedDate, UserID, EmployeeID, or Role values are set by this controller.
* No JWT claims are explicitly consumed by the controller.
* No role-based authorization is explicitly implemented in the controller.
* No pagination, searching, sorting, date-range filtering, or dropdown endpoint exists in this controller.
* No DELETE endpoint exists.
* No duplicate check is implemented.
* No explicit database transaction is implemented.
* No hard-delete or soft-delete behavior exists.
* No dropdown APIs exist in this controller.

# FINAL CONTRACT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **HTTP Method** | **Route** | **JWT** | **Purpose** |
| 1 | GET | /api/edit-payana-house-visits/{id} | Required | Get one House Visit with family members. |
| 2 | POST | /api/edit-payana-house-visits/{id}/update | Required | Partially update House Visit, optionally upload files, and update supplied family members. |

**Important source-of-truth note:** This contract documents the supplied controller's actual routes, attributes, DTOs, database targets, validation, multipart behavior, and visible business logic. Where the controller does not specify a JWT claim, role, file size, extension restriction, or other rule, it is explicitly marked as not specified.