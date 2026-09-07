**API CONTRACT**

**Edit Payana Students API**

VP\_EditPayanaStudentsApiController

# API BASE ROUTE

|  |  |
| --- | --- |
| **Item** | **Value** |
| Route Prefix | /api/edit-payana-students |
| Controller | VP\_EditPayanaStudentsApiController |
| Database | SQL Server via ADO.NET |
| Connection String | EnvisageDb |
| Authentication | JWT is explicitly applied at ACTION LEVEL to all three public endpoints through [JwtSessionFilter]. |
| Public Endpoints | None indicated by this controller. |

The controller contains three API endpoints: GET dropdowns, GET a Payana student by ID, and POST multipart/form-data update by ID. All three actions explicitly carry [JwtSessionFilter]. No controller-level authorization attribute is present. The controller itself does not inspect JWT claims or roles directly.

# ENDPOINT SUMMARY

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **#** | **Method** | **Endpoint** | **JWT** | **Purpose** |
| 1 | GET | /api/edit-payana-students/dropdowns | Required | Return gender, caste category, area type, house type, college type, district and active parent-occupation dropdowns. |
| 2 | GET | /api/edit-payana-students/{id} | Required | Retrieve a Payana student record for editing. |
| 3 | POST | /api/edit-payana-students/{id}/update | Required | Update Payana student fields and optionally replace five uploaded files. |

# 1. GET PAYANA STUDENT DROPDOWNS

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-payana-students/dropdowns |
| Purpose | Returns all dropdown collections required by the Payana student edit screen. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter/Authorization Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Filter is explicitly action-level through [JwtSessionFilter].
* No JWT claim is directly read by this action.
* No UserID, EmployeeID, Role, or Session value is used by this action.
* No role-based restriction is implemented in the controller.

## Path / Query Parameters

None.

## Request Body

None.

## Dropdown Sources & Rules

|  |  |  |
| --- | --- | --- |
| **Response Property** | **Source Query** | **Active/Inactive Rule** |
| genders | SELECT \* FROM GenderMaster | No Status filter specified. |
| casteCategories | SELECT \* FROM CasteCategoryMaster | No Status filter specified. |
| areaTypes | SELECT \* FROM AreaTypeMaster | No Status filter specified. |
| houseTypes | SELECT \* FROM HouseTypeMaster | No Status filter specified. |
| collegeTypes | SELECT \* FROM CollegeTypeMaster | No Status filter specified. |
| districts | SELECT \* FROM DistrictMaster | No Status filter specified. |
| fatherOccupations | SELECT \* FROM FatherOccupationMaster WHERE Status=1 | Only Status=1 records. |
| motherOccupations | SELECT \* FROM MotherOccupationMaster WHERE Status=1 | Only Status=1 records. |

## Dropdown Response Structure

{
 "success": true,
 "genders": [
 { "Value": "1", "Text": "Male" },
 { "Value": "2", "Text": "Female" }
 ],
 "casteCategories": [
 { "Value": "1", "Text": "Example Category" }
 ],
 "areaTypes": [
 { "Value": "1", "Text": "Urban" }
 ],
 "houseTypes": [
 { "Value": "1", "Text": "Owned" }
 ],
 "collegeTypes": [
 { "Value": "1", "Text": "Government" }
 ],
 "districts": [
 { "Value": "1", "Text": "Example District" }
 ],
 "fatherOccupations": [
 { "Value": "1", "Text": "Employee" }
 ],
 "motherOccupations": [
 { "Value": "1", "Text": "Employee" }
 ]
}

## Validation / Business Logic

* No request parameters are validated.
* Each dropdown is produced from the first two columns of its source query: Value = column 0, Text = column 1.
* No default '-- Select --' option is added by this controller.
* No UserID/EmployeeID/Role filtering is applied.
* Father and mother occupation lists explicitly include only Status=1 records; the other dropdowns have no Status predicate in the controller.

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Dropdown retrieval succeeds. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action; may depend on authorization infrastructure. |
| 500 Internal Server Error | An exception occurs; response includes ex.Message. |

# 2. GET PAYANA STUDENT FOR EDIT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | GET /api/edit-payana-students/{id} |
| Purpose | Retrieves a Payana student from PayanaStudents for editing. |
| Content-Type | application/json |
| Authorization | JWT Required |
| Filter/Authorization Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | StudentID. Must be greater than 0. |

