/**
 * Professional Student List API
 * 
 * Endpoint: GET /professionalstudents/studentlist
 * 
 * Features:
 * - Student name search
 * - District filtering
 * - Volunteer-based filtering (via session)
 * - Returns house visit status
 */

import {
    ProfessionalStudentListResponse,
    StudentListError,
    StudentListQueryParams,
} from '@/types/studentList';
import api from './client';

const BASE_URL = '/professionalstudents';

/**
 * Fetch professional student list for volunteers
 * 
 * @param params - Query parameters (search, districtId)
 * @returns Student list with districts dropdown
 * 
 * Session Requirements:
 * - UserRole: Determines Volunteer/Admin access
 * - UserID: Required for Volunteer filtering
 * 
 * Business Logic:
 * - Volunteer users only see assigned students
 * - Admin users see all students
 * - Optional search by student name
 * - Optional filter by district
 */
export async function getProfessionalStudentList(
  params?: StudentListQueryParams
): Promise<ProfessionalStudentListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.districtId !== undefined) {
    queryParams.append('districtId', params.districtId.toString());
  }
  
  const queryString = queryParams.toString();
  const url = `${BASE_URL}/studentlist${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  
  if (!response.ok) {
    const errorData = response.data as StudentListError;
    throw new Error(errorData?.message || 'Failed to fetch professional students');
  }
  
  return response.data as ProfessionalStudentListResponse;
}

/**
 * Hook-compatible wrapper for React Query
 */
export const professionalStudentApi = {
  getList: getProfessionalStudentList,
  
  // Query key for React Query
  queryKeys: {
    list: (params?: StudentListQueryParams) => 
      ['professionalStudents', 'list', params] as const,
  },
};
