"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfidenceStars } from "./ConfidenceStars";
import { leetcodeProblemSchema, type LeetCodeProblemFormData } from "@/lib/validations/leetcode";
import { addProblem, updateProblem } from "@/lib/actions/leetcode";
import { DSA_PATTERNS, PATTERN_LABELS, LC_SOURCES, LC_SOURCE_LABELS } from "@/lib/constants/leetcode-patterns";
import type { LeetCodeProblem } from "@/types/supabase";
import { toast } from "sonner";
import { useState, useCallback } from "react";

interface AddProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProblem?: LeetCodeProblem | null;
}

export function AddProblemModal({
  open,
  onOpenChange,
  editProblem,
}: AddProblemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editProblem;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeetCodeProblemFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leetcodeProblemSchema) as any,
    defaultValues: editProblem
      ? {
          problem_number: editProblem.problem_number,
          title: editProblem.title,
          leetcode_url: editProblem.leetcode_url,
          difficulty: editProblem.difficulty,
          status: editProblem.status,
          primary_pattern: editProblem.primary_pattern,
          secondary_patterns: editProblem.secondary_patterns,
          company_tags: editProblem.company_tags,
          source: editProblem.source,
          week_number: editProblem.week_number,
          best_time_minutes: editProblem.best_time_minutes,
          best_time_complexity: editProblem.best_time_complexity,
          best_space_complexity: editProblem.best_space_complexity,
          confidence_level: editProblem.confidence_level,
          needs_revision: editProblem.needs_revision,
          next_review_date: editProblem.next_review_date,
          approach_notes: editProblem.approach_notes,
          key_insight: editProblem.key_insight,
          mistakes_made: editProblem.mistakes_made,
          similar_problems: editProblem.similar_problems,
        }
      : {
          status: "todo",
          needs_revision: false,
          difficulty: "Medium",
        },
  });

  const confidenceValue = watch("confidence_level");
  const needsRevision = watch("needs_revision");

  const parseUrl = useCallback(
    (url: string) => {
      // Extract problem slug from LeetCode URL:
      // https://leetcode.com/problems/two-sum/ -> two-sum
      const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
      if (match) {
        const slug = match[1];
        // Convert slug to title: "two-sum" -> "Two Sum"
        const title = slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setValue("title", title);
        setValue("leetcode_url", url);
      }
    },
    [setValue]
  );

  async function onSubmit(data: LeetCodeProblemFormData) {
    setIsSubmitting(true);
    try {
      if (isEditing && editProblem) {
        const result = await updateProblem(editProblem.id, data);
        if (result.error) {
          toast.error(typeof result.error === "string" ? result.error : "Validation error");
          return;
        }
        toast.success("Problem updated");
      } else {
        const result = await addProblem(data);
        if (result.error) {
          toast.error(typeof result.error === "string" ? result.error : "Validation error");
          return;
        }
        toast.success("Problem added");
      }
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveAndNext(data: LeetCodeProblemFormData) {
    setIsSubmitting(true);
    try {
      const result = await addProblem(data);
      if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Validation error");
        return;
      }
      toast.success("Problem added — add another!");
      reset({ status: "todo", needs_revision: false, difficulty: "Medium" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? "Edit Problem" : "Add LeetCode Problem"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 pt-2"
          >
            {/* URL auto-parse */}
            <div className="space-y-2">
              <Label htmlFor="leetcode_url">LeetCode URL</Label>
              <Input
                id="leetcode_url"
                placeholder="https://leetcode.com/problems/two-sum/"
                {...register("leetcode_url", {
                  onChange: (e) => parseUrl(e.target.value),
                })}
              />
              {errors.leetcode_url && (
                <p className="text-sm text-destructive">
                  {errors.leetcode_url.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Paste a LeetCode URL to auto-fill the title
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="problem_number">Problem #</Label>
                <Input
                  id="problem_number"
                  type="number"
                  placeholder="1"
                  {...register("problem_number")}
                />
                {errors.problem_number && (
                  <p className="text-sm text-destructive">
                    {errors.problem_number.message}
                  </p>
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Two Sum"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={watch("difficulty")}
                  onValueChange={(v) =>
                    setValue("difficulty", v as "Easy" | "Medium" | "Hard")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch("status") ?? "todo"}
                  onValueChange={(v) =>
                    setValue("status", v as "todo" | "attempted" | "solved" | "review")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="attempted">Attempted</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Pattern</Label>
                <Select
                  value={watch("primary_pattern") ?? ""}
                  onValueChange={(v) => setValue("primary_pattern", v || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {DSA_PATTERNS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PATTERN_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={watch("source") ?? ""}
                  onValueChange={(v) => setValue("source", v || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LC_SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {LC_SOURCE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_tags">
                  Company Tags{" "}
                  <span className="text-muted-foreground text-xs">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  id="company_tags"
                  placeholder="Google, Amazon, Microsoft"
                  defaultValue={editProblem?.company_tags?.join(", ") ?? ""}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    setValue("company_tags", tags.length > 0 ? tags : null);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="week_number">Week #</Label>
                <Input
                  id="week_number"
                  type="number"
                  min={1}
                  max={14}
                  placeholder="1-14"
                  {...register("week_number")}
                />
              </div>
            </div>

            <Separator />
            <p className="text-sm font-medium">Attempt Log</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="best_time_minutes">Time (minutes)</Label>
                <Input
                  id="best_time_minutes"
                  type="number"
                  placeholder="15"
                  {...register("best_time_minutes")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="best_time_complexity">Time Complexity</Label>
                <Input
                  id="best_time_complexity"
                  placeholder="O(n)"
                  {...register("best_time_complexity")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="best_space_complexity">Space Complexity</Label>
                <Input
                  id="best_space_complexity"
                  placeholder="O(1)"
                  {...register("best_space_complexity")}
                />
              </div>
            </div>

            <Separator />
            <p className="text-sm font-medium">Notes</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="approach_notes">Approach</Label>
                <Textarea
                  id="approach_notes"
                  placeholder="Describe your approach..."
                  rows={3}
                  {...register("approach_notes")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key_insight">Key Insight</Label>
                <Textarea
                  id="key_insight"
                  placeholder='The "aha" moment...'
                  rows={2}
                  {...register("key_insight")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mistakes_made">Mistakes</Label>
                <Textarea
                  id="mistakes_made"
                  placeholder="Common mistakes to avoid..."
                  rows={2}
                  {...register("mistakes_made")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="similar_problems">
                  Similar Problems{" "}
                  <span className="text-muted-foreground text-xs">
                    (comma separated numbers)
                  </span>
                </Label>
                <Input
                  id="similar_problems"
                  placeholder="15, 167, 259"
                  defaultValue={editProblem?.similar_problems?.join(", ") ?? ""}
                  onChange={(e) => {
                    const nums = e.target.value
                      .split(",")
                      .map((n) => parseInt(n.trim()))
                      .filter((n) => !isNaN(n));
                    setValue("similar_problems", nums.length > 0 ? nums : null);
                  }}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Confidence</Label>
                <ConfidenceStars
                  value={confidenceValue ?? null}
                  onChange={(v) => setValue("confidence_level", v)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="needs_revision">Schedule Revision?</Label>
                <Switch
                  id="needs_revision"
                  checked={needsRevision ?? false}
                  onCheckedChange={(v) => setValue("needs_revision", v)}
                />
              </div>
            </div>

            {needsRevision && (
              <div className="space-y-2">
                <Label htmlFor="next_review_date">Next Review Date</Label>
                <Input
                  id="next_review_date"
                  type="date"
                  {...register("next_review_date")}
                />
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {!isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleSaveAndNext)}
                >
                  Save & Next
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