## Query Parameters

None.

## Request Body

None.

## Validation & Business Logic

* If id <= 0, the endpoint returns 400 Bad Request with 'Invalid Student ID.'.
* The student is selected from PayanaStudents using parameterized StudentID = @StudentID.
* No Status/active filter is applied to this GET.
* No UserID/EmployeeID/Role filtering is applied.
* If no row is found, 404 Not Found is returned with 'Student Not Found.'.
* Database values are mapped into PayanaStudentEditDto. Nullable database values are converted to nullable DTO properties; missing columns are handled by helper methods.

## Success Response (200)

{
 "success": true,
 "data": {
 "StudentID": 1001,
 "StudentName": "Example Student",
 "DateOfBirth": "2003-05-15T00:00:00",
 "GenderID": 1,
 "ContactNumber": "9876543210",
 "AlternateNumber": "9123456780",
 "Email": "student@example.com",
 "RAddress": "Residential Address",
 "CAddress": "Current Address",
 "Place": "Example Place",
 "Taluka": "Example Taluka",
 "DistrictID": 5,
 "PinCode": "560001",
 "AreaTypeID": 1,
 "CasteCategoryID": 2,
 "HouseTypeID": 1,
 "FatherName": "Father Name",
 "MotherName": "Mother Name",
 "FatherOccupationID": 3,
 "MotherOccupationID": 4,
 "FamilyMembers": 4,
 "FamilyIncome": 25000.00,
 "ParentBank": 50000.00,
 "CourseID": 10,
 "CollegeName": "Example College",
 "CollegeTypeID": 1,
 "CollegeCNumber": "0801234567",
 "CourseSA": "Example Course",
 "CourseStream": "Science",
 "AnnualFees": 50000.00,
 "TotalExpenses": 70000.00,
 "StudentAchivements": "Example Achievement",
 "SecuredPercentage": "82%",
 "AccountHolderName": "Student Name",
 "BankAccountNumber": "XXXXXXXX1234",
 "IFSCCode": "EXAMPLE0001",
 "BankName": "Example Bank",
 "BranchName": "Example Branch",
 "OtherDistrict": null,
 "MarksCardPath": "/Uploads/existing-marks.pdf",
 "BankPassbookPath": "/Uploads/existing-passbook.pdf",
 "StudentPhotoPath": "/Uploads/existing-photo.jpg",
 "HousePhotoPath": "/Uploads/existing-house.jpg",
 "AadharPath": "/Uploads/existing-aadhar.pdf",
 "IsAgreed": true,
 "HouseVisitLink": "https://example.com/visit"
 }
}

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Student found and mapped successfully. |
| 400 Bad Request | id <= 0. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | No PayanaStudents row matches StudentID. |
| 500 Internal Server Error | Unhandled exception; message is ex.Message. |

# 3. UPDATE PAYANA STUDENT

|  |  |
| --- | --- |
| **Item** | **Details** |
| Endpoint | POST /api/edit-payana-students/{id}/update |
| Purpose | Updates Payana student information using multipart/form-data and optionally uploads/replaces five files. |
| Content-Type | multipart/form-data |
| Authorization | JWT Required |
| Filter/Authorization Scope | Action-level [JwtSessionFilter] |
| Required Role | Not specified in controller. |

## JWT / Authorization Details

* JWT Required: Yes.
* Expected format: Authorization: Bearer <JWT\_TOKEN>.
* Action-level [JwtSessionFilter] is explicitly present.
* No JWT claims are directly read in the action.
* No Session values, UserID, EmployeeID, or Role are used by this action.
* No explicit role-based authorization is implemented in the controller.

## Path Parameters

|  |  |  |  |
| --- | --- | --- | --- |
| **Name** | **Type** | **Required** | **Description** |
| id | int | Yes | StudentID. Must be greater than 0. |

## Request Body / Multipart Form

The request MUST be multipart/form-data. The action rejects non-multipart requests with 400 Bad Request. Form fields are applied to the existing database DTO; fields omitted from the request retain their current values.

## A. Normal Form Fields

