import { notFound } from "next/navigation";
import Link from "next/link";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getSubject, getChapters, getAdjacentChapters } from "@/lib/subjects";
import { getInlineBySection } from "@/lib/content";
import { SUBJECTS } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Callout,
  LawArticle,
  KeyPoint,
  ExamTip,
  ComparisonTable,
  VideoCard,
  MindMapEmbed,
  InlineQuiz,
  PracticeFrom,
  SectionTracker,
  InlineDataProvider,
} from "@/components/content";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/leads/LeadForm"), {
  ssr: false,
  loading: () => (
    <div className="mt-10 max-w-md mx-auto h-64 bg-gray-100 rounded-xl animate-pulse" />
  ),
});
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { ChapterFrontmatter } from "@/lib/types";

interface ChapterPageProps {
  params: { subject: string; chapter: string };
}

export async function generateStaticParams() {
  const params: { subject: string; chapter: string }[] = [];
  for (const subject of SUBJECTS) {
    const chapters = getChapters(subject.slug);
    for (const ch of chapters) {
      params.push({ subject: subject.slug, chapter: ch.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  const chapters = getChapters(params.subject);
  const chapter = chapters.find((c) => c.slug === params.chapter);
  if (!subject || !chapter) return {};

  const mdxPath = join(
    process.cwd(),
    "src",
    "content",
    params.subject,
    params.chapter,
    "page.mdx"
  );

  try {
    const source = readFileSync(mdxPath, "utf-8");
    const { frontmatter } = await compileMDX<ChapterFrontmatter>({
      source,
      options: { parseFrontmatter: true },
    });

    return buildMetadata({
      title: `${subject.shortTitle} · ${chapter.title}`,
      description:
        frontmatter.description ||
        `${chapter.title} — ${subject.title}学习笔记，含考点解析、思维导图和章节练习`,
      keywords: frontmatter.keywords || [chapter.title, subject.title],
      path: `/${params.subject}/${params.chapter}`,
    });
  } catch {
    return buildMetadata({
      title: `${subject.shortTitle} · ${chapter.title}`,
      description: `${chapter.title} — ${subject.title}学习笔记`,
      path: `/${params.subject}/${params.chapter}`,
    });
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const chapters = getChapters(params.subject);
  const chapter = chapters.find((c) => c.slug === params.chapter);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(params.subject, params.chapter);
  const mdxPath = join(
    process.cwd(),
    "src",
    "content",
    params.subject,
    params.chapter,
    "page.mdx"
  );

  if (!existsSync(mdxPath)) notFound();

  const source = readFileSync(mdxPath, "utf-8");
  // 按节取出随堂练习，注入 MDX 作用域，供 <PracticeFrom /> 使用
  const inlineBySection = getInlineBySection(params.subject, params.chapter);
  const { content, frontmatter } = await compileMDX<ChapterFrontmatter>({
    source,
        options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    // MDX 里可用 <PracticeFrom section="s1" /> 渲染该节随堂练习，
    // 题目数据由外层 <InlineDataProvider> 在服务端注入。
    components: {
      table: (props: any) => (
        <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm" {...props} />
        </div>
      ),
      th: (props: any) => (
        <th className="bg-primary-50 text-left p-3 border-b border-gray-200 font-semibold text-primary-900 whitespace-nowrap" {...props} />
      ),
      td: (props: any) => (
        <td className="p-3 border-b border-gray-100" {...props} />
      ),
      // 为 h2 / h3 自动加锚点，便于题目「定位到知识点」直接跳转
      h2: (props: any) => <h2 className="scroll-mt-24" {...props} />,
      h3: (props: any) => <h3 className="scroll-mt-24" {...props} />,
      Callout,
      LawArticle,
      KeyPoint,
      ExamTip,
      ComparisonTable,
      VideoCard,
      MindMapEmbed,
      InlineQuiz,
      PracticeFrom,
    },
  });

  return (
    <InlineDataProvider data={inlineBySection}>
    <article>
      <Breadcrumb
        items={[
          { label: subject.title, href: `/${params.subject}` },
          { label: chapter.title },
        ]}
      />

      {/* 章节头部 */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">第 {chapter.number} 章</Badge>
          <Badge
            variant={
              frontmatter.difficulty === "basic"
                ? "success"
                : frontmatter.difficulty === "intermediate"
                ? "warning"
                : "danger"
            }
          >
            {frontmatter.difficulty === "basic"
              ? "基础"
              : frontmatter.difficulty === "intermediate"
              ? "进阶"
              : "高级"}
          </Badge>
          <span className="text-sm text-gray-400 flex items-center gap-0.5">
            考试权重：
            {frontmatter.examWeight}
          </span>
          <span className="text-sm text-gray-400">
            预计 {frontmatter.estimatedMinutes || 20} 分钟
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {chapter.title}
        </h1>
        {frontmatter.description && (
          <p className="mt-3 text-gray-500 leading-relaxed">
            {frontmatter.description}
          </p>
        )}
      </div>

      {/* 学习进度面板（按节） */}
      {chapter.sections && chapter.sections.length > 0 && (
        <SectionTracker
          subject={params.subject}
          chapter={params.chapter}
          sections={chapter.sections}
        />
      )}

      {/* 文章正文 */}
      <div className="prose-cn bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {content}
      </div>

      {/* 章尾导航 */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {prev ? (
          <Link
            href={`/${params.subject}/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-600 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-all"
          >
            ← 上一章：{prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${params.subject}/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 rounded-lg border border-primary-200 hover:border-primary-300 transition-all"
          >
            下一章：{next.title} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* 章节测验入口 */}
      <div className="mt-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            章节练习
          </h3>
          <p className="text-sm text-gray-600">
            完成本章习题，检验学习效果。目标正确率 80%以上即可进入下一章。
          </p>
        </div>
        <Link
          href={`/${params.subject}/${params.chapter}/quiz`}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          开始练习
        </Link>
      </div>

      {/* 线索收集 */}
      <div className="mt-10 max-w-md mx-auto">
        <LeadForm />
      </div>
    </article>
    </InlineDataProvider>
  );
}
