import type { SubjectMeta } from "./types";

export const SITE_NAME = "注安师免费学习平台";
export const SITE_DESCRIPTION =
  "中级注册安全工程师免费学习平台，提供法律法规、安全管理、技术基础、专业实务等科目的学习笔记、思维导图、章节练习。100% 免费，助你高效通关。";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zhuanshi365.cn";

// 线索表单「手动复制」降级模式展示的微信/联系方式
// 通过 NEXT_PUBLIC_WECHAT_ID 配置；留空则不显示手动引导
export const WECHAT_ID = process.env.NEXT_PUBLIC_WECHAT_ID || "";

export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "laws",
    title: "安全生产法律法规",
    shortTitle: "法律法规",
    description:
      "系统学习安全生产法律体系，掌握《安全生产法》等核心法律法规的考点与应试技巧。",
    icon: "Scale",
    order: 1,
    totalChapters: 20,
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
    totalChapters: 15,
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
    totalChapters: 12,
    color: "#059669",
  },
  {
    slug: "case-study",
    title: "安全生产专业实务",
    shortTitle: "专业实务",
    description:
      "分专业方向深入学习安全生产实务知识，掌握案例分析答题技巧。",
    icon: "FileText",
    order: 4,
    totalChapters: 10,
    color: "#DC2626",
  },
];

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
  subjectsCompleted: 1,      // 法律法规已上线
  subjectsTotal: 4,
  chaptersCompleted: 7,
  chaptersTotal: 7,          // 只保留7章
  questionsTotal: 148,
  mindmapsTotal: 7,
  compareTables: 8,
};
