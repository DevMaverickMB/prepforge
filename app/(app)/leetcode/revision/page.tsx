import { createClient } from "@/lib/supabase/server";
import { RevisionClient } from "@/components/leetcode/RevisionClient";

export default async function RevisionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get revision candidates:
  // needs_revision = true OR confidence_level < 3 OR not attempted in 14+ days
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: problems } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", user.id)
    .or(
      `needs_revision.eq.true,confidence_level.lt.3,last_attempted_at.lt.${fourteenDaysAgo.toISOString()}`
    )
    .order("next_review_date", { ascending: true, nullsFirst: false })
    .order("confidence_level", { ascending: true });

  return <RevisionClient problems={problems ?? []} />;
}
