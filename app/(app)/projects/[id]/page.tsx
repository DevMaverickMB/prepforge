import { getProject, getProjectTasks, updateProject } from "@/lib/actions/projects";
import { MilestoneChecklist } from "@/components/projects/MilestoneChecklist";
import { QualityChecklist } from "@/components/projects/QualityChecklist";
import { ProjectTaskKanban } from "@/components/projects/ProjectTaskKanban";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Github, ExternalLink, FileText, BookOpen } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, tasks] = await Promise.all([
    getProject(id),
    getProjectTasks(id),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
      </div>

      {/* Status + Progress */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary">{project.status.replace("_", " ")}</Badge>
        <div className="flex-1">
          <Progress value={project.progress_percent} />
        </div>
        <span className="text-sm text-muted-foreground">
          {project.progress_percent}%
        </span>
      </div>

      {/* Tech stack + Links */}
      <div className="flex flex-wrap gap-2">
        {project.tech_stack?.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </a>
        )}
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </Button>
          </a>
        )}
        {project.blog_post_url && (
          <a href={project.blog_post_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
          </a>
        )}
        {project.documentation_url && (
          <a href={project.documentation_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Docs
            </Button>
          </a>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MilestoneChecklist project={project} />
        <QualityChecklist project={project} />
      </div>

      {/* Impact metrics */}
      <ProjectDetailClient project={project} />

      {/* Kanban */}
      <ProjectTaskKanban projectId={project.id} initialTasks={tasks} />
    </div>
  );
}
