import { useEffect, useState, type FC } from 'react'
import { ChevronDown, Pin } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { GiftAnimation } from './GiftAnimation'

import { useGiftDataStore } from '@/stores/giftDataStore'
import type { GiftBackground } from '@/types/gift'
import { useGiftStore, giftFields } from '@/stores/giftStore'
import { SearchDrawer } from '../search/SearchDrawer'
import { PatternBackground } from './PatternBackground'


export const GiftDrawer: FC = () => {
  const selectedGift = useGiftStore((state) => state.selectedGift)
  const setSelectedGift = useGiftStore((state) => state.setSelectedGift)

  const editingFieldKey = useGiftStore((state) => state.editingFieldKey)
  const setEditingFieldKey = useGiftStore((state) => state.setEditingFieldKey)

  const [drawerItems, setDrawerItems] = useState<{ id: number, title: string, image?: string, background?: GiftBackground }[]>([])

  const prefetchStatic = useGiftDataStore().prefetchStatic

  // API store
  // const {
  //   gifts,
  //   backgrounds,
  //   models,
  //   fetchBackgrounds,
  //   fetchModels,
  //   fetchGifts,
  //   prefetchStatic,
  // } = useGiftDataStore()

  const selectField = useGiftStore((s) => s.selectField)

  const handleSelect = (item) => {
    if (!editingFieldKey) return
    selectField(editingFieldKey, item.title)
    setEditingFieldKey(null)
    setDrawerItems([])
  }

  const apiMap = {
    gifts: async () => {
      const store = useGiftDataStore.getState()
  
      await store.fetchGifts()
      const fresh = useGiftDataStore.getState().gifts
  
      return (fresh ?? []).map((g, id) => ({ id, title: g, image: `https://cdn.changes.tg/gifts/models/${encodeURIComponent(g)}/png/Original.png` }))
    },
  
    model: async (giftName: string) => {
      const store = useGiftDataStore.getState()
  
      await store.fetchModels(giftName)
      const fresh = useGiftDataStore.getState().models[giftName]
  
      return (fresh ?? []).map((m, id) => ({ id, title: m.name, image: `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/png/${encodeURIComponent(m.name)}.png` }))
    },
  
    background: async () => {
      const store = useGiftDataStore.getState()
  
      await store.fetchBackgrounds()
      const fresh = useGiftDataStore.getState().backgrounds
  
      return (fresh ?? []).map((b) => ({
        id: b.backdropId,
        title: b.name,
        background: b,
      }))
    },
  
    pattern: async (giftName: string) => {
      const fetchPatterns = useGiftDataStore.getState().fetchPatterns

      await fetchPatterns(giftName)

      const fresh = useGiftDataStore.getState().patterns
      return (fresh ?? []).map((p, id) => ({
        id: id,
        title: p.name,
        pattern: `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(giftName)}/png/${encodeURIComponent(p.name)}.png`,
      }))
    },
  }

  useEffect(() => {
    if (selectedGift) {
      prefetchStatic()  // ⬅️ грузим gifts + backgrounds заранее
    }
  }, [selectedGift])

  // Когда пользователь открывает поле — загружаем данные
  useEffect(() => {
    if (!editingFieldKey) return
  
    const load = async () => {
      const loader = apiMap[editingFieldKey]
      if (!loader) return
  
      let items = []
      if (editingFieldKey === "model" && selectedGift) {
        items = await loader(selectedGift.name)
      } else if (editingFieldKey === "pattern" && selectedGift) {
        items = await loader(selectedGift.name)
      } else {
        items = await loader()
      }
  
      setDrawerItems(items)
    }
  
    load()
  }, [editingFieldKey, selectedGift])
  

  return (
    <Drawer
      open={!!selectedGift}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedGift(null)
        }
      }}
    >
      <DrawerContent className="z-1000 h-screen rounded-none [&>div:first-child]:hidden">
        {selectedGift && (
          <div className="flex w-full h-full flex-col gap-3 pb-6 bg-[#111111] text-white overflow-y-auto">
            <div
              className="relative min-h-[200px] rounded-t-3xl text-white overflow-hidden"
              style={{
                background: `radial-gradient(circle, ${selectedGift.background?.hex.centerColor} 0%, ${selectedGift.background?.hex.edgeColor} 100%)`
              }}
            >
              {selectedGift.pattern && <PatternBackground
                  image={`https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(selectedGift.name)}/png/${encodeURIComponent(selectedGift.pattern)}.png`}
                />
              }

              <div className="absolute w-full my-4 px-4 z-10 flex items-center justify-end mb-2">
                <button className="flex h-9 w-13 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white">
                  <Pin className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-full z-10 flex items-center justify-center">
                <div className="h-4/5 w-full max-w-xs rounded-3xl flex items-center justify-center overflow-hidden">
                  <GiftAnimation gift={selectedGift} className="h-full" />
                </div>
              </div>
            </div>

            <div className="rounded-t-3xl bg-[#111111] text-white">

              <div className="mx-4 divide-y divide-border rounded-xl border border-solid border-secondary-600 overflow-hidden">
                {
                  giftFields.map((field, i) => (
                    <button
                      key={field.key}
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => setEditingFieldKey(field.key)}
                    >
                      <span className="flex-1 pl-3 py-3 bg-secondary text-sm text-white/90">
                        {field.label}
                      </span>
                      <div className="flex flex-2 px-5 py-3 justify-between items-center gap-2">
                        <span className="text-sm font-medium">
                          {field.key === 'gifts' ? <>{selectedGift?.name ?? "All"}</> : null}
                          {field.key === 'model' ? <>{selectedGift?.model ?? "All"}</> : null}
                          {field.key === 'background' ? <>{selectedGift.background?.name ?? "All"}</> : null}
                          {field.key === 'pattern' ? <>{selectedGift?.pattern ?? "All"}</> : null}
                        </span>
                        <ChevronDown className="h-4 w-4 text-white/60" />
                      </div>
                    </button>
                  ))
                }
              </div>

              <DrawerFooter className="px-4 pb-4">
                <Button
                  size="default"
                  className="h-11 w-full rounded-full text-foreground font-semibold"
                >
                  Apply
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