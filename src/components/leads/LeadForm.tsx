"use client";

import { useState, FormEvent } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Copy,
  Check,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { submitLead, getLeadChannel, formatLeadText } from "@/lib/supabase";
import { SUBJECTS, WECHAT_ID } from "@/lib/constants";

/**
 * 线索获取组件
 *
 * 设计原则（依据转化率实测经验）：
 * 1. 微信号放在最显眼位置（加微信转化率 10-20%，填表仅 2-5%）
 * 2. 表单可折叠，默认收起 —— 不想加微信的人再填表
 * 3. 字段精简到 2 个（称呼 + 联系方式），不索取手机号（降低警惕）
 * 4. 价值交换明确：加微信领《考点速记手册》+ 案例答题模板
 */
export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    subject: "laws",
    intent: "",
    note: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [manualText, setManualText] = useState("");
  const [copied, setCopied] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时用户可手动选中 */
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.contact.trim()) {
      setErrorMsg("请填写你的微信号或手机号");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const lead = {
      name: form.name.trim() || "未留称呼",
      contact: form.contact.trim(),
      subject: form.subject,
      intent: form.intent || "self_study",
      note: form.note.trim(),
    };

    const subjectLabel = SUBJECTS.find((s) => s.slug === form.subject)?.title;
    const result = await submitLead(lead, subjectLabel);

    if (result.success) {
      setStatus("success");
      setForm({ name: "", contact: "", subject: "laws", intent: "", note: "" });
    } else if (result.channel === "manual") {
      // 未配置后端：降级为「复制后发微信」，保证线索不丢
      setManualText(formatLeadText(lead, subjectLabel));
      setStatus("success");
      setForm({ name: "", contact: "", subject: "laws", intent: "", note: "" });
    } else {
      setStatus("error");
      setErrorMsg(result.error || "提交失败，请稍后重试");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manualText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时，提示用户手动选中复制 */
    }
  };

  // ===== 提交成功态 =====
  if (status === "success") {
    if (manualText) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              再走最后一步就完成啦
            </h3>
            <p className="text-sm text-green-700">
              请复制下方信息，发送给备考助手微信，即可领取资料包。
            </p>
          </div>
          <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-white border border-green-200 rounded-lg p-4 mb-3 font-sans">
            {manualText}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> 已复制，请粘贴发送
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> 一键复制信息
              </>
            )}
          </button>
          {WECHAT_ID && (
            <p className="text-xs text-green-700 text-center mt-3">
              备考助手微信：
              <span className="font-semibold">{WECHAT_ID}</span>
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">提交成功！</h3>
        <p className="text-sm text-green-600 mb-3">
          我们会尽快与你联系，送上免费备考资料。
        </p>
        {WECHAT_ID && (
          <p className="text-xs text-green-700">
            想更快拿到资料？直接加微信：
            <span className="font-semibold">{WECHAT_ID}</span>
          </p>
        )}
      </div>
    );
  }

  // ===== 默认态 =====
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 头部：价值交换 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-white shrink-0" />
          <div>
            <h3 className="font-semibold text-white text-sm">
              免费领取备考资料包
            </h3>
            <p className="text-primary-200 text-xs">
              《考点速记手册》+《案例答题模板》+ 高频考点清单
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 主推：加微信（转化率最高的方式） */}
        {WECHAT_ID ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-green-50 mb-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-700 mb-1">
              加备考助手微信，直接领取资料
            </p>
            <button
              type="button"
              onClick={copyWechat}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all shadow-sm"
            >
              {wechatCopied ? (
                <>
                  <Check className="w-4 h-4" /> 已复制微信号
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {WECHAT_ID}
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-400 mt-2.5">
              点击复制 → 打开微信 → 添加好友 → 备注「注安」即刻通过
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              填写下方信息，我们主动联系你
            </p>
          </div>
        )}

        {/* 次选：填表（折叠） */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors py-1.5"
            >
              不方便加微信？留下联系方式，我们联系你
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    怎么称呼（选填）
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="如：王工"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    微信号或手机号 <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    placeholder="方便联系到你即可"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  你准备考哪个科目
                </label>
                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {status === "error" && errorMsg && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                <Send className="w-4 h-4" />
                {status === "submitting" ? "提交中…" : "提交"}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                我们仅用于发送备考资料，不会打扰你
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
