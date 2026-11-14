/**
 * Donor Management API
 *
 * Maps to web menu: "Donor Management" (legacy /Donor management pages)
 *
 * Base Route: /api/donors
 *
 * Endpoints:
 *   GET    /api/donors           → { success, data: Donor[] }
 *   POST   /api/donors           → body { DonorName, ... } → { success, message }
 *   PUT    /api/donors/{id}      → body { DonorName, ... } → { success, message }
 *   DELETE /api/donors/{id}      → { success, message }
 *
 * Requires JWT authentication; restricted to Admin / Admin(CEO) /
 * Program Manager server-side.
 */

import api from './client';

const BASE_URL = '/donors';

export interface Donor {
  DonorID: number;
  DonorName: string;
  Email: string | null;
  ContactNumber: string | null;
  Address: string | null;
  IsActive: boolean;
}

export interface DonorListResponse {
  success: boolean;
  data: Donor[];
}

export interface DonorMutationResponse {
  success: boolean;
  message: string;
}

export interface DonorPayload {
  DonorName: string;
  Email?: string | null;
  ContactNumber?: string | null;
  Address?: string | null;
}

export async function getDonors(): Promise<Donor[]> {
  const response = await api.get(BASE_URL);
  const body = response.data as DonorListResponse;
  return body.data || [];
}

export async function createDonor(payload: DonorPayload): Promise<DonorMutationResponse> {
  const response = await api.post(BASE_URL, payload);
  return response.data as DonorMutationResponse;
}

export async function updateDonor(
  id: number,
  payload: DonorPayload
): Promise<DonorMutationResponse> {
  const response = await api.put(`${BASE_URL}/${id}`, payload);
  return response.data as DonorMutationResponse;
}

export async function deleteDonor(id: number): Promise<DonorMutationResponse> {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data as DonorMutationResponse;
}

export const donorApi = {
  list: getDonors,
  create: createDonor,
  update: updateDonor,
  delete: deleteDonor,

  queryKeys: {
    list: () => ['donors', 'list'] as const,
  },
};
