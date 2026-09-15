import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { FREE_SECTIONS_PER_CHAPTER, isSubjectFree } from "@/lib/paywall";

export interface ChapterSplit {
  /** 免费部分（MDX 源码，含 frontmatter 与头部） */
  freeSource: string;
  /** 付费部分（MDX 源码，已剥除 frontmatter） */
  paidSource: string;
  /** 是否有付费内容 */
  hasPaid: boolean;
  /** 付费节标题列表 */
  paidSectionTitles: string[];
}

/**
 * 将章节 MDX 按「## 第X节」切分为免费/付费两段
 *
 * 规则：
 * - 全免费科目 → 全部返回 free
 * - 付费科目 → 前 N 节免费，其余付费
 * - frontmatter 与章节头（## 本章分值分布、ExamTip 等）始终免费
 *
 * 注意：付费段**不渲染进 HTML**（物理不出现在静态产物中），
 * 这是防白嫖的核心——`view-source` 也拿不到内容。
 */
export function splitChapter(
  subjectSlug: string,
  chapterSlug: string
): ChapterSplit | null {
  const mdxPath = join(
    process.cwd(),
    "src",
    "content",
    subjectSlug,
    chapterSlug,
    "page.mdx"
  );
  if (!existsSync(mdxPath)) return null;

  const raw = readFileSync(mdxPath, "utf-8");

  // 全免费科目：整体返回
  if (isSubjectFree(subjectSlug)) {
    return {
      freeSource: raw,
      paidSource: "",
      hasPaid: false,
      paidSectionTitles: [],
    };
  }

  // 定位所有节标题（## 第X节 ...），排除「本章小结」「本章分值分布」
  const lines = raw.split("\n");
  const sectionStarts: { idx: number; title: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 匹配 "## 第一节 xxx" 这类节标题
    if (/^##\s*第[一二三四五六七八九十]+节/.test(line)) {
      sectionStarts.push({ idx: i, title: line.replace(/^##\s*/, "").trim() });
    }
  }

  // 没有分节（如 outline 页）→ 整体免费，承担 SEO
  if (sectionStarts.length === 0) {
    return {
      freeSource: raw,
      paidSource: "",
      hasPaid: false,
      paidSectionTitles: [],
    };
  }

  // 免费段：前 N 节；每章至少留 1 节付费
  const freeCount = Math.max(
    0,
    Math.min(FREE_SECTIONS_PER_CHAPTER, sectionStarts.length - 1)
  );
  const cutIdx =
    freeCount < sectionStarts.length
      ? sectionStarts[freeCount].idx
      : lines.length;

  const freeLines = lines.slice(0, cutIdx);
  const paidLines = lines.slice(cutIdx);

  const paidSectionTitles = sectionStarts
    .slice(freeCount)
    .map((s) => s.title);

  // 付费段剥除 frontmatter（避免重复解析报错）
  let paidSource = paidLines.join("\n");
  paidSource = paidSource.replace(/^---[\s\S]*?---\s*/, "");

  return {
    freeSource: freeLines.join("\n"),
    paidSource,
    hasPaid: paidLines.length > 0,
    paidSectionTitles,
  };
}
