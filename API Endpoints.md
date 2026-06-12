1. Professional Student:
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/students/professional/dropdowns/

            Response: Array of professional students
        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/students/professional/create

2. PUC Student:
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/students/students/dropdowns

        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/students/students/create
             

3. Payana Students:
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/payanastudents/dropdowns
             
        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/payanastudents/create
             
4. Semi Professional Student: (Note that both are same, if we use GET method we will get dropdown values, if we use POST method here, then we can submit the form)
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/semiprofessionalstudent/create
             
        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/semiprofessionalstudent/create
             
5. Professional Student Renewal Form
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/professionalrenewal/create

        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/professionalrenewal/create
            Content-Type:
multipart/form-data

Authorization:
Not Required

Path Parameters:
None

Query Parameters:
None

Request Body:
Not Applicable (multipart/form-data used)

Form Data / Multipart Fields:

| Field | Type | Required | Description |
|---|---|---|---|
| ApplicantName | string | Yes | Student full name |
| VPIDNumber | string | Yes | VPID number |
| WhatsAppNumber | string | Yes | WhatsApp number |
| AlternateNumber | string | No | Alternate mobile number |
| EmailID | string | Yes | Student email |
| District | string | Yes | District name |
| Taluk | string | Yes | Taluk name |
| ResidentialAddress | string | Yes | Student residential address |
| Gender | string | Yes | Male/Female/Other |
| StudentAchievement | string | No | Student achievements |
| LatestResultPercentage | decimal | No | Latest academic percentage |
| TotalScholarshipAmount | decimal | No | Scholarship amount |
| DonorName | string | No | Donor name |
| LettersWrittenToDonor | int | No | Number of letters written |
| CourseStudyingApplying | string | No | Course applying for |
| CurrentCourseYear | int | No | Current course year |
| CourseStream | string | No | Stream name |
| CollegeName | string | No | College name |
| CollegeContactNumber | string | No | College contact |
| CollegeType | string | No | Government/Private |
| ExpectedCollegeFees | decimal | No | Expected fees |
| TotalEducationalExpenses | decimal | No | Total educational expenses |
| AccountHolderName | string | No | Bank account holder |
| BankAccountNumber | string | No | Bank account number |
| BankName | string | No | Bank name |
| IFSCCode | string | No | IFSC code |
| BankBranchName | string | No | Bank branch |
| ParentsBankBalance | decimal | No | Parent bank balance |

File Upload Fields:

| Field | Type | Required | Allowed Extensions | Max Size |
|---|---|---|---|---|
| LatestMarksheetFile | file | No | .pdf,.jpg,.jpeg,.png | Server Configured |
| StudentPassbookFile | file | No | .pdf,.jpg,.jpeg,.png | Server Configured |
| StudentSelfieFile | file | No | .jpg,.jpeg,.png | Server Configured |
| CollegeFrontPhotoFile | file | No | .jpg,.jpeg,.png | Server Configured |
| ThankingVideoFile | file | No | .mp4,.avi,.mov | Server Configured |
| ParentsPassbookFile | file | No | .pdf,.jpg,.jpeg,.png | Server Configured |

Validation Rules:
- ApplicantName required
- VPIDNumber required
- WhatsAppNumber required
- EmailID required
- District required
- Taluk required
- ResidentialAddress required
- Gender required
- Decimal fields must contain valid numeric values
- Integer fields must contain valid integers
- Files are optional
- Uploaded files stored inside /PRUploads folder

Business Logic Notes:
- Automatically creates upload folder if missing
- Files renamed using GUID format
- Status defaults to 1
- File paths saved in database
- Data inserted into ProfessionalRenewal table
- Returns newly created PRId

Success Response (200):

{
  "Success": true,
  "Message": "Professional Renewal submitted successfully",
  "PRId": 12
}

Failure Responses:

400 Bad Request
500 Internal Server Error

Example Error JSON:

{
  "success": false,
  "message": "Validation failed"
}

