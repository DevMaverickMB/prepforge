"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import { toggleTask } from "@/lib/actions/planner";
import { useOptimistic, useTransition } from "react";
import type { DailyLog } from "@/types/supabase";

interface DailyChecklistProps {
  log: DailyLog;
}

type TaskField =
  | "morning_done"
  | "evening_7pm_done"
  | "evening_9pm_done"
  | "evening_10pm_done";

interface TaskItem {
  field: TaskField;
  time: string;
  task: string | null;
  done: boolean;
}

export function DailyChecklist({ log }: DailyChecklistProps) {
  const phase = log.week_number ? WEEK_PHASES[log.week_number] : null;
  const [, startTransition] = useTransition();

  const tasks: TaskItem[] = [
    {
      field: "morning_done",
      time: "6–7 AM",
      task: log.morning_task,
      done: log.morning_done,
    },
    {
      field: "evening_7pm_done",
      time: "7–8 PM",
      task: log.evening_7pm_task,
      done: log.evening_7pm_done,
    },
    {
      field: "evening_9pm_done",
      time: "9–10 PM",
      task: log.evening_9pm_task,
      done: log.evening_9pm_done,
    },
    {
      field: "evening_10pm_done",
      time: "10–11 PM",
      task: log.evening_10pm_task,
      done: log.evening_10pm_done,
    },
  ];

  const [optimisticTasks, setOptimisticTask] = useOptimistic(
    tasks,
    (state, { field, done }: { field: TaskField; done: boolean }) =>
      state.map((t) => (t.field === field ? { ...t, done } : t))
  );

  const doneCount = optimisticTasks.filter((t) => t.done).length;

  function handleToggle(field: TaskField, done: boolean) {
    startTransition(async () => {
      setOptimisticTask({ field, done });
      await toggleTask(log.id, field, done);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Daily Tasks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {doneCount}/4 completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {phase && (
            <Badge variant="secondary">
              Week {log.week_number}: {phase}
            </Badge>
          )}
          {doneCount === 4 && (
            <Badge className="bg-green-500/20 text-green-700 border-green-500/50">
              🎉 All done!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {optimisticTasks.map((task) => (
          <label
            key={task.field}
            className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              checked={task.done}
              onCheckedChange={(checked) =>
                handleToggle(task.field, !!checked)
              }
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px]">
                  {task.time}
                </Badge>
              </div>
              <p
                className={`text-sm ${
                  task.done
                    ? "line-through text-muted-foreground"
                    : "font-medium"
                }`}
              >
                {task.task ?? "No task set"}
              </p>
            </div>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
