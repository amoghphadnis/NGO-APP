**API CONTRACT**

**Edit Professional House Visit API**

EditProfessionalHouseVisitApiController

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/edit-professional-house-visits |
| Controller | EditProfessionalHouseVisitApiController |
| Authentication | JWT Required on both endpoints via action-level [JwtSessionFilter] |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| File Upload Directory | ~/HouseDocUploads |

Both controller actions explicitly use [JwtSessionFilter]. No controller-level JWT filter is present. The controller does not directly read UserID, EmployeeID, Role, District, or other Session values.

# 1. Get Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-professional-house-visits/{id} |
| Purpose | Retrieves one Professional House Visit and its related Professional Family Members. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected Authorization header: Bearer <JWT\_TOKEN>.
* Authentication is enforced by the existing [JwtSessionFilter] on this action.
* Required JWT claims: Not specified in this controller.
* Session dependency: None visible in this action.
* Required roles: Not specified in this controller.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0. |

## Query Parameters

None.

## Request Body

None.

## Validation Rules

* id must be greater than 0; otherwise 400 Bad Request.
* The record is looked up by HouseVisitID in HouseVisitForm\_Professional.
* If no record is found, 404 Not Found is returned.
* No search, pagination, sorting, duplicate validation, or role-specific validation is implemented in the action.

## Database / Business Logic

* SELECT \* FROM HouseVisitForm\_Professional WHERE HouseVisitID = @HouseVisitID.
* The response maps Professional\_StudentID to StudentID.
* After the main record is found, ProfessionalFamilyMembers are loaded by the same HouseVisitID.
* Family-member fields are returned inside FamilyMembers.
* String database NULLs are mapped to null by GetString.
* Invalid/unconvertible integer values are mapped to 0 by GetInt.
* Invalid/unconvertible dates are mapped to null by GetDateTime.

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
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | House Visit found and mapped successfully. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT/session filter rejects the request; exact filter response is not specified in this controller. |
| 403 Forbidden | Not explicitly returned by the action; only applicable if enforced by authentication infrastructure. |
| 404 Not Found | No House Visit exists for the supplied id. |
| 409 Conflict | Not used by this action. |
| 500 Internal Server Error | Unhandled exception; response includes message, exceptionType, stackTrace and innerException. |

# 2. Update Professional House Visit

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/edit-professional-house-visits/{id}/update |
| Purpose | Partially updates supplied Professional House Visit fields, optionally saves uploaded files, and partially updates supplied Professional Family Members. |
| Content-Type | multipart/form-data |
| Authorization | JWT Required |
| Filter Scope | Action-level [JwtSessionFilter] |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected Authorization header: Bearer <JWT\_TOKEN>.
* Authentication is enforced by [JwtSessionFilter] on this action.
* Required claims/roles: Not specified in this controller.
* Session dependency: None visible in this action.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | HouseVisitID; must be greater than 0 and must match model.HouseVisitID when supplied. |

## Request Format

multipart/form-data is mandatory. The request can provide either a JSON text field named model or individual form-data fields. File upload uses the field name UploadedFile.