Status Codes Used:
- 200 OK
- 400 Bad Request
- 500 Internal Server Error


             
6. PUC Renewal Form
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/renewalpuc/dropdowns
             
        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/renewalpuc/create
            Content-Type:
application/json

Authorization:
Not Required

Path Parameters:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| None | - | - | No path parameters |

Query Parameters:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| None | - | - | No query parameters |

Request Body:
{
  "email": "student@test.com",
  "applicantName": "Rahul Kumar",
  "vpid": "VP1001",
  "whatsApp": "9876543210",
  "alternateNumber": "9123456780",
  "district": 1,
  "taluk": "Bangalore South",
  "address": "MG Road",
  "gender": "Male",
  "dob": "2005-06-15",
  "latestResult": "85%",
  "scholarshipAmount": 25000,
  "donorName": "ABC Trust",
  "lettersCount": 2,
  "course": "PUC",
  "courseYear": "2nd Year",
  "courseStream": "Science",
  "collegeName": "ABC College",
  "collegeContact": "9988776655",
  "collegeType": "Private",
  "collegeFees": 50000,
  "totalExpenses": 70000,
  "achievements": "State Rank",
  "invitedToCamp": "Yes",
  "attendedCamp": "Yes",
  "campCount": 1,
  "campPlace": "Mysore",
  "campDate": "2026-05-26",
  "vdssAttended": "Yes",
  "vdss_Topics": "Leadership",
  "accountHolderName": "Rahul Kumar",
  "accountNumber": "1234567890",
  "ifsc": "SBIN0001234",
  "bankName": "SBI",
  "branchName": "MG Road",
  "parentBankBalance": 12000,
  "houseVisitLink": "https://example.com/visit"
}

Form Data / Multipart Fields (if any):
None

File Upload Fields (if any):
None

Validation Rules:
- Email required
- ApplicantName required
- District required
- DOB required
- Course required
- Email must be unique in RenewalPUC table
- Duplicate email returns 400
- Nullable fields allowed:
  - AlternateNumber
  - DonorName
  - Achievements
  - HouseVisitLink
- Status defaults to 1
- CreatedDate defaults to GETDATE()

Business Logic Notes:
- Checks duplicate email before insert.
- Inserts into RenewalPUC table.
- Auto-generates primary key using SCOPE_IDENTITY().

Success Response (200):
{
  "success": true,
  "message": "Renewal created successfully",
  "renewalId": 15
}

Failure Responses:
400 Bad Request
{
  "success": false,
  "message": "This Email already exists."
}

401 Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

403 Forbidden
{
  "success": false,
  "message": "Forbidden"
}

404 Not Found
{
  "success": false,
  "message": "District not found"
}

409 Conflict
{
  "success": false,
  "message": "Duplicate email"
}

500 Internal Server Error
{
  "success": false,
  "message": "Internal server error"
}

Status Codes Used:
200, 400, 500

   
7. Payana Renewal Form
        A) GET method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/payanarenewal/payanadropdowns
             
        B) POST method
            URL: https://vpwebservices.testserver.envisage-workflow.in/api/payanarenewal/create
             Content-Type:
Supports BOTH:
- application/json
- multipart/form-data

Authorization:
Not Required

Path Parameters:

| Name | Type | Required | Description |
|------|------|------|------|
| None | - | - | - |

Query Parameters:

| Name | Type | Required | Description |
|------|------|------|------|
| None | - | - | - |

-----------------------------------------------------------------
REQUEST BODY (application/json)
-----------------------------------------------------------------

