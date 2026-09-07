/**
 * Types for the student EDIT APIs (retrieve + partial update)
 *
 * - PUC Format 1.1:  /api/edit-format1-1-puc-student
 * - New Professional: /api/edit-new-professional-student
 * - Payana:           /api/edit-payana-students
 *
 * Wire-format types mirror the backend DTOs exactly (PascalCase).
 * Update requests are multipart/form-data; every field is optional and
 * only supplied fields overwrite the stored value.
 */

import { DocumentFile } from './documents';
import { SelectListItemDto } from './payana';

// ============================================================================
// Shared
// ============================================================================

export interface IdNameDto {
  id: number;
  name: string;
}

export interface EditMutationResponse<TData = undefined> {
  success: boolean;
  message: string;
  data?: TData;
}

// ============================================================================
// PUC Format 1.1
// ============================================================================

export interface PucFormat11StudentDto {
  StudentId: number;
  Email: string | null;
  StudentName: string | null;
  District: number | null;
  OtherDistrict: string | null;
  Taluk: string | null;
  ResidentialAddress: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Gender: number | null;
  DateOfBirth: string | null;
  Caste: number | null;
  Place: number | null;
  FatherOccupation: number | null;
  MotherOccupation: number | null;
  TotalFamilyMembers: number | null;
  FamilyAnnualIncome: number | null;
  SSLCPercentage: number | null;
  CourseJoined: number | null;
  CollegeName: string | null;
  CollegeType: number | null;
  CollegeFees: number | null;
  CollegeContactNumber: string | null;
  Achievement: string | null;
  ParentsBankBalance: number | null;
  AccountHolderName: string | null;
  AccountNumber: string | null;
  IFSCCode: string | null;
  BankName: string | null;
  BranchName: string | null;
  StudentSelfiePath: string | null;
  SSLCMarksCardPath: string | null;
  FeeReceiptPath: string | null;
  BankPassbookPath: string | null;
  AadhaarCardPath: string | null;
}

export interface PucFormat11StudentResponse {
  success: boolean;
  data: PucFormat11StudentDto;
}

export interface PucFormat11DropdownsResponse {
  success: boolean;
  districts: SelectListItemDto[];
  genders: SelectListItemDto[];
  casteCategories: SelectListItemDto[];
  areas: SelectListItemDto[];
  courses: SelectListItemDto[];
  collegeTypes: SelectListItemDto[];
  fatherOccupations: SelectListItemDto[];
  motherOccupations: SelectListItemDto[];
}

export const PUC_FORMAT11_FILE_FIELDS = [
  'StudentSelfie',
  'SSLCMarksCard',
  'FeeReceipts',
  'BankPassbook',
  'AadhaarCard',
] as const;
export type PucFormat11FileField = (typeof PUC_FORMAT11_FILE_FIELDS)[number];

/** Multipart fields for POST /{id}/update — all optional. */
export type PucFormat11UpdateFields = Partial<
  Omit<
    PucFormat11StudentDto,
    | 'StudentId'
    | 'StudentSelfiePath'
    | 'SSLCMarksCardPath'
    | 'FeeReceiptPath'
    | 'BankPassbookPath'
    | 'AadhaarCardPath'
  >
>;

export interface PucFormat11UpdateRequest {
  fields: PucFormat11UpdateFields;
  files?: Partial<Record<PucFormat11FileField, DocumentFile>>;
}

// ============================================================================
// New Professional
// ============================================================================

export interface NewProfessionalStudentDto {
  ApplicationID: number;
  Email: string | null;
  StudentName: string | null;
  DOB: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  ResidentialAddress: string | null;
  GoogleMapLink: string | null;
  AreaTypeID: number | null;
  DistrictID: number | null;
  OtherDistrict: string | null;
  GenderID: number | null;
  CasteCategoryID: number | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupationID: number | null;
  MotherOccupationID: number | null;
  FamilyMembers: number | null;
  HouseTypeID: number | null;
  MonthlyRent: number | null;
  FamilyIncome: number | null;
  PUPercentage: number | null;
  CETRank: number | null;
  NEETRank: number | null;
  CourseApplying: string | null;
  CourseStream: string | null;
  StudentSelfiePath: string | null;
  CETNEETRankSheetPath: string | null;
  DwellingUnitPhotoPath: string | null;
  MarksSheet12Path: string | null;
  RequestLetterPath: string | null;
  HouseVideoPath: string | null;
  ElectricityBillPath: string | null;
  IncomeCertificatePath: string | null;
  RationCardPath: string | null;
}

export interface NewProfessionalStudentResponse {
  success: boolean;
  message: string;
  data: NewProfessionalStudentDto;
}

