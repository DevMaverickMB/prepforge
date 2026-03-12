import { Card, CardContent } from "@/components/ui/card";
import { Code2, BookOpen, FolderKanban, Send, CalendarCheck } from "lucide-react";

interface MetricCardsProps {
  lcSolved: number;
  lcTotal: number;
  topicsCompleted: number;
  topicsTotal: number;
  projectsCompleted: number;
  projectsTotal: number;
  applicationsSent: number;
  applicationsTotal: number;
  scheduledInterviews: number;
}

export function MetricCards({
  lcSolved,
  lcTotal,
  topicsCompleted,
  topicsTotal,
  projectsCompleted,
  projectsTotal,
  applicationsSent,
  applicationsTotal,
  scheduledInterviews,
}: MetricCardsProps) {
  const metrics = [
    {
      label: "LC Solved",
      value: lcSolved,
      total: lcTotal,
      icon: Code2,
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Topics",
      value: topicsCompleted,
      total: topicsTotal,
      icon: BookOpen,
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Projects",
      value: projectsCompleted,
      total: projectsTotal,
      icon: FolderKanban,
      accent: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Applied",
      value: applicationsSent,
      total: applicationsTotal,
      icon: Send,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Interviews",
      value: scheduledInterviews,
      total: null,
      icon: CalendarCheck,
      accent: "text-rose-500",
      bg: "bg-rose-500/10",
      suffix: "scheduled",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => {
        const percentage = metric.total ? Math.round((metric.value / metric.total) * 100) : null;
        return (
          <Card key={metric.label} className="border border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <metric.icon className="h-4 w-4" />
                  <span className="text-[13px] font-medium">
                    {metric.label}
                  </span>
                </div>
                {/* Simulated action menu from reference */}
                <div className="flex gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="h-[3px] w-[3px] rounded-full bg-current" />
                  <div className="h-[3px] w-[3px] rounded-full bg-current" />
                  <div className="h-[3px] w-[3px] rounded-full bg-current" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold text-foreground tracking-tight">
                    {metric.value}
                  </p>
                  {metric.total !== null && (
                    <span className="text-sm font-medium text-muted-foreground/60">
                      /{metric.total}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {percentage !== null ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      <span className={metric.accent}>↗ {percentage}%</span>
                      <span className="text-muted-foreground/60">progression</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground/60">
                      {metric.suffix ?? "Total tracked"}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
