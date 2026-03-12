import { getBehavioralStories } from "@/lib/actions/behavioral";
import { BehavioralClient } from "@/components/behavioral/BehavioralClient";

export default async function BehavioralPage() {
  const stories = await getBehavioralStories();

  return <BehavioralClient stories={stories} />;
}
