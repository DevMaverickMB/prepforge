"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProject } from "@/lib/actions/projects";
import { toast } from "sonner";
import type { Project, ProjectMilestone } from "@/types/supabase";

interface MilestoneChecklistProps {
  project: Project;
}

export function MilestoneChecklist({ project }: MilestoneChecklistProps) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(
    project.milestones ?? []
  );

  async function toggleMilestone(index: number) {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, done: !m.done } : m
    );
    setMilestones(updated);

    // Calculate new progress
    const completed = updated.filter((m) => m.done).length;
    const progress = Math.round((completed / updated.length) * 100);

    const result = await updateProject(project.id, {
      milestones: updated,
      progress_percent: progress,
    });
    if (result.error) toast.error(result.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={m.done}
                onCheckedChange={() => toggleMilestone(i)}
                className="mt-0.5"
              />
              <div>
                <p
                  className={`text-sm ${
                    m.done
                      ? "line-through text-muted-foreground"
                      : "font-medium"
                  }`}
                >
                  {m.title}
                </p>
                {m.date && (
                  <p className="text-xs text-muted-foreground">
                    Target: {m.date}
                  </p>
                )}
              </div>
            </label>
          ))}
          {milestones.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No milestones defined
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
