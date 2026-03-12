import { getCompanies } from "@/lib/actions/pipeline";
import { PipelineKanban } from "@/components/pipeline/PipelineKanban";

export default async function PipelinePage() {
  const companies = await getCompanies();
  return <PipelineKanban initialCompanies={companies} />;
}
