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
}

export const getLottieURL = (gift: Gift) => {
    if (!gift.name) return null
    // console.log(`https://cdn.changes.tg/gifts/models/${encodeURIComponent(gift.name)}/lottie/${encodeURIComponent(gift.model ? "Original" : gift.model!)}.json`)
    return `https://cdn.changes.tg/gifts/models/${encodeURIComponent(gift.name)}/lottie/${encodeURIComponent(gift.model === undefined ? "Original" : gift.model!)}.json`
}