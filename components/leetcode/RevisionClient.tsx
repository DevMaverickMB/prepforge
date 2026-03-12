"use client";

import { useState } from "react";
import { RevisionCard } from "@/components/leetcode/RevisionCard";
import { Badge } from "@/components/ui/badge";
import type { LeetCodeProblem } from "@/types/supabase";

interface RevisionClientProps {
  problems: LeetCodeProblem[];
}

export function RevisionClient({ problems }: RevisionClientProps) {
  const [revisedCount, setRevisedCount] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revision Queue</h1>
          <p className="text-muted-foreground">
            Spaced repetition — practice for active recall
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {revisedCount} of {problems.length} reviewed today
        </Badge>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No problems to review!</p>
          <p className="text-sm mt-1">
            Great job staying on top of your revisions
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <RevisionCard
              key={p.id}
              problem={p}
              onRevised={() => setRevisedCount((c) => c + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
