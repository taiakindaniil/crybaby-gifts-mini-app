import type { FC } from "react";
import { useState } from "react";
import { popup, retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { toast } from "sonner";
import { GiftCard } from "./GiftCard";
import type { Gift } from '@/types/gift';
import { Button } from '../ui/button';
import { useGiftStore } from '@/stores/giftStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRow, deleteGrid, swapGiftCells, type Grid, type Cell } from '@/api/gifts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
  MouseSensor,
} from '@dnd-kit/core';

type GiftGridProps = {
  gridId: number
  rows: Cell[][]
  isMainAlbum?: boolean
  isOwnProfile?: boolean
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
  cell: Cell
  isOwnProfile: boolean
  onClick: () => void
  isOver?: boolean
}

const DraggableCell: FC<DraggableCellProps> = ({ id, cell, onClick, isOver, isOwnProfile }) => {
  const gift = cell.gift
  const isPinned = cell.pinned || false
  
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id,
    disabled: !gift || isPinned || !isOwnProfile, // Пустые ячейки, закрепленные подарки и на чужом профиле не перетаскиваются
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
      className={`relative ${isDroppableOver || isOver ? 'ring-1 ring-primary rounded-lg ring-offset-1' : ''}`}
    >
      <div {...(isOwnProfile ? { ...attributes, ...listeners } : {})}>
        <GiftCard
          gift={gift}
          isPinned={isPinned}
          isOwnProfile={isOwnProfile}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export const GiftGrid: FC<GiftGridProps> = ({ gridId, rows, isMainAlbum = false, isOwnProfile = false }) => {
  // isMainAlbum может использоваться для дополнительной логики в будущем
  // например, для визуального выделения main album или специальных функций
  void isMainAlbum; // Suppress unused variable warning
  const setSelectedCell = useGiftStore().setSelectedCell;
  const queryClient = useQueryClient();
  
  // Получаем user.id для правильного query key
  const lp = retrieveLaunchParams();
  const userId = lp.tgWebAppData?.user?.id;

  // Настройка сенсоров для drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const addRowMutation = useMutation({
    mutationFn: () => addRow(gridId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids', userId] })
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
      queryClient.invalidateQueries({ queryKey: ['grids', userId] })
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
      sourceGift?: Gift | null
      targetGift?: Gift | null
    }) => {
      // Атомарный свап через один запрос
      await swapGiftCells(gridId, sourceRow, sourceCell, targetRow, targetCell)
    },
    onMutate: async ({ sourceRow, sourceCell, targetRow, targetCell, sourceGift, targetGift }) => {
      // Отменяем исходящие запросы, чтобы не перезаписать optimistic update
      await queryClient.cancelQueries({ queryKey: ['grids', userId] })
      
      // Сохраняем предыдущее значение для отката
      const previousGrids = queryClient.getQueryData<Grid[]>(['grids', userId])
      
      // Optimistic update - используем данные из параметров для немедленного обновления UI
      queryClient.setQueryData<Grid[]>(['grids', userId], (old) => {
        if (!old) return old
        
        return old.map(grid => {
          if (grid.id !== gridId) return grid

          const newRows = [...grid.rows]

          // Обновляем ячейки, используя исходные данные
          if (newRows[sourceRow]) {
            newRows[sourceRow] = {
              ...newRows[sourceRow],
              cells: [...newRows[sourceRow].cells]
            }
            const targetCellData = newRows[targetRow]?.cells[targetCell] || { gift: null, pinned: false }
            newRows[sourceRow].cells[sourceCell] = {
              ...targetCellData,
              gift: targetGift ?? null
            }
          }

          if (newRows[targetRow]) {
            newRows[targetRow] = {
              ...newRows[targetRow],
              cells: [...newRows[targetRow].cells]
            }
            const sourceCellData = newRows[sourceRow]?.cells[sourceCell] || { gift: null, pinned: false }
            newRows[targetRow].cells[targetCell] = {
              ...sourceCellData,
              gift: sourceGift ?? null
            }
          }

          return {
            ...grid,
            rows: newRows
          }
        })
      })

      // Возвращаем контекст с предыдущими данными для отката при ошибке
      return { previousGrids }
    },
    onError: (error, _variables, context) => {
      // Откатываем изменения в случае ошибки
      if (context?.previousGrids) {
        queryClient.setQueryData(['grids', userId], context.previousGrids)
      }
      toast("Error", {
        description: error.message || 'Failed to move gift',
      })
    },
    onSuccess: async () => {
      // Optimistic update уже обновил данные правильно
      // Не нужно refetch, так как это может перезаписать данные старыми данными с сервера
      // если сервер еще не успел обработать запрос
    },
  })

  const [activeId, setActiveId] = useState<CellId | null>(null);
  const [overId, setOverId] = useState<CellId | null>(null);

  const handleDragStart = (event: { active: { id: string | number } }) => {
    // На чужом профиле запрещаем drag and drop
    if (!isOwnProfile) {
      return;
    }
    const { active } = event;
    setActiveId(active.id as CellId);
  };

  const handleDragOver = (event: { over: { id: string | number } | null }) => {
    // На чужом профиле запрещаем drag and drop
    if (!isOwnProfile) {
      return;
    }
    const { over } = event;
    if (over) {
      setOverId(over.id as CellId);
    }
  };

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    // На чужом профиле запрещаем drag and drop
    if (!isOwnProfile) {
      return;
    }
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const source = parseCellId(active.id as string);
    const target = parseCellId(over.id as string);

    // Получаем исходные данные из query cache ДО вызова мутации
    // Это важно, чтобы получить правильные данные до optimistic update
    const grids = queryClient.getQueryData<Grid[]>(['grids', userId]) || []
    const currentGrid = grids.find(g => g.id === gridId)
    
    if (!currentGrid) {
      toast("Error", {
        description: 'Grid not found',
      })
      return
    }

    const sourceCell = currentGrid.rows[source.rowIndex]?.cells[source.cellIndex] || { gift: null, pinned: false }
    const targetCell = currentGrid.rows[target.rowIndex]?.cells[target.cellIndex] || { gift: null, pinned: false }

    // Проверяем, не закреплены ли подарки
    if (sourceCell.pinned || targetCell.pinned) {
      toast("Error", {
        description: 'Cannot move pinned gifts',
      })
      return
    }

    // Передаем данные вместе с индексами
    swapGiftsMutation.mutate({
      sourceRow: source.rowIndex,
      sourceCell: source.cellIndex,
      targetRow: target.rowIndex,
      targetCell: target.cellIndex,
      sourceGift: sourceCell.gift,
      targetGift: targetCell.gift,
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
    return rows[rowIndex]?.[cellIndex]?.gift || null;
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
              {row.map((cell, cellIndex) => {
                const cellId = createCellId(rowIndex, cellIndex);
                
                return (
                  <DraggableCell
                    key={cellId}
                    id={cellId}
                    rowIndex={rowIndex}
                    cellIndex={cellIndex}
                    cell={cell}
                    isOwnProfile={isOwnProfile}
                    isOver={overId === cellId && activeId !== cellId}
                    onClick={() => {
                      // На чужом профиле запрещаем открывать пустые ячейки (и не показываем "+")
                      if (!isOwnProfile && !cell.gift) return
                      setSelectedCell({
                        gridId,
                        rowIndex,
                        cellIndex,
                        gift: cell.gift,
                        isOwnProfile,
                      })
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <DragOverlay>
          <div className="opacity-80">
            <GiftCard gift={activeGift} onClick={() => {}} isOwnProfile={true} />
          </div>
        </DragOverlay>
      </DndContext>

      {isOwnProfile && (
        <>
          <Button
            size="default"
            className="mt-3 h-11 w-full rounded-full bg-card text-foreground font-semibold cursor-pointer"
            onClick={() => addRowMutation.mutate()}
            disabled={addRowMutation.isPending}
          >
            {addRowMutation.isPending ? 'Adding...' : 'Add Row'}
          </Button>

          <Button
            variant="ghost"
            className="mt-2 h-11 w-full rounded-full cursor-pointer text-white font-semibold"
            onClick={openPopup}
          >
            Delete Album
          </Button>
        </>
      )}
    </>
  );
}
