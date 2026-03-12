"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { STUDY_TOPICS_SEED } from "@/lib/constants/study-topics";
import { PROJECTS_SEED } from "@/lib/constants/projects";
import { COMPANIES_SEED } from "@/lib/constants/companies";
import { RESOURCES_SEED } from "@/lib/constants/resources";
import { WEEKLY_PLAN } from "@/lib/constants/weekly-plan";
import { addDays, format } from "date-fns";

export async function seedUserData(userId: string, prepStartDate: string) {
  const supabase = await createClient();

  // Check if already seeded
  const { count } = await supabase
    .from("daily_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count > 0) return { seeded: false };

  // 1. Seed daily logs (98 days)
  const startDate = new Date(prepStartDate);
  const dailyLogs = WEEKLY_PLAN.map((task) => {
    const dayOffset = (task.week - 1) * 7 + (task.day - 1);
    const logDate = format(addDays(startDate, dayOffset), "yyyy-MM-dd");
    return {
      user_id: userId,
      log_date: logDate,
      week_number: task.week,
      morning_task: task.morning_task,
      evening_7pm_task: task.evening_7pm_task,
      evening_9pm_task: task.evening_9pm_task,
      evening_10pm_task: task.evening_10pm_task,
      is_weekend: task.is_weekend,
    };
  });

  // Insert in batches of 50
  for (let i = 0; i < dailyLogs.length; i += 50) {
    const batch = dailyLogs.slice(i, i + 50);
    await supabase.from("daily_logs").insert(batch);
  }

  // 2. Seed study topics
  const studyTopics = STUDY_TOPICS_SEED.map((t) => ({
    user_id: userId,
    category: t.category as Database["public"]["Tables"]["study_topics"]["Insert"]["category"],
    topic_name: t.topic_name,
    subtopics: t.subtopics,
    week_number: t.week_number,
  }));
  await supabase.from("study_topics").insert(studyTopics);

  // 3. Seed projects
  for (const p of PROJECTS_SEED) {
    await supabase.from("projects").insert({
      user_id: userId,
      title: p.title,
      description: p.description,
      project_type: p.project_type,
      tech_stack: p.tech_stack,
      milestones: p.milestones,
      target_completion_date: p.target_completion_date,
    });
  }

  // 4. Seed companies
  const companies = COMPANIES_SEED.map((c) => ({
    user_id: userId,
    name: c.name,
    tier: c.tier,
    careers_page_url: c.careers_page_url,
  }));
  await supabase.from("companies").insert(companies);

  // 5. Seed resources
  const resources = RESOURCES_SEED.map((r) => ({
    user_id: userId,
    title: r.title,
    url: r.url,
    category: r.category,
    topic: r.topic,
  }));
  await supabase.from("resources").insert(resources);

  return { seeded: true };
}
