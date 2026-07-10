/**
 * Semi Professional Student List API
 *
 * Endpoint:
 * - GET /api/semiprofessional/studentlist
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

const BASE_URL = '/semiprofessional';

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

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/studentlist${queryString ? `?${queryString}` : ''}`;

  const response = await api.get(url);

  if (!response.ok) {
    const errorData = response.data as StudentListError;
    throw new Error(errorData?.Message || errorData?.message || 'Failed to fetch Semi Professional students');
  }

  const data = response.data as any;

  console.log('[SemiProfessionalStudentApi] Raw response data:', JSON.stringify(data, null, 2));

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
    districtID: d.Id ?? d.DistrictID,
    districtName: d.Name ?? d.DistrictName,
  });

  const studentsArray = data.Data || data.Students || [];
  const districtsArray = data.Districts || [];

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
