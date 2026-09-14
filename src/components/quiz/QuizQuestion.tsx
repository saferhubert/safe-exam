"use client";

import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import Badge from "../ui/Badge";
import SourceLink from "./SourceLink";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  /** 科目 slug，用于「定位到知识点」链接 */
  subject?: string;
}

const typeLabels: Record<string, string> = {
  single: "单选题",
  multi: "多选题",
  judge: "判断题",
};

export default function QuizQuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  showResult,
  subject,
}: QuizQuestionCardProps) {
  const isCorrect =
    showResult &&
    selectedAnswer.toUpperCase() === question.answer.toUpperCase();

  const handleOptionClick = (key: string) => {
    if (showResult) return;
    if (question.type === "multi") {
      const current = selectedAnswer.split("").sort();
      const idx = current.indexOf(key);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(key);
      }
      onAnswer(current.sort().join(""));
    } else {
      onAnswer(key);
    }
  };

  const isSelected = (key: string) => selectedAnswer.includes(key);
  const isCorrectAnswer = (key: string) =>
    showResult && question.answer.includes(key);
  const isWrongAnswer = (key: string) =>
    showResult && isSelected(key) && !question.answer.includes(key);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 题目标题 */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant={
              question.difficulty === "easy"
                ? "success"
                : question.difficulty === "medium"
                ? "warning"
                : "danger"
            }
          >
            {typeLabels[question.type]}
          </Badge>
          <Badge variant="default">{question.examPoint}</Badge>
        </div>
        <h3 className="text-base font-medium text-gray-900 leading-relaxed">
          {question.stem}
        </h3>
        {question.type === "multi" && (
          <p className="text-xs text-gray-400 mt-2">多选题，请选择所有正确答案</p>
        )}
      </div>

      {/* 选项 */}
      <div className="p-4 space-y-2">
        {question.options.map((opt) => {
          let optionClass =
            "flex items-start gap-3 p-3.5 rounded-lg border-2 transition-all cursor-pointer touch-target ";

          if (showResult) {
            if (isCorrectAnswer(opt.key) && isSelected(opt.key)) {
              optionClass += "border-green-400 bg-green-50";
            } else if (isCorrectAnswer(opt.key)) {
              optionClass += "border-green-300 bg-green-50/50";
            } else if (isWrongAnswer(opt.key)) {
              optionClass += "border-red-300 bg-red-50";
            } else {
              optionClass += "border-gray-100 opacity-50";
            }
          } else if (isSelected(opt.key)) {
            optionClass += "border-primary-400 bg-primary-50";
          } else {
            optionClass += "border-gray-100 hover:border-gray-300 hover:bg-gray-50";
          }

          return (
            <button
              key={opt.key}
              onClick={() => handleOptionClick(opt.key)}
              className={optionClass}
              disabled={showResult}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                  showResult && isCorrectAnswer(opt.key)
                    ? "bg-green-500 text-white"
                    : isSelected(opt.key)
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {opt.key}
              </span>
              <span className="text-sm text-gray-800 leading-relaxed flex-1 text-left mt-0.5">
                {opt.text}
              </span>
              {showResult && isCorrectAnswer(opt.key) && (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              {isWrongAnswer(opt.key) && (
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 解析 (show results only) */}
      {showResult && (
        <div
          className={`px-5 py-4 border-t ${
            isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <span className="text-sm font-semibold text-green-700">
                ✓ 回答正确
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-700">
                ✗ 回答错误（正确答案：{question.answer}）
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {question.explanation}
          </p>
          {subject && (
            <SourceLink
              sourceRef={question.sourceRef}
              subject={subject}
              source={question.source}
            />
          )}
        </div>
      )}
    </div>
  );
}
