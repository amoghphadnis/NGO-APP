import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dropdownApi } from '@/api/dropdownApi';
import { GendersResponse } from '@/types/api';

interface UseGendersReturn {
  data: GendersResponse[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const useGenders = (): UseGendersReturn => {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['genders'],
    queryFn: dropdownApi.getGenders,
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
