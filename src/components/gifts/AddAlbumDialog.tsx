// src/components/gifts/AddAlbumDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { createGrid } from '@/api/gifts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/i18n'

type AddAlbumDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AddAlbumDialog = ({ open, onOpenChange }: AddAlbumDialogProps) => {
  const { t } = useTranslation()
  const [albumName, setAlbumName] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createGrid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grids'] })
      toast(t('toast.albumCreated'), {
        description: t('toast.albumCreatedDesc'),
      })
    },
    onError: () => {
      toast(t('common.error'), {
        description: t('toast.errorCreateAlbum'),
      })
    },
  })

  const onSubmit = () => {
    if (!albumName) return
    mutation.mutate(albumName, {
      onSuccess: () => {
        setAlbumName('')
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background/50 backdrop-blur-md rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle>{t('dialogs.createNewAlbum')}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t('dialogs.albumName')}
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className="rounded-xl py-5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-card/30"
        />
        <DialogFooter>
          <Button onClick={onSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? t('dialogs.creating') : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
