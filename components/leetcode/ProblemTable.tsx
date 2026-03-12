"use client";

import { useState, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ConfidenceStars } from "./ConfidenceStars";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ChevronLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PATTERN_LABELS } from "@/lib/constants/leetcode-patterns";
import { quickUpdateField, deleteProblem } from "@/lib/actions/leetcode";
import type { LeetCodeProblem } from "@/types/supabase";
import { toast } from "sonner";

interface ProblemTableProps {
  problems: LeetCodeProblem[];
  totalCount: number;
  currentPage: number;
  onEdit: (problem: LeetCodeProblem) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  Medium: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  Hard: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  attempted: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  solved: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  review: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
};

const PER_PAGE = 25;

export function ProblemTable({
  problems,
  totalCount,
  currentPage,
  onEdit,
}: ProblemTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  function handleSort(col: string) {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");
    if (currentSort === col && currentOrder !== "desc") {
      params.set("order", "desc");
    } else {
      params.set("order", "asc");
      params.set("sort", col);
    }
    router.push(`/leetcode?${params.toString()}`);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/leetcode?${params.toString()}`);
  }

  async function handleStatusChange(id: string, status: string | null) {
    if (!status) return;
    const result = await quickUpdateField(id, "status", status);
    if (result.error) toast.error(String(result.error));
  }

  async function handleConfidenceChange(id: string, value: number) {
    const result = await quickUpdateField(id, "confidence_level", value);
    if (result.error) toast.error(String(result.error));
  }

  async function handleRevisionToggle(id: string, value: boolean) {
    const result = await quickUpdateField(id, "needs_revision", value);
    if (result.error) toast.error(String(result.error));
  }

  async function handleDelete(id: string) {
    const result = await deleteProblem(id);
    if (result.error) toast.error(String(result.error));
    else toast.success("Problem deleted");
  }

  const SortHeader = ({ col, children }: { col: string; children: React.ReactNode }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => handleSort(col)}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No problems found</p>
        <p className="text-sm mt-1">Add your first problem or adjust filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile card view */}
      <div className="md:hidden space-y-2">
        {problems.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-3 space-y-2"
            onClick={() => onEdit(p)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  #{p.problem_number}
                </span>
                <span className="font-medium text-sm truncate max-w-[200px]">
                  {p.title}
                </span>
              </div>
              <Badge
                variant="secondary"
                className={DIFFICULTY_COLORS[p.difficulty] + " text-[10px]"}
              >
                {p.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={STATUS_COLORS[p.status] + " text-[10px]"}>
                {p.status}
              </Badge>
              {p.primary_pattern && (
                <Badge variant="outline" className="text-[10px]">
                  {PATTERN_LABELS[p.primary_pattern as keyof typeof PATTERN_LABELS] ?? p.primary_pattern}
                </Badge>
              )}
              <ConfidenceStars value={p.confidence_level} size="sm" />
              {p.needs_revision && (
                <Badge variant="destructive" className="text-[10px]">
                  Revision
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <SortHeader col="problem_number">#</SortHeader>
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortHeader col="title">Title</SortHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortHeader col="difficulty">Difficulty</SortHeader>
              </TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">Pattern</TableHead>
              <TableHead className="w-[150px]">Companies</TableHead>
              <TableHead className="w-[110px]">
                <SortHeader col="confidence_level">Confidence</SortHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortHeader col="last_attempted_at">Last Attempted</SortHeader>
              </TableHead>
              <TableHead className="w-[80px]">Revision</TableHead>
              <TableHead className="w-[70px]">
                <SortHeader col="best_time_minutes">Time</SortHeader>
              </TableHead>
              <TableHead className="w-[40px]" />
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((p) => (
              <Fragment key={p.id}>
                <TableRow
                  className="group cursor-pointer"
                  onClick={() =>
                    setExpandedRow(expandedRow === p.id ? null : p.id)
                  }
                >
                  <TableCell className="font-mono text-sm">
                    {p.problem_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-0"
                      >
                        {expandedRow === p.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <a
                        href={p.leetcode_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline text-foreground flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {p.title}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={DIFFICULTY_COLORS[p.difficulty]}
                    >
                      {p.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={p.status}
                      onValueChange={(v) => handleStatusChange(p.id, v)}
                    >
                      <SelectTrigger className="h-7 text-xs w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">
                          <Badge variant="secondary" className={STATUS_COLORS.todo}>Todo</Badge>
                        </SelectItem>
                        <SelectItem value="attempted">
                          <Badge variant="secondary" className={STATUS_COLORS.attempted}>Attempted</Badge>
                        </SelectItem>
                        <SelectItem value="solved">
                          <Badge variant="secondary" className={STATUS_COLORS.solved}>Solved</Badge>
                        </SelectItem>
                        <SelectItem value="review">
                          <Badge variant="secondary" className={STATUS_COLORS.review}>Review</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {p.primary_pattern && (
                      <Badge variant="outline" className="text-xs">
                        {PATTERN_LABELS[p.primary_pattern as keyof typeof PATTERN_LABELS] ??
                          p.primary_pattern}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.company_tags?.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {(p.company_tags?.length ?? 0) > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(p.company_tags?.length ?? 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ConfidenceStars
                      value={p.confidence_level}
                      size="sm"
                      onChange={(v) => handleConfidenceChange(p.id, v)}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.last_attempted_at
                      ? formatDistanceToNow(new Date(p.last_attempted_at), {
                        addSuffix: true,
                      })
                      : "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={p.needs_revision}
                      onCheckedChange={(v) => handleRevisionToggle(p.id, v)}
                      className="scale-75"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.best_time_minutes ? `${p.best_time_minutes}m` : "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(p)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRow === p.id && (
                  <TableRow>
                    <TableCell colSpan={12} className="bg-muted/50 p-4">
                      <div className="grid gap-4 sm:grid-cols-3 text-sm">
                        {p.approach_notes && (
                          <div>
                            <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Approach
                            </p>
                            <p className="whitespace-pre-wrap">
                              {p.approach_notes}
                            </p>
                          </div>
                        )}
                        {p.key_insight && (
                          <div>
                            <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Key Insight
                            </p>
                            <p className="whitespace-pre-wrap">
                              {p.key_insight}
                            </p>
                          </div>
                        )}
                        {p.mistakes_made && (
                          <div>
                            <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Mistakes
                            </p>
                            <p className="whitespace-pre-wrap">
                              {p.mistakes_made}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-4 flex-wrap">
                          {p.best_time_complexity && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Time:{" "}
                              </span>
                              <code className="text-xs">
                                {p.best_time_complexity}
                              </code>
                            </div>
                          )}
                          {p.best_space_complexity && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Space:{" "}
                              </span>
                              <code className="text-xs">
                                {p.best_space_complexity}
                              </code>
                            </div>
                          )}
                          {p.similar_problems &&
                            p.similar_problems.length > 0 && (
                              <div>
                                <span className="text-xs text-muted-foreground">
                                  Similar:{" "}
                                </span>
                                {p.similar_problems.map((num) => (
                                  <Badge
                                    key={num}
                                    variant="outline"
                                    className="text-xs mr-1"
                                  >
                                    #{num}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PER_PAGE + 1}–
            {Math.min(currentPage * PER_PAGE, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
