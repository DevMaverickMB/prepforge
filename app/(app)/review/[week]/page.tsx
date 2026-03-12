import {
  getWeeklyReview,
  getWeekStats,
} from "@/lib/actions/review";
import { WeeklyReviewForm } from "@/components/review/WeeklyReviewForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ReviewWeekPageProps {
  params: Promise<{ week: string }>;
}

export default async function ReviewWeekPage({ params }: ReviewWeekPageProps) {
  const { week } = await params;
  const weekNumber = parseInt(week, 10);

  if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 14) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Invalid week number. Must be between 1 and 14.</p>
        <Link href="/review" className="mt-4 inline-block">
          <Button variant="outline">Back to Reviews</Button>
        </Link>
      </div>
    );
  }

  const [existing, stats] = await Promise.all([
    getWeeklyReview(weekNumber),
    getWeekStats(weekNumber),
  ]);

  return (
    <div className="space-y-6">
      <Link href="/review">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Reviews
        </Button>
      </Link>

      <WeeklyReviewForm
        weekNumber={weekNumber}
        existing={existing}
        stats={stats}
      />
    </div>
  );
}
