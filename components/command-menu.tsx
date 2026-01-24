"use client";

import {
  ArrowRight,
  Laptop,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "./seach-context";
import { data } from "./app-sidebar";
import { ScrollArea } from "./ui/scroll-area";

export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {data.navMain.map((item: {
            title: string;
            url: string;
            icon: React.ComponentType;
          }, i) => (
            <CommandGroup key={item.title} heading={item.title}>
              <CommandItem
                key={`${item.url}-${i}`}
                value={item.title}
                onSelect={() => runCommand(() => router.push(item.url))}
              >
                <div className="mr-2 flex h-4 w-4 items-center justify-center">
                  <ArrowRight className="text-muted-foreground/80 size-2" />
                </div>
                {item.title}
              </CommandItem>
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4 scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
