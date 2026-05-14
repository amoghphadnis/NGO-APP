import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dropdownApi } from '@/api/dropdownApi';
import { PlacesResponse } from '@/types/api';

interface UsePlacesReturn {
  data: PlacesResponse[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const usePlaces = (): UsePlacesReturn => {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['places'],
    queryFn: dropdownApi.getPlaces,
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
