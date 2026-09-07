**API CONTRACT**

**Edit Format 1.1 PUC Student API**

VP\_EditFormat1\_1PUCStudentApiController

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/edit-format1-1-puc-student |
| Controller | VP\_EditFormat1\_1PUCStudentApiController |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT is explicitly applied at ACTION LEVEL to the GET-by-ID and POST update endpoints through [JwtSessionFilter]. |
| Public Endpoints | GET /dropdowns has no JWT/authorization attribute and is therefore Not Required according to the controller. |

The controller contains three endpoints. Authentication is determined endpoint-by-endpoint: GetStudent and UpdateStudent explicitly use [JwtSessionFilter], while GetDropdowns does not. No controller-level authorization attribute is present. No role checks, JWT claims, or Session values are directly consumed by the controller.

# ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Purpose** |
| 1 | GET | /api/edit-format1-1-puc-student/{id} | Required | Retrieve a Format 1.1 PUC student record. |
| 2 | GET | /api/edit-format1-1-puc-student/dropdowns | Not Required | Return district, gender, caste category, area, course, college type, father occupation and mother occupation dropdowns. |
| 3 | POST | /api/edit-format1-1-puc-student/{id}/update | Required | Update PUC student information using multipart/form-data and optionally replace five files. |

# 1. GET STUDENT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-format1-1-puc-student/{id} |
| Purpose | Retrieves a PUC student from Format1\_1\_PUC for editing/viewing. |
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
* No role-based restriction is implemented in the controller.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | StudentFormat1ID. Must be greater than 0. |

## Query Parameters

None.

## Request Body

None.

## Validation Rules

* If id <= 0, returns 400 Bad Request with 'Invalid Student ID.'.
* Student is queried with parameterized StudentFormat1ID = @StudentFormat1ID.
* No Status, UserID, EmployeeID, or Role filter is applied.
* If no matching record is found, returns 404 Not Found with 'Student Not Found.'.
* Database mapping converts nullable strings to null, nullable DateOfBirth to null, missing integer/decimal columns or DBNull values to 0, and missing date columns to null.

## Business Logic / Database

* Reads from Format1\_1\_PUC.
* SELECT uses StudentFormat1ID as the only WHERE condition.
* No pagination, search, sorting, duplicate validation, soft delete, or transaction logic is present.

## Success Response (200)

