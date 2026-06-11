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

import api from './client';
import { HouseVisitCreatePayload, HouseVisitApiResponse } from '@/types/houseVisit';

const BASE_URL = '/api/housevisit';

/**
 * Build FormData from house visit payload
 */
function buildHouseVisitFormData(payload: HouseVisitCreatePayload, files?: File[]): FormData {
  const formData = new FormData();

  // Add all text fields
  formData.append('StudentID', payload.StudentID.toString());
  formData.append('Source', payload.Source);
  formData.append('StudentName', payload.StudentName);
  formData.append('CourseInstitution', payload.CourseInstitution || '');
  formData.append('Address', payload.Address);
  formData.append('VisitDate', payload.VisitDate);
  formData.append('FieldSupervisorName', payload.FieldSupervisorName || '');
  formData.append('PersonsInteracted', payload.PersonsInteracted || '');

  // Housing conditions (comma-separated for arrays)
  formData.append('HouseType', payload.HouseType);
  formData.append('Ownership', payload.Ownership);
  formData.append('Rooms', payload.Rooms);
  formData.append('Floor', payload.Floor);

  // Social data
  formData.append('RationCardType', payload.RationCardType);
  formData.append('DigitalAccess', payload.DigitalAccess);
  formData.append('LivingCondition', payload.LivingCondition);
  formData.append('LatestElecBill', payload.LatestElecBill || '');
  formData.append('ElecUnitsCons', payload.ElecUnitsCons || '');
  formData.append('InternetBillCharges', payload.InternetBillCharges || '');
  formData.append('RemarkGeneralLivingCondition', payload.RemarkGeneralLivingCondition || '');

  // Family members as JSON string
  formData.append('FamilyMembers', JSON.stringify(payload.FamilyMembers));
  formData.append('Totalfamily', payload.Totalfamily || '');

  // Income stability
  formData.append('PrimaryIncomeSource', payload.PrimaryIncomeSource);
  formData.append('NatureofIncome', payload.NatureofIncome);
  formData.append('PrimaryEarning', payload.PrimaryEarning || '');
  formData.append('AverageIncome', payload.AverageIncome || '');
  formData.append('IncomeShocks', payload.IncomeShocks);

  // Land holdings
  formData.append('AgriculturalLand', payload.AgriculturalLand);
  formData.append('WaterSource', payload.WaterSource);
  formData.append('CropPattern', payload.CropPattern);
  formData.append('OtherLandHoldings', payload.OtherLandHoldings || '');

  // Educational expenses
  formData.append('TotalChildrenStudying', payload.TotalChildrenStudying || '');
  formData.append('AnnualEducationExpense', payload.AnnualEducationExpense || '');
  formData.append('ScholarshipSupport', payload.ScholarshipSupport);
  formData.append('GovernmentSchemes', payload.GovernmentSchemes || '');

  // Debt & financial
  formData.append('EducationalLoanAmount', payload.EducationalLoanAmount || '');
  formData.append('AnyOutstandingLoans', payload.AnyOutstandingLoans);
  formData.append('OutstandingLoanAmount', payload.OutstandingLoanAmount || '');
  formData.append('MonthlyEMI', payload.MonthlyEMI || '');

  // Health vulnerability
  formData.append('HealthVulnerability', payload.HealthVulnerability);
  formData.append('HealthVulnerabilityRemarks', payload.HealthVulnerabilityRemarks || '');

  // Assets
  formData.append('Assets', payload.Assets);

  // Student development
  formData.append('Extracurricular', payload.Extracurricular);
  formData.append('StudentAspiration', payload.StudentAspiration || '');
  formData.append('ConsentParticipation', payload.ConsentParticipation);
  formData.append('Remarks', payload.Remarks || '');

  // Supervisor assessment
  formData.append('HouseholdVulnerabilityLevel', payload.HouseholdVulnerabilityLevel);
  formData.append('StudentMotivation', payload.StudentMotivation);
  formData.append('Recommendation', payload.Recommendation);
  formData.append('SupervisorJustification', payload.SupervisorJustification || '');

  // Declaration
  formData.append('DeclarationConfirmation', payload.DeclarationConfirmation);
  formData.append('DeclarationDate', payload.DeclarationDate);

  // Add files if provided
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`UploadedFile_${index}`, file);
    });
  }

  return formData;
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
  files?: File[]
): Promise<HouseVisitApiResponse> {
  const url = `${BASE_URL}/create`;

  const formData = buildHouseVisitFormData(payload, files);

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
  source: 'professional' | 'puc' | 'payana',
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
