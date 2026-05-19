/**
 * PUC Student API
 * Handles all PUC scholarship form API interactions
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizePUCDropdowns, NormalizedDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new PUC student application
 * POST /api/students/students/create
 */
export async function createPUCStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/students/students/create', formData, {
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
 * Gets PUC dropdown data
 * GET /api/students/students/dropdowns
 */
export async function getPUCDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/students/students/dropdowns');
    const normalizedDropdowns = normalizePUCDropdowns(response.data.Data);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
