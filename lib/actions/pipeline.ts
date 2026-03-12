"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCompanies() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .order("priority", { ascending: false });

  return data ?? [];
}

export async function getCompany(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function updateCompany(
  id: string,
  updates: Record<string, unknown>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("companies")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/${id}`);
  return { success: true };
}

export async function addCompany(data: {
  name: string;
  tier?: string;
  role_title?: string;
  application_status?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("companies").insert({
    user_id: user.id,
    name: data.name,
    tier: (data.tier as "tier_1" | "tier_2" | "tier_3") ?? null,
    role_title: data.role_title ?? null,
    application_status:
      (data.application_status as "researching") ?? "researching",
  });

  if (error) return { error: error.message };
  revalidatePath("/pipeline");
  return { success: true };
}
