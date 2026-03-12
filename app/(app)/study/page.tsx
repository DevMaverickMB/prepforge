import { getStudyTopics, getStudyStats } from "@/lib/actions/study";
import { STUDY_CATEGORIES } from "@/lib/constants/study-topics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function StudyPage() {
  const [topics, stats] = await Promise.all([getStudyTopics(), getStudyStats()]);

  const totalCompleted = topics.filter((t) => t.status === "completed").length;
  const totalTopics = topics.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Study Tracker</h1>
        <p className="text-muted-foreground">
          {totalCompleted} of {totalTopics} topics completed
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-sm text-muted-foreground">
              {totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0}%
            </p>
          </div>
          <Progress
            value={totalTopics > 0 ? (totalCompleted / totalTopics) * 100 : 0}
          />
        </CardContent>
      </Card>

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(STUDY_CATEGORIES).map(([key, cat]) => {
          const catStats = stats?.[key];
          const completed = catStats?.completed ?? 0;
          const total = catStats?.total ?? 0;
          const inProgress = catStats?.inProgress ?? 0;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Link key={key} href={`/study/${key}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {cat.label}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {completed}/{total}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={percent} className="mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percent}% complete</span>
                    {inProgress > 0 && <span>{inProgress} in progress</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
