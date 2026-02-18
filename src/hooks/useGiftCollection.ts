import { useQuery } from '@tanstack/react-query'
import useApi from '@/api/hooks/useApi'

export type GiftItem = {
  gift_number: number
  model: string
  backdrop: string
  symbol: string
  url: string
}

export type GiftCollectionResponse = {
  collection: string
  gifts: GiftItem[]
}

export const useGiftCollection = (giftName?: string, enabled = true) => {
  const api = useApi()

  return useQuery<GiftCollectionResponse>({
    queryKey: ['gift-collection', giftName],
    enabled: enabled && !!giftName,
    queryFn: async () => {
      const editedGiftName = giftName!.replace(/[\s'-]+/g, '').toLowerCase()

      const res = await api.get(`/proxy/api/gifts/${encodeURIComponent(editedGiftName)}`)
      return res.data
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
}
