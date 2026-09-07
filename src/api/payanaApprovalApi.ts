/**
 * Payana Student Approval API
 *
 * Contract: PAYANA STUDENT GRID API CONTRACT.md
 * Base Route: /api/payana-student-grid
 *
 * Endpoints:
 *   GET  /api/payana-student-grid/list           → { success, count, data: [...] }
 *   POST /api/payana-student-grid/approve/{id}   → { success, message }
 *   POST /api/payana-student-grid/reject/{id}    → { success, message }
 *
 * All endpoints require JWT authentication.
 * Approve/reject use path param {id} and request body { Remark }.
 */

import {
    ApprovalListResponse,
    ApprovalMutationResponse,
    ApprovalStudent,
    RawPayanaApprovalStudent,
} from '@/types/approval';
import api from './client';

const BASE_URL = '/payana-student-grid';

function mapToApprovalStudent(raw: RawPayanaApprovalStudent): ApprovalStudent {
  return {
    id: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    email: raw.Email,
    contactNumber: raw.ContactNumber,
    district: raw.OtherDistrict || raw.DistrictName,
    approvalStatus: raw.ApproveStatus,
    remark: raw.Remark,
    infoRows: [
      { label: 'District', value: raw.OtherDistrict || raw.DistrictName },
      { label: 'College', value: raw.CollegeName },
      { label: 'Course', value: raw.CourseSA },
      { label: 'Stream', value: raw.CourseStream },
      { label: 'Secured %', value: raw.SecuredPercentage?.toString() ?? null },
      { label: 'Annual Fees', value: raw.AnnualFees?.toString() ?? null },
      { label: 'Family Income', value: raw.FamilyIncome?.toString() ?? null },
      { label: 'Contact', value: raw.ContactNumber },
    ],
  };
}

export async function getPayanaApprovalList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const body = response.data as ApprovalListResponse<RawPayanaApprovalStudent>;
  return (body.data || []).map(mapToApprovalStudent);
}

export async function approvePayanaStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/approve/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export async function rejectPayanaStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/reject/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export const payanaApprovalApi = {
  getList: getPayanaApprovalList,
  approve: approvePayanaStudent,
  reject: rejectPayanaStudent,

  queryKeys: {
    list: ['payanaApproval', 'list'] as const,
  },
};
