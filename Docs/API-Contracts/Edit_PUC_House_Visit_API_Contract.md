**API CONTRACT**

**Edit PUC House Visit API**

EditPUCHouseVisitApiController

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/editpuc-house-visits |
| Controller | EditPUCHouseVisitApiController |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT is explicitly applied at ACTION LEVEL to both public actions exposed by the controller. |
| Endpoint Count | 2 |

The supplied controller has no controller-level authorization attribute. Both exposed actions explicitly have [JwtSessionFilter], so JWT is required for both endpoints. No endpoint in this controller is public based on the supplied code. No role checks, JWT claims, or Session values are directly consumed by the controller.

# ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Purpose** |
| 1 | GET | /api/editpuc-house-visits/{id} | Required | Retrieve a PUC house visit record together with its family members. |
| 2 | POST | /api/editpuc-house-visits/{id}/update | Required | Update a PUC house visit and optionally upload files and update family-member records. |

# 1. GET PUC HOUSE VISIT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/editpuc-house-visits/{id} |
| Purpose | Retrieves a HouseVisitForm\_PUC record by HouseVisitID and attaches all related HouseVisitFamilyMembers records. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter/Authorization Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Filter is explicitly action-level through [JwtSessionFilter].
* No JWT claims are directly read by this action.
* No UserID, EmployeeID, Role, or Session value is used by this action.
* No role-based authorization is implemented in the controller.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID. Must be greater than 0. |

## Query Parameters

None.

## Request Body

None.

## Validation Rules

* If id <= 0, returns 400 Bad Request with 'Invalid House Visit ID.'.
* House visit is queried with parameterized HouseVisitID = @HouseVisitID.
* If no matching record is found, returns 404 Not Found with 'House Visit Record Not Found.'.
* Family members are retrieved using HouseVisitID = @HouseVisitID.
* Data-reader helper methods convert DBNull/string values to null, DBNull/inconvertible integer values to 0, and DBNull/inconvertible date values to null.
* No ModelState validation, duplicate check, role validation, UserID filtering, EmployeeID filtering, pagination, search, sorting, soft delete, or transaction logic is implemented.

## Database Behavior

* Reads HouseVisitForm\_PUC using SELECT \* WHERE HouseVisitID = @HouseVisitID.
* Reads HouseVisitFamilyMembers using SELECT \* WHERE HouseVisitID = @HouseVisitID.
* FamilyMembers are attached to HouseVisitDto before the response is returned.

## Success Response (200)

{
 "success": true,
 "data": {
 "HouseVisitID": 1001,
 "StudentID": 501,
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Concrete",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "BPL",
 "DigitalAccess": "Mobile",
 "LivingCondition": "Good",
 "LatestElecBill": "1200",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "600",
 "RemarkGeneralLivingCondition": "Example remark",
 "Totalfamily": "4",
 "PrimaryEarning": "Father",
 "AverageIncome": "25000",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "OutstandingLoanAmount": "50000",
 "MonthlyEMI": "2500",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "House, Vehicle",
 "StudentAspiration": "Higher Education",
 "ConsentParticipation": "Yes",
 "Remarks": "Example remarks",
 "StudentMotivation": "High",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Salary",
 "NatureofIncome": "Regular",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Borewell",
 "CropPattern": "N/A",
 "AnyOutstandingLoans": "Yes",
 "Extracurricular": "Sports",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Continue support",
 "Upload": "file1.pdf,file2.jpg",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Example Father",
 "Relation": "Father",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "25000"
 }
 ]
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | House visit found and mapped successfully. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by this action; behavior may depend on filter infrastructure. |
| 404 Not Found | No HouseVisitForm\_PUC row matches HouseVisitID. |
| 500 Internal Server Error | Unhandled exception; response contains ex.Message. |

