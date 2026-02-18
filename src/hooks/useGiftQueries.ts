import { useQuery } from '@tanstack/react-query'
import useApi from '@/api/hooks/useApi';

export const useGifts = (opts?: { enabled?: boolean }) => {
  const api = useApi();
  const enabled = opts?.enabled ?? true
  return useQuery({
    queryKey: ['gifts'],
    enabled,
    queryFn: async () => {
        const res = await api.get('/proxy/changes-tg/gifts');
        return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}

export const useModels = (giftName: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['models', giftName],
    queryFn: async () => {
        const res = await api.get(`/proxy/changes-tg/models/${encodeURIComponent(giftName)}`);
        return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}

export const useBackgrounds = (opts?: { enabled?: boolean }) => {
  const api = useApi();
  const enabled = opts?.enabled ?? true
  return useQuery({
    queryKey: ['backgrounds'],
    enabled,
    queryFn: async () => {
        const res = await api.get('/proxy/changes-tg/backdrops?sort=asc');
        return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}

export const usePatterns = (giftName: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['patterns', giftName],
    queryFn: async () => {
        const res = await api.get(`/proxy/changes-tg/patterns/${encodeURIComponent(giftName)}`);
        return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}
