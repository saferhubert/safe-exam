"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Circle, GraduationCap } from "lucide-react";
import type { ChapterMeta } from "@/lib/types";
import { getSectionProgress, setSectionRead } from "@/lib/quizzes";

interface SectionTrackerProps {
  subject: string;
  chapter: string;
  sections: ChapterMeta["sections"];
}

/**
 * 章节顶部的「学习进度」面板：
 * - 显示节级进度条（按已标记学完的节计算）
 * - 列出各节，可一键标记「学完」/「取消」
 * - 监听全局进度事件，与侧边栏 / 首页保持同步
 */
export default function SectionTracker({ subject, chapter, sections }: SectionTrackerProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setProgress(getSectionProgress(subject, chapter));
  }, [subject, chapter]);

  useEffect(() => {
    setMounted(true);
    refresh();
    const onChange = () => refresh();
    window.addEventListener("safe-exam-progress-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("safe-exam-progress-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  if (!sections || sections.length === 0) return null;

  const doneCount = sections.filter((s) => progress[s.id]).length;
  const pct = Math.round((doneCount / sections.length) * 100);

  const toggle = (id: string) => {
    setSectionRead(subject, chapter, id, !progress[id]);
    refresh();
  };

  return (
    <div className="my-6 rounded-xl border border-primary-100 bg-primary-50/40 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3">
        <GraduationCap className="w-4 h-4 text-primary-600 flex-shrink-0" />
        <span className="font-medium text-primary-900 text-sm">学习进度</span>
        <span className="text-xs text-primary-700">
          {doneCount} / {sections.length} 节
        </span>
        <span className="ml-auto text-xs font-semibold text-primary-700">
          {mounted ? `${pct}%` : "—"}
        </span>
      </div>

      {/* 进度条 */}
      <div className="px-4">
        <div className="h-1.5 w-full rounded-full bg-primary-100 overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${mounted ? pct : 0}%` }}
          />
        </div>
      </div>

      {/* 节列表 */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {sections.map((s) => {
          const done = !!progress[s.id];
          return (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/70 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-label={done ? "取消已学完标记" : "标记为学完"}
                className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  done
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 bg-white hover:border-primary-400"
                }`}
              >
                {done ? <Check className="w-3 h-3" /> : <Circle className="w-2 h-2 text-transparent" />}
              </button>
              <a
                href={`#${s.id}`}
                className={`text-xs truncate leading-relaxed hover:underline ${
                  done ? "text-gray-400 line-through" : "text-gray-700"
                }`}
                title={s.title}
              >
                {s.title}
              </a>
              {s.examWeight === 3 && (
                <span className="ml-auto text-[10px] text-amber-500 flex-shrink-0">★重点</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="px-4 pb-3 text-[11px] text-primary-600">
        提示：勾选后进度会保存在本机浏览器，下次访问自动恢复。
      </p>
    </div>
  );
}
