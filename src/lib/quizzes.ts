import type { QuizProgress } from "./types";

const STORAGE_KEY = "safe-exam-progress";
const VERSION_KEY = "safe-exam-progress-version";
const CURRENT_VERSION = "2";

export function getQuizKey(subject: string, chapter: string): string {
  return `${subject}/${chapter}`;
}

export function getProgress(): QuizProgress {
  if (typeof window === "undefined") return {};
  try {
    migrateIfNeeded();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** 老版本（v1）没有 sections 字段，这里把数据升级到 v2，避免用户进度丢失 */
function migrateIfNeeded(): void {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v === CURRENT_VERSION) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QuizProgress;
      for (const k of Object.keys(parsed)) {
        if (!parsed[k].sections) parsed[k].sections = {};
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch {
    // 迁移失败不影响使用
  }
}

function writeProgress(progress: QuizProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // 通知同页面其它组件刷新（进度条 / 侧边栏）
    window.dispatchEvent(new Event("safe-exam-progress-change"));
  } catch {
    // 忽略配额错误
  }
}

/** 保存章节测验成绩 */
export function saveProgress(
  subject: string,
  chapter: string,
  score: number,
  total: number
): void {
  if (typeof window === "undefined") return;
  const key = getQuizKey(subject, chapter);
  const progress = getProgress();
  const prev = progress[key];
  progress[key] = {
    ...prev,
    completed: true,
    score,
    total,
    date: new Date().toISOString(),
    sections: prev?.sections || {},
  };
  writeProgress(progress);
}

/** 标记某一「节」已读 / 未读 */
export function setSectionRead(
  subject: string,
  chapter: string,
  sectionId: string,
  completed: boolean
): void {
  if (typeof window === "undefined") return;
  const key = getQuizKey(subject, chapter);
  const progress = getProgress();
  const prev = progress[key] || {
    completed: false,
    score: 0,
    total: 0,
    date: "",
  };
  const sections = { ...(prev.sections || {}) };
  if (completed) {
    sections[sectionId] = { completed: true, updatedAt: new Date().toISOString() };
  } else {
    delete sections[sectionId];
  }
  progress[key] = { ...prev, sections };
  writeProgress(progress);
}

/** 读取某章的节级进度 */
export function getSectionProgress(
  subject: string,
  chapter: string
): Record<string, boolean> {
  const p = getProgress()[getQuizKey(subject, chapter)];
  const out: Record<string, boolean> = {};
  if (p?.sections) {
    for (const [k, v] of Object.entries(p.sections)) {
      out[k] = !!v?.completed;
    }
  }
  return out;
}

/** 清除全部进度（调试/重置用） */
export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    window.dispatchEvent(new Event("safe-exam-progress-change"));
  } catch {
    // 忽略
  }
}
