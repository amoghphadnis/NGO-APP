/**
 * Professional Renewal Approval API
 *
 * Base Route: /api/professional-renewal1
 *
 * Endpoints:
 *   GET   /api/professional-renewal1/list           → renewal list
 *   POST  /api/professional-renewal1/approve/{id}   → approve with remark
 *   POST  /api/professional-renewal1/reject/{id}    → reject with remark
 *
 * All endpoints require JWT authentication.
 */

import api from './client';
import { ApprovalStudent } from '@/types/approval';

const BASE_URL = '/professional-renewal1';

interface RawRenewalProfessionalStudent {
  PRId: number;
  ApplicantName: string;
  EmailID: string | null;
  VPIDNumber: string | null;
  WhatsAppNumber: string | null;
  AlternateNumber: string | null;
  District: string | null;
  Taluk: string | null;
  Gender: string | null;
  CourseStudyingApplying: string | null;
  CurrentCourseYear: number | null;
  CourseStream: string | null;
  CollegeName: string | null;
  CollegeType: string | null;
  LatestResultPercentage: number | null;
  TotalScholarshipAmount: number | null;
  ApproveStatus: string;
  Remarks: string | null;
}

function mapToApprovalStudent(raw: RawRenewalProfessionalStudent): ApprovalStudent {
  return {
    id: raw.PRId,
    studentName: raw.ApplicantName || 'Unknown',
    email: raw.EmailID,
    contactNumber: raw.WhatsAppNumber || raw.AlternateNumber || null,
    district: raw.District,
    approvalStatus: raw.ApproveStatus || 'Pending',
    remark: raw.Remarks,
    infoRows: [
      { label: 'VPID', value: raw.VPIDNumber },
      { label: 'District', value: raw.District },
      { label: 'Course', value: raw.CourseStudyingApplying },
      { label: 'Year', value: raw.CurrentCourseYear != null ? String(raw.CurrentCourseYear) : null },
      { label: 'College', value: raw.CollegeName },
      { label: 'College Type', value: raw.CollegeType },
      { label: 'Latest Result %', value: raw.LatestResultPercentage != null ? String(raw.LatestResultPercentage) : null },
      { label: 'Scholarship Amount', value: raw.TotalScholarshipAmount != null ? `₹${raw.TotalScholarshipAmount}` : null },
    ],
  };
}

async function getList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const data = response.data;
  const rows: RawRenewalProfessionalStudent[] = data.data || data || [];
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

export const renewalProfessionalApprovalApi = {
  getList,
  approve,
  reject,
  queryKey: ['renewalProfessionalApproval', 'list'] as const,
  invalidatePrefix: 'renewalProfessionalApproval',
};
