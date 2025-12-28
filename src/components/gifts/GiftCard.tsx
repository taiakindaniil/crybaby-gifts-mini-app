import type { FC } from 'react'
import { useRef } from 'react'
// import { GiftAnimation } from './GiftAnimation'
import type { Gift } from '@/types/gift'
import { PatternBackground } from './PatternBackground'
import { Plus } from 'lucide-react'

type Props = {
  gift?: Gift | null
  onClick: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
  draggable?: boolean
  isDragging?: boolean
}

export const GiftCard: FC<Props> = ({ 
  gift, 
  onClick, 
  onDragStart, 
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  draggable = false,
  isDragging = false
}) => {
  const touchStartTime = useRef<number>(0)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const isLongPress = useRef<boolean>(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const isScrolling = useRef<boolean>(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gift || !draggable) return
    
    const touch = e.touches[0]
    touchStartTime.current = Date.now()
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    isLongPress.current = false
    isScrolling.current = false

    // Запускаем таймер для определения долгого нажатия
    longPressTimer.current = setTimeout(() => {
      // Проверяем, не начался ли скролл за это время
      if (!isScrolling.current) {
        isLongPress.current = true
        if (onTouchStart) {
          onTouchStart(e)
        }
        // Предотвращаем скролл при начале перетаскивания
        e.preventDefault()
      }
    }, 1500) // 1.5 секунды для активации drag
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gift || !draggable) return

    if (!touchStartPos.current) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)
    
    // Определяем направление движения
    // Если вертикальное движение больше горизонтального в 1.5 раза - это скролл
    const isVerticalScroll = deltaY > deltaX * 1.5 && deltaY > 15

    if (isVerticalScroll) {
      // Это скролл - отменяем таймер и разрешаем скролл
      isScrolling.current = true
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      if (isLongPress.current) {
        // Если уже начали drag, завершаем его
        isLongPress.current = false
        if (onTouchEnd) {
          onTouchEnd(e)
        }
      }
      return // Не предотвращаем скролл
    }

    // Если это долгое нажатие и началось перетаскивание
    if (isLongPress.current) {
      e.preventDefault() // Предотвращаем скролл
      if (onTouchMove) {
        onTouchMove(e)
      }
    } else if (touchStartPos.current) {
      // Если перемещение больше 10px и это не вертикальный скролл, начинаем drag
      if (deltaX > 10 || (deltaY > 10 && !isVerticalScroll)) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current)
          longPressTimer.current = null
        }
        isLongPress.current = true
        if (onTouchStart) {
          onTouchStart(e)
        }
        e.preventDefault()
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Если это был клик (не долгое нажатие и не скролл), вызываем onClick
    if (!isLongPress.current && !isScrolling.current && Date.now() - touchStartTime.current < 300) {
      onClick()
    }

    if (isLongPress.current && onTouchEnd) {
      onTouchEnd(e)
    }

    isLongPress.current = false
    isScrolling.current = false
    touchStartPos.current = null
  }

  return (
    <div
      style={{
        ...(gift?.background ? {
          background: `radial-gradient(circle, ${gift.background.hex.centerColor} 0%, ${gift.background.hex.edgeColor} 100%)`
        } : {}),
        ...(isDragging ? {
          transform: 'scale(1.1)',
          zIndex: 1000,
        } : {})
      }}
      className={`${!gift?.background ? 'bg-card' : ''} border-0 relative aspect-square rounded-lg flex items-center justify-center border border-border/50 cursor-pointer active:scale-95 transition-transform select-none ${draggable && gift ? 'cursor-grab active:cursor-grabbing touch-none' : ''} ${isDragging ? 'shadow-lg' : ''}`}
      onClick={onClick}
      draggable={draggable && !!gift}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
        {gift && <>
          {gift?.pattern && <PatternBackground
            image={`https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(gift.name)}/png/${encodeURIComponent(gift.pattern)}.png`.replace(/'/g, "%27")}
          /> }

          <div className="absolute inset-0 opacity-[0.03]">
            <div className="grid grid-cols-3 gap-0.5 p-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full h-full bg-foreground rounded-[2px]"></div>
              ))}
            </div>
          </div>

          <div className="absolute top-2 -right-7 w-25 text-center bg-zinc-800 rotate-45 z-12 ">
            <span className="text-xs text-white/80 font-medium">#{gift.id}</span>
          </div>

          <div className="relative z-10 flex items-center justify-center text-3xl">
            <img src={`https://cdn.changes.tg/gifts/models/${encodeURIComponent(gift.name)}/png/${encodeURIComponent(gift.model || 'Original')}.png`} className="w-2/3 h-full/2" />
            {/* <GiftAnimation gift={gift} autoplay={false} className="w-2/3 h-full/2" /> */}
          </div>
        </> || <>
          <><Plus className="text-foreground/60" /></>
        </>}
      </div>
    </div>
  )
}