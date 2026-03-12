"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  addProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from "@/lib/actions/projects";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { ProjectTask } from "@/types/supabase";

interface ProjectTaskKanbanProps {
  projectId: string;
  initialTasks: ProjectTask[];
}

const COLUMNS = [
  { key: "todo", label: "Todo", color: "bg-slate-100" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-100" },
  { key: "done", label: "Done", color: "bg-green-100" },
] as const;

export function ProjectTaskKanban({
  projectId,
  initialTasks,
}: ProjectTaskKanbanProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    const result = await addProjectTask(projectId, newTaskTitle.trim());
    if (result.error) {
      toast.error(result.error);
    } else {
      setNewTaskTitle("");
      // Optimistically add
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          project_id: projectId,
          user_id: "",
          title: newTaskTitle.trim(),
          description: null,
          status: "todo" as const,
          priority: "medium" as const,
          sort_order: prev.length,
          completed_at: null,
          created_at: new Date().toISOString(),
        },
      ]);
    }
    setIsAdding(false);
  }

  async function moveTask(taskId: string, newStatus: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as ProjectTask["status"] } : t
      )
    );
    const result = await updateProjectTask(taskId, { status: newStatus });
    if (result.error) toast.error(result.error);
  }

  async function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    const result = await deleteProjectTask(taskId);
    if (result.error) toast.error(result.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tasks</CardTitle>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="New task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="h-8"
          />
          <Button
            size="sm"
            onClick={handleAddTask}
            disabled={isAdding || !newTaskTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                <div
                  className={`rounded-lg p-2 min-h-[100px] ${col.color} space-y-2`}
                >
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-background rounded p-2 shadow-sm text-sm group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-start gap-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100" />
                          <span
                            className={
                              task.status === "done"
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {col.key !== "todo" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-5 text-xs px-1"
                            onClick={() =>
                              moveTask(
                                task.id,
                                col.key === "done" ? "in_progress" : "todo"
                              )
                            }
                          >
                            ←
                          </Button>
                        )}
                        {col.key !== "done" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-5 text-xs px-1"
                            onClick={() =>
                              moveTask(
                                task.id,
                                col.key === "todo" ? "in_progress" : "done"
                              )
                            }
                          >
                            →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
