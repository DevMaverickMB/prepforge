import { getProjects } from "@/lib/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  mvp_done: "MVP Done",
  deployed: "Deployed",
  polished: "Polished",
};

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  mvp_done: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  deployed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  polished: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          {projects.filter((p) => p.status === "deployed" || p.status === "polished").length} of{" "}
          {projects.length} deployed
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={STATUS_COLORS[project.status]}
                  >
                    {STATUS_LABELS[project.status]}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{project.progress_percent}%</span>
                  </div>
                  <Progress value={project.progress_percent} />
                </div>

                {/* Tech stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>

                {/* Quality checklist mini */}
                <div className="flex gap-1">
                  {[
                    { key: "has_readme", label: "README" },
                    { key: "has_tests", label: "Tests" },
                    { key: "has_cicd", label: "CI/CD" },
                    { key: "is_deployed", label: "Live" },
                  ].map(({ key, label }) => (
                    <Badge
                      key={key}
                      variant={
                        (project as Record<string, unknown>)[key]
                          ? "default"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No projects yet</p>
          <p className="text-sm mt-1">Seed your data from the dashboard</p>
        </div>
      )}
    </div>
  );
}
