import apiClient from './apiClient'

export type ConstructorGiftResult = {
  gift_number: number
  model: string
  backdrop: string
  symbol: string
  url: string
}

/** Backend may return either a raw array or { key: string[] }. Normalize to string[]. */
function toArray(data: unknown, key: string): string[] {
  if (Array.isArray(data)) return data as string[]
  if (data && typeof data === 'object' && key in data) {
    const val = (data as Record<string, unknown>)[key]
    return Array.isArray(val) ? (val as string[]) : []
  }
  return []
}

export const getConstructorCollections = async (): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>('/constructor/collections')
  return toArray(data, 'collections')
}

export const getConstructorModels = async (collection: string): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>(
    `/constructor/collections/${encodeURIComponent(collection)}/models`
  )
  return toArray(data, 'models')
}

export const getConstructorBackdrops = async (
  collection: string,
  model: string
): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>(
    `/constructor/collections/${encodeURIComponent(collection)}/backdrops`,
    { params: { model } }
  )
  return toArray(data, 'backdrops')
}

export const getConstructorSymbols = async (
  collection: string,
  model: string,
  backdrop: string
): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>(
    `/constructor/collections/${encodeURIComponent(collection)}/symbols`,
    { params: { model, backdrop } }
  )
  return toArray(data, 'symbols')
}

export const getConstructorGift = async (
  collection: string,
  model: string,
  backdrop: string,
  symbol: string
): Promise<ConstructorGiftResult> => {
  const { data } = await apiClient.get<ConstructorGiftResult>(
    `/constructor/collections/${encodeURIComponent(collection)}/gift`,
    { params: { model, backdrop, symbol } }
  )
  return data
}

/** All unique backdrops across the catalog (for freeform mode). */
export const getConstructorAllBackdrops = async (): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>('/constructor/backdrops')
  return toArray(data, 'backdrops')
}

/** All symbols for a collection (for freeform mode). */
export const getConstructorCollectionAllSymbols = async (collection: string): Promise<string[]> => {
  const { data } = await apiClient.get<unknown>(
    `/constructor/collections/${encodeURIComponent(collection)}/all-symbols`
  )
  return toArray(data, 'symbols')
}

export type ConstructorSymbolWithUrl = {
  name: string
  collection: string
  url: string
}

/** All unique (collection, symbol) pairs with image URLs (for freeform mode). */
export const getConstructorAllSymbolsWithUrls = async (): Promise<ConstructorSymbolWithUrl[]> => {
  const { data } = await apiClient.get<{ symbols: ConstructorSymbolWithUrl[] }>(
    '/constructor/all-symbols-with-urls'
  )
  return Array.isArray(data?.symbols) ? data.symbols : []
}
