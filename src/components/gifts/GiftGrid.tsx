import type { FC } from "react";
import { useState } from "react";
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
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2">
            {row.map((gift, cellIndex) => {
              const isDragged = draggedItem?.rowIndex === rowIndex && draggedItem?.cellIndex === cellIndex
              const isDragOver = dragOverCell?.rowIndex === rowIndex && dragOverCell?.cellIndex === cellIndex
              
              return (
                <div
                  key={cellIndex}
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
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

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