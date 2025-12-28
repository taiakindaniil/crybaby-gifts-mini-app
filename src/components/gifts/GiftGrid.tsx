import type { FC } from "react";
import { useState } from "react";
import { popup } from "@telegram-apps/sdk-react";
import { toast } from "sonner";
import { GiftCard } from "./GiftCard";
import type { Gift } from '@/types/gift';
import { Button } from '../ui/button';
import { useGiftStore } from '@/stores/giftStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRow, deleteGrid, updateGiftCell, type Grid } from '@/api/gifts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

type GiftGridProps = {
  gridId: number
  rows: (Gift | null)[][]
}

type CellId = `${number}-${number}`

function parseCellId(id: string): { rowIndex: number; cellIndex: number } {
  const [rowIndex, cellIndex] = id.split('-').map(Number);
  return { rowIndex, cellIndex };
}

function createCellId(rowIndex: number, cellIndex: number): CellId {
  return `${rowIndex}-${cellIndex}`;
}

type DraggableCellProps = {
  id: CellId
  rowIndex: number
  cellIndex: number
  gift: Gift | null
  onClick: () => void
  isOver?: boolean
}

const DraggableCell: FC<DraggableCellProps> = ({ id, gift, onClick, isOver }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id,
    disabled: !gift, // Пустые ячейки не перетаскиваются
  });

  const {
    setNodeRef: setDroppableRef,
    isOver: isDroppableOver,
  } = useDroppable({
    id,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      className={`touch-none ${isDroppableOver || isOver ? 'ring-1 ring-primary rounded-lg ring-offset-1' : ''}`}
    >
      <div {...attributes} {...listeners}>
        <GiftCard
          gift={gift}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export const GiftGrid: FC<GiftGridProps> = ({ gridId, rows }) => {
  const setSelectedCell = useGiftStore().setSelectedCell;
  const queryClient = useQueryClient();

  // Настройка сенсоров для drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 16, // Минимальное расстояние для активации drag (в пикселях)
      },
    }),
    useSensor(KeyboardSensor)
  );

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
      targetCell,
      sourceGift,
      targetGift
    }: { 
      sourceRow: number
      sourceCell: number
      targetRow: number
      targetCell: number
      sourceGift: Gift | null
      targetGift: Gift | null
    }) => {
      await Promise.all([
        updateGiftCell(gridId, sourceRow, sourceCell, targetGift),
        updateGiftCell(gridId, targetRow, targetCell, sourceGift),
      ])
    },
    onMutate: async ({ sourceRow, sourceCell, targetRow, targetCell, sourceGift, targetGift }) => {
      await queryClient.cancelQueries({ queryKey: ['grids'] })
      const previousGrids = queryClient.getQueryData<Grid[]>(['grids'])

      // Optimistic update
      queryClient.setQueryData<Grid[]>(['grids'], (old) => {
        if (!old) return old
        
        return old.map(grid => {
          if (grid.id !== gridId) return grid

          const newRows = [...grid.rows]
          const originalSourceGift = sourceGift
          const originalTargetGift = targetGift

          if (newRows[sourceRow]) {
            newRows[sourceRow] = {
              ...newRows[sourceRow],
              cells: [...newRows[sourceRow].cells]
            }
            newRows[sourceRow].cells[sourceCell] = originalTargetGift
          }

          if (newRows[targetRow]) {
            newRows[targetRow] = {
              ...newRows[targetRow],
              cells: [...newRows[targetRow].cells]
            }
            newRows[targetRow].cells[targetCell] = originalSourceGift
          }

          return {
            ...grid,
            rows: newRows
          }
        })
      })

      return { previousGrids }
    },
    onError: (error, _variables, context) => {
      if (context?.previousGrids) {
        queryClient.setQueryData(['grids'], context.previousGrids)
      }
      toast("Error", {
        description: error.message || 'Failed to move gift',
      })
    },
    onSuccess: async () => {
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ['grids'] })
      }, 200)
    },
  })

  const [activeId, setActiveId] = useState<CellId | null>(null);
  const [overId, setOverId] = useState<CellId | null>(null);

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const { active } = event;
    setActiveId(active.id as CellId);
  };

  const handleDragOver = (event: { over: { id: string | number } | null }) => {
    const { over } = event;
    if (over) {
      setOverId(over.id as CellId);
    }
  };

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const source = parseCellId(active.id as string);
    const target = parseCellId(over.id as string);

    // Получаем исходные данные из props (rows)
    const sourceGift = rows[source.rowIndex]?.[source.cellIndex] || null
    const targetGift = rows[target.rowIndex]?.[target.cellIndex] || null

    // Обмениваем подарки между ячейками
    swapGiftsMutation.mutate({
      sourceRow: source.rowIndex,
      sourceCell: source.cellIndex,
      targetRow: target.rowIndex,
      targetCell: target.cellIndex,
      sourceGift,
      targetGift,
    })
  };

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

  const activeGift = activeId ? (() => {
    const { rowIndex, cellIndex } = parseCellId(activeId);
    return rows[rowIndex]?.[cellIndex] || null;
  })() : null;
  
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((gift, cellIndex) => {
                const cellId = createCellId(rowIndex, cellIndex);
                
                return (
                  <DraggableCell
                    key={cellId}
                    id={cellId}
                    rowIndex={rowIndex}
                    cellIndex={cellIndex}
                    gift={gift}
                    isOver={overId === cellId && activeId !== cellId}
                    onClick={() =>
                      setSelectedCell({
                        gridId,
                        rowIndex,
                        cellIndex,
                        gift: gift,
                      })
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeGift ? (
            <div className="opacity-80 scale-110">
              <GiftCard gift={activeGift} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
