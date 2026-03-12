"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceStars } from "./ConfidenceStars";
import { quickUpdateField } from "@/lib/actions/leetcode";
import { PATTERN_LABELS } from "@/lib/constants/leetcode-patterns";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import type { LeetCodeProblem } from "@/types/supabase";
import { toast } from "sonner";

interface RevisionCardProps {
  problem: LeetCodeProblem;
  onRevised: () => void;
}

export function RevisionCard({ problem, onRevised }: RevisionCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  async function handleMarkRevised(newConfidence: number) {
    setIsMarking(true);
    try {
      // Update confidence
      await quickUpdateField(problem.id, "confidence_level", newConfidence);

      // If confidence >= 3, clear needs_revision
      if (newConfidence >= 3) {
        await quickUpdateField(problem.id, "needs_revision", false);
      }

      toast.success("Marked as revised");
      onRevised();
    } finally {
      setIsMarking(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                problem.difficulty === "Easy"
                  ? "text-green-600 border-green-300"
                  : problem.difficulty === "Medium"
                  ? "text-orange-600 border-orange-300"
                  : "text-red-600 border-red-300"
              }
            >
              {problem.difficulty}
            </Badge>
            {problem.primary_pattern && (
              <Badge variant="secondary" className="text-xs">
                {PATTERN_LABELS[problem.primary_pattern as keyof typeof PATTERN_LABELS] ??
                  problem.primary_pattern}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRevealed(!revealed)}
          >
            {revealed ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardTitle className="text-base">
          {revealed ? (
            <a
              href={problem.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              #{problem.problem_number}. {problem.title}
            </a>
          ) : (
            <span className="text-muted-foreground italic">
              Problem #{problem.problem_number} — click eye to reveal
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Last attempted:{" "}
              {problem.last_attempted_at
                ? formatDistanceToNow(new Date(problem.last_attempted_at), {
                    addSuffix: true,
                  })
                : "Never"}
            </span>
            <ConfidenceStars
              value={problem.confidence_level}
              size="sm"
              readonly
            />
          </div>

          {revealed && problem.approach_notes && (
            <div className="text-sm bg-muted/50 rounded p-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Approach
              </p>
              <p className="whitespace-pre-wrap">{problem.approach_notes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">
              Mark revised with confidence:
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((c) => (
                <Button
                  key={c}
                  variant={c >= 3 ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={isMarking}
                  onClick={() => handleMarkRevised(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