## Multipart Normal Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| model | JSON string | Conditionally required | Complete/partial ProfessionalHouseVisitUpdateDto JSON. If valid JSON is supplied, it is deserialized and individual form fields are not used. |
| HouseVisitID | int/string | Optional | When individual fields are used, controller initializes HouseVisitID from the URL id. In JSON mode, if <= 0 it is replaced with the URL id; if non-zero it must match the URL id. |
| StudentID | int | Optional | Present in DTO but not included in the SQL UPDATE statement. |
| StudentName | string | Optional | Updated with COALESCE; omitted/null retains existing value. |
| CourseInstitution | string | Optional | Updated with COALESCE; omitted/null retains existing value. |
| Address | string | Optional | Updated with COALESCE; omitted/null retains existing value. |
| VisitDate | DateTime | Optional | Updated when parsed successfully; otherwise remains null and SQL retains existing value. |
| FieldSupervisorName | string | Optional | Updated with COALESCE. |
| PersonsInteracted | string | Optional | Updated with COALESCE. |
| HouseType | string | Optional | Updated with COALESCE. |
| Ownership | string | Optional | Updated with COALESCE. |
| Rooms | string | Optional | Updated with COALESCE. |
| Floor | string | Optional | Updated with COALESCE. |
| RationCardType | string | Optional | Updated with COALESCE. |
| DigitalAccess | string | Optional | Updated with COALESCE. |
| LivingCondition | string | Optional | Updated with COALESCE. |
| LatestElecBill | string | Optional | Updated with COALESCE. |
| ElecUnitsCons | string | Optional | Updated with COALESCE. |
| InternetBillCharges | string | Optional | Updated with COALESCE. |
| RemarkGeneralLivingCondition | string | Optional | Updated with COALESCE. |
| Totalfamily | string | Optional | Updated with COALESCE. |
| PrimaryEarning | string | Optional | Updated with COALESCE. |
| AverageIncome | string | Optional | Updated with COALESCE. |
| OtherLandHoldings | string | Optional | Updated with COALESCE. |
| TotalChildrenStudying | string | Optional | Updated with COALESCE. |
| AnnualEducationExpense | string | Optional | Updated with COALESCE. |
| ScholarshipSupport | string | Optional | Updated with COALESCE. |
| GovernmentSchemes | string | Optional | Updated with COALESCE. |
| EducationalLoanAmount | string | Optional | Updated with COALESCE. |
| OutstandingLoanAmount | string | Optional | Updated with COALESCE. |
| MonthlyEMI | string | Optional | Updated with COALESCE. |
| HealthVulnerability | string | Optional | Updated with COALESCE. |
| HealthVulnerabilityRemarks | string | Optional | Updated with COALESCE. |
| Assets | string | Optional | Updated with COALESCE. |
| StudentAspiration | string | Optional | Updated with COALESCE. |
| ConsentParticipation | string | Optional | Updated with COALESCE. |
| Remarks | string | Optional | Updated with COALESCE. |
| StudentMotivation | string | Optional | Updated with COALESCE. |
| SupervisorJustification | string | Optional | Updated with COALESCE. |
| DeclarationConfirmation | string | Optional | Updated with COALESCE. |
| DeclarationDate | DateTime | Optional | Updated when parsed successfully. |
| PrimaryIncomeSource | string | Optional | Updated with COALESCE. |
| NatureofIncome | string | Optional | Updated with COALESCE. |
| IncomeShocks | string | Optional | Updated with COALESCE. |
| AgriculturalLand | string | Optional | Updated with COALESCE. |
| WaterSource | string | Optional | Updated with COALESCE. |
| CropPattern | string | Optional | Updated with COALESCE. |
| AnyOutstandingLoans | string | Optional | Updated with COALESCE. |
| Extracurricular | string | Optional | Updated with COALESCE. |
| HouseholdVulnerabilityLevel | string | Optional | Updated with COALESCE. |
| Recommendation | string | Optional | Updated with COALESCE. |
| Upload | string | Optional | Existing/new upload filename string. New generated filenames are appended before update. |

## File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| UploadedFile | File | Optional | Not specified in controller | Not specified in controller | Uploaded file(s) are accepted from multipart FileData; generated GUID filename preserves the original extension. |

* File is optional; the action does not reject a request when no file is provided.
* Multiple files are supported by iterating provider.FileData.
* Each valid uploaded file is moved from the temporary multipart location to ~/HouseDocUploads.
* Stored filename is generated as Guid.NewGuid().ToString() + original extension.
* If an existing Upload value is present and no new file is supplied, the existing upload value is retained.
* If new files are supplied, generated filenames are appended to the existing upload value using commas.
* Maximum file size and extension allow-list are not specified in the controller.

## Update Behavior — Important

* The SQL UPDATE uses COALESCE(@Field, Field) for every listed update column. Therefore, omitting a field or supplying null does NOT empty the existing database value; the existing value is retained.
* Only fields included in the SQL UPDATE are changed.
* StudentID exists in ProfessionalHouseVisitUpdateDto but is NOT updated by UpdateHouseVisit.
* FamilyMembers are updated only when model.FamilyMembers is non-null and contains at least one item.
* Family-member updates also use COALESCE, so null supplied fields retain existing family-member values.
* Family member updates require FamilyID > 0 and match both FamilyID and HouseVisitID.
* Family-member updates are executed inside a SQL transaction. If one family-member update throws, the family-member transaction is rolled back.
* The main House Visit update and family-member transaction are separate database operations; there is no single transaction covering both.

