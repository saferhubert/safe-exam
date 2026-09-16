import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import MaterialsClient from "./MaterialsClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "化工安全备考专属资料包 — 考点速记手册 + 案例答题模板",
    description:
      "中级注册安全工程师《化工安全》备考专属资料包：考点速记手册（35 项必背数字 + 82 个核心考点）+ 案例答题模板（五类高频题型万能框架）。A4 可打印，解锁后免费下载。",
    keywords: [
      "化工安全速记手册",
      "注安案例答题模板",
      "化工安全考点总结",
      "注安实务主观题答题技巧",
      "化工安全必背数字",
    ],
    path: "/chemical/materials",
  });
}

export default function MaterialsPage() {
  return <MaterialsClient />;
}
