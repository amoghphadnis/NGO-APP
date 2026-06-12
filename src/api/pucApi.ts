/**
 * PUC Student API
 * Handles all PUC scholarship form API interactions
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePUCDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new PUC student application
 * POST /api/students/students/create
 */
export async function createPUCStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/students/create', formData);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets PUC dropdown data
 * GET /api/students/students/dropdowns
 */
export async function getPUCDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/students/students/dropdowns');
    console.log('[getPUCDropdowns] Raw response:', JSON.stringify(response.data, null, 2));

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
