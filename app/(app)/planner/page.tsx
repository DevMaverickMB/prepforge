import { getAllDailyLogs, getPrepStartDate } from "@/lib/actions/planner";
import { PlannerCalendar } from "@/components/planner/PlannerCalendar";
import { format } from "date-fns";

export default async function PlannerPage() {
  const [logs, prepStartDate] = await Promise.all([
    getAllDailyLogs(),
    getPrepStartDate(),
  ]);

  const startDate = prepStartDate ?? format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">
          Weekly Planner
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          14-week prep calendar. Click any day to view tasks and log your progress.
        </p>
      </div>

      <PlannerCalendar logs={logs} prepStartDate={startDate} />
    </div>
  );
}
