import { useQuery } from '@tanstack/react-query'
import useApi from '@/api/hooks/useApi';

export const useGifts = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
        const res = await api.get('/proxy/changes-tg/gifts');
        return res.data;
  }})
}

export const useModels = (giftName: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['models', giftName],
    queryFn: async () => {
        const res = await api.get(`/proxy/changes-tg/models/${encodeURIComponent(giftName)}`);
        return res.data;
    }
  })
}

export const useBackgrounds = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['backgrounds'],
    queryFn: async () => {
        const res = await api.get('/proxy/changes-tg/backdrops?sort=asc');
        return res.data;
    }
  })
}

export const usePatterns = (giftName: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['patterns', giftName],
    queryFn: async () => {
        const res = await api.get(`/proxy/changes-tg/patterns/${encodeURIComponent(giftName)}`);
        return res.data;
    }
  })
}
