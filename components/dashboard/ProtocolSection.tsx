"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TodayChecklist, type TaskField } from "./TodayChecklist";
import { WeeklyProgressRing } from "./WeeklyProgressRing";
import { ActivityHeatmap } from "./ActivityHeatmap";
import type { DailyLog } from "@/types/supabase";

interface WeekLog {
  log_date: string;
  morning_done: boolean;
  evening_7pm_done: boolean;
  evening_9pm_done: boolean;
  evening_10pm_done: boolean;
}

interface ProtocolSectionProps {
  todayLog: DailyLog | null;
  weekNumber: number | null;
  initialWeekLogs: WeekLog[];
  children?: React.ReactNode;
}

export function ProtocolSection({ todayLog, weekNumber, initialWeekLogs, children }: ProtocolSectionProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [weekLogs, setWeekLogs] = useState<WeekLog[]>(initialWeekLogs);

  function handleToggle(field: TaskField, done: boolean) {
    setWeekLogs((prev) =>
      prev.map((log) =>
        log.log_date === today ? { ...log, [field]: done } : log
      )
    );
  }

  const totalWeekSlots = weekLogs.length * 4;
  const doneWeekSlots = weekLogs.reduce((acc, log) => {
    let count = 0;
    if (log.morning_done) count++;
    if (log.evening_7pm_done) count++;
    if (log.evening_9pm_done) count++;
    if (log.evening_10pm_done) count++;
    return acc + count;
  }, 0);
  const weekProgress = totalWeekSlots > 0 ? Math.round((doneWeekSlots / totalWeekSlots) * 100) : 0;

  return (
    <>
      <div className="lg:col-span-2">
        <TodayChecklist
          log={todayLog}
          weekNumber={weekNumber}
          onToggle={handleToggle}
        />
      </div>
      <div className="space-y-6">
        <WeeklyProgressRing progress={weekProgress} />
        <ActivityHeatmap weekLogs={weekLogs} />
        {children}
      </div>
    </>
  );
}
