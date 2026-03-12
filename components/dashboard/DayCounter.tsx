import { differenceInDays } from "date-fns";

interface DayCounterProps {
  prepStartDate: string;
  totalDays: number;
}

export function DayCounter({ prepStartDate, totalDays }: DayCounterProps) {
  const dayNumber = Math.max(
    1,
    Math.min(totalDays, differenceInDays(new Date(), new Date(prepStartDate)) + 1)
  );
  const progress = Math.round((dayNumber / totalDays) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2 relative">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          Day {dayNumber}
        </span>
        <span className="text-[13px] font-medium text-muted-foreground">of {totalDays}</span>
      </div>
      <div className="h-1.5 w-64 bg-border/50 relative rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
