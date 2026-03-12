"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/settings";
import { logout } from "@/app/(auth)/actions";
import { toast } from "sonner";
import { Save, LogOut, User, Target, Calendar, Download } from "lucide-react";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsClientProps {
  profile: Profile;
  email: string;
}

export function SettingsClient({ profile, email }: SettingsClientProps) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [currentRole, setCurrentRole] = useState(profile.current_role);
  const [experience, setExperience] = useState(profile.experience_years);
  const [targetRole, setTargetRole] = useState(profile.target_role);
  const [prepStart, setPrepStart] = useState(profile.prep_start_date);
  const [targetMonth, setTargetMonth] = useState(
    profile.target_interview_month
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName || null,
        current_role: currentRole,
        experience_years: experience,
        target_role: targetRole,
        prep_start_date: prepStart,
        target_interview_month: targetMonth,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and preparation details.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current Role</Label>
              <Input
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                min={0}
                value={experience}
                onChange={(e) =>
                  setExperience(parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prep Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            Preparation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Target Role</Label>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Prep Start Date
              </Label>
              <Input
                type="date"
                value={prepStart}
                onChange={(e) => setPrepStart(e.target.value)}
              />
            </div>
            <div>
              <Label>Target Interview Month</Label>
              <Input
                type="month"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Streak:</span>{" "}
              <span className="font-medium">{profile.daily_streak} days</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longest Streak:</span>{" "}
              <span className="font-medium">
                {profile.longest_streak} days
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Active:</span>{" "}
              <span className="font-medium">
                {profile.last_active_date ?? "Never"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since:</span>{" "}
              <span className="font-medium">
                {new Date(profile.created_at).toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <a href="/api/export?type=leetcode" download>
              <Button variant="outline" className="w-full">
                LeetCode CSV
              </Button>
            </a>
            <a href="/api/export?type=daily-logs" download>
              <Button variant="outline" className="w-full">
                Daily Logs CSV
              </Button>
            </a>
            <a href="/api/export?type=resume-bullets" download>
              <Button variant="outline" className="w-full">
                Resume Bullets
              </Button>
            </a>
            <a href="/api/export?type=full" download>
              <Button variant="outline" className="w-full">
                Full JSON Export
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>

        <form action={logout}>
          <Button variant="outline" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </form>
      </div>
    </div>
  );
}
