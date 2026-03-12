"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyProgressRingProps {
  progress: number;
}

export function WeeklyProgressRing({ progress }: WeeklyProgressRingProps) {
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="border border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-[15px] font-semibold text-foreground tracking-tight">Weekly Target</CardTitle>
        <div className="flex gap-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
          <div className="h-1 w-1 rounded-full bg-current" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-8 pb-8">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 96 96">
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-muted"
            />
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              className="text-primary transition-all duration-700 ease-out"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-foreground">{progress}<span className="text-lg text-muted-foreground/60">%</span></span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40">
          <div className="h-2 w-2 rounded-full bg-primary" />
          Protocol Completion
        </div>
      </CardContent>
    </Card>
  );
}
