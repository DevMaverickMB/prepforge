"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStudyTopics(category?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("study_topics")
    .select("*")
    .eq("user_id", user.id)
    .order("week_number", { ascending: true });

  if (category && category !== "all") {
    query = query.eq("category", category as "ml_fundamentals" | "deep_learning" | "llm_genai" | "system_design" | "ml_system_design" | "statistics" | "distributed_systems" | "mlops");
  }

  const { data } = await query;
  return data ?? [];
}

export async function updateStudyTopic(
  id: string,
  updates: {
    status?: string;
    confidence_level?: number;
    notes?: string;
    resource_links?: string[];
    can_explain_to_interviewer?: boolean;
    can_implement_from_scratch?: boolean;
    practiced_interview_questions?: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updateData: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("study_topics")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/study");
  return { success: true };
}

export async function getStudyStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: topics } = await supabase
    .from("study_topics")
    .select("category, status")
    .eq("user_id", user.id);

  if (!topics) return null;

  const stats: Record<string, { total: number; completed: number; inProgress: number }> = {};
  topics.forEach((t) => {
    if (!stats[t.category]) {
      stats[t.category] = { total: 0, completed: 0, inProgress: 0 };
    }
    stats[t.category].total++;
    if (t.status === "completed") stats[t.category].completed++;
    if (t.status === "in_progress") stats[t.category].inProgress++;
  });

  return stats;
}
