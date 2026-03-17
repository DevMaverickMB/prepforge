import { getDailyLog } from "@/lib/actions/planner";
import { DailyChecklist } from "@/components/planner/DailyChecklist";
import { DayEndForm } from "@/components/planner/DayEndForm";
import { WeekendView } from "@/components/planner/WeekendView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, addDays, subDays, isValid } from "date-fns";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

export default async function DayPage({ params }: DayPageProps) {
  const { date: rawDate } = await params;

  // Handle "today" or invalid date params
  if (rawDate === "today") {
    redirect(`/planner/${format(new Date(), "yyyy-MM-dd")}`);
  }

  const parsed = parseISO(rawDate);
  if (!isValid(parsed)) {
    redirect(`/planner/${format(new Date(), "yyyy-MM-dd")}`);
  }

  const date = rawDate;
  const log = await getDailyLog(date);
  const prevDate = format(subDays(parsed, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(parsed, 1), "yyyy-MM-dd");
  const dayOfWeek = parsed.getDay(); // 0=Sun, 6=Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/planner">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {format(parsed, "EEEE, MMMM d, yyyy")}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {log?.week_number && (
                <Badge variant="secondary">Week {log.week_number}</Badge>
              )}
              {isWeekend && (
                <Badge variant="outline" className="text-blue-600">
                  Weekend
                </Badge>
              )}
              {date === format(new Date(), "yyyy-MM-dd") && (
                <Badge>Today</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/planner/${prevDate}`}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
          </Link>
          <Link href={`/planner/${nextDate}`}>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {!log ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No plan for this date</p>
          <p className="text-sm">
            This date may be outside your 14-week prep window.
          </p>
          <Link href="/planner" className="mt-4 inline-block">
            <Button variant="outline">Back to Calendar</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Tasks */}
          <div className="space-y-6">
            <DailyChecklist log={log} />
            {isWeekend && <WeekendView log={log} />}
          </div>

          {/* Right: Day-end form */}
          <div>
            <DayEndForm log={log} />
          </div>
        </div>
      )}
    </div>
  );
}
