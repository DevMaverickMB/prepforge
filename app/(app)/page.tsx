import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { DayCounter } from "@/components/dashboard/DayCounter";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { TodayChecklist } from "@/components/dashboard/TodayChecklist";
import { WeeklyProgressRing } from "@/components/dashboard/WeeklyProgressRing";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { UpcomingSection } from "@/components/dashboard/UpcomingSection";
import { SeedTrigger } from "@/components/dashboard/SeedTrigger";
import { DailyQuote } from "@/components/dashboard/DailyQuote";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user needs seeding
  const { count: logCount } = await supabase
    .from("daily_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (logCount === 0) {
    return <SeedTrigger userId={user.id} />;
  }

  const today = format(new Date(), "yyyy-MM-dd");

  // Fetch all dashboard data in parallel
  const [
    { data: profile },
    { data: todayLog },
    { data: lcProblems },
    { data: studyTopics },
    { data: projects },
    { data: companies },
    { data: weekLogs },
    { data: mockInterviews },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .single(),
    supabase
      .from("leetcode_problems")
      .select("id, status")
      .eq("user_id", user.id),
    supabase
      .from("study_topics")
      .select("id, status, category")
      .eq("user_id", user.id),
    supabase
      .from("projects")
      .select("id, status, title, target_completion_date")
      .eq("user_id", user.id),
    supabase
      .from("companies")
      .select("id, application_status, name, interview_rounds")
      .eq("user_id", user.id),
    // Get this week's logs for heatmap
    supabase
      .from("daily_logs")
      .select("log_date, morning_done, evening_7pm_done, evening_9pm_done, evening_10pm_done")
      .eq("user_id", user.id)
      .gte("log_date", format(getWeekStart(new Date()), "yyyy-MM-dd"))
      .lte("log_date", format(getWeekEnd(new Date()), "yyyy-MM-dd"))
      .order("log_date"),
    supabase
      .from("mock_interviews")
      .select("id")
      .eq("user_id", user.id),
  ]);

  // Compute metrics
  const lcSolved = lcProblems?.filter((p) => p.status === "solved").length ?? 0;
  const totalTopics = studyTopics?.length ?? 0;
  const completedTopics = studyTopics?.filter((t) => t.status === "completed").length ?? 0;
  const completedProjects = projects?.filter((p) =>
    p.status === "deployed" || p.status === "polished"
  ).length ?? 0;
  const applicationsSent = companies?.filter((c) =>
    !["researching", "ready_to_apply"].includes(c.application_status)
  ).length ?? 0;
  const scheduledInterviews = companies?.filter((c) => {
    const rounds = c.interview_rounds as Array<{ result: string | null }> | null;
    return rounds?.some(r => r.result === null);
  }).length ?? 0;

  // Streak
  const streak = profile?.daily_streak ?? 0;

  // Week progress: how many tasks are done this week
  const weekTasks = weekLogs ?? [];
  const totalWeekSlots = weekTasks.length * 4;
  const doneWeekSlots = weekTasks.reduce((acc, log) => {
    let count = 0;
    if (log.morning_done) count++;
    if (log.evening_7pm_done) count++;
    if (log.evening_9pm_done) count++;
    if (log.evening_10pm_done) count++;
    return acc + count;
  }, 0);
  const weekProgress = totalWeekSlots > 0 ? Math.round((doneWeekSlots / totalWeekSlots) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Top bar: Day counter + streak */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-6">
        <DayCounter
          prepStartDate={profile?.prep_start_date ?? today}
          totalDays={98}
        />
        <StreakCounter streak={streak} />
      </div>

      {/* Daily Quote Center Section */}
      <div className="w-full">
        <DailyQuote />
      </div>

      {/* Metric cards */}
      <MetricCards
        lcSolved={lcSolved}
        lcTotal={350}
        topicsCompleted={completedTopics}
        topicsTotal={totalTopics}
        projectsCompleted={completedProjects}
        projectsTotal={projects?.length ?? 3}
        applicationsSent={applicationsSent}
        applicationsTotal={70}
        scheduledInterviews={scheduledInterviews}
      />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's checklist */}
        <div className="lg:col-span-2">
          <TodayChecklist
            log={todayLog}
            weekNumber={todayLog?.week_number ?? null}
          />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <WeeklyProgressRing progress={weekProgress} />
          <ActivityHeatmap weekLogs={weekTasks} />
          <UpcomingSection
            projects={projects ?? []}
            companies={companies ?? []}
            mockCount={mockInterviews?.length ?? 0}
          />
        </div>
      </div>
    </div>
  );
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}
