"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCompany } from "@/lib/actions/pipeline";
import { toast } from "sonner";
import type { Company, InterviewRound } from "@/types/supabase";
import { Plus, Save, Trash2 } from "lucide-react";

interface CompanyDetailClientProps {
  company: Company;
}

export function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const [status, setStatus] = useState(company.application_status);
  const [roleTitle, setRoleTitle] = useState(company.role_title ?? "");
  const [referrerName, setReferrerName] = useState(company.referrer_name ?? "");
  const [referrerLinkedin, setReferrerLinkedin] = useState(company.referrer_linkedin ?? "");
  const [referralStatus, setReferralStatus] = useState(company.referral_status ?? "none");
  const [aiNotes, setAiNotes] = useState(company.ai_products_notes ?? "");
  const [tips, setTips] = useState(company.interview_tips ?? "");
  const [expectedCtc, setExpectedCtc] = useState(company.expected_ctc_range ?? "");
  const [offerCtc, setOfferCtc] = useState(company.offer_ctc ?? "");
  const [notes, setNotes] = useState(company.notes ?? "");
  const [rounds, setRounds] = useState<InterviewRound[]>(company.interview_rounds ?? []);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    const result = await updateCompany(company.id, {
      application_status: status,
      role_title: roleTitle || null,
      referrer_name: referrerName || null,
      referrer_linkedin: referrerLinkedin || null,
      referral_status: referralStatus || "none",
      ai_products_notes: aiNotes || null,
      interview_tips: tips || null,
      expected_ctc_range: expectedCtc || null,
      offer_ctc: offerCtc || null,
      notes: notes || null,
      interview_rounds: rounds,
    });
    if (result.error) toast.error(result.error);
    else toast.success("Saved");
    setIsSaving(false);
  }

  function addRound() {
    setRounds([
      ...rounds,
      {
        round_name: `Round ${rounds.length + 1}`,
        date: null,
        interviewer: null,
        topics: [],
        went_well: null,
        to_improve: null,
        result: null,
      },
    ]);
  }

  function updateRound(index: number, field: string, value: unknown) {
    setRounds(
      rounds.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function removeRound(index: number) {
    setRounds(rounds.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {/* Status and Role */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Company["application_status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="researching">Researching</SelectItem>
                  <SelectItem value="ready_to_apply">Ready to Apply</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="referral_sent">Referral Sent</SelectItem>
                  <SelectItem value="oa_received">OA Received</SelectItem>
                  <SelectItem value="phone_screen">Phone Screen</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="ML Engineer"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Referrer Name</Label>
              <Input
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Referrer LinkedIn</Label>
              <Input
                value={referrerLinkedin}
                onChange={(e) => setReferrerLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Referral Status</Label>
              <Select value={referralStatus} onValueChange={(v) => v && setReferralStatus(v as typeof referralStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>AI Products / Notes</Label>
            <Textarea
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
              rows={3}
              placeholder="What AI products does this company work on?"
            />
          </div>
          <div className="space-y-2">
            <Label>Interview Tips</Label>
            <Textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={2}
              placeholder="Glassdoor tips, known interview format..."
            />
          </div>
          <div className="space-y-2">
            <Label>General Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compensation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Expected CTC Range</Label>
              <Input
                value={expectedCtc}
                onChange={(e) => setExpectedCtc(e.target.value)}
                placeholder="$150K-$200K"
              />
            </div>
            <div className="space-y-2">
              <Label>Offer CTC</Label>
              <Input
                value={offerCtc}
                onChange={(e) => setOfferCtc(e.target.value)}
                placeholder="$175K"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Rounds */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Interview Rounds</CardTitle>
            <Button variant="outline" size="sm" onClick={addRound}>
              <Plus className="h-4 w-4 mr-1" />
              Add Round
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rounds.map((round, i) => (
            <div
              key={i}
              className="border rounded-lg p-3 space-y-3 relative group"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => removeRound(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Round Name</Label>
                  <Input
                    value={round.round_name}
                    onChange={(e) =>
                      updateRound(i, "round_name", e.target.value)
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={round.date ?? ""}
                    onChange={(e) => updateRound(i, "date", e.target.value || null)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Result</Label>
                  <Select
                    value={round.result ?? "pending"}
                    onValueChange={(v) =>
                      updateRound(i, "result", v === "pending" ? null : v)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Went Well</Label>
                  <Input
                    value={round.went_well ?? ""}
                    onChange={(e) =>
                      updateRound(i, "went_well", e.target.value || null)
                    }
                    className="h-8"
                    placeholder="What went well?"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Improve</Label>
                  <Input
                    value={round.to_improve ?? ""}
                    onChange={(e) =>
                      updateRound(i, "to_improve", e.target.value || null)
                    }
                    className="h-8"
                    placeholder="What to improve?"
                  />
                </div>
              </div>
            </div>
          ))}
          {rounds.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No interview rounds logged yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
