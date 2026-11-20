/**
 * Branch Executive District Mapping API
 *
 * Maps to web menu: "Assign Districts to Branch Executives"
 * (legacy /BranchExecutiveDistrictMapping/AssignDistricts)
 *
 * Base Route: /api/branch-executive-district-mapping
 *
 * Endpoints:
 *   GET  /api/branch-executive-district-mapping/assign-districts
 *       → { success, data: { Executives: [{Value,Text}], Districts: [{Value,Text}] } }
 *   POST /api/branch-executive-district-mapping/assign-districts
 *       → body { SelectedUserId, SelectedDistrictIds } → { success, message }
 *   GET  /api/branch-executive-district-mapping/assigned-districts/{userId}
 *       → { success, data: number[] }
 *
 * All endpoints require JWT authentication.
 */

import api from './client';

const BASE_URL = '/branch-executive-district-mapping';

/** SelectListItem as serialized by System.Web.Mvc ({ Value, Text }) */
export interface MappingDropdownItem {
  Value: string;
  Text: string;
}

export interface AssignDistrictsData {
  Executives: MappingDropdownItem[];
  Districts: MappingDropdownItem[];
}

export interface AssignDistrictsResponse {
  success: boolean;
  data: AssignDistrictsData;
}

export interface AssignedDistrictsResponse {
  success: boolean;
  data: number[];
}

export interface AssignDistrictsMutationResponse {
  success: boolean;
  message: string;
}

/**
 * Fetch Branch Executive users + district master lists for the
 * assign-districts form.
 */
export async function getAssignDistrictsForm(): Promise<AssignDistrictsData> {
  const response = await api.get(`${BASE_URL}/assign-districts`);
  const body = response.data as AssignDistrictsResponse;
  return body.data;
}

/**
 * Replace a Branch Executive's district mapping with the selected districts.
 */
export async function assignDistricts(
  userId: number,
  districtIds: number[]
): Promise<AssignDistrictsMutationResponse> {
  const response = await api.post(`${BASE_URL}/assign-districts`, {
    SelectedUserId: userId,
    SelectedDistrictIds: districtIds,
  });
  return response.data as AssignDistrictsMutationResponse;
}

/**
 * Fetch the districts currently assigned to a Branch Executive.
 * Falls back to the Users.DistrictID server-side when no mapping exists.
 */
export async function getAssignedDistricts(userId: number): Promise<number[]> {
  const response = await api.get(`${BASE_URL}/assigned-districts/${userId}`);
  const body = response.data as AssignedDistrictsResponse;
  return body.data || [];
}

export const branchExecutiveMappingApi = {
  getForm: getAssignDistrictsForm,
  assign: assignDistricts,
  getAssigned: getAssignedDistricts,

  queryKeys: {
    form: ['branchExecutiveMapping', 'form'] as const,
    assigned: (userId: number) =>
      ['branchExecutiveMapping', 'assigned', userId] as const,
  },
};
