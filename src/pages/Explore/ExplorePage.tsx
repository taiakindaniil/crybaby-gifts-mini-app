import type { FC } from 'react'
import { Page } from '@/components/Page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketCapTab } from './MarketCapTab'
import { GiftsTab } from './GiftsTab'
import { VolumeTab } from './VolumeTab'
import { GainersTab } from './GainersTab'

export const ExplorePage: FC = () => {
  return (
    <Page back={false}>
      <Tabs defaultValue="market-cap" className="w-full">
        <TabsList className="w-full justify-around">
          <TabsTrigger value="gifts">My Gifts</TabsTrigger>
          <TabsTrigger value="market-cap">Market Cap</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="gainers">Gainers</TabsTrigger>
        </TabsList>

        <TabsContent value="gifts"><GiftsTab /></TabsContent>
        <TabsContent value="market-cap"><MarketCapTab /></TabsContent>
        <TabsContent value="volume"><VolumeTab /></TabsContent>
        <TabsContent value="gainers"><GainersTab /></TabsContent>
      </Tabs>
    </Page>
  )
}