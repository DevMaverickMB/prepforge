"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  FolderKanban,
  Building2,
  CalendarDays,
  Brain,
  BookmarkIcon,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pages = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "LeetCode Tracker", href: "/leetcode", icon: Code2 },
  { name: "LeetCode Analytics", href: "/leetcode/analytics", icon: BarChart3 },
  { name: "Revision Queue", href: "/leetcode/revision", icon: Code2 },
  { name: "Study Tracker", href: "/study", icon: BookOpen },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Interview Pipeline", href: "/pipeline", icon: Building2 },
  { name: "Weekly Planner", href: "/planner", icon: CalendarDays },
  { name: "Behavioral Stories", href: "/behavioral", icon: Brain },
  { name: "Resources", href: "/resources", icon: BookmarkIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const actions = [
  { name: "Add LeetCode Problem", href: "/leetcode?add=true", icon: Plus },
  { name: "Log Today's Progress", href: "/planner/today", icon: CalendarDays },
  { name: "Add Company", href: "/pipeline?add=true", icon: Plus },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Close dialog whenever the route changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      onOpenChange(false);
      prevPathname.current = pathname;
    }
  }, [pathname, onOpenChange]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={page.href}
              onSelect={() => navigate(page.href)}
            >
              <page.icon className="mr-2 h-4 w-4" />
              {page.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quick Actions">
          {actions.map((action) => (
            <CommandItem
              key={action.href}
              value={action.href}
              onSelect={() => navigate(action.href)}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
