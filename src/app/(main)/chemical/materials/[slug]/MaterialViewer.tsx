"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Lock } from "lucide-react";
import { useUnlock } from "@/lib/useUnlock";

interface Props {
  title: string;
  html: string;
  css: string;
}

/**
 * 资料查看器
 *
 * 付费资料本身已构建进静态页（可用 view-source 看到），
 * 但通过客户端解锁状态控制渲染 —— 与全站付费墙策略一致
 * （前端付费墙只能挡君子，真正防白嫖靠内容分散与持续更新）。
 */
export default function MaterialViewer({ title, html, css }: Props) {
  const { hasAccess, hydrated } = useUnlock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const unlocked = mounted ? hasAccess("chemical") : false;

  if (!hydrated || !mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 mb-4">
          <Lock className="w-6 h-6 text-amber-500" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 mb-2">
          这份资料需要解锁后查看
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {title}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/chemical/materials"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            去解锁
          </Link>
          <Link
            href="/chemical"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 返回化工安全
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 打印样式：把资料自带 CSS 注入 */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 工具条（打印时隐藏） */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/chemical/materials"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 资料列表
          </Link>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs font-medium text-gray-700 truncate flex-1">
            {title}
          </span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition-colors noprint"
          >
            <Printer className="w-3.5 h-3.5" /> 打印 / 另存为 PDF
          </button>
        </div>
      </div>

      {/* 资料正文（自带样式，外层给白底留白） */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </>
  );
}
