import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dropdownApi } from '@/api/dropdownApi';
import { DistrictsResponse } from '@/types/api';

interface UseDistrictsReturn {
  data: DistrictsResponse[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const useDistricts = (): UseDistrictsReturn => {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['districts'],
    queryFn: dropdownApi.getDistricts,
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
