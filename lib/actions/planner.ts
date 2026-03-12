"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DailyLog } from "@/types/supabase";

export async function getAllDailyLogs(): Promise<DailyLog[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("log_date", { ascending: true });

  return data ?? [];
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", date)
    .single();

  return data;
}

export async function toggleTask(
  logId: string,
  field: "morning_done" | "evening_7pm_done" | "evening_9pm_done" | "evening_10pm_done",
  done: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("daily_logs")
    .update({ [field]: done })
    .eq("id", logId)
    .eq("user_id", user.id);

  revalidatePath("/planner");
}

export async function updateDayEndForm(
  logId: string,
  data: {
    total_hours_studied: number;
    lc_problems_solved: number;
    energy_level: number | null;
    productivity_rating: number | null;
    wins: string | null;
    blockers: string | null;
    tomorrow_focus: string | null;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("daily_logs")
    .update(data)
    .eq("id", logId)
    .eq("user_id", user.id);

  revalidatePath("/planner");
}

export async function updateWeekendBlocks(
  logId: string,
  blocks: { time: string; task: string; done: boolean }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("daily_logs")
    .update({ weekend_blocks: blocks })
    .eq("id", logId)
    .eq("user_id", user.id);

  revalidatePath("/planner");
}

export async function getPrepStartDate(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("prep_start_date")
    .eq("id", user.id)
    .single();

  return data?.prep_start_date ?? null;
}
