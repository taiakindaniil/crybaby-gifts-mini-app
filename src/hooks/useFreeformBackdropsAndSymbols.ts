import { useQuery } from '@tanstack/react-query'
import { getConstructorAllBackdrops } from '@/api/constructor'

const STALE_TIME = 1000 * 60 * 60 * 24

function ensureStringArray(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : []
}

export function useFreeformBackdropsAndSymbols(enabled: boolean) {
  const backdropsQuery = useQuery({
    queryKey: ['constructor', 'all-backdrops'],
    queryFn: getConstructorAllBackdrops,
    enabled,
    staleTime: STALE_TIME,
  })

  return {
    backdrops: ensureStringArray(backdropsQuery.data),
    isLoadingBackdrops: backdropsQuery.isLoading,
  }
}
