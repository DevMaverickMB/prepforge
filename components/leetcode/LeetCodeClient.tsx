"use client";

import { useState } from "react";
import { ProblemTable } from "./ProblemTable";
import { ProblemFilters } from "./ProblemFilters";
import { AddProblemModal } from "./AddProblemModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { LeetCodeProblem } from "@/types/supabase";

interface LeetCodeClientProps {
  problems: LeetCodeProblem[];
  totalCount: number;
  currentPage: number;
  companyTags: string[];
}

export function LeetCodeClient({
  problems,
  totalCount,
  currentPage,
  companyTags,
}: LeetCodeClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProblem, setEditProblem] = useState<LeetCodeProblem | null>(null);

  function handleEdit(problem: LeetCodeProblem) {
    setEditProblem(problem);
    setModalOpen(true);
  }

  function handleModalClose(open: boolean) {
    setModalOpen(open);
    if (!open) setEditProblem(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            LeetCode Tracker
          </h1>
          <p className="text-muted-foreground">
            {totalCount} problem{totalCount !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Problem
        </Button>
      </div>

      <ProblemFilters companyTags={companyTags} />

      <ProblemTable
        problems={problems}
        totalCount={totalCount}
        currentPage={currentPage}
        onEdit={handleEdit}
      />

      <AddProblemModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        editProblem={editProblem}
      />
    </div>
  );
}
