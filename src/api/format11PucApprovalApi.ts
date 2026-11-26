/**
 * Format 1.1 PUC Student Approval API
 *
 * Maps to web menu: Approval/Reject → "Format 1.1 PUC-I Student Approval/Reject"
 * (legacy /VP_Format1_1PUC_Grid/Format1_1PUC_Grid)
 *
 * Base Route: /api/format1-1-puc
 *
 * Endpoints:
 *   GET  /api/format1-1-puc/list            → { success, count, data: [...] } or Format1_1PUCModel[]
 *   POST /api/format1-1-puc/approve/{id}    → { success, message }  body: { Remark }
 *   POST /api/format1-1-puc/reject/{id}     → { success, message }  body: { Remark }
 *   DELETE /api/format1-1-puc/delete/{id}   → { success, message }
 *
 * All endpoints require JWT authentication.
 * Branch Executives are scoped to their mapped districts server-side.
 */

import { ApprovalMutationResponse, ApprovalStudent } from '@/types/approval';
import api from './client';

const BASE_URL = '/format1-1-puc';

/** Raw row from GET /api/format1-1-puc/list (Format1_1_PUC table) */
export interface RawFormat11PucApprovalStudent {
  StudentFormat1ID: number;
  StudentName: string | null;
  Email: string | null;
  DateOfBirth: string | null;
  ContactNumber: string | null;
  AlternateNumber: string | null;
  GenderName: string | null;
  CategoryName: string | null;
  DistrictName: string | null;
  OtherDistrict: string | null;
  Taluk: string | null;
  ResidentialAddress: string | null;
  FatherOccupation: string | null;
  MotherOccupation: string | null;
  TotalFamilyMembers: number | null;
  FamilyAnnualIncome: number | null;
  SSLCPercentage: number | null;
  CourseName: string | null;
  CollegeName: string | null;
  CollegeTypeName: string | null;
  CollegeFees: number | null;
  CollegeContactNumber: string | null;
  Achievement: string | null;
  ParentsBankBalance: number | null;
  StudentSelfiePath?: string | null;
  SSLCMarksCardPath?: string | null;
  FeeReceiptPath?: string | null;
  BankPassbookPath?: string | null;
  AadhaarCardPath?: string | null;
  Status: string | null;
  CreatedDate: string | null;
  ApproveStatus: string | null;
  Remark: string | null;
}

function mapToApprovalStudent(raw: RawFormat11PucApprovalStudent): ApprovalStudent {
  return {
    id: raw.StudentFormat1ID,
    studentName: raw.StudentName || 'Unknown',
    email: raw.Email,
    contactNumber: raw.ContactNumber,
    district: raw.OtherDistrict || raw.DistrictName,
    approvalStatus: raw.ApproveStatus || '',
    remark: raw.Remark,
    infoRows: [
      { label: 'District', value: raw.OtherDistrict || raw.DistrictName },
      { label: 'Taluk', value: raw.Taluk },
      { label: 'Course', value: raw.CourseName },
      { label: 'College', value: raw.CollegeName },
      { label: 'SSLC %', value: raw.SSLCPercentage != null ? `${raw.SSLCPercentage}%` : null },
      { label: 'Family Income', value: raw.FamilyAnnualIncome != null ? `₹${raw.FamilyAnnualIncome}` : null },
      { label: 'Contact', value: raw.ContactNumber },
    ],
  };
}

export async function getFormat11PucApprovalList(): Promise<ApprovalStudent[]> {
  const response = await api.get(`${BASE_URL}/list`);
  const rawData = response.data;
  const list: RawFormat11PucApprovalStudent[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData?.Data)
        ? rawData.Data
        : [];
  return list.map(mapToApprovalStudent);
}

export async function approveFormat11PucStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/approve/${id}`, {
    StudentFormat1ID: id,
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export async function rejectFormat11PucStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const response = await api.post(`${BASE_URL}/reject/${id}`, {
    StudentFormat1ID: id,
    Remark: remark || '',
  });
  return response.data as ApprovalMutationResponse;
}

export const format11PucApprovalApi = {
  getList: getFormat11PucApprovalList,
  approve: approveFormat11PucStudent,
  reject: rejectFormat11PucStudent,

  queryKey: ['format11PucApproval', 'list'] as const,
  invalidatePrefix: 'format11PucApproval',
};
