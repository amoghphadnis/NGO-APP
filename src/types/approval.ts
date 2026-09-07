/**
 * Shared Approval API Contract Types
 *
 * Used by Professional, Semi Professional, and Payana approval screens.
 * Each program's raw API response is mapped to the common ApprovalStudent
 * interface by its respective API client.
 *
 * Contracts:
 *   Professional:     /api/new-professional-approval (NewProfessionalApplication)
 *   Semi Professional: /api/semi-professional-student-approval (NewSemiProfessionalApplication)
 *   Payana:           /api/payana-student-grid (PayanaStudents)
 */

/** Common approval status values */
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | string;

/**
 * Normalized student shape used by the generic approval screen.
 * Each program's API client maps its raw DTO to this interface.
 */
export interface ApprovalStudent {
  id: number;
  studentName: string;
  email: string | null;
  contactNumber: string | null;
  district: string | null;
  approvalStatus: ApprovalStatus;
  remark: string | null;
  /** Program-specific info rows for the card body */
  infoRows: { label: string; value: string | null }[];
}

/** Generic list response wrapper used by all 3 programs */
export interface ApprovalListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

/** Generic approve/reject response (varies by program) */
export interface ApprovalMutationResponse {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

// ── Raw DTOs (match backend JSON exactly) ──────────────────────────

/** Raw row from GET /api/new-professional-approval/list */
export interface RawProfessionalApprovalStudent {
  ApplicationID: number;
  StudentName: string;
  Email: string | null;
  DOB: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  ResidentialAddress: string | null;
  DistrictName: string | null;
  OtherDistrict: string | null;
  GenderName: string | null;
  CategoryName: string | null;
  AreaTypeName: string | null;
  HouseTypeName: string | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupation: string | null;
  MotherOccupation: string | null;
  FamilyMembers: number | null;
  FamilyIncome: number | null;
  PUPercentage: number | null;
  CETRank: string | null;
  NEETRank: string | null;
  CourseApplying: string | null;
  CourseStream: string | null;
  Status: boolean | null;
  ApproveStatus: ApprovalStatus;
  Remark: string | null;
  CreatedDate: string | null;
}

/** Raw row from GET /api/semi-professional-student-approval/list */
export interface RawSemiProfessionalApprovalStudent {
  ApplicationID: number;
  StudentName: string;
  Email: string | null;
  DOB: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  ResidentialAddress: string | null;
  DistrictName: string | null;
  OtherDistrict: string | null;
  GenderName: string | null;
  CategoryName: string | null;
  AreaTypeName: string | null;
  HouseTypeName: string | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupation: string | null;
  MotherOccupation: string | null;
  FamilyMembers: number | null;
  FamilyIncome: number | null;
  PUPercentage: number | null;
  CETRank: string | null;
  PTRank: string | null;
  CourseApplying: string | null;
  CourseStream: string | null;
  Status: boolean | null;
  ApproveStatus: ApprovalStatus;
  Remark: string | null;
  CreatedDate: string | null;
}

/** Raw row from GET /api/payana-student-grid/list */
export interface RawPayanaApprovalStudent {
  StudentID: number;
  StudentName: string;
  DateOfBirth: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Email: string | null;
  AreaTypeName: string | null;
  Address: string | null;
  CurrentAddress: string | null;
  DistrictName: string | null;
  OtherDistrict: string | null;
  Taluka: string | null;
  PinCode: string | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupationName: string | null;
  MotherOccupationName: string | null;
  FamilyMembers: number | null;
  FamilyIncome: number | null;
  CategoryName: string | null;
  CollegeName: string | null;
  CollegeTypeName: string | null;
  CollegeContactNumber: string | null;
  CourseSA: string | null;
  CourseStream: string | null;
  AnnualFees: number | null;
  TotalExpenses: number | null;
  StudentAchievement: string | null;
  SecuredPercentage: number | null;
  ApproveStatus: ApprovalStatus;
  Remark: string | null;
}
