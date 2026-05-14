import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dropdownApi } from '@/api/dropdownApi';
import { CoursesResponse } from '@/types/api';

interface UseCoursesReturn {
  data: CoursesResponse[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const useCourses = (): UseCoursesReturn => {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: dropdownApi.getCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    data: apiData?.Data,
    isLoading,
    error,
    refetch,
  };
};
