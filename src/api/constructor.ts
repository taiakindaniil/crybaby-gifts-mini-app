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
