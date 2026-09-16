import { notFound } from "next/navigation";
import { getSubject, getChapters } from "@/lib/subjects";
import { loadJsonContent } from "@/lib/content";
import { SUBJECTS, CONTENT_SUBJECTS } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import VideoCard from "@/components/content/VideoCard";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { VideoEntry } from "@/lib/types";

interface BisaiPageProps {
  params: { subject: string };
}

export async function generateStaticParams() {
  return CONTENT_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({
  params,
}: BisaiPageProps): Promise<Metadata> {
  const subject = getSubject(params.subject);
  if (!subject) return {};
  return buildMetadata({
    title: `${subject.title} — 免费视频课程`,
    description: `精选B站、中国大学MOOC、学堂在线、网易公开课等平台的优质免费${subject.title}教学视频，按章节编排。`,
    path: `/${params.subject}/bisai`,
  });
}

export default function BisaiPage({ params }: BisaiPageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const videos = loadJsonContent<VideoEntry[]>(params.subject, "bisai.json") || [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: subject.title, href: `/${params.subject}` },
          { label: "免费视频课程" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-3">免费视频课程</h1>
      <p className="text-gray-500 mb-8">
        精选B站、中国大学MOOC、学堂在线、网易公开课等平台的优质免费教学视频，按章节编排。点击即可观看。
      </p>

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">视频课程正在整理中，敬请期待。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      )}
    </div>
  );
}
