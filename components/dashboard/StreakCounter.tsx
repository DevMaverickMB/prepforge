import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  if (streak === 0) {
    return (
      <div className="flex items-center gap-2 border border-border/50 bg-card px-4 py-2 rounded-xl shadow-sm">
        <Flame className="h-4 w-4 text-muted-foreground" />
        <span className="text-[13px] font-medium text-muted-foreground">No active streak</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl shadow-sm">
      <Flame className="h-4 w-4 text-primary" strokeWidth={2.5} />
      <span className="text-[14px] font-semibold text-primary">
        {streak} day streak
      </span>
    </div>
  );
}
