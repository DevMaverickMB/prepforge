"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { leetcodeProblemSchema, type LeetCodeProblemFormData } from "@/lib/validations/leetcode";

export async function getProblems(params: {
  page?: number;
  status?: string;
  difficulty?: string;
  pattern?: string;
  company?: string;
  source?: string;
  needs_revision?: string;
  week?: string;
  search?: string;
  sort?: string;
  order?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], count: 0 };

  const page = params.page ?? 1;
  const perPage = 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("leetcode_problems")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  // Filters
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status as "todo" | "attempted" | "solved" | "review");
  }
  if (params.difficulty && params.difficulty !== "all") {
    query = query.eq("difficulty", params.difficulty as "Easy" | "Medium" | "Hard");
  }
  if (params.pattern && params.pattern !== "all") {
    query = query.eq("primary_pattern", params.pattern);
  }
  if (params.company && params.company !== "all") {
    query = query.contains("company_tags", [params.company]);
  }
  if (params.source && params.source !== "all") {
    query = query.eq("source", params.source);
  }
  if (params.needs_revision === "yes") {
    query = query.eq("needs_revision", true);
  } else if (params.needs_revision === "no") {
    query = query.eq("needs_revision", false);
  }
  if (params.week && params.week !== "all") {
    query = query.eq("week_number", parseInt(params.week));
  }
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,problem_number.eq.${isNaN(Number(params.search)) ? 0 : params.search}`
    );
  }

  // Sort
  const sortCol = params.sort ?? "problem_number";
  const ascending = params.order !== "desc";
  query = query.order(sortCol, { ascending }).range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function addProblem(formData: LeetCodeProblemFormData) {
  const parsed = leetcodeProblemSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("leetcode_problems").insert({
    user_id: user.id,
    ...parsed.data,
    attempts: parsed.data.status === "solved" || parsed.data.status === "attempted" ? 1 : 0,
    first_solved_at: parsed.data.status === "solved" ? new Date().toISOString() : null,
    last_attempted_at:
      parsed.data.status !== "todo" ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/leetcode");
  return { success: true };
}

export async function updateProblem(id: string, formData: Partial<LeetCodeProblemFormData>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("leetcode_problems")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/leetcode");
  return { success: true };
}

export async function deleteProblem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("leetcode_problems")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/leetcode");
  return { success: true };
}

export async function quickUpdateField(
  id: string,
  field: string,
  value: unknown
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const allowedFields = [
    "status",
    "confidence_level",
    "needs_revision",
    "approach_notes",
    "key_insight",
    "mistakes_made",
  ];
  if (!allowedFields.includes(field)) return { error: "Invalid field" };

  const updateData: Record<string, unknown> = {
    [field]: value,
    updated_at: new Date().toISOString(),
  };

  // Auto-set timestamps based on status changes
  if (field === "status") {
    if (value === "solved" || value === "attempted") {
      updateData.last_attempted_at = new Date().toISOString();
    }
    if (value === "solved") {
      // Only set first_solved_at if not already set
      const { data: existing } = await supabase
        .from("leetcode_problems")
        .select("first_solved_at")
        .eq("id", id)
        .single();
      if (!existing?.first_solved_at) {
        updateData.first_solved_at = new Date().toISOString();
      }
    }
  }

  const { error } = await supabase
    .from("leetcode_problems")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/leetcode");
  return { success: true };
}

export async function getDistinctCompanyTags() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("leetcode_problems")
    .select("company_tags")
    .eq("user_id", user.id)
    .not("company_tags", "is", null);

  if (!data) return [];

  const tags = new Set<string>();
  data.forEach((row) => {
    row.company_tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
