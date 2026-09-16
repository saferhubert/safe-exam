import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { cache } from "react";
import { SUBJECTS, CONTENT_SUBJECTS } from "./constants";
import type { ChapterMeta, SubjectMeta } from "./types";

/**
 * 全部「可访问的科目」（含专业实务下的方向）
 *
 * NAV_SUBJECTS 只含顶级导航项，但化工安全等专业实务方向
 * 也需要能被 getSubject 查到以渲染 /chemical/* 页面，
 * 所以这里用 CONTENT_SUBJECTS（含 hidden 方向）。
 */
const ALL_ACCESSIBLE: SubjectMeta[] = (() => {
  const map = new Map<string, SubjectMeta>();
  for (const s of [...SUBJECTS, ...CONTENT_SUBJECTS]) {
    if (!map.has(s.slug)) map.set(s.slug, s);
  }
  return Array.from(map.values());
})();

/** 顶级导航科目（用于首页/导航渲染） */
export function getAllSubjects(): SubjectMeta[] {
  return SUBJECTS;
}

/**
 * 按 slug 查科目（含专业实务下的方向）
 * 用于 [subject] 动态路由：/chemical 等方向页也要能解析
 */
export function getSubject(slug: string): SubjectMeta | undefined {
  return ALL_ACCESSIBLE.find((s) => s.slug === slug);
}

export const getChapters = cache(
  (subjectSlug: string): ChapterMeta[] => {
    try {
      const path = join(
        process.cwd(),
        "src",
        "content",
        subjectSlug,
        "chapters.json"
      );
      if (!existsSync(path)) return [];
      return JSON.parse(readFileSync(path, "utf-8"));
    } catch {
      return [];
    }
  }
);

export function getChapter(
  subjectSlug: string,
  chapterSlug: string
): ChapterMeta | undefined {
  const chapters = getChapters(subjectSlug);
  return chapters.find((c) => c.slug === chapterSlug);
}

export function getAdjacentChapters(
  subjectSlug: string,
  chapterSlug: string
): { prev: ChapterMeta | null; next: ChapterMeta | null } {
  const chapters = getChapters(subjectSlug);
  const index = chapters.findIndex((c) => c.slug === chapterSlug);
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
