/**
 * House Visit Approval API (Manager Approval Grid)
 *
 * Four program-specific controllers share the same DTO shape but differ in
 * route patterns. This factory preserves the exact route templates from each
 * contract — DO NOT normalize the route patterns.
 *
 * Route patterns per contract:
 *   PUC:               /api/puc-housevisits-grid
 *     GET  /list
 *     GET  /{id}
 *     POST /{id}/approve     body { Remark }
 *     POST /{id}/reject      body { Remark }
 *     POST /{id}/delete      (soft delete, no body)
 *
 *   Professional:      /api/professional-house-visits
 *     GET  /list
 *     POST /{id}/approve     body { Remark }
 *     POST /{id}/reject      body { Remark }
 *     DELETE /{id}           (soft delete, no body)
 *
 *   Payana:            /api/payana-house-visit-grid
 *     GET  /list
 *     POST /approve/{id}     body { Remark }   ← inverted path order
 *     POST /reject/{id}      body { Remark }   ← inverted path order
 *     POST /delete/{id}      (soft delete)     ← inverted path order
 *
 *   Semi-Professional: /api/semi-professional-house-visits
 *     GET  /list
 *     POST /{id}/approve     body { Remark }
 *     POST /{id}/reject      body { Remark }
 *     DELETE /{id}           (soft delete, no body)
 *
 * All endpoints require JWT. The list endpoint reads UserRole and UserId
 * from session; Branch Executives are filtered to their mapped districts
 * server-side (no client-side filter param needed — the backend uses session).
 *
 * Architectural note: approve/reject ONLY modify ApproveStatus and
 * RejectionRemark on the house visit table. They never touch
 * VolunteerApprovalStatus (the volunteer's recommendation).
 */

import {
  HouseVisitApprovalItem,
  HouseVisitApprovalListResponse,
  HouseVisitApprovalMutationResponse,
  HouseVisitApprovalProgram,
  HouseVisitStatusRequest,
  RawPayanaHouseVisitApproval,
  RawProfessionalHouseVisitApproval,
  RawPucHouseVisitApproval,
  RawSemiProfessionalHouseVisitApproval,
} from '@/types/houseVisitApproval';
import api from './client';

/** Per-program route configuration. The route templates are contract-mandated. */
interface ProgramRouteConfig {
  /** Base path (without /api prefix — client.ts adds it). */
  basePath: string;
  /** Template for approve: e.g. '/{id}/approve' or '/approve/{id}'. */
  approvePath: (id: number) => string;
  /** Template for reject: e.g. '/{id}/reject' or '/reject/{id}'. */
  rejectPath: (id: number) => string;
  /** Template for delete: e.g. '/{id}/delete' or '/{id}'. */
  deletePath: (id: number) => string;
  /** HTTP method for delete: 'POST' or 'DELETE'. */
  deleteMethod: 'POST' | 'DELETE';
}

const PROGRAM_ROUTES: Record<HouseVisitApprovalProgram, ProgramRouteConfig> = {
  puc: {
    basePath: '/puc-housevisits-grid',
    approvePath: (id) => `/${id}/approve`,
    rejectPath: (id) => `/${id}/reject`,
    deletePath: (id) => `/${id}/delete`,
    deleteMethod: 'POST',
  },
  professional: {
    basePath: '/professional-house-visits',
    approvePath: (id) => `/${id}/approve`,
    rejectPath: (id) => `/${id}/reject`,
    deletePath: (id) => `/${id}`,
    deleteMethod: 'DELETE',
  },
  payana: {
    basePath: '/payana-house-visit-grid',
    // Payana uses INVERTED path order: /approve/{id}, /reject/{id}, /delete/{id}
    approvePath: (id) => `/approve/${id}`,
    rejectPath: (id) => `/reject/${id}`,
    deletePath: (id) => `/delete/${id}`,
    deleteMethod: 'POST',
  },
  semiProfessional: {
    basePath: '/semi-professional-house-visits',
    approvePath: (id) => `/${id}/approve`,
    rejectPath: (id) => `/${id}/reject`,
    deletePath: (id) => `/${id}`,
    deleteMethod: 'DELETE',
  },
};

