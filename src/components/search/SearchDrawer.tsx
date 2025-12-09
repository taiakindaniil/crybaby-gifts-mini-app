import { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchDrawer({ items }) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Drawer>
      <DrawerTrigger className="p-2 bg-neutral-900 rounded-xl text-white">
        Open Search
      </DrawerTrigger>

      <DrawerContent className="z-[10000] p-4 bg-neutral-950 text-white">
        <DrawerHeader>
          <DrawerTitle>Search</DrawerTitle>
        </DrawerHeader>

        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-2 bg-neutral-800 border-neutral-700 text-white"
        />

        <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-neutral-800 rounded-xl border border-neutral-700"
            >
              {item.title}
            </div>
          ))}
        </div>

        <DrawerFooter>
          <Button>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}