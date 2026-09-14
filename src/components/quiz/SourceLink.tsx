"use client";

import { MapPin } from "lucide-react";
import type { QuizSourceRef } from "@/lib/types";

interface SourceLinkProps {
  sourceRef?: QuizSourceRef;
  /** 科目 slug，用于拼链接 */
  subject: string;
  /** 教材/笔记出处文字，如 "四色笔记 P23" */
  source?: string;
}

/**
 * 「定位到知识点」按钮：从题目跳回章节对应分节。
 * 链接形如 /{subject}/{chapter}#s3，配合章节页的锚点实现精准定位。
 */
export default function SourceLink({ sourceRef, subject, source }: SourceLinkProps) {
  if (!sourceRef) {
    if (!source) return null;
    return <p className="text-xs text-gray-400 mt-2">📖 出处：{source}</p>;
  }

  const href = `/${subject}/${sourceRef.chapter}#${sourceRef.sectionId}`;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={href}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors"
      >
        <MapPin className="w-3 h-3" />
        定位到知识点
      </a>
      <span className="text-xs text-gray-400 truncate">
        {sourceRef.sectionTitle}
        {source ? ` · ${source}` : ""}
      </span>
    </div>
  );
}
