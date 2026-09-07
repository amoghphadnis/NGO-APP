/**
 * New Professional Student EDIT API
 * Route prefix: /api/edit-new-professional-student (all JWT)
 *
 *   GET  /{id}       → NewProfessionalStudentResponse
 *   GET  /dropdowns  → NewProfessionalDropdownsResponse ({id, name} items)
 *   POST /update     → multipart; ApplicationID required in body; partial update
 */

import {
  NewProfessionalDropdownsResponse,
  NewProfessionalStudentResponse,
  NewProfessionalUpdateRequest,
  NewProfessionalUpdateResponse,
} from '@/types/editStudents';
import api from './client';
import { appendDocumentFiles, appendScalarFields } from './transformers/multipart';

const BASE_URL = '/edit-new-professional-student';

export async function getNewProfessionalStudent(id: number): Promise<NewProfessionalStudentResponse> {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data as NewProfessionalStudentResponse;
}

export async function getNewProfessionalEditDropdowns(): Promise<NewProfessionalDropdownsResponse> {
  const res = await api.get(`${BASE_URL}/dropdowns`);
  return res.data as NewProfessionalDropdownsResponse;
}

export function buildNewProfessionalUpdateFormData(req: NewProfessionalUpdateRequest): FormData {
  if (!Number.isInteger(req.applicationId) || req.applicationId <= 0) {
    throw new Error('ApplicationID is required and must be valid.');
  }
  const fd = new FormData();
  fd.append('ApplicationID', String(req.applicationId));
  appendScalarFields(fd, req.fields);
  appendDocumentFiles(fd, req.files);
  return fd;
}

export async function updateNewProfessionalStudent(
  req: NewProfessionalUpdateRequest
): Promise<NewProfessionalUpdateResponse> {
  const res = await api.post(`${BASE_URL}/update`, buildNewProfessionalUpdateFormData(req));
  return res.data as NewProfessionalUpdateResponse;
}

export const professionalEditApi = {
  get: getNewProfessionalStudent,
  dropdowns: getNewProfessionalEditDropdowns,
  update: updateNewProfessionalStudent,
  buildFormData: buildNewProfessionalUpdateFormData,
  queryKeys: {
    detail: (id: number) => ['newProfessional', 'edit', id] as const,
    dropdowns: () => ['newProfessional', 'editDropdowns'] as const,
  },
};
