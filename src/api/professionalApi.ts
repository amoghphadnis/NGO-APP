/**
 * Professional Student API
 * Handles all Professional scholarship form API interactions
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizeProfessionalDropdowns, NormalizedDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new Professional student application
 * POST /students/professional/create
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
 * GET /students/professional/dropdowns
 */
export async function getProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/students/professional/dropdowns');
    console.log('[getProfessionalDropdowns] Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizeProfessionalDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getProfessionalDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}
