"use client";

import { createContext, useContext, useEffect, useState } from "react";
import InlineQuiz from "./InlineQuiz";
import type { QuizQuestion } from "@/lib/types";

/** 页面级随堂练习数据：{ sectionId: QuizQuestion[] } */
const InlineDataContext = createContext<Record<string, QuizQuestion[]>>({});

export function InlineDataProvider({
  data,
  children,
}: {
  data: Record<string, QuizQuestion[]>;
  children: React.ReactNode;
}) {
  return (
    <InlineDataContext.Provider value={data}>{children}</InlineDataContext.Provider>
  );
}

interface PracticeFromProps {
  /** 分节 id，如 "s1"。数据由页面在服务端注入 provider */
  section: string;
  /** 节标题（可选，用于展示） */
  title?: string;
}

/**
 * MDX 中使用： <PracticeFrom section="s1" />
 * 从上层 InlineDataProvider 取出该节的随堂练习并渲染。
 */
export default function PracticeFrom({ section, title }: PracticeFromProps) {
  const data = useContext(InlineDataContext);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const questions = data?.[section] || [];

  if (questions.length === 0) return null;

  if (!ready) {
    return (
      <div className="my-6 rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-3 text-sm text-amber-800">
        随堂练习加载中…
      </div>
    );
  }

  return <InlineQuiz questions={questions} sectionTitle={title} />;
}
