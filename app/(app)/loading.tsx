import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-1.5 w-52" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 flex justify-center">
              <Skeleton className="h-28 w-28 rounded-full" />
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
