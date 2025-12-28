import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import { popup } from "@telegram-apps/sdk-react";
import { toast } from "sonner";
import { GiftCard } from "./GiftCard";
import type { Gift } from '@/types/gift';
import { Button } from '../ui/button';
import { useGiftStore } from '@/stores/giftStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRow, deleteGrid, updateGiftCell } from '@/api/gifts';

type GiftGridProps = {
  gridId: number
  rows: (Gift | null)[][]
}

type DragData = {
  rowIndex: number
  cellIndex: number
  gift: Gift | null
}

export const GiftGrid: FC<GiftGridProps> = ({ gridId, rows }) => {
  const setSelectedCell = useGiftStore().setSelectedCell;
  const queryClient = useQueryClient();
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ rowIndex: number; cellIndex: number } | null>(null);
  const [touchDragPosition, setTouchDragPosition] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const addRowMutation = useMutation({
    mutationFn: () => addRow(gridId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
    },
    onError: (error) => {
      toast("Can't add row", {
        description: error.message
      })
    }
  })

  const deleteGridMutation = useMutation({
    mutationFn: () => deleteGrid(gridId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
      toast("Album deleted", {
        description: 'New album has been successfully deleted.',
      })
    },
    onError: () => {
      toast("Error", {
        description: 'Failed to delete album',
      })
    },
  })

  const swapGiftsMutation = useMutation({
    mutationFn: async ({ 
      sourceRow, 
      sourceCell, 
      targetRow, 
      targetCell 
    }: { 
      sourceRow: number
      sourceCell: number
      targetRow: number
      targetCell: number
    }) => {
      const sourceGift = rows[sourceRow]?.[sourceCell] || null
      const targetGift = rows[targetRow]?.[targetCell] || null

      // Обновляем обе ячейки параллельно
      await Promise.all([
        updateGiftCell(gridId, sourceRow, sourceCell, targetGift),
        updateGiftCell(gridId, targetRow, targetCell, sourceGift),
      ])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
      setDraggedItem(null)
      setDragOverCell(null)
    },
    onError: (error) => {
      toast("Error", {
        description: error.message || 'Failed to move gift',
      })
      setDraggedItem(null)
      setDragOverCell(null)
    },
  })

  const handleDragStart = (rowIndex: number, cellIndex: number, gift: Gift | null) => {
    if (!gift) return
    setDraggedItem({ rowIndex, cellIndex, gift })
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverCell(null)
  }

  const handleDragOver = (e: React.DragEvent, rowIndex: number, cellIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedItem && (draggedItem.rowIndex !== rowIndex || draggedItem.cellIndex !== cellIndex)) {
      setDragOverCell({ rowIndex, cellIndex })
    }
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e: React.DragEvent, rowIndex: number, cellIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedItem) return
    
    // Если перетаскиваем в ту же ячейку, ничего не делаем
    if (draggedItem.rowIndex === rowIndex && draggedItem.cellIndex === cellIndex) {
      setDraggedItem(null)
      setDragOverCell(null)
      return
    }

    // Обмениваем подарки между ячейками
    swapGiftsMutation.mutate({
      sourceRow: draggedItem.rowIndex,
      sourceCell: draggedItem.cellIndex,
      targetRow: rowIndex,
      targetCell: cellIndex,
    })
  }

  // Touch handlers
  const handleTouchStart = (rowIndex: number, cellIndex: number, gift: Gift | null, e: React.TouchEvent) => {
    if (!gift) return
    setDraggedItem({ rowIndex, cellIndex, gift })
    const touch = e.touches[0]
    setTouchDragPosition({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedItem || !gridRef.current) return
    
    e.preventDefault()
    const touch = e.touches[0]
    setTouchDragPosition({ x: touch.clientX, y: touch.clientY })

    // Находим элемент под пальцем
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!elementBelow) return

    // Ищем родительский контейнер ячейки
    const cellContainer = elementBelow.closest('[data-cell-index]')
    if (!cellContainer) return

    const targetRowIndex = parseInt(cellContainer.getAttribute('data-row-index') || '-1')
    const targetCellIndex = parseInt(cellContainer.getAttribute('data-cell-index') || '-1')

    if (targetRowIndex >= 0 && targetCellIndex >= 0) {
      if (draggedItem.rowIndex !== targetRowIndex || draggedItem.cellIndex !== targetCellIndex) {
        setDragOverCell({ rowIndex: targetRowIndex, cellIndex: targetCellIndex })
      } else {
        setDragOverCell(null)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedItem) return

    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (elementBelow) {
      const cellContainer = elementBelow.closest('[data-cell-index]')
      if (cellContainer) {
        const targetRowIndex = parseInt(cellContainer.getAttribute('data-row-index') || '-1')
        const targetCellIndex = parseInt(cellContainer.getAttribute('data-cell-index') || '-1')

        if (targetRowIndex >= 0 && targetCellIndex >= 0) {
          // Если перетаскиваем в ту же ячейку, ничего не делаем
          if (draggedItem.rowIndex !== targetRowIndex || draggedItem.cellIndex !== targetCellIndex) {
            // Обмениваем подарки между ячейками
            swapGiftsMutation.mutate({
              sourceRow: draggedItem.rowIndex,
              sourceCell: draggedItem.cellIndex,
              targetRow: targetRowIndex,
              targetCell: targetCellIndex,
            })
          } else {
            setDraggedItem(null)
            setDragOverCell(null)
            setTouchDragPosition(null)
          }
        } else {
          setDraggedItem(null)
          setDragOverCell(null)
          setTouchDragPosition(null)
        }
      } else {
        setDraggedItem(null)
        setDragOverCell(null)
        setTouchDragPosition(null)
      }
    } else {
      setDraggedItem(null)
      setDragOverCell(null)
      setTouchDragPosition(null)
    }
  }

  // Предотвращаем скролл при перетаскивании на touch устройствах
  useEffect(() => {
    if (draggedItem && touchDragPosition) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [draggedItem, touchDragPosition])

  const openPopup = () => {
    popup.show({
      title: 'Delete album of nfts?',
      message: 'If you delete this album, you won\'t be able restore it.',
      buttons: [
        { id: "delete", type: "ok" },
        { id: "cancel", type: "cancel" }
      ]
    }).then((buttonId) => {
      if (buttonId == "delete") {
        deleteGridMutation.mutate()
      }
    })
  }
  
  return (
    <>
      <div ref={gridRef} className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2">
            {row.map((gift, cellIndex) => {
              const isDragged = draggedItem?.rowIndex === rowIndex && draggedItem?.cellIndex === cellIndex
              const isDragOver = dragOverCell?.rowIndex === rowIndex && dragOverCell?.cellIndex === cellIndex
              
              return (
                <div
                  key={cellIndex}
                  data-row-index={rowIndex}
                  data-cell-index={cellIndex}
                  onDragOver={(e) => handleDragOver(e, rowIndex, cellIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, rowIndex, cellIndex)}
                  className={`
                    ${isDragOver ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${isDragged ? 'opacity-50' : ''}
                    transition-all
                  `}
                >
                  <GiftCard
                    gift={gift}
                    draggable={true}
                    isDragging={isDragged && !!touchDragPosition}
                    onClick={() =>
                      setSelectedCell({
                        gridId,
                        rowIndex,
                        cellIndex,
                        gift: gift,
                      })
                    }
                    onDragStart={() => handleDragStart(rowIndex, cellIndex, gift)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(rowIndex, cellIndex, gift, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Визуальный индикатор перетаскивания для touch устройств */}
      {draggedItem && touchDragPosition && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: touchDragPosition.x - 50,
            top: touchDragPosition.y - 50,
            width: 100,
            height: 100,
            opacity: 0.8,
          }}
        >
          <GiftCard
            gift={draggedItem.gift}
            draggable={false}
            onClick={() => {}}
          />
        </div>
      )}

      <Button
        size="default"
        className="mt-3 h-11 w-full rounded-full bg-card text-foreground font-semibold"
        onClick={() => addRowMutation.mutate()}
        disabled={addRowMutation.isPending}
      >
        {addRowMutation.isPending ? 'Adding...' : 'Add Row'}
      </Button>

      <Button variant="ghost" className="mt-2 w-full" onClick={openPopup}>Delete Album</Button>
    </>
  );
}