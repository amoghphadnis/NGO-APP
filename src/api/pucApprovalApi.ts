/**
 * PUC Student Approval API
 *
 * Contract: PUC Student Approval API Contract.docx
 * Base Route: /api/students
 *
 * Endpoints:
 *   GET  /api/students/getall          → PucApprovalStudent[]
 *   GET  /api/students/get/{id}        → PucApprovalStudentDetail
 *   POST /api/students/approve?id=...  → ApprovalMutationResponse
 *   POST /api/students/reject?id=...   → ApprovalMutationResponse
 *   GET  /api/students/genders         → PucApprovalDropdownDto[]
 *   GET  /api/students/districts       → PucApprovalDropdownDto[]
 *   GET  /api/students/areas           → PucApprovalDropdownDto[]
 *
 * All endpoints require JWT authentication.
 */

import api from './client';
import {
  ApprovalMutationResponse,
  PucApprovalDropdownDto,
  PucApprovalListQueryParams,
  PucApprovalStudent,
  PucApprovalStudentDetail,
} from '@/types/pucApproval';

const BASE_URL = '/students';

/**
 * Fetch all PUC students for the approval grid.
 *
 * If role is "Branch Executives", results are filtered by mapped districts
 * and userId is required.
 */
export async function getApprovalList(
  params?: PucApprovalListQueryParams
): Promise<PucApprovalStudent[]> {
  const queryParams = new URLSearchParams();

  if (params?.role) {
    queryParams.append('role', params.role);
  }

  if (params?.userId !== undefined) {
    queryParams.append('userId', params.userId.toString());
  }

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/getall${queryString ? `?${queryString}` : ''}`;

  const response = await api.get(url);
  return response.data as PucApprovalStudent[];
}

/**
 * Fetch a single PUC student by ID (for edit/detail view).
 */
export async function getApprovalStudentById(
  id: number
): Promise<PucApprovalStudentDetail> {
  const response = await api.get(`${BASE_URL}/get/${id}`);
  return response.data as PucApprovalStudentDetail;
}

/**
 * Approve a PUC student application.
 * POST /api/students/approve?id={id}&remark={remark}
 */
export async function approveStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('id', id.toString());

  if (remark) {
    queryParams.append('remark', remark);
  }

  const response = await api.post(`${BASE_URL}/approve?${queryParams.toString()}`);
  return response.data as ApprovalMutationResponse;
}

/**
 * Reject a PUC student application.
 * POST /api/students/reject?id={id}&remark={remark}
 */
export async function rejectStudent(
  id: number,
  remark?: string
): Promise<ApprovalMutationResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('id', id.toString());

  if (remark) {
    queryParams.append('remark', remark);
  }

  const response = await api.post(`${BASE_URL}/reject?${queryParams.toString()}`);
  return response.data as ApprovalMutationResponse;
}

/**
 * Fetch gender dropdown list.
 */
export async function getGenderList(): Promise<PucApprovalDropdownDto[]> {
  const response = await api.get(`${BASE_URL}/genders`);
  return response.data as PucApprovalDropdownDto[];
}

/**
 * Fetch district dropdown list.
 */
export async function getDistrictList(): Promise<PucApprovalDropdownDto[]> {
  const response = await api.get(`${BASE_URL}/districts`);
  return response.data as PucApprovalDropdownDto[];
}

/**
 * Fetch area type dropdown list.
 */
export async function getAreaList(): Promise<PucApprovalDropdownDto[]> {
  const response = await api.get(`${BASE_URL}/areas`);
  return response.data as PucApprovalDropdownDto[];
}

/**
 * React Query-compatible wrapper
 */
export const pucApprovalApi = {
  getList: getApprovalList,
  getById: getApprovalStudentById,
  approve: approveStudent,
  reject: rejectStudent,
  getGenders: getGenderList,
  getDistricts: getDistrictList,
  getAreas: getAreaList,

  queryKeys: {
    list: (params?: PucApprovalListQueryParams) =>
      ['pucApproval', 'list', params] as const,
    detail: (id: number) => ['pucApproval', 'detail', id] as const,
  },
};
