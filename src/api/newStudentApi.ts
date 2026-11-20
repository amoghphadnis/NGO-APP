/**
 * New Student Registration API
 * Handles the legacy Student Registration form (web: /VPStudent/CreateStudent)
 * Backend: VPStudentApiController -> New_Students table
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizeProfessionalDropdowns } from './transformers/normalizeDropdowns';

/** Route prefix: api/students (API_BASE_URL already ends with /api). */
const BASE_URL = '/students';

/**
 * Creates a new student registration
 * POST /api/students/students/create (multipart/form-data, public)
 */
export async function createNewStudent(
  formData: FormData
): Promise<NormalizedApiResponse<undefined>> {
  try {
    const response = await api.post(`${BASE_URL}/students/create`, formData);
    return normalizeApiResponse<undefined>(response.data);
  } catch (error: any) {
    console.error(`[createNewStudent] API Error:`, {
      status: error.response?.status,
      message: error.message,
    });
    return normalizeApiError(error);
  }
}

/**
 * Gets student registration dropdown data
 * GET /api/students/students/dropdowns (public)
 * Response shape matches the professional/payana *List convention.
 */
export async function getNewStudentDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get(`${BASE_URL}/students/dropdowns`);
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizeProfessionalDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getNewStudentDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}
