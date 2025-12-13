import { useEffect, useState, type FC } from 'react'
import { ChevronDown, Pin } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { GiftAnimation } from './GiftAnimation'

// import { useGiftDataStore } from '@/stores/giftDataStore'
import type { Gift, GiftBackground } from '@/types/gift'
import { useGiftStore, giftFields } from '@/stores/giftStore'
import { SearchDrawer } from '../search/SearchDrawer'
import { PatternBackground } from './PatternBackground'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGiftCell } from '@/api/gifts'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { useBackgrounds, useGifts } from '@/hooks/useGiftQueries'
import { fetchModels, fetchPatterns } from '@/api/changes'


export const GiftDrawer: FC = () => {
  const selectedCell = useGiftStore((state) => state.selectedCell)
  const setSelectedCell = useGiftStore((state) => state.setSelectedCell)

  const editingFieldKey = useGiftStore((state) => state.editingFieldKey)
  const setEditingFieldKey = useGiftStore((state) => state.setEditingFieldKey)

  const selectField = useGiftStore((s) => s.selectField)

  const [drawerItems, setDrawerItems] = useState<{ id: number, title: string, image?: string, background?: GiftBackground }[]>([])

  const { data: gifts, isLoading: giftsLoading } = useGifts()
  const { data: backgrounds, isLoading: backgroundLoading } = useBackgrounds()

  // Динамические запросы для моделей и паттернов через React Query
  const fetchModelsQuery = async () => {
    if (!selectedCell?.gift?.name) return []
    const data = await fetchModels(selectedCell.gift.name)
    return data
  }

  const fetchPatternsQuery = async () => {
    if (!selectedCell?.gift?.name) return []
    const data = await fetchPatterns(selectedCell.gift.name)
    return data
  }


  const handleSelect = (item) => {
    if (!editingFieldKey) return

    if (editingFieldKey === 'background') {
      selectField(editingFieldKey, item.title, { background: item.background })
    } else {
      selectField(editingFieldKey, item.title)
    }

    setEditingFieldKey(null)
    setDrawerItems([])
  }

  // Когда открывается поле — грузим нужные элементы
  useEffect(() => {
    if (!editingFieldKey) return

    const loadItems = async () => {
      let items: any[] = []

      if (editingFieldKey === 'gifts') {
        items = gifts.map((g: string, id: number) => ({
          id,
          title: g,
          image: `https://cdn.changes.tg/gifts/models/${encodeURIComponent(g)}/png/Original.png`,
        }))
      } else if (editingFieldKey === 'model' && selectedCell?.gift?.name) {
        const data = await fetchModelsQuery()
        items = data.map((m: any, id: number) => ({
          id,
          title: m.name,
          image: `https://cdn.changes.tg/gifts/models/${encodeURIComponent(selectedCell.gift.name)}/png/${encodeURIComponent(m.name)}.png`,
        }))
      } else if (editingFieldKey === 'background') {
        items = backgrounds.map((b: any) => ({
          id: b.backdropId,
          title: b.name,
          background: b,
        }))
        console.log(items)
      } else if (editingFieldKey === 'pattern' && selectedCell?.gift?.name) {
        const data = await fetchPatternsQuery()
        items = data.map((p: any, id: number) => ({
          id,
          title: p.name,
          pattern: `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(selectedCell.gift.name)}/png/${encodeURIComponent(p.name)}.png`,
        }))
      }

      setDrawerItems(items)
    }

    loadItems()
  }, [editingFieldKey, selectedCell, gifts, backgrounds])

  // Когда пользователь открывает поле — загружаем данные
  // useEffect(() => {
  //   if (!editingFieldKey) return
  
  //   const load = async () => {
  //     const loader = apiMap[editingFieldKey]
  //     if (!loader) return
  
  //     let items = []
  //     if (editingFieldKey === "model" && selectedCell?.gift) {
  //       items = await loader(selectedCell?.gift?.name)
  //     } else if (editingFieldKey === "pattern" && selectedCell?.gift) {
  //       items = await loader(selectedCell?.gift?.name)
  //     } else {
  //       items = await loader()
  //     }
  
  //     setDrawerItems(items)
  //   }
  
  //   load()
  // }, [editingFieldKey, selectedCell, gifts, backgrounds])
  


  const queryClient = useQueryClient();

  const updateGiftMutation = useMutation({
    mutationFn: () => updateGiftCell(selectedCell?.gridId, selectedCell?.rowIndex, selectedCell?.cellIndex, selectedCell?.gift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
      setSelectedCell(null)
    },
    onError: () => {
      toast("Error", {
        description: 'Failed to update gift',
      })
    },
  })

  return (
    <Drawer
      open={!!selectedCell}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedCell(null)
        }
      }}
    >
      <DrawerContent className="z-1000 h-screen rounded-none bg-transparent border-none [&>div:first-child]:hidden">
        {(selectedCell !== undefined) && (
          <div className="flex w-full h-full flex-col gap-3 pb-6 bg-background rounded-t-3xl text-white overflow-y-auto">
            <div
              className="relative min-h-[200px] text-white overflow-hidden bg-muted"
              style={{
                background: `radial-gradient(circle, ${selectedCell?.gift?.background?.hex.centerColor} 0%, ${selectedCell?.gift?.background?.hex.edgeColor} 100%)`
              }}
            >
              {selectedCell?.gift?.pattern && <PatternBackground
                  image={`https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(selectedCell?.gift?.name)}/png/${encodeURIComponent(selectedCell?.gift?.pattern)}.png`}
                />
              }

              <div className="absolute w-full my-4 px-4 z-10 flex items-center justify-end mb-2">
                <button className="flex h-9 w-13 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white">
                  <Pin className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-full z-10 flex items-center justify-center">
                <div className="h-4/5 w-full max-w-xs rounded-3xl flex items-center justify-center overflow-hidden">
                  {selectedCell?.gift && <GiftAnimation gift={selectedCell.gift} className="h-full" />}
                </div>
              </div>
            </div>

            <div>

              <div className="bg-card/50 mx-4 divide-y divide-border rounded-xl border border-solid border-border-600 overflow-hidden">
                {
                  giftFields.map((field, i) => (
                    <button
                      key={field.key}
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => setEditingFieldKey(field.key)}
                    >
                      <span className="flex-1 pl-3 py-3 bg-card text-sm text-card-foreground/90">
                        {field.label}
                      </span>
                      <div className="flex flex-2 px-5 py-3 justify-between items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {field.key === 'gifts' ? <>{selectedCell?.gift?.name ?? "All"}</> : null}
                          {field.key === 'model' ? <>{selectedCell?.gift?.model ?? "All"}</> : null}
                          {field.key === 'background' ? <>{selectedCell?.gift?.background?.name ?? "All"}</> : null}
                          {field.key === 'pattern' ? <>{selectedCell?.gift?.pattern ?? "All"}</> : null}
                        </span>
                        <ChevronDown className="h-4 w-4 text-foreground/60" />
                      </div>
                    </button>
                  ))
                }
              </div>

              <DrawerFooter className="px-4 pb-4">
                <Button
                  size="default"
                  className="h-11 w-full rounded-full text-white font-semibold"
                  onClick={() => updateGiftMutation.mutate()}
                >
                  {updateGiftMutation.isPending ? <Spinner /> : 'Apply'}
                </Button>
              </DrawerFooter>
            </div>
          </div>
        )}

        <SearchDrawer
          open={!!editingFieldKey}
          onOpenChange={(o) => {
            if (!o) {
              setEditingFieldKey(null)
              setDrawerItems([])
            }
          }}
          title={giftFields.find((f) => f.key === editingFieldKey)?.label}
          items={drawerItems}
          handleSelect={handleSelect}
        />

      </DrawerContent>
    </Drawer>
  )
}