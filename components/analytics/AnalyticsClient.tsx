"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { format, differenceInDays, parseISO, eachDayOfInterval, subDays } from "date-fns";
import type {
  Profile,
  LeetCodeProblem,
  DailyLog,
  StudyTopic,
  Company,
  WeeklyReview,
} from "@/types/supabase";
import type { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface AnalyticsData {
  profile: Profile | null;
  lcProblems: LeetCodeProblem[];
  dailyLogs: DailyLog[];
  studyTopics: StudyTopic[];
  companies: Company[];
  projects: Project[];
  weeklyReviews: WeeklyReview[];
}

const CATEGORY_LABELS: Record<string, string> = {
  ml_fundamentals: "ML Fundamentals",
  deep_learning: "Deep Learning",
  llm_genai: "LLM / GenAI",
  system_design: "System Design",
  ml_system_design: "ML System Design",
  statistics: "Statistics",
  distributed_systems: "Distributed Systems",
  mlops: "MLOps",
};

const CATEGORY_COLORS: Record<string, string> = {
  ml_fundamentals: "#3b82f6",
  deep_learning: "#8b5cf6",
  llm_genai: "#ec4899",
  system_design: "#f59e0b",
  ml_system_design: "#10b981",
  statistics: "#6366f1",
  distributed_systems: "#f97316",
  mlops: "#14b8a6",
};

const PIPELINE_STAGES = [
  { key: "researching", label: "Researching", fill: "#94a3b8" },
  { key: "ready_to_apply", label: "Ready", fill: "#60a5fa" },
  { key: "applied", label: "Applied", fill: "#818cf8" },
  { key: "referral_sent", label: "Referral", fill: "#a78bfa" },
  { key: "oa_received", label: "OA/Screen", fill: "#fbbf24" },
  { key: "phone_screen", label: "Phone", fill: "#fb923c" },
  { key: "onsite", label: "Onsite", fill: "#34d399" },
  { key: "offer", label: "Offer", fill: "#22c55e" },
  { key: "rejected", label: "Rejected", fill: "#f87171" },
];

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const { profile, lcProblems, dailyLogs, studyTopics, companies, projects, weeklyReviews } = data;

  // Readiness score (simple calculation)
  const lcSolved = lcProblems.filter((p) => p.status === "solved").length;
  const lcTarget = 150;
  const lcScore = Math.min(100, Math.round((lcSolved / lcTarget) * 100));

  const topicsCompleted = studyTopics.filter((t) => t.status === "completed").length;
  const topicsTotal = studyTopics.length || 1;
  const studyScore = Math.round((topicsCompleted / topicsTotal) * 100);

  const projectsDeployed = projects.filter(
    (p) => p.status === "deployed" || p.status === "polished"
  ).length;
  const projectScore = Math.min(100, Math.round((projectsDeployed / Math.max(projects.length, 1)) * 100));

  const appsSent = companies.filter(
    (c) => !["researching", "ready_to_apply"].includes(c.application_status)
  ).length;
  const pipelineScore = Math.min(100, Math.round((appsSent / Math.max(companies.length, 1)) * 100));

  const readiness = Math.round((lcScore * 0.35 + studyScore * 0.25 + projectScore * 0.2 + pipelineScore * 0.2));

  // Day count
  const dayCount = profile?.prep_start_date
    ? differenceInDays(new Date(), parseISO(profile.prep_start_date)) + 1
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Day {dayCount} · {lcSolved} problems solved · {topicsCompleted}/{studyTopics.length} topics
        </p>
      </div>

      {/* Top row: Readiness + Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <ReadinessGauge score={readiness} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              LC Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lcSolved}/{lcTarget}</div>
            <p className="text-xs text-muted-foreground">{lcScore}% of target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topicsCompleted}/{studyTopics.length}</div>
            <p className="text-xs text-muted-foreground">{studyScore}% completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appsSent}</div>
            <p className="text-xs text-muted-foreground">of {companies.length} companies</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <LCProgressArea problems={lcProblems} />
        <DailyHoursBar logs={dailyLogs} />
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <CategoryCompletion topics={studyTopics} />
        <ApplicationFunnel companies={companies} />
      </div>

      {/* Full-width heatmap */}
      <ConsistencyHeatmap logs={dailyLogs} prepStartDate={profile?.prep_start_date ?? null} />

      {/* Streak history from weekly reviews */}
      <StreakHistory reviews={weeklyReviews} logs={dailyLogs} />
    </div>
  );
}

// --- Readiness Gauge ---
function ReadinessGauge({ score }: { score: number }) {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const gaugeData = [{ value: score, fill: color }];

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-28 h-28">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={gaugeData}
              barSize={10}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: "hsl(var(--muted))" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-3xl font-bold -mt-6" style={{ color }}>
          {score}
        </div>
        <p className="text-xs text-muted-foreground mt-1">out of 100</p>
      </CardContent>
    </Card>
  );
}

