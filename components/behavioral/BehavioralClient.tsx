"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addBehavioralStory,
  updateBehavioralStory,
  deleteBehavioralStory,
  practiceStory,
} from "@/lib/actions/behavioral";
import { toast } from "sonner";
import {
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Play,
  Star,
  Search,
  Filter,
} from "lucide-react";
import type { BehavioralStory } from "@/types/supabase";

const CATEGORIES = [
  "Leadership",
  "Teamwork",
  "Conflict Resolution",
  "Problem Solving",
  "Failure & Learning",
  "Innovation",
  "Customer Focus",
  "Communication",
];

const AMAZON_LPS = [
  "Customer Obsession",
  "Ownership",
  "Invent and Simplify",
  "Are Right, A Lot",
  "Learn and Be Curious",
  "Hire and Develop the Best",
  "Insist on the Highest Standards",
  "Think Big",
  "Bias for Action",
  "Frugality",
  "Earn Trust",
  "Dive Deep",
  "Have Backbone; Disagree and Commit",
  "Deliver Results",
];

interface BehavioralClientProps {
  stories: BehavioralStory[];
}

export function BehavioralClient({ stories }: BehavioralClientProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [practiceMode, setPracticeMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [selectedLPs, setSelectedLPs] = useState<string[]>([]);

  function resetForm() {
    setTitle("");
    setCategory("");
    setSituation("");
    setTask("");
    setAction("");
    setResult("");
    setSelectedLPs([]);
  }

  function loadStoryIntoForm(story: BehavioralStory) {
    setTitle(story.title);
    setCategory(story.category ?? "");
    setSituation(story.situation ?? "");
    setTask(story.task ?? "");
    setAction(story.action ?? "");
    setResult(story.result ?? "");
    setSelectedLPs(story.amazon_lp ?? []);
    setEditingId(story.id);
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const data = {
      title: title.trim(),
      category: category || null,
      situation: situation || null,
      task: task || null,
      action: action || null,
      result: result || null,
      amazon_lp: selectedLPs,
      applicable_companies: [],
    };

    if (editingId) {
      await updateBehavioralStory(editingId, data);
      toast.success("Story updated!");
      setEditingId(null);
    } else {
      await addBehavioralStory(data);
      toast.success("Story added!");
    }

    resetForm();
    setAddOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteBehavioralStory(id);
    toast.success("Story deleted");
  }

  async function handlePractice(id: string) {
    await practiceStory(id);
    toast.success("Practiced! Count updated.");
  }

  function toggleLP(lp: string) {
    setSelectedLPs((prev) =>
      prev.includes(lp) ? prev.filter((l) => l !== lp) : [...prev, lp]
    );
  }

  // Filtering
  const filtered = stories.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== "all" && s.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Behavioral Stories
          </h1>
          <p className="text-muted-foreground">
            {stories.length} stories · STAR format · Practice mode available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={practiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPracticeMode(!practiceMode)}
          >
            {practiceMode ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {practiceMode ? "Exit Practice" : "Practice Mode"}
          </Button>
          <Dialog open={addOpen} onOpenChange={(open) => {
            if (open) {
              resetForm();
              setEditingId(null);
            }
            setAddOpen(open);
          }}>
            <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 text-sm font-medium">
              <Plus className="h-4 w-4 mr-1" />
              Add Story
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Story" : "New Behavioral Story"}
                </DialogTitle>
              </DialogHeader>
              <StoryForm
                title={title}
                setTitle={setTitle}
                category={category}
                setCategory={setCategory}
                situation={situation}
                setSituation={setSituation}
                task={task}
                setTask={setTask}
                action={action}
                setAction={setAction}
                result={result}
                setResult={setResult}
                selectedLPs={selectedLPs}
                toggleLP={toggleLP}
                onSave={handleSave}
                editingId={editingId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stories grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No stories yet</p>
          <p className="text-sm">
            Add your first behavioral story to start preparing.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              practiceMode={practiceMode}
              onEdit={() => {
                loadStoryIntoForm(story);
                setAddOpen(true);
              }}
              onDelete={() => handleDelete(story.id)}
              onPractice={() => handlePractice(story.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Story Card ---
function StoryCard({
  story,
  practiceMode,
  onEdit,
  onDelete,
  onPractice,
}: {
  story: BehavioralStory;
  practiceMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPractice: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const showContent = !practiceMode || revealed;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {practiceMode && !revealed
                ? "🤔 Can you recall this story?"
                : story.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {story.category && (
                <Badge variant="outline" className="text-xs">
                  {story.category}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Play className="h-3 w-3" />
                {story.practiced_count}x practiced
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {practiceMode ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRevealed(!revealed)}
                >
                  {revealed ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={onPractice}>
                  <Star className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      {showContent && (
        <CardContent className="space-y-2 text-sm">
          {story.situation && (
            <div>
              <span className="font-semibold text-blue-600">S:</span>{" "}
              {story.situation}
            </div>
          )}
          {story.task && (
            <div>
              <span className="font-semibold text-green-600">T:</span>{" "}
              {story.task}
            </div>
          )}
          {story.action && (
            <div>
              <span className="font-semibold text-yellow-600">A:</span>{" "}
              {story.action}
            </div>
          )}
          {story.result && (
            <div>
              <span className="font-semibold text-purple-600">R:</span>{" "}
              {story.result}
            </div>
          )}
          {story.amazon_lp && story.amazon_lp.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {story.amazon_lp.map((lp) => (
                <Badge key={lp} variant="secondary" className="text-[10px]">
                  {lp}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// --- Story Form ---
function StoryForm({
  title,
  setTitle,
  category,
  setCategory,
  situation,
  setSituation,
  task,
  setTask,
  action,
  setAction,
  result,
  setResult,
  selectedLPs,
  toggleLP,
  onSave,
  editingId,
}: {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  situation: string;
  setSituation: (v: string) => void;
  task: string;
  setTask: (v: string) => void;
  action: string;
  setAction: (v: string) => void;
  result: string;
  setResult: (v: string) => void;
  selectedLPs: string[];
  toggleLP: (lp: string) => void;
  onSave: () => void;
  editingId: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Title *</Label>
          <Input
            placeholder="E.g., Led ML model migration at scale"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-blue-600">Situation</Label>
          <Textarea
            placeholder="Set the scene. What was the context?"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <Label className="text-green-600">Task</Label>
          <Textarea
            placeholder="What was your responsibility?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <Label className="text-yellow-600">Action</Label>
          <Textarea
            placeholder="What did you do? Be specific."
            value={action}
            onChange={(e) => setAction(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label className="text-purple-600">Result</Label>
          <Textarea
            placeholder="What was the outcome? Use metrics."
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div>
        <Label>Amazon Leadership Principles</Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {AMAZON_LPS.map((lp) => (
            <Badge
              key={lp}
              variant={selectedLPs.includes(lp) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleLP(lp)}
            >
              {lp}
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={onSave} className="w-full">
        {editingId ? "Update Story" : "Add Story"}
      </Button>
    </div>
  );
}
