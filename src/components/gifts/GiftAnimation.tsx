import Lottie from 'lottie-react'
import { useEffect, type FC } from 'react'
import type { Gift } from '@/types/gift'
import { getLottieURL } from '@/types/gift'
import { useQuery } from '@tanstack/react-query'

type GiftAnimationProps = {
    gift: Gift
    className?: string
    autoplay?: boolean
}

export const GiftAnimation: FC<GiftAnimationProps> = ({ gift, className, autoplay }) => {
    const lottieURL = getLottieURL(gift)

    const { data: animationData } = useQuery({
        queryKey: ['lottie', lottieURL],
        enabled: !!lottieURL,
        queryFn: async () => {
            const res = await fetch(lottieURL!)
            if (!res.ok) throw new Error('Failed to load lottie')
            return res.json()
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
        />
    )
}
