"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  CalendarDays,
  Building2,
  MoreHorizontal,
} from "lucide-react";

const mobileNavItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/leetcode", label: "LeetCode", icon: Code2 },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/pipeline", label: "Pipeline", icon: Building2 },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16 items-center justify-around border-t border-border/50 bg-background/80 backdrop-blur-xl">
      {mobileNavItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && item.href !== "/more" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href === "/more" ? "/settings" : item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