|  |  |  |  |
| --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Description** |
| StudentName | string | Optional | Replaces current StudentName if supplied. |
| DateOfBirth | date/date-time | Optional | Parsed with DateTime.TryParse; invalid input retains current value. |
| GenderID | int | Optional/nullable | Parsed with int.TryParse; blank/missing/invalid retains current value. |
| ContactNumber | string | Optional | Contact number. |
| AlternateNumber | string | Optional | Alternate contact number. |
| Email | string | Optional | Email address; no email-format validation is implemented. |
| RAddress | string | Optional | Mapped to database Address. |
| CAddress | string | Optional | Mapped to database CurrentAddress. |
| Place | string | Optional | Place. |
| Taluka | string | Optional | Taluka. |
| DistrictID | int | Optional/nullable | Parsed integer; blank/invalid retains current value. |
| PinCode | string | Optional | PIN code. |
| AreaTypeID | int | Optional/nullable | Parsed integer. |
| CasteCategoryID | int | Optional/nullable | Parsed integer. |
| HouseTypeID | int | Optional/nullable | Parsed integer. |
| FatherName | string | Optional | Father name. |
| MotherName | string | Optional | Mother name. |
| FatherOccupationID | int | Optional/nullable | Parsed integer. |
| MotherOccupationID | int | Optional/nullable | Parsed integer. |
| FamilyMembers | int | Optional/nullable | Parsed integer. |
| FamilyIncome | decimal | Optional/nullable | Parsed decimal. |
| ParentBank | decimal | Optional/nullable | Parsed decimal; mapped to ParentsBankBalance. |
| CourseID | int | Optional/nullable | Parsed integer. |
| CollegeName | string | Optional | College name. |
| CollegeTypeID | int | Optional/nullable | Parsed integer. |
| CollegeCNumber | string | Optional | College contact number. |
| CourseSA | string | Optional | Course SA. |
| CourseStream | string | Optional | Course stream. |
| AnnualFees | decimal | Optional/nullable | Parsed decimal. |
| TotalExpenses | decimal | Optional/nullable | Parsed decimal. |
| StudentAchivements | string | Optional | Exact form key spelling used by controller. |
| securedPercentage | string | Optional | Exact form key used by controller; mapped to SecuredPercentage. |
| AccountHolderName | string | Optional | Account holder name. |
| bankaccountno | string | Optional | Exact form key; mapped to BankAccountNumber. |
| ifsccode | string | Optional | IFSC code. |
| bankname | string | Optional | Bank name. |
| branchname | string | Optional | Branch name. |
| OtherDistrict | string | Optional | Other district. |
| IsAgreed | bool | Optional | Accepts Boolean text or 1/0; invalid input retains current value. |
| HouseVisitLink | string | Optional | House visit link. |

## B. File Upload Fields

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Required** | **Allowed Extensions** | **Max Size** | **Description** |
| latestmarkscard | file | Optional | Any extension with a non-empty extension | Not specified | Saved as MarksCardPath. |
| studentpassbookFP | file | Optional | Any extension with a non-empty extension | Not specified | Saved as BankPassbookPath. |
| StudentPhoto | file | Optional | Any extension with a non-empty extension | Not specified | Saved as StudentPhotoPath. |
| dwellingunit | file | Optional | Any extension with a non-empty extension | Not specified | Saved as HousePhotoPath. |
| adharcard | file | Optional | Any extension with a non-empty extension | Not specified | Saved as AadharPath. |

## File Upload Rules

* All five file fields are optional; SaveFile returns null when the corresponding file is absent.
* No specific file extension whitelist is implemented. The only explicit requirement is that the original filename has a non-empty extension.
* No maximum file size is defined in this controller.
* Only the first matching file field is selected.
* Uploaded files are copied to ~/Uploads/ using a GUID-generated filename while retaining the original extension.
* The returned stored path format is /Uploads/{guid}{extension}.
* If no new file is provided, the SQL update uses ISNULL(newPath, existingPath), so the existing database path is retained.
* Temporary multipart files are stored under ~/App\_Data/TempUploads/ and cleaned up after processing.
* Cleanup failures do not change the API result.
* The controller does not delete the previous permanent file when a replacement is uploaded.
* Multiple files are not separately processed for the same field; SaveFile stops after the first matching file.

## Update Validation Rules

