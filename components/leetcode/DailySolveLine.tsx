"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySolveLineProps {
  data: { date: string; count: number }[];
}

export function DailySolveLine({ data }: DailySolveLineProps) {
  // Compute cumulative
  let cumulative = 0;
  const chartData = data.map((d) => {
    cumulative += d.count;
    return { date: d.date, daily: d.count, cumulative };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Solve Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No solve data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                name="Cumulative"
              />
              <Area
                type="monotone"
                dataKey="daily"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
                name="Daily"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
