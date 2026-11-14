/**
 * Volunteer Assignment (House Visit) API
 *
 * One factory covers the four backend controllers, which share response shapes
 * but differ in route prefix, request-body key casing and cancel semantics.
 * See src/types/volunteerAssignment.ts for the identifier semantics
 * (StudentID vs ImportID selected by Source).
 *
 * All endpoints require JWT (handled by client.ts BEARER_REQUIRED_PATHS).
 */

import { SelectListItemDto } from '@/types/payana';
import {
    AssignVolunteerRequest,
    CancelVolunteerAssignmentRequest,
    VolunteerAssignmentDistrictsResponse,
    VolunteerAssignmentMutationResponse,
    VolunteerAssignmentPageDataResponse,
    VolunteerAssignmentProgram,
    VolunteerAssignmentStudentsResponse,
    VolunteerAssignmentVolunteersResponse,
} from '@/types/volunteerAssignment';
import {
    assignVolunteerRequestSchema,
    cancelVolunteerAssignmentRequestSchema,
    districtIdQuerySchema,
} from '@/validation/volunteerAssignmentSchemas';
import api from './client';

type BodyCasing = 'ID' | 'Id';

type DistrictFormat = 'selectListItem' | 'rawDistrict';

interface ProgramConfig {
  prefix: string;
  bodyCasing: BodyCasing;
  reassignMethod: 'PUT' | 'POST';
  cancelMode: 'delete-query' | 'post-body';
  pageDataPath?: string;
  districtFormat: DistrictFormat;
}

const PROGRAM_CONFIG: Record<VolunteerAssignmentProgram, ProgramConfig> = {
  puc: {
    prefix: '/assign-volunteer-house-visit',
    bodyCasing: 'ID',
    reassignMethod: 'PUT',
    cancelMode: 'delete-query',
    districtFormat: 'selectListItem',
  },
  payana: {
    prefix: '/payana-volunteer-assignment',
    bodyCasing: 'Id',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/initial-data',
    districtFormat: 'rawDistrict',
  },
  professional: {
    prefix: '/professional-volunteer-assignment',
    bodyCasing: 'ID',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/page',
    districtFormat: 'rawDistrict',
  },
  semiProfessional: {
    prefix: '/semi-professional-volunteer-assignment',
    bodyCasing: 'Id',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/initial-data',
    districtFormat: 'rawDistrict',
  },
};

function assignBody(req: AssignVolunteerRequest, casing: BodyCasing): Record<string, unknown> {
  return casing === 'ID'
    ? { StudentID: req.studentId, VolunteerID: req.volunteerId, Source: req.source }
    : { StudentId: req.studentId, VolunteerId: req.volunteerId, Source: req.source };
}

function cancelBody(req: CancelVolunteerAssignmentRequest, casing: BodyCasing): Record<string, unknown> {
  return casing === 'ID'
    ? { StudentID: req.studentId, Source: req.source }
    : { StudentId: req.studentId, Source: req.source };
}

export interface VolunteerAssignmentApi {
  program: VolunteerAssignmentProgram;
  getDistricts(): Promise<VolunteerAssignmentDistrictsResponse>;
  getStudents(districtId: number): Promise<VolunteerAssignmentStudentsResponse>;
  getVolunteers(districtId: number): Promise<VolunteerAssignmentVolunteersResponse>;
  getPageData(): Promise<VolunteerAssignmentPageDataResponse>;
  assign(req: AssignVolunteerRequest): Promise<VolunteerAssignmentMutationResponse>;
  reassign(req: AssignVolunteerRequest): Promise<VolunteerAssignmentMutationResponse>;
  cancel(req: CancelVolunteerAssignmentRequest): Promise<VolunteerAssignmentMutationResponse>;
  queryKeys: {
    districts: () => readonly unknown[];
    students: (districtId: number) => readonly unknown[];
    volunteers: (districtId: number) => readonly unknown[];
    pageData: () => readonly unknown[];
  };
}

function normalizeDistricts(raw: any): SelectListItemDto[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d: any) =>
    d.Value !== undefined && d.Text !== undefined
      ? { Value: String(d.Value), Text: d.Text }
      : { Value: String(d.DistrictID), Text: d.DistrictName }
  );
}

export function normalizeVolunteers(raw: any): SelectListItemDto[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((v: any) => {
      if (v.Value !== undefined && v.Text !== undefined) {
        return { Value: String(v.Value), Text: v.Text };
      }
      // Professional DTO: { VolunteerID, VolunteerName, Taluk }
      // Payana / SemiProf DTO: { Id, Name, Taluk, DisplayName }
      const id = v.VolunteerID ?? v.Id;
      const text = v.VolunteerName ?? v.DisplayName ?? v.Name;
      return { Value: String(id ?? ''), Text: text };
    })
    // Drop malformed rows so they can't surface as dummy/blank options.
    .filter(
      (v) =>
        v.Value !== '' &&
        v.Value !== 'undefined' &&
        v.Value !== 'null' &&
        Number(v.Value) > 0 &&
        !!v.Text
    );
}

