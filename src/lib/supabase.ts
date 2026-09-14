// 线索提交模块（多通道自动降级）
//
// 站点是静态导出（output: "export"），没有服务端，因此表单必须提交到外部服务。
// 支持三种通道，按优先级自动选择，全部通过环境变量配置：
//
//   1) NEXT_PUBLIC_LEAD_WEBHOOK   —— 任意「接收一个 JSON POST 的 URL」都行。
//      推荐用这个，最通用：
//        · 飞书 / 企业微信群机器人   （表单消息直接推到群里，最省事）
//        · Formspree (formspree.io) —— 免费 50 条/月，后台能看列表
//        · Vercel / Cloudflare Workers 自建接口
//      微信机器人会按 text 字段包装，见下方 buildPayload。
//
//   2) NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
//      —— Supabase REST 直写 leads 表（需要把 RLS 关闭并 GRANT anon insert）。
//
//   3) 都没有 —— 表单降级为「一键复制」模式：把填写内容排版好，
//      引导用户复制后发微信，保证线索永远不丢。
//
// 重要：不要再新增模块级的 createClient()，那会在构建期因为环境变量缺失而报错。

// 注意：不要在模块顶层把 process.env 读进常量。
// 顶层读取会让打包器把「值为空」的分支直接当成死代码摇掉（tree-shaking），
// 导致以后即使配好了 Webhook，线上也永远走降级模式。
// 因此这里统一用函数在「调用时」读取。
function getWebhook(): string {
  return process.env.NEXT_PUBLIC_LEAD_WEBHOOK || "";
}
function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}
function getSupabaseKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export interface Lead {
  name: string;
  contact: string;
  subject: string;
  intent: string;
  note: string;
}

export type LeadChannel = "webhook" | "supabase" | "manual";

/** 当前可用的提交通道，"manual" 表示只能手动复制 */
export function getLeadChannel(): LeadChannel {
  if (getWebhook()) return "webhook";
  if (getSupabaseUrl() && getSupabaseKey()) return "supabase";
  return "manual";
}

/** 把线索排版成一段适合微信/群消息发送的纯文本 */
export function formatLeadText(lead: Lead, subjectLabel?: string): string {
  const lines = [
    "【注安师备考资料领取】",
    `姓名：${lead.name}`,
    `联系方式：${lead.contact}`,
    `关注科目：${subjectLabel || lead.subject}`,
    `学习需求：${lead.intent || "未选择"}`,
  ];
  if (lead.note) lines.push(`备注：${lead.note}`);
  return lines.join("\n");
}

/**
 * 飞书群机器人要求 {"msg_type":"text","content":{"text":"..."}}；
 * 企业微信机器人要求 {"msgtype":"text","text":{"content":"..."}}。
 * 其余服务（Formspree 等）用扁平 JSON。这里做兼容包装。
 */
function buildPayload(lead: Lead, subjectLabel?: string): unknown {
  const WEBHOOK = getWebhook();
  const text = formatLeadText(lead, subjectLabel);
  const flat = {
    name: lead.name,
    contact: lead.contact,
    subject: lead.subject,
    intent: lead.intent,
    note: lead.note,
    text,
    _subject: "zhuanshi365 线索",
  };

  if (WEBHOOK.includes("open.feishu.cn")) {
    return { msg_type: "text", content: { text } };
  }
  if (WEBHOOK.includes("qyapi.weixin.qq.com")) {
    return { msgtype: "text", text: { content: text } };
  }
  return flat;
}

export async function submitLead(
  lead: Lead,
  subjectLabel?: string
): Promise<{ success: boolean; channel: LeadChannel; error?: string }> {
  const channel = getLeadChannel();

  // 通道 1：通用 Webhook / 群机器人
  if (channel === "webhook") {
    try {
      const WEBHOOK = getWebhook();
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(lead, subjectLabel)),
      });
      if (!res.ok) {
        return { success: false, channel, error: `提交失败 (${res.status})` };
      }
      return { success: true, channel };
    } catch (err: any) {
      return { success: false, channel, error: err?.message || "网络异常，请稍后重试" };
    }
  }

  // 通道 2：Supabase REST 直写
  if (channel === "supabase") {
    try {
      const SUPABASE_URL = getSupabaseUrl();
      const SUPABASE_KEY = getSupabaseKey();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: lead.name,
          contact: lead.contact,
          subject: lead.subject,
          intent: lead.intent,
          note: lead.note,
        }),
      });
      if (!res.ok) {
        return { success: false, channel, error: `提交失败 (${res.status})` };
      }
      return { success: true, channel };
    } catch (err: any) {
      return { success: false, channel, error: err?.message || "网络异常，请稍后重试" };
    }
  }

  // 通道 3：手动复制
  return { success: false, channel: "manual" };
}
