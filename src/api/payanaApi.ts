/**
 * Payana Student API
 * Handles Payana New Student form submissions
 */

import { PayanaDistrictsResponse, SelectListItemDto } from '@/types/payana';
import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePayanaDropdowns } from './transformers/normalizeDropdowns';

/** Route prefix per PAYANA STUDENTS API CONTRACT (API_BASE_URL already ends with /api). */
const BASE_URL = '/payana-students';

/**
 * Creates a new Payana Student application
 * POST /api/payana-students/create (multipart/form-data, public)
 */
export async function createPayanaStudent(
  formData: FormData
): Promise<NormalizedApiResponse<undefined>> {
  console.log(`[createPayanaStudent] Sending multipart request to ${BASE_URL}/create`);

  try {
    const response = await api.post(`${BASE_URL}/create`, formData);

    console.log(`[createPayanaStudent] Response status:`, response.status);
    console.log(`[createPayanaStudent] Response data:`, response.data);

    return normalizeApiResponse<undefined>(response.data);
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
 * Gets Payana district list
 * GET /api/payana-students/districts (JWT)
 */
export async function getPayanaDistricts(): Promise<NormalizedApiResponse<SelectListItemDto[]>> {
  try {
    const response = await api.get(`${BASE_URL}/districts`);
    const body = response.data as PayanaDistrictsResponse;
    return {
      success: true,
      data: body.data ?? [],
      message: 'Success',
    };
  } catch (error: any) {
    console.error('[getPayanaDistricts] Error:', error);
    return normalizeApiError(error);
  }
}

/**
 * Gets Payana dropdown data
 * GET /api/payana-students/dropdowns (public)
 */
export async function getPayanaDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get(`${BASE_URL}/dropdowns`);
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