# 2. UPDATE PUC HOUSE VISIT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/editpuc-house-visits/{id}/update |
| Purpose | Updates supplied house-visit fields, optionally saves uploaded files, and optionally updates existing family-member records from a JSON array. |
| Content-Type | multipart/form-data |
| Authorization | JWT Required |
| Filter/Authorization Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Action-level [JwtSessionFilter] is explicitly present.
* No JWT claims are directly read.
* No Session values, UserID, EmployeeID, or Role are directly used.
* No explicit role-based authorization is implemented in this controller.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID. Must be greater than 0. |

## Query Parameters

None.

## Request Body / Multipart

The request must use multipart/form-data. Normal form fields are read case-insensitively. Only supplied main form fields are merged into the existing HouseVisitDto; omitted fields retain their current values. FamilyMembers, when supplied, is a JSON array embedded as a form field.

## A. Normal Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| StudentName | string | Optional | If supplied, replaces the current StudentName. |
| CourseInstitution | string | Optional | If supplied, replaces the current CourseInstitution. |
| Address | string | Optional | If supplied, replaces the current Address. |
| VisitDate | date/date-time | Optional | If supplied and parseable, replaces the current VisitDate; invalid/blank retains current value. |
| FieldSupervisorName | string | Optional | If supplied, replaces current value. |
| PersonsInteracted | string | Optional | If supplied, replaces current value. |
| HouseType | string | Optional | If supplied, replaces current value. |
| Ownership | string | Optional | If supplied, replaces current value. |
| Rooms | string | Optional | If supplied, replaces current value. |
| Floor | string | Optional | If supplied, replaces current value. |
| RationCardType | string | Optional | If supplied, replaces current value. |
| DigitalAccess | string | Optional | If supplied, replaces current value. |
| LivingCondition | string | Optional | If supplied, replaces current value. |
| LatestElecBill | string | Optional | If supplied, replaces current value. |
| ElecUnitsCons | string | Optional | If supplied, replaces current value. |
| InternetBillCharges | string | Optional | If supplied, replaces current value. |
| RemarkGeneralLivingCondition | string | Optional | If supplied, replaces current value. |
| Totalfamily | string | Optional | If supplied, replaces current value. |
| PrimaryEarning | string | Optional | If supplied, replaces current value. |
| AverageIncome | string | Optional | If supplied, replaces current value. |
| OtherLandHoldings | string | Optional | If supplied, replaces current value. |
| TotalChildrenStudying | string | Optional | If supplied, replaces current value. |
| AnnualEducationExpense | string | Optional | If supplied, replaces current value. |
| ScholarshipSupport | string | Optional | If supplied, replaces current value. |
| GovernmentSchemes | string | Optional | If supplied, replaces current value. |
| EducationalLoanAmount | string | Optional | If supplied, replaces current value. |
| OutstandingLoanAmount | string | Optional | If supplied, replaces current value. |
| MonthlyEMI | string | Optional | If supplied, replaces current value. |
| HealthVulnerability | string | Optional | If supplied, replaces current value. |
| HealthVulnerabilityRemarks | string | Optional | If supplied, replaces current value. |
| Assets | string | Optional | If supplied, replaces current value. |
| StudentAspiration | string | Optional | If supplied, replaces current value. |
| ConsentParticipation | string | Optional | If supplied, replaces current value. |
| Remarks | string | Optional | If supplied, replaces current value. |
| StudentMotivation | string | Optional | If supplied, replaces current value. |
| SupervisorJustification | string | Optional | If supplied, replaces current value. |
| DeclarationConfirmation | string | Optional | If supplied, replaces current value. |
| DeclarationDate | date/date-time | Optional | If supplied and parseable, replaces current DeclarationDate; invalid/blank retains current value. |
| PrimaryIncomeSource | string | Optional | If supplied, replaces current value. |
| NatureofIncome | string | Optional | If supplied, replaces current value. |
| IncomeShocks | string | Optional | If supplied, replaces current value. |
| AgriculturalLand | string | Optional | If supplied, replaces current value. |
| WaterSource | string | Optional | If supplied, replaces current value. |
| CropPattern | string | Optional | If supplied, replaces current value. |
| AnyOutstandingLoans | string | Optional | If supplied, replaces current value. |
| Extracurricular | string | Optional | If supplied, replaces current value. |
| HouseholdVulnerabilityLevel | string | Optional | If supplied, replaces current value. |
| Recommendation | string | Optional | If supplied, replaces current value. |
| FamilyMembers | JSON string | Optional | JSON array of family-member update objects. Processed only when supplied and non-empty. |

