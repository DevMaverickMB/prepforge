"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATTERN_LABELS } from "@/lib/constants/leetcode-patterns";

interface PatternRadarChartProps {
  data: { pattern: string; total: number; avgConfidence: number }[];
}

export function PatternRadarChart({ data }: PatternRadarChartProps) {
  const chartData = data.map((d) => ({
    pattern: PATTERN_LABELS[d.pattern as keyof typeof PATTERN_LABELS] ?? d.pattern,
    confidence: d.avgConfidence,
    fullMark: 5,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pattern Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No pattern data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="pattern" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar
                name="Confidence"
                dataKey="confidence"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
