"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateCompany, addCompany } from "@/lib/actions/pipeline";
import { Plus, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Company } from "@/types/supabase";

const PIPELINE_COLUMNS = [
  { key: "researching", label: "Researching", color: "bg-slate-500/5 dark:bg-slate-500/5" },
  { key: "ready_to_apply", label: "Ready to Apply", color: "bg-blue-500/5 dark:bg-blue-500/5" },
  { key: "applied", label: "Applied", color: "bg-indigo-500/5 dark:bg-indigo-500/5" },
  { key: "referral_sent", label: "Referral Sent", color: "bg-violet-500/5 dark:bg-violet-500/5" },
  { key: "oa_received", label: "OA / Screen", color: "bg-amber-500/5 dark:bg-amber-500/5" },
  { key: "phone_screen", label: "Phone Screen", color: "bg-orange-500/5 dark:bg-orange-500/5" },
  { key: "onsite", label: "Onsite", color: "bg-emerald-500/5 dark:bg-emerald-500/5" },
  { key: "offer", label: "Offer", color: "bg-green-500/5 dark:bg-green-500/5" },
  { key: "rejected", label: "Rejected", color: "bg-red-500/5 dark:bg-red-500/5" },
] as const;

interface PipelineKanbanProps {
  initialCompanies: Company[];
}

export function PipelineKanban({ initialCompanies }: PipelineKanbanProps) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("tier_2");
  const [newRole, setNewRole] = useState("");

  const totalApplied = companies.filter(
    (c) =>
      !["researching", "ready_to_apply"].includes(c.application_status)
  ).length;

  const offers = companies.filter((c) => c.application_status === "offer").length;

  async function moveCompany(id: string, newStatus: string) {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, application_status: newStatus as Company["application_status"] }
          : c
      )
    );
    const result = await updateCompany(id, { application_status: newStatus });
    if (result.error) toast.error(result.error);
  }

  async function handleAddCompany() {
    if (!newName.trim()) return;
    const result = await addCompany({
      name: newName.trim(),
      tier: newTier,
      role_title: newRole || undefined,
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Company added");
      setNewName("");
      setNewRole("");
      setAddModalOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Interview Pipeline
          </h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{companies.length} tracked</span>
            <span>{totalApplied} applied</span>
            <span>{offers} offers</span>
          </div>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((col) => {
          const colCompanies = companies.filter(
            (c) => c.application_status === col.key
          );
          return (
            <div key={col.key} className="flex-shrink-0 w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium">{col.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {colCompanies.length}
                </Badge>
              </div>
              <ScrollArea className={`rounded-lg p-2 min-h-[200px] max-h-[60vh] ${col.color}`}>
                <div className="space-y-2">
                  {colCompanies.map((company) => (
                    <Link key={company.id} href={`/pipeline/${company.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {company.name}
                            </span>
                            {company.tier && (
                              <div className="flex">
                                {Array.from({
                                  length: company.tier === "tier_1" ? 3 : company.tier === "tier_2" ? 2 : 1,
                                }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {company.role_title && (
                            <p className="text-xs text-muted-foreground">
                              {company.role_title}
                            </p>
                          )}
                          {company.referrer_name && (
                            <p className="text-xs text-blue-600 mt-1">
                              Ref: {company.referrer_name}
                            </p>
                          )}
                          <div
                            className="flex gap-1 mt-2"
                            onClick={(e) => e.preventDefault()}
                          >
                            {col.key !== "rejected" &&
                              col.key !== "offer" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const colIndex = PIPELINE_COLUMNS.findIndex(
                                      (c) => c.key === col.key
                                    );
                                    if (colIndex < PIPELINE_COLUMNS.length - 2) {
                                      moveCompany(
                                        company.id,
                                        PIPELINE_COLUMNS[colIndex + 1].key
                                      );
                                    }
                                  }}
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      {/* Add Company Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Google"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tier</label>
              <Select value={newTier} onValueChange={(v) => v && setNewTier(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier_1">Tier 1 (Dream)</SelectItem>
                  <SelectItem value="tier_2">Tier 2 (Target)</SelectItem>
                  <SelectItem value="tier_3">Tier 3 (Safety)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="ML Engineer"
              />
            </div>
            <Button onClick={handleAddCompany} disabled={!newName.trim()} className="w-full">
              Add to Pipeline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
