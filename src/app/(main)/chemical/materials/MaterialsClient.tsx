"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Lock,
  CheckCircle2,
  Sparkles,
  Printer,
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { SERVICE_WECHAT, PLANS } from "@/lib/paywall";
import { useUnlock } from "@/lib/useUnlock";

interface Material {
  id: string;
  title: string;
  desc: string;
  pages: string;
  file: string;
  highlights: string[];
}

const MATERIALS: Material[] = [
  {
    id: "speed-review",
    title: "化工安全考点速记手册",
    desc: "把 7 章 31 节压缩成「看一眼就能记住」的表格，含必背数字速查表。",
    pages: "约 30 页 · A4 可打印",
    file: "/chemical/materials/speed-review",
    highlights: [
      "35 项必背数字速查表（考前反复看）",
      "82 个核心考点速记（按章编排）",
      "强化期 / 冲刺期 / 考前一天 三阶段用法",
    ],
  },
  {
    id: "case-templates",
    title: "案例答题模板",
    desc: "主观题万能框架：五类高频题型的标准答题结构，照着写就能踩到得分点。",
    pages: "约 20 页 · A4 可打印",
    file: "/chemical/materials/case-templates",
    highlights: [
      "通用答题四步法（定性→定点→分点→作答）",
      "五类高频题型专属模板（含重大危险源计算式）",
      "法规术语清单 + 考场时间分配表",
    ],
  },
];

export default function MaterialsClient() {
  const { hasAccess, hydrated, redeem } = useUnlock();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const unlocked = hasAccess("chemical");

  const submit = () => {
    const r = redeem(code, "chemical");
    setMsg({ ok: r.ok, text: r.msg });
    if (r.ok) setTimeout(() => window.location.reload(), 700);
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(SERVICE_WECHAT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/chemical"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 返回化工安全
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 mb-3">
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          备考专属资料包
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          解锁《化工安全》后即可免费下载。两份资料覆盖
          <span className="font-medium text-gray-700">记忆</span> 与
          <span className="font-medium text-gray-700">主观题</span>
          两大痛点，可直接打印。
        </p>
      </div>

      {/* 未解锁：提示 + 解锁码输入 */}
      {hydrated && !unlocked && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              资料包需解锁后下载
            </span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed mb-4">
            {PLANS[0].priceLabel} 解锁《化工安全》全部内容，即可获得这两份资料。
            付款后联系客服微信获取解锁码。
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="输入解锁码"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-amber-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 font-mono bg-white"
            />
            <button
              onClick={submit}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              解锁
            </button>
          </div>
          {msg && (
            <p className={`text-xs mt-2 ${msg.ok ? "text-green-600" : "text-red-500"}`}>
              {msg.text}
            </p>
          )}
          {SERVICE_WECHAT && (
            <div className="mt-3 pt-3 border-t border-amber-200/70 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-amber-700">客服微信：</span>
              <button
                onClick={copyWechat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-800 hover:border-amber-400 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {SERVICE_WECHAT}
              </button>
              <span className="text-[11px] text-amber-600">
                备注「化工」即刻通过
              </span>
            </div>
          )}
        </div>
      )}

      {/* 已解锁提示 */}
      {hydrated && unlocked && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700">
            已解锁 · 以下资料可直接下载
          </span>
        </div>
      )}

      {/* 资料列表 */}
      <div className="flex flex-col gap-4">
        {MATERIALS.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">
                  {m.title}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {m.desc}
                </p>

                <ul className="flex flex-col gap-1.5 mb-4">
                  {m.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-1.5 text-[11px] text-gray-600"
                    >
                      <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-green-500" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-gray-400">{m.pages}</span>
                  {hydrated && unlocked ? (
                    <>
                      <a
                        href={m.file}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> 打开资料
                      </a>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <Printer className="w-3 h-3" /> 打开后 Ctrl+P 即可打印
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-xs">
                      <Lock className="w-3.5 h-3.5" /> 解锁后可下载
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 解锁方案 */}
      {hydrated && !unlocked && (
        <div className="mt-8">
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
                  <h3 className="text-sm font-semibold text-gray-800">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px]">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
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
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-gray-600"
                    >
                      <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/unlock"
              className="text-xs text-primary-600 hover:underline"
            >
              查看完整解锁说明 →
            </Link>
          </div>
        </div>
      )}

      {/* 企业团报 */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          企业团报（10 人以上）
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          安全员是企业强制配置岗位。10 人以上批量开通、内部培训资料定制、开具发票，
          请联系客服微信{" "}
          <span className="font-medium text-gray-700">{SERVICE_WECHAT}</span> 洽谈。
        </p>
      </div>
    </div>
  );
}
