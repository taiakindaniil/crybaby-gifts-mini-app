import { useState, type FC } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import type { GiftBackground } from "@/types/gift";
import { Spinner } from "../ui/spinner";
import { InputGroup, InputGroupAddon } from "../ui/input-group";
import { Search } from "lucide-react";

type Item = {
  id: string
  title: string
  image?: string
  background?: GiftBackground
  pattern?: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  items: Item[]
  handleSelect: (item: Item) => void
}

export const SearchDrawer: FC<Props> = ({ open, onOpenChange, title, items, handleSelect }) => {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent className="z-[10000] p-4 bg-neutral-950 text-foreground bg-background border-none rounded-t-3xl h-[100vh] [&>div:first-child]:hidden">
        <div className="bg-foreground/8 mx-auto hidden h-1 w-[80px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"></div>
        <DrawerHeader className="px-2 pb-0 pt-2">
          <DrawerTitle className="text-2xl text-left">{title}</DrawerTitle>
        </DrawerHeader>

        <InputGroup className="py-6 mt-3 rounded-xl bg-card border-0 text-foreground">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <Input
            placeholder="Search..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none !bg-transparent"
          />
        </InputGroup>

        {items.length == 0 ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <div className="mt-4 overflow-y-auto space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border active:scale-95 transition-transform"
                onClick={() => handleSelect(item)}
              >
                {item.image && <img width={44} height={44} src={item.image} />}
                {item.pattern && <img width={44} height={44} src={item.pattern} className="dark:brightness-0 dark:invert box-border p-2" />}
                {item.background && (
                  <div
                    className="w-[44px] h-[44px] rounded-md text-white overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, ${item.background?.hex.centerColor} 0%, ${item.background?.hex.edgeColor} 100%)`
                    }}
                  />
                )}
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}