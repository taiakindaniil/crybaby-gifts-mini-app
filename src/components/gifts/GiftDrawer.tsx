import { useState, type FC } from 'react'
import { ChevronDown, Pin } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { GiftAnimation } from './GiftAnimation'

import { useGiftStore } from '@/stores/giftStore'


export const GiftDrawer: FC = () => {
  const selectedGift = useGiftStore((state) => state.selectedGift)
  const setSelectedGift = useGiftStore((state) => state.setSelectedGift)

  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null)

  const fields = [
    {
      label: 'Gifts',
      key: 'gifts',
      options: ['BerryBox', 'ChocoBox'],
      defaultValue: 'BerryBox',
      editable: true,
    },
    {
      label: 'Model',
      key: 'model',
      options: ['Lady Bites', 'Dark'],
      defaultValue: 'Lady Bites',
      editable: true,
    },
    {
      label: 'Background',
      key: 'background',
      options: ['Cyberpunk', 'Classic'],
      defaultValue: 'Cyberpunk',
      editable: true,
    },
    {
      label: 'Pattern',
      key: 'pattern',
      options: ['Baphomet', 'Hearts'],
      defaultValue: 'Baphomet',
      editable: true,
    },
  ] as const

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.key, field.defaultValue])
      ) as Record<string, string>
  )

  const activeField = editingFieldKey
    ? fields.find((field) => field.key === editingFieldKey)
    : null

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
              className="rounded-t-3xl text-white relative overflow-hidden"
              style={{
                background: `radial-gradient(circle, ${selectedGift.background?.hex.centerColor} 0%, ${selectedGift.background?.hex.edgeColor} 100%)`
              }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-10">
                <div className="grid h-full w-full grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full border border-white/30"
                    />
                  ))}
                </div>
              </div>

              <div className="absolute w-full my-4 px-4 z-10 flex items-center justify-end mb-2">
                <button className="flex h-9 w-13 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white">
                  <Pin className="w-5 h-5" />
                </button>
              </div>

              <div className="h-full relative z-10 flex items-center justify-center">
                <div className="h-56 w-full max-w-xs rounded-3xl flex items-center justify-center overflow-hidden">
                  <GiftAnimation gift={selectedGift} className="h-56 w-56" />
                </div>
              </div>
            </div>

            <div className="rounded-t-3xl bg-[#111111] text-white">

              <div className="mx-4 divide-y divide-border rounded-xl border border-solid border-secondary-600 overflow-hidden">
                {editingFieldKey && activeField ? (
                  <>
                    <div className="flex items-center justify-between py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white/10"
                        onClick={() => setEditingFieldKey(null)}
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                      </Button>
                      <span className="text-sm font-medium">
                        {activeField.label}
                      </span>
                      <div className="w-7" />
                    </div>
                    {activeField.options?.map((option) => (
                      <button
                        key={option}
                        className="flex w-full items-center justify-between py-3 text-left"
                        onClick={() => {
                          setFieldValues((prev) => ({
                            ...prev,
                            [activeField.key]: option,
                          }))
                          setEditingFieldKey(null)
                        }}
                      >
                        <span className="text-sm">{option}</span>
                        {fieldValues[activeField.key] === option && (
                          <span className="text-xs text-blue-400">
                            Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                ) : (
                  fields.map((field) => (
                    <button
                      key={field.key}
                      className="flex w-full items-center justify-between text-left"
                      disabled={!field.editable}
                      onClick={() =>
                        field.editable && setEditingFieldKey(field.key)
                      }
                    >
                      <span className="flex-1 pl-3 py-3 bg-secondary text-sm text-white/90">
                        {field.label}
                      </span>
                      <div className="flex flex-2 px-5 py-3 justify-between items-center gap-2">
                        <span className="text-sm font-medium">
                          {fieldValues[field.key]}
                        </span>
                        {field.editable && (
                          <ChevronDown className="h-4 w-4 text-white/60" />
                        )}
                      </div>
                    </button>
                  ))
                )}
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
      </DrawerContent>
    </Drawer>
  )
}