// --- LC Progress Area Chart ---
function LCProgressArea({ problems }: { problems: LeetCodeProblem[] }) {
  const solved = problems
    .filter((p) => p.status === "solved" && p.first_solved_at)
    .sort(
      (a, b) =>
        new Date(a.first_solved_at!).getTime() - new Date(b.first_solved_at!).getTime()
    );

  const cumulative: { date: string; count: number }[] = [];
  let count = 0;
  const dateMap = new Map<string, number>();

  for (const p of solved) {
    const dateStr = format(new Date(p.first_solved_at!), "MMM dd");
    count++;
    dateMap.set(dateStr, count);
  }

  for (const [date, c] of dateMap) {
    cumulative.push({ date, count: c });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">LC Problems Solved (Cumulative)</CardTitle>
      </CardHeader>
      <CardContent>
        {cumulative.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No solved problems yet
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={cumulative}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Daily Hours Bar Chart ---
function DailyHoursBar({ logs }: { logs: DailyLog[] }) {
  const last30 = logs
    .filter((l) => {
      const d = parseISO(l.log_date);
      return differenceInDays(new Date(), d) <= 30;
    })
    .map((l) => ({
      date: format(parseISO(l.log_date), "MMM dd"),
      hours: l.total_hours_studied,
      lc: l.lc_problems_solved,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Study Hours (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {last30.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No daily logs yet
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={last30}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Category Completion ---
function CategoryCompletion({ topics }: { topics: AnalyticsData["studyTopics"] }) {
  const categories = Object.keys(CATEGORY_LABELS);
  const chartData = categories
    .map((cat) => {
      const catTopics = topics.filter((t) => t.category === cat);
      const completed = catTopics.filter((t) => t.status === "completed").length;
      const total = catTopics.length;
      return {
        name: CATEGORY_LABELS[cat],
        completed,
        remaining: total - completed,
        total,
        fill: CATEGORY_COLORS[cat],
      };
    })
    .filter((d) => d.total > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Study Category Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No study topics yet
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="#e2e8f0" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Application Funnel ---
function ApplicationFunnel({ companies }: { companies: Company[] }) {
  const funnelData = PIPELINE_STAGES.map((stage) => ({
    name: stage.label,
    value: companies.filter((c) => c.application_status === stage.key).length,
    fill: stage.fill,
  })).filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Application Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        {funnelData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No companies in pipeline yet
          </p>
        ) : (
          <div className="space-y-2">
            {funnelData.map((stage) => (
              <div key={stage.name} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium text-right">{stage.name}</div>
                <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${Math.max(
                        10,
                        (stage.value / Math.max(companies.length, 1)) * 100
                      )}%`,
                      backgroundColor: stage.fill,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {stage.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Consistency Heatmap ---
function ConsistencyHeatmap({
  logs,
  prepStartDate,
}: {
  logs: DailyLog[];
  prepStartDate: string | null;
}) {
  if (!prepStartDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">98-Day Consistency Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Set your prep start date to see the heatmap
          </p>
        </CardContent>
      </Card>
    );
  }

  const start = parseISO(prepStartDate);
  const logMap = new Map<string, DailyLog>();
  for (const log of logs) {
    logMap.set(log.log_date, log);
  }

  // Build 14 weeks × 7 days grid
  const weeks: { date: string; level: number; weekNum: number; dayNum: number }[][] = [];
  for (let w = 0; w < 14; w++) {
    const week: typeof weeks[0] = [];
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d;
      const date = format(addDaysToDate(start, dayIndex), "yyyy-MM-dd");
      const log = logMap.get(date);
      let level = 0;
      if (log) {
        const tasks = [
          log.morning_done,
          log.evening_7pm_done,
          log.evening_9pm_done,
          log.evening_10pm_done,
        ];
        const done = tasks.filter(Boolean).length;
        level = done === 0 ? 0 : done <= 1 ? 1 : done <= 2 ? 2 : done <= 3 ? 3 : 4;
      }
      week.push({ date, level, weekNum: w + 1, dayNum: d });
    }
    weeks.push(week);
  }

  const colors = ["bg-muted", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-600"];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">98-Day Consistency Heatmap</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            {colors.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(14, 1fr)` }}>
            {/* Day labels column */}
            {dayLabels.map((label, i) => (
              <div
                key={`label-${i}`}
                className="text-xs text-muted-foreground flex items-center pr-2"
                style={{ gridColumn: 1, gridRow: i + 1 }}
              >
                {label}
              </div>
            ))}
            {/* Week columns */}
            {weeks.map((week, wi) => (
              week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`aspect-square rounded-sm ${colors[day.level]} cursor-default`}
                  style={{ gridColumn: wi + 2, gridRow: di + 1 }}
                  title={`${day.date} (Week ${day.weekNum}): ${day.level}/4 tasks`}
                />
              ))
            ))}
          </div>
          {/* Week labels */}
          <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: `auto repeat(14, 1fr)` }}>
            <div />
            {weeks.map((_, wi) => (
              <div
                key={wi}
                className="text-xs text-muted-foreground text-center"
              >
                {wi + 1}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Streak History ---
function StreakHistory({
  reviews,
  logs,
}: {
  reviews: AnalyticsData["weeklyReviews"];
  logs: DailyLog[];
}) {
  // Build streak data from daily logs
  const streakData: { week: string; streak: number; hours: number }[] = [];

  if (reviews.length > 0) {
    for (const r of reviews) {
      streakData.push({
        week: `W${r.week_number}`,
        streak: 0, // We don't have streak per week, use total hours as proxy
        hours: r.total_hours_studied,
      });
    }
  } else if (logs.length > 0) {
    // Group logs by week
    const weekMap = new Map<number, { hours: number; days: number }>();
    for (const l of logs) {
      const wn = l.week_number ?? 1;
      const existing = weekMap.get(wn) ?? { hours: 0, days: 0 };
      existing.hours += l.total_hours_studied;
      existing.days += 1;
      weekMap.set(wn, existing);
    }
    for (const [wn, data] of weekMap) {
      streakData.push({
        week: `W${wn}`,
        streak: data.days,
        hours: data.hours,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly Study Hours</CardTitle>
      </CardHeader>
      <CardContent>
        {streakData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Complete weekly reviews to see trends
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={streakData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to avoid importing addDays from date-fns in a way that conflicts
function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
