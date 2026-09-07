/**
 * House Visit Approval API Contract Types
 *
 * Used by the four House Visit Grid approval screens (PUC, Professional,
 * Payana, Semi-Professional). Each program's raw API response is mapped to
 * the common HouseVisitApprovalItem interface by its respective API client.
 *
 * Contracts:
 *   PUC:               /api/puc-housevisits-grid
 *   Professional:      /api/professional-house-visits
 *   Payana:            /api/payana-house-visit-grid
 *   Semi-Professional: /api/semi-professional-house-visits
 *
 * Architectural distinction (DO NOT collapse):
 *   ApproveStatus           — Manager decision (Pending | Approved | Rejected)
 *                             Set via the grid approve/reject endpoints.
 *   VolunteerApprovalStatus — Volunteer recommendation (Pending | Selected | Rejected)
 *                             Submitted during house visit creation/edit.
 *   RejectionRemark         — Manager's remark stored by approve/reject endpoints.
 *
 * The manager approve/reject endpoints ONLY modify ApproveStatus and
 * RejectionRemark. They never touch VolunteerApprovalStatus.
 */

import { ApprovalStatus } from './approval';

/** The four programs with House Visit Grid approval endpoints. */
export type HouseVisitApprovalProgram =
  | 'puc'
  | 'professional'
  | 'payana'
  | 'semiProfessional';

/** Volunteer recommendation status (distinct from manager ApproveStatus). */
export type VolunteerApprovalStatusValue =
  | 'Pending'
  | 'Selected'
  | 'Rejected'
  | string;

/**
 * Normalized house visit item used by the approval screen.
 *
 * The `id` field is the HouseVisitID — this is what the approve/reject
 * endpoints expect as the path parameter.
 */
export interface HouseVisitApprovalItem {
  /** HouseVisitID — used for approve/reject/delete calls. */
  id: number;
  /** Underlying student ID (PUC_StudentID / ApplicationID / StudentID). */
  studentId: number;
  studentName: string;
  district: string | null;
  courseInstitution: string | null;
  visitDate: string | null;
  fieldSupervisorName: string | null;
  /** Manager decision: Pending | Approved | Rejected. */
  approveStatus: ApprovalStatus;
  /** Volunteer recommendation: Pending | Selected | Rejected. */
  volunteerApprovalStatus: VolunteerApprovalStatusValue | null;
  /** Manager's remark from approve/reject. */
  rejectionRemark: string | null;
  /** Program-specific info rows for the card body. */
  infoRows: { label: string; value: string | null }[];
}

/** Generic list response wrapper used by all four programs. */
export interface HouseVisitApprovalListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

