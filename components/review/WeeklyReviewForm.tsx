"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { saveWeeklyReview } from "@/lib/actions/review";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import { toast } from "sonner";
import {
  Save,
  Clock,
  Code2,
  CheckCircle2,
  Target,
  Plus,
  X,
} from "lucide-react";
import type { WeeklyReview } from "@/types/supabase";

interface WeeklyReviewFormProps {
  weekNumber: number;
  existing: WeeklyReview | null;
  stats: {
    totalHours: number;
    tasksCompleted: number;
    tasksPlanned: number;
    lcSolvedThisWeek: number;
    lcSolvedTotal: number;
    daysLogged: number;
  } | null;
}

export function WeeklyReviewForm({
  weekNumber,
  existing,
  stats,
}: WeeklyReviewFormProps) {
  const phase = WEEK_PHASES[weekNumber] ?? "";
  const [lcSolved, setLcSolved] = useState(
    existing?.lc_problems_solved_this_week ?? stats?.lcSolvedThisWeek ?? 0
  );
  const [hours, setHours] = useState(
    existing?.total_hours_studied ?? stats?.totalHours ?? 0
  );
  const [tasksCompleted, setTasksCompleted] = useState(
    existing?.tasks_completed ?? stats?.tasksCompleted ?? 0
  );
  const [tasksPlanned, setTasksPlanned] = useState(
    existing?.tasks_planned ?? stats?.tasksPlanned ?? 0
  );
  const [biggestWin, setBiggestWin] = useState(existing?.biggest_win ?? "");
  const [biggestChallenge, setBiggestChallenge] = useState(
    existing?.biggest_challenge ?? ""
  );
  const [keyLearnings, setKeyLearnings] = useState(
    existing?.key_learnings ?? ""
  );
  const [priorities, setPriorities] = useState<string[]>(
    existing?.next_week_priorities ?? [""]
  );
  const [satisfaction, setSatisfaction] = useState(
    existing?.overall_satisfaction ?? 5
  );
  const [onTrack, setOnTrack] = useState(existing?.on_track ?? true);
  const [saving, setSaving] = useState(false);

  function addPriority() {
    setPriorities((p) => [...p, ""]);
  }

  function removePriority(idx: number) {
    setPriorities((p) => p.filter((_, i) => i !== idx));
  }

  function updatePriority(idx: number, val: string) {
    setPriorities((p) => p.map((v, i) => (i === idx ? val : v)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveWeeklyReview(weekNumber, {
        lc_problems_solved_this_week: lcSolved,
        total_hours_studied: hours,
        tasks_completed: tasksCompleted,
        tasks_planned: tasksPlanned,
        biggest_win: biggestWin || null,
        biggest_challenge: biggestChallenge || null,
        key_learnings: keyLearnings || null,
        next_week_priorities: priorities.filter((p) => p.trim()),
        overall_satisfaction: satisfaction,
        on_track: onTrack,
      });
      toast.success("Weekly review saved!");
    } catch {
      toast.error("Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Week header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Week {weekNumber} Review
          </h2>
          <p className="text-sm text-muted-foreground">{phase}</p>
        </div>
        {existing && (
          <Badge variant="outline" className="text-green-600">
            Already reviewed
          </Badge>
        )}
      </div>

      {/* Auto-computed stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 text-center">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-2xl font-bold">{stats.totalHours}h</div>
              <div className="text-xs text-muted-foreground">
                Hours Studied
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Code2 className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-2xl font-bold">
                {stats.lcSolvedThisWeek}
              </div>
              <div className="text-xs text-muted-foreground">LC Solved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-2xl font-bold">
                {stats.tasksCompleted}/{stats.tasksPlanned}
              </div>
              <div className="text-xs text-muted-foreground">
                Tasks Done
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-2xl font-bold">{stats.daysLogged}/7</div>
              <div className="text-xs text-muted-foreground">Days Logged</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Week Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>LC Problems Solved</Label>
                <Input
                  type="number"
                  min={0}
                  value={lcSolved}
                  onChange={(e) =>
                    setLcSolved(parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Total Hours</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={hours}
                  onChange={(e) =>
                    setHours(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Tasks Completed</Label>
                <Input
                  type="number"
                  min={0}
                  value={tasksCompleted}
                  onChange={(e) =>
                    setTasksCompleted(parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Tasks Planned</Label>
                <Input
                  type="number"
                  min={0}
                  value={tasksPlanned}
                  onChange={(e) =>
                    setTasksPlanned(parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Satisfaction: {satisfaction}/10</Label>
              <input
                type="range"
                min={1}
                max={10}
                value={satisfaction}
                onChange={(e) =>
                  setSatisfaction(parseInt(e.target.value))
                }
                className="w-full mt-2 accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Disappointed</span>
                <span>Very Satisfied</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={onTrack}
                onCheckedChange={setOnTrack}
              />
              <Label>On track with overall prep plan?</Label>
            </div>
          </CardContent>
        </Card>

        {/* Right: Reflection */}
        <Card>
          <CardHeader>
            <CardTitle>Reflection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Biggest Win 🏆</Label>
              <Textarea
                placeholder="What was your best achievement this week?"
                value={biggestWin}
                onChange={(e) => setBiggestWin(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label>Biggest Challenge 🚧</Label>
              <Textarea
                placeholder="What was the hardest part?"
                value={biggestChallenge}
                onChange={(e) => setBiggestChallenge(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label>Key Learnings 📚</Label>
              <Textarea
                placeholder="What did you learn this week?"
                value={keyLearnings}
                onChange={(e) => setKeyLearnings(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next week priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Next Week Priorities 🎯</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priorities.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-6">
                {idx + 1}.
              </span>
              <Input
                placeholder="Priority for next week..."
                value={p}
                onChange={(e) => updatePriority(idx, e.target.value)}
                className="flex-1"
              />
              {priorities.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removePriority(idx)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPriority}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Priority
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Weekly Review"}
      </Button>
    </div>
  );
}
