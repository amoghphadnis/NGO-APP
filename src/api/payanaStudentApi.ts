/**
 * Payana Student List API
 *
 * Endpoints (JWT required, both in the client's bearer allow-list):
 * - GET /payana-students/list?districtId&search  — student list
 * - GET /payana-students/districts               — district filter options
 *
 * Note: the legacy /payanastudents/studentlist route no longer exists on the server
 * (404) — do not revert to it.
 */

import {
  PayanaStudentListResponse,
  StudentListError,
  StudentListQueryParams,
} from '@/types/studentList';
import api from './client';

const BASE_URL = '/payana-students';

/**
 * Fetch Payana student list for volunteers
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
export async function getPayanaStudentList(
  params?: StudentListQueryParams
): Promise<PayanaStudentListResponse> {
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
    throw new Error(errorData?.message || 'Failed to fetch Payana students');
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
    districtID: d.DistrictID,
    districtName: d.DistrictName,
  });

  // List endpoint returns { success, count, data: [...] }; legacy shapes kept for safety
  const studentsArray = data.data || data.Data || data.Students || [];
  // Districts come from the separate /districts endpoint ({ success, data: [...] })
  const districtsRaw = districtsResponse?.data?.data || districtsResponse?.data?.Data || data.Districts || [];
  const districtsArray = districtsRaw;

  return {
    students: studentsArray.map(transformStudent),
    districts: districtsArray.map(transformDistrict),
  } as PayanaStudentListResponse;
}

/**
 * Hook-compatible wrapper for React Query
 */
export const payanaStudentApi = {
  getList: getPayanaStudentList,

  // Query key for React Query
  queryKeys: {
    list: (params?: StudentListQueryParams) =>
      ['payanaStudents', 'list', params] as const,
  },
};
