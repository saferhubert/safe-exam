import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "./constants";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
}

export function buildMetadata({
  title,
  description,
  keywords,
  path,
}: SeoProps): Metadata {
  // 若调用方已自带站点名后缀，则不再重复拼接（避免 "... | 注安师免费学习平台 | 注安师免费学习平台"）
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "zh_CN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function defaultMetadata(): Metadata {
  return {
    title: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "zh_CN",
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}
