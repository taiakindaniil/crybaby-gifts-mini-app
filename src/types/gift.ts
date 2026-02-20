export type GiftBackground = {
    name: string
    backdropId: number
    centerColor: number,
    edgeColor: number,
    patternColor: number,
    textColor: number,
    hex: {
        centerColor: string
        edgeColor: string
        patternColor: string
        textColor: string
    }
}

export type Gift = {
    id: number
    name: string
    model?: string
    background?: GiftBackground
    pattern?: string
    /** Коллекция узора (для freeform: узор из другой коллекции). Если задано — по ней строится URL картинки узора. */
    patternCollection?: string
    /** URL из API (например https://t.me/nft/durovscap-417) для кнопки «Открыть в Telegram» */
    url?: string
}

import { buildGiftLottieUrl } from '@/lib/giftUrls'

export const getLottieURL = (gift: Gift) => {
    if (!gift.name) return null
    const model = gift.model || "Original"
    return buildGiftLottieUrl(gift.name, model)
}