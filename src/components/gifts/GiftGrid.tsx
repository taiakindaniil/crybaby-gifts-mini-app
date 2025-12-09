import type { FC } from 'react'
import { GiftCard } from "./GiftCard";
import type { Gift } from '@/types/Gift';

type GiftGridProps = {
  gifts?: Gift[]
  onSelect: (gift: Gift) => void
}

export const GiftGrid: FC<GiftGridProps> = ({ gifts, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {gifts?.map((gift: Gift) => (
        <GiftCard key={gift.id} gift={gift} onClick={() => onSelect(gift)} />
      ))}
    </div>
  );
}