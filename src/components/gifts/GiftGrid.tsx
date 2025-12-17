import type { FC } from "react";
import { popup } from "@telegram-apps/sdk-react";
import { toast } from "sonner";
import { GiftCard } from "./GiftCard";
import type { Gift } from '@/types/gift';
import { Button } from '../ui/button';
import { useGiftStore } from '@/stores/giftStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRow, deleteGrid } from '@/api/gifts';

type GiftGridProps = {
  gridId: number
  rows: (Gift | null)[][]
}

export const GiftGrid: FC<GiftGridProps> = ({ gridId, rows }) => {
  const setSelectedCell = useGiftStore().setSelectedCell;
  const queryClient = useQueryClient();

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
            {row.map((gift, cellIndex) => (
              <GiftCard
                key={cellIndex}
                gift={gift}
                onClick={() =>
                  setSelectedCell({
                    gridId,
                    rowIndex,
                    cellIndex,
                    gift: gift,
                  })
                }
              />
            ))}
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