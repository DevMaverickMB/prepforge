import { z } from "zod";

export const leetcodeProblemSchema = z.object({
  problem_number: z.coerce.number().int().positive("Problem number is required"),
  title: z.string().min(1, "Title is required"),
  leetcode_url: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.includes("leetcode.com"),
      "Must be a LeetCode URL"
    ),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  status: z.enum(["todo", "attempted", "solved", "review"]).default("todo"),
  primary_pattern: z.string().nullable().optional(),
  secondary_patterns: z.array(z.string()).nullable().optional(),
  company_tags: z.array(z.string()).nullable().optional(),
  topics: z.array(z.string()).nullable().optional(),
  source: z.string().nullable().optional(),
  week_number: z.coerce.number().int().min(1).max(14).nullable().optional(),

  // Attempt info
  best_time_minutes: z.coerce.number().positive().nullable().optional(),
  best_time_complexity: z.string().nullable().optional(),
  best_space_complexity: z.string().nullable().optional(),

  // Self-assessment
  confidence_level: z.coerce.number().int().min(1).max(5).nullable().optional(),
  needs_revision: z.boolean().default(false),
  next_review_date: z.string().nullable().optional(),

  // Notes
  approach_notes: z.string().nullable().optional(),
  key_insight: z.string().nullable().optional(),
  mistakes_made: z.string().nullable().optional(),
  similar_problems: z.array(z.coerce.number().int()).nullable().optional(),
});

export type LeetCodeProblemFormData = z.infer<typeof leetcodeProblemSchema>;

export const lcAttemptSchema = z.object({
  problem_id: z.string().uuid(),
  time_taken_minutes: z.coerce.number().positive().nullable().optional(),
  solved: z.boolean().default(false),
  needed_hint: z.boolean().default(false),
  used_editorial: z.boolean().default(false),
  approach: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
