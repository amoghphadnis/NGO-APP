/**
 * Format 1.1 New Professional Student Approval API
 *
 * Maps to web menu: Approval/Reject → "Format 1.1 New Professional Student
 * Approval/Reject" (/VP_ProfessionalStudentApprovalGrid/ProfessionalStudentApprovalGrid)
 *
 * Base Route: /api/professional-student-approval
 *
 * Endpoints:
 *   GET  /api/professional-student-approval/list          → { success, count, data: [...] }
 *   POST /api/professional-student-approval/approve/{id}  → { success, message, ... }
 *   POST /api/professional-student-approval/reject/{id}   → { success, message, ... }
 *
 * All endpoints require JWT authentication.
 * Branch Executives are scoped to their mapped districts server-side.
 */

import { ApprovalListResponse, ApprovalMutationResponse, ApprovalStudent } from '@/types/approval';
import api from './client';

const BASE_URL = '/professional-student-approval';

/** Raw row from GET /api/professional-student-approval/list (ProfessionalStudents) */
export interface RawProfessionalFormat11ApprovalStudent {
  StudentID: number;
  StudentName: string | null;
  Email: string | null;
  DateOfBirth: string | null;
  District: string | null;
  OtherDistrict: string | null;
  Taluk: string | null;
  Address: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  Gender: string | null;
  CasteCategory: string | null;
  AreaType: string | null;
  FatherOccupation: string | null;
  MotherOccupation: string | null;
  FamilyMembers: number | null;
  AnnualIncome: number | null;
  PUPercentage: number | null;
  CET_NEET_Rank: string | null;
  CourseType: string | null;
  CollegeName: string | null;
  CollegeType: string | null;
  CollegeFees: number | null;
  CollegeContactNumber: string | null;
  ParentBankBalance: number | null;
  Status: string | null;
  ApproveStatus: string | null;
  HouseVisitLink: string | null;
  Remark: string | null;
}

function mapToApprovalStudent(raw: RawProfessionalFormat11ApprovalStudent): ApprovalStudent {
  return {
    id: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    email: raw.Email,
    contactNumber: raw.ContactNumber,
    district: raw.OtherDistrict || raw.District,
    approvalStatus: raw.ApproveStatus || '',
    remark: raw.Remark,
    infoRows: [
      { label: 'District', value: raw.OtherDistrict || raw.District },
      { label: 'Course Type', value: raw.CourseType },
      { label: 'College', value: raw.CollegeName },
      { label: 'PU %', value: raw.PUPercentage?.toString() ?? null },
      { label: 'CET/NEET Rank', value: raw.CET_NEET_Rank },
      { label: 'Annual Income', value: raw.AnnualIncome?.toString() ?? null },
      { label: 'Contact', value: raw.ContactNumber },
    ],
  };
}

export async function getProfessionalFormat11ApprovalList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const body = response.data as ApprovalListResponse<RawProfessionalFormat11ApprovalStudent>;
  return (body.data || []).map(mapToApprovalStudent);
}

export async function approveProfessionalFormat11Student(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/approve/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export async function rejectProfessionalFormat11Student(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/reject/${id}`, {
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export const professionalFormat11ApprovalApi = {
  getList: getProfessionalFormat11ApprovalList,
  approve: approveProfessionalFormat11Student,
  reject: rejectProfessionalFormat11Student,

  queryKey: ['professionalFormat11Approval', 'list'] as const,
  invalidatePrefix: 'professionalFormat11Approval',
};
