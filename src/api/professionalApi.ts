/**
 * Professional Student API
 * Handles all Professional scholarship form API interactions
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizeProfessionalDropdowns, NormalizedDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new Professional student application
 * POST /api/students/professional/create
 */
export async function createProfessionalStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/professional/create', formData, {
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
 * Gets Professional dropdown data
 * GET /api/students/professional/dropdowns
 */
export async function getProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/students/professional/dropdowns');
    const normalizedDropdowns = normalizeProfessionalDropdowns(response.data.Data);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
