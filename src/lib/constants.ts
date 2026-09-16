import type { SubjectMeta } from "./types";

export const SITE_NAME = "注安师免费学习平台";
export const SITE_DESCRIPTION =
  "中级注册安全工程师学习平台，安全生产法律法规、安全生产管理、安全生产技术基础三科永久免费（27 章 / 443 题，含思维导图与易混点对比），专业实务 7 个专业方向按需解锁。";

// 规范化站点域名：
// 线上 Vercel 的环境变量历史上被设成了裸域 https://zhuanshi365.cn，
// 而裸域实际是 308 跳转到 www，若 canonical 用裸域会与真实访问 URL 不一致。
// 这里统一强制为 www 版本，避免 canonical / sitemap / JSON-LD 出现两种域名。
function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "https://www.zhuanshi365.cn";
  // 裸域 zhuanshi365.cn → www.zhuanshi365.cn
  return trimmed.replace(
    /^https?:\/\/zhuanshi365\.cn$/i,
    "https://www.zhuanshi365.cn"
  );
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.zhuanshi365.cn"
);

// 线索表单「手动复制」降级模式展示的微信/联系方式
// 通过 NEXT_PUBLIC_WECHAT_ID 配置；留空则不显示手动引导
export const WECHAT_ID = process.env.NEXT_PUBLIC_WECHAT_ID || "";

/**
 * 全部科目（含专业实务容器页）
 *
 * 说明：专业实务（case-study）是「7 个专业方向的容器」，
 * 它本身是一个方向选择页，不含章节内容。
 * 化工安全（chemical）是其中一个方向，也是目前唯一已上线的方向。
 */
export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "laws",
    title: "安全生产法律法规",
    shortTitle: "法律法规",
    description:
      "系统学习安全生产法律体系，掌握《安全生产法》等核心法律法规的考点与应试技巧。",
    icon: "Scale",
    order: 1,
    totalChapters: 7,
    color: "#2563EB",
  },
  {
    slug: "management",
    title: "安全生产管理",
    shortTitle: "安全管理",
    description:
      "掌握安全生产管理的基本理论、方法和制度，理解现代安全管理体系。",
    icon: "ClipboardList",
    order: 2,
    totalChapters: 8,
    color: "#7C3AED",
  },
  {
    slug: "technology",
    title: "安全生产技术基础",
    shortTitle: "技术基础",
    description:
      "学习机械、电气、防火防爆、特种设备等安全生产通用技术知识。",
    icon: "Wrench",
    order: 3,
    totalChapters: 5,
    color: "#059669",
  },
  {
    slug: "chemical",
    title: "化工安全",
    shortTitle: "化工安全",
    description:
      "化工安全专业实务：18 种重点监管危险化工工艺、化工运行与防火防爆、化学品储运、建设项目安全、事故应急与案例分析。",
    icon: "FlaskConical",
    order: 4,
    totalChapters: 7,
    color: "#DC2626",
  },
  {
    slug: "case-study",
    title: "安全生产专业实务",
    shortTitle: "专业实务",
    description:
      "含 7 个专业方向：化工安全、煤矿安全、金属非金属矿山安全、金属冶炼安全、建筑施工安全、道路运输安全、其他安全。",
    icon: "FileText",
    order: 5,
    totalChapters: 7,
    color: "#DC2626",
  },
];

/**
 * 有实际章节内容的科目（用于生成章节页 / 测验页 / 内容聚合页）
 *
 * 注意：case-study 是方向选择页，没有章节内容，必须排除，
 * 否则会生成 /case-study/bisai 等空页面。
 */
export const CONTENT_SUBJECTS: SubjectMeta[] = SUBJECTS.filter(
  (s) => s.slug !== "case-study"
);

/** 免费科目（永久免费，承担 SEO 流量池） */
export const FREE_SUBJECT_SLUGS = ["laws", "management", "technology"] as const;

/** 付费科目（专业实务方向） */
export const PAID_SUBJECT_SLUGS = ["chemical"] as const;

export const EXAM_INFO = {
  name: "中级注册安全工程师",
  subjects: 4,
  passRate: "10%-15%",
  examTime: "每年10月",
  totalScore: 100,
  passingScore: 60,
  // 2026年考试时间：10月25日、26日
  examYear: 2026,
  examMonth: 10,
  examDay: 25,
};

// 当前已完成的科目、章节、题目统计
export const SITE_STATS = {
  subjectsCompleted: 4, // 法规、管理、技术、化工安全
  subjectsTotal: 4,
  chaptersCompleted: 27, // 法规7 + 管理8 + 技术5 + 化工7
  chaptersTotal: 27,
  questionsTotal: 547, // 148 + 205 + 90 + 104
  mindmapsTotal: 27,
  compareTables: 37, // 法规15 + 管理13 + 技术16（含化工待补）
};
