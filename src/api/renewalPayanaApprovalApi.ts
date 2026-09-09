/**
 * Payana Renewal Approval API
 *
 * Contract: PAYANA RENEWAL API CONTRACT.md
 * Base Route: /api/payana-renewal
 *
 * Endpoints:
 *   GET  /api/payana-renewal/list           → renewal list
 *   PUT  /api/payana-renewal/approve/{id}   → approve with remark
 *   PUT  /api/payana-renewal/reject/{id}    → reject with remark
 *
 * All endpoints require JWT authentication.
 */

import api from './client';
import { ApprovalStudent } from '@/types/approval';

const BASE_URL = '/payana-renewal';

interface RawRenewalPayanaStudent {
  PayanaRenewalId: number;
  EmailId: string | null;
  StudentName: string | null;
  District: number | null;
  DistrictName: string | null;
  Taluk: string | null;
  PayanaId: string | null;
  PrimaryNumber: string | null;
  CollegeName: string | null;
  CollegeTypeName: string | null;
  CourseS: string | null;
  CourseStream: string | null;
  ApproveStatus: string;
  Remark: string | null;
}

function mapToApprovalStudent(raw: RawRenewalPayanaStudent): ApprovalStudent {
  return {
    id: raw.PayanaRenewalId,
    studentName: raw.StudentName || 'Unknown',
    email: raw.EmailId,
    contactNumber: raw.PrimaryNumber || null,
    district: raw.DistrictName,
    approvalStatus: raw.ApproveStatus || 'Pending',
    remark: raw.Remark,
    infoRows: [
      { label: 'Payana ID', value: raw.PayanaId },
      { label: 'District', value: raw.DistrictName },
      { label: 'College', value: raw.CollegeName },
      { label: 'College Type', value: raw.CollegeTypeName },
      { label: 'Course', value: raw.CourseS },
      { label: 'Stream', value: raw.CourseStream },
    ],
  };
}

async function getList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const data = response.data;
  const rows: RawRenewalPayanaStudent[] = data.data || data || [];
  return rows.map(mapToApprovalStudent);
}

async function approve(id: number, remark?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`${BASE_URL}/approve/${id}`, { Remark: remark || '' });
  return {
    success: response.data.success ?? response.data.Success ?? true,
    message: response.data.message ?? response.data.Message ?? 'Approved',
  };
}

async function reject(id: number, remark?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`${BASE_URL}/reject/${id}`, { Remark: remark || '' });
  return {
    success: response.data.success ?? response.data.Success ?? true,
    message: response.data.message ?? response.data.Message ?? 'Rejected',
  };
}

export const renewalPayanaApprovalApi = {
  getList,
  approve,
  reject,
  queryKey: ['renewalPayanaApproval', 'list'] as const,
  invalidatePrefix: 'renewalPayanaApproval',
};
