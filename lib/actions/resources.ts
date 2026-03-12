"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type Resource = Database["public"]["Tables"]["resources"]["Row"];

export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("user_id", user.id)
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function addResource(resource: {
  title: string;
  url: string;
  category: string | null;
  topic: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("resources").insert({
    user_id: user.id,
    ...resource,
  });

  revalidatePath("/resources");
}

export async function updateResource(
  id: string,
  data: {
    is_completed?: boolean;
    progress_percent?: number;
    notes?: string | null;
    is_favorite?: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("resources")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/resources");
}

export async function deleteResource(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("resources")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/resources");
}
