/**
 * Semi Professional Courses API (admin CRUD)
 * Route prefix: /api/semi-professional-courses — all endpoints JWT.
 */

import {
  CreateSemiProfessionalCourseRequest,
  SemiProfessionalCourseDetailResponse,
  SemiProfessionalCourseListResponse,
  SemiProfessionalCourseMutationResponse,
  UpdateSemiProfessionalCourseRequest,
} from '@/types/semiProfessionalCourses';
import {
  createSemiProfessionalCourseSchema,
  updateSemiProfessionalCourseSchema,
} from '@/validation/semiProfessionalCourseSchemas';
import api from './client';

const BASE_URL = '/semi-professional-courses';

export async function listSemiProfessionalCourses(): Promise<SemiProfessionalCourseListResponse> {
  const res = await api.get(`${BASE_URL}/list`);
  return res.data as SemiProfessionalCourseListResponse;
}

export async function getSemiProfessionalCourse(id: number): Promise<SemiProfessionalCourseDetailResponse> {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data as SemiProfessionalCourseDetailResponse;
}

export async function createSemiProfessionalCourse(
  req: CreateSemiProfessionalCourseRequest
): Promise<SemiProfessionalCourseMutationResponse> {
  const valid = createSemiProfessionalCourseSchema.parse(req);
  const res = await api.post(`${BASE_URL}/create`, { CourseId: 0, CourseName: valid.CourseName });
  return res.data as SemiProfessionalCourseMutationResponse;
}

export async function updateSemiProfessionalCourse(
  req: UpdateSemiProfessionalCourseRequest
): Promise<SemiProfessionalCourseMutationResponse> {
  const valid = updateSemiProfessionalCourseSchema.parse(req);
  const res = await api.put(`${BASE_URL}/update`, valid);
  return res.data as SemiProfessionalCourseMutationResponse;
}

export async function deleteSemiProfessionalCourse(id: number): Promise<SemiProfessionalCourseMutationResponse> {
  const res = await api.delete(`${BASE_URL}/delete/${id}`);
  return res.data as SemiProfessionalCourseMutationResponse;
}

export const semiProfessionalCoursesApi = {
  list: listSemiProfessionalCourses,
  get: getSemiProfessionalCourse,
  create: createSemiProfessionalCourse,
  update: updateSemiProfessionalCourse,
  delete: deleteSemiProfessionalCourse,
  queryKeys: {
    list: () => ['semiProfessionalCourses', 'list'] as const,
    detail: (id: number) => ['semiProfessionalCourses', 'detail', id] as const,
  },
};
