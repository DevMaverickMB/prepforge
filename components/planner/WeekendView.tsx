"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { updateWeekendBlocks } from "@/lib/actions/planner";
import { toast } from "sonner";
import { Plus, Trash2, Save, Clock } from "lucide-react";
import type { WeekendBlock, DailyLog } from "@/types/supabase";

interface WeekendViewProps {
  log: DailyLog;
}

const DEFAULT_TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export function WeekendView({ log }: WeekendViewProps) {
  const initial: WeekendBlock[] =
    (log.weekend_blocks as WeekendBlock[] | null) ??
    DEFAULT_TIMES.map((time) => ({ time, task: "", done: false }));

  const [blocks, setBlocks] = useState<WeekendBlock[]>(initial);
  const [saving, setSaving] = useState(false);

  function updateBlock(
    idx: number,
    field: keyof WeekendBlock,
    value: string | boolean
  ) {
    setBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
    );
  }

  function addBlock() {
    setBlocks((prev) => [...prev, { time: "", task: "", done: false }]);
  }

  function removeBlock(idx: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateWeekendBlocks(log.id, blocks);
      toast.success("Weekend schedule saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const doneCount = blocks.filter((b) => b.done).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekend Time Blocks
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {doneCount}/{blocks.length} blocks completed
          </p>
        </div>
        <Badge variant="secondary">Weekend</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-lg border p-2"
          >
            <Checkbox
              checked={block.done}
              onCheckedChange={(checked) =>
                updateBlock(idx, "done", !!checked)
              }
            />
            <Input
              className="w-24 text-xs"
              placeholder="Time"
              value={block.time}
              onChange={(e) => updateBlock(idx, "time", e.target.value)}
            />
            <Input
              className="flex-1 text-sm"
              placeholder="Task description"
              value={block.task}
              onChange={(e) => updateBlock(idx, "task", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => removeBlock(idx)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={addBlock}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Block
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-3.5 w-3.5 mr-1" />
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
