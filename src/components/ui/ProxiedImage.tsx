import { useState, useEffect, type ImgHTMLAttributes } from 'react'
import useApi from '@/api/hooks/useApi'

type ProxiedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

/**
 * Компонент для загрузки изображений через прокси с обходом предупреждения ngrok
 */
export const ProxiedImage: React.FC<ProxiedImageProps> = ({ src, ...imgProps }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const api = useApi()

  useEffect(() => {
    let blobUrl: string | null = null
    let cancelled = false

    // Загружаем изображение через useApi с обходом предупреждения ngrok
    const loadImage = async () => {
      try {
        // Извлекаем путь из полного URL для использования с apiClient
        const url = new URL(src)
        const path = url.pathname + url.search

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
        setError(false)
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading proxied image:', err)
          setError(true)
        }
      }
    }

    loadImage()

    // Очищаем blob URL при размонтировании или изменении src
    return () => {
      cancelled = true
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [src, api])

  if (error) {
    return <img {...imgProps} src="" alt={imgProps.alt || ''} style={{ opacity: 0 }} />
  }

  if (!imageUrl) {
    return <div className={imgProps.className} style={{ ...imgProps.style, backgroundColor: 'transparent' }} />
  }

  return <img {...imgProps} src={imageUrl} />
}

