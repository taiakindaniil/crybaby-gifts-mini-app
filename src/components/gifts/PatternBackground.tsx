import React from 'react'

type PatternItem = {
  left: number
  top: number
  size: number
  opacity: number
}

type PatternBackgroundProps = {
  image: string
  className?: string
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  image,
  className,
}) => {
  // ЛЕВО-СТОРОННИЕ БАЗОВЫЕ ЭЛЕМЕНТЫ
  const base: PatternItem[] = [
    { left: 25.5, top: 7, size: 7.2, opacity: 0.1 },
    { left: -0.5, top: 40, size: 7.2, opacity: 0.1 },

    { left: 9.3, top: 23.5, size: 7.2, opacity: 0.15 },
    { left: 6.3, top: 65, size: 7.2, opacity: 0.15 },
    { left: 12.8, top: 86.2, size: 7.2, opacity: 0.15 },

    { left: 34, top: 19.5, size: 9.6, opacity: 0.24 },
    { left: 22.2, top: 32, size: 7.2, opacity: 0.24 },
    { left: 16.5, top: 48.5, size: 12, opacity: 0.24 },
    { left: 24, top: 72.5, size: 8.4, opacity: 0.24 },
  ]

  // ГЕНЕРАЦИЯ ЗЕРКАЛЬНЫХ
  const mirrored = base.flatMap((item) => [
    item,
    { ...item, left: 100 - item.left },
  ])

  // ЦЕНТРАЛЬНЫЕ ЭЛЕМЕНТЫ
  const center: PatternItem[] = [
    { left: 50, top: 9, size: 7.2, opacity: 0.15 },
    { left: 50, top: 77, size: 8.4, opacity: 0.24 },
    { left: 50, top: 95, size: 7.2, opacity: 0.1 },
  ]

  const pattern = [...mirrored, ...center]

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {pattern.map((item, index) => (
        <div
          key={index}
          className="pattern-item"
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            top: `${item.top}%`,
            width: `${item.size}%`,
            height: `${item.size}%`,
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: item.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
