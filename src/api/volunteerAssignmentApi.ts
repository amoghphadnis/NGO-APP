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

interface ProgramConfig {
  prefix: string;
  bodyCasing: BodyCasing;
  reassignMethod: 'PUT' | 'POST';
  cancelMode: 'delete-query' | 'post-body';
  pageDataPath?: string;
}

const PROGRAM_CONFIG: Record<VolunteerAssignmentProgram, ProgramConfig> = {
  puc: {
    prefix: '/assign-volunteer-house-visit',
    bodyCasing: 'ID',
    reassignMethod: 'PUT',
    cancelMode: 'delete-query',
  },
  payana: {
    prefix: '/payana-volunteer-assignment',
    bodyCasing: 'Id',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/initial-data',
  },
  professional: {
    prefix: '/professional-volunteer-assignment',
    bodyCasing: 'ID',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/page',
  },
  semiProfessional: {
    prefix: '/semi-professional-volunteer-assignment',
    bodyCasing: 'Id',
    reassignMethod: 'POST',
    cancelMode: 'post-body',
    pageDataPath: '/initial-data',
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

export function createVolunteerAssignmentApi(program: VolunteerAssignmentProgram): VolunteerAssignmentApi {
  const cfg = PROGRAM_CONFIG[program];
  const { prefix } = cfg;

  return {
    program,

    async getDistricts() {
      const res = await api.get(`${prefix}/districts`);
      return res.data as VolunteerAssignmentDistrictsResponse;
    },

    async getStudents(districtId) {
      districtIdQuerySchema.parse(districtId);
      const res = await api.get(`${prefix}/students?districtId=${districtId}`);
      return res.data as VolunteerAssignmentStudentsResponse;
    },

    async getVolunteers(districtId) {
      districtIdQuerySchema.parse(districtId);
      const res = await api.get(`${prefix}/volunteers?districtId=${districtId}`);
      return res.data as VolunteerAssignmentVolunteersResponse;
    },

    async getPageData() {
      if (!cfg.pageDataPath) {
        const districts = await this.getDistricts();
        return { success: districts.success, districts: districts.data, students: [] };
      }
      const res = await api.get(`${prefix}${cfg.pageDataPath}`);
      return res.data as VolunteerAssignmentPageDataResponse;
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
