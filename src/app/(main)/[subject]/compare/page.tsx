import { notFound } from "next/navigation";
import { getSubject } from "@/lib/subjects";
import { loadJsonContent } from "@/lib/content";
import { SUBJECTS, CONTENT_SUBJECTS } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ComparisonTable from "@/components/content/ComparisonTable";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { ComparisonRow } from "@/lib/types";

interface ComparePageProps {
  params: { subject: string };
}

export async function generateStaticParams() {
  return CONTENT_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  if (!subject) return {};
  return buildMetadata({
    title: `${subject.title} — 易混知识点对比`,
    description: `整理${subject.title}中容易混淆的知识点，通过对比表格直观呈现差异，助你精准记忆。`,
    path: `/${params.subject}/compare`,
  });
}

export default function ComparePage({ params }: ComparePageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const comparisons =
    loadJsonContent<ComparisonRow[]>(params.subject, "compare.json") || [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: subject.title, href: `/${params.subject}` },
          { label: "易混知识点对比" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-3">易混知识点对比</h1>
      <p className="text-gray-500 mb-8">
        将考试中容易混淆的知识点整理成对比表格，直观呈现差异，帮助精准记忆。
      </p>

      {comparisons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">对比表正在整理中，敬请期待。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comparisons.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <ComparisonTable {...comp} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