* id is required and must be greater than 0.
* Request must be multipart/form-data.
* StudentID must exist; otherwise 404 Not Found.
* No [Required] attributes or ModelState validation are present in the supplied controller.
* Form fields are optional from the controller's perspective because missing fields retain the current database value.
* Invalid integer, decimal, date, or boolean form values do not produce a validation error; helper methods return the current value instead.
* Boolean accepts standard bool text via bool.TryParse plus numeric '1' and '0'.
* No min/max string length rules are implemented.
* No email-format validation is implemented.
* No duplicate checks are implemented.
* No explicit foreign-key validation is implemented.
* No role-specific field validation is implemented.
* No explicit file size, MIME-type, or extension whitelist is implemented.

## Update Business Logic

* The current PayanaStudentEditDto is loaded from PayanaStudents before applying form changes.
* Only fields represented in ApplyFormValues can be changed through normal form data.
* StudentID is taken from the route and is not changed by form data.
* Database update sets the listed PayanaStudents columns to the current DTO values.
* File paths are conditionally updated with ISNULL, retaining existing paths when no replacement file is supplied.
* After a successful database update, the updated student is queried again and returned as data.
* No CreatedBy/ModifiedBy fields are populated by this controller.
* No status field is modified.
* No transaction is explicitly created.

## Database UPDATE Mapping

|  |  |
| --- | --- |
| **Database Column** | **Parameter / Source** |
| StudentName | @StudentName |
| DateOfBirth | @DateOfBirth |
| GenderID | @GenderID |
| ContactNumber | @ContactNumber |
| AlternateNumber | @AlternateNumber |
| Email | @Email |
| Address | @RAddress |
| CurrentAddress | @CAddress |
| Place | @Place |
| Taluka | @Taluka |
| DistrictID | @DistrictID |
| PinCode | @PinCode |
| AreaTypeID | @AreaTypeID |
| CasteCategoryID | @CasteCategoryID |
| HouseTypeID | @HouseTypeID |
| FatherName | @FatherName |
| MotherName | @MotherName |
| FatherOccupationID | @FatherOccupationID |
| MotherOccupationID | @MotherOccupationID |
| FamilyMembers | @FamilyMembers |
| FamilyIncome | @ParentFamilyIncome |
| ParentsBankBalance | @ParentBank |
| CourseID | @CourseID |
| CollegeName | @CollegeName |
| CollegeTypeID | @CollegeTypeID |
| CollegeContactNumber | @CollegeCNumber |
| CourseSA | @CourseSA |
| CourseStream | @CourseStream |
| AnnualFees | @AnnualFees |
| TotalExpenses | @TotalExpenses |
| StudentAchievement | @StudentAchivements |
| securedPercentage | @securedPercentage |
| accountholdername | @accountholdername |
| BankAccountNumber | @bankaccountno |
| ifsccode | @ifsccode |
| bankname | @bankname |
| branchname | @branchname |
| OtherDistrict | @OtherDistrict |
| IsAgreed | @IsAgreed |
| HouseVisitLink | @HouseVisitLink |
| MarksCardPath | ISNULL(@latestmarkscard, MarksCardPath) |
| BankPassbookPath | ISNULL(@studentpassbookFP, BankPassbookPath) |
| StudentPhotoPath | ISNULL(@StudentPhoto, StudentPhotoPath) |
| HousePhotoPath | ISNULL(@dwellingunit, HousePhotoPath) |
| AadharPath | ISNULL(@adharcard, AadharPath) |

## Success Response (200)

{
 "success": true,
 "message": "Payana Student Updated Successfully.",
 "data": {
 "StudentID": 1001,
 "StudentName": "Example Student",
 "...": "Updated PayanaStudentEditDto fields"
 }
}

The actual data object is the complete PayanaStudentEditDto returned by GetStudentFromDatabase after the update.

|  |  |
| --- | --- |
| **Status** | **When** |
| 200 OK | Student update succeeds and the updated record is returned. |
| 400 Bad Request | id <= 0, or request is not multipart/form-data. |
| 401 Unauthorized | JWT filter rejects the request. |
| 403 Forbidden | Not explicitly returned by the action. |
| 404 Not Found | Student does not exist, or ExecuteNonQuery returns zero rows. |
| 500 Internal Server Error | Unhandled exception; response includes ex.Message. |

# COMMON DTOS

## 1. DropdownItem

Purpose: Common response item used for every dropdown.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| Value | string | Not specified | Not specified | String representation of database result column 0. |
| Text | string | Not specified | Not specified | String representation of database result column 1. |

{
 "Value": "1",
 "Text": "Example"
}

