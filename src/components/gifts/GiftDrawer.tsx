import type { FC } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import type { Gift } from '@/types/gift'
import { useGiftStore, giftFields } from '@/stores/giftStore'
import { SearchDrawer } from '../search/SearchDrawer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGiftCell } from '@/api/gifts'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { useBackgrounds, useGifts } from '@/hooks/useGiftQueries'
import { useGiftCollection } from '@/hooks/useGiftCollection'
import { buildGiftTree } from '@/lib/buildGiftTree'
import { useMemo } from 'react'
import { useDrawerItems, type DrawerItem } from '@/hooks/useDrawerItems'
import { GiftPreview } from './GiftPreview'
import { GiftFieldButton } from './GiftFieldButton'


export const GiftDrawer: FC = () => {
  const selectedCell = useGiftStore((state) => state.selectedCell)
  const clearSelectedCell = useGiftStore((state) => state.clearSelectedCell)
  const editingFieldKey = useGiftStore((state) => state.editingFieldKey)
  const setEditingFieldKey = useGiftStore((state) => state.setEditingFieldKey)
  const selectField = useGiftStore((s) => s.selectField)

  const giftName = selectedCell?.gift?.name
  const { data: collectionData, isLoading: giftCollectionLoading } = useGiftCollection(giftName)
  const { data: gifts, isLoading: giftsLoading } = useGifts()
  const { data: backgrounds } = useBackgrounds()

  const giftTree = useMemo(() => {
    if (!collectionData?.gifts) return {}
    return buildGiftTree(collectionData.gifts)
  }, [collectionData])

  const drawerItems = useDrawerItems({
    editingFieldKey,
    selectedGift: selectedCell?.gift,
    gifts,
    backgrounds,
    giftTree,
  })

  const handleSelect = (item: DrawerItem) => {
    if (!editingFieldKey) return

    if (editingFieldKey === 'background') {
      selectField('background', item.title, { background: item.background })
    } else if (editingFieldKey === 'pattern') {
      selectField('pattern', item.title)
      if (item.id !== undefined) {
        selectField('id', String(item.id))
      }
    } else {
      selectField(editingFieldKey, item.title)
    }

    setEditingFieldKey(null)
  }

  const queryClient = useQueryClient()

  const updateGiftMutation = useMutation({
    mutationFn: (gift?: Gift | null) => {
      if (!selectedCell) {
        throw new Error('No selected cell')
      }
      return updateGiftCell(
        selectedCell.gridId,
        selectedCell.rowIndex,
        selectedCell.cellIndex,
        gift !== undefined ? gift : (selectedCell.gift ?? null)
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
      clearSelectedCell()
    },
    onError: () => {
      toast('Error', {
        description: 'Failed to update gift',
      })
    },
  })

  const handleDelete = () => {
    updateGiftMutation.mutate(null)
  }

  const handleApply = () => {
    updateGiftMutation.mutate(selectedCell?.gift ?? null)
  }

  return (
    <Drawer
      open={!!selectedCell}
      onOpenChange={(open) => {
        if (!open) {
          clearSelectedCell()
        }
      }}
      repositionInputs={false}
    >
      <DrawerContent className="z-1000 h-screen rounded-none bg-transparent border-none [&>div:first-child]:hidden">
        {selectedCell !== undefined && (
          <div className="flex w-full h-full flex-col gap-3 pb-6 bg-background rounded-t-3xl text-white overflow-y-auto">
            <GiftPreview gift={selectedCell?.gift} onDelete={handleDelete} />

            <div>
              <div className="bg-card/50 mx-4 divide-y divide-border rounded-xl border border-solid border-border overflow-hidden">
                {giftFields.map((field, i) => {
                  const fieldLoading = i === 0 ? giftsLoading : giftCollectionLoading

                  return (
                    <GiftFieldButton
                      key={field.key}
                      label={field.label}
                      fieldKey={field.key}
                      gift={selectedCell?.gift}
                      isLoading={fieldLoading}
                      isDisabled={false}
                      onClick={() => setEditingFieldKey(field.key)}
                    />
                  )
                })}
              </div>

              <DrawerFooter className="px-4 pb-4">
                <Button
                  size="default"
                  className="h-11 w-full rounded-full text-white font-semibold"
                  onClick={handleApply}
                  disabled={updateGiftMutation.isPending}
                >
                  {updateGiftMutation.isPending ? <Spinner /> : 'Apply'}
                </Button>
              </DrawerFooter>
            </div>
          </div>
        )}

        <SearchDrawer
          open={!!editingFieldKey}
          onOpenChange={(open) => {
            if (!open) {
              setEditingFieldKey(null)
            }
          }}
          title={giftFields.find((f) => f.key === editingFieldKey)?.label ?? ''}
          items={drawerItems.map((item) => ({
            ...item,
            id: String(item.id),
          }))}
          handleSelect={handleSelect}
        />
      </DrawerContent>
    </Drawer>
  )
}