// ── Per-program mappers to the shared HouseVisitApprovalItem ─────────────

function mapPuc(raw: RawPucHouseVisitApproval): HouseVisitApprovalItem {
  return {
    id: raw.HouseVisitID,
    studentId: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    district: raw.DistrictName || raw.District,
    courseInstitution: raw.CourseInstitution,
    visitDate: raw.VisitDate,
    fieldSupervisorName: raw.FieldSupervisorName,
    approveStatus: raw.ApproveStatus,
    volunteerApprovalStatus: raw.VolunteerApprovalStatus,
    rejectionRemark: raw.RejectionRemark,
    infoRows: [
      { label: 'District', value: raw.DistrictName || raw.District },
      { label: 'Place', value: raw.Place },
      { label: 'Course', value: raw.CourseInstitution },
      { label: 'Visit Date', value: raw.VisitDate },
      { label: 'Supervisor', value: raw.FieldSupervisorName },
      { label: 'House Type', value: raw.HouseType },
      { label: 'Living Condition', value: raw.LivingCondition },
      { label: 'Avg Income', value: raw.AverageIncome != null ? raw.AverageIncome.toString() : null },
    ],
  };
}

function mapProfessional(raw: RawProfessionalHouseVisitApproval): HouseVisitApprovalItem {
  return {
    id: raw.HouseVisitID,
    studentId: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    district: null, // Professional DTO does not expose DistrictName
    courseInstitution: raw.CourseInstitution,
    visitDate: raw.VisitDate,
    fieldSupervisorName: raw.FieldSupervisorName,
    approveStatus: raw.ApproveStatus,
    volunteerApprovalStatus: raw.VolunteerApprovalStatus,
    rejectionRemark: raw.RejectionRemark,
    infoRows: [
      { label: 'Course', value: raw.CourseInstitution },
      { label: 'Visit Date', value: raw.VisitDate },
      { label: 'Supervisor', value: raw.FieldSupervisorName },
      { label: 'House Type', value: raw.HouseType },
      { label: 'Living Condition', value: raw.LivingCondition },
      { label: 'Avg Income', value: raw.AverageIncome != null ? raw.AverageIncome.toString() : null },
    ],
  };
}

function mapPayana(raw: RawPayanaHouseVisitApproval): HouseVisitApprovalItem {
  return {
    id: raw.HouseVisitID,
    studentId: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    district: null, // Payana DTO does not expose DistrictName
    courseInstitution: raw.CourseInstitution,
    visitDate: raw.VisitDate,
    fieldSupervisorName: raw.FieldSupervisorName,
    approveStatus: raw.ApproveStatus,
    volunteerApprovalStatus: raw.VolunteerApprovalStatus,
    rejectionRemark: raw.RejectionRemark,
    infoRows: [
      { label: 'Course', value: raw.CourseInstitution },
      { label: 'Visit Date', value: raw.VisitDate },
      { label: 'Supervisor', value: raw.FieldSupervisorName },
      { label: 'House Type', value: raw.HouseType },
      { label: 'Living Condition', value: raw.LivingCondition },
      { label: 'Avg Income', value: raw.AverageIncome != null ? raw.AverageIncome.toString() : null },
    ],
  };
}

