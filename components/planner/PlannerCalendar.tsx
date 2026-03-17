"use client";

import { Card } from "@/components/ui/card";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import { format, parseISO, addDays, differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";
import type { DailyLog } from "@/types/supabase";
import {
  CalendarDays,
  CheckCircle2,
  Flame,
  TrendingUp,
} from "lucide-react";

interface PlannerCalendarProps {
  logs: DailyLog[];
  prepStartDate: string;
}

type CellStatus = "full" | "partial" | "none" | "future";

function getCompletionStatus(log: DailyLog): "full" | "partial" | "none" {
  let done = 0;
  if (log.morning_done) done++;
  if (log.evening_7pm_done) done++;
  if (log.evening_9pm_done) done++;
  if (log.evening_10pm_done) done++;
  if (done === 4) return "full";
  if (done > 0) return "partial";
  return "none";
}

function statusDot(status: CellStatus) {
  switch (status) {
    case "full":
      return "bg-emerald-400";
    case "partial":
      return "bg-amber-400";
    case "none":
      return "bg-red-400/70";
    case "future":
      return "bg-border/40";
  }
}

function statusBorder(status: CellStatus, isToday: boolean) {
  if (isToday) return "border-primary ring-1 ring-primary/40";
  switch (status) {
    case "full":
      return "border-emerald-500/30";
    case "partial":
      return "border-amber-500/20";
    case "none":
      return "border-red-500/15";
    case "future":
      return "border-border/30";
  }
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Unique phase groupings with colors for the sidebar
const PHASE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "DSA Foundations": { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  "ML Fundamentals": { bg: "bg-sky-500/10", text: "text-sky-400", dot: "bg-sky-400" },
  "Deep Learning": { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  "LLM / GenAI": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", dot: "bg-fuchsia-400" },
  "Projects Sprint": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  "ML System Design": { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  "Interview Prep": { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
  "Final Review": { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
};

export function PlannerCalendar({ logs, prepStartDate }: PlannerCalendarProps) {
  const router = useRouter();
  const logMap = new Map(logs.map((l) => [l.log_date, l]));
  const startDate = parseISO(prepStartDate);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDate = new Date();

  // Compute stats
  const dayOffset = differenceInCalendarDays(todayDate, startDate);
  const currentWeek = Math.min(14, Math.max(1, Math.floor(dayOffset / 7) + 1));
  const completedDays = logs.filter((l) => getCompletionStatus(l) === "full").length;
  const totalPastDays = Math.min(98, Math.max(0, dayOffset + 1));
  const partialDays = logs.filter((l) => getCompletionStatus(l) === "partial").length;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/70 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[22px] font-bold leading-none text-foreground">{completedDays}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Days completed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/70 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <p className="text-[22px] font-bold leading-none text-foreground">{partialDays}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Partial days</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/70 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[22px] font-bold leading-none text-foreground">W{currentWeek}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{WEEK_PHASES[currentWeek]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/70 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <p className="text-[22px] font-bold leading-none text-foreground">
              {totalPastDays > 0 ? Math.round((completedDays / totalPastDays) * 100) : 0}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Completion rate</p>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <Card className="border border-border/30 bg-card/50 rounded-2xl overflow-hidden">
        {/* Day header */}
        <div className="grid grid-cols-[140px_repeat(7,1fr)] border-b border-border/30 bg-muted/20">
          <div className="px-4 py-3 text-[12px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
            Phase
          </div>
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="text-center text-[12px] font-semibold text-muted-foreground py-3 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week rows */}
        <div>
          {Array.from({ length: 14 }, (_, weekIdx) => {
            const weekNum = weekIdx + 1;
            const phase = WEEK_PHASES[weekNum] ?? "";
            const phaseStyle = PHASE_COLORS[phase] ?? { bg: "bg-muted/10", text: "text-muted-foreground", dot: "bg-muted-foreground" };
            const isCurrentWeek = weekNum === currentWeek;

            return (
              <div
                key={weekNum}
                className={`grid grid-cols-[140px_repeat(7,1fr)] border-b border-border/20 last:border-b-0 transition-colors ${
                  isCurrentWeek ? "bg-primary/[0.04]" : "hover:bg-muted/10"
                }`}
              >
                {/* Week/Phase label */}
                <div className="flex items-center gap-2.5 px-4 py-2.5">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${phaseStyle.dot}`} />
                  <div className="min-w-0">
                    <span className={`text-[12px] font-bold ${isCurrentWeek ? "text-primary" : "text-foreground/80"}`}>
                      W{weekNum}
                    </span>
                    <p className={`text-[10px] font-medium truncate ${phaseStyle.text} opacity-70`}>
                      {phase}
                    </p>
                  </div>
                </div>

                {/* Day cells */}
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const dayOff = weekIdx * 7 + dayIdx;
                  const cellDate = addDays(startDate, dayOff);
                  const dateStr = format(cellDate, "yyyy-MM-dd");
                  const log = logMap.get(dateStr);
                  const isFuture = dateStr > today;
                  const isToday = dateStr === today;

                  const status: CellStatus = log
                    ? getCompletionStatus(log)
                    : isFuture
                    ? "future"
                    : "none";

                  const tasksDone = log
                    ? [
                        log.morning_done,
                        log.evening_7pm_done,
                        log.evening_9pm_done,
                        log.evening_10pm_done,
                      ].filter(Boolean).length
                    : 0;

                  return (
                    <div key={dateStr} className="flex items-center justify-center p-1.5">
                      <button
                        onClick={() => router.push(`/planner/${dateStr}`)}
                        className={`
                          relative w-full rounded-lg border p-2.5 text-center transition-all
                          hover:ring-2 hover:ring-primary/40 hover:scale-[1.03] active:scale-[0.98]
                          cursor-pointer bg-background/40
                          ${statusBorder(status, isToday)}
                        `}
                      >
                        {/* Date */}
                        <div className={`text-[11px] font-semibold ${isToday ? "text-primary" : "text-foreground/70"}`}>
                          {format(cellDate, "d MMM")}
                        </div>

                        {/* Status dots row */}
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          {log ? (
                            [log.morning_done, log.evening_7pm_done, log.evening_9pm_done, log.evening_10pm_done].map((done, i) => (
                              <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-400" : "bg-red-400/50"}`}
                              />
                            ))
                          ) : (
                            <div className={`h-1.5 w-6 rounded-full ${statusDot(status)} opacity-40`} />
                          )}
                        </div>

                        {/* Task count for logged days */}
                        {log && (
                          <div className={`text-[9px] font-bold mt-1 ${
                            tasksDone === 4 ? "text-emerald-400" : tasksDone > 0 ? "text-amber-400" : "text-red-400/60"
                          }`}>
                            {tasksDone}/4
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400" /> Complete
        </span>
        <span className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-400" /> Partial
        </span>
        <span className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400/70" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-border/40" /> Future
        </span>
      </div>
    </div>
  );
}
