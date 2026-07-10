/**
 * Types for Volunteer Student List APIs
 * 
 * APIs:
 * - GET /api/professionalstudents/studentlist
 * - GET /api/pucstudents/studentlist
 */

// ============================================================================
// Student Types
// ============================================================================

export interface ProfessionalStudent {
  studentID: number;
  studentName: string;
  contactNumber: string;
  address: string;
  place: string;
  taluka: string;
  pinCode: string;
  houseVisitLink: string;
  districtName: string;
  collegeName: string;
  familyIncome: number;
  securedPercentage: number;
  isVisited: boolean;
  approveStatus: string;
}

export interface PUCStudent {
  studentID: number;
  studentName: string;
  contactNumber: string;
  address: string;
  place: string;
  taluka: string;
  pinCode: string;
  houseVisitLink: string;
  districtName: string;
  collegeName: string;
  familyIncome: number;
  securedPercentage: number;
  isVisited: boolean;
  approveStatus: string;
}

export interface PayanaStudent {
  studentID: number;
  studentName: string;
  contactNumber: string;
  address: string;
  place: string;
  taluka: string;
  pinCode: string;
  houseVisitLink: string;
  districtName: string;
  collegeName: string;
  familyIncome: number;
  securedPercentage: number;
  isVisited: boolean;
  approveStatus: string;
}

export interface SemiProfessionalStudent {
  studentID: number;
  studentName: string;
  contactNumber: string;
  address: string;
  place: string;
  taluka: string;
  houseVisitLink: string;
  districtName: string;
  collegeName: string;
  familyIncome: number;
  securedPercentage: number;
  isVisited: boolean;
  approveStatus: string;
}

// ============================================================================
// District Dropdown
// ============================================================================

export interface District {
  districtID: number;
  districtName: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ProfessionalStudentListResponse {
  students: ProfessionalStudent[];
  districts: District[];
}

export interface PUCStudentListResponse {
  students: PUCStudent[];
  districts: District[];
}

export interface PayanaStudentListResponse {
  students: PayanaStudent[];
  districts: District[];
}

export interface SemiProfessionalStudentListResponse {
  students: SemiProfessionalStudent[];
  districts: District[];
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface StudentListQueryParams {
  search?: string;
  districtId?: number;
}

// ============================================================================
// Component/View Types
// ============================================================================

export type StudentType = 'professional' | 'puc' | 'payana' | 'semiProfessional';

export interface StudentListViewModel {
  id: number;
  name: string;
  mobile: string;
  address: string;
  place: string;
  taluka: string;
  pinCode: string;
  district: string;
  college: string;
  income: string;
  percentage: string;
  isVisited: boolean;
  houseVisitLink: string;
  studentType: StudentType;
}

// ============================================================================
// Error Types
// ============================================================================

export interface StudentListError {
  success: false;
  message: string;
}

export type StudentListErrorCode = 
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'INVALID_PARAMS';
