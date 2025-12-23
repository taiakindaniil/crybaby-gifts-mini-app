import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GiftGrid } from '../gifts/GiftGrid'
import { useQuery } from '@tanstack/react-query';
import { getGrids } from '@/api/gifts';
import { Spinner } from '../ui/spinner';
import { useState } from 'react';
import { AddAlbumDialog } from '../gifts/AddAlbumDialog';
import { useHasActiveSubscription } from '@/hooks/useSubscription';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function ProfileGroupTabs({ user }: { user: TelegramUser }) {
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const { data: grids = [], isLoading } = useQuery({queryKey: ['grids'], queryFn: () => getGrids(user.id)});
    const hasActiveSubscription = useHasActiveSubscription();

    const handleTabChange = (value: string) => {
      // Разрешаем переключение только на gifts
      if (value !== 'add_album') {
        setActiveTab(value)
      } else {
        // Если нет подписки, перенаправляем на страницу подписки
        if (!hasActiveSubscription) {
          navigate('/subscription')
          return;
        }
        setIsDialogOpen(true)
        setActiveTab(activeTab)
        return
      }
    }

    if (isLoading) {
      return (
        <div className="flex w-full justify-center">
          <Spinner className="mt-5 size-8" />
        </div>
      )
    }

    return (
      <>
        <Tabs defaultValue={String(grids[0]?.id)} value={activeTab} onValueChange={handleTabChange} className="w-full overflow-x-hidden">
          <div className="relative w-full overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex gap-x-2 p-0 px-4 w-max min-w-full justify-center">
              {grids.map((grid) => (
                <TabsTrigger
                  key={grid.id}
                  value={String(grid.id || 0)}
                  className="px-3 !grow-0 whitespace-nowrap bg-transparent !data-[state=active]:bg-card dark:!data-[state=active]:bg-card rounded-full border-0 border-transparent data-[state=active]:border-primary !shadow-none !data-[state=active]:shadow-none whitespace-nowrap shrink-0 text-muted-foreground data-[state=active]:text-foreground h-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{grid.name}</span>
                </TabsTrigger>
              ))}
              <TabsTrigger
                key="add_album"  
                value="add_album"
                onClick={() => {return}}
                className="px-3 !grow-0 whitespace-nowrap bg-transparent !data-[state=active]:bg-muted dark:!data-[state=active]:bg-muted rounded-full border-0 border-transparent data-[state=active]:border-primary !shadow-none !data-[state=active]:shadow-none whitespace-nowrap shrink-0 text-muted-foreground data-[state=active]:text-foreground h-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                + Add Album
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Gifts Content */}
          {grids.map((grid, index) => {
            // Если нет подписки и это не первый альбом, показываем призыв купить подписку
            const showSubscriptionPrompt = !hasActiveSubscription && index !== 0;
            
            return (
              <TabsContent key={grid.id} value={String(grid.id)} className="px-4 overflow-x-hidden">
                {showSubscriptionPrompt ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="mb-6">
                      <Sparkles className="size-16 text-blue-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                      Subscribe to unlock this album
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                      Get access to all albums and exclusive features with a premium subscription
                    </p>
                    <Button asChild className="rounded-full">
                      <Link to="/subscription">
                        Get Subscription
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <GiftGrid gridId={grid.id} rows={grid.rows.map(r => r.cells)} />
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <AddAlbumDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </>
    )
}