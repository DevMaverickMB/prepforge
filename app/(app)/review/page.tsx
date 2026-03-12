import { getWeeklyReviews } from "@/lib/actions/review";
import { getPrepStartDate } from "@/lib/actions/planner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WEEK_PHASES } from "@/lib/constants/weekly-plan";
import {
  differenceInWeeks,
  parseISO,
} from "date-fns";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function ReviewPage() {
  const [reviews, prepStartDate] = await Promise.all([
    getWeeklyReviews(),
    getPrepStartDate(),
  ]);

  const start = prepStartDate ? parseISO(prepStartDate) : new Date();
  const currentWeek = Math.min(
    Math.max(differenceInWeeks(new Date(), start) + 1, 1),
    14
  );

  const reviewMap = new Map(reviews.map((r) => [r.week_number, r]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly Reviews</h1>
          <p className="text-muted-foreground">
            Reflect on your progress each week. Currently on Week {currentWeek}.
          </p>
        </div>
        <Link href={`/review/${currentWeek}`}>
          <Button>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Review Week {currentWeek}
          </Button>
        </Link>
      </div>

      {/* Weekly cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 14 }, (_, i) => {
          const weekNum = i + 1;
          const review = reviewMap.get(weekNum);
          const phase = WEEK_PHASES[weekNum] ?? "";
          const isCurrent = weekNum === currentWeek;
          const isPast = weekNum < currentWeek;
          const isFuture = weekNum > currentWeek;

          return (
            <Card
              key={weekNum}
              className={`relative ${
                isCurrent ? "ring-2 ring-primary" : ""
              } ${isFuture ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Week {weekNum}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isCurrent && <Badge>Current</Badge>}
                    {review ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : isPast ? (
                      <Circle className="h-4 w-4 text-red-400" />
                    ) : null}
                  </div>
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                  {phase}
                </Badge>
              </CardHeader>
              <CardContent>
                {review ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Hours:</span>{" "}
                        <span className="font-medium">
                          {review.total_hours_studied}h
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">LC:</span>{" "}
                        <span className="font-medium">
                          {review.lc_problems_solved_this_week}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Tasks</span>
                        <span>
                          {review.tasks_completed}/{review.tasks_planned}
                        </span>
                      </div>
                      <Progress
                        value={
                          review.tasks_planned > 0
                            ? (review.tasks_completed / review.tasks_planned) *
                              100
                            : 0
                        }
                        className="h-1.5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={review.on_track ? "default" : "destructive"}
                        className="text-[10px]"
                      >
                        {review.on_track ? "On Track" : "Off Track"}
                      </Badge>
                      <Link href={`/review/${weekNum}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    {isFuture ? (
                      <p className="text-xs text-muted-foreground">
                        Upcoming
                      </p>
                    ) : (
                      <Link href={`/review/${weekNum}`}>
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
