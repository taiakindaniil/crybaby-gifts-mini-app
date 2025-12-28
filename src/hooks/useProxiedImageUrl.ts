import { useState, useEffect } from 'react'
import useApi from '@/api/hooks/useApi'

/**
 * Хук для загрузки изображения через прокси с обходом предупреждения ngrok
 * Возвращает blob URL для использования в backgroundImage или других CSS свойствах
 */
export const useProxiedImageUrl = (url: string | null | undefined): string | null => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const api = useApi()

  useEffect(() => {
    if (!url) {
      setImageUrl(null)
      return
    }

    let blobUrl: string | null = null
    let cancelled = false

    // Загружаем изображение через useApi с обходом предупреждения ngrok
    const loadImage = async () => {
      try {
        // Извлекаем путь из полного URL для использования с apiClient
        const urlObj = new URL(url)
        const path = urlObj.pathname + urlObj.search

        const response = await api.get(path, {
          responseType: 'blob',
        })

        const blob = response.data as Blob
        
        // Проверяем, не был ли эффект отменен во время загрузки
        if (cancelled) {
          URL.revokeObjectURL(URL.createObjectURL(blob))
          return
        }

        blobUrl = URL.createObjectURL(blob)
        setImageUrl(blobUrl)
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading proxied image:', err)
          setImageUrl(null)
        }
      }
    }

    loadImage()

    // Очищаем blob URL при размонтировании или изменении URL
    return () => {
      cancelled = true
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [url, api])

  return imageUrl
}

