/**
 * House Visit API
 * 
 * Endpoints:
 * - POST /api/housevisit/create
 * 
 * Features:
 * - Create house visit record for student
 * - Supports both PUC and Professional students
 */

import api from './client';

const BASE_URL = '/api/housevisit';

export interface CreateHouseVisitPayload {
  studentId: number;
  studentType: 'professional' | 'puc' | 'payana';
  // Additional fields will be added as needed
  visitDate?: string;
  volunteerId?: number;
  remarks?: string;
}

export interface HouseVisitResponse {
  success: boolean;
  message: string;
  houseVisitId?: number;
}

/**
 * Create a house visit record
 * 
 * @param payload - House visit data
 * @returns Created house visit confirmation
 * 
 * Session Requirements:
 * - User must be authenticated
 * - Volunteer can only create for assigned students
 */
export async function createHouseVisit(
  payload: CreateHouseVisitPayload
): Promise<HouseVisitResponse> {
  const url = `${BASE_URL}/create`;
  
  const response = await api.post(url, payload);
  
  if (!response.ok) {
    throw new Error(response.data?.message || 'Failed to create house visit');
  }
  
  return response.data as HouseVisitResponse;
}

/**
 * Generate house visit link for navigation
 */
export function getHouseVisitLink(
  studentId: number, 
  source: 'professional' | 'puc' | 'payana'
): string {
  return `/housevisit/create?studentId=${studentId}&source=${source}`;
}

/**
 * Hook-compatible wrapper
 */
export const houseVisitApi = {
  create: createHouseVisit,
  getLink: getHouseVisitLink,
};
