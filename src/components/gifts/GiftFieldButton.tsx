import type { FC } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Gift } from '@/types/gift'
import { Spinner } from '../ui/spinner'
import { useTranslation } from '@/i18n'

type GiftFieldButtonProps = {
  label: string
  fieldKey: string
  gift: Gift | null | undefined
  isLoading: boolean
  isDisabled: boolean
  onClick: () => void
}

const getFieldValue = (gift: Gift | null | undefined, fieldKey: string): string => {
  if (!gift) return 'All'

  switch (fieldKey) {
    case 'gifts':
      return gift.name ?? 'All'
    case 'model':
      return gift.model ?? 'All'
    case 'background':
      return gift.background?.name ?? 'All'
    case 'pattern':
      return gift.pattern ?? 'All'
    default:
      return 'All'
  }
}

const isFieldDisabled = (
  fieldKey: string,
  gift: Gift | null | undefined,
  isLoading: boolean
): boolean => {
  if (isLoading) return true

  switch (fieldKey) {
    case 'model':
      return !gift?.name
    case 'background':
      return !gift?.name || !gift?.model
    case 'pattern':
      return !gift?.name || !gift?.model || !gift?.background
    default:
      return false
  }
}

export const GiftFieldButton: FC<GiftFieldButtonProps> = ({
  label,
  fieldKey,
  gift,
  isLoading,
  isDisabled,
  onClick,
}) => {
  const { t } = useTranslation()
  const disabled = isDisabled || isFieldDisabled(fieldKey, gift, isLoading)
  const rawValue = getFieldValue(gift, fieldKey)
  const value = rawValue === 'All' ? t('common.all') : rawValue

  return (
    <button
      className="flex w-full items-center justify-between text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      disabled={disabled}
    >
      <span className="flex-1 pl-3 py-3 bg-card text-sm text-card-foreground/90">
        {label}
      </span>
      <div className="flex flex-2 px-5 py-3 justify-between items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        {isLoading ? (
          <Spinner className="text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-foreground/60" />
        )}
      </div>
    </button>
  )
}