## Validation Rules

* id must be greater than 0.
* Request Content-Type must be multipart/form-data.
* The existing House Visit must exist before update.
* 'model' is optional when individual form-data fields are supplied; if model is present it must contain valid JSON.
* If model.HouseVisitID <= 0, it is replaced with the URL id.
* If model.HouseVisitID is non-zero and differs from the URL id, 400 Bad Request is returned.
* Individual VisitDate and DeclarationDate strings are only assigned when DateTime.TryParse succeeds.
* FamilyID must be greater than 0 for every supplied family-member update.
* No explicit string length, numeric range, email, duplicate, file-extension, or file-size validation is implemented.
* HouseVisitID, StudentID, and FamilyIDs are not otherwise validated against additional business rules in the controller.

## Request Example — JSON model field

Content-Type: multipart/form-data

Field: model
Value:
{
 "HouseVisitID": 101,
 "StudentName": "Updated Student Name",
 "Address": "Updated Address",
 "VisitDate": "2026-08-31",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "HouseVisitID": 101,
 "StudentID": 5001,
 "Name": "Updated Member",
 "Relation": "Parent",
 "Age": "46",
 "Education": "Graduate",
 "Occupation": "Employee",
 "MonthlyIncome": "22000"
 }
 ]
}

Field: UploadedFile
Value: <optional file>

## Request Example — Individual form-data fields

Content-Type: multipart/form-data

StudentName = Updated Student Name
Address = Updated Address
VisitDate = 2026-08-31
Remarks = Updated remark
UploadedFile = <optional file>

## Success Response (200)

