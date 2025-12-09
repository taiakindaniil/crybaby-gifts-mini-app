import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GiftGrid } from '../gifts/GiftGrid'
import { useGiftStore } from '@/stores/giftStore'
import type { Gift } from '@/types/Gift'

export default function ProfileTabs() {
    const setSelectedGift = useGiftStore((state) => state.setSelectedGift)

    const [activeTab, setActiveTab] = useState('gifts')

    const handleTabChange = (value: string) => {
        // Разрешаем переключение только на gifts
        if (value === 'gifts') {
          setActiveTab(value)
        }
    }

    const tabs = [
        { value: 'posts', label: 'Posts', icons: null },
        { value: 'gifts', label: 'Gifts', icons: null },
        { value: 'media', label: 'Media', icons: null },
        { value: 'saved', label: 'Saved', icons: null },
        { value: 'links', label: 'Links', icons: null },
        { value: 'gifs', label: 'GIFs', icons: null },
    ]

    const gifts: Gift[] = [
        {
          id: 9220,
          icon: '🌸',
          title: 'Blooming Skull',
          description: 'A rare gothic flower gift from your subscribers.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Bling%20Binky/lottie/Original.json', // TODO: set real Lottie JSON URL
          background: {
            name: "Electric Purple",
            backdropId: 1,
            centerColor: 13267142,
            edgeColor: 9855700,
            patternColor: 6426548,
            textColor: 15453951,
            hex: {
              "centerColor": "#ca70c6",
              "edgeColor": "#9662d4",
              "patternColor": "#620fb4",
              "textColor": "#ebceff"
            }
          }
        },
        {
          id: 94355,
          icon: '🍭',
          title: 'Plush Pepe',
          description: 'Sweet and hypnotic, perfect for loyal fans.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Donatello.json',
          background: {
            "name": "Mustard",
            "backdropId": 78,
            "centerColor": 13932557,
            "edgeColor": 12875538,
            "patternColor": 8004864,
            "textColor": 16768668,
            "hex": {
              "centerColor": "#d4980d",
              "edgeColor": "#c47712",
              "patternColor": "#7a2500",
              "textColor": "#ffde9c"
            }
          },
        },
        {
          id: 19795,
          icon: '👁️',
          title: 'All‑seeing Eye',
          description: 'Keeps an eye on your channel stats.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Original.json',
          background: {
            "name": "Cyberpunk",
            "backdropId": 3,
            "centerColor": 8753139,
            "edgeColor": 8806355,
            "patternColor": 4397222,
            "textColor": 14735871,
            "hex": {
              "centerColor": "#858ff3",
              "edgeColor": "#865fd3",
              "patternColor": "#4318a6",
              "textColor": "#e0d9ff"
            }
          },
        },
        {
          id: 16876,
          icon: '🎩',
          title: 'Wizard Hat',
          description: 'Adds a bit of magic to your profile.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Pepemint.json',
          background: {
            "name": "Mint Green",
            "backdropId": 14,
            "centerColor": 8309634,
            "edgeColor": 4562522,
            "patternColor": 158498,
            "textColor": 12451788,
            "hex": {
              "centerColor": "#7ecb82",
              "edgeColor": "#459e5a",
              "patternColor": "#026b22",
              "textColor": "#bdffcc"
            }
          },
        },
        {
          id: 5682,
          icon: '💗',
          title: 'Love Potion',
          description: 'For the most devoted subscribers.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Sunset.json',
          background: {
            "name": "Feldgrau",
            "backdropId": 68,
            "centerColor": 9015944,
            "edgeColor": 6187875,
            "patternColor": 1844767,
            "textColor": 14608865,
            "hex": {
              "centerColor": "#899288",
              "edgeColor": "#5e6b63",
              "patternColor": "#1c261f",
              "textColor": "#dee9e1"
            }
          },
        },
        {
          id: 19529,
          icon: '🍪',
          title: 'Gingerbread',
          description: 'A cozy seasonal gift.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Princess.json',
          background: {
            "name": "Feldgrau",
            "backdropId": 68,
            "centerColor": 9015944,
            "edgeColor": 6187875,
            "patternColor": 1844767,
            "textColor": 14608865,
            "hex": {
              "centerColor": "#899288",
              "edgeColor": "#5e6b63",
              "patternColor": "#1c261f",
              "textColor": "#dee9e1"
            }
          },
        },
        {
          id: 12345,
          icon: '🧸',
          title: 'Teddy Bear',
          description: 'A classic cute gift.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Christmas.json',
          background: {
            "name": "Mexican Pink",
            "backdropId": 71,
            "centerColor": 14902930,
            "edgeColor": 13191548,
            "patternColor": 7668272,
            "textColor": 16766694,
            "hex": {
              "centerColor": "#e36692",
              "edgeColor": "#c9497c",
              "patternColor": "#750230",
              "textColor": "#ffd6e6"
            }
          },
        },
        {
          id: 12346,
          icon: '💝',
          title: 'Heart Box',
          description: 'A premium gift with love.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Emo Boi.json',
          background: {
            "name": "Gunmetal",
            "backdropId": 69,
            "centerColor": 5004643,
            "edgeColor": 3095362,
            "patternColor": 264202,
            "textColor": 11978188,
            "hex": {
              "centerColor": "#4c5d63",
              "edgeColor": "#2f3b42",
              "patternColor": "#04080a",
              "textColor": "#b6c5cc"
            }
          },
        },
        {
          id: 12347,
          icon: '🧸',
          title: 'Golden Teddy',
          description: 'A legendary collectible gift.',
          lottieUrl: 'https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/Cozy Galaxy.json',
          background: {
            "name": "Pistachio",
            "backdropId": 36,
            "centerColor": 9941116,
            "edgeColor": 6062412,
            "patternColor": 2639643,
            "textColor": 14283465,
            "hex": {
              "centerColor": "#97b07c",
              "edgeColor": "#5c814c",
              "patternColor": "#28471b",
              "textColor": "#d9f2c9"
            }
          },
        },
    ]

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full overflow-x-hidden">
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <TabsList className="inline-flex justify-start rounded-none border-b bg-transparent h-auto p-0 min-w-full">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.value !== 'gifts'}
                  className="!bg-transparent !data-[state=active]:bg-transparent dark:!data-[state=active]:bg-transparent rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary !shadow-none !data-[state=active]:shadow-none px-3 py-3 whitespace-nowrap shrink-0 text-muted-foreground data-[state=active]:text-foreground h-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {tab.icons && tab.icons}
                  <span className={tab.icons ? 'ml-1' : ''}>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Gifts Content */}
          <TabsContent value="gifts" className="mt-4 px-4 overflow-x-hidden">
            <GiftGrid gifts={gifts} onSelect={setSelectedGift} />
          </TabsContent>

          {/* Other tabs content */}
          <TabsContent value="posts" className="mt-4 px-4">
            <p className="text-muted-foreground text-center py-8">Posts content</p>
          </TabsContent>
          <TabsContent value="media" className="mt-4 px-4">
            <p className="text-muted-foreground text-center py-8">Media content</p>
          </TabsContent>
          <TabsContent value="saved" className="mt-4 px-4">
            <p className="text-muted-foreground text-center py-8">Saved content</p>
          </TabsContent>
          <TabsContent value="links" className="mt-4 px-4">
            <p className="text-muted-foreground text-center py-8">Links content</p>
          </TabsContent>
          <TabsContent value="gifs" className="mt-4 px-4">
            <p className="text-muted-foreground text-center py-8">GIFs content</p>
          </TabsContent>
        </Tabs>
    )
}