"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, KeyRound, Trash2, ArrowLeft } from "lucide-react";
import { PLANS, SERVICE_WECHAT, FREE_SUBJECTS, PAID_SUBJECTS } from "@/lib/paywall";
import { useUnlock } from "@/lib/useUnlock";

const SUBJECT_NAMES: Record<string, string> = {
  chemical: "化工安全",
  mining: "煤矿安全",
  metal: "金属非金属矿山安全",
  smelting: "金属冶炼安全",
  construction: "建筑施工安全",
  transport: "道路运输安全",
  other: "其他安全",
};

export default function UnlockPage() {
  const { subjects, bundle, redeem, reset, hydrated } = useUnlock();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = () => {
    const r = redeem(code);
    setMsg({ ok: r.ok, text: r.msg });
    if (r.ok) setCode("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 返回首页
      </Link>

      <h1 className="text-xl font-bold text-gray-800 mb-2">解锁管理</h1>
      <p className="text-sm text-gray-500 mb-8">
        免费科目永久开放；专业实务方向按需解锁，付款后凭解锁码开通。
      </p>

      {/* 当前状态 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">当前权益</h2>

        {!hydrated ? (
          <p className="text-xs text-gray-400">加载中…</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {FREE_SUBJECTS.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs"
                >
                  <Check className="w-3 h-3" />
                  {s === "laws" ? "安全生产法律法规" : s === "management" ? "安全生产管理" : "安全生产技术基础"}
                  <span className="text-green-500">免费</span>
                </span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-2">专业实务：</p>
              <div className="flex flex-wrap gap-2">
                {PAID_SUBJECTS.map((s) => {
                  const ok = bundle || subjects.includes(s);
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                        ok
                          ? "bg-primary-50 text-primary-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ok && <Check className="w-3 h-3" />}
                      {SUBJECT_NAMES[s] || s}
                      <span className={ok ? "text-primary-500" : "text-gray-400"}>
                        {ok ? "已解锁" : "未解锁"}
                      </span>
                    </span>
                  );
                })}
                {!bundle && subjects.length === 0 && (
                  <span className="text-[11px] text-gray-400 self-center">
                    暂无已解锁方向
                  </span>
                )}
              </div>
            </div>

            {(bundle || subjects.length > 0) && (
              <button
                onClick={reset}
                className="self-start inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors mt-1"
              >
                <Trash2 className="w-3 h-3" /> 清除本机解锁记录
              </button>
            )}
          </div>
        )}
      </div>

      {/* 输入解锁码 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-amber-500" /> 输入解锁码
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          付款后联系客服微信{" "}
          <span className="font-medium text-gray-600">{SERVICE_WECHAT}</span>{" "}
          获取
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="例如 HUAGONG2026"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 font-mono"
          />
          <button
            onClick={submit}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            解锁
          </button>
        </div>
        {msg && (
          <p
            className={`text-xs mt-2 ${msg.ok ? "text-green-600" : "text-red-500"}`}
          >
            {msg.text}
          </p>
        )}
      </div>

      {/* 价目 */}
      <h2 className="text-sm font-semibold text-gray-800 mb-3">解锁方案</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PLANS.filter((p) => p.id !== "enterprise").map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-4 ${
              plan.highlight
                ? "border-primary-300 bg-primary-50/40"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800">{plan.name}</h3>
              {plan.badge && (
                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px]">
                  {plan.badge}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-gray-800">
                {plan.priceLabel}
              </span>
              {plan.originalLabel && (
                <span className="text-xs text-gray-400 line-through">
                  {plan.originalLabel}
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <Check className="w-3 h-3 mt-0.5 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 企业团报 */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">
          企业团报（10 人以上）
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          安全员是企业强制配置岗位。10 人以上批量开通、内部培训资料定制、开具发票，
          请联系客服微信 <span className="font-medium text-gray-700">{SERVICE_WECHAT}</span> 洽谈。
        </p>
        <span className="inline-block px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600">
          加微信备注「企业团报」
        </span>
      </div>
    </div>
  );
}
