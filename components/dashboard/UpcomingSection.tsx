import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, FolderKanban, Building2 } from "lucide-react";
import { format, isPast, isFuture, parseISO } from "date-fns";

interface UpcomingSectionProps {
  projects: Array<{ title: string; target_completion_date: string | null; status: string }>;
  companies: Array<{ name: string; interview_rounds: unknown }>;
  mockCount: number;
}

interface UpcomingItem {
  icon: typeof CalendarDays;
  text: string;
  date: string | null;
}

export function UpcomingSection({ projects, companies }: UpcomingSectionProps) {
  const upcoming: UpcomingItem[] = [];

  // Project deadlines
  for (const project of projects) {
    if (
      project.target_completion_date &&
      project.status !== "deployed" &&
      project.status !== "polished"
    ) {
      const date = parseISO(project.target_completion_date);
      if (isFuture(date) || isToday(date)) {
        upcoming.push({
          icon: FolderKanban,
          text: `${project.title} deadline`,
          date: format(date, "MMM d"),
        });
      } else if (isPast(date)) {
        upcoming.push({
          icon: FolderKanban,
          text: `${project.title} — overdue!`,
          date: format(date, "MMM d"),
        });
      }
    }
  }

  // Scheduled interviews
  for (const company of companies) {
    const rounds = company.interview_rounds as Array<{
      round: string;
      date: string | null;
      status: string;
    }> | null;
    if (rounds) {
      for (const round of rounds) {
        if (round.status === "scheduled" && round.date) {
          upcoming.push({
            icon: Building2,
            text: `${company.name} — ${round.round}`,
            date: format(parseISO(round.date), "MMM d"),
          });
        }
      }
    }
  }

  // Sort by date
  upcoming.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const displayItems = upcoming.slice(0, 4);

  return (
    <Card className="border border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-[15px] font-semibold text-foreground tracking-tight">Upcoming</CardTitle>
        <div className="flex gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {displayItems.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-[13px] font-medium text-muted-foreground">
              No upcoming deadlines.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {displayItems.map((item, i) => (
              <li key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-muted border border-border/60 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[14px] font-medium leading-tight truncate text-foreground">{item.text}</p>
                  {item.date && (
                    <p className="text-[12px] font-medium text-muted-foreground mt-1">{item.date}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
