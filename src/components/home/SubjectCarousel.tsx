"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Scale,
  ClipboardList,
  Wrench,
  FileText,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import { SUBJECTS, FREE_SUBJECT_SLUGS } from "@/lib/constants";

const ICONS: Record<string, typeof Scale> = {
  Scale,
  ClipboardList,
  Wrench,
  FileText,
  FlaskConical,
};

const GRADIENTS: Record<string, string> = {
  laws: "from-blue-500 to-indigo-600",
  management: "from-violet-500 to-purple-600",
  technology: "from-emerald-500 to-teal-600",
  chemical: "from-red-500 to-rose-600",
  "case-study": "from-orange-500 to-amber-600",
};

/** 各科目考试占比（依据历年分值） */
const EXAM_WEIGHT: Record<string, string> = {
  laws: "30%",
  management: "30%",
  technology: "20%",
  chemical: "20%",
  "case-study": "20%",
};

const DESCS: Record<string, string> = {
  laws: "法条体系完整梳理 · 历年真题高频考点全覆盖 · 每章配套练习即时检验",
  management: "安全管理体系与方法 · 风险辨识与控制 · 特殊作业 · 应急管理",
  technology: "机械电气安全 · 防火防爆 · 特种设备 · 危险化学品",
  chemical: "18 种重点监管危险化工工艺 · 化工运行 · 储运 · 事故应急与案例",
  "case-study": "含 7 个专业方向：化工 / 煤矿 / 矿山 / 冶炼 / 建筑 / 运输 / 其他",
};

export default function SubjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const slides = SUBJECTS;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [autoplay, next]);

  const slide = slides[Math.min(current, slides.length - 1)];
  const Icon = ICONS[slide.icon] || Scale;
  const isFree = (FREE_SUBJECT_SLUGS as readonly string[]).includes(slide.slug);
  const label = isFree ? "永久免费" : "按需解锁";

  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            考试科目
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            法规、管理、技术三科永久免费，专业实务含 7 个专业方向
          </p>
        </div>

        {/* 轮播主体 */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-white border border-warm-100/70 shadow-sm">
            <div
              className={`relative p-6 sm:p-8 bg-gradient-to-br ${GRADIENTS[slide.slug] || "from-blue-500 to-indigo-600"} text-white`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold">{slide.title}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur font-medium">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    {DESCS[slide.slug] || slide.description}
                  </p>
                  <div className="flex gap-4 text-xs text-white/60 mb-4">
                    <span>{slide.totalChapters} 个章节</span>
                    <span>考试占比约 {EXAM_WEIGHT[slide.slug] || "20%"}</span>
                  </div>
                  <Link
                    href={`/${slide.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition-colors text-sm font-medium"
                  >
                    进入学习
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 底部指示条 */}
            <div className="px-6 sm:px-8 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      setCurrent(i);
                      setAutoplay(false);
                    }}
                    aria-label={s.title}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current
                        ? "bg-primary-500 w-5"
                        : "bg-warm-300 hover:bg-warm-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={prev}
                  className="w-7 h-7 rounded-lg bg-warm-50 flex items-center justify-center hover:bg-warm-100 transition-colors"
                  aria-label="上一个"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button
                  onClick={next}
                  className="w-7 h-7 rounded-lg bg-warm-50 flex items-center justify-center hover:bg-warm-100 transition-colors"
                  aria-label="下一个"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* 全部科目缩略入口（轮播之外，保证爬虫与用户都能看到全部入口） */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {slides.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-warm-100 text-xs text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                {s.shortTitle}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
