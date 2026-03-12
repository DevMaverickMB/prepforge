"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { data: profile },
    { data: lcProblems },
    { data: dailyLogs },
    { data: studyTopics },
    { data: companies },
    { data: projects },
    { data: weeklyReviews },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("leetcode_problems").select("*").eq("user_id", user.id),
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("log_date", { ascending: true }),
    supabase.from("study_topics").select("*").eq("user_id", user.id),
    supabase.from("companies").select("*").eq("user_id", user.id),
    supabase.from("projects").select("*").eq("user_id", user.id),
    supabase
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("week_number", { ascending: true }),
  ]);

  return {
    profile,
    lcProblems: lcProblems ?? [],
    dailyLogs: dailyLogs ?? [],
    studyTopics: studyTopics ?? [],
    companies: companies ?? [],
    projects: projects ?? [],
    weeklyReviews: weeklyReviews ?? [],
  };
}