## B. File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| UploadedFile | file | Optional | Not restricted by controller | Not specified | Any uploaded multipart file is copied to ~/HouseDocUploads/ and its generated filename is appended to Upload. |

## File Upload Rules

* The controller processes every file in provider.FileData; there is no explicit field-name restriction in SaveUploadedFiles.
* The source comment documents the expected multipart file field as UploadedFile, but the actual SaveUploadedFiles method iterates over all uploaded files.
* Files are optional. If no new file is supplied, the existing Upload value is retained.
* No file extension whitelist is enforced by the controller.
* No maximum file size is defined in the controller.
* Each uploaded file is assigned a new GUID filename while preserving the original extension.
* Generated filename format: {GUID}{originalExtension}.
* Files are copied to the server folder mapped from ~/HouseDocUploads/.
* Multiple uploaded files are supported because the method loops through all provider.FileData entries.
* Generated filenames are comma-separated and appended to the existing Upload value when an existing value is present.
* The previous permanent files are not deleted by this controller when new files are added.
* Incoming temporary multipart files are stored under ~/App\_Data/TempUploads/ and deleted after processing.
* Cleanup failures are silently ignored.

## C. FamilyMembers JSON

FamilyMembers is an optional form field containing a JSON array. The controller updates existing family-member rows only; it does not insert new members or delete existing members.

[
 {
 "FamilyID": 1,
 "Name": "Example Father",
 "Relation": "Father",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "25000"
 },
 {
 "FamilyID": 2,
 "Name": "Example Mother",
 "Relation": "Mother",
 "Age": "42"
 }
]

## FamilyMembers Rules

* The JSON must parse as a JArray.
* Each array item must be a JSON object to be processed.
* FamilyID must be present, parseable as an integer, and greater than 0; otherwise that item is skipped.
* Name, Relation, Age, Education, Occupation and MonthlyIncome are individually optional within each object.
* Only properties actually present in an object are included in its UPDATE statement.
* An explicitly null JSON property is written as DBNull.Value.
* If an object contains no recognized updatable properties, it is skipped.
* Each update is constrained by both FamilyID = @FamilyID and HouseVisitID = @HouseVisitID.
* No new family-member rows are inserted.
* No family-member rows are deleted.
* Invalid FamilyMembers JSON causes 400 Bad Request with 'Invalid FamilyMembers JSON.'.

## Validation Rules

* id is required and must be greater than 0.
* Request must use multipart/form-data.
* The main house-visit record must exist before update.
* Main form fields are not individually required by controller validation.
* String values are accepted as supplied; no min/max length validation is implemented.
* Dates are parsed with DateTime.TryParse. Invalid or blank date values retain the current database value.
* No numeric validation is implemented because the exposed main fields are represented as strings in HouseVisitDto.
* No email validation, duplicate validation, foreign-key validation, role validation, or ModelState validation is implemented.
* FamilyMembers must be valid JSON when supplied and non-empty.
* FamilyID in a family-member JSON object must be a positive integer.
* No file extension or file-size validation is implemented.

## Business Logic Notes

* The current HouseVisitDto is loaded before changes are applied.
* Only supplied normal form fields are changed; missing fields retain existing values.
* The main row is updated before FamilyMembers JSON is processed.
* Upload retains the old value when no new file is uploaded.
* If new files exist, their generated names are appended to the existing Upload value, separated by commas.
* HouseVisitForm\_PUC is updated using HouseVisitID as the WHERE condition.
* FamilyMembers updates use both FamilyID and HouseVisitID.
* FamilyMembers processing occurs after the main update.
* The response re-queries the database after all processing and returns the updated HouseVisitDto with FamilyMembers.
* No CreatedBy/ModifiedBy fields are populated.
* No status/default status is set.
* No user identity is taken from JWT claims.
* No transaction encompasses the main update and family-member updates; they are separate database operations.
* No soft delete logic exists.

