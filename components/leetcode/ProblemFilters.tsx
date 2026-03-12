"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { DSA_PATTERNS, PATTERN_LABELS, LC_SOURCES, LC_SOURCE_LABELS } from "@/lib/constants/leetcode-patterns";
import { useCallback, useState, useTransition } from "react";

interface ProblemFiltersProps {
  companyTags: string[];
}

const STATUS_LABELS: Record<string, string> = {
  all: "All Status",
  todo: "Todo",
  attempted: "Attempted",
  solved: "Solved",
  review: "Review",
};

const REVISION_LABELS: Record<string, string> = {
  all: "All Revision",
  yes: "Needs Revision",
  no: "No Revision",
};

/** A minimal controlled select trigger that shows its label from URL state */
function FilterSelect({
  value,
  onValueChange,
  label,
  width,
  children,
}: {
  value: string;
  onValueChange: (v: string | null) => void;
  label: string;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`${width}`}>
        <span className="flex-1 text-left truncate">{label}</span>
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export function ProblemFilters({ companyTags }: ProblemFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/leetcode?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(() => {
    updateFilter("search", searchValue);
  }, [searchValue, updateFilter]);

  const clearFilters = useCallback(() => {
    setSearchValue("");
    startTransition(() => {
      router.push("/leetcode");
    });
  }, [router]);

  const hasFilters = searchParams.toString().length > 0;

  // Derive labels from URL params
  const statusVal = searchParams.get("status") ?? "all";
  const difficultyVal = searchParams.get("difficulty") ?? "all";
  const patternVal = searchParams.get("pattern") ?? "all";
  const sourceVal = searchParams.get("source") ?? "all";
  const companyVal = searchParams.get("company") ?? "all";
  const revisionVal = searchParams.get("needs_revision") ?? "all";
  const weekVal = searchParams.get("week") ?? "all";

  const statusLabel = STATUS_LABELS[statusVal] ?? statusVal;
  const difficultyLabel = difficultyVal === "all" ? "All Difficulty" : difficultyVal;
  const patternLabel = patternVal === "all" ? "All Patterns" : (PATTERN_LABELS[patternVal as keyof typeof PATTERN_LABELS] ?? patternVal);
  const sourceLabel = sourceVal === "all" ? "All Sources" : (LC_SOURCE_LABELS[sourceVal as keyof typeof LC_SOURCE_LABELS] ?? sourceVal);
  const companyLabel = companyVal === "all" ? "All Companies" : companyVal;
  const revisionLabel = REVISION_LABELS[revisionVal] ?? revisionVal;
  const weekLabel = weekVal === "all" ? "All Weeks" : `Week ${weekVal}`;

  return (
    <div className={`space-y-3 ${isPending ? "opacity-70" : ""}`}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or problem number..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleSearch}>
          Search
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          value={statusVal}
          onValueChange={(v) => updateFilter("status", v)}
          label={statusLabel}
          width="w-[130px]"
        >
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="attempted">Attempted</SelectItem>
          <SelectItem value="solved">Solved</SelectItem>
          <SelectItem value="review">Review</SelectItem>
        </FilterSelect>

        <FilterSelect
          value={difficultyVal}
          onValueChange={(v) => updateFilter("difficulty", v)}
          label={difficultyLabel}
          width="w-[130px]"
        >
          <SelectItem value="all">All Difficulty</SelectItem>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </FilterSelect>

        <FilterSelect
          value={patternVal}
          onValueChange={(v) => updateFilter("pattern", v)}
          label={patternLabel}
          width="w-[160px]"
        >
          <SelectItem value="all">All Patterns</SelectItem>
          {DSA_PATTERNS.map((p) => (
            <SelectItem key={p} value={p}>
              {PATTERN_LABELS[p]}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          value={sourceVal}
          onValueChange={(v) => updateFilter("source", v)}
          label={sourceLabel}
          width="w-[150px]"
        >
          <SelectItem value="all">All Sources</SelectItem>
          {LC_SOURCES.map((s) => (
            <SelectItem key={s} value={s}>
              {LC_SOURCE_LABELS[s]}
            </SelectItem>
          ))}
        </FilterSelect>

        {companyTags.length > 0 && (
          <FilterSelect
            value={companyVal}
            onValueChange={(v) => updateFilter("company", v)}
            label={companyLabel}
            width="w-[150px]"
          >
            <SelectItem value="all">All Companies</SelectItem>
            {companyTags.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </FilterSelect>
        )}

        <FilterSelect
          value={revisionVal}
          onValueChange={(v) => updateFilter("needs_revision", v)}
          label={revisionLabel}
          width="w-[150px]"
        >
          <SelectItem value="all">All Revision</SelectItem>
          <SelectItem value="yes">Needs Revision</SelectItem>
          <SelectItem value="no">No Revision</SelectItem>
        </FilterSelect>

        <FilterSelect
          value={weekVal}
          onValueChange={(v) => updateFilter("week", v)}
          label={weekLabel}
          width="w-[120px]"
        >
          <SelectItem value="all">All Weeks</SelectItem>
          {Array.from({ length: 14 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              Week {i + 1}
            </SelectItem>
          ))}
        </FilterSelect>
      </div>
    </div>
  );
}