export interface NewProfessionalDropdownsResponse {
  success: boolean;
  areas: IdNameDto[];
  districts: IdNameDto[];
  genders: IdNameDto[];
  castes: IdNameDto[];
  fatherOccupations: IdNameDto[];
  motherOccupations: IdNameDto[];
  houseTypes: IdNameDto[];
}

export interface NewProfessionalUpdateResponse {
  success: boolean;
  message: string;
  applicationId?: number;
}

export const NEW_PROFESSIONAL_FILE_FIELDS = [
  'StudentSelfie',
  'CETNEETRankSheet',
  'DwellingUnitPhoto',
  'MarksSheet12',
  'RequestLetter',
  'HouseVideo',
  'ElectricityBill',
  'IncomeCertificate',
  'RationCard',
] as const;
export type NewProfessionalFileField = (typeof NEW_PROFESSIONAL_FILE_FIELDS)[number];

export type NewProfessionalUpdateFields = Partial<
  Omit<
    NewProfessionalStudentDto,
    | 'ApplicationID'
    | 'StudentSelfiePath'
    | 'CETNEETRankSheetPath'
    | 'DwellingUnitPhotoPath'
    | 'MarksSheet12Path'
    | 'RequestLetterPath'
    | 'HouseVideoPath'
    | 'ElectricityBillPath'
    | 'IncomeCertificatePath'
    | 'RationCardPath'
  >
>;

/** POST /update — ApplicationID is required and goes in the multipart body. */
export interface NewProfessionalUpdateRequest {
  applicationId: number;
  fields: NewProfessionalUpdateFields;
  files?: Partial<Record<NewProfessionalFileField, DocumentFile>>;
}

// ============================================================================
// Payana
// ============================================================================

export interface PayanaStudentEditDto {
  StudentID: number;
  StudentName: string | null;
  DateOfBirth: string | null;
  GenderID: number | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Email: string | null;
  RAddress: string | null;
  CAddress: string | null;
  Place: string | null;
  Taluka: string | null;
  DistrictID: number | null;
  OtherDistrict: string | null;
  PinCode: string | null;
  AreaTypeID: number | null;
  CasteCategoryID: number | null;
  HouseTypeID: number | null;
  FatherName: string | null;
  MotherName: string | null;
  FatherOccupationID: number | null;
  MotherOccupationID: number | null;
  FamilyMembers: number | null;
  FamilyIncome: number | null;
  ParentBank: number | null;
  CourseID: number | null;
  CollegeName: string | null;
  CollegeTypeID: number | null;
  CollegeCNumber: string | null;
  CourseSA: string | null;
  CourseStream: string | null;
  AnnualFees: number | null;
  TotalExpenses: number | null;
  StudentAchivements: string | null;
  SecuredPercentage: string | null;
  AccountHolderName: string | null;
  BankAccountNumber: string | null;
  IFSCCode: string | null;
  BankName: string | null;
  BranchName: string | null;
  MarksCardPath: string | null;
  BankPassbookPath: string | null;
  StudentPhotoPath: string | null;
  HousePhotoPath: string | null;
  AadharPath: string | null;
  IsAgreed: boolean | null;
  HouseVisitLink: string | null;
}

export interface PayanaStudentEditResponse {
  success: boolean;
  data: PayanaStudentEditDto;
}

export interface PayanaEditDropdownsResponse {
  success: boolean;
  genders: SelectListItemDto[];
  casteCategories: SelectListItemDto[];
  areaTypes: SelectListItemDto[];
  houseTypes: SelectListItemDto[];
  collegeTypes: SelectListItemDto[];
  districts: SelectListItemDto[];
  fatherOccupations: SelectListItemDto[];
  motherOccupations: SelectListItemDto[];
}

/** Multipart file field names for Payana update (same as create). */
export const PAYANA_EDIT_FILE_FIELDS = [
  'latestmarkscard',
  'studentpassbookFP',
  'StudentPhoto',
  'dwellingunit',
  'adharcard',
] as const;
export type PayanaEditFileField = (typeof PAYANA_EDIT_FILE_FIELDS)[number];

export type PayanaUpdateFields = Partial<
  Omit<
    PayanaStudentEditDto,
    | 'StudentID'
    | 'MarksCardPath'
    | 'BankPassbookPath'
    | 'StudentPhotoPath'
    | 'HousePhotoPath'
    | 'AadharPath'
  >
>;

export interface PayanaUpdateRequest {
  fields: PayanaUpdateFields;
  files?: Partial<Record<PayanaEditFileField, DocumentFile>>;
}
