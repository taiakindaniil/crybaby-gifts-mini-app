import { create } from 'zustand'
import type { Gift } from '@/types/Gift'

type GiftStore = {
    selectedGift: Gift | null;
    setSelectedGift: (gift: Gift | null) => void
}

export const useGiftStore = create<GiftStore>((set) => ({
    selectedGift: null,
    setSelectedGift: (gift) => {
        set(() => ({ selectedGift: gift }));
    },
}))