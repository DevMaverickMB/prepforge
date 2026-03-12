"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import { createClient } from "@/lib/supabase/client";
import { useOptimistic, useTransition } from "react";
import type { DailyLog } from "@/types/supabase";

interface TodayChecklistProps {
  log: DailyLog | null;
  weekNumber: number | null;
}

type TaskField = "morning_done" | "evening_7pm_done" | "evening_9pm_done" | "evening_10pm_done";

interface TaskItem {
  field: TaskField;
  label: string;
  time: string;
  task: string | null;
  done: boolean;
}

export function TodayChecklist({ log, weekNumber }: TodayChecklistProps) {
  const phase = weekNumber ? WEEK_PHASES[weekNumber] : null;
  const [, startTransition] = useTransition();

  const tasks: TaskItem[] = [
    { field: "morning_done", label: "Morning", time: "6\u20137 AM", task: log?.morning_task ?? null, done: log?.morning_done ?? false },
    { field: "evening_7pm_done", label: "Evening", time: "7\u20138 PM", task: log?.evening_7pm_task ?? null, done: log?.evening_7pm_done ?? false },
    { field: "evening_9pm_done", label: "Evening", time: "9\u201310 PM", task: log?.evening_9pm_task ?? null, done: log?.evening_9pm_done ?? false },
    { field: "evening_10pm_done", label: "Evening", time: "10\u201311 PM", task: log?.evening_10pm_task ?? null, done: log?.evening_10pm_done ?? false },
  ];

  const [optimisticTasks, setOptimisticTask] = useOptimistic(
    tasks,
    (state, { field, done }: { field: TaskField; done: boolean }) =>
      state.map((t) => (t.field === field ? { ...t, done } : t))
  );

  async function toggleTask(field: TaskField, done: boolean) {
    if (!log) return;
    startTransition(async () => {
      setOptimisticTask({ field, done });
      const supabase = createClient();
      await supabase.from("daily_logs").update({ [field]: done }).eq("id", log.id);
    });
  }

  if (!log) {
    return (
      <Card className="border border-border/50 bg-card rounded-2xl shadow-sm col-span-2">
        <CardHeader className="pb-4 border-b border-border/40">
          <CardTitle className="text-sm font-semibold text-foreground">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-xl font-medium text-muted-foreground/50">No tasks set for today.</p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = optimisticTasks.filter(t => t.done).length;

  return (
    <Card className="border border-border/50 bg-card rounded-2xl shadow-sm col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b border-border/40 bg-muted/20">
        <div className="space-y-1.5">
          <CardTitle className="text-[17px] font-semibold text-foreground tracking-tight">Today's Protocol</CardTitle>
          <div className="flex items-center gap-3 text-[13px] font-medium text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              {completedCount} / {optimisticTasks.length} Done
            </span>
            {phase && <span className="text-muted-foreground/70">Wk {weekNumber} &middot; {phase}</span>}
          </div>
        </div>
        <div className="flex gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {optimisticTasks.map((task) => (
            <label
              key={task.field}
              className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors group"
            >
              <Checkbox
                checked={task.done}
                onCheckedChange={(checked) => toggleTask(task.field, !!checked)}
                className="rounded text-primary border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all h-5 w-5"
              />
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <p className={`text-[15px] font-medium transition-colors ${task.done ? "line-through text-muted-foreground/50" : "text-foreground group-hover:text-primary"}`}>
                  {task.task ?? "Unassigned block"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50 shrink-0">
                    {task.time}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
