/**
 * PUC Student List API
 * 
 * Endpoint: GET /pucstudents/studentlist
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

const BASE_URL = '/pucstudents';

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
  const url = `${BASE_URL}/studentlist${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);

  if (!response.ok) {
    const errorData = response.data as StudentListError;
    throw new Error(errorData?.message || 'Failed to fetch PUC students');
  }

  // Transform PascalCase API response to camelCase
  const data = response.data as any;

  console.log('[PUCStudentApi] Raw response data:', JSON.stringify(data, null, 2));

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

  // API returns data in "Data" field, not "Students"
  const studentsArray = data.Data || data.Students || [];
  const districtsArray = data.Districts || [];

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
