import Lottie from 'lottie-react'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import type { Gift } from '@/types/Gift'

type GiftAnimationProps = {
    gift: Gift
    className?: string
}

export const GiftAnimation: FC<GiftAnimationProps> = ({ gift, className }) => {
    const [animationData, setAnimationData] = useState<unknown | null>(null)

    useEffect(() => {
        let isMounted = true
        if (!gift.lottieUrl) {
            setAnimationData(null)
            return
        }

        const controller = new AbortController()

        ;(async () => {
            try {
                const res = await fetch(gift.lottieUrl!, { signal: controller.signal })
                if (!res.ok) return
                const json = await res.json()
                if (isMounted) {
                    setAnimationData(json)
                }
            } catch {
                if (isMounted) setAnimationData(null)
            }
        })()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [gift.lottieUrl])

    if (!animationData) return <span className={className}>{gift.icon}</span>

    return <Lottie animationData={animationData} loop={false} className={className} />
}