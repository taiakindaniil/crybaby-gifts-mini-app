import type { FC } from 'react'
import { GiftAnimation } from './GiftAnimation'
import type { Gift } from '@/types/gift'
import { PatternBackground } from './PatternBackground'
import { Plus } from 'lucide-react'

type Props = {
  gift?: Gift
  onClick: () => void
}

export const GiftCard: FC<Props> = ({ gift, onClick }) => {
  return (
    <div
      className="border-0 relative aspect-square bg-card rounded-lg flex items-center justify-center border border-border/50 overflow-hidden cursor-pointer active:scale-95 transition-transform"
      style={{
        background: `radial-gradient(circle, ${gift?.background?.hex.centerColor} 0%, ${gift?.background?.hex.edgeColor} 100%)`
      }}
      onClick={onClick}
    >
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

        <div className="z-12 absolute top-2 -right-7 w-25 text-center bg-zinc-800 rotate-45">
          <span className="text-xs text-white/80 font-medium">#{gift.id}</span>
        </div>

        <div className="relative z-10 flex items-center justify-center text-3xl">
          <GiftAnimation gift={gift} className="w-2/3 h-full/2" />
        </div>
      </> || <>
        <><Plus className="text-foreground/60" /></>
      </>}
    </div>
  )
}