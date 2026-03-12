"use client";

import { seedUserData } from "@/lib/actions/seed";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface SeedTriggerProps {
  userId: string;
}

export function SeedTrigger({ userId }: SeedTriggerProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSeed() {
    setLoading(true);
    const prepStartDate = format(new Date(), "yyyy-MM-dd");
    await seedUserData(userId, prepStartDate);
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="relative text-center max-w-md mx-4">
        {/* Decorative glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Flame className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to PrepForge</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Ready to start your 14-week AI interview prep journey?
            This will set up your 98-day plan, study topics, projects, and target companies.
          </p>
          <Button onClick={handleSeed} disabled={loading} size="lg" className="h-11 px-6 text-sm font-medium">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Start My Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
