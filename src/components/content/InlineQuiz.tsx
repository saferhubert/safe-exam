"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

interface InlineQuizProps {
  /** 随堂练习题（scope: "inline"） */
  questions: QuizQuestion[];
  /** 节标题，用于文案 */
  sectionTitle?: string;
}

/**
 * 随堂练习：嵌入在知识点之后的小测验（1-3 题）。
 * 与章节测验不同，这里不计分、不做进度拦截，目的是「即时检验 + 强化记忆」。
 * 默认折叠，点击展开，避免打断阅读流。
 */
export default function InlineQuiz({ questions, sectionTitle }: InlineQuizProps) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (!questions || questions.length === 0) return null;

  const answeredCount = Object.keys(revealed).length;

  const pick = (qid: string, key: string) => {
    if (revealed[qid]) return; // 已揭晓不可改
    setPicked((p) => ({ ...p, [qid]: key }));
  };

  const isCorrect = (q: QuizQuestion, key: string) => {
    const ans = (q.answer || "").toUpperCase().split("").sort().join("");
    return key.toUpperCase().split("").sort().join("") === ans;
  };

  return (
    <div className="my-6 rounded-xl border border-amber-200 bg-amber-50/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-amber-50 transition-colors"
      >
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-medium text-amber-900 text-sm">
          随堂练习
          {sectionTitle ? ` · ${sectionTitle}` : ""}
        </span>
        <span className="text-xs text-amber-700 ml-1">
          共 {questions.length} 题
          {answeredCount > 0 && ` · 已作答 ${answeredCount}`}
        </span>
        <span className="ml-auto text-amber-600">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 bg-white/60">
          {questions.map((q, qi) => {
            const isRevealed = !!revealed[q.id];
            const chosen = picked[q.id];
            const correct = chosen ? isCorrect(q, chosen) : false;

            return (
              <div key={q.id} className="pt-4 border-t border-amber-100 first:border-t-0">
                <div className="flex items-start gap-2 mb-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-medium mt-0.5">
                    {qi + 1}
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {q.stem}
                    <span className="ml-1.5 text-xs text-gray-400">
                      {q.type === "single" ? "（单选）" : q.type === "multi" ? "（多选）" : "（判断）"}
                    </span>
                  </p>
                </div>

                <div className="space-y-1.5 ml-7">
                  {q.options.map((o) => {
                    const isPicked = chosen === o.key;
                    const showRight = isRevealed && isCorrect(q, o.key);
                    const showWrong = isRevealed && isPicked && !correct;

                    return (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => pick(q.id, o.key)}
                        disabled={isRevealed}
                        className={`w-full flex items-start gap-2 text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                          showRight
                            ? "border-green-300 bg-green-50 text-green-800"
                            : showWrong
                            ? "border-red-300 bg-red-50 text-red-800"
                            : isPicked
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200 bg-white hover:border-amber-300"
                        } ${isRevealed ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span className="flex-shrink-0 font-medium">{o.key}.</span>
                        <span className="leading-relaxed">{o.text}</span>
                        {showRight && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 ml-auto mt-0.5" />
                        )}
                        {showWrong && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 ml-auto mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!isRevealed ? (
                  <button
                    type="button"
                    onClick={() => chosen && setRevealed((r) => ({ ...r, [q.id]: true }))}
                    disabled={!chosen}
                    className="ml-7 mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    查看答案
                  </button>
                ) : (
                  <div className="ml-7 mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {correct ? (
                        <span className="text-green-700">✅ 回答正确</span>
                      ) : (
                        <span className="text-red-700">
                          ❌ 回答错误，正确答案：{q.answer}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
                    {q.source && (
                      <p className="text-xs text-gray-400 mt-2">📖 出处：{q.source}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
