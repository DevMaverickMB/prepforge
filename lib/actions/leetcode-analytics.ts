"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLeetCodeAnalytics() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: problems } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", user.id);

  if (!problems) return null;

  // Pattern confidence map
  const patternMap: Record<string, { total: number; sumConfidence: number; count: number }> = {};
  problems.forEach((p) => {
    if (p.primary_pattern) {
      if (!patternMap[p.primary_pattern]) {
        patternMap[p.primary_pattern] = { total: 0, sumConfidence: 0, count: 0 };
      }
      patternMap[p.primary_pattern].total++;
      if (p.confidence_level) {
        patternMap[p.primary_pattern].sumConfidence += p.confidence_level;
        patternMap[p.primary_pattern].count++;
      }
    }
  });

  const patternData = Object.entries(patternMap).map(([pattern, data]) => ({
    pattern,
    total: data.total,
    avgConfidence: data.count > 0 ? Math.round((data.sumConfidence / data.count) * 10) / 10 : 0,
  }));

  // Difficulty distribution
  const difficultyData = [
    { name: "Easy", value: problems.filter((p) => p.difficulty === "Easy").length, fill: "#22c55e" },
    { name: "Medium", value: problems.filter((p) => p.difficulty === "Medium").length, fill: "#f97316" },
    { name: "Hard", value: problems.filter((p) => p.difficulty === "Hard").length, fill: "#ef4444" },
  ];

  // Company coverage
  const companyMap: Record<string, number> = {};
  problems.forEach((p) => {
    p.company_tags?.forEach((tag) => {
      companyMap[tag] = (companyMap[tag] || 0) + 1;
    });
  });
  const companyData = Object.entries(companyMap)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Daily solve rate
  const dailySolveMap: Record<string, number> = {};
  problems.forEach((p) => {
    if (p.first_solved_at) {
      const date = p.first_solved_at.split("T")[0];
      dailySolveMap[date] = (dailySolveMap[date] || 0) + 1;
    }
  });
  const dailySolveData = Object.entries(dailySolveMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Weak patterns (avg confidence < 3)
  const weakPatterns = patternData
    .filter((p) => p.avgConfidence > 0)
    .sort((a, b) => a.avgConfidence - b.avgConfidence);

  // Summary stats
  const solved = problems.filter((p) => p.status === "solved").length;
  const totalAttempts = problems.reduce((sum, p) => sum + p.attempts, 0);
  const needsRevision = problems.filter((p) => p.needs_revision).length;

  return {
    patternData,
    difficultyData,
    companyData,
    dailySolveData,
    weakPatterns,
    summary: {
      total: problems.length,
      solved,
      totalAttempts,
      needsRevision,
      avgConfidence:
        problems.filter((p) => p.confidence_level).length > 0
          ? Math.round(
              (problems
                .filter((p) => p.confidence_level)
                .reduce((sum, p) => sum + (p.confidence_level ?? 0), 0) /
                problems.filter((p) => p.confidence_level).length) *
                10
            ) / 10
          : 0,
    },
  };
}
