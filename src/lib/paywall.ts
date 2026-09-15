/**
 * 付费解锁配置
 *
 * 定价策略（依据《专业实务付费方案》）：
 * - 三科公共科目（法规/管理/技术）永久免费 → SEO 流量池
 * - 专业实务按方向解锁 → 变现
 * - ¥9.9 单方向 = 引流钩子价
 * - ¥39.9 全科实务包 = 主推成交档
 * - 企业团报 = 利润主线（安全员是企业强制配置岗位）
 *
 * 防白嫖核心思路：物理隔离
 * - 免费层：每章前 N 节全文免费（SEO 收录 + 转化）
 * - 付费层：深度考点 + 全部题库（不指望收录，加 noindex）
 */

/** 免费试读的节数（每章前 N 节） */
export const FREE_SECTIONS_PER_CHAPTER = 2;

/** 付费/免费科目划分 */
export const FREE_SUBJECTS = ["laws", "management", "technology"] as const;
export const PAID_SUBJECTS = ["chemical"] as const;

export type PlanId = "single" | "bundle" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  originalLabel?: string;
  badge?: string;
  highlight: boolean;
  features: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    id: "single",
    name: "单方向解锁",
    price: 9.9,
    priceLabel: "¥9.9",
    badge: "低门槛",
    highlight: false,
    features: [
      "该方向全部章节深度考点详解",
      "该方向全部章节练习题库（含解析）",
      "《考点速记手册》PDF（20-30页，可打印）",
      "《案例答题模板》PDF（主观题万能框架）",
    ],
    cta: "解锁单个方向",
  },
  {
    id: "bundle",
    name: "全科实务包",
    price: 39.9,
    priceLabel: "¥39.9",
    originalLabel: "原价 ¥69.3",
    badge: "最划算 · 推荐",
    highlight: true,
    features: [
      "7 个专业方向全部解锁",
      "全部方向章节题库（含解析）",
      "7 份《考点速记手册》PDF",
      "《案例答题模板》PDF",
      "后续新增内容免费更新",
    ],
    cta: "解锁全部 7 个方向",
  },
  {
    id: "enterprise",
    name: "企业团报",
    price: 0,
    priceLabel: "面谈",
    badge: "10人以上",
    highlight: false,
    features: [
      "10 人以上账号批量开通",
      "企业内部培训资料定制",
      "专属答疑支持",
      "开具正规发票",
    ],
    cta: "联系企业团报",
  },
];

/** 解锁状态存储键 */
export const UNLOCK_STORAGE_KEY = "safe-exam-unlocked";

/** 单方向解锁码（方案 A 静态兑换码，兜底用；正式走微信人工发码） */
export const UNLOCK_CODES: Record<string, string[]> = {
  chemical: ["HUAGONG2026", "HG2026VIP"],
};

/** 全科解锁码 */
export const BUNDLE_CODES = ["ZHUANSHI365", "ALLACCESS2026"];

/** 客服微信（付款后联系发码） */
export const SERVICE_WECHAT = "keepmoving424";

/**
 * 判断某章节的某节是否免费
 *
 * 规则：前 2 节免费；但**每章至少保留 1 节付费**，
 * 避免只有 2 节的章节（如化工第 5、7 章）整体免费。
 *
 * @param subjectSlug 科目 slug
 * @param sectionIndex 节序号（0-based）
 * @param totalSections 该章总节数（可选，用于保证留付费节）
 */
export function isSectionFree(
  subjectSlug: string,
  sectionIndex: number,
  totalSections?: number
): boolean {
  if ((FREE_SUBJECTS as readonly string[]).includes(subjectSlug)) return true;
  let freeCount = FREE_SECTIONS_PER_CHAPTER;
  if (typeof totalSections === "number" && totalSections > 0) {
    // 每章至少留 1 节付费
    freeCount = Math.max(0, Math.min(freeCount, totalSections - 1));
  }
  return sectionIndex < freeCount;
}

/** 判断整个科目是否免费 */
export function isSubjectFree(subjectSlug: string): boolean {
  return (FREE_SUBJECTS as readonly string[]).includes(subjectSlug);
}

/** 判断整个科目是否付费 */
export function isSubjectPaid(subjectSlug: string): boolean {
  return (PAID_SUBJECTS as readonly string[]).includes(subjectSlug);
}
