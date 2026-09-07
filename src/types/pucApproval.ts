/**
 * PUC Student Approval API Contract Types
 *
 * Source: PUC Student Approval API Contract.docx
 * Base Route: /api/students
 * Content-Type: application/json (except EditStudent uses multipart/form-data)
 *
 * Endpoints:
 *   GET  /api/students/getall          → PucApprovalStudent[]
 *   GET  /api/students/get/{id}        → PucApprovalStudentDetail
 *   POST /api/students/approve?id=...  → ApprovalMutationResponse
 *   POST /api/students/reject?id=...   → ApprovalMutationResponse
 */

/** Student application approval status values from the approval grid */
export type StudentApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | string;

/** Row returned by GET /api/students/getall (approval grid) */
export interface PucApprovalStudent {
  StudentID: number;
  StudentName: string;
  DateOfBirth: string | null;
  GenderID: number;
  GenderName: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Email: string | null;
  Address: string | null;
  AreaTypeName: string | null;
  District: string | null;
  Taluka: string | null;
  PinCode: string | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupation: string | null;
  MotherOccupation: string | null;
  FamilyIncome: number | null;
  FamilyMembers: number | null;
  CategoryName: string | null;
  HouseTypeName: string | null;
  MonthlyRent: string | null;
  SourceName: string | null;
  CourseName: string | null;
  CollegeName: string | null;
  CollegeTypeName: string | null;
  ExpectedFees: number | null;
  SecuredPercentage: number | null;
  TotalMarks: number | null;
  Status: string | null;
  ApprovalStatus: StudentApprovalStatus;
  StudentPhotoPath: string | null;
  SSLCMarksCardPath: string | null;
  ElectricityBillPath: string | null;
  RationCardPath: string | null;
  IncomeCertificatePath: string | null;
  FamilyPhotoPath: string | null;
  HouseVideoPath: string | null;
  Remark: string | null;
}

/** Response from GET /api/students/get/{id} (student detail for edit) */
export interface PucApprovalStudentDetail {
  StudentID: number;
  StudentName: string;
  DateOfBirth: string | null;
  GenderID: number;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Email: string | null;
  Address: string | null;
  AreaTypeID: number;
  DistrictID: number;
  Taluka: string | null;
  PinCode: string | null;
  StudentPhotoPath: string | null;
  SSLCMarksCardPath: string | null;
  ElectricityBillPath: string | null;
  RationCardPath: string | null;
  IncomeCertificatePath: string | null;
  FamilyPhotoPath: string | null;
  HouseVideoPath: string | null;
}

/** Raw response from POST /api/students/approve and /api/students/reject */
export interface ApprovalMutationResponse {
  Success: boolean;
  Message: string;
  Data?: unknown;
}

/** Generic dropdown DTO used by genders, districts, areas endpoints */
export interface PucApprovalDropdownDto {
  Id: number;
  Name: string;
}

/** Query params for GET /api/students/getall */
export interface PucApprovalListQueryParams {
  role?: string;
  userId?: number;
}
