"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { Label } from "@/components/ui/label";
import {
  addResource,
  updateResource,
  deleteResource,
} from "@/lib/actions/resources";
import { toast } from "sonner";
import {
  Plus,
  ExternalLink,
  Star,
  StarOff,
  Trash2,
  Search,
  CheckCircle2,
  Circle,
  BookOpen,
  Filter,
} from "lucide-react";
import type { Database } from "@/types/supabase";

type Resource = Database["public"]["Tables"]["resources"]["Row"];

const CATEGORIES = ["course", "paper", "tool", "book", "video", "blog"];
const TOPICS = ["dsa", "ml", "dl", "llm", "system_design", "behavioral", "other"];

const TOPIC_LABELS: Record<string, string> = {
  dsa: "DSA",
  ml: "ML",
  dl: "Deep Learning",
  llm: "LLM / GenAI",
  system_design: "System Design",
  behavioral: "Behavioral",
  other: "Other",
};

interface ResourcesClientProps {
  resources: Resource[];
}

export function ResourcesClient({ resources }: ResourcesClientProps) {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  // Add form
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const filtered = resources.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (topicFilter && r.topic !== topicFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    return true;
  });

  const completed = resources.filter((r) => r.is_completed).length;

  async function handleAdd() {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error("Title and URL are required");
      return;
    }
    await addResource({
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory || null,
      topic: newTopic || null,
    });
    toast.success("Resource added!");
    setNewTitle("");
    setNewUrl("");
    setNewCategory("");
    setNewTopic("");
    setAddOpen(false);
  }

  async function toggleFavorite(r: Resource) {
    await updateResource(r.id, { is_favorite: !r.is_favorite });
  }

  async function toggleCompleted(r: Resource) {
    await updateResource(r.id, {
      is_completed: !r.is_completed,
      progress_percent: !r.is_completed ? 100 : r.progress_percent,
    });
  }

  async function updateProgress(id: string, percent: number) {
    await updateResource(id, {
      progress_percent: percent,
      is_completed: percent >= 100,
    });
  }

  async function handleDelete(id: string) {
    await deleteResource(id);
    toast.success("Resource deleted");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            {completed}/{resources.length} completed
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4 mr-1" />
            Add Resource
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  placeholder="Resource title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <Label>URL *</Label>
                <Input
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newCategory} onValueChange={(v) => v && setNewCategory(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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
                <div>
                  <Label>Topic</Label>
                  <Select value={newTopic} onValueChange={(v) => v && setNewTopic(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {TOPIC_LABELS[t] ?? t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={topicFilter} onValueChange={(v) => setTopicFilter(v === "__all__" ? "" : v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Topics</SelectItem>
            {TOPICS.map((t) => (
              <SelectItem key={t} value={t}>
                {TOPIC_LABELS[t] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v === "__all__" ? "" : v)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Types</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources list */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <button onClick={() => toggleCompleted(r)}>
                {r.is_completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium text-sm truncate ${
                      r.is_completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {r.title}
                  </span>
                  {r.category && (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {r.category}
                    </Badge>
                  )}
                  {r.topic && (
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {TOPIC_LABELS[r.topic] ?? r.topic}
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5">
                  <Progress value={r.progress_percent} className="h-1.5" />
                </div>
              </div>

              {/* Progress input */}
              <Input
                type="number"
                min={0}
                max={100}
                value={r.progress_percent}
                onChange={(e) =>
                  updateProgress(r.id, parseInt(e.target.value) || 0)
                }
                className="w-16 text-xs text-center"
              />
              <span className="text-xs text-muted-foreground">%</span>

              {/* Actions */}
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleFavorite(r)}
              >
                {r.is_favorite ? (
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={() => handleDelete(r.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources found</p>
          </div>
        )}
      </div>
    </div>
  );
}
