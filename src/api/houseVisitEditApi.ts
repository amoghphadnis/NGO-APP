/**
 * House Visit EDIT API (retrieve + partial update)
 *
 * Four program-specific controllers share identical shapes; only the prefix differs.
 * All endpoints require JWT.
 */

import {
  HouseVisitEditResponse,
  HouseVisitProgram,
  HouseVisitUpdateRequest,
  HouseVisitUpdateResponse,
} from '@/types/houseVisitEdit';
import api from './client';
import { appendDocumentFile, appendScalarFields } from './transformers/multipart';

const PREFIX: Record<HouseVisitProgram, string> = {
  puc: '/editpuc-house-visits',
  professional: '/edit-professional-house-visits',
  payana: '/edit-payana-house-visits',
  semiProfessional: '/edit-semi-professional-house-visits',
};

export function buildHouseVisitUpdateFormData(req: HouseVisitUpdateRequest): FormData {
  const fd = new FormData();
  appendScalarFields(fd, req.fields);

  const members = (req.familyMembers ?? []).filter(
    (m) => Number.isInteger(m.FamilyID) && m.FamilyID > 0
  );
  if (members.length > 0) {
    fd.append('FamilyMembers', JSON.stringify(members));
  }

  (req.uploadedFiles ?? []).forEach((file) => appendDocumentFile(fd, 'UploadedFile', file));

  return fd;
}

export interface HouseVisitEditApi {
  program: HouseVisitProgram;
  get(id: number): Promise<HouseVisitEditResponse>;
  update(id: number, req: HouseVisitUpdateRequest): Promise<HouseVisitUpdateResponse>;
  queryKeys: {
    detail: (id: number) => readonly unknown[];
  };
}

export function createHouseVisitEditApi(program: HouseVisitProgram): HouseVisitEditApi {
  const prefix = PREFIX[program];

  return {
    program,

    async get(id) {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid House Visit ID.');
      }
      const res = await api.get(`${prefix}/${id}`);
      return res.data as HouseVisitEditResponse;
    },

    async update(id, req) {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid House Visit ID.');
      }
      const res = await api.post(`${prefix}/${id}/update`, buildHouseVisitUpdateFormData(req));
      return res.data as HouseVisitUpdateResponse;
    },

    queryKeys: {
      detail: (id: number) => ['houseVisit', program, 'edit', id] as const,
    },
  };
}

export const pucHouseVisitEditApi = createHouseVisitEditApi('puc');
export const professionalHouseVisitEditApi = createHouseVisitEditApi('professional');
export const payanaHouseVisitEditApi = createHouseVisitEditApi('payana');
export const semiProfessionalHouseVisitEditApi = createHouseVisitEditApi('semiProfessional');

export const houseVisitEditApis: Record<HouseVisitProgram, HouseVisitEditApi> = {
  puc: pucHouseVisitEditApi,
  professional: professionalHouseVisitEditApi,
  payana: payanaHouseVisitEditApi,
  semiProfessional: semiProfessionalHouseVisitEditApi,
};
