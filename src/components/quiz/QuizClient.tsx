"use client";

import { useState, useCallback, useMemo } from "react";
import type { QuizQuestion } from "@/lib/types";
import { saveProgress } from "@/lib/quizzes";
import QuizQuestionCard from "./QuizQuestion";
import QuizProgress from "./QuizProgress";
import QuizResult from "./QuizResult";

type QuizState = "idle" | "in-progress" | "submitted";

interface QuizClientProps {
  questions: QuizQuestion[];
  passingScore: number;
  subject: string;
  chapter: string;
}

export default function QuizClient({
  questions,
  passingScore,
  subject,
  chapter,
}: QuizClientProps) {
  const [state, setState] = useState<QuizState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    []
  );

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.toUpperCase() === q.answer.toUpperCase()) {
        correct++;
      }
    });
    return correct;
  }, [questions, answers]);

  const passed = score / totalQuestions >= passingScore / 100;

  const handleSubmit = () => {
    setState("submitted");
    saveProgress(subject, chapter, score, totalQuestions);
  };

  const handleStart = () => setState("in-progress");

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setState("idle");
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">本章练习题正在筹备中，敬请期待。</p>
        <p className="text-gray-400 text-sm mt-2">
          我们的教研团队正在精心设计每一道练习题，确保题目质量和考点覆盖。
        </p>
      </div>
    );
  }

  if (state === "idle") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            章节练习
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
            <div className="bg-primary-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary-600">
                {totalQuestions}
              </div>
              <div className="text-xs text-primary-500">题目数量</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-600">
                {passingScore}%
              </div>
              <div className="text-xs text-amber-500">及格线</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter((q) => q.type === "single").length}
              </div>
              <div className="text-xs text-green-500">单选题</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            共 {totalQuestions} 道题，包含单选题、多选题和判断题。
            达到 {passingScore}% 正确率即为通过。
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            开始练习
          </button>
        </div>
      </div>
    );
  }

  if (state === "submitted") {
    return (
      <div className="max-w-2xl mx-auto">
        <QuizResult
          score={score}
          total={totalQuestions}
          passed={passed}
          questions={questions}
          answers={answers}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-2xl mx-auto">
      <QuizProgress
        current={currentIndex + 1}
        total={totalQuestions}
        answered={answeredCount}
      />

      <QuizQuestionCard
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id] || ""}
        onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        showResult={false}
        subject={subject}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 上一题
        </button>

        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {totalQuestions}
        </span>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              allAnswered
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            提交答卷 ({answeredCount}/{totalQuestions})
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
            }
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            下一题 →
          </button>
        )}
      </div>
    </div>
  );
}