function mapSemiProfessional(raw: RawSemiProfessionalHouseVisitApproval): HouseVisitApprovalItem {
  return {
    id: raw.HouseVisitID,
    studentId: raw.StudentID,
    studentName: raw.StudentName || 'Unknown',
    district: raw.DistrictName,
    courseInstitution: raw.CourseInstitution,
    visitDate: raw.VisitDate,
    fieldSupervisorName: raw.FieldSupervisorName,
    approveStatus: raw.ApproveStatus,
    volunteerApprovalStatus: raw.VolunteerApprovalStatus,
    rejectionRemark: raw.RejectionRemark,
    infoRows: [
      { label: 'District', value: raw.DistrictName },
      { label: 'Course', value: raw.CourseInstitution },
      { label: 'Visit Date', value: raw.VisitDate },
      { label: 'Supervisor', value: raw.FieldSupervisorName },
      { label: 'House Type', value: raw.HouseType },
      { label: 'Living Condition', value: raw.LivingCondition },
      { label: 'Avg Income', value: raw.AverageIncome != null ? raw.AverageIncome.toString() : null },
    ],
  };
}

// ── API factory ──────────────────────────────────────────────────────────

export interface HouseVisitApprovalApi {
  program: HouseVisitApprovalProgram;
  getList(): Promise<HouseVisitApprovalItem[]>;
  approve(id: number, remark?: string): Promise<HouseVisitApprovalMutationResponse>;
  reject(id: number, remark?: string): Promise<HouseVisitApprovalMutationResponse>;
  delete(id: number): Promise<HouseVisitApprovalMutationResponse>;
  queryKeys: {
    list: readonly [string, string, HouseVisitApprovalProgram];
  };
  /** Invalidation prefix for React Query cache. */
  invalidatePrefix: string;
}

export function createHouseVisitApprovalApi(
  program: HouseVisitApprovalProgram
): HouseVisitApprovalApi {
  const routes = PROGRAM_ROUTES[program];

  return {
    program,

    async getList() {
      const res = await api.get(`${routes.basePath}/list`);
      const body = res.data as HouseVisitApprovalListResponse<unknown>;
      const rows = body.data || [];
      switch (program) {
        case 'puc':
          return (rows as RawPucHouseVisitApproval[]).map(mapPuc);
        case 'professional':
          return (rows as RawProfessionalHouseVisitApproval[]).map(mapProfessional);
        case 'payana':
          return (rows as RawPayanaHouseVisitApproval[]).map(mapPayana);
        case 'semiProfessional':
          return (rows as RawSemiProfessionalHouseVisitApproval[]).map(mapSemiProfessional);
      }
    },

    async approve(id, remark) {
      const payload: HouseVisitStatusRequest = { Remark: remark || '' };
      const res = await api.post(`${routes.basePath}${routes.approvePath(id)}`, payload);
      return res.data as HouseVisitApprovalMutationResponse;
    },

    async reject(id, remark) {
      const payload: HouseVisitStatusRequest = { Remark: remark || '' };
      const res = await api.post(`${routes.basePath}${routes.rejectPath(id)}`, payload);
      return res.data as HouseVisitApprovalMutationResponse;
    },

    async delete(id) {
      // Delete method varies by program: POST /{id}/delete (PUC, Payana)
      // vs DELETE /{id} (Professional, Semi-Professional).
      const path = `${routes.basePath}${routes.deletePath(id)}`;
      const res =
        routes.deleteMethod === 'DELETE'
          ? await api.delete(path)
          : await api.post(path);
      return res.data as HouseVisitApprovalMutationResponse;
    },

    queryKeys: {
      list: ['houseVisitApproval', 'list', program] as const,
    },

    invalidatePrefix: 'houseVisitApproval',
  };
}

export const pucHouseVisitApprovalApi = createHouseVisitApprovalApi('puc');
export const professionalHouseVisitApprovalApi = createHouseVisitApprovalApi('professional');
export const payanaHouseVisitApprovalApi = createHouseVisitApprovalApi('payana');
export const semiProfessionalHouseVisitApprovalApi = createHouseVisitApprovalApi('semiProfessional');

export const houseVisitApprovalApis: Record<HouseVisitApprovalProgram, HouseVisitApprovalApi> = {
  puc: pucHouseVisitApprovalApi,
  professional: professionalHouseVisitApprovalApi,
  payana: payanaHouseVisitApprovalApi,
  semiProfessional: semiProfessionalHouseVisitApprovalApi,
};
