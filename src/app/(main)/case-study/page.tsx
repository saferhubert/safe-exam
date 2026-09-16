import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  Flame,
  Mountain,
  Factory,
  HardHat,
  Truck,
  Wrench,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getSubject, getChapters } from "@/lib/subjects";
import { MAJOR_DIRECTIONS } from "@/lib/majors";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/leads/LeadForm"), {
  ssr: false,
  loading: () => (
    <div className="mt-10 max-w-md mx-auto h-64 bg-warm-50/50 rounded-2xl animate-pulse" />
  ),
});

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: { subject: string };
}

const DIRECTION_ICONS: Record<string, typeof Flame> = {
  chemical: Flame,
  coal: Mountain,
  mine: Mountain,
  smelting: Factory,
  construction: HardHat,
  transport: Truck,
  other: Wrench,
};

export async function generateStaticParams() {
  return [{ subject: "case-study" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "安全生产专业实务 — 7 个专业方向",
    description:
      "中级注册安全工程师《安全生产专业实务》分 7 个专业方向：化工安全、煤矿安全、金属非金属矿山安全、金属冶炼安全、建筑施工安全、道路运输安全、其他安全。选择与自身工作相符的方向备考。",
    keywords: [
      "安全生产专业实务",
      "专业实务7个专业",
      "注安专业实务方向选择",
      "化工安全实务",
      "建筑施工安全实务",
    ],
    path: "/case-study",
  });
}

export default function CaseStudyPage({ params }: PageProps) {
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  return (
    <div>
      {/* 科目概览 */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-warm-100/70 p-6 sm:p-7 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-300/30 to-red-500/20 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              安全生产专业实务
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              《安全生产专业实务》是中级注册安全工程师的
              <span className="font-medium text-gray-700">专业科目</span>
              ，也是四科中唯一含主观案例题的科目。依据《注册安全工程师分类管理办法》，
              本科目划分为 <span className="font-medium text-red-600">7 个专业方向</span>
              ，考试时必须选择其中一个方向报考。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="danger">7 个专业方向</Badge>
              <Badge>含主观案例题</Badge>
              <Badge>满分 100 / 及格 60</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 重要提示 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 mb-8">
        <p className="text-sm text-amber-800 leading-relaxed">
          <span className="font-semibold">选择方向很重要：</span>
          专业实务的方向应当与你的
          <span className="font-medium">实际工作行业相符</span>
          （部分省份报考时要求提供工作单位证明）。选错方向等于白考，请务必对照下表确认。
        </p>
      </div>

      {/* 7 个专业方向 */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        7 个专业方向
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {MAJOR_DIRECTIONS.map((d) => {
          const Icon = DIRECTION_ICONS[d.slug] || Wrench;
          const inner = (
            <div
              className={`h-full bg-white rounded-2xl border p-5 transition-all group relative overflow-hidden ${
                d.available
                  ? "border-primary-200/70 hover:border-primary-300 hover:shadow-sm cursor-pointer"
                  : "border-warm-100/70 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    d.available ? "bg-red-50" : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${d.available ? "text-red-500" : "text-gray-400"}`}
                  />
                </div>
                {d.available ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> 已上线
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" /> 规划中
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-gray-800 text-sm mb-1.5">
                {d.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                {d.audience}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-400">
                  {d.available
                    ? `${d.chapters} 章 · ${d.questions} 题`
                    : d.note}
                </span>
                {d.available && (
                  <ArrowRight className="w-3.5 h-3.5 text-primary-400 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </div>
          );

          return d.available ? (
            <Link key={d.slug} href={`/${d.slug}`}>
              {inner}
            </Link>
          ) : (
            <div key={d.slug}>{inner}</div>
          );
        })}
      </div>

      {/* 免费科目入口 */}
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5 mb-10">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          还没开始公共科目？
        </h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          法规、管理、技术三科公共科目在本站
          <span className="font-medium text-green-700">永久免费</span>
          ，共 27 章 / 443 题，含思维导图与易混点对比表。建议先攻公共科目，
          再选专业方向。
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: "laws", label: "安全生产法律法规" },
            { slug: "management", label: "安全生产管理" },
            { slug: "technology", label: "安全生产技术基础" },
          ].map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-green-200 text-xs text-gray-700 hover:border-green-400 transition-colors"
            >
              {s.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* 线索收集 */}
      <div className="mt-10 max-w-md mx-auto">
        <LeadForm />
      </div>
    </div>
  );
}
