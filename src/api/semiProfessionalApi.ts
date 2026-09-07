/**
 * Semi Professional Student API
 * Handles all Semi Professional scholarship form API interactions
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedSemiProfDropdowns, normalizeSemiProfessionalDropdowns } from './transformers/normalizeSemiProfDropdowns';

/**
 * Creates a new Semi Professional student application
 * POST /api/semiprofessionalstudent/create
 */
export async function createSemiProfessionalStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/semiprofessionalstudent/create', formData);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets Semi Professional dropdown data
 * GET /api/semiprofessionalstudent/dropdowns
 */
export async function getSemiProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedSemiProfDropdowns>
> {
  try {
    const response = await api.get('/semiprofessionalstudent/dropdowns');
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
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
