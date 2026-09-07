/**
 * PUC Format 1.1 Student EDIT API
 * Route prefix: /api/edit-format1-1-puc-student
 *
 *   GET  /{id}         (JWT)     → PucFormat11StudentResponse
 *   GET  /dropdowns    (public)  → PucFormat11DropdownsResponse
 *   POST /{id}/update  (JWT, multipart, partial) → EditMutationResponse<PucFormat11StudentDto>
 */

import {
  EditMutationResponse,
  PucFormat11DropdownsResponse,
  PucFormat11StudentDto,
  PucFormat11StudentResponse,
  PucFormat11UpdateRequest,
} from '@/types/editStudents';
import api from './client';
import { appendDocumentFiles, appendScalarFields } from './transformers/multipart';

const BASE_URL = '/edit-format1-1-puc-student';

export async function getPucFormat11Student(id: number): Promise<PucFormat11StudentResponse> {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data as PucFormat11StudentResponse;
}

export async function getPucFormat11Dropdowns(): Promise<PucFormat11DropdownsResponse> {
  const res = await api.get(`${BASE_URL}/dropdowns`);
  return res.data as PucFormat11DropdownsResponse;
}

export function buildPucFormat11UpdateFormData(req: PucFormat11UpdateRequest): FormData {
  const fd = new FormData();
  appendScalarFields(fd, req.fields);
  appendDocumentFiles(fd, req.files);
  return fd;
}

export async function updatePucFormat11Student(
  id: number,
  req: PucFormat11UpdateRequest
): Promise<EditMutationResponse<PucFormat11StudentDto>> {
  const res = await api.post(`${BASE_URL}/${id}/update`, buildPucFormat11UpdateFormData(req));
  return res.data as EditMutationResponse<PucFormat11StudentDto>;
}

export const pucEditApi = {
  get: getPucFormat11Student,
  dropdowns: getPucFormat11Dropdowns,
  update: updatePucFormat11Student,
  buildFormData: buildPucFormat11UpdateFormData,
  queryKeys: {
    detail: (id: number) => ['pucFormat11', 'edit', id] as const,
    dropdowns: () => ['pucFormat11', 'dropdowns'] as const,
  },
};
