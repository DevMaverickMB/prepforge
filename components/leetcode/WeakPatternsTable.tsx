"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATTERN_LABELS } from "@/lib/constants/leetcode-patterns";
import { ConfidenceStars } from "./ConfidenceStars";

interface WeakPatternsTableProps {
  data: { pattern: string; total: number; avgConfidence: number }[];
}

export function WeakPatternsTable({ data }: WeakPatternsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weak Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Rate problems to see weak patterns
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern</TableHead>
                <TableHead className="text-center">Problems</TableHead>
                <TableHead>Avg Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.pattern}>
                  <TableCell>
                    {PATTERN_LABELS[row.pattern as keyof typeof PATTERN_LABELS] ?? row.pattern}
                  </TableCell>
                  <TableCell className="text-center">{row.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ConfidenceStars
                        value={Math.round(row.avgConfidence)}
                        size="sm"
                        readonly
                      />
                      {row.avgConfidence < 3 && (
                        <Badge variant="destructive" className="text-xs">
                          Weak
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