## 2. PayanaStudentEditDto

Purpose: Request/update state and response DTO for a Payana student edit record.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Property** | **Type** | **Required** | **Nullable** | **Description** |
| StudentID | int | Not specified | No | Student identifier; route id determines which record is updated. |
| StudentName | string | Not specified | Yes | Student name. |
| DateOfBirth | DateTime? | Not specified | Yes | Date of birth. |
| GenderID | int? | Not specified | Yes | Gender master identifier. |
| ContactNumber | string | Not specified | Yes | Contact number. |
| AlternateNumber | string | Not specified | Yes | Alternate number. |
| Email | string | Not specified | Yes | Email. |
| RAddress | string | Not specified | Yes | Maps to Address. |
| CAddress | string | Not specified | Yes | Maps to CurrentAddress. |
| Place | string | Not specified | Yes | Place. |
| Taluka | string | Not specified | Yes | Taluka. |
| DistrictID | int? | Not specified | Yes | District identifier. |
| PinCode | string | Not specified | Yes | PIN code. |
| AreaTypeID | int? | Not specified | Yes | Area type identifier. |
| CasteCategoryID | int? | Not specified | Yes | Caste category identifier. |
| HouseTypeID | int? | Not specified | Yes | House type identifier. |
| FatherName | string | Not specified | Yes | Father name. |
| MotherName | string | Not specified | Yes | Mother name. |
| FatherOccupationID | int? | Not specified | Yes | Father occupation identifier. |
| MotherOccupationID | int? | Not specified | Yes | Mother occupation identifier. |
| FamilyMembers | int? | Not specified | Yes | Number of family members. |
| FamilyIncome | decimal? | Not specified | Yes | Family income. |
| ParentBank | decimal? | Not specified | Yes | Parent bank balance. |
| CourseID | int? | Not specified | Yes | Course identifier. |
| CollegeName | string | Not specified | Yes | College name. |
| CollegeTypeID | int? | Not specified | Yes | College type identifier. |
| CollegeCNumber | string | Not specified | Yes | College contact number. |
| CourseSA | string | Not specified | Yes | Course SA. |
| CourseStream | string | Not specified | Yes | Course stream. |
| AnnualFees | decimal? | Not specified | Yes | Annual fees. |
| TotalExpenses | decimal? | Not specified | Yes | Total expenses. |
| StudentAchivements | string | Not specified | Yes | Student achievements; property spelling is preserved exactly. |
| SecuredPercentage | string | Not specified | Yes | Secured percentage. |
| AccountHolderName | string | Not specified | Yes | Bank account holder name. |
| BankAccountNumber | string | Not specified | Yes | Bank account number. |
| IFSCCode | string | Not specified | Yes | IFSC code. |
| BankName | string | Not specified | Yes | Bank name. |
| BranchName | string | Not specified | Yes | Bank branch name. |
| OtherDistrict | string | Not specified | Yes | Other district. |
| MarksCardPath | string | Not specified | Yes | Stored marks-card file path. |
| BankPassbookPath | string | Not specified | Yes | Stored bank-passbook file path. |
| StudentPhotoPath | string | Not specified | Yes | Stored student-photo file path. |
| HousePhotoPath | string | Not specified | Yes | Stored house-photo file path. |
| AadharPath | string | Not specified | Yes | Stored Aadhaar file path. |
| IsAgreed | bool | Not specified | No | Agreement flag. |
| HouseVisitLink | string | Not specified | Yes | House visit link. |

## Sample Response DTO

