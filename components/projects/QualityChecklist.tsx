"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProject } from "@/lib/actions/projects";
import { toast } from "sonner";
import type { Project } from "@/types/supabase";

interface QualityChecklistProps {
  project: Project;
}

const QUALITY_ITEMS = [
  { key: "has_readme", label: "README with setup instructions" },
  { key: "has_architecture_diagram", label: "Architecture diagram" },
  { key: "has_demo_video", label: "Demo video or screenshots" },
  { key: "has_tests", label: "Unit / integration tests" },
  { key: "has_cicd", label: "CI/CD pipeline" },
  { key: "is_deployed", label: "Deployed and accessible" },
] as const;

export function QualityChecklist({ project }: QualityChecklistProps) {
  const completed = QUALITY_ITEMS.filter(
    (item) => project[item.key]
  ).length;

  async function toggleItem(key: string, current: boolean) {
    const result = await updateProject(project.id, { [key]: !current });
    if (result.error) toast.error(result.error);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Quality Checklist</CardTitle>
          <span className="text-sm text-muted-foreground">
            {completed}/{QUALITY_ITEMS.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {QUALITY_ITEMS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={project[key]}
                onCheckedChange={() => toggleItem(key, project[key])}
              />
              <span
                className={`text-sm ${
                  project[key] ? "line-through text-muted-foreground" : ""
                }`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
