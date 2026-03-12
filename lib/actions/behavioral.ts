"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BehavioralStory } from "@/types/supabase";

export async function getBehavioralStories(): Promise<BehavioralStory[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("behavioral_stories")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function addBehavioralStory(story: {
  title: string;
  category: string | null;
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  amazon_lp: string[];
  applicable_companies: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("behavioral_stories").insert({
    user_id: user.id,
    ...story,
  });

  revalidatePath("/behavioral");
}

export async function updateBehavioralStory(
  id: string,
  data: {
    title?: string;
    category?: string | null;
    situation?: string | null;
    task?: string | null;
    action?: string | null;
    result?: string | null;
    amazon_lp?: string[];
    applicable_companies?: string[];
    confidence_level?: number | null;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("behavioral_stories")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/behavioral");
}

export async function deleteBehavioralStory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("behavioral_stories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/behavioral");
}

export async function practiceStory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Get current count
  const { data: story } = await supabase
    .from("behavioral_stories")
    .select("practiced_count")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!story) return;

  await supabase
    .from("behavioral_stories")
    .update({
      practiced_count: story.practiced_count + 1,
      last_practiced_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/behavioral");
}
