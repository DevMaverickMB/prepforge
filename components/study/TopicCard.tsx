"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfidenceStars } from "@/components/leetcode/ConfidenceStars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStudyTopic } from "@/lib/actions/study";
import type { StudyTopic } from "@/types/supabase";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface TopicCardProps {
  topic: StudyTopic;
}

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  needs_review: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
};

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  needs_review: "Needs Review",
};

export function TopicCard({ topic }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdate(field: string, value: unknown) {
    setIsUpdating(true);
    const result = await updateStudyTopic(topic.id, { [field]: value });
    if (result.error) toast.error(result.error);
    setIsUpdating(false);
  }

  return (
    <Card className={`transition-all ${isUpdating ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{topic.topic_name}</CardTitle>
          </div>
          <Badge variant="secondary" className={STATUS_COLORS[topic.status]}>
            {STATUS_LABELS[topic.status]}
          </Badge>
        </div>
        {topic.subtopics && topic.subtopics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 ml-6">
            {topic.subtopics.map((sub) => (
              <Badge key={sub} variant="outline" className="text-xs">
                {sub}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Select
                value={topic.status}
                onValueChange={(v) => handleUpdate("status", v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Confidence</p>
              <ConfidenceStars
                value={topic.confidence_level}
                onChange={(v) => handleUpdate("confidence_level", v)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Readiness Checks</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={topic.can_explain_to_interviewer}
                  onCheckedChange={(v) => handleUpdate("can_explain_to_interviewer", v)}
                />
                Can explain to interviewer
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={topic.can_implement_from_scratch}
                  onCheckedChange={(v) => handleUpdate("can_implement_from_scratch", v)}
                />
                Can implement from scratch
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={topic.practiced_interview_questions}
                  onCheckedChange={(v) => handleUpdate("practiced_interview_questions", v)}
                />
                Practiced interview questions
              </label>
            </div>
          </div>

          {topic.week_number && (
            <p className="text-xs text-muted-foreground">
              Week {topic.week_number}
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdate("status", "in_progress")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Study Now
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
