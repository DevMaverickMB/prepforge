"use client";

import { Flame, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { CommandPalette } from "./CommandPalette";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavbarProps {
  prepStartDate?: string;
  streak?: number;
}

export function Navbar({ prepStartDate, streak = 0 }: NavbarProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  const dayNumber = prepStartDate
    ? Math.max(1, differenceInDays(new Date(), new Date(prepStartDate)) + 1)
    : 1;
  const totalDays = 98;
  const weekNumber = Math.min(14, Math.ceil(dayNumber / 7));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4 md:px-8 bg-sidebar/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground shadow-sm">
              <Flame className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-foreground tracking-tight">PrepForge</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 bg-muted/50 px-3 h-8 rounded-lg border border-border/50 hover:bg-muted/80 transition-colors cursor-pointer">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Day</span>
                <span className="text-[13px] font-semibold text-foreground">{Math.min(dayNumber, totalDays)} <span className="text-muted-foreground font-normal">/ {totalDays}</span></span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 bg-card border-border/60" align="start" sideOffset={8}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-[12px] font-semibold text-foreground tracking-tight">98-Day Journey</span>
                    <span className="text-[11px] text-muted-foreground font-medium">Day {Math.min(dayNumber, totalDays)}</span>
                  </div>
                  {/* Full 14×7 dot grid */}
                  <div
                    className="grid grid-cols-7 mx-auto"
                    style={{ gap: 0, gridAutoRows: "20px", gridTemplateColumns: "repeat(7, 20px)", width: "fit-content" }}
                  >
                    {Array.from({ length: totalDays }, (_, i) => {
                      const day = i + 1;
                      const isCompleted = day < dayNumber;
                      const isCurrent = day === dayNumber;
                      const isFuture = day > dayNumber;
                      return (
                        <div
                          key={i}
                          title={`Day ${day}${isCurrent ? " (today)" : ""}`}
                          className="flex items-center justify-center"
                        >
                          <div
                            className={`h-[10px] w-[10px] rounded-full ${
                              isCurrent
                                ? "bg-primary shadow-[0_0_6px_2px] shadow-primary/60 ring-1 ring-primary/30"
                                : isCompleted
                                  ? "bg-foreground/70"
                                  : isFuture
                                    ? "bg-foreground/10"
                                    : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-[7px] w-[7px] rounded-full bg-foreground/70" />
                      <span className="text-[10px] text-muted-foreground">Done</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-[7px] w-[7px] rounded-full bg-primary shadow-[0_0_4px] shadow-primary/50" />
                      <span className="text-[10px] text-muted-foreground">Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-[7px] w-[7px] rounded-full bg-foreground/10" />
                      <span className="text-[10px] text-muted-foreground">Remaining</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 bg-muted/50 px-3 h-8 rounded-lg border border-border/50">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Wk</span>
              <span className="text-[13px] font-semibold text-foreground">{weekNumber}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-3 h-8 rounded-lg">
                <Flame className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Streak</span>
                <span className="text-[13px] font-bold text-primary">{streak}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 h-9 px-3 text-[13px] text-muted-foreground border-border/60 bg-muted/30 hover:bg-muted/80 rounded-lg shadow-sm"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="mr-8">Search...</span>
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center rounded border border-border/50 bg-background px-2 font-mono text-[12px] font-semibold text-muted-foreground">
              /
            </kbd>
          </Button>
          <div className="h-8 border-l border-border/50 hidden md:block"></div>
          <UserMenu />
        </div>
      </header>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
