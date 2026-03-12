"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateDayEndForm } from "@/lib/actions/planner";
import { toast } from "sonner";
import { Save, Zap } from "lucide-react";
import type { DailyLog } from "@/types/supabase";

interface DayEndFormProps {
  log: DailyLog;
}

export function DayEndForm({ log }: DayEndFormProps) {
  const [hours, setHours] = useState(log.total_hours_studied);
  const [lcSolved, setLcSolved] = useState(log.lc_problems_solved);
  const [energy, setEnergy] = useState(log.energy_level ?? 5);
  const [productivity, setProductivity] = useState(
    log.productivity_rating ?? 5
  );
  const [wins, setWins] = useState(log.wins ?? "");
  const [blockers, setBlockers] = useState(log.blockers ?? "");
  const [tomorrowFocus, setTomorrowFocus] = useState(
    log.tomorrow_focus ?? ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateDayEndForm(log.id, {
        total_hours_studied: hours,
        lc_problems_solved: lcSolved,
        energy_level: energy,
        productivity_rating: productivity,
        wins: wins || null,
        blockers: blockers || null,
        tomorrow_focus: tomorrowFocus || null,
      });
      toast.success("Day summary saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Day-End Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Numeric fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hours Studied</Label>
            <Input
              type="number"
              min={0}
              max={16}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>LC Problems Solved</Label>
            <Input
              type="number"
              min={0}
              max={20}
              value={lcSolved}
              onChange={(e) => setLcSolved(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Energy & Productivity sliders */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Energy Level: {energy}/10</Label>
            <input
              type="range"
              min={1}
              max={10}
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          <div>
            <Label>Productivity: {productivity}/10</Label>
            <input
              type="range"
              min={1}
              max={10}
              value={productivity}
              onChange={(e) => setProductivity(parseInt(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Text fields */}
        <div>
          <Label>Wins 🏆</Label>
          <Textarea
            placeholder="What went well today?"
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Label>Blockers 🚧</Label>
          <Textarea
            placeholder="What were the challenges?"
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Label>Tomorrow&apos;s Focus 🎯</Label>
          <Textarea
            placeholder="Top priority for tomorrow?"
            value={tomorrowFocus}
            onChange={(e) => setTomorrowFocus(e.target.value)}
            rows={2}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Day Summary"}
        </Button>
      </CardContent>
    </Card>
  );
}
