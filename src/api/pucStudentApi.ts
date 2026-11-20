/**
 * PUC Student List API
 *
 * Endpoints (JWT required, both in the client's bearer allow-list):
 * - GET /puc-students/list?districtId&search  — student list
 * - GET /puc-students/districts               — district filter options
 *
 * Note: the legacy /pucstudents/studentlist route no longer exists on the
 * server (404) — do not revert to it.
 *
 * Features:
 * - Student name search
 * - District filtering
 * - Volunteer-based filtering (via session)
 * - Returns house visit status
 */

import {
  PUCStudentListResponse,
  StudentListError,
  StudentListQueryParams,
} from '@/types/studentList';
import api from './client';

const BASE_URL = '/puc-students';

/**
 * Fetch PUC student list for volunteers
 * 
 * @param params - Query parameters (search, districtId)
 * @returns Student list with districts dropdown
 * 
 * Session Requirements:
 * - UserRole: Determines Volunteer/Admin access
 * - UserID: Required for Volunteer filtering
 * 
 * Business Logic:
 * - Only students with ApprovalStatus='Approved' are returned
 * - Volunteer users only see assigned students
 * - Admin users see all students
 * - Optional search by student name
 * - Optional filter by district
 */
export async function getPUCStudentList(
  params?: StudentListQueryParams
): Promise<PUCStudentListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.districtId !== undefined) {
    queryParams.append('districtId', params.districtId.toString());
  }
  
  const queryString = queryParams.toString();
  const url = `${BASE_URL}/list${queryString ? `?${queryString}` : ''}`;

  const [response, districtsResponse] = await Promise.all([
    api.get(url),
    api.get(`${BASE_URL}/districts`).catch(() => null),
  ]);

  if (!response.ok) {
    const errorData = response.data as StudentListError;
    throw new Error(errorData?.message || 'Failed to fetch PUC students');
  }

  // Transform PascalCase API response to camelCase
  const data = response.data as any;

  const transformStudent = (s: any) => ({
    studentID: s.StudentID,
    studentName: s.StudentName,
    contactNumber: s.ContactNumber,
    address: s.Address,
    place: s.Place,
    taluka: s.Taluka,
    pinCode: s.PinCode,
    houseVisitLink: s.HouseVisitLink,
    districtName: s.DistrictName,
    collegeName: s.CollegeName,
    familyIncome: s.FamilyIncome,
    securedPercentage: s.SecuredPercentage,
    isVisited: s.IsVisited,
    approveStatus: s.ApproveStatus,
  });

  const transformDistrict = (d: any) => ({
    districtID: d.DistrictID ?? d.Id ?? d.Value,
    districtName: d.DistrictName ?? d.Name ?? d.Text,
  });

  // List endpoint returns { success, count, data: [...] }; legacy shapes kept for safety
  const studentsArray = data.data || data.Data || data.Students || [];
  // Districts come from the separate /districts endpoint ({ success, data: [...] })
  const districtsArray =
    districtsResponse?.data?.data ||
    districtsResponse?.data?.Data ||
    (Array.isArray(districtsResponse?.data) ? districtsResponse.data : null) ||
    data.Districts ||
    [];

  console.log('[PUCStudentApi] Parsed students count:', studentsArray.length);

  return {
    students: studentsArray.map(transformStudent),
    districts: districtsArray.map(transformDistrict),
  } as PUCStudentListResponse;
}

/**
 * Hook-compatible wrapper for React Query
 */
export const pucStudentApi = {
  getList: getPUCStudentList,
  
  // Query key for React Query
  queryKeys: {
    list: (params?: StudentListQueryParams) => 
      ['pucStudents', 'list', params] as const,
  },
};