## Database Update Fields

|  |  |
| --- | --- |
| **Database Column** | **Source** |
| StudentName | @StudentName |
| CourseInstitution | @CourseInstitution |
| Address | @Address |
| VisitDate | @VisitDate |
| FieldSupervisorName | @FieldSupervisorName |
| PersonsInteracted | @PersonsInteracted |
| HouseType | @HouseType |
| Ownership | @Ownership |
| Rooms | @Rooms |
| Floor | @Floor |
| RationCardType | @RationCardType |
| DigitalAccess | @DigitalAccess |
| LivingCondition | @LivingCondition |
| LatestElecBill | @LatestElecBill |
| ElecUnitsCons | @ElecUnitsCons |
| InternetBillCharges | @InternetBillCharges |
| RemarkGeneralLivingCondition | @RemarkGeneralLivingCondition |
| Totalfamily | @Totalfamily |
| PrimaryEarning | @PrimaryEarning |
| AverageIncome | @AverageIncome |
| OtherLandHoldings | @OtherLandHoldings |
| TotalChildrenStudying | @TotalChildrenStudying |
| AnnualEducationExpense | @AnnualEducationExpense |
| ScholarshipSupport | @ScholarshipSupport |
| GovernmentSchemes | @GovernmentSchemes |
| EducationalLoanAmount | @EducationalLoanAmount |
| OutstandingLoanAmount | @OutstandingLoanAmount |
| MonthlyEMI | @MonthlyEMI |
| HealthVulnerability | @HealthVulnerability |
| HealthVulnerabilityRemarks | @HealthVulnerabilityRemarks |
| Assets | @Assets |
| StudentAspiration | @StudentAspiration |
| ConsentParticipation | @ConsentParticipation |
| Remarks | @Remarks |
| StudentMotivation | @StudentMotivation |
| SupervisorJustification | @SupervisorJustification |
| DeclarationConfirmation | @DeclarationConfirmation |
| DeclarationDate | @DeclarationDate |
| PrimaryIncomeSource | @PrimaryIncomeSource |
| NatureofIncome | @NatureofIncome |
| IncomeShocks | @IncomeShocks |
| AgriculturalLand | @AgriculturalLand |
| WaterSource | @WaterSource |
| CropPattern | @CropPattern |
| AnyOutstandingLoans | @AnyOutstandingLoans |
| Extracurricular | @Extracurricular |
| HouseholdVulnerabilityLevel | @HouseholdVulnerabilityLevel |
| Recommendation | @Recommendation |
| Upload | CASE: new uploadedFileNames if non-null, otherwise existing Upload |

## Success Response (200)

{
 "success": true,
 "message": "PUC House Visit updated successfully.",
 "data": {
 "HouseVisitID": 1001,
 "StudentID": 501,
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Concrete",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "BPL",
 "DigitalAccess": "Mobile",
 "LivingCondition": "Good",
 "LatestElecBill": "1200",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "600",
 "RemarkGeneralLivingCondition": "Example remark",
 "Totalfamily": "4",
 "PrimaryEarning": "Father",
 "AverageIncome": "25000",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "OutstandingLoanAmount": "50000",
 "MonthlyEMI": "2500",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "House, Vehicle",
 "StudentAspiration": "Higher Education",
 "ConsentParticipation": "Yes",
 "Remarks": "Example remarks",
 "StudentMotivation": "High",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Salary",
 "NatureofIncome": "Regular",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Borewell",
 "CropPattern": "N/A",
 "AnyOutstandingLoans": "Yes",
 "Extracurricular": "Sports",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Continue support",
 "Upload": "old.pdf,550e8400-e29b-41d4-a716-446655440000.jpg",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "Name": "Example Father",
 "Relation": "Father",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "25000"
 }
 ]
 }
}

