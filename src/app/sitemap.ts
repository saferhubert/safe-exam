import type { MetadataRoute } from "next";
import { SUBJECTS, SITE_URL } from "@/lib/constants";
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

  // 每个科目（含专业实务方向选择页）
  for (const subject of SUBJECTS) {
    entries.push({
      url: `${baseUrl}/${subject.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // 专业实务容器页无内容子页，跳过
    if (subject.slug === "case-study") continue;

    // 每个章节
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
      if (!PAID_SUBJECTS.includes(subject.slug as any) && !isOutline) {
        entries.push({
          url: `${baseUrl}/${subject.slug}/${ch.slug}/quiz`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    // 内容聚合页
    entries.push({
      url: `${baseUrl}/${subject.slug}/bisai`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
    entries.push({
      url: `${baseUrl}/${subject.slug}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
    entries.push({
      url: `${baseUrl}/${subject.slug}/mindmaps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
