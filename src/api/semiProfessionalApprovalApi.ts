/**
 * Semi Professional Student Approval API
 *
 * Contract: SEMI PROFESSIONAL STUDENT APPROVAL GRID API CONTRACT.md
 * Base Route: /api/semi-professional-student-approval
 *
 * Endpoints:
 *   GET  /api/semi-professional-student-approval/list           → { success, count, data: [...] }
 *   POST /api/semi-professional-student-approval/approve/{id}    → { success, message, ApplicationID, ... }
 *   POST /api/semi-professional-student-approval/reject/{id}     → { success, message, ApplicationID, ... }
 *
 * All endpoints require JWT authentication.
 * Approve/reject use path param {id} and query param ?remarks= (no request body).
 */

import {
    ApprovalListResponse,
    ApprovalMutationResponse,
    ApprovalStudent,
    RawSemiProfessionalApprovalStudent,
} from '@/types/approval';
import api from './client';

const BASE_URL = '/semi-professional-student-approval';

function mapToApprovalStudent(raw: RawSemiProfessionalApprovalStudent): ApprovalStudent {
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
      { label: 'PT Rank', value: raw.PTRank },
      { label: 'Family Income', value: raw.FamilyIncome?.toString() ?? null },
      { label: 'Contact', value: raw.ContactNumber },
    ],
  };
}

export async function getSemiProfessionalApprovalList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const body = response.data as ApprovalListResponse<RawSemiProfessionalApprovalStudent>;
  return (body.data || []).map(mapToApprovalStudent);
}

export async function approveSemiProfessionalStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const queryParams = new URLSearchParams();
  if (remark) {
    queryParams.append('remarks', remark);
  }
  const qs = queryParams.toString();
  const url = `${BASE_URL}/approve/${id}${qs ? `?${qs}` : ''}`;
  const response = await api.post(url);
  return response.data as ApprovalMutationResponse;
}

export async function rejectSemiProfessionalStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const queryParams = new URLSearchParams();
  if (remark) {
    queryParams.append('remarks', remark);
  }
  const qs = queryParams.toString();
  const url = `${BASE_URL}/reject/${id}${qs ? `?${qs}` : ''}`;
  const response = await api.post(url);
  return response.data as ApprovalMutationResponse;
}

export const semiProfessionalApprovalApi = {
  getList: getSemiProfessionalApprovalList,
  approve: approveSemiProfessionalStudent,
  reject: rejectSemiProfessionalStudent,

  queryKeys: {
    list: ['semiProfessionalApproval', 'list'] as const,
  },
};
