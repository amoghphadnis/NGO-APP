/**
 * Professional Student Approval API (New)
 *
 * Contract: NEW PROFESSIONAL APPROVAL GRID API CONTRACT.md
 * Base Route: /api/new-professional-approval
 *
 * Endpoints:
 *   GET  /api/new-professional-approval/list          → { success, count, data: [...] }
 *   POST /api/new-professional-approval/approve/{id}   → { success, message, applicationId, ... }
 *   POST /api/new-professional-approval/reject/{id}    → { success, message, applicationId, ... }
 *
 * All endpoints require JWT authentication.
 * Approve/reject use path param {id} and request body { Remark }.
 */

import {
    ApprovalListResponse,
    ApprovalMutationResponse,
    ApprovalStudent,
    RawProfessionalApprovalStudent,
} from '@/types/approval';
import api from './client';

const BASE_URL = '/new-professional-approval';

function mapToApprovalStudent(raw: RawProfessionalApprovalStudent): ApprovalStudent {
  return {
    id: raw.ApplicationID,
    studentName: raw.StudentName || 'Unknown',
    email: raw.Email,
    contactNumber: raw.ContactNumber,
    district: raw.OtherDistrict || raw.DistrictName,
    approvalStatus: raw.ApproveStatus,
    remark: raw.Remark,
    infoRows: [
      { label: 'District', value: raw.OtherDistrict || raw.DistrictName },
      { label: 'Course', value: raw.CourseApplying },
      { label: 'Stream', value: raw.CourseStream },
      { label: 'PU %', value: raw.PUPercentage?.toString() ?? null },
      { label: 'CET Rank', value: raw.CETRank },
      { label: 'NEET Rank', value: raw.NEETRank },
      { label: 'Family Income', value: raw.FamilyIncome?.toString() ?? null },
      { label: 'Contact', value: raw.ContactNumber },
    ],
  };
}

export async function getProfessionalApprovalList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const body = response.data as ApprovalListResponse<RawProfessionalApprovalStudent>;
  return (body.data || []).map(mapToApprovalStudent);
}

export async function approveProfessionalStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/approve/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export async function rejectProfessionalStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/reject/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export const professionalApprovalApi = {
  getList: getProfessionalApprovalList,
  approve: approveProfessionalStudent,
  reject: rejectProfessionalStudent,

  queryKeys: {
    list: ['professionalApproval', 'list'] as const,
  },
};
