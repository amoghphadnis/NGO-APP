/**
 * House Visit API
 *
 * Endpoints:
 * - POST /api/housevisit/create
 *
 * Features:
 * - Create house visit record with multipart/form-data
 * - Supports all student types (PUC, Professional, Payana)
 */

import { HouseVisitApiResponse, HouseVisitCreatePayload } from '@/types/houseVisit';
import api from './client';

const BASE_URL = '/housevisit';

/**
 * Build FormData from house visit payload
 */
function buildHouseVisitPayload(payload: HouseVisitCreatePayload): any {
  return {
    StudentID: payload.StudentID,
    Source: payload.Source,
    StudentName: payload.StudentName,
    CourseInstitution: payload.CourseInstitution || '',
    Address: payload.Address,
    VisitDate: payload.VisitDate,
    FieldSupervisorName: payload.FieldSupervisorName || '',
    PersonsInteracted: payload.PersonsInteracted || '',
    HouseType: payload.HouseType,
    Ownership: payload.Ownership,
    Rooms: payload.Rooms,
    Floor: payload.Floor,
    RationCardType: payload.RationCardType,
    DigitalAccess: payload.DigitalAccess,
    LivingCondition: payload.LivingCondition,
    LatestElecBill: payload.LatestElecBill || '',
    ElecUnitsCons: payload.ElecUnitsCons || '',
    InternetBillCharges: payload.InternetBillCharges || '',
    RemarkGeneralLivingCondition: payload.RemarkGeneralLivingCondition || '',
    FamilyMembers: payload.FamilyMembers,
    Totalfamily: payload.Totalfamily || '',
    PrimaryIncomeSource: payload.PrimaryIncomeSource,
    NatureofIncome: payload.NatureofIncome,
    PrimaryEarning: payload.PrimaryEarning || '',
    AverageIncome: payload.AverageIncome || '',
    IncomeShocks: payload.IncomeShocks,
    AgriculturalLand: payload.AgriculturalLand,
    WaterSource: payload.WaterSource,
    CropPattern: payload.CropPattern,
    OtherLandHoldings: payload.OtherLandHoldings || '',
    TotalChildrenStudying: payload.TotalChildrenStudying || '',
    AnnualEducationExpense: payload.AnnualEducationExpense || '',
    ScholarshipSupport: payload.ScholarshipSupport,
    GovernmentSchemes: payload.GovernmentSchemes || '',
    EducationalLoanAmount: payload.EducationalLoanAmount || '',
    AnyOutstandingLoans: payload.AnyOutstandingLoans,
    OutstandingLoanAmount: payload.OutstandingLoanAmount || '',
    MonthlyEMI: payload.MonthlyEMI || '',
    HealthVulnerability: payload.HealthVulnerability,
    HealthVulnerabilityRemarks: payload.HealthVulnerabilityRemarks || '',
    Assets: payload.Assets,
    Extracurricular: payload.Extracurricular,
    StudentAspiration: payload.StudentAspiration || '',
    ConsentParticipation: payload.ConsentParticipation,
    Remarks: payload.Remarks || '',
    HouseholdVulnerabilityLevel: payload.HouseholdVulnerabilityLevel,
    StudentMotivation: payload.StudentMotivation,
    Recommendation: payload.Recommendation,
    SupervisorJustification: payload.SupervisorJustification || '',
    DeclarationConfirmation: payload.DeclarationConfirmation,
    DeclarationDate: payload.DeclarationDate,
  };
}

/**
 * Create a house visit record with full form data
 *
 * @param payload - Complete house visit form data
 * @param files - Optional array of uploaded files
 * @returns Created house visit confirmation
 *
 * Session Requirements:
 * - User must be authenticated
 * - Volunteer can only create for assigned students
 */
export async function createHouseVisit(
  payload: HouseVisitCreatePayload,
): Promise<HouseVisitApiResponse> {
  const url = `${BASE_URL}/create?source=${payload.Source}`;

  const body = buildHouseVisitPayload(payload);

  const response = await api.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: response.data?.message || 'Failed to create house visit',
      errors: response.data?.errors,
    };
  }

  return {
    success: true,
    message: response.data?.message || 'House visit created successfully',
    houseVisitId: response.data?.houseVisitId,
  };
}

/**
 * Generate house visit link for navigation
 */
export function getHouseVisitLink(
  studentId: number,
  source: 'professional' | 'puc' | 'payana' | 'semiProfessional',
  studentName?: string
): string {
  const encodedName = studentName ? encodeURIComponent(studentName) : '';
  return `/housevisit/create?studentId=${studentId}&source=${source}&studentName=${encodedName}`;
}

/**
 * Hook-compatible wrapper
 */
export const houseVisitApi = {
  create: createHouseVisit,
  getLink: getHouseVisitLink,
};
