/**
 * PUC Format 1.1 — Create API Contract Types
 *
 * Endpoint: POST /api/VP_Format1_1PUC  (multipart/form-data)
 * Dropdowns: GET /api/VP_Format1_1PUC/dropdowns
 *
 * All scalar fields are sent as strings in the multipart body;
 * the backend parses them via model binding.
 */

import { UploadedDocument } from './documents';

// ============================================================================
// Dropdown Item (wire format)
// ============================================================================

export interface PucFormat11DropdownItem {
  Id: number;
  Name: string;
}

// ============================================================================
// Dropdowns Response
// ============================================================================

export interface PucFormat11CreateDropdownsResponse {
  GenderList: PucFormat11DropdownItem[];
  AreaList: PucFormat11DropdownItem[];
  DistrictList: PucFormat11DropdownItem[];
  CasteList: PucFormat11DropdownItem[];
  CourseList: PucFormat11DropdownItem[];
  CollegeTypeList: PucFormat11DropdownItem[];
  FatherOccupationList: PucFormat11DropdownItem[];
  MotherOccupationList: PucFormat11DropdownItem[];
  PlaceList?: PucFormat11DropdownItem[];
}

// ============================================================================
// Create Response
// ============================================================================

export interface PucFormat11CreateResponse {
  Success: boolean;
  Message: string;
  Data?: unknown;
}

// ============================================================================
// Form Section Types (used by Zod-inferred types)
// ============================================================================

export interface PucFormat11PersonalSection {
  StudentName: string;
  DateOfBirth: string;
  Gender: number;
  Caste: number;
  Place: number;
}

export interface PucFormat11ContactSection {
  Email: string;
  ContactNumber: string;
  AlternateNumber?: string;
}

export interface PucFormat11AddressSection {
  District: number;
  OtherDistrict?: string;
  Taluk: string;
  ResidentialAddress: string;
  PinCode?: string;
}

export interface PucFormat11FamilySection {
  FatherName?: string;
  MotherName?: string;
  FatherOccupation: number;
  MotherOccupation: number;
  TotalFamilyMembers: number;
  FamilyAnnualIncome: number;
  HouseTypeID?: number;
  MonthlyRent?: number;
  ReferenceSourceID?: number;
}

export interface PucFormat11AcademicSection {
  SSLCPercentage: number;
  SSLCPercentageNumber?: number;
  SSLCTotalMarks?: number;
  CourseJoined: number;
  CollegeName: string;
  CollegeType: number;
  CollegeFees: number;
  CollegeContactNumber?: string;
  Achievement?: string;
}

export interface PucFormat11BankSection {
  ParentsBankBalance: number;
  AccountHolderName: string;
  AccountNumber: string;
  IFSCCode: string;
  BankName: string;
  BranchName: string;
}

export interface PucFormat11DocumentsSection {
  StudentSelfie?: UploadedDocument;
  SSLCMarksCard?: UploadedDocument;
  FeeReceipts?: UploadedDocument;
  BankPassbook?: UploadedDocument;
  AadhaarCard?: UploadedDocument;
}

// ============================================================================
// Complete Form Values
// ============================================================================

export interface PucFormat11FormValues {
  personal: PucFormat11PersonalSection;
  contact: PucFormat11ContactSection;
  address: PucFormat11AddressSection;
  family: PucFormat11FamilySection;
  academic: PucFormat11AcademicSection;
  bank: PucFormat11BankSection;
  documents: PucFormat11DocumentsSection;
}
