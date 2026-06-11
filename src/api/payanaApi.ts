/**
 * Payana Student API
 * Handles Payana New Student form submissions
 */

import api from './client';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizePayanaDropdowns, NormalizedDropdowns } from './transformers/normalizeDropdowns';

/**
 * Creates a new Payana Student application
 * POST /api/payanastudents/create
 */
export async function createPayanaStudent(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  console.log(`[createPayanaStudent] Sending request to /api/payanastudents/create`);
  const entries = Array.from((formData as any).entries()) as [string, any][];
  console.log(`[createPayanaStudent] FormData entries:`, entries.map(([k]) => k));

  try {
    const response = await api.post('/payanastudents/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(`[createPayanaStudent] Response status:`, response.status);
    console.log(`[createPayanaStudent] Response data:`, response.data);

    return normalizeApiResponse(response.data);
  } catch (error: any) {
    console.error(`[createPayanaStudent] API Error:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return normalizeApiError(error);
  }
}

/**
 * Gets Payana dropdown data
 * GET /payanastudents/dropdowns
 */
export async function getPayanaDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/payanastudents/dropdowns');
    console.log('[getPayanaDropdowns] Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePayanaDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getPayanaDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}
