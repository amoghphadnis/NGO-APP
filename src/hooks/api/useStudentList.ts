/**
 * React Query hooks for Volunteer Student List APIs
 * 
 * Features:
 * - Professional student list
 * - PUC student list
 * - District filtering
 * - Search by name
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  StudentType,
  StudentListQueryParams,
  ProfessionalStudentListResponse,
  PUCStudentListResponse,
} from '@/types/studentList';
import { professionalStudentApi } from '@/api/professionalStudentApi';
import { pucStudentApi } from '@/api/pucStudentApi';

// ============================================================================
// Query Keys
// ============================================================================

export const studentListKeys = {
  all: ['students', 'list'] as const,
  professional: (params?: StudentListQueryParams) =>
    [...studentListKeys.all, 'professional', params] as const,
  puc: (params?: StudentListQueryParams) =>
    [...studentListKeys.all, 'puc', params] as const,
};

// ============================================================================
// Professional Student List Hook
// ============================================================================

export function useProfessionalStudentList(
  params?: StudentListQueryParams
): UseQueryResult<ProfessionalStudentListResponse, Error> {
  return useQuery({
    queryKey: studentListKeys.professional(params),
    queryFn: () => professionalStudentApi.getList(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: true,
  });
}

// ============================================================================
// PUC Student List Hook
// ============================================================================

export function usePUCStudentList(
  params?: StudentListQueryParams
): UseQueryResult<PUCStudentListResponse, Error> {
  return useQuery({
    queryKey: studentListKeys.puc(params),
    queryFn: () => pucStudentApi.getList(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: true,
  });
}

// ============================================================================
// Generic Student List Hook
// ============================================================================

export function useStudentList(
  studentType: StudentType,
  params?: StudentListQueryParams
) {
  const professionalQuery = useProfessionalStudentList(
    studentType === 'professional' ? params : undefined
  );
  
  const pucQuery = usePUCStudentList(
    studentType === 'puc' ? params : undefined
  );
  
  return studentType === 'professional' ? professionalQuery : pucQuery;
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Hook to get district options for dropdown
 */
export function useDistrictOptions(studentType: StudentType, params?: StudentListQueryParams) {
  const query = useStudentList(studentType, params);
  
  return {
    districts: query.data?.districts || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
