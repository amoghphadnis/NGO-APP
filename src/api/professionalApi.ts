/**
 * Professional Student API
 * Handles all Professional scholarship form API interactions
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizeProfessionalDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new Professional student application
 * POST /api/VP_NewProfessional/submit
 */
export async function createProfessionalStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post('/VP_NewProfessional/submit', formData);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    console.error('[createProfessionalStudent] API Error:', {
      status: error.response?.status,
      message: error.message,
    });
    return normalizeApiError(error);
  }
}

/**
 * Gets Professional dropdown data
 * GET /api/VP_NewProfessional/dropdowns
 */
export async function getProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/VP_NewProfessional/dropdowns');
    
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
