import type { SubjectMeta } from "./types";

/** 专业实务的 7 个专业方向（中级注安师专业科目分类） */
export interface MajorDirection {
  /** 方向 slug（与内容目录对应） */
  slug: string;
  /** 方向名称 */
  title: string;
  /** 适用人群/行业描述 */
  audience: string;
  /** 是否已上线内容 */
  available: boolean;
  /** 备考数据 */
  chapters?: number;
  questions?: number;
  /** 一句话说明 */
  note: string;
}

/**
 * 7 个专业方向（依据《注册安全工程师分类管理办法》）
 *
 * 注：官方划分为煤矿安全、金属非金属矿山安全、化工安全、金属冶炼安全、
 * 建筑施工安全、道路运输安全、其他安全（不包括消防安全）共 7 类。
 */
export const MAJOR_DIRECTIONS: MajorDirection[] = [
  {
    slug: "chemical",
    title: "化工安全",
    audience: "石油化工、炼化、油品销售、危化品生产与仓储单位",
    available: true,
    chapters: 7,
    questions: 104,
    note: "已上线 · 7 章 31 节 · 含水 / 陆装卸油气回收等实操考点",
  },
  {
    slug: "coal",
    title: "煤矿安全",
    audience: "煤矿开采、洗选、煤化工企业",
    available: false,
    note: "规划中",
  },
  {
    slug: "mine",
    title: "金属非金属矿山安全",
    audience: "金属矿、非金属矿、采石场、尾矿库",
    available: false,
    note: "规划中",
  },
  {
    slug: "smelting",
    title: "金属冶炼安全",
    audience: "钢铁、有色冶金、铸造企业",
    available: false,
    note: "规划中",
  },
  {
    slug: "construction",
    title: "建筑施工安全",
    audience: "房建、市政、公路、水利施工企业",
    available: false,
    note: "规划中 · 报考人数最多的方向之一",
  },
  {
    slug: "transport",
    title: "道路运输安全",
    audience: "道路客货运输、危险货物运输、站场",
    available: false,
    note: "规划中",
  },
  {
    slug: "other",
    title: "其他安全",
    audience: "机械、轻工、纺织、烟草、商贸等行业（不含消防安全）",
    available: false,
    note: "规划中",
  },
];

/** 已上线的专业方向 */
export const AVAILABLE_DIRECTIONS = MAJOR_DIRECTIONS.filter((d) => d.available);
