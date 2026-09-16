import { notFound } from "next/navigation";
import { getSubject } from "@/lib/subjects";
import { loadJsonContent } from "@/lib/content";
import { SUBJECTS, CONTENT_SUBJECTS } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import MindMapEmbed from "@/components/content/MindMapEmbed";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { MindMapEntry } from "@/lib/types";

interface MindMapsPageProps {
  params: { subject: string };
}

export async function generateStaticParams() {
  return CONTENT_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({
  params,
}: MindMapsPageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  if (!subject) return {};
  return buildMetadata({
    title: `${subject.title} — 思维导图`,
    description: `${subject.title}思维导图合集，结构化呈现知识体系，助你建立知识框架。`,
    path: `/${params.subject}/mindmaps`,
  });
}

export default function MindMapsPage({ params }: MindMapsPageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const mindmaps =
    loadJsonContent<MindMapEntry[]>(params.subject, "mindmaps.json") || [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: subject.title, href: `/${params.subject}` },
          { label: "思维导图" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-3">思维导图</h1>
      <p className="text-gray-500 mb-8">
        结构化呈现知识体系，一目了然掌握知识框架和逻辑关系。
      </p>

      {mindmaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">思维导图正在制作中，敬请期待。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {mindmaps.map((mm) => (
            <div key={mm.id}>
              {mm.description && (
                <p className="text-sm text-gray-500 mb-3">{mm.description}</p>
              )}
              <MindMapEmbed
                title={mm.title}
                nodes={mm.nodes}
                summary={mm.summary}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
