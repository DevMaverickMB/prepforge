"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { updateCompany, addCompany } from "@/lib/actions/pipeline";
import { Plus, Star, ArrowRight, ArrowLeft, Building2, Layers, Trophy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Company } from "@/types/supabase";

const PIPELINE_COLUMNS = [
  { key: "researching",    label: "Researching",    dot: "bg-slate-400",    cardAccent: "border-l-slate-400/70",    badge: "bg-slate-400/10 text-slate-400 border-slate-400/20",     colBg: "bg-slate-500/[0.05]",   glow: "bg-slate-400/25" },
  { key: "ready_to_apply", label: "Ready to Apply", dot: "bg-sky-400",      cardAccent: "border-l-sky-400/70",      badge: "bg-sky-400/10 text-sky-400 border-sky-400/20",           colBg: "bg-sky-500/[0.06]",     glow: "bg-sky-400/25" },
  { key: "applied",        label: "Applied",        dot: "bg-teal-400",     cardAccent: "border-l-teal-400/70",     badge: "bg-teal-400/10 text-teal-400 border-teal-400/20",        colBg: "bg-teal-500/[0.06]",    glow: "bg-teal-400/25" },
  { key: "referral_sent",  label: "Referral Sent",  dot: "bg-fuchsia-400",  cardAccent: "border-l-fuchsia-400/70",  badge: "bg-fuchsia-400/10 text-fuchsia-400 border-fuchsia-400/20", colBg: "bg-fuchsia-500/[0.06]", glow: "bg-fuchsia-400/25" },
  { key: "oa_received",    label: "OA / Screen",    dot: "bg-amber-400",    cardAccent: "border-l-amber-400/70",    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",     colBg: "bg-amber-500/[0.06]",   glow: "bg-amber-400/25" },
  { key: "phone_screen",   label: "Phone Screen",   dot: "bg-orange-400",   cardAccent: "border-l-orange-400/70",   badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",  colBg: "bg-orange-500/[0.06]",  glow: "bg-orange-400/25" },
  { key: "onsite",         label: "Onsite",         dot: "bg-violet-400",   cardAccent: "border-l-violet-400/70",   badge: "bg-violet-400/10 text-violet-400 border-violet-400/20",  colBg: "bg-violet-500/[0.06]",  glow: "bg-violet-400/25" },
  { key: "offer",          label: "Offer",          dot: "bg-green-400",    cardAccent: "border-l-green-400/70",    badge: "bg-green-400/10 text-green-400 border-green-400/20",     colBg: "bg-green-500/[0.07]",   glow: "bg-green-400/25" },
  { key: "rejected",       label: "Rejected",       dot: "bg-red-400",      cardAccent: "border-l-red-400/70",      badge: "bg-red-400/10 text-red-400 border-red-400/20",           colBg: "bg-red-500/[0.06]",     glow: "bg-red-400/25" },
] as const;

function TierStars({ tier }: { tier: string | null }) {
  if (!tier) return null;
  const filled = tier === "tier_1" ? 3 : tier === "tier_2" ? 2 : 1;
  return (
    <div className="flex gap-0.5 flex-shrink-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < filled ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-border/50"
          }`}
        />
      ))}
    </div>
  );
}

interface PipelineKanbanProps {
  initialCompanies: Company[];
}

export function PipelineKanban({ initialCompanies }: PipelineKanbanProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("tier_2");
  const [newRole, setNewRole] = useState("");

  const totalApplied = companies.filter(
    (c) => !["researching", "ready_to_apply"].includes(c.application_status)
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
      toast.success("Company added to pipeline");
      setNewName("");
      setNewRole("");
      setAddModalOpen(false);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4" style={{ height: "calc(100svh - 80px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">
            Interview Pipeline
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-1 rounded-full">
              <Layers className="h-3 w-3" />
              {companies.length} tracked
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-1 rounded-full">
              <Building2 className="h-3 w-3" />
              {totalApplied} applied
            </div>
            {offers > 0 ? (
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <Trophy className="h-3 w-3" />
                {offers} {offers === 1 ? "offer" : "offers"}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/50 bg-muted/20 border border-border/30 px-2.5 py-1 rounded-full">
                <Trophy className="h-3 w-3" />
                0 offers
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="gap-1.5 rounded-xl h-9 px-4 text-[13px] font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Company
        </Button>
      </div>

      {/* Kanban board */}
      <div className="flex-1 min-h-0 overflow-x-auto [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
        <div className="flex gap-3 h-full pb-2" style={{ minWidth: "max-content" }}>
          {PIPELINE_COLUMNS.map((col) => {
            const colCompanies = companies.filter(
              (c) => c.application_status === col.key
            );
            const colIndex = PIPELINE_COLUMNS.findIndex((c) => c.key === col.key);
            const prevCol = colIndex > 0 ? PIPELINE_COLUMNS[colIndex - 1] : null;
            const nextCol =
              col.key === "rejected"
                ? null
                : col.key === "offer"
                  ? PIPELINE_COLUMNS.find((c) => c.key === "rejected")!
                  : colIndex < PIPELINE_COLUMNS.length - 1
                    ? PIPELINE_COLUMNS[colIndex + 1]
                    : null;

            return (
              <div key={col.key} className="flex flex-col w-[230px] flex-shrink-0 h-full">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-2.5 px-0.5 flex-shrink-0">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${col.dot}`} />
                  <span className="text-[13px] font-semibold text-foreground truncate flex-1">
                    {col.label}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${col.badge}`}
                  >
                    {colCompanies.length}
                  </span>
                </div>

                {/* Column body */}
                <div
                  className={`flex-1 min-h-0 rounded-2xl border border-border/30 ${col.colBg} p-2.5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/40 hover:[&::-webkit-scrollbar-thumb]:bg-border`}
                >
                  <div className="flex flex-col gap-3">
                    {colCompanies.length === 0 && (
                      <div className="flex items-center justify-center h-16 text-[12px] text-muted-foreground/30 font-medium select-none">
                        Empty
                      </div>
                    )}
                    {colCompanies.map((company) => (
                      <Link key={company.id} href={`/pipeline/${company.id}`}>
                        <div
                          className={`group relative overflow-hidden rounded-xl border border-border/40 bg-card/70 hover:bg-card hover:border-border/70 transition-all duration-150 px-4 py-5 border-l-[3px] ${col.cardAccent} cursor-pointer`}
                        >
                          {/* Hover glow sphere */}
                          <div
                            className={`pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${col.glow}`}
                          />
                          {/* Company name — full width */}
                          <p className="text-[14px] font-semibold text-foreground leading-snug mb-2.5">
                            {company.name}
                          </p>

                          {/* Stars row */}
                          <TierStars tier={company.tier} />

                          {/* Role */}
                          {company.role_title && (
                            <p className="text-[12px] text-muted-foreground/50 truncate mt-1.5">
                              {company.role_title}
                            </p>
                          )}

                          {/* Referrer */}
                          {company.referrer_name && (
                            <p className="text-[11px] text-blue-400 font-medium mt-1.5">
                              ↗ {company.referrer_name}
                            </p>
                          )}

                          {/* Move buttons — bottom row, hover only */}
                          {(prevCol || nextCol) && (
                            <div
                              className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                              {prevCol && (
                                <div
                                  className="h-6 w-6 rounded-lg bg-background border border-border/60 flex items-center justify-center hover:bg-muted-foreground/20 hover:border-muted-foreground/40 transition-colors cursor-pointer"
                                  onClick={() => moveCompany(company.id, prevCol.key)}
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </div>
                              )}
                              {nextCol && (
                                <div
                                  className="h-6 w-6 rounded-lg bg-background border border-border/60 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                  onClick={() => moveCompany(company.id, nextCol.key)}
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Company Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="rounded-2xl overflow-visible sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[18px] font-bold">Add Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-1">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-muted-foreground">Company Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Google"
                className="rounded-xl h-10"
                onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-muted-foreground">Tier</label>
              <Select value={newTier} onValueChange={(v) => v && setNewTier(v)}>
                <SelectTrigger className="rounded-xl h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl" sideOffset={4}>
                  <SelectItem value="tier_1">⭐⭐⭐ Tier 1 — Dream</SelectItem>
                  <SelectItem value="tier_2">⭐⭐ Tier 2 — Target</SelectItem>
                  <SelectItem value="tier_3">⭐ Tier 3 — Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-muted-foreground">
                Role <span className="text-muted-foreground/40">(optional)</span>
              </label>
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="ML Engineer"
                className="rounded-xl h-10"
                onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
              />
            </div>
            <Button
              onClick={handleAddCompany}
              disabled={!newName.trim()}
              className="w-full rounded-xl h-10 font-semibold mt-2"
            >
              Add to Pipeline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

