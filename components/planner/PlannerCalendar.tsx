"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import { format, parseISO, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import type { DailyLog } from "@/types/supabase";
import {
  CheckCircle2,
  Circle,
  MinusCircle,
  CalendarDays,
} from "lucide-react";

interface PlannerCalendarProps {
  logs: DailyLog[];
  prepStartDate: string;
}

function getCompletionStatus(log: DailyLog): "full" | "partial" | "none" {
  const total = 4;
  let done = 0;
  if (log.morning_done) done++;
  if (log.evening_7pm_done) done++;
  if (log.evening_9pm_done) done++;
  if (log.evening_10pm_done) done++;
  if (done === total) return "full";
  if (done > 0) return "partial";
  return "none";
}

function getStatusColor(status: "full" | "partial" | "none" | "future") {
  switch (status) {
    case "full":
      return "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400";
    case "partial":
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-400";
    case "none":
      return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400";
    case "future":
      return "bg-muted/30 border-border text-muted-foreground";
  }
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function PlannerCalendar({ logs, prepStartDate }: PlannerCalendarProps) {
  const router = useRouter();
  const logMap = new Map(logs.map((l) => [l.log_date, l]));
  const startDate = parseISO(prepStartDate);
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <CardTitle>14-Week Prep Calendar</CardTitle>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" /> Complete
          </span>
          <span className="flex items-center gap-1">
            <MinusCircle className="h-3 w-3 text-yellow-500" /> Partial
          </span>
          <span className="flex items-center gap-1">
            <Circle className="h-3 w-3 text-red-500" /> Missed
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Header row */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1 mb-2">
          <div />
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week rows */}
        <div className="space-y-1">
          {Array.from({ length: 14 }, (_, weekIdx) => {
            const weekNum = weekIdx + 1;
            const phase = WEEK_PHASES[weekNum] ?? "";

            return (
              <div
                key={weekNum}
                className="grid grid-cols-[100px_repeat(7,1fr)] gap-1"
              >
                {/* Week label */}
                <div className="flex items-center">
                  <Badge variant="outline" className="text-[10px] truncate w-full justify-center">
                    W{weekNum}: {phase.split(" ").slice(0, 2).join(" ")}
                  </Badge>
                </div>

                {/* Day cells */}
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const dayOffset = weekIdx * 7 + dayIdx;
                  const cellDate = addDays(startDate, dayOffset);
                  const dateStr = format(cellDate, "yyyy-MM-dd");
                  const log = logMap.get(dateStr);
                  const isFuture = dateStr > today;
                  const isToday = dateStr === today;

                  const status = log
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
                    <button
                      key={dateStr}
                      onClick={() => router.push(`/planner/${dateStr}`)}
                      className={`
                        relative rounded-md border p-1.5 text-center transition-all
                        hover:ring-2 hover:ring-primary/50 cursor-pointer
                        ${getStatusColor(status)}
                        ${isToday ? "ring-2 ring-primary" : ""}
                      `}
                    >
                      <div className="text-[10px] font-medium">
                        {format(cellDate, "d MMM")}
                      </div>
                      {log && (
                        <div className="text-[10px] mt-0.5">
                          {tasksDone}/4
                        </div>
                      )}
                      {dayIdx >= 5 && (
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
