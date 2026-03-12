import { getResources } from "@/lib/actions/resources";
import { ResourcesClient } from "@/components/resources/ResourcesClient";

export default async function ResourcesPage() {
  const resources = await getResources();

  return <ResourcesClient resources={resources} />;
}
