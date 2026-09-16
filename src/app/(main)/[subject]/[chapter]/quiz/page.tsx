import { notFound } from "next/navigation";
import { getSubject, getChapters } from "@/lib/subjects";
import { getQuiz } from "@/lib/content";
import { SUBJECTS, CONTENT_SUBJECTS } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import QuizClient from "@/components/quiz/QuizClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

interface QuizPageProps {
  params: { subject: string; chapter: string };
}

export async function generateStaticParams() {
  const params: { subject: string; chapter: string }[] = [];
  for (const subject of CONTENT_SUBJECTS) {
    const chapters = getChapters(subject.slug);
    for (const ch of chapters) {
      params.push({ subject: subject.slug, chapter: ch.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  const chapters = getChapters(params.subject);
  const chapter = chapters.find((c) => c.slug === params.chapter);
  if (!subject || !chapter) return {};

  return buildMetadata({
    title: `${chapter.title} — 章节练习`,
    description: `${chapter.title}章节练习，在线刷题，即时判分，详细解析。`,
    path: `/${params.subject}/${params.chapter}/quiz`,
  });
}

export default function QuizPage({ params }: QuizPageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const chapters = getChapters(params.subject);
  const chapter = chapters.find((c) => c.slug === params.chapter);
  if (!chapter) notFound();

  const quiz = getQuiz(params.subject, params.chapter);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: subject.title, href: `/${params.subject}` },
          {
            label: chapter.title,
            href: `/${params.subject}/${params.chapter}`,
          },
          { label: "章节练习" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {chapter.title}
        <span className="text-gray-400 font-normal text-lg ml-2">
          章节练习
        </span>
      </h1>

      {quiz ? (
        <QuizClient
          questions={quiz.questions}
          passingScore={quiz.passingScore}
          subject={params.subject}
          chapter={params.chapter}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">本章练习题正在筹备中，敬请期待。</p>
        </div>
      )}
    </div>
  );
}
