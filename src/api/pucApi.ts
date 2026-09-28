/**
 * PUC Format 1.1 Student API
 * Handles all PUC scholarship form API interactions.
 *
 * Create:     POST /api/VP_Format1_1PUC          (multipart/form-data)
 * Dropdowns:  GET  /api/VP_Format1_1PUC/dropdowns
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePUCDropdowns } from './transformers/normalizeDropdowns';

const BASE_URL = '/puc-format1-1';

/**
 * Creates a new PUC Format 1.1 student application
 * POST /api/VP_Format1_1PUC  (multipart/form-data)
 */
export async function createPUCStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post(`${BASE_URL}/create`, formData);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets PUC Format 1.1 dropdown data
 * GET /api/VP_Format1_1PUC/dropdowns
 */
export async function getPUCDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get(`${BASE_URL}/dropdowns`);

    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePUCDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
