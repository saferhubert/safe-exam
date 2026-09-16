"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Check, MessageCircle, ChevronRight } from "lucide-react";
import { PLANS, SERVICE_WECHAT, Plan } from "@/lib/paywall";
import { useUnlock } from "@/lib/useUnlock";

interface PaywallProps {
  subjectSlug: string;
  subjectTitle: string;
  /** 触发位置说明，如「本节内容」 */
  context?: string;
  /** 紧凑模式（用在页面中部） */
  compact?: boolean;
}

export default function Paywall({
  subjectSlug,
  subjectTitle,
  context = "本节深度内容",
  compact = false,
}: PaywallProps) {
  const { redeem, hasAccess } = useUnlock();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showCode, setShowCode] = useState(false);

  if (hasAccess(subjectSlug)) return null;

  const submit = () => {
    const r = redeem(code, subjectSlug);
    setMsg({ ok: r.ok, text: r.msg });
    if (r.ok) setTimeout(() => window.location.reload(), 700);
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-b from-amber-50/70 to-white overflow-hidden">
      {/* 顶部提示 */}
      <div className="px-5 pt-6 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 mb-3">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1.5">
          {context}已锁定
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
          本页前 2 节内容可免费阅读，完整考点详解、章节题库与
          《考点速记手册》《案例答题模板》需解锁后查看
        </p>
        <Link
          href="/chemical/materials"
          className="inline-flex items-center gap-1 mt-2.5 text-[11px] text-primary-600 hover:underline"
        >
          先看看资料包里有什么 →
        </Link>
      </div>

      {/* 定价档位 */}
      {!compact && (
        <div className="px-4 pb-4 grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} subjectSlug={subjectSlug} />
          ))}
        </div>
      )}

      {/* 解锁码入口 */}
      <div className="px-5 pb-5 pt-2 border-t border-amber-100/70 bg-white/60">
        {!showCode ? (
          <button
            onClick={() => setShowCode(true)}
            className="w-full text-xs text-gray-500 hover:text-primary-600 transition-colors py-1.5"
          >
            已付款 / 已有解锁码？点此输入 →
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="输入解锁码"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                onClick={submit}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                解锁
              </button>
            </div>
            {msg && (
              <p
                className={`text-xs ${msg.ok ? "text-green-600" : "text-red-500"}`}
              >
                {msg.text}
              </p>
            )}
            <p className="text-[11px] text-gray-400">
              付款后请联系客服微信{" "}
              <span className="font-medium text-gray-600">{SERVICE_WECHAT}</span>{" "}
              获取解锁码
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plan, subjectSlug }: { plan: Plan; subjectSlug: string }) {
  const isEnterprise = plan.id === "enterprise";

  return (
    <div
      className={`relative rounded-xl border p-4 flex flex-col ${
        plan.highlight
          ? "border-primary-300 bg-primary-50/50 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      {plan.badge && (
        <span
          className={`absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium ${
            plan.highlight
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {plan.badge}
        </span>
      )}

      <div className="mb-2 mt-1">
        <h4 className="text-sm font-semibold text-gray-800">{plan.name}</h4>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span
            className={`text-xl font-bold ${plan.highlight ? "text-primary-600" : "text-gray-700"}`}
          >
            {plan.priceLabel}
          </span>
          {plan.originalLabel && (
            <span className="text-[11px] text-gray-400 line-through">
              {plan.originalLabel}
            </span>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 mb-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-600">
            <Check className="w-3 h-3 mt-0.5 shrink-0 text-green-500" />
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <a
          href={`https://work.weixin.qq.com/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 w-full py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {plan.cta}
        </a>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="rounded-lg bg-white border border-gray-200 p-2 text-center">
            <div className="text-[10px] text-gray-400 mb-1">
              微信扫码付款（备注：{subjectSlug}）
            </div>
            <div className="text-[11px] text-gray-600 font-medium">
              {SERVICE_WECHAT}
            </div>
          </div>
          <span className="text-[10px] text-gray-400 text-center">
            付款后加微信发解锁码，1 分钟内开通
          </span>
        </div>
      )}
    </div>
  );
}

/** 解锁码提交后的提示条（已解锁时显示） */
export function UnlockBanner({ subjectSlug }: { subjectSlug: string }) {
  const { hasAccess, hydrated } = useUnlock();
  if (!hydrated || !hasAccess(subjectSlug)) return null;
  return (
    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-600 shrink-0" />
      <span className="text-xs text-green-700">
        已解锁·全部内容可查看
      </span>
      <Link
        href="/unlock"
        className="ml-auto text-[11px] text-green-600 hover:underline flex items-center gap-0.5"
      >
        管理 <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
