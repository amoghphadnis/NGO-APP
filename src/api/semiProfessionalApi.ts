/**
 * Semi Professional Student API
 * Handles all Semi Professional scholarship form API interactions
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizeSemiProfessionalDropdowns, NormalizedSemiProfDropdowns } from './transformers/normalizeSemiProfDropdowns';

/**
 * Creates a new Semi Professional student application
 * POST /api/semiprofessionalstudent/create
 */
export async function createSemiProfessionalStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/semiprofessionalstudent/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets Semi Professional dropdown data
 * GET /api/semiprofessionalstudent/create
 */
export async function getSemiProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedSemiProfDropdowns>
> {
  try {
    const response = await api.get('/semiprofessionalstudent/dropdowns');
    const normalizedDropdowns = normalizeSemiProfessionalDropdowns(response.data);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
