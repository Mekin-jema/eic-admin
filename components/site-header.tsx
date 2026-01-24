"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search as SearchIcon } from "lucide-react";
import NotificationBell from '@/components/notification-bell'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSearch } from "./seach-context";

// --------------------- Search Component ---------------------
interface SearchProps {
    className?: string;
    placeholder?: string;
}

const Search = ({ className = "", placeholder = "Search" }: SearchProps) => {
    const { setOpen } = useSearch();

    return (
        <Button
            variant="outline"
            className={cn(
                "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
                className
            )}
            onClick={() => setOpen(true)}
        >
            <SearchIcon className="mr-2 h-4 w-4" />
            {placeholder}
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
    );
};

// ------------------- DarkModeToggle Component -------------------
const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setTheme(newTheme);
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Button
            size="icon"
            onClick={toggleTheme}
            className="border-none"
        >
            {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

// --------------------- Header Component ---------------------
const Header = () => {
    // const pathname = usePathname();



    // Split path into segments
    // const segments = pathname.split("/").filter
    // (Boolean);

    // First segment (base) should be "dashboard"

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />


                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {usePathname()
                            .split("/")
                            .filter((seg) => seg && seg !== "dashboard")
                            .map((seg, i, arr) => (
                                <React.Fragment key={i}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className="text-muted-foreground capitalize">
                                        <BreadcrumbLink asChild>
                                            <Link href={`/${["dashboard", ...arr.slice(0, i + 1)].join("/")}`}>
                                                {seg.replace(/-/g, " ")}
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                    </BreadcrumbList>
                </Breadcrumb>


            </div>

            <div className="flex items-center gap-2 px-4">
                <div className="hidden md:flex">
                    <Search />
                </div>
                <NotificationBell />
                <DarkModeToggle />
                {/* Uncomment this when you add user auth
          <NavUser />
        */}
            </div>
        </header>
    );
};

export default Header;
