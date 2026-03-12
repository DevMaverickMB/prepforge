"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { WeeklyReview } from "@/types/supabase";

export async function getWeeklyReviews(): Promise<WeeklyReview[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("week_number", { ascending: false });

  return data ?? [];
}

export async function getWeeklyReview(
  weekNumber: number
): Promise<WeeklyReview | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_number", weekNumber)
    .single();

  return data;
}

export async function getWeekStats(weekNumber: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get daily logs for this week
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_number", weekNumber);

  // Get LC problems solved this week
  const { count: lcCount } = await supabase
    .from("leetcode_problems")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "solved");

  const weekLogs = logs ?? [];
  const totalHours = weekLogs.reduce(
    (sum, l) => sum + l.total_hours_studied,
    0
  );
  const totalTasks = weekLogs.length * 4;
  const doneTasks = weekLogs.reduce((sum, l) => {
    let c = 0;
    if (l.morning_done) c++;
    if (l.evening_7pm_done) c++;
    if (l.evening_9pm_done) c++;
    if (l.evening_10pm_done) c++;
    return sum + c;
  }, 0);
  const lcSolved = weekLogs.reduce((sum, l) => sum + l.lc_problems_solved, 0);

  return {
    totalHours,
    tasksCompleted: doneTasks,
    tasksPlanned: totalTasks,
    lcSolvedThisWeek: lcSolved,
    lcSolvedTotal: lcCount ?? 0,
    daysLogged: weekLogs.length,
  };
}

export async function saveWeeklyReview(
  weekNumber: number,
  data: {
    lc_problems_solved_this_week: number;
    total_hours_studied: number;
    tasks_completed: number;
    tasks_planned: number;
    biggest_win: string | null;
    biggest_challenge: string | null;
    key_learnings: string | null;
    next_week_priorities: string[];
    overall_satisfaction: number | null;
    on_track: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("weekly_reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_number", weekNumber)
    .single();

  if (existing) {
    await supabase
      .from("weekly_reviews")
      .update(data)
      .eq("id", existing.id)
      .eq("user_id", user.id);
  } else {
    await supabase.from("weekly_reviews").insert({
      user_id: user.id,
      week_number: weekNumber,
      review_date: new Date().toISOString().split("T")[0],
      ...data,
    });
  }

  revalidatePath("/review");
}
