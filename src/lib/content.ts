import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { cache } from "react";
import type { ChapterQuiz, QuizQuestion } from "./types";

function quizPath(subject: string, chapter: string): string {
  return join(process.cwd(), "src", "content", subject, chapter, "quiz.json");
}

/** 通用 JSON 读取（服务器端） */
export function loadJsonContent<T>(subject: string, file: string): T | null {
  try {
    const path = join(process.cwd(), "src", "content", subject, file);
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

/** 读取整章题目（含随堂练习与章节测验） */
export const getFullQuiz = cache(
  (subject: string, chapter: string): ChapterQuiz | null => {
    try {
      const p = quizPath(subject, chapter);
      if (!existsSync(p)) return null;
      return JSON.parse(readFileSync(p, "utf-8")) as ChapterQuiz;
    } catch {
      return null;
    }
  }
);

/**
 * 按分节取出「随堂练习」题（scope === "inline"）。
 * 返回 { [sectionId]: QuizQuestion[] }，供 MDX 中按节调用 <PracticeFrom />。
 *
 * @param filterToSections 可选：只保留这些 sectionId 的题目。
 *   付费科目必须传入免费节的 sectionId，否则题目数据会随 HTML 泄露。
 */
export const getInlineBySection = cache(
  (
    subject: string,
    chapter: string,
    filterToSections?: string[]
  ): Record<string, QuizQuestion[]> => {
    const quiz = getFullQuiz(subject, chapter);
    const out: Record<string, QuizQuestion[]> = {};
    if (!quiz?.questions) return out;

    const allow = filterToSections ? new Set(filterToSections) : null;

    for (const q of quiz.questions) {
      // 只取随堂练习；未标注 scope 的默认视为章节测验题，不进正文
      if (q.scope !== "inline") continue;
      const sid = q.sourceRef?.sectionId || "_default";
      // 付费科目：只注入免费节的题目
      if (allow && !allow.has(sid)) continue;
      if (!out[sid]) out[sid] = [];
      out[sid].push(q);
    }
    return out;
  }
);

/** 取出章节测验题（scope !== "inline"） */
export const getChapterQuizQuestions = cache(
  (subject: string, chapter: string): QuizQuestion[] => {
    const quiz = getFullQuiz(subject, chapter);
    if (!quiz?.questions) return [];
    return quiz.questions.filter((q) => q.scope !== "inline");
  }
);

/** 兼容旧调用：返回整章测验数据（章节测验页使用） */
export const getQuiz = getFullQuiz;
