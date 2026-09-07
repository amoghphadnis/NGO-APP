**API CONTRACT
Semi-Professional House Visit**

**Base Route:** api/semiprofessionalhousevisit

# 1. House Visit Form – GET

**Endpoint:** GET /api/semiprofessionalhousevisit/create

**Purpose:** Called when the user clicks the House Visit button for a Semi-Professional student. It retrieves the student name and returns the data required to open/populate the House Visit form.

**Query Parameters:** studentId, source

**Content-Type:** Not required for GET.

**Authentication:** Not specified in the supplied controller. Apply the API's configured authentication if enabled globally.

|  |  |  |  |
| --- | --- | --- | --- |
| **Parameter** | **Type** | **Required** | **Validation / Rule** |
| studentId | int | Yes | Must be greater than 0. |
| source | string | Yes | Must equal SemiProfessional, case-insensitive, after trimming. |

**Student Lookup:** The API searches NewSemiProfessionalApplication.ApplicationID and GoogleSheet\_SemiProfessional.ImportID using the supplied studentId. The first matching StudentName is returned.

**Success Response – HTTP 200:**

|  |  |  |
| --- | --- | --- |
| **Field** | **Type** | **Description** |
| StudentID | int | The supplied student ID. |
| StudentName | string | Student name retrieved from the database. |
| Source | string | Normalized source value; SemiProfessional. |

**Not Found – HTTP 404:** Returns ErrorResponseDto with Success=false and Message='Semi-Professional student not found.'

**Bad Request – HTTP 400:** Returned for invalid/missing studentId or source, or a source other than SemiProfessional.

**Server Error – HTTP 500:** Returns ErrorResponseDto with Success=false and the exception message.

# 2. House Visit Form – POST

**Endpoint:** POST /api/semiprofessionalhousevisit/create

**Purpose:** Creates a Semi-Professional House Visit record, uploads supporting documents, and saves all submitted family members in the related family-member table.

**Content-Type:** multipart/form-data

**Source Rule:** source is mandatory and must equal SemiProfessional, case-insensitive.

**Main Table:** HouseVisitForm\_SemiProfessional

**Student ID Column:** SemiProfessional\_StudentID

**Family Table:** SemiProfessionalFamilyMembers

**Status on Insert:** 1

# 3. POST Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Validation / Description** |
| source | string | Yes | Must be SemiProfessional. |
| StudentID | int | Yes | Must parse to an integer greater than 0. |
| StudentName | string | No | Student name. |
| CourseInstitution | string | No | Course / institution. |
| Address | string | No | House visit address. |
| VisitDate | DateTime? | No | Parsed using DateTime.TryParse; invalid/empty values become null. |
| FieldSupervisorName | string | No | Field supervisor name. |
| PersonsInteracted | string | No | Persons interacted with during visit. |
| HouseType | string | No | House type. |
| Ownership | string | No | Ownership details. |
| Rooms | string | No | Number/details of rooms. |
| Floor | string | No | Floor details. |
| RationCardType | string | No | Ration card type. |
| DigitalAccess | string | No | Digital access details. |
| LivingCondition | string | No | Living condition. |
| LatestElecBill | string | No | Latest electricity bill. |
| ElecUnitsCons | string | No | Electricity units consumed. |
| InternetBillCharges | string | No | Internet bill charges. |
| RemarkGeneralLivingCondition | string | No | General living condition remarks. |
| Totalfamily | string | No | Total family information. |
| PrimaryEarning | string | No | Primary earning details. |
| AverageIncome | string | No | Average income. |
| OtherLandHoldings | string | No | Other land holdings. |
| TotalChildrenStudying | string | No | Total children studying. |
| AnnualEducationExpense | string | No | Annual education expense. |
| ScholarshipSupport | string | No | Scholarship support. |
| GovernmentSchemes | string | No | Government schemes. |
| EducationalLoanAmount | string | No | Educational loan amount. |
| OutstandingLoanAmount | string | No | Outstanding loan amount. |
| MonthlyEMI | string | No | Monthly EMI. |
| HealthVulnerability | string | No | Health vulnerability. |
| HealthVulnerabilityRemarks | string | No | Health vulnerability remarks. |
| Assets | string | No | Household/student assets. |
| StudentAspiration | string | No | Student aspiration. |
| ConsentParticipation | string | No | Consent/participation information. |
| Remarks | string | No | General remarks. |
| StudentMotivation | string | No | Student motivation. |
| SupervisorJustification | string | No | Supervisor justification. |
| DeclarationConfirmation | string | No | Declaration confirmation. |
| DeclarationDate | DateTime? | No | Parsed using DateTime.TryParse; invalid/empty values become null. |
| PrimaryIncomeSource | string | No | Primary income source. |
| NatureofIncome | string | No | Nature of income. |
| IncomeShocks | string | No | Income shock information. |
| AgriculturalLand | string | No | Agricultural land information. |
| WaterSource | string | No | Water source. |
| CropPattern | string | No | Crop pattern. |
| AnyOutstandingLoans | string | No | Outstanding loan information. |
| Extracurricular | string | No | Extracurricular information. |
| HouseholdVulnerabilityLevel | string | No | Household vulnerability level. |
| Recommendation | string | No | House visit recommendation. |
| FamilyMembers | JSON string | No | JSON array of FamilyMemberModel objects. |

