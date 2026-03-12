import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["leetcode", "daily-logs", "resume-bullets", "full"] as const;
type ExportType = typeof ALLOWED_TYPES[number];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type") as ExportType | null;
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Invalid export type. Use: leetcode, daily-logs, resume-bullets, full" },
      { status: 400 }
    );
  }

  switch (type) {
    case "leetcode":
      return exportLeetCode(supabase, user.id);
    case "daily-logs":
      return exportDailyLogs(supabase, user.id);
    case "resume-bullets":
      return exportResumeBullets(supabase, user.id);
    case "full":
      return exportFull(supabase, user.id);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function exportLeetCode(supabase: any, userId: string) {
  const { data } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", userId)
    .order("problem_number", { ascending: true });

  if (!data || data.length === 0) {
    return new NextResponse("No data", { status: 204 });
  }

  const headers = [
    "Problem #",
    "Title",
    "Difficulty",
    "Status",
    "Pattern",
    "Company Tags",
    "Confidence",
    "Attempts",
    "First Solved",
    "Key Insight",
  ];
  const rows = data.map((p: Record<string, unknown>) => [
    p.problem_number,
    `"${String(p.title ?? "").replace(/"/g, '""')}"`,
    p.difficulty,
    p.status,
    p.primary_pattern ?? "",
    Array.isArray(p.company_tags) ? `"${p.company_tags.join(", ")}"` : "",
    p.confidence_level ?? "",
    p.attempts ?? 0,
    p.first_solved_at ?? "",
    `"${String(p.key_insight ?? "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r: unknown[]) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="prepforge-leetcode-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function exportDailyLogs(supabase: any, userId: string) {
  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });

  if (!data || data.length === 0) {
    return new NextResponse("No data", { status: 204 });
  }

  const headers = [
    "Date",
    "Week",
    "Morning Done",
    "Evening 7PM Done",
    "Evening 9PM Done",
    "Evening 10PM Done",
    "Hours Studied",
    "LC Solved",
    "Energy",
    "Productivity",
    "Wins",
    "Blockers",
  ];
  const rows = data.map((l: Record<string, unknown>) => [
    l.log_date,
    l.week_number ?? "",
    l.morning_done ? "Yes" : "No",
    l.evening_7pm_done ? "Yes" : "No",
    l.evening_9pm_done ? "Yes" : "No",
    l.evening_10pm_done ? "Yes" : "No",
    l.total_hours_studied ?? 0,
    l.lc_problems_solved ?? 0,
    l.energy_level ?? "",
    l.productivity_rating ?? "",
    `"${String(l.wins ?? "").replace(/"/g, '""')}"`,
    `"${String(l.blockers ?? "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r: unknown[]) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="prepforge-daily-logs-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function exportResumeBullets(supabase: any, userId: string) {
  const { data } = await supabase
    .from("projects")
    .select("title, impact_metrics")
    .eq("user_id", userId);

  if (!data || data.length === 0) {
    return new NextResponse("No data", { status: 204 });
  }

  const lines: string[] = ["# Resume Bullet Points", ""];
  for (const p of data) {
    lines.push(`## ${p.title}`);
    if (p.impact_metrics && Array.isArray(p.impact_metrics)) {
      for (const bullet of p.impact_metrics) {
        lines.push(`• ${bullet}`);
      }
    } else {
      lines.push("(No impact metrics added yet)");
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="prepforge-resume-bullets-${new Date().toISOString().split("T")[0]}.txt"`,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function exportFull(supabase: any, userId: string) {
  const tables = [
    "profiles",
    "leetcode_problems",
    "lc_attempts",
    "study_topics",
    "projects",
    "project_tasks",
    "companies",
    "daily_logs",
    "mock_interviews",
    "resources",
    "weekly_reviews",
    "behavioral_stories",
  ] as const;

  const result: Record<string, unknown[]> = {};

  for (const table of tables) {
    const col = table === "profiles" ? "id" : "user_id";
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq(col, userId);
    result[table] = data ?? [];
  }

  return NextResponse.json(result, {
    headers: {
      "Content-Disposition": `attachment; filename="prepforge-full-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
