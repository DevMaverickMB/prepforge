"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  FolderKanban,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Brain,
  BookmarkIcon,
  BarChart3,
  Settings,
  Flame,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leetcode", label: "LeetCode", icon: Code2 },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/pipeline", label: "Pipeline", icon: Building2 },
  { href: "/planner", label: "Planner", icon: CalendarDays },
];

const secondaryNavItems = [
  { href: "/review", label: "Review", icon: ClipboardCheck },
  { href: "/behavioral", label: "Behavioral", icon: Brain },
  { href: "/resources", label: "Resources", icon: BookmarkIcon },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-sidebar pt-4">
      <div className="flex h-12 items-center gap-3 px-8 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground shadow-sm">
          <Flame className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold text-foreground tracking-tight">PrepForge</span>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="px-4 mb-2 mt-4 text-xs font-medium text-muted-foreground/70">Overview</div>
        <nav className="flex flex-col gap-0.5 mb-6">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all duration-200 rounded-xl",
                  isActive
                    ? "bg-muted text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-colors duration-200",
                  isActive ? "text-primary flex-shrink-0" : "text-muted-foreground group-hover:text-foreground flex-shrink-0"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mb-2 text-xs font-medium text-muted-foreground/70">Workspace</div>
        <nav className="flex flex-col gap-0.5 mb-8">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2 text-[14px] font-medium transition-all duration-200 rounded-xl",
                  isActive
                    ? "bg-muted text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-colors duration-200",
                  isActive ? "text-primary flex-shrink-0" : "text-muted-foreground group-hover:text-foreground flex-shrink-0"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
