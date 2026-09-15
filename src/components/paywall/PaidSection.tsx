"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { isSectionFree } from "@/lib/paywall";
import { useUnlock } from "@/lib/useUnlock";
import Paywall from "./Paywall";

interface PaidSectionProps {
  subjectSlug: string;
  subjectTitle: string;
  /** 节序号（0-based） */
  sectionIndex: number;
  sectionTitle: string;
  children: ReactNode;
}

/**
 * 付费节包装器
 * - 免费节：直接渲染
 * - 付费节：未解锁时显示模糊预览 + 付费墙
 *
 * 注意：为兼顾 SEO，被锁内容仍渲染进 DOM（爬虫可读），
 * 但通过 CSS 模糊 + 不可选中，降低直接复制价值。
 * 真正的深度内容资产（PDF/题库）走第三方平台物理隔离。
 */
export default function PaidSection({
  subjectSlug,
  subjectTitle,
  sectionIndex,
  sectionTitle,
  children,
}: PaidSectionProps) {
  const { hasAccess, hydrated } = useUnlock();
  const free = isSectionFree(subjectSlug, sectionIndex);
  const unlocked = hasAccess(subjectSlug);

  // SSR 阶段与首次渲染保持一致，避免 hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useRef<HTMLDivElement>(null);

  // 全免费科目 / 免费节 → 直接渲染
  if (free) return <>{children}</>;

  // 未 hydrate 完成时按锁定状态渲染（与服务端一致）
  const locked = mounted ? !unlocked : true;

  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      {/* 内容预览：显示但模糊、不可选中、限制高度 */}
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden"
        style={{
          maxHeight: "340px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          filter: "blur(1.2px)",
        }}
      >
        {children}
      </div>

      {/* 付费墙 */}
      <div className="relative -mt-16">
        <Paywall
          subjectSlug={subjectSlug}
          subjectTitle={subjectTitle}
          context={`「${sectionTitle}」`}
        />
      </div>
    </div>
  );
}
