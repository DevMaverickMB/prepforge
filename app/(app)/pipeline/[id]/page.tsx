import { getCompany } from "@/lib/actions/pipeline";
import { CompanyDetailClient } from "@/components/pipeline/CompanyDetailClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  const tierStars = company.tier === "tier_1" ? 3 : company.tier === "tier_2" ? 2 : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pipeline">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {company.name}
            </h1>
            <div className="flex">
              {Array.from({ length: tierStars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
          {company.role_title && (
            <p className="text-muted-foreground">{company.role_title}</p>
          )}
        </div>
        <div className="flex gap-2">
          {company.careers_page_url && (
            <a
              href={company.careers_page_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Careers
              </Button>
            </a>
          )}
          {company.engineering_blog_url && (
            <a
              href={company.engineering_blog_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Blog
              </Button>
            </a>
          )}
        </div>
      </div>

      <CompanyDetailClient company={company} />
    </div>
  );
}