```json
{
  "EmailId": "aishu@gmail.com",
  "District": "Udupi",
  "Taluk": "Kundapura",
  "PayanaId": "PAY001",
  "StudentName": "Aishu",
  "DateOfBirth": "2002-05-10",
  "ResidentialAddress": "Udupi Karnataka",
  "CurrentAddress": "Bangalore Karnataka",
  "PrimaryNumber": "9876543210",
  "AlternateNumber": "9876543211",
  "Place": "Rural",
  "Caste": "OBC",
  "FatherOccupation": "Farmer",
  "MotherOccupation": "Teacher",
  "FamilyIncome": 50000,
  "BankBalance": 10000,
  "CollegeName": "MIT Manipal",
  "CollegeType": "Private",
  "CollegeContact": "9988776655",
  "CourseS": "BE",
  "CourseStream": "Computer Science",
  "AnnualFees": 85000,
  "TotalExpenses": 120000,
  "ScholarshipAmount": 25000,
  "DonorName": "ABC Foundation",
  "LettersWritten": 5,
  "Achievement": "State Rank Holder",
  "Percentage": "89%",
  "AccountHolder": "Aishu",
  "AccountNumber": "123456789012",
  "IFSC": "SBIN0001234",
  "BankName": "State Bank of India",
  "Branch": "Udupi",
  "HouseVisitLink": "https://meet.google.com/test"
}
```

-----------------------------------------------------------------
FORM DATA / MULTIPART FIELDS
-----------------------------------------------------------------

| Field | Type | Required | Description |
|------|------|------|------|
| EmailId | string | Yes | Student email ID |
| District | string | No | District name |
| Taluk | string | No | Taluk name |
| PayanaId | string | No | Unique Payana ID |
| StudentName | string | Yes | Student full name |
| DateOfBirth | date | No | Student DOB |
| ResidentialAddress | string | No | Residential address |
| CurrentAddress | string | No | Current address |
| PrimaryNumber | string | No | Primary mobile number |
| AlternateNumber | string | No | Alternate mobile number |
| Place | string | No | Rural/Urban etc |
| Caste | string | No | Caste category |
| FatherOccupation | string | No | Father occupation |
| MotherOccupation | string | No | Mother occupation |
| FamilyIncome | decimal | No | Annual family income |
| BankBalance | decimal | No | Parent bank balance |
| CollegeName | string | No | College name |
| CollegeType | string | No | Government/Private |
| CollegeContact | string | No | College contact number |
| CourseS | string | No | Course name |
| CourseStream | string | No | Course stream |
| AnnualFees | decimal | No | Annual fee amount |
| TotalExpenses | decimal | No | Total education expenses |
| ScholarshipAmount | decimal | No | Scholarship amount |
| DonorName | string | No | Donor name |
| LettersWritten | int | No | Number of letters written |
| Achievement | string | No | Student achievements |
| Percentage | string | No | Secured percentage |
| AccountHolder | string | No | Bank account holder name |
| AccountNumber | string | No | Bank account number |
| IFSC | string | No | IFSC code |
| BankName | string | No | Bank name |
| Branch | string | No | Bank branch |
| HouseVisitLink | string | No | House visit meeting link |

-----------------------------------------------------------------
FILE UPLOAD FIELDS
-----------------------------------------------------------------

| Field | Type | Required | Allowed Extensions | Max Size |
|------|------|------|------|------|
| MarksheetFile | File | No | .jpg, .jpeg, .png, .pdf | Server Limit |
| FeesReceiptFile | File | No | .jpg, .jpeg, .png, .pdf | Server Limit |
| PassbookFile | File | No | .jpg, .jpeg, .png, .pdf | Server Limit |
| SelfieFile | File | No | .jpg, .jpeg, .png | Server Limit |
| AadhaarFile | File | No | .jpg, .jpeg, .png, .pdf | Server Limit |

-----------------------------------------------------------------
VALIDATION RULES
-----------------------------------------------------------------

Required Fields:
- StudentName
- EmailId

Nullable Fields:
- All remaining fields are optional

Business Validations:
- EmailId must be unique
- PayanaId must be unique
- Duplicate records are blocked

Duplicate Check Logic:
```sql
SELECT COUNT(*)
FROM PayanaRenewal
WHERE LOWER(EmailId) = LOWER(@EmailId)
OR PayanaId = @PayanaId
```

File Validation:
- Files are optional
- Files are saved only if uploaded
- Folder auto-created if not exists

Date Handling:
- If DateOfBirth is empty:
  - NULL is inserted into database

-----------------------------------------------------------------
BUSINESS LOGIC NOTES
-----------------------------------------------------------------

- Uploaded files are stored in:

