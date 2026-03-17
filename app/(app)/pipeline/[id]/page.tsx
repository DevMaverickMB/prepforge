import { getCompany } from "@/lib/actions/pipeline";
import { CompanyDetailClient } from "@/components/pipeline/CompanyDetailClient";
import { notFound } from "next/navigation";

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  return <CompanyDetailClient company={company} />;
}
