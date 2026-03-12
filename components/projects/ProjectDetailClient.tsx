"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProject } from "@/lib/actions/projects";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types/supabase";

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [metrics, setMetrics] = useState<string[]>(
    project.impact_metrics ?? []
  );
  const [newMetric, setNewMetric] = useState("");

  async function addMetric() {
    if (!newMetric.trim()) return;
    const updated = [...metrics, newMetric.trim()];
    setMetrics(updated);
    setNewMetric("");
    const result = await updateProject(project.id, {
      impact_metrics: updated,
    });
    if (result.error) toast.error(result.error);
  }

  async function removeMetric(index: number) {
    const updated = metrics.filter((_, i) => i !== index);
    setMetrics(updated);
    const result = await updateProject(project.id, {
      impact_metrics: updated,
    });
    if (result.error) toast.error(result.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Impact Metrics / Resume Bullets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <span className="text-sm flex-1">• {m}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => removeMetric(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add a resume bullet point..."
            value={newMetric}
            onChange={(e) => setNewMetric(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMetric()}
            className="h-8"
          />
          <Button size="sm" onClick={addMetric} disabled={!newMetric.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
