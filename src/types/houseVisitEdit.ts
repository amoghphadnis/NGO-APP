/**
 * Types for the House Visit EDIT APIs
 *
 * | Program           | Prefix                                  |
 * |-------------------|-----------------------------------------|
 * | PUC               | /api/editpuc-house-visits               |
 * | Professional      | /api/edit-professional-house-visits     |
 * | Payana            | /api/edit-payana-house-visits           |
 * | Semi Professional | /api/edit-semi-professional-house-visits|
 *
 * Endpoints (all JWT):
 *   GET  {prefix}/{id}          → HouseVisitEditResponse
 *   POST {prefix}/{id}/update   → multipart/form-data, partial update
 */

import { DocumentFile } from './documents';

export type HouseVisitProgram = 'puc' | 'professional' | 'payana' | 'semiProfessional';

export interface HouseVisitFamilyMemberDto {
  FamilyID: number;
  Name: string | null;
  Relation: string | null;
  Age: string | null;
  Education: string | null;
  Occupation: string | null;
  MonthlyIncome: string | null;
}

export interface HouseVisitDto {
  HouseVisitID: number;
  StudentID: number;
  StudentName: string | null;
  CourseInstitution: string | null;
  Address: string | null;
  VisitDate: string | null;
  FieldSupervisorName: string | null;
  PersonsInteracted: string | null;
  HouseType: string | null;
  Ownership: string | null;
  Rooms: string | null;
  Floor: string | null;
  RationCardType: string | null;
  DigitalAccess: string | null;
  LivingCondition: string | null;
  LatestElecBill: string | null;
  ElecUnitsCons: string | null;
  InternetBillCharges: string | null;
  RemarkGeneralLivingCondition: string | null;
  Totalfamily: string | null;
  PrimaryEarning: string | null;
  AverageIncome: string | null;
  OtherLandHoldings: string | null;
  TotalChildrenStudying: string | null;
  AnnualEducationExpense: string | null;
  ScholarshipSupport: string | null;
  GovernmentSchemes: string | null;
  EducationalLoanAmount: string | null;
  OutstandingLoanAmount: string | null;
  MonthlyEMI: string | null;
  HealthVulnerability: string | null;
  HealthVulnerabilityRemarks: string | null;
  Assets: string | null;
  StudentAspiration: string | null;
  ConsentParticipation: string | null;
  Remarks: string | null;
  StudentMotivation: string | null;
  SupervisorJustification: string | null;
  DeclarationConfirmation: string | null;
  DeclarationDate: string | null;
  PrimaryIncomeSource: string | null;
  NatureofIncome: string | null;
  IncomeShocks: string | null;
  AgriculturalLand: string | null;
  WaterSource: string | null;
  CropPattern: string | null;
  AnyOutstandingLoans: string | null;
  Extracurricular: string | null;
  HouseholdVulnerabilityLevel: string | null;
  Recommendation: string | null;
  /** Comma-separated generated file names. */
  Upload: string | null;
  FamilyMembers: HouseVisitFamilyMemberDto[];
  VolunteerApprovalStatus?: string | null;
}

export interface HouseVisitEditResponse {
  success: boolean;
  data: HouseVisitDto;
}

export interface HouseVisitUpdateResponse {
  success: boolean;
  message: string;
  data?: HouseVisitDto;
}

/**
 * Only supplied fields are changed. FamilyMembers updates EXISTING rows only
 * (FamilyID required, > 0); the backend never inserts or deletes members here.
 */
export type HouseVisitUpdateFields = Partial<
  Omit<HouseVisitDto, 'HouseVisitID' | 'StudentID' | 'Upload' | 'FamilyMembers'>
>;

export type HouseVisitFamilyMemberUpdate = { FamilyID: number } & Partial<
  Omit<HouseVisitFamilyMemberDto, 'FamilyID'>
>;

export interface HouseVisitUpdateRequest {
  fields: HouseVisitUpdateFields;
  familyMembers?: HouseVisitFamilyMemberUpdate[];
  /** Appended under multipart field "UploadedFile" (one entry per file). */
  uploadedFiles?: DocumentFile[];
}
