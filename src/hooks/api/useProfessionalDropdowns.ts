/**
 * Professional Dropdowns Hook
 * Fetches and caches Professional form dropdown data using React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getProfessionalDropdowns } from '@/api/professionalApi';
import { NormalizedDropdowns } from '@/api/transformers/normalizeDropdowns';

interface UseProfessionalDropdownsReturn {
  data: NormalizedDropdowns | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfessionalDropdowns(): UseProfessionalDropdownsReturn {
  const query = useQuery({
    queryKey: ['dropdowns', 'professional'],
    queryFn: getProfessionalDropdowns,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Debug: log query state
  console.log('[useProfessionalDropdowns] Query state:', {
    isLoading: query.isLoading,
    error: query.error,
    data: query.data,
  });

  // Add fallback empty arrays to prevent undefined errors
  const dropdownData = query.data?.success ? query.data.data : undefined;
  const safeData: NormalizedDropdowns = dropdownData ?? {
    districts: [],
    genders: [],
    castes: [],
    courses: [],
    places: [],
  };

  console.log('[useProfessionalDropdowns] Safe dropdown data:', safeData);

  return {
    data: safeData,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
