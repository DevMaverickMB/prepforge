import { getProblems, getDistinctCompanyTags } from "@/lib/actions/leetcode";
import { LeetCodeClient } from "@/components/leetcode/LeetCodeClient";

interface LeetCodePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function LeetCodePage({ searchParams }: LeetCodePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const [{ data: problems, count }, companyTags] = await Promise.all([
    getProblems({
      page,
      status: params.status,
      difficulty: params.difficulty,
      pattern: params.pattern,
      company: params.company,
      source: params.source,
      needs_revision: params.needs_revision,
      week: params.week,
      search: params.search,
      sort: params.sort,
      order: params.order,
    }),
    getDistinctCompanyTags(),
  ]);

  return (
    <LeetCodeClient
      problems={problems}
      totalCount={count}
      currentPage={page}
      companyTags={companyTags}
    />
  );
}
