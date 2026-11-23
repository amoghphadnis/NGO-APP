/**
 * Semi Professional Student API
 * Handles all Semi Professional scholarship form API interactions
 * Base route: /api/semi-professional
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedSemiProfDropdowns, normalizeSemiProfessionalDropdowns } from './transformers/normalizeSemiProfDropdowns';

/**
 * Creates a new Semi Professional student application
 * POST /api/semi-professional/create
 */
export async function createSemiProfessionalStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/semi-professional/create', formData);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets Semi Professional dropdown data
 * GET /api/semi-professional/form-data
 */
export async function getSemiProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedSemiProfDropdowns>
> {
  try {
    const response = await api.get('/semi-professional/form-data');
    // Handle both wrapped (data.Data / data.data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data.data || response.data;
    const normalizedDropdowns = normalizeSemiProfessionalDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
