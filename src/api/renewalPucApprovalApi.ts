/**
 * PUC Renewal Approval API
 *
 * Contract: RENEVAL PUC API CONTRACT.md
 * Base Route: /api/renewalpuc
 *
 * Endpoints:
 *   GET   /api/renewalpuc/list           → renewal list
 *   POST  /api/renewalpuc/approve/{id}   → approve with remark
 *   POST  /api/renewalpuc/reject/{id}    → reject with remark
 *
 * All endpoints require JWT authentication.
 */

import api from './client';
import { ApprovalStudent } from '@/types/approval';

const BASE_URL = '/renewalpuc';

interface RawRenewalPucStudent {
  Id: number;
  ApplicantName: string;
  Email: string | null;
  VPID: string | null;
  WhatsApp: string | null;
  AlternateNumber: string | null;
  District: number | null;
  DistrictName: string | null;
  Taluk: string | null;
  Gender: string | null;
  Course: string | null;
  CollegeName: string | null;
  CollegeType: string | null;
  ApproveStatus: string;
  Remark: string | null;
}

function mapToApprovalStudent(raw: RawRenewalPucStudent): ApprovalStudent {
  return {
    id: raw.Id,
    studentName: raw.ApplicantName || 'Unknown',
    email: raw.Email,
    contactNumber: raw.WhatsApp || raw.AlternateNumber || null,
    district: raw.DistrictName,
    approvalStatus: raw.ApproveStatus || 'Pending',
    remark: raw.Remark,
    infoRows: [
      { label: 'VPID', value: raw.VPID },
      { label: 'District', value: raw.DistrictName },
      { label: 'Course', value: raw.Course },
      { label: 'College', value: raw.CollegeName },
      { label: 'College Type', value: raw.CollegeType },
    ],
  };
}

async function getList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const data = response.data;
  const rows: RawRenewalPucStudent[] = data.data || data || [];
  return rows.map(mapToApprovalStudent);
}

async function approve(id: number, remark?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${BASE_URL}/approve/${id}`, { Remark: remark || '' });
  return {
    success: response.data.success ?? response.data.Success ?? true,
    message: response.data.message ?? response.data.Message ?? 'Approved',
  };
}

async function reject(id: number, remark?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${BASE_URL}/reject/${id}`, { Remark: remark || '' });
  return {
    success: response.data.success ?? response.data.Success ?? true,
    message: response.data.message ?? response.data.Message ?? 'Rejected',
  };
}

export const renewalPucApprovalApi = {
  getList,
  approve,
  reject,
  queryKey: ['renewalPucApproval', 'list'] as const,
  invalidatePrefix: 'renewalPucApproval',
};
