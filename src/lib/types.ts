// 全站类型定义

// 科目元数据
export interface SubjectMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  order: number;
  totalChapters: number;
  color: string;
  /**
   * 是否从顶级导航隐藏。
   * 用于专业实务的 7 个专业方向：它们有内容、需要生成页面，
   * 但不应出现在顶部导航（否则 7 个方向会让导航过长），
   * 只通过「专业实务」的下拉/方向页进入。
   */
  hidden?: boolean;
}

// 章节元数据
export interface ChapterMeta {
  number: number;
  slug: string;
  title: string;
  examWeight: number; // 1-3
  /** 本章节的分节列表（用于侧边栏目录 / 进度 / 题目溯源） */
  sections?: SectionMeta[];
}

/** 章内分节（一个"节"= 一组小知识点 + 若干随堂练习） */
export interface SectionMeta {
  /** 锚点 ID，稳定不变，用于题目溯源定位，如 "s1" */
  id: string;
  /** 节标题，如 "第一节 安全生产管理基本概念" */
  title: string;
  /** 该节的考点重要度 1-3，用于视觉标记 */
  examWeight?: number;
}

// MDX Frontmatter
export interface ChapterFrontmatter {
  title: string;
  chapter: number;
  subject: string;
  description: string;
  keywords: string[];
  order: number;
  lastUpdated: string;
  difficulty: "basic" | "intermediate" | "advanced";
  examWeight: string; // "★" | "★★" | "★★★"
  estimatedMinutes: number;
}

// 测验
export interface QuizOption {
  key: string;
  text: string;
}

/** 题目溯源信息：指向具体知识点所在的分节 */
export interface QuizSourceRef {
  /** 所在章节 slug，如 "chapter-01" */
  chapter: string;
  /** 分节锚点 id，如 "s3" */
  sectionId: string;
  /** 分节标题，如 "第三节 安全生产管理基本概念" */
  sectionTitle: string;
  /** 可选：更细的知识点名称，用于展示 */
  point?: string;
}

export interface QuizQuestion {
  id: string;
  /** 题目用途：quiz=章节测验（计分）；inline=随堂练习（不计分） */
  scope?: "quiz" | "inline";
  type: "single" | "multi" | "judge";
  stem: string;
  options: QuizOption[];
  answer: string;
  explanation: string;
  examPoint: string;
  difficulty: "easy" | "medium" | "hard";
  /** 题目在教材/笔记中的出处，如 "教材 P23 第三节" */
  source?: string;
  /** 知识点溯源，用于「定位到知识点」按钮 */
  sourceRef?: QuizSourceRef;
}

export interface ChapterQuiz {
  chapterNumber: number;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

// 分节级学习进度
export interface SectionProgress {
  completed: boolean;
  updatedAt: string;
}

// 章级测验进度
export interface ChapterProgress {
  completed: boolean;
  score: number;
  total: number;
  date: string;
  /** 节级进度：sectionId -> 是否已读 */
  sections?: Record<string, SectionProgress>;
}

/** localStorage 中保存的全部进度：`${subject}/${chapter}` -> ChapterProgress */
export type QuizProgress = Record<string, ChapterProgress>;

// 视频
export interface VideoEntry {
  id: string;
  title: string;
  source: string;
  duration: string;
  url: string;
  description?: string;
  chapterNumber?: number;
  tags?: string[];
}

// 对比表
export interface ComparisonRow {
  id: string;
  title: string;
  chapterNumbers: number[];
  columns: string[];
  rows: string[][];
  keyTakeaway: string;
}

// 思维导图
export interface MindMapEntry {
  id: string;
  title: string;
  chapterNumber: number;
  description?: string;
  summary?: string;
  nodes?: MindMapNode[];
}

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}