## Failure Responses

|  |  |
| --- | --- |
| **Status** | **When** |
| 400 Bad Request | Invalid id; request is not multipart/form-data; or supplied FamilyMembers JSON is invalid. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by this action; may depend on authorization infrastructure. |
| 404 Not Found | House visit does not exist, or the main UPDATE affects zero rows. |
| 409 Conflict | Not explicitly used by the controller. |
| 500 Internal Server Error | Unhandled exception; response contains ex.Message. |

## Example Error JSON

{
 "success": false,
 "message": "Invalid FamilyMembers JSON."
}

## Status Codes Used

200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error. 401 Unauthorized is applicable through the explicit JwtSessionFilter on both protected actions. 403 Forbidden is not explicitly returned by controller code. 409 Conflict is not used.

# COMMON DTOS

## 1. HouseVisitDto

Purpose: Represents the PUC house visit record returned by the GET endpoint and used internally for the update endpoint.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | Not specified | No | Maps from HouseVisitID. |
| StudentID | int | Not specified | No | Maps from PUC\_StudentID. |
| StudentName | string | Not specified | Yes | Student name. |
| CourseInstitution | string | Not specified | Yes | Course/institution. |
| Address | string | Not specified | Yes | House address. |
| VisitDate | DateTime? | Not specified | Yes | House visit date. |
| FieldSupervisorName | string | Not specified | Yes | Field supervisor. |
| PersonsInteracted | string | Not specified | Yes | Persons interacted with during visit. |
| HouseType | string | Not specified | Yes | House type. |
| Ownership | string | Not specified | Yes | Ownership information. |
| Rooms | string | Not specified | Yes | Number/details of rooms. |
| Floor | string | Not specified | Yes | Floor information. |
| RationCardType | string | Not specified | Yes | Ration card type. |
| DigitalAccess | string | Not specified | Yes | Digital access. |
| LivingCondition | string | Not specified | Yes | General living condition. |
| LatestElecBill | string | Not specified | Yes | Latest electricity bill. |
| ElecUnitsCons | string | Not specified | Yes | Electricity units consumed. |
| InternetBillCharges | string | Not specified | Yes | Internet bill charges. |
| RemarkGeneralLivingCondition | string | Not specified | Yes | General living-condition remark. |
| Totalfamily | string | Not specified | Yes | Total family value. |
| PrimaryEarning | string | Not specified | Yes | Primary earning member/source. |
| AverageIncome | string | Not specified | Yes | Average income. |
| OtherLandHoldings | string | Not specified | Yes | Other land holdings. |
| TotalChildrenStudying | string | Not specified | Yes | Children studying. |
| AnnualEducationExpense | string | Not specified | Yes | Annual education expense. |
| ScholarshipSupport | string | Not specified | Yes | Scholarship support. |
| GovernmentSchemes | string | Not specified | Yes | Government schemes. |
| EducationalLoanAmount | string | Not specified | Yes | Educational loan amount. |
| OutstandingLoanAmount | string | Not specified | Yes | Outstanding loan amount. |
| MonthlyEMI | string | Not specified | Yes | Monthly EMI. |
| HealthVulnerability | string | Not specified | Yes | Health vulnerability. |
| HealthVulnerabilityRemarks | string | Not specified | Yes | Health vulnerability remarks. |
| Assets | string | Not specified | Yes | Household assets. |
| StudentAspiration | string | Not specified | Yes | Student aspiration. |
| ConsentParticipation | string | Not specified | Yes | Consent/participation. |
| Remarks | string | Not specified | Yes | General remarks. |
| StudentMotivation | string | Not specified | Yes | Student motivation. |
| SupervisorJustification | string | Not specified | Yes | Supervisor justification. |
| DeclarationConfirmation | string | Not specified | Yes | Declaration confirmation. |
| DeclarationDate | DateTime? | Not specified | Yes | Declaration date. |
| PrimaryIncomeSource | string | Not specified | Yes | Primary income source. |
| NatureofIncome | string | Not specified | Yes | Nature of income. |
| IncomeShocks | string | Not specified | Yes | Income shocks. |
| AgriculturalLand | string | Not specified | Yes | Agricultural land. |
| WaterSource | string | Not specified | Yes | Water source. |
| CropPattern | string | Not specified | Yes | Crop pattern. |
| AnyOutstandingLoans | string | Not specified | Yes | Outstanding loan indicator. |
| Extracurricular | string | Not specified | Yes | Extracurricular information. |
| HouseholdVulnerabilityLevel | string | Not specified | Yes | Household vulnerability level. |
| Recommendation | string | Not specified | Yes | Supervisor/system recommendation. |
| Upload | string | Not specified | Yes | Comma-separated uploaded filenames. |
| FamilyMembers | List<FamilyMemberDto> | Not specified | Yes | Related family-member records loaded separately. |