export function createVolunteerAssignmentApi(program: VolunteerAssignmentProgram): VolunteerAssignmentApi {
  const cfg = PROGRAM_CONFIG[program];
  const { prefix } = cfg;

  return {
    program,

    async getDistricts() {
      const res = await api.get(`${prefix}/districts`);
      const data = res.data as any;
      if (cfg.districtFormat === 'rawDistrict') {
        return {
          success: data.success,
          count: data.count ?? data.data?.length ?? 0,
          data: normalizeDistricts(data.data),
        } as VolunteerAssignmentDistrictsResponse;
      }
      return data as VolunteerAssignmentDistrictsResponse;
    },

    async getStudents(districtId) {
      districtIdQuerySchema.parse(districtId);
      const res = await api.get(`${prefix}/students?districtId=${districtId}`);
      const data = res.data as VolunteerAssignmentStudentsResponse;
      // Program-specific field normalization: Professional / Semi-Professional
      // controllers expose AnnualIncome instead of FamilyIncome.
      const rows = (data.data ?? []).map((s: any) => ({
        ...s,
        FamilyIncome:
          s.FamilyIncome ?? (s.AnnualIncome != null ? Number(s.AnnualIncome) : null),
      }));
      return { ...data, data: rows } as VolunteerAssignmentStudentsResponse;
    },

    async getVolunteers(districtId) {
      districtIdQuerySchema.parse(districtId);
      const res = await api.get(`${prefix}/volunteers?districtId=${districtId}`);
      const data = res.data as any;
      if (cfg.districtFormat === 'rawDistrict') {
        return {
          success: data.success,
          count: data.count ?? data.data?.length ?? 0,
          data: normalizeVolunteers(data.data),
        } as VolunteerAssignmentVolunteersResponse;
      }
      return data as VolunteerAssignmentVolunteersResponse;
    },

    async getPageData() {
      if (!cfg.pageDataPath) {
        const districts = await this.getDistricts();
        return { success: districts.success, districts: districts.data, students: [] };
      }
      const res = await api.get(`${prefix}${cfg.pageDataPath}`);
      const data = res.data as any;
      if (cfg.districtFormat === 'rawDistrict') {
        return {
          success: data.success,
          districts: normalizeDistricts(data.districts),
          students: data.data ?? [],
        } as VolunteerAssignmentPageDataResponse;
      }
      return data as VolunteerAssignmentPageDataResponse;
    },

    async assign(req) {
      const valid = assignVolunteerRequestSchema.parse(req);
      const res = await api.post(`${prefix}/assign`, assignBody(valid, cfg.bodyCasing));
      return res.data as VolunteerAssignmentMutationResponse;
    },

    async reassign(req) {
      const valid = assignVolunteerRequestSchema.parse(req);
      const body = assignBody(valid, cfg.bodyCasing);
      const res =
        cfg.reassignMethod === 'PUT'
          ? await api.put(`${prefix}/reassign`, body)
          : await api.post(`${prefix}/reassign`, body);
      return res.data as VolunteerAssignmentMutationResponse;
    },

    async cancel(req) {
      const valid = cancelVolunteerAssignmentRequestSchema.parse(req);
      if (cfg.cancelMode === 'delete-query') {
        const qs = `studentId=${valid.studentId}&source=${encodeURIComponent(valid.source)}`;
        const res = await api.delete(`${prefix}/cancel?${qs}`);
        return res.data as VolunteerAssignmentMutationResponse;
      }
      const res = await api.post(`${prefix}/cancel`, cancelBody(valid, cfg.bodyCasing));
      return res.data as VolunteerAssignmentMutationResponse;
    },

    queryKeys: {
      districts: () => ['volunteerAssignment', program, 'districts'] as const,
      students: (districtId: number) => ['volunteerAssignment', program, 'students', districtId] as const,
      volunteers: (districtId: number) => ['volunteerAssignment', program, 'volunteers', districtId] as const,
      pageData: () => ['volunteerAssignment', program, 'pageData'] as const,
    },
  };
}

export const pucVolunteerAssignmentApi = createVolunteerAssignmentApi('puc');
export const payanaVolunteerAssignmentApi = createVolunteerAssignmentApi('payana');
export const professionalVolunteerAssignmentApi = createVolunteerAssignmentApi('professional');
export const semiProfessionalVolunteerAssignmentApi = createVolunteerAssignmentApi('semiProfessional');

export const volunteerAssignmentApis: Record<VolunteerAssignmentProgram, VolunteerAssignmentApi> = {
  puc: pucVolunteerAssignmentApi,
  payana: payanaVolunteerAssignmentApi,
  professional: professionalVolunteerAssignmentApi,
  semiProfessional: semiProfessionalVolunteerAssignmentApi,
};
