/**
 * Payana Student EDIT API
 * Route prefix: /api/edit-payana-students (all JWT)
 *
 *   GET  /dropdowns    → PayanaEditDropdownsResponse
 *   GET  /{id}         → PayanaStudentEditResponse
 *   POST /{id}/update  → multipart; partial update; optional 5 file replacements
 */

import {
  EditMutationResponse,
  PayanaEditDropdownsResponse,
  PayanaStudentEditDto,
  PayanaStudentEditResponse,
  PayanaUpdateRequest,
} from '@/types/editStudents';
import api from './client';
import { appendDocumentFiles, appendScalarFields } from './transformers/multipart';

const BASE_URL = '/edit-payana-students';

export async function getPayanaStudentForEdit(id: number): Promise<PayanaStudentEditResponse> {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data as PayanaStudentEditResponse;
}

export async function getPayanaEditDropdowns(): Promise<PayanaEditDropdownsResponse> {
  const res = await api.get(`${BASE_URL}/dropdowns`);
  return res.data as PayanaEditDropdownsResponse;
}

export function buildPayanaUpdateFormData(req: PayanaUpdateRequest): FormData {
  const fd = new FormData();
  appendScalarFields(fd, req.fields);
  appendDocumentFiles(fd, req.files);
  return fd;
}

export async function updatePayanaStudent(
  id: number,
  req: PayanaUpdateRequest
): Promise<EditMutationResponse<PayanaStudentEditDto>> {
  const res = await api.post(`${BASE_URL}/${id}/update`, buildPayanaUpdateFormData(req));
  return res.data as EditMutationResponse<PayanaStudentEditDto>;
}

export const payanaEditApi = {
  get: getPayanaStudentForEdit,
  dropdowns: getPayanaEditDropdowns,
  update: updatePayanaStudent,
  buildFormData: buildPayanaUpdateFormData,
  queryKeys: {
    detail: (id: number) => ['payana', 'edit', id] as const,
    dropdowns: () => ['payana', 'editDropdowns'] as const,
  },
};
