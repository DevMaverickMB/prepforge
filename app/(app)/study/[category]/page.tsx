import { getStudyTopics } from "@/lib/actions/study";
import { STUDY_CATEGORIES } from "@/lib/constants/study-topics";
import { TopicCard } from "@/components/study/TopicCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StudyCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function StudyCategoryPage({ params }: StudyCategoryPageProps) {
  const { category } = await params;

  const catInfo = STUDY_CATEGORIES[category as keyof typeof STUDY_CATEGORIES];
  if (!catInfo) notFound();

  const topics = await getStudyTopics(category);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/study">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{catInfo.label}</h1>
          <p className="text-muted-foreground">
            {topics.filter((t) => t.status === "completed").length} of{" "}
            {topics.length} topics completed
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No topics in this category yet</p>
          <p className="text-sm mt-1">Seed your data from the dashboard</p>
        </div>
      )}
    </div>
  );
}