{
 "success": true,
 "data": {
 "StudentId": 1001,
 "Email": "student@example.com",
 "StudentName": "Example Student",
 "District": 5,
 "Taluk": "Example Taluk",
 "ResidentialAddress": "Residential Address",
 "ContactNumber": "9876543210",
 "AlternateNumber": "9123456780",
 "Gender": 1,
 "DateOfBirth": "2003-05-15T00:00:00",
 "Caste": 2,
 "Place": 1,
 "FatherOccupation": 3,
 "MotherOccupation": 4,
 "TotalFamilyMembers": 4,
 "FamilyAnnualIncome": 25000.00,
 "SSLCPercentage": 82.50,
 "CourseJoined": 10,
 "CollegeName": "Example College",
 "CollegeType": 1,
 "CollegeFees": 50000.00,
 "CollegeContactNumber": "0801234567",
 "Achievement": "Example Achievement",
 "ParentsBankBalance": 50000.00,
 "AccountHolderName": "Student Name",
 "AccountNumber": "XXXXXXXX1234",
 "IFSCCode": "EXAMPLE0001",
 "BankName": "Example Bank",
 "BranchName": "Example Branch",
 "StudentSelfiePath": "/Uploads/Format1\_1\_PUC/StudentSelfie/1001\_20260831103000123.jpg",
 "SSLCMarksCardPath": "/Uploads/Format1\_1\_PUC/SSLCMarksCard/1001\_20260831103000123.pdf",
 "FeeReceiptPath": "/Uploads/Format1\_1\_PUC/FeeReceipt/1001\_20260831103000123.pdf",
 "BankPassbookPath": "/Uploads/Format1\_1\_PUC/BankPassbook/1001\_20260831103000123.pdf",
 "AadhaarCardPath": "/Uploads/Format1\_1\_PUC/AadhaarCard/1001\_20260831103000123.pdf",
 "OtherDistrict": null
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Student found and mapped successfully. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by this action; behavior may depend on filter infrastructure. |
| 404 Not Found | No Format1\_1\_PUC row matches StudentFormat1ID. |
| 500 Internal Server Error | Unhandled exception; response contains ex.Message. |

# 2. GET DROPDOWNS

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-format1-1-puc-student/dropdowns |
| Purpose | Returns all dropdown collections required by the PUC student edit screen. |
| Content-Type | application/json |
| Authorization | Not Required |
| Filter/Authorization Scope | No authorization attribute is present on this action. |
| Required Role | Not specified in controller. |

## JWT / Authorization Details

* JWT Required: No.
* Reason: The action has [HttpGet] and [Route("dropdowns")] but no [JwtSessionFilter], [Authorize], or equivalent authorization attribute.
* No JWT claims or Session values are used.
* No role-based filtering is implemented.

## Path / Query Parameters

None.

## Request Body

None.

## Dropdown Details

|  |  |  |
| --- | --- | --- |
| **Response Property** | **Database Query** | **Ordering / Filtering** |
| districts | SELECT DistrictID AS ID, DistrictName AS Name FROM DistrictMaster | ORDER BY DistrictName |
| genders | SELECT GenderID AS ID, GenderName AS Name FROM GenderMaster | ORDER BY GenderName |
| casteCategories | SELECT CasteCategoryID AS ID, CategoryName AS Name FROM CasteCategoryMaster | ORDER BY CategoryName |
| areas | SELECT AreaTypeID AS ID, AreaTypeName AS Name FROM AreaTypeMaster | ORDER BY AreaTypeName |
| courses | SELECT CourseID AS ID, CourseName AS Name FROM CourseMaster | ORDER BY CourseName |
| collegeTypes | SELECT CollegeTypeID AS ID, CollegeTypeName AS Name FROM CollegeTypeMaster | ORDER BY CollegeTypeName |
| fatherOccupations | SELECT FatherOccupationID AS ID, OccupationName AS Name FROM FatherOccupationMaster | ORDER BY OccupationName |
| motherOccupations | SELECT MotherOccupationID AS ID, OccupationName AS Name FROM MotherOccupationMaster | ORDER BY OccupationName |

## Dropdown Response

{
 "success": true,
 "districts": [
 { "Value": "1", "Text": "Example District" }
 ],
 "genders": [
 { "Value": "1", "Text": "Male" }
 ],
 "casteCategories": [
 { "Value": "1", "Text": "Example Category" }
 ],
 "areas": [
 { "Value": "1", "Text": "Urban" }
 ],
 "courses": [
 { "Value": "1", "Text": "Example Course" }
 ],
 "collegeTypes": [
 { "Value": "1", "Text": "Government" }
 ],
 "fatherOccupations": [
 { "Value": "1", "Text": "Employee" }
 ],
 "motherOccupations": [
 { "Value": "1", "Text": "Employee" }
 ]
}

## Dropdown Business Rules

* Each list is returned as DropdownItem objects with Value = database ID converted to string and Text = database Name converted to string.
* No UserID/EmployeeID/Role filtering is applied.
* No Status/active filter is specified in any dropdown query.
* No default '-- Select --' option is added by this controller.

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | All dropdown queries execute successfully. |
| 401 Unauthorized | Not expected from this action based on the supplied controller; no JWT filter is attached. |
| 403 Forbidden | Not explicitly returned by this action. |
| 500 Internal Server Error | Any exception during dropdown retrieval. |

# 3. UPDATE STUDENT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/edit-format1-1-puc-student/{id}/update |
| Purpose | Updates Format 1.1 PUC student fields and optionally uploads/replaces five files. |
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
| id | int | Yes | StudentFormat1ID. Must be greater than 0. |

## Request Body / Multipart

The request must use multipart/form-data. If the request is not multipart, the endpoint returns 400. The controller reads normal form fields into a case-insensitive dictionary, loads the existing record, and changes only fields that were supplied.

## A. Normal Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| Email | string | Optional | If supplied, replaces current Email. |
| StudentName | string | Optional | If supplied, replaces current StudentName. |
| District | int | Optional | Parsed using int.TryParse; invalid/blank values retain current value. |
| Taluk | string | Optional | If supplied, replaces current Taluk. |
| ResidentialAddress | string | Optional | If supplied, replaces current ResidentialAddress. |
| ContactNumber | string | Optional | If supplied, replaces current ContactNumber. |
| AlternateNumber | string | Optional | If supplied, replaces current AlternateNumber. |
| Gender | int | Optional | Parsed integer; invalid/blank retains current value. |
| DateOfBirth | date/date-time | Optional | Parsed using DateTime.TryParse; invalid/blank retains current value. |
| Caste | int | Optional | Parsed integer; invalid/blank retains current value. |
| Place | int | Optional | Mapped to AreaTypeID; parsed integer. |
| FatherOccupation | int | Optional | Parsed integer. |
| MotherOccupation | int | Optional | Parsed integer. |
| TotalFamilyMembers | int | Optional | Parsed integer. |
| FamilyAnnualIncome | decimal | Optional | Parsed decimal. |
| SSLCPercentage | decimal | Optional | Parsed decimal. |
| CourseJoined | int | Optional | Mapped to CourseID; parsed integer. |
| CollegeName | string | Optional | If supplied, replaces current CollegeName. |
| CollegeType | int | Optional | Mapped to CollegeTypeID; parsed integer. |
| CollegeFees | decimal | Optional | Parsed decimal. |
| CollegeContactNumber | string | Optional | If supplied, replaces current CollegeContactNumber. |
| Achievement | string | Optional | If supplied, replaces current Achievement. |
| ParentsBankBalance | decimal | Optional | Parsed decimal. |
| AccountHolderName | string | Optional | If supplied, replaces current AccountHolderName. |
| AccountNumber | string | Optional | If supplied, replaces current AccountNumber. |
| IFSCCode | string | Optional | If supplied, replaces current IFSCCode. |
| BankName | string | Optional | If supplied, replaces current BankName. |
| BranchName | string | Optional | If supplied, replaces current BranchName. |
| OtherDistrict | string | Optional | If supplied, replaces current OtherDistrict. |

## B. File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| StudentSelfie | file | Optional | .pdf, .jpg, .jpeg, .png | Not specified | Uploaded to StudentSelfie subfolder and stored in StudentSelfiePath. |
| SSLCMarksCard | file | Optional | .pdf, .jpg, .jpeg, .png | Not specified | Uploaded to SSLCMarksCard subfolder and stored in SSLCMarksCardPath. |
| FeeReceipt | file | Optional | .pdf, .jpg, .jpeg, .png | Not specified | Uploaded to FeeReceipt subfolder and stored in FeeReceiptPath. |
| BankPassbook | file | Optional | .pdf, .jpg, .jpeg, .png | Not specified | Uploaded to BankPassbook subfolder and stored in BankPassbookPath. |
| AadhaarCard | file | Optional | .pdf, .jpg, .jpeg, .png | Not specified | Uploaded to AadhaarCard subfolder and stored in AadhaarCardPath. |

## File Upload Rules

* All five file fields are optional.
* Allowed extensions are exactly PDF, JPG, JPEG and PNG, case-insensitive because the extension is normalized to lowercase.
* No maximum file size is defined in the controller.
* If no file is supplied for a field, the existing database path is retained.
* If a valid new file is supplied, it is copied into ~/Uploads/Format1\_1\_PUC/{subFolder}/.
* Generated filename format: {studentId}\_{yyyyMMddHHmmssfff}{extension}.
* Example path: /Uploads/Format1\_1\_PUC/StudentSelfie/1001\_20260831103000123.jpg.
* The physical upload directories are created if they do not exist.
* The multipart provider first stores incoming files under ~/App\_Data/TempUploads/.
* Temporary provider files are deleted after processing through CleanupProviderFiles.
* Cleanup failures are silently ignored.
* The controller does not explicitly delete the previous permanent file when replacing it.
* Only the first file matching each field name is processed.

## Update Validation Rules

* id is required and must be greater than 0.
* Request must be multipart/form-data.
* Student must exist before update; otherwise 404.
* No [Required] attributes, ModelState validation, min/max length rules, email validation, duplicate checks, or explicit foreign-key validation are implemented in this controller.
* Normal form fields are optional at controller level because missing values retain the current record values.
* Invalid integer, decimal, or date input retains the current value rather than returning a validation error.
* File type validation is implemented: only PDF/JPG/JPEG/PNG are accepted.
* File maximum size is not specified in the controller.
* No role-based validation is implemented.

## Business Logic Notes

* The existing PUCStudentDto is loaded before applying changes.
* Only supplied form values are merged into the current DTO.
* StudentFormat1ID is determined by the route id.
* The UPDATE modifies the Format1\_1\_PUC row where StudentFormat1ID = @StudentId.
* File columns use CASE WHEN new path is NOT NULL THEN new path ELSE existing path END, so omitted files retain existing paths.
* ModifiedDate is automatically set to GETDATE() on every successful database update.
* No CreatedBy or ModifiedBy user identity is populated.
* No status value is set.
* No transaction is explicitly created.
* After update, the controller fetches the record again and returns the updated PUCStudentDto.

## Database Update Mapping

|  |  |
| --- | --- |
| **Database Column** | **Parameter / Source** |
| Email | @Email ← model.Email |
| StudentName | @StudentName ← model.StudentName |
| DistrictID | @DistrictID ← model.District |
| Taluk | @Taluk ← model.Taluk |
| ResidentialAddress | @ResidentialAddress ← model.ResidentialAddress |
| ContactNumber | @ContactNumber ← model.ContactNumber |
| AlternateNumber | @AlternateNumber ← model.AlternateNumber |
| GenderID | @GenderID ← model.Gender |
| DateOfBirth | @DateOfBirth ← model.DateOfBirth |
| CasteCategoryID | @CasteCategoryID ← model.Caste |
| AreaTypeID | @AreaTypeID ← model.Place |
| FatherOccupationID | @FatherOccupationID ← model.FatherOccupation |
| MotherOccupationID | @MotherOccupationID ← model.MotherOccupation |
| TotalFamilyMembers | @TotalFamilyMembers ← model.TotalFamilyMembers |
| FamilyAnnualIncome | @FamilyAnnualIncome ← model.FamilyAnnualIncome |
| SSLCPercentage | @SSLCPercentage ← model.SSLCPercentage |
| CourseID | @CourseID ← model.CourseJoined |
| CollegeName | @CollegeName ← model.CollegeName |
| CollegeTypeID | @CollegeTypeID ← model.CollegeType |
| CollegeFees | @CollegeFees ← model.CollegeFees |
| CollegeContactNumber | @CollegeContactNumber ← model.CollegeContactNumber |
| Achievement | @Achievement ← model.Achievement |
| ParentsBankBalance | @ParentsBankBalance ← model.ParentsBankBalance |
| AccountHolderName | @AccountHolderName ← model.AccountHolderName |
| AccountNumber | @AccountNumber ← model.AccountNumber |
| IFSCCode | @IFSCCode ← model.IFSCCode |
| BankName | @BankName ← model.BankName |
| BranchName | @BranchName ← model.BranchName |
| OtherDistrict | @OtherDistrict ← model.OtherDistrict |
| StudentSelfiePath | CASE WHEN @StudentSelfiePath IS NOT NULL THEN @StudentSelfiePath ELSE StudentSelfiePath END |
| SSLCMarksCardPath | CASE WHEN @SSLCMarksCardPath IS NOT NULL THEN @SSLCMarksCardPath ELSE SSLCMarksCardPath END |
| FeeReceiptPath | CASE WHEN @FeeReceiptPath IS NOT NULL THEN @FeeReceiptPath ELSE FeeReceiptPath END |
| BankPassbookPath | CASE WHEN @BankPassbookPath IS NOT NULL THEN @BankPassbookPath ELSE BankPassbookPath END |
| AadhaarCardPath | CASE WHEN @AadhaarCardPath IS NOT NULL THEN @AadhaarCardPath ELSE AadhaarCardPath END |
| ModifiedDate | GETDATE() |

## Success Response (200)

{
 "success": true,
 "message": "Student details updated successfully.",
 "data": {
 "StudentId": 1001,
 "Email": "student@example.com",
 "StudentName": "Example Student",
 "District": 5,
 "Taluk": "Example Taluk",
 "ResidentialAddress": "Residential Address",
 "ContactNumber": "9876543210",
 "AlternateNumber": "9123456780",
 "Gender": 1,
 "DateOfBirth": "2003-05-15T00:00:00",
 "Caste": 2,
 "Place": 1,
 "FatherOccupation": 3,
 "MotherOccupation": 4,
 "TotalFamilyMembers": 4,
 "FamilyAnnualIncome": 25000.00,
 "SSLCPercentage": 82.50,
 "CourseJoined": 10,
 "CollegeName": "Example College",
 "CollegeType": 1,
 "CollegeFees": 50000.00,
 "CollegeContactNumber": "0801234567",
 "Achievement": "Example Achievement",
 "ParentsBankBalance": 50000.00,
 "AccountHolderName": "Student Name",
 "AccountNumber": "XXXXXXXX1234",
 "IFSCCode": "EXAMPLE0001",
 "BankName": "Example Bank",
 "BranchName": "Example Branch",
 "StudentSelfiePath": "/Uploads/Format1\_1\_PUC/StudentSelfie/1001\_20260831103000123.jpg",
 "SSLCMarksCardPath": "/Uploads/Format1\_1\_PUC/SSLCMarksCard/1001\_20260831103000123.pdf",
 "FeeReceiptPath": "/Uploads/Format1\_1\_PUC/FeeReceipt/1001\_20260831103000123.pdf",
 "BankPassbookPath": "/Uploads/Format1\_1\_PUC/BankPassbook/1001\_20260831103000123.pdf",
 "AadhaarCardPath": "/Uploads/Format1\_1\_PUC/AadhaarCard/1001\_20260831103000123.pdf",
 "OtherDistrict": null
 }
}

## Failure Responses

|  |  |
| --- | --- |
| **Status** | **When** |
| 400 Bad Request | Invalid id or request is not multipart/form-data. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by this action; may depend on authorization infrastructure. |
| 404 Not Found | Student does not exist or UPDATE affects zero rows. |
| 409 Conflict | Not explicitly used by the controller. |
| 500 Internal Server Error | Unhandled exception; response contains ex.Message. |

## Example Error JSON

{
 "success": false,
 "message": "Invalid Student ID."
}

## Status Codes Used

200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error. 401 Unauthorized is applicable through the explicit JwtSessionFilter on protected actions. 403 Forbidden is not explicitly returned by controller code. 409 Conflict is not used.

# COMMON DTOS

## 1. DropdownItem

Purpose: Represents one item in every dropdown collection.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Value | string | Not specified | Not specified | Database ID converted to string. |
| Text | string | Not specified | Not specified | Database Name converted to string. |

{
 "Value": "1",
 "Text": "Example"
}

## 2. PUCStudentDto

Purpose: Represents the Format 1.1 PUC student record returned by GET and used internally for update merging.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| StudentId | int | Not specified | No | Maps from StudentFormat1ID. |
| Email | string | Not specified | Yes | Student email. |
| StudentName | string | Not specified | Yes | Student name. |
| District | int | Not specified | No | Maps from DistrictID. |
| Taluk | string | Not specified | Yes | Taluk. |
| ResidentialAddress | string | Not specified | Yes | Residential address. |
| ContactNumber | string | Not specified | Yes | Contact number. |
| AlternateNumber | string | Not specified | Yes | Alternate contact number. |
| Gender | int | Not specified | No | Maps from GenderID. |
| DateOfBirth | DateTime? | Not specified | Yes | Date of birth. |
| Caste | int | Not specified | No | Maps from CasteCategoryID. |
| Place | int | Not specified | No | Maps from AreaTypeID. |
| FatherOccupation | int | Not specified | No | Maps from FatherOccupationID. |
| MotherOccupation | int | Not specified | No | Maps from MotherOccupationID. |
| TotalFamilyMembers | int | Not specified | No | Total family members. |
| FamilyAnnualIncome | decimal | Not specified | No | Family annual income. |
| SSLCPercentage | decimal | Not specified | No | SSLC percentage. |
| CourseJoined | int | Not specified | No | Maps from CourseID. |
| CollegeName | string | Not specified | Yes | College name. |
| CollegeType | int | Not specified | No | Maps from CollegeTypeID. |
| CollegeFees | decimal | Not specified | No | College fees. |
| CollegeContactNumber | string | Not specified | Yes | College contact number. |
| Achievement | string | Not specified | Yes | Achievement. |
| ParentsBankBalance | decimal | Not specified | No | Parents' bank balance. |
| AccountHolderName | string | Not specified | Yes | Account holder name. |
| AccountNumber | string | Not specified | Yes | Bank account number. |
| IFSCCode | string | Not specified | Yes | IFSC code. |
| BankName | string | Not specified | Yes | Bank name. |
| BranchName | string | Not specified | Yes | Branch name. |
| StudentSelfiePath | string | Not specified | Yes | Stored student selfie path. |
| SSLCMarksCardPath | string | Not specified | Yes | Stored SSLC marks card path. |
| FeeReceiptPath | string | Not specified | Yes | Stored fee receipt path. |
| BankPassbookPath | string | Not specified | Yes | Stored bank passbook path. |
| AadhaarCardPath | string | Not specified | Yes | Stored Aadhaar card path. |
| OtherDistrict | string | Not specified | Yes | Other district. |

## Sample PUCStudentDto Response

{
 "StudentId": 1001,
 "Email": "student@example.com",
 "StudentName": "Example Student",
 "District": 5,
 "Taluk": "Example Taluk",
 "ResidentialAddress": "Residential Address",
 "ContactNumber": "9876543210",
 "AlternateNumber": null,
 "Gender": 1,
 "DateOfBirth": "2003-05-15T00:00:00",
 "Caste": 2,
 "Place": 1,
 "FatherOccupation": 3,
 "MotherOccupation": 4,
 "TotalFamilyMembers": 4,
 "FamilyAnnualIncome": 25000.00,
 "SSLCPercentage": 82.50,
 "CourseJoined": 10,
 "CollegeName": "Example College",
 "CollegeType": 1,
 "CollegeFees": 50000.00,
 "CollegeContactNumber": "0801234567",
 "Achievement": "Example Achievement",
 "ParentsBankBalance": 50000.00,
 "AccountHolderName": "Student Name",
 "AccountNumber": "XXXXXXXX1234",
 "IFSCCode": "EXAMPLE0001",
 "BankName": "Example Bank",
 "BranchName": "Example Branch",
 "StudentSelfiePath": "/Uploads/Format1\_1\_PUC/StudentSelfie/1001\_20260831103000123.jpg",
 "SSLCMarksCardPath": "/Uploads/Format1\_1\_PUC/SSLCMarksCard/1001\_20260831103000123.pdf",
 "FeeReceiptPath": "/Uploads/Format1\_1\_PUC/FeeReceipt/1001\_20260831103000123.pdf",
 "BankPassbookPath": "/Uploads/Format1\_1\_PUC/BankPassbook/1001\_20260831103000123.pdf",
 "AadhaarCardPath": "/Uploads/Format1\_1\_PUC/AadhaarCard/1001\_20260831103000123.pdf",
 "OtherDistrict": null
}

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Behavior** |
| Primary table | Format1\_1\_PUC |
| Dropdown master tables | DistrictMaster, GenderMaster, CasteCategoryMaster, AreaTypeMaster, CourseMaster, CollegeTypeMaster, FatherOccupationMaster, MotherOccupationMaster |
| GET by ID | SELECT listed columns FROM Format1\_1\_PUC WHERE StudentFormat1ID = @StudentFormat1ID |
| Update | UPDATE Format1\_1\_PUC SET listed fields WHERE StudentFormat1ID = @StudentId |
| Modified date | ModifiedDate = GETDATE() |
| File storage | ~/Uploads/Format1\_1\_PUC/{subFolder}/ |
| Multipart temp storage | ~/App\_Data/TempUploads/ |
| File naming | {studentId}\_{yyyyMMddHHmmssfff}{extension} |
| Allowed file types | PDF, JPG, JPEG, PNG |
| Existing file retention | Yes, CASE WHEN new path is not null, otherwise existing path |
| Soft delete | Not implemented |
| CreatedBy / ModifiedBy user identity | Not populated; ModifiedDate is updated. |
| UserID filtering | Not implemented |
| EmployeeID filtering | Not implemented |
| Role filtering | Not implemented |
| Pagination/search/sorting | Not implemented |
| Duplicate checks | Not implemented |
| Transaction | No explicit transaction |

# JWT / AUTHORIZATION MATRIX

|  |  |  |  |
| --- | --- | --- | --- |
| **Endpoint** | **JWT Required** | **Current Mechanism** | **Claims / Roles** |
| GET /{id} | Yes | Action-level [JwtSessionFilter] | No claims/roles directly consumed |
| GET /dropdowns | No | No authorization attribute | No claims/roles |
| POST /{id}/update | Yes | Action-level [JwtSessionFilter] | No claims/roles directly consumed |

# IMPORTANT CONTRACT NOTES

* JWT is required for the GET-by-ID and POST update endpoints because [JwtSessionFilter] is explicitly present on those actions.
* The dropdown endpoint is intentionally documented as Not Required because no JWT/authorization attribute is present on that action.
* No controller-level JWT filter is invented.
* No required role is specified anywhere in the controller.
* No JWT claim or Session value is read directly by the controller.
* The update endpoint accepts multipart/form-data, not JSON.
* All normal update form fields are optional from the controller's perspective; missing values retain existing values.
* Invalid typed values generally retain the existing value instead of generating 400.
* File fields are optional, but supplied files must use PDF/JPG/JPEG/PNG.
* No file size limit is specified.
* ModifiedDate is always set to GETDATE() during update.
* No pagination, search, sorting, duplicate checks, soft delete, transaction, CreatedBy or user-specific filtering is implemented in the supplied controller.
* Requiredness of DTO properties is marked 'Not specified in controller' where no [Required] attribute, null check, ModelState validation, or explicit required-field rule exists.

# FINAL QUALITY CHECK

* All 3 endpoints included.
* HTTP methods and exact routes included.
* Route prefix documented once at the top.
* JWT determined endpoint-by-endpoint from actual attributes.
* Public dropdown endpoint identified.
* Protected endpoints identified.
* No unsupported roles or JWT claims invented.
* Path parameters documented.
* Multipart form fields documented.
* All 5 file fields documented.
* File extensions, retention behavior, generated names and paths documented.
* Validation and business logic documented.
* Database SELECT/UPDATE behavior documented.
* Dropdown response structures documented.
* Success and failure responses documented.
* All DTOs defined in the controller are included under COMMON DTOS.
* No fields or behavior outside the supplied controller have been asserted as fact.