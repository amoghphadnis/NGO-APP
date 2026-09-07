/**
 * House Visit API
 *
 * Endpoints:
 * - POST /api/housevisit/create (multipart/form-data)
 *
 * Features:
 * - Create house visit record with multipart/form-data
 * - Supports all student types (PUC, Professional, Payana)
 */

import { DocumentFile } from '@/types/documents';
import {
    FamilyMemberDto,
    HouseVisitApiResponse,
    HouseVisitMultipartPayload
} from '@/types/houseVisit';
import api from './client';

const BASE_URL = '/housevisit';

/**
 * Appends a string field to FormData only when it is defined.
 */
function appendIfDefined(formData: FormData, key: string, value: string | undefined): void {
  if (value !== undefined) {
    formData.append(key, value);
  }
}

/**
 * Build multipart/form-data payload from house visit form values.
 *
 * Important:
 * - Do NOT set a manual Content-Type header; fetch must generate the boundary.
 * - FamilyMembers is appended as a single JSON string.
 * - HousePhoto is a single image file.
 * - UploadedFile is appended once per file under the same field name.
 * - source is a normal form field, not a query parameter.
 */
export function buildHouseVisitFormData(
  payload: HouseVisitMultipartPayload
): FormData {
  const formData = new FormData();

  // Core identifiers
  formData.append('source', payload.Source);
  formData.append('StudentID', String(payload.StudentID));
  formData.append('StudentName', payload.StudentName);
  formData.append('Address', payload.Address);

  // Basic details
  appendIfDefined(formData, 'CourseInstitution', payload.CourseInstitution);
  appendIfDefined(formData, 'VisitDate', payload.VisitDate);
  appendIfDefined(formData, 'FieldSupervisorName', payload.FieldSupervisorName);
  appendIfDefined(formData, 'PersonsInteracted', payload.PersonsInteracted);

  // Housing & social
  appendIfDefined(formData, 'HouseType', payload.HouseType);
  appendIfDefined(formData, 'Ownership', payload.Ownership);
  appendIfDefined(formData, 'Rooms', payload.Rooms);
  appendIfDefined(formData, 'Floor', payload.Floor);
  appendIfDefined(formData, 'RationCardType', payload.RationCardType);
  appendIfDefined(formData, 'DigitalAccess', payload.DigitalAccess);
  appendIfDefined(formData, 'LivingCondition', payload.LivingCondition);
  appendIfDefined(formData, 'LatestElecBill', payload.LatestElecBill);
  appendIfDefined(formData, 'ElecUnitsCons', payload.ElecUnitsCons);
  appendIfDefined(formData, 'InternetBillCharges', payload.InternetBillCharges);
  appendIfDefined(formData, 'RemarkGeneralLivingCondition', payload.RemarkGeneralLivingCondition);

  // Family members as JSON string
  const familyMembers = (payload.FamilyMembers || []).filter(
    (m: FamilyMemberDto) => m.Name.trim() || m.Relation.trim()
  );
  if (familyMembers.length > 0) {
    formData.append('FamilyMembers', JSON.stringify(familyMembers));
  }

  appendIfDefined(formData, 'Totalfamily', payload.Totalfamily);

  // Income
  appendIfDefined(formData, 'PrimaryIncomeSource', payload.PrimaryIncomeSource);
  appendIfDefined(formData, 'NatureofIncome', payload.NatureofIncome);
  appendIfDefined(formData, 'PrimaryEarning', payload.PrimaryEarning);
  appendIfDefined(formData, 'AverageIncome', payload.AverageIncome);
  appendIfDefined(formData, 'IncomeShocks', payload.IncomeShocks);

  // Land
  appendIfDefined(formData, 'AgriculturalLand', payload.AgriculturalLand);
  appendIfDefined(formData, 'WaterSource', payload.WaterSource);
  appendIfDefined(formData, 'CropPattern', payload.CropPattern);
  appendIfDefined(formData, 'OtherLandHoldings', payload.OtherLandHoldings);

  // Education
  appendIfDefined(formData, 'TotalChildrenStudying', payload.TotalChildrenStudying);
  appendIfDefined(formData, 'AnnualEducationExpense', payload.AnnualEducationExpense);
  appendIfDefined(formData, 'ScholarshipSupport', payload.ScholarshipSupport);
  appendIfDefined(formData, 'GovernmentSchemes', payload.GovernmentSchemes);

  // Debt
  appendIfDefined(formData, 'EducationalLoanAmount', payload.EducationalLoanAmount);
  appendIfDefined(formData, 'AnyOutstandingLoans', payload.AnyOutstandingLoans);
  appendIfDefined(formData, 'OutstandingLoanAmount', payload.OutstandingLoanAmount);
  appendIfDefined(formData, 'MonthlyEMI', payload.MonthlyEMI);

  // Health
  appendIfDefined(formData, 'HealthVulnerability', payload.HealthVulnerability);
  appendIfDefined(formData, 'HealthVulnerabilityRemarks', payload.HealthVulnerabilityRemarks);

  // Assets & development
  appendIfDefined(formData, 'Assets', payload.Assets);
  appendIfDefined(formData, 'Extracurricular', payload.Extracurricular);
  appendIfDefined(formData, 'StudentAspiration', payload.StudentAspiration);
  appendIfDefined(formData, 'ConsentParticipation', payload.ConsentParticipation);
  appendIfDefined(formData, 'Remarks', payload.Remarks);

  // Assessment
  appendIfDefined(formData, 'HouseholdVulnerabilityLevel', payload.HouseholdVulnerabilityLevel);
  appendIfDefined(formData, 'StudentMotivation', payload.StudentMotivation);
  appendIfDefined(formData, 'Recommendation', payload.Recommendation);
  appendIfDefined(formData, 'SupervisorJustification', payload.SupervisorJustification);

  // Declaration
  appendIfDefined(formData, 'DeclarationConfirmation', payload.DeclarationConfirmation);
  appendIfDefined(formData, 'DeclarationDate', payload.DeclarationDate);

  // Approval status
  if (payload.VolunteerApprovalStatus) {
    formData.append('VolunteerApprovalStatus', payload.VolunteerApprovalStatus);
  }

  // House photo (single, jpg/jpeg/png)
  if (payload.HousePhoto) {
    formData.append('HousePhoto', {
      uri: payload.HousePhoto.uri,
      name: payload.HousePhoto.name,
      type: payload.HousePhoto.type,
    } as any);
  }

  // Supporting documents (multiple, any file type)
  (payload.UploadedFiles || []).forEach((file: DocumentFile) => {
    formData.append('UploadedFile', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
  });

  return formData;
}

/**
 * Create a house visit record with full form data as multipart/form-data.
 *
 * @param payload - Complete house visit form data
 * @returns Created house visit confirmation
 *
 * Session Requirements:
 * - User must be authenticated
 * - Volunteer can only create for assigned students
 */
export async function createHouseVisit(
  payload: HouseVisitMultipartPayload
): Promise<HouseVisitApiResponse> {
  const url = `${BASE_URL}/create`;
  const formData = buildHouseVisitFormData(payload);

  const response = await api.post(url, formData);

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
    houseVisitId: response.data?.houseVisitID ?? response.data?.houseVisitId,
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
  buildFormData: buildHouseVisitFormData,
};
