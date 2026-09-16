import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import MaterialViewer from "./MaterialViewer";

interface Props {
  params: { slug: string };
}

const MATERIALS: Record<string, { title: string; desc: string; keywords: string[] }> = {
  "speed-review": {
    title: "化工安全考点速记手册",
    desc: "35 项必背数字速查表 + 82 个核心考点速记（按 7 章编排）。A4 可打印，考前反复看。",
    keywords: ["化工安全速记手册", "注安化工必背数字", "化工安全考点总结"],
  },
  "case-templates": {
    title: "案例答题模板",
    desc: "主观题万能框架：五类高频题型的标准答题结构，含重大危险源计算式与法规术语清单。",
    keywords: ["注安案例答题模板", "实务主观题答题技巧", "重大危险源辨识计算"],
  },
};

/** 静态导出：为每个资料生成一个页面 */
export async function generateStaticParams() {
  return Object.keys(MATERIALS).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = MATERIALS[params.slug];
  if (!m) return {};
  return {
    ...buildMetadata({
      title: `${m.title} — 化工安全备考专属资料`,
      description: m.desc,
      keywords: m.keywords,
      path: `/chemical/materials/${params.slug}`,
    }),
    // 付费资料页不收录（避免半截内容进索引）
    robots: { index: false, follow: false },
  };
}

/** 读取生成的 HTML 正文（只取 <body> 内内容） */
function loadBody(slug: string): string {
  const file = join(
    process.cwd(),
    "src",
    "content",
    "chemical",
    "materials",
    slug === "speed-review"
      ? "chemical-speed-review.html"
      : "case-answer-templates.html"
  );
  if (!existsSync(file)) return "<p>资料生成中…</p>";
  const html = readFileSync(file, "utf-8");
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : html;
}

/** 读取原始 CSS（把 @page 等打印样式内联进页面） */
function loadCss(slug: string): string {
  const file = join(
    process.cwd(),
    "src",
    "content",
    "chemical",
    "materials",
    slug === "speed-review"
      ? "chemical-speed-review.html"
      : "case-answer-templates.html"
  );
  if (!existsSync(file)) return "";
  const html = readFileSync(file, "utf-8");
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : "";
}

export default function MaterialPage({ params }: Props) {
  const m = MATERIALS[params.slug];
  if (!m) return <p>资料未找到</p>;
  const body = loadBody(params.slug);
  const css = loadCss(params.slug);
  return <MaterialViewer title={m.title} html={body} css={css} />;
}
