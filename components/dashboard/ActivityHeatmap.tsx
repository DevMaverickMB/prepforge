import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DayLog {
  log_date: string;
  morning_done: boolean;
  evening_7pm_done: boolean;
  evening_9pm_done: boolean;
  evening_10pm_done: boolean;
}

interface ActivityHeatmapProps {
  weekLogs: DayLog[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ActivityHeatmap({ weekLogs }: ActivityHeatmapProps) {
  function getIntensity(log: DayLog | undefined): string {
    if (!log) return "bg-muted/50 border-border/40 shadow-none";
    const done = [log.morning_done, log.evening_7pm_done, log.evening_9pm_done, log.evening_10pm_done]
      .filter(Boolean).length;
    if (done === 4) return "bg-primary border-primary shadow-sm shadow-primary/20";
    if (done >= 2) return "bg-primary/60 border-primary/40 shadow-sm shadow-primary/10";
    if (done >= 1) return "bg-primary/30 border-primary/20 shadow-none";
    return "bg-muted/50 border-border/40 shadow-none";
  }

  return (
    <Card className="border border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-[15px] font-semibold text-foreground tracking-tight">Week Heatmap</CardTitle>
        <div className="flex gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-2 justify-between">
          {DAY_LABELS.map((label, i) => {
            const log = weekLogs[i];
            return (
              <div key={label} className="flex flex-col items-center gap-3">
                <span className="text-[12px] font-medium text-muted-foreground">{label.charAt(0)}</span>
                <div
                  className={`h-9 w-9 rounded-xl border ${getIntensity(log)} transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-primary/30 cursor-pointer`}
                  title={log ? `${[log.morning_done, log.evening_7pm_done, log.evening_9pm_done, log.evening_10pm_done].filter(Boolean).length}/4 completed` : "No data"}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
