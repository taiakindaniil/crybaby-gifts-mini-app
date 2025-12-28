import { useMemo } from 'react'
import type { Gift, GiftBackground } from '@/types/gift'
import type { GiftTree } from '@/lib/buildGiftTree'
import { buildGiftModelUrl, buildGiftPatternUrl } from '@/lib/giftUrls'

export type DrawerItem = {
  id: number | string
  title: string
  image?: string
  background?: GiftBackground
  pattern?: string
  url?: string
  gift_number?: number
}

type UseDrawerItemsParams = {
  editingFieldKey: string | null
  selectedGift: Gift | null | undefined
  gifts: string[] | undefined
  backgrounds: GiftBackground[] | undefined
  giftTree: GiftTree
}

export const useDrawerItems = ({
  editingFieldKey,
  selectedGift,
  gifts,
  backgrounds,
  giftTree,
}: UseDrawerItemsParams): DrawerItem[] => {
  return useMemo(() => {
    if (!editingFieldKey) return []

    // GIFTS
    if (editingFieldKey === 'gifts') {
      return (
        gifts?.map((giftName, id) => ({
          id,
          title: giftName,
          image: buildGiftModelUrl(giftName, 'Original'),
        })) ?? []
      )
    }

    if (!selectedGift) return []

    const { name: giftName, model, background } = selectedGift

    if (!giftName) return []

    // MODELS
    if (editingFieldKey === 'model') {
      return Object.keys(giftTree).map((modelName, id) => ({
        id,
        title: modelName,
        image: buildGiftModelUrl(giftName, modelName),
      }))
    }

    if (!model) return []

    // BACKGROUNDS
    if (editingFieldKey === 'background') {
      return Object.keys(giftTree[model]).map((backdropName, id) => ({
        id,
        title: backdropName,
        background: backgrounds?.find((bg) => bg.name === backdropName),
      }))
    }

    if (!background) return []

    // PATTERNS
    if (editingFieldKey === 'pattern') {
      const symbols = giftTree[model]?.[background.name]?.symbols ?? []
      return symbols.map((s) => ({
        id: s.gift_number,
        title: s.symbol,
        url: s.url,
        gift_number: s.gift_number,
        pattern: buildGiftPatternUrl(giftName, s.symbol),
      }))
    }

    return []
  }, [editingFieldKey, selectedGift, gifts, backgrounds, giftTree])
}

