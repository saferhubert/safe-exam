import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white">
      {/* 装饰光晕 */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs mb-5 text-blue-200 border border-white/10">
            <Sparkles className="w-3 h-3" />
            法规·管理·技术 三科永久免费
          </div>

          {/* 标题 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 text-balance">
            中级注册安全工程师
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
              免费学习平台
            </span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/80 leading-relaxed mb-8 max-w-xl mx-auto">
            按教材大纲编排的系统学习笔记 + 章节练习 + 易混对比 + 思维导图。
            公共三科完全免费，专业实务按需解锁。
          </p>

          {/* 主按钮 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/laws"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/10 active:scale-[0.98] text-base"
            >
              免费开始学习
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chemical"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98] text-base"
            >
              化工安全实务试读
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
