import { getLeetCodeAnalytics } from "@/lib/actions/leetcode-analytics";
import { PatternRadarChart } from "@/components/leetcode/PatternRadarChart";
import { DifficultyDonut } from "@/components/leetcode/DifficultyDonut";
import { CompanyCoverageBar } from "@/components/leetcode/CompanyCoverageBar";
import { DailySolveLine } from "@/components/leetcode/DailySolveLine";
import { WeakPatternsTable } from "@/components/leetcode/WeakPatternsTable";
import { Card, CardContent } from "@/components/ui/card";

export default async function LeetCodeAnalyticsPage() {
  const analytics = await getLeetCodeAnalytics();

  if (!analytics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Unable to load analytics</p>
      </div>
    );
  }

  const { patternData, difficultyData, companyData, dailySolveData, weakPatterns, summary } =
    analytics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">LeetCode Analytics</h1>
        <p className="text-muted-foreground">Your DSA prep at a glance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{summary.total}</p>
            <p className="text-xs text-muted-foreground">Total Problems</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.solved}</p>
            <p className="text-xs text-muted-foreground">Solved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{summary.totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.needsRevision}</p>
            <p className="text-xs text-muted-foreground">Needs Revision</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{summary.avgConfidence}/5</p>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PatternRadarChart data={patternData} />
        <DifficultyDonut data={difficultyData} />
      </div>

      <DailySolveLine data={dailySolveData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CompanyCoverageBar data={companyData} />
        <WeakPatternsTable data={weakPatterns} />
      </div>
    </div>
  );
}
