/**
 * PUC Student API
 * Handles PUC scholarship form API interactions.
 *
 * Primary:   POST /api/students/students/create (VPStudentApiController -> New_Students table)
 * Dropdowns: GET  /api/students/students/dropdowns
 * Fallback:  /api/puc-format1-1
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePUCDropdowns } from './transformers/normalizeDropdowns';

const PRIMARY_CREATE_URL = '/students/students/create';
const FALLBACK_CREATE_URL = '/puc-format1-1/create';

const PRIMARY_DROPDOWNS_URL = '/students/students/dropdowns';
const FALLBACK_DROPDOWNS_URL = '/puc-format1-1/dropdowns';

/**
 * Creates a new PUC student application
 * POST /api/students/students/create (with fallback to /api/puc-format1-1/create)
 */
export async function createPUCStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post(PRIMARY_CREATE_URL, formData);
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    console.warn('[createPUCStudent] Primary endpoint failed, attempting fallback:', error?.message);
    try {
      const fallbackResponse = await api.post(FALLBACK_CREATE_URL, formData);
      return normalizeApiResponse(fallbackResponse.data);
    } catch {
      return normalizeApiError(error);
    }
  }
}

/**
 * Gets PUC dropdown data
 * GET /api/students/students/dropdowns (with fallback to /api/puc-format1-1/dropdowns)
 */
export async function getPUCDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get(PRIMARY_DROPDOWNS_URL);
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePUCDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.warn('[getPUCDropdowns] Primary dropdowns failed, attempting fallback:', error?.message);
    try {
      const fallbackResponse = await api.get(FALLBACK_DROPDOWNS_URL);
      const dropdownData = fallbackResponse.data.Data || fallbackResponse.data;
      const normalizedDropdowns = normalizePUCDropdowns(dropdownData);

      return {
        success: true,
        data: normalizedDropdowns,
        message: fallbackResponse.data.Message || fallbackResponse.data.message || 'Success',
      };
    } catch {
      return normalizeApiError(error);
    }
  }
}
