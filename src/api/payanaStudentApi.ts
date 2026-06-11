/**
 * Payana Student List API
 *
 * Endpoint: GET /payanastudents/studentlist
 *
 * Features:
 * - Student name search
 * - District filtering
 * - Volunteer-based filtering (via session)
 * - Returns house visit status
 */

import {
  PayanaStudentListResponse,
  StudentListError,
  StudentListQueryParams,
} from '@/types/studentList';
import api from './client';

const BASE_URL = '/payanastudents';

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
  const url = `${BASE_URL}/studentlist${queryString ? `?${queryString}` : ''}`;

  const response = await api.get(url);

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

  return {
    students: (data.Students || []).map(transformStudent),
    districts: (data.Districts || []).map(transformDistrict),
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
