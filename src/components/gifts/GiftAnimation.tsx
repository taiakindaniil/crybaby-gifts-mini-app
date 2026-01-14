import Lottie from 'lottie-react'
import { useEffect, type FC } from 'react'
import type { Gift } from '@/types/gift'
import { getLottieURL } from '@/types/gift'
import { useQuery } from '@tanstack/react-query'
import useApi from '@/api/hooks/useApi'
import { proxyLottieUrl } from '@/lib/giftUrls'

type GiftAnimationProps = {
    gift: Gift
    className?: string
    autoplay?: boolean
}

export const GiftAnimation: FC<GiftAnimationProps> = ({ gift, className, autoplay }) => {
    const lottieURL = getLottieURL(gift)
    const api = useApi()
    
    const { data: animationData } = useQuery({
        queryKey: ['lottie', lottieURL],
        enabled: !!lottieURL,
        queryFn: async () => {
            if (!lottieURL) throw new Error('Lottie URL is not available')
            
            // Всегда используем прокси для Lottie файлов
            const proxiedUrl = proxyLottieUrl(lottieURL)
            
            // Извлекаем путь из полного URL для использования с apiClient
            const url = new URL(proxiedUrl)
            const path = url.pathname + url.search

            const res = await api.get(path)
            return res.data
        },
        staleTime: Infinity, // кеш всегда свежий
        // cacheTime: Infinity, // не удалять из кеша
        retry: 1,
    })

    useEffect(() => {
        
    }, [animationData])

    if (!animationData) return <span className={className}></span>

    return (
        <Lottie
            animationData={animationData}
            loop={false}
            className={className}
            autoPlay={autoplay}
            initialSegment={(autoplay == false && [1, 1] || undefined)}
        />
    )
}
