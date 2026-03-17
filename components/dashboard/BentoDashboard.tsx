"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Code2, BookOpen, FolderKanban, Send, CalendarCheck } from "lucide-react";
import { TodayChecklist, type TaskField } from "./TodayChecklist";
import { WeeklyProgressRing } from "./WeeklyProgressRing";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UpcomingSection } from "./UpcomingSection";
import { DailyQuote } from "./DailyQuote";
import type { DailyLog } from "@/types/supabase";

interface WeekLog {
  log_date: string;
  morning_done: boolean;
  evening_7pm_done: boolean;
  evening_9pm_done: boolean;
  evening_10pm_done: boolean;
}

interface BentoDashboardProps {
  streak: number;
  todayLog: DailyLog | null;
  weekNumber: number | null;
  initialWeekLogs: WeekLog[];
  // Metrics
  lcSolved: number;
  lcTotal: number;
  topicsCompleted: number;
  topicsTotal: number;
  projectsCompleted: number;
  projectsTotal: number;
  applicationsSent: number;
  applicationsTotal: number;
  scheduledInterviews: number;
  // Upcoming
  projects: Array<{ title: string; target_completion_date: string | null; status: string }>;
  companies: Array<{ name: string; application_status: string; interview_rounds: unknown }>;
  mockCount: number;
}

const METRIC_TILES = [
  {
    key: "lc",
    label: "LC Solved",
    icon: Code2,
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.06]",
    glow: "bg-emerald-400/20",
  },
  {
    key: "topics",
    label: "Topics",
    icon: BookOpen,
    accent: "text-sky-400",
    border: "border-sky-500/20",
    bg: "bg-sky-500/[0.06]",
    glow: "bg-sky-400/20",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    accent: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/[0.06]",
    glow: "bg-violet-400/20",
  },
  {
    key: "applied",
    label: "Applied",
    icon: Send,
    accent: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.06]",
    glow: "bg-amber-400/20",
  },
  {
    key: "interviews",
    label: "Interviews",
    icon: CalendarCheck,
    accent: "text-rose-400",
    border: "border-rose-500/20",
    bg: "bg-rose-500/[0.06]",
    glow: "bg-rose-400/20",
    suffix: "scheduled",
  },
] as const;

export function BentoDashboard({
  streak,
  todayLog,
  weekNumber,
  initialWeekLogs,
  lcSolved,
  lcTotal,
  topicsCompleted,
  topicsTotal,
  projectsCompleted,
  projectsTotal,
  applicationsSent,
  applicationsTotal,
  scheduledInterviews,
  projects,
  companies,
  mockCount,
}: BentoDashboardProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [weekLogs, setWeekLogs] = useState<WeekLog[]>(initialWeekLogs);

  function handleToggle(field: TaskField, done: boolean) {
    setWeekLogs((prev) =>
      prev.map((log) =>
        log.log_date === today ? { ...log, [field]: done } : log
      )
    );
  }

  const doneWeekSlots = weekLogs.reduce(
    (acc, log) =>
      acc +
      [
        log.morning_done,
        log.evening_7pm_done,
        log.evening_9pm_done,
        log.evening_10pm_done,
      ].filter(Boolean).length,
    0
  );
  const weekProgress =
    weekLogs.length > 0
      ? Math.round((doneWeekSlots / (weekLogs.length * 4)) * 100)
      : 0;

  const metricValues: Record<string, { value: number; total: number | null }> = {
    lc: { value: lcSolved, total: lcTotal },
    topics: { value: topicsCompleted, total: topicsTotal },
    projects: { value: projectsCompleted, total: projectsTotal },
    applied: { value: applicationsSent, total: applicationsTotal },
    interviews: { value: scheduledInterviews, total: null },
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ── Row 1: Quote ── */}
      <div className="col-span-12">
        <DailyQuote streak={streak} />
      </div>

      {/* ── Row 2: Metric tiles ── */}
      <div className="col-span-12 grid grid-cols-2 gap-4 lg:grid-cols-5">
      {METRIC_TILES.map((tile) => {
        const { value, total } = metricValues[tile.key];
        const pct = total ? Math.round((value / total) * 100) : null;
        const Icon = tile.icon;

        return (
          <div key={tile.key}>
            <div
              className={`relative flex h-full min-h-[130px] flex-col justify-between overflow-hidden rounded-2xl border ${tile.border} ${tile.bg} p-5`}
            >
              {/* Decorative blur sphere */}
              <div
                className={`pointer-events-none absolute -right-5 -bottom-5 h-20 w-20 rounded-full blur-2xl ${tile.glow}`}
              />

              {/* Top: icon + label */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 border border-border/30">
                  <Icon className={`h-3.5 w-3.5 ${tile.accent}`} />
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {tile.label}
                </span>
              </div>

              {/* Bottom: value */}
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-[2.25rem] font-bold leading-none tracking-tight ${tile.accent}`}>
                    {value}
                  </span>
                  {total !== null && (
                    <span className="text-[14px] font-medium text-muted-foreground/50">
                      /{total}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground/50">
                  {pct !== null
                    ? `${pct}% complete`
                    : ("suffix" in tile ? tile.suffix : "")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* ── Row 3–4: Checklist (left, tall) + Ring + Heatmap (right, stacked) ── */}
      <div className="col-span-12 lg:col-span-7 lg:row-span-2">
        <TodayChecklist
          log={todayLog}
          weekNumber={weekNumber}
          onToggle={handleToggle}
        />
      </div>

      <div className="col-span-6 lg:col-span-5">
        <WeeklyProgressRing progress={weekProgress} />
      </div>

      <div className="col-span-6 lg:col-span-5">
        <ActivityHeatmap weekLogs={weekLogs} />
      </div>

      {/* ── Row 5: Upcoming ── */}
      <div className="col-span-12">
        <UpcomingSection
          projects={projects}
          companies={companies}
          mockCount={mockCount}
        />
      </div>
    </div>
  );
}
