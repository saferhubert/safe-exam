import type { MetadataRoute } from "next";
import {
  NAV_SUBJECTS,
  CONTENT_SUBJECTS,
  SITE_URL,
} from "@/lib/constants";
import { getChapters } from "@/lib/subjects";
import { PAID_SUBJECTS } from "@/lib/paywall";

export default function sitemap(): MetadataRoute.Sitemap {
  // 复用 constants 里已规范化为 www 的 SITE_URL，避免与 canonical 域名不一致
  const baseUrl = SITE_URL;
  const entries: MetadataRoute.Sitemap = [];

  // 首页
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  // 搜索页
  entries.push({
    url: `${baseUrl}/search`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  });

  // 解锁页（付费转化入口）
  entries.push({
    url: `${baseUrl}/unlock`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  });

  // 顶级导航科目（三科公共科目 + 专业实务容器）
  for (const subject of NAV_SUBJECTS) {
    entries.push({
      url: `${baseUrl}/${subject.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // 有内容的科目（含专业实务各方向）：章节 + 测验 + 聚合页
  for (const subject of CONTENT_SUBJECTS) {
    const isPaidSubject = PAID_SUBJECTS.includes(subject.slug as any);

    const chapters = getChapters(subject.slug);
    for (const ch of chapters) {
      // 免费框架页（承担 SEO 收录）优先级高
      const isOutline = ch.slug === "outline";
      entries.push({
        url: `${baseUrl}/${subject.slug}/${ch.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: isOutline ? 0.9 : 0.8,
      });

      // 章节测验（付费科目不加 sitemap，避免收录半截内容）
      if (!isPaidSubject && !isOutline) {
        entries.push({
          url: `${baseUrl}/${subject.slug}/${ch.slug}/quiz`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    // 内容聚合页
    for (const page of ["bisai", "compare", "mindmaps"]) {
      entries.push({
        url: `${baseUrl}/${subject.slug}/${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    // 备考专属资料包（付费科目）
    if (isPaidSubject) {
      entries.push({
        url: `${baseUrl}/${subject.slug}/materials`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
