import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Star,
  ArrowRight,
  Video,
  GitCompare,
  Network,
} from "lucide-react";
import { getSubject, getChapters } from "@/lib/subjects";
import { loadJsonContent } from "@/lib/content";
import { SUBJECTS, CONTENT_SUBJECTS } from "@/lib/constants";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/leads/LeadForm"), {
  ssr: false,
  loading: () => (
    <div className="mt-10 max-w-md mx-auto h-64 bg-warm-50/50 rounded-2xl animate-pulse" />
  ),
});
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

interface SubjectPageProps {
  params: { subject: string };
}

export async function generateStaticParams() {
  return CONTENT_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  if (!subject) return {};
  return buildMetadata({
    title: `${subject.title} — 全部章节`,
    description: `系统学习${subject.title}，共${subject.totalChapters}个章节，含学习笔记、思维导图、章节练习。`,
    path: `/${params.subject}`,
  });
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();
  const chapters = getChapters(params.subject);

  const weightLabels = ["", "了解章节", "一般章节", "重点章节"];

  // 只有存在对应数据文件时才显示快捷入口，避免出现空页面
  const hasMindmaps = Boolean(
    loadJsonContent<unknown[]>(params.subject, "mindmaps.json")?.length
  );
  const hasCompare = Boolean(
    loadJsonContent<unknown[]>(params.subject, "compare.json")?.length
  );
  const hasVideos = Boolean(
    loadJsonContent<unknown[]>(params.subject, "bisai.json")?.length
  );

  return (
    <div>
      {/* 科目概览 */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-warm-100/70 p-6 sm:p-7 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-300/30 to-primary-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {subject.title}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
              {subject.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="primary">{chapters.length} 个章节</Badge>
              <Badge>学习笔记</Badge>
              <Badge>思维导图</Badge>
              <Badge>章节练习</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {hasVideos && (
        <Link
          href={`/${params.subject}/bisai`}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-warm-100/70 hover:border-primary-200/60 hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Video className="w-4.5 h-4.5 text-primary-500" />
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">免费视频课程</div>
            <div className="text-xs text-gray-400">免费视频教学</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>
        )}
        {hasCompare && (
        <Link
          href={`/${params.subject}/compare`}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-warm-100/70 hover:border-primary-200/60 hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <GitCompare className="w-4.5 h-4.5 text-primary-500" />
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">易混知识点对比</div>
            <div className="text-xs text-gray-400">精准辨析记忆</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>
        )}
        {hasMindmaps && (
        <Link
          href={`/${params.subject}/mindmaps`}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-warm-100/70 hover:border-primary-200/60 hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Network className="w-4.5 h-4.5 text-primary-500" />
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">思维导图</div>
            <div className="text-xs text-gray-400">结构化知识体系</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>
        )}
      </div>

      {/* 章节列表 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-primary-300" />
        全部章节
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {chapters.map((ch) => (
          <Link key={ch.slug} href={`/${params.subject}/${ch.slug}`}>
            <Card hover padding="md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-50 to-warm-50 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary-600 border border-primary-100/50">
                  {ch.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm truncate">
                    {ch.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex gap-0.5">
                      {Array.from({ length: ch.examWeight }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-300 text-amber-300"
                        />
                      ))}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {weightLabels[ch.examWeight]}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* 线索收集 */}
      <div className="mt-10 max-w-md mx-auto">
        <LeadForm />
      </div>
    </div>
  );
}