## Sample HouseVisitDto Response

{
 "HouseVisitID": 1001,
 "StudentID": 501,
 "StudentName": "Example Student",
 "CourseInstitution": "Example Institution",
 "Address": "Example Address",
 "VisitDate": "2026-08-31T00:00:00",
 "FieldSupervisorName": "Example Supervisor",
 "PersonsInteracted": "Parent",
 "HouseType": "Concrete",
 "Ownership": "Owned",
 "Rooms": "3",
 "Floor": "Ground",
 "RationCardType": "BPL",
 "DigitalAccess": "Mobile",
 "LivingCondition": "Good",
 "LatestElecBill": "1200",
 "ElecUnitsCons": "150",
 "InternetBillCharges": "600",
 "RemarkGeneralLivingCondition": "Example remark",
 "Totalfamily": "4",
 "PrimaryEarning": "Father",
 "AverageIncome": "25000",
 "OtherLandHoldings": "None",
 "TotalChildrenStudying": "2",
 "AnnualEducationExpense": "30000",
 "ScholarshipSupport": "Yes",
 "GovernmentSchemes": "Example Scheme",
 "EducationalLoanAmount": "0",
 "OutstandingLoanAmount": "50000",
 "MonthlyEMI": "2500",
 "HealthVulnerability": "No",
 "HealthVulnerabilityRemarks": null,
 "Assets": "House, Vehicle",
 "StudentAspiration": "Higher Education",
 "ConsentParticipation": "Yes",
 "Remarks": "Example remarks",
 "StudentMotivation": "High",
 "SupervisorJustification": "Example justification",
 "DeclarationConfirmation": "Yes",
 "DeclarationDate": "2026-08-31T00:00:00",
 "PrimaryIncomeSource": "Salary",
 "NatureofIncome": "Regular",
 "IncomeShocks": "No",
 "AgriculturalLand": "No",
 "WaterSource": "Borewell",
 "CropPattern": "N/A",
 "AnyOutstandingLoans": "Yes",
 "Extracurricular": "Sports",
 "HouseholdVulnerabilityLevel": "Low",
 "Recommendation": "Continue support",
 "Upload": "file1.pdf,file2.jpg",
 "FamilyMembers": []
}

## 2. FamilyMemberDto

Purpose: Represents one related family-member record under a PUC house visit.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | Not specified | No | Family member identifier used for updates. |
| Name | string | Not specified | Yes | Family member name. |
| Relation | string | Not specified | Yes | Relationship to student. |
| Age | string | Not specified | Yes | Age. |
| Education | string | Not specified | Yes | Education. |
| Occupation | string | Not specified | Yes | Occupation. |
| MonthlyIncome | string | Not specified | Yes | Monthly income. |

{
 "FamilyID": 1,
 "Name": "Example Father",
 "Relation": "Father",
 "Age": "45",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "25000"
}

# REQUEST EXAMPLE — MULTIPART/FORM-DATA

The following illustrates the contract structure. The controller does not provide a fixed sample payload or enforce a required field set.