/** Generic approve/reject response. */
export interface HouseVisitApprovalMutationResponse {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

/** Request body for approve/reject endpoints (all four programs). */
export interface HouseVisitStatusRequest {
  Remark: string;
}

/** Family member sub-DTO (present in all four programs). */
export interface HouseVisitFamilyMemberDto {
  FamilyID: number;
  HouseVisitID: number;
  StudentID: number;
  Name: string | null;
  Relation: string | null;
  Age: string | null;
  Education: string | null;
  Occupation: string | null;
  MonthlyIncome: string | null;
}

// ── Raw DTOs (match backend JSON exactly) ──────────────────────────────

/**
 * Raw row from GET /api/puc-housevisits-grid/list
 *
 * PUC is the only program with Place, Taluka, PinCode, HouseVisitLink,
 * and a dedicated GET /{id} endpoint.
 */
export interface RawPucHouseVisitApproval {
  HouseVisitID: number;
  StudentID: number;
  StudentName: string | null;
  CourseInstitution: string | null;
  Address: string | null;
  Place: string | null;
  District: string | null;
  DistrictName: string | null;
  Taluka: string | null;
  PinCode: string | null;
  HouseVisitLink: string | null;
  VisitDate: string | null;
  FieldSupervisorName: string | null;
  PersonsInteracted: string | null;
  HouseType: string | null;
  Ownership: string | null;
  Rooms: string | null;
  Floor: string | null;
  LatestElecBill: string | null;
  ElecUnitsCons: string | null;
  InternetBillCharges: string | null;
  RemarkGeneralLivingCondition: string | null;
  RationCardType: string | null;
  DigitalAccess: string | null;
  LivingCondition: string | null;
  Totalfamily: string | null;
  PrimaryIncomeSource: string | null;
  NatureofIncome: string | null;
  AverageIncome: number | null;
  PrimaryEarning: string | null;
  IncomeShocks: string | null;
  AgriculturalLand: string | null;
  WaterSource: string | null;
  CropPattern: string | null;
  OtherLandHoldings: string | null;
  TotalChildrenStudying: string | null;
  AnnualEducationExpense: string | null;
  ScholarshipSupport: string | null;
  GovernmentSchemes: string | null;
  EducationalLoanAmount: string | null;
  AnyOutstandingLoans: string | null;
  OutstandingLoanAmount: string | null;
  MonthlyEMI: string | null;
  HealthVulnerability: string | null;
  HealthVulnerabilityRemarks: string | null;
  Assets: string | null;
  Extracurricular: string | null;
  ConsentParticipation: string | null;
  StudentAspiration: string | null;
  StudentMotivation: string | null;
  HouseholdVulnerabilityLevel: string | null;
  Recommendation: string | null;
  SupervisorJustification: string | null;
  DeclarationConfirmation: string | null;
  DeclarationDate: string | null;
  Upload: string | null;
  ApproveStatus: ApprovalStatus;
  RejectionRemark: string | null;
  VolunteerApprovalStatus: string | null;
  FamilyMembers: HouseVisitFamilyMemberDto[];
}

/**
 * Raw row from GET /api/professional-house-visits/list
 *
 * Professional DTO maps family-member-style fields (Name, Relation, Age,
 * Education, Occupation, MonthlyIncome) directly from the main record, plus
 * a separate Remarks field (distinct from RemarkGeneralLivingCondition).
 */
export interface RawProfessionalHouseVisitApproval {
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
  Name: string | null;
  Relation: string | null;
  Age: string | null;
  Education: string | null;
  Occupation: string | null;
  MonthlyIncome: string | null;
  Totalfamily: string | null;
  PrimaryIncomeSource: string | null;
  NatureofIncome: string | null;
  AverageIncome: number | null;
  PrimaryEarning: string | null;
  IncomeShocks: string | null;
  AgriculturalLand: string | null;
  WaterSource: string | null;
  CropPattern: string | null;
  OtherLandHoldings: string | null;
  TotalChildrenStudying: string | null;
  AnnualEducationExpense: string | null;
  ScholarshipSupport: string | null;
  GovernmentSchemes: string | null;
  EducationalLoanAmount: string | null;
  AnyOutstandingLoans: string | null;
  OutstandingLoanAmount: string | null;
  MonthlyEMI: string | null;
  HealthVulnerability: string | null;
  HealthVulnerabilityRemarks: string | null;
  Assets: string | null;
  Extracurricular: string | null;
  ConsentParticipation: string | null;
  StudentAspiration: string | null;
  StudentMotivation: string | null;
  HouseholdVulnerabilityLevel: string | null;
  Recommendation: string | null;
  SupervisorJustification: string | null;
  Remarks: string | null;
  DeclarationConfirmation: string | null;
  DeclarationDate: string | null;
  Upload: string | null;
  ApproveStatus: ApprovalStatus;
  RejectionRemark: string | null;
  VolunteerApprovalStatus: string | null;
  FamilyMembers: HouseVisitFamilyMemberDto[];
}

/**
 * Raw row from GET /api/payana-house-visit-grid/list
 *
 * Payana does not expose Place, Taluka, PinCode, or HouseVisitLink.
 */
export interface RawPayanaHouseVisitApproval {
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
  LatestElecBill: string | null;
  ElecUnitsCons: string | null;
  InternetBillCharges: string | null;
  RemarkGeneralLivingCondition: string | null;
  RationCardType: string | null;
  DigitalAccess: string | null;
  LivingCondition: string | null;
  Name: string | null;
  Relation: string | null;
  Age: string | null;
  Education: string | null;
  Occupation: string | null;
  MonthlyIncome: string | null;
  Totalfamily: string | null;
  PrimaryIncomeSource: string | null;
  NatureofIncome: string | null;
  AverageIncome: number | null;
  PrimaryEarning: string | null;
  IncomeShocks: string | null;
  AgriculturalLand: string | null;
  WaterSource: string | null;
  CropPattern: string | null;
  OtherLandHoldings: string | null;
  TotalChildrenStudying: string | null;
  AnnualEducationExpense: string | null;
  ScholarshipSupport: string | null;
  GovernmentSchemes: string | null;
  EducationalLoanAmount: string | null;
  AnyOutstandingLoans: string | null;
  OutstandingLoanAmount: string | null;
  MonthlyEMI: string | null;
  HealthVulnerability: string | null;
  HealthVulnerabilityRemarks: string | null;
  Assets: string | null;
  Extracurricular: string | null;
  ConsentParticipation: string | null;
  StudentAspiration: string | null;
  StudentMotivation: string | null;
  HouseholdVulnerabilityLevel: string | null;
  Recommendation: string | null;
  SupervisorJustification: string | null;
  DeclarationConfirmation: string | null;
  DeclarationDate: string | null;
  ApproveStatus: ApprovalStatus;
  RejectionRemark: string | null;
  VolunteerApprovalStatus: string | null;
  Upload: string | null;
  FamilyMembers: HouseVisitFamilyMemberDto[];
}

/**
 * Raw row from GET /api/semi-professional-house-visits/list
 *
 * Semi-Professional exposes DistrictName (like PUC) but not Place, Taluka,
 * PinCode, or HouseVisitLink. Has Remarks field (like Professional).
 */
export interface RawSemiProfessionalHouseVisitApproval {
  HouseVisitID: number;
  StudentID: number;
  DistrictName: string | null;
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
  Name: string | null;
  Relation: string | null;
  Age: string | null;
  Education: string | null;
  Occupation: string | null;
  MonthlyIncome: string | null;
  Totalfamily: string | null;
  PrimaryIncomeSource: string | null;
  NatureofIncome: string | null;
  AverageIncome: number | null;
  PrimaryEarning: string | null;
  IncomeShocks: string | null;
  AgriculturalLand: string | null;
  WaterSource: string | null;
  CropPattern: string | null;
  OtherLandHoldings: string | null;
  TotalChildrenStudying: string | null;
  AnnualEducationExpense: string | null;
  ScholarshipSupport: string | null;
  GovernmentSchemes: string | null;
  EducationalLoanAmount: string | null;
  AnyOutstandingLoans: string | null;
  OutstandingLoanAmount: string | null;
  MonthlyEMI: string | null;
  HealthVulnerability: string | null;
  HealthVulnerabilityRemarks: string | null;
  Assets: string | null;
  Extracurricular: string | null;
  ConsentParticipation: string | null;
  StudentAspiration: string | null;
  StudentMotivation: string | null;
  HouseholdVulnerabilityLevel: string | null;
  Recommendation: string | null;
  SupervisorJustification: string | null;
  Remarks: string | null;
  DeclarationConfirmation: string | null;
  DeclarationDate: string | null;
  Upload: string | null;
  ApproveStatus: ApprovalStatus;
  RejectionRemark: string | null;
  VolunteerApprovalStatus: string | null;
  FamilyMembers: HouseVisitFamilyMemberDto[];
}
