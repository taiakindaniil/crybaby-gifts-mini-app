import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GiftGrid } from '../gifts/GiftGrid'
import { useQuery } from '@tanstack/react-query';
import { getGrids } from '@/api/gifts';
import { Spinner } from '../ui/spinner';
import { useState } from 'react';
import { AddAlbumDialog } from '../gifts/AddAlbumDialog';

export default function ProfileGroupTabs({ user }) {
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data: grids = [], isLoading, error } = useQuery({queryKey: ['grids'], queryFn: () => getGrids(user.id)});

    const handleTabChange = (value: string) => {
      // Разрешаем переключение только на gifts
      if (value !== 'add_album') {
        setActiveTab(value)
      } else {
        setIsDialogOpen(true)
        setActiveTab(activeTab)
        return
      }
    }

    return (
      <>
      {isLoading && <>
        <div className="flex w-full justify-center">
          <Spinner className="mt-5 size-8" />
        </div>
      </> || 
        <>
          <Tabs defaultValue={String(grids[0].id)} value={activeTab} onValueChange={handleTabChange} className="w-full overflow-x-hidden">
            <div className="relative w-full overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex gap-x-2 p-0 px-4 w-max min-w-full justify-center">
                {grids.map((grid) => (
                  <TabsTrigger
                    key={grid.id}
                    value={String(grid.id || 0)}
                    // disabled={tab.value !== 'gifts'}
                    className="px-3 !grow-0 whitespace-nowrap bg-transparent !data-[state=active]:bg-card dark:!data-[state=active]:bg-card rounded-full border-0 border-transparent data-[state=active]:border-primary !shadow-none !data-[state=active]:shadow-none whitespace-nowrap shrink-0 text-muted-foreground data-[state=active]:text-foreground h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{grid.name}</span>
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  key="add_album"  
                  value="add_album"
                  onClick={() => {return}}
                  className="px-3 !grow-0 whitespace-nowrap bg-transparent !data-[state=active]:bg-muted dark:!data-[state=active]:bg-muted rounded-full border-0 border-transparent data-[state=active]:border-primary !shadow-none !data-[state=active]:shadow-none whitespace-nowrap shrink-0 text-muted-foreground data-[state=active]:text-foreground h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Album
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Gifts Content */}
            {grids.map((grid) => (
              <TabsContent value={String(grid.id)} className="px-4 overflow-x-hidden">
                <GiftGrid key={grid.id} gridId={grid.id} rows={grid.rows.map(r => r.cells)} />
              </TabsContent>
            ))}
          </Tabs>
        </>
      }

      <AddAlbumDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </>
    )
}