|  |  |
| --- | --- |
| **Part Name** | **Example Value** |
| StudentName | Example Student |
| VisitDate | 2026-08-31 |
| Address | Example Address |
| HouseType | Concrete |
| Ownership | Owned |
| AverageIncome | 25000 |
| HealthVulnerability | No |
| FamilyMembers | [{"FamilyID":1,"Name":"Example Father","Relation":"Father","Age":"45","Education":"Graduate","Occupation":"Employee","MonthlyIncome":"25000"}] |
| UploadedFile | <binary file> |

# JWT / AUTHORIZATION MATRIX

|  |  |  |  |
| --- | --- | --- | --- |
| **Endpoint** | **JWT Required** | **Current Mechanism** | **Claims / Roles** |
| GET /{id} | Yes | Action-level [JwtSessionFilter] | No claims/roles directly consumed |
| POST /{id}/update | Yes | Action-level [JwtSessionFilter] | No claims/roles directly consumed |

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Behavior** |
| Primary table | HouseVisitForm\_PUC |
| Related table | HouseVisitFamilyMembers |
| GET main record | SELECT \* FROM HouseVisitForm\_PUC WHERE HouseVisitID = @HouseVisitID |
| GET family members | SELECT \* FROM HouseVisitFamilyMembers WHERE HouseVisitID = @HouseVisitID |
| Main update | UPDATE HouseVisitForm\_PUC ... WHERE HouseVisitID = @HouseVisitID |
| Family update | UPDATE HouseVisitFamilyMembers SET supplied fields WHERE FamilyID = @FamilyID AND HouseVisitID = @HouseVisitID |
| File storage | ~/HouseDocUploads/ |
| Multipart temp storage | ~/App\_Data/TempUploads/ |
| File naming | GUID + original extension |
| File type restriction | None implemented in controller |
| File size restriction | Not specified |
| Existing Upload retention | Yes; new filenames are appended to existing value |
| UserID filtering | Not implemented |
| EmployeeID filtering | Not implemented |
| Role filtering | Not implemented |
| CreatedBy / ModifiedBy | Not populated |
| Status/default status | Not implemented |
| Soft delete | Not implemented |
| Duplicate checks | Not implemented |
| Transaction | No explicit transaction |

# IMPORTANT CONTRACT NOTES

* Both endpoints require JWT because [JwtSessionFilter] is explicitly applied at action level to both.
* No controller-level JWT filter is invented.
* No required role is specified.
* No JWT claims or Session dependencies are directly used by the supplied controller.
* The update endpoint is multipart/form-data.
* All main form fields are optional at controller level; omitted values retain the current database values.
* FamilyMembers is optional and updates existing family-member rows only.
* FamilyMember fields are selectively updated based on properties actually present in each JSON object.
* Uploaded files have no controller-enforced extension whitelist or size limit.
* Multiple files are supported by iterating provider.FileData.
* Uploaded filenames are GUID-based and appended to the existing Upload value.
* No file deletion/replacement cleanup of old permanent files is implemented.
* No dropdown API exists in this controller.
* No pagination/list/search endpoint exists.
* Requiredness is marked 'Not specified in controller' where the code provides no explicit required-field validation.

# FINAL QUALITY CHECK

* All 2 controller endpoints included.
* HTTP methods and exact routes included.
* Route prefix documented once at the top.
* JWT requirements determined from actual [JwtSessionFilter] attributes.
* No public endpoint incorrectly created.
* Path parameter documented.
* Multipart form fields documented.
* FamilyMembers JSON structure documented.
* File upload behavior documented.
* File optionality, multiple-file support, extension behavior and size behavior documented.
* Required/optional/nullable behavior documented without inventing DTO requirements.
* Validation and business rules documented.
* Database SELECT and UPDATE behavior documented.
* Success and failure responses documented.
* All controller DTOs included under COMMON DTOS.
* No dropdown API invented.
* No fields or behavior outside the supplied controller have been asserted as fact.