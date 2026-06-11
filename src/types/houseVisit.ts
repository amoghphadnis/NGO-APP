/**
 * Types for House Visit Form
 * Sections A-L covering comprehensive household assessment
 */

// ============================================================================
// Section A: Basic Details
// ============================================================================

export interface HouseVisitBasicDetails {
  studentID: number;
  source: 'PUC' | 'Professional' | 'Payana';
  studentName: string;
  courseInstitution: string;
  address: string;
  visitDate: string;
  fieldSupervisorName: string;
  personsInteracted: string;
}

// ============================================================================
// Section B: Housing & Living Conditions
// ============================================================================

export interface HousingConditions {
  houseType: ('Kutcha' | 'Semi-Pucca' | 'Pucca')[];
  ownership: ('Own' | 'Rented' | "Relative's" | 'Government Housing')[];
  rooms: ('1' | '2' | 'More than 3')[];
  floor: ('Ground' | '1' | '2' | '3+')[];
}

// ============================================================================
// Social Data
// ============================================================================

export interface SocialData {
  rationCardType: 'BPL' | 'PHH' | 'NPHH' | 'APL' | '';
  digitalAccess: 'Smartphone' | 'Keypad' | 'iPhone' | 'Laptop / Tablet' | '';
  livingCondition: ('Poor' | 'Average' | 'Satisfactory')[];
  latestElecBill: string;
  elecUnitsCons: string;
  internetBillCharges: string;
  remarkGeneralLivingCondition: string;
}

// ============================================================================
// Section C: Family Composition
// ============================================================================

export interface FamilyMember {
  name: string;
  relation: string;
  age: string;
  education: string;
  occupation: string;
  monthlyIncome: string;
}

export interface FamilyComposition {
  members: FamilyMember[];
  totalFamilyMembers: string;
}

// ============================================================================
// Section D: Income Stability & Livelihood
// ============================================================================

export interface IncomeStability {
  primaryIncomeSource: ('Daily Wage' | 'Agriculture' | 'Private Job' | 'Self-Employed' | 'Pension')[];
  natureOfIncome: ('Regular' | 'Irregular' | 'Seasonal')[];
  primaryEarningPerson: string;
  averageIncome: string;
  incomeShocks: ('Job Loss' | 'Crop Failure' | 'Health Emergency')[];
}

// ============================================================================
// Section E: Land & Other Holdings
// ============================================================================

export interface LandHoldings {
  agriculturalLand: ('Dry Land' | 'Irrigated Land' | 'Farm')[];
  waterSource: ('Rainwater' | 'Borewell' | 'Canal' | 'Other')[];
  cropPattern: ('Rabi' | 'Kharif' | 'Summer')[];
  otherLandHoldings: string;
}

// ============================================================================
// Section F: Educational Expenses
// ============================================================================

export interface EducationalExpenses {
  totalChildrenStudying: string;
  annualEducationExpense: string;
  scholarshipSupport: 'Yes' | 'No' | '';
  governmentSchemes: string;
}

// ============================================================================
// Section G: Debt & Financial Stress
// ============================================================================

export interface DebtFinancial {
  educationalLoanAmount: string;
  outstandingLoans: ('Bank' | 'SHG' | 'Private' | 'Moneylender')[];
  outstandingLoanAmount: string;
  monthlyEMI: string;
}

// ============================================================================
// Section H: Health & Social Vulnerability
// ============================================================================

export interface HealthVulnerability {
  vulnerabilityType: 'Chronic Illness' | 'Disability' | 'Single Parent Household' | 'Orphan / Guardian-led Family' | 'Elderly Dependents' | '';
  remarks: string;
}

// ============================================================================
// Section I: Assets & Digital Learning Access
// ============================================================================

export interface Assets {
  assets: ('Tractor' | 'Car' | 'Livestock' | 'Two-wheeler' | 'Other')[];
}

// ============================================================================
// Section J: Student Development & Participation
// ============================================================================

export interface StudentDevelopment {
  extracurricular: ('Sports' | 'NSS' | 'NMMS Exam' | 'Dance' | 'Debate' | 'Music' | 'Other' | 'No Participation')[];
  studentAspiration: string;
  consentParticipation: 'Yes' | 'No' | '';
  remarks: string;
}

// ============================================================================
// Section K: Supervisor's Assessment
// ============================================================================

export interface SupervisorAssessment {
  householdVulnerabilityLevel: ('High' | 'Moderate' | 'Low')[];
  studentMotivation: 'High' | 'Average' | 'Needs Support' | '';
  recommendation: ('Strongly Recommended' | 'Recommended' | 'Not Recommended')[];
  justification: string;
}

// ============================================================================
// Section L: Declaration
// ============================================================================

export interface Declaration {
  confirmation: string;
  date: string;
  uploadedFiles: File[];
}

// ============================================================================
// Complete House Visit Form Data
// ============================================================================

export interface HouseVisitFormData {
  basicDetails: HouseVisitBasicDetails;
  housingConditions: HousingConditions;
  socialData: SocialData;
  familyComposition: FamilyComposition;
  incomeStability: IncomeStability;
  landHoldings: LandHoldings;
  educationalExpenses: EducationalExpenses;
  debtFinancial: DebtFinancial;
  healthVulnerability: HealthVulnerability;
  assets: Assets;
  studentDevelopment: StudentDevelopment;
  supervisorAssessment: SupervisorAssessment;
  declaration: Declaration;
}

// ============================================================================
// API Types
// ============================================================================

export interface HouseVisitCreatePayload {
  StudentID: number;
  Source: string;
  StudentName: string;
  CourseInstitution: string;
  Address: string;
  VisitDate: string;
  FieldSupervisorName: string;
  PersonsInteracted: string;
  HouseType: string;
  Ownership: string;
  Rooms: string;
  Floor: string;
  RationCardType: string;
  DigitalAccess: string;
  LivingCondition: string;
  LatestElecBill: string;
  ElecUnitsCons: string;
  InternetBillCharges: string;
  RemarkGeneralLivingCondition: string;
  FamilyMembers: FamilyMemberDto[];
  Totalfamily: string;
  PrimaryIncomeSource: string;
  NatureofIncome: string;
  PrimaryEarning: string;
  AverageIncome: string;
  IncomeShocks: string;
  AgriculturalLand: string;
  WaterSource: string;
  CropPattern: string;
  OtherLandHoldings: string;
  TotalChildrenStudying: string;
  AnnualEducationExpense: string;
  ScholarshipSupport: string;
  GovernmentSchemes: string;
  EducationalLoanAmount: string;
  AnyOutstandingLoans: string;
  OutstandingLoanAmount: string;
  MonthlyEMI: string;
  HealthVulnerability: string;
  HealthVulnerabilityRemarks: string;
  Assets: string;
  Extracurricular: string;
  StudentAspiration: string;
  ConsentParticipation: string;
  Remarks: string;
  HouseholdVulnerabilityLevel: string;
  StudentMotivation: string;
  Recommendation: string;
  SupervisorJustification: string;
  DeclarationConfirmation: string;
  DeclarationDate: string;
}

export interface FamilyMemberDto {
  Name: string;
  Relation: string;
  Age: string;
  Education: string;
  Occupation: string;
  MonthlyIncome: string;
}

export interface HouseVisitApiResponse {
  success: boolean;
  message: string;
  houseVisitId?: number;
  errors?: string[];
}

// ============================================================================
// Route Params
// ============================================================================

export interface HouseVisitRouteParams {
  studentId: string;
  source: 'puc' | 'professional' | 'payana';
}
