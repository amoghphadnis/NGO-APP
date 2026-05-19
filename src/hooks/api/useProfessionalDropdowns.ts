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

  return {
    data: query.data?.success ? query.data.data : undefined,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
