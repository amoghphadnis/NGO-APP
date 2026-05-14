import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dropdownApi } from '@/api/dropdownApi';
import { CastesResponse } from '@/types/api';

interface UseCastesReturn {
  data: CastesResponse[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const useCastes = (): UseCastesReturn => {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['castes'],
    queryFn: dropdownApi.getCastes,
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