# 4. FamilyMembers JSON

**Form Field:** FamilyMembers

**Format:** JSON array.

**Example:** [{"Name":"Person 1","Relation":"Father","Age":"45","Education":"Graduate","Occupation":"Farmer","MonthlyIncome":"25000"}]

**Validation:** If FamilyMembers is supplied, it must deserialize successfully into List<FamilyMemberModel>. Invalid JSON returns HTTP 400.

**Persistence:** Each member is inserted into SemiProfessionalFamilyMembers using the generated HouseVisitID and StudentID.

|  |  |  |  |
| --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Description** |
| Name | string | No | Family member name. |
| Relation | string | No | Relationship to student. |
| Age | string | No | Age. |
| Education | string | No | Education. |
| Occupation | string | No | Occupation. |
| MonthlyIncome | string | No | Monthly income. |

# 5. File Upload

**Form Field:** UploadedFile

**Format:** One or more multipart file parts using the field name UploadedFile.

**Storage Folder:** ~/HouseDocUploads

**File Naming:** A GUID is prepended to the original file name.

**Database Storage:** Comma-separated generated file names are stored in the Upload column.

**Temporary Files:** Multipart files are first received under HouseDocUploads/Temp and are moved to the final upload folder. Temporary files are deleted after processing or on error.

# 6. Database Transaction

**Transaction Scope:** The main House Visit insert and all FamilyMembers inserts are executed inside one SQL transaction.

**Commit Rule:** Transaction is committed only after the main House Visit and all family-member inserts succeed.

**Rollback Rule:** If any database insert fails, the transaction is rolled back and HTTP 500 is returned.

**Generated ID:** The main insert returns HouseVisitID using SCOPE\_IDENTITY().

# 7. POST Responses

|  |  |  |
| --- | --- | --- |
| **HTTP Status** | **Response** | **Meaning** |
| 200 OK | CreateSemiProfessionalHouseVisitPostResponseDto | House Visit and family members saved successfully. |
| 400 Bad Request | ErrorResponseDto | Request is not multipart/form-data, source is missing/invalid, StudentID is invalid, or FamilyMembers JSON is invalid. |
| 500 Internal Server Error | ErrorResponseDto | Unexpected server/database/file-processing error. |

**Successful Response Fields:**

|  |  |  |
| --- | --- | --- |
| **Field** | **Type** | **Value / Description** |
| Success | bool | true |
| Message | string | Semi-Professional house visit created successfully. |
| HouseVisitID | int | Database-generated House Visit ID. |
| RedirectController | string | SemiProfessional\_StudentList |
| RedirectAction | string | StudentList |

# 8. Exact House Visit Button Flow

**Step 1 – Student List:** The user clicks the House Visit button for a Semi-Professional student.

**Step 2 – GET Call:** The client calls GET /api/semiprofessionalhousevisit/create?studentId={studentId}&source=SemiProfessional.

**Step 3 – Form Load:** On HTTP 200, use StudentID, StudentName and Source from the response to open/populate the House Visit form.

**Step 4 – Submit:** The client submits the completed form as multipart/form-data to POST /api/semiprofessionalhousevisit/create.

**Step 5 – Files:** Any selected documents are sent using the UploadedFile field.

**Step 6 – Family Members:** FamilyMembers is sent as a JSON array string in the multipart form.

**Step 7 – Success:** On HTTP 200, use HouseVisitID for confirmation/reference and, if the client follows the MVC redirect convention, navigate to SemiProfessional\_StudentList/StudentList.

# 9. Exact API Calls – Quick Reference

|  |  |  |
| --- | --- | --- |
| **Action** | **HTTP Method** | **Route** |
| Open House Visit Form | GET | /api/semiprofessionalhousevisit/create?studentId={studentId}&source=SemiProfessional |
| Save House Visit | POST | /api/semiprofessionalhousevisit/create |

# 10. Important Client-Side Rules

* The House Visit button must pass the correct Semi-Professional student ID.
* The GET request must include source=SemiProfessional.
* The POST request must use multipart/form-data.
* StudentID must be included in the POST form data and must be greater than 0.
* FamilyMembers must be valid JSON if supplied.
* Files must use the multipart field name UploadedFile.
* The API does not return an MVC View; the client application is responsible for rendering the House Visit form.
* The API returns JSON response DTOs and HTTP status codes rather than MVC redirects.

# 11. DTOs Referenced

|  |  |
| --- | --- |
| **DTO** | **Purpose** |
| CreateSemiProfessionalHouseVisitGetResponseDto | GET success response containing StudentID, StudentName and Source. |
| CreateSemiProfessionalHouseVisitPostResponseDto | POST success response containing Success, Message, HouseVisitID, RedirectController and RedirectAction. |
| ErrorResponseDto | Standard error response containing Success and Message. |
| HouseVisitModel | Internal model populated from multipart form fields. |
| FamilyMemberModel | Internal model used for FamilyMembers JSON entries. |