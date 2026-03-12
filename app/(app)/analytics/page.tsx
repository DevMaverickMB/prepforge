import { getAnalyticsData } from "@/lib/actions/analytics";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  if (!data) redirect("/login");

  return <AnalyticsClient data={data} />;
}