{
 "success": true,
 "message": "Professional House Visit updated successfully.",
 "data": {
 "HouseVisitID": 101,
 "StudentID": 5001,
 "StudentName": "Updated Student Name",
 "Address": "Updated Address",
 "FamilyMembers": [
 {
 "FamilyID": 1,
 "HouseVisitID": 101,
 "StudentID": 5001,
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

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Update completed and updated record is returned. |
| 400 Bad Request | Invalid id; non-multipart request; missing/invalid model when required; invalid JSON; or model.HouseVisitID does not match URL id. |
| 401 Unauthorized | JWT filter rejects the request; exact filter response is not specified in this controller. |
| 403 Forbidden | Not explicitly returned by action; only applicable if authentication infrastructure enforces it. |
| 404 Not Found | Existing Professional House Visit does not exist. |
| 409 Conflict | Not used by this action. |
| 500 Internal Server Error | Unhandled exception, file operation failure, database failure, or family-member update failure. The general catch response includes exception details. |

# COMMON DTOS

## 1. ProfessionalHouseVisitUpdateDto

Purpose: Request model for the update endpoint. Fields are optional from the controller's validation perspective unless needed to identify the target record.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | Conditional | No | Must match URL id when non-zero; if <=0 it is set from URL id. |
| StudentID | int | Optional | No | Present in DTO but not updated by the SQL statement. |
| StudentName | string | Optional | Yes | Partial update field. |
| CourseInstitution | string | Optional | Yes | Partial update field. |
| Address | string | Optional | Yes | Partial update field. |
| VisitDate | DateTime? | Optional | Yes | Partial update field. |
| FieldSupervisorName | string | Optional | Yes | Partial update field. |
| PersonsInteracted | string | Optional | Yes | Partial update field. |
| HouseType | string | Optional | Yes | Partial update field. |
| Ownership | string | Optional | Yes | Partial update field. |
| Rooms | string | Optional | Yes | Partial update field. |
| Floor | string | Optional | Yes | Partial update field. |
| RationCardType | string | Optional | Yes | Partial update field. |
| DigitalAccess | string | Optional | Yes | Partial update field. |
| LivingCondition | string | Optional | Yes | Partial update field. |
| LatestElecBill | string | Optional | Yes | Partial update field. |
| ElecUnitsCons | string | Optional | Yes | Partial update field. |
| InternetBillCharges | string | Optional | Yes | Partial update field. |
| RemarkGeneralLivingCondition | string | Optional | Yes | Partial update field. |
| Totalfamily | string | Optional | Yes | Partial update field. |
| PrimaryEarning | string | Optional | Yes | Partial update field. |
| AverageIncome | string | Optional | Yes | Partial update field. |
| OtherLandHoldings | string | Optional | Yes | Partial update field. |
| TotalChildrenStudying | string | Optional | Yes | Partial update field. |
| AnnualEducationExpense | string | Optional | Yes | Partial update field. |
| ScholarshipSupport | string | Optional | Yes | Partial update field. |
| GovernmentSchemes | string | Optional | Yes | Partial update field. |
| EducationalLoanAmount | string | Optional | Yes | Partial update field. |
| OutstandingLoanAmount | string | Optional | Yes | Partial update field. |
| MonthlyEMI | string | Optional | Yes | Partial update field. |
| HealthVulnerability | string | Optional | Yes | Partial update field. |
| HealthVulnerabilityRemarks | string | Optional | Yes | Partial update field. |
| Assets | string | Optional | Yes | Partial update field. |
| StudentAspiration | string | Optional | Yes | Partial update field. |
| ConsentParticipation | string | Optional | Yes | Partial update field. |
| Remarks | string | Optional | Yes | Partial update field. |
| StudentMotivation | string | Optional | Yes | Partial update field. |
| SupervisorJustification | string | Optional | Yes | Partial update field. |
| DeclarationConfirmation | string | Optional | Yes | Partial update field. |
| DeclarationDate | DateTime? | Optional | Yes | Partial update field. |
| PrimaryIncomeSource | string | Optional | Yes | Partial update field. |
| NatureofIncome | string | Optional | Yes | Partial update field. |
| IncomeShocks | string | Optional | Yes | Partial update field. |
| AgriculturalLand | string | Optional | Yes | Partial update field. |
| WaterSource | string | Optional | Yes | Partial update field. |
| CropPattern | string | Optional | Yes | Partial update field. |
| AnyOutstandingLoans | string | Optional | Yes | Partial update field. |
| Extracurricular | string | Optional | Yes | Partial update field. |
| HouseholdVulnerabilityLevel | string | Optional | Yes | Partial update field. |
| Recommendation | string | Optional | Yes | Partial update field. |
| Upload | string | Optional | Yes | Existing/upload filename value. |
| FamilyMembers | List<FamilyMemberDto> | Optional | Yes | Optional list of family-member partial updates. |

## 2. ProfessionalHouseVisitDto

Purpose: Response model returned by GET and after successful update.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| HouseVisitID | int | Conditional | No | Must match URL id when non-zero; if <=0 it is set from URL id. |
| StudentID | int | Optional | No | Present in DTO but not updated by the SQL statement. |
| StudentName | string | Optional | Yes | Partial update field. |
| CourseInstitution | string | Optional | Yes | Partial update field. |
| Address | string | Optional | Yes | Partial update field. |
| VisitDate | DateTime? | Optional | Yes | Partial update field. |
| FieldSupervisorName | string | Optional | Yes | Partial update field. |
| PersonsInteracted | string | Optional | Yes | Partial update field. |
| HouseType | string | Optional | Yes | Partial update field. |
| Ownership | string | Optional | Yes | Partial update field. |
| Rooms | string | Optional | Yes | Partial update field. |
| Floor | string | Optional | Yes | Partial update field. |
| RationCardType | string | Optional | Yes | Partial update field. |
| DigitalAccess | string | Optional | Yes | Partial update field. |
| LivingCondition | string | Optional | Yes | Partial update field. |
| LatestElecBill | string | Optional | Yes | Partial update field. |
| ElecUnitsCons | string | Optional | Yes | Partial update field. |
| InternetBillCharges | string | Optional | Yes | Partial update field. |
| RemarkGeneralLivingCondition | string | Optional | Yes | Partial update field. |
| Totalfamily | string | Optional | Yes | Partial update field. |
| PrimaryEarning | string | Optional | Yes | Partial update field. |
| AverageIncome | string | Optional | Yes | Partial update field. |
| OtherLandHoldings | string | Optional | Yes | Partial update field. |
| TotalChildrenStudying | string | Optional | Yes | Partial update field. |
| AnnualEducationExpense | string | Optional | Yes | Partial update field. |
| ScholarshipSupport | string | Optional | Yes | Partial update field. |
| GovernmentSchemes | string | Optional | Yes | Partial update field. |
| EducationalLoanAmount | string | Optional | Yes | Partial update field. |
| OutstandingLoanAmount | string | Optional | Yes | Partial update field. |
| MonthlyEMI | string | Optional | Yes | Partial update field. |
| HealthVulnerability | string | Optional | Yes | Partial update field. |
| HealthVulnerabilityRemarks | string | Optional | Yes | Partial update field. |
| Assets | string | Optional | Yes | Partial update field. |
| StudentAspiration | string | Optional | Yes | Partial update field. |
| ConsentParticipation | string | Optional | Yes | Partial update field. |
| Remarks | string | Optional | Yes | Partial update field. |
| StudentMotivation | string | Optional | Yes | Partial update field. |
| SupervisorJustification | string | Optional | Yes | Partial update field. |
| DeclarationConfirmation | string | Optional | Yes | Partial update field. |
| DeclarationDate | DateTime? | Optional | Yes | Partial update field. |
| PrimaryIncomeSource | string | Optional | Yes | Partial update field. |
| NatureofIncome | string | Optional | Yes | Partial update field. |
| IncomeShocks | string | Optional | Yes | Partial update field. |
| AgriculturalLand | string | Optional | Yes | Partial update field. |
| WaterSource | string | Optional | Yes | Partial update field. |
| CropPattern | string | Optional | Yes | Partial update field. |
| AnyOutstandingLoans | string | Optional | Yes | Partial update field. |
| Extracurricular | string | Optional | Yes | Partial update field. |
| HouseholdVulnerabilityLevel | string | Optional | Yes | Partial update field. |
| Recommendation | string | Optional | Yes | Partial update field. |
| Upload | string | Optional | Yes | Existing/upload filename value. |
| FamilyMembers | List<FamilyMemberDto> | No | Yes | Related ProfessionalFamilyMembers records. |

## 3. FamilyMemberDto

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| FamilyID | int | Required for update | No | Identifies the family-member row to update; must be > 0. |
| HouseVisitID | int | Optional | No | Associated House Visit ID. Update WHERE also enforces the parent HouseVisitID from the URL. |
| StudentID | int | Optional | No | Associated student ID. |
| Name | string | Optional | Yes | Partial update field. |
| Relation | string | Optional | Yes | Partial update field. |
| Age | string | Optional | Yes | Partial update field. |
| Education | string | Optional | Yes | Partial update field. |
| Occupation | string | Optional | Yes | Partial update field. |
| MonthlyIncome | string | Optional | Yes | Partial update field. |

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
| Tables | HouseVisitForm\_Professional; ProfessionalFamilyMembers |
| GET | Reads a Professional House Visit by HouseVisitID and its family members by HouseVisitID. |
| UPDATE | Updates HouseVisitForm\_Professional using COALESCE parameters; updates ProfessionalFamilyMembers using COALESCE parameters. |
| INSERT | None. |
| DELETE | None. |
| Soft Delete | Not implemented. |
| Transactions | Family-member updates use an explicit transaction; main House Visit update is separate. |
| Pagination/Search/Sorting | Not implemented. |
| Duplicate Validation | Not implemented. |
| CreatedBy/ModifiedBy | Not populated in visible controller. |
| JWT Claims | Not directly read in controller. |
| Session | No Session values are read in visible controller. |
| Roles/District | No explicit role or district restriction is implemented in visible controller. |
| File Storage | Uploaded files are moved to ~/HouseDocUploads with generated GUID-based names. |

# FINAL ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Route** | **JWT** | **Purpose** |
| 1 | GET | /api/edit-professional-house-visits/{id} | Required | Retrieve Professional House Visit and family members. |
| 2 | POST | /api/edit-professional-house-visits/{id}/update | Required | Partially update Professional House Visit, optional upload, and family members. |

# POTENTIAL ISSUES / EXISTING LOGIC TO REVIEW

* The controller exposes exception details (message, exceptionType, stackTrace, innerException) in the GET and general UPDATE error responses. This may reveal internal implementation details in production.
* The update DTO contains StudentID, but the SQL UPDATE does not update StudentID.
* The controller does not specify file extension or file-size limits, so the contract cannot document an allow-list or maximum size.
* The update action supports multiple uploaded files even though the documented form field is UploadedFile; the implementation processes all Multipart FileData entries.
* The main HouseVisit update and family-member transaction are not wrapped in one overall transaction, so a main-record update can succeed even if a later family-member update fails.