{
 "StudentID": 1001,
 "StudentName": "Example Student",
 "DateOfBirth": "2003-05-15T00:00:00",
 "GenderID": 1,
 "ContactNumber": "9876543210",
 "AlternateNumber": null,
 "Email": "student@example.com",
 "RAddress": "Residential Address",
 "CAddress": "Current Address",
 "Place": "Example Place",
 "Taluka": "Example Taluka",
 "DistrictID": 5,
 "PinCode": "560001",
 "AreaTypeID": 1,
 "CasteCategoryID": 2,
 "HouseTypeID": 1,
 "FatherName": "Father Name",
 "MotherName": "Mother Name",
 "FatherOccupationID": 3,
 "MotherOccupationID": 4,
 "FamilyMembers": 4,
 "FamilyIncome": 25000.00,
 "ParentBank": 50000.00,
 "CourseID": 10,
 "CollegeName": "Example College",
 "CollegeTypeID": 1,
 "CollegeCNumber": "0801234567",
 "CourseSA": "Example Course",
 "CourseStream": "Science",
 "AnnualFees": 50000.00,
 "TotalExpenses": 70000.00,
 "StudentAchivements": "Example Achievement",
 "SecuredPercentage": "82%",
 "AccountHolderName": "Student Name",
 "BankAccountNumber": "XXXXXXXX1234",
 "IFSCCode": "EXAMPLE0001",
 "BankName": "Example Bank",
 "BranchName": "Example Branch",
 "OtherDistrict": null,
 "MarksCardPath": "/Uploads/example.pdf",
 "BankPassbookPath": "/Uploads/example.pdf",
 "StudentPhotoPath": "/Uploads/example.jpg",
 "HousePhotoPath": "/Uploads/example.jpg",
 "AadharPath": "/Uploads/example.pdf",
 "IsAgreed": true,
 "HouseVisitLink": "https://example.com/visit"
}

# DATABASE / SECURITY SUMMARY

|  |  |
| --- | --- |
| **Area** | **Behavior** |
| Primary table | PayanaStudents |
| Dropdown master tables | GenderMaster, CasteCategoryMaster, AreaTypeMaster, HouseTypeMaster, CollegeTypeMaster, DistrictMaster, FatherOccupationMaster, MotherOccupationMaster |
| GET by ID | SELECT \* FROM PayanaStudents WHERE StudentID = @StudentID |
| Update | UPDATE PayanaStudents SET listed fields WHERE StudentID = @StudentID |
| File storage | ~/Uploads/ |
| Multipart temp storage | ~/App\_Data/TempUploads/ |
| File naming | GUID + original extension |
| Existing file retention | Yes, through ISNULL(newPath, existingPath) |
| Soft delete | Not implemented |
| CreatedBy / ModifiedBy | Not populated |
| UserID filtering | Not implemented |
| EmployeeID filtering | Not implemented |
| Role filtering | Not implemented in controller |
| Pagination/search/sorting | Not implemented |
| Duplicate checks | Not implemented |
| Transaction | No explicit transaction |
| JWT | Action-level [JwtSessionFilter] on all three endpoints |
| Session/JWT claims | No direct claim/session usage in this controller |

# STATUS CODE MATRIX

|  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Endpoint** | **200** | **400** | **401** | **403** | **404** | **409** | **500** |
| Dropdowns | Yes | No | Yes | Not explicit | No | No | Yes |
| Get by ID | Yes | Yes | Yes | Not explicit | Yes | No | Yes |
| Update | Yes | Yes | Yes | Not explicit | Yes | No | Yes |

# IMPORTANT CONTRACT NOTES

* JWT is not inferred merely from the Web API project: it is documented as required because [JwtSessionFilter] is explicitly attached to every endpoint action.
* The filter is action-level, not controller-level.
* No endpoint is public according to the supplied controller.
* No role is explicitly required by the controller.
* No JWT claim or Session value is directly consumed by these actions.
* The update endpoint is multipart/form-data, not JSON.
* All normal form fields are effectively optional at controller level: missing fields preserve the existing database values.
* Invalid typed form values generally preserve the current value rather than generating 400.
* File extension and maximum size restrictions are not specified in the controller.
* No dropdown '-- Select --' item is added by the controller.
* All DTO properties are documented from the supplied controller. Requiredness is marked 'Not specified' where the controller contains no explicit required-field validation or DTO validation attributes.
* Any database constraints not visible in the controller are 'Not specified in controller'.

# FINAL QUALITY CHECK

* All three controller endpoints are included.
* HTTP methods and route prefix are documented.
* JWT requirements are determined from the actual [JwtSessionFilter] attributes.
* No controller-level JWT filter is invented.
* Dropdown sources and active filtering are documented.
* Path parameter id is documented.
* Multipart form fields and all five file fields are documented.
* Optional-field retention behavior is documented.
* File replacement/retention and generated GUID path logic are documented.
* Validation and error handling visible in the controller are documented.
* Database table and UPDATE mappings visible in the controller are documented.
* Common DTOs DropdownItem and PayanaStudentEditDto are included.
* No unsupported roles, claims, pagination, duplicate checks, file limits, or validation rules are invented.