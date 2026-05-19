/**
 * PUC Dropdowns Hook
 * Fetches and caches PUC form dropdown data using React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getPUCDropdowns } from '@/api/pucApi';
import { NormalizedDropdowns } from '@/api/transformers/normalizeDropdowns';

interface UsePUCDropdownsReturn {
  data: NormalizedDropdowns | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePUCDropdowns(): UsePUCDropdownsReturn {
  const query = useQuery({
    queryKey: ['dropdowns', 'puc'],
    queryFn: getPUCDropdowns,
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
