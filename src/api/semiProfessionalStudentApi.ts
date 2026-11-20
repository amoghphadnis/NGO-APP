/**
 * Semi Professional Student List API
 *
 * Endpoints (JWT required, both in the client's bearer allow-list):
 * - GET /semi-professional-students/list?districtId&search  — student list
 * - GET /semi-professional-students/districts               — district filter options
 *
 * Note: the legacy /semiprofessional/studentlist route no longer exists on
 * the server (404) — do not revert to it.
 *
 * Business Logic:
 * - Only students with ApproveStatus='Approved' are returned
 * - Volunteer users only see assigned students
 * - Non-volunteer users see students filtered by their district
 * - Optional search by student name (partial match on StudentName)
 * - Districts dropdown returned alongside students
 */

import api from './client';
import {
  SemiProfessionalStudent,
  SemiProfessionalStudentListResponse,
  StudentListQueryParams,
  District,
} from '@/types/studentList';

const BASE_URL = '/semi-professional-students';

interface StudentListError {
  Message?: string;
  message?: string;
}

/**
 * Fetch Semi Professional student list
 *
 * @param params - Query parameters (search)
 * @returns Student list with districts dropdown
 */
export async function getSemiProfessionalStudentList(
  params?: StudentListQueryParams
): Promise<SemiProfessionalStudentListResponse> {
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
    throw new Error(errorData?.Message || errorData?.message || 'Failed to fetch Semi Professional students');
  }

  const data = response.data as any;

  const transformStudent = (s: any): SemiProfessionalStudent => ({
    studentID: s.StudentID,
    studentName: s.StudentName,
    contactNumber: s.ContactNumber,
    address: s.Address,
    place: s.Place,
    taluka: s.Taluka,
    houseVisitLink: s.HouseVisitLink,
    districtName: s.DistrictName,
    collegeName: s.CollegeName,
    familyIncome: s.FamilyIncome,
    securedPercentage: s.SecuredPercentage,
    isVisited: s.IsVisited,
    approveStatus: s.ApproveStatus,
  });

  const transformDistrict = (d: any): District => ({
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

  console.log('[SemiProfessionalStudentApi] Parsed students count:', studentsArray.length);

  return {
    students: studentsArray.map(transformStudent),
    districts: districtsArray.map(transformDistrict),
  } as SemiProfessionalStudentListResponse;
}

/**
 * Hook-compatible wrapper for React Query
 */
export const semiProfessionalStudentApi = {
  getList: getSemiProfessionalStudentList,

  queryKeys: {
    list: (params?: StudentListQueryParams) =>
      ['semiProfessionalStudents', 'list', params] as const,
  },
};
