"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, BookOpen, Copy, Check } from "lucide-react";
import { submitLead, getLeadChannel, formatLeadText } from "@/lib/supabase";
import { SUBJECTS, WECHAT_ID } from "@/lib/constants";

const INTENT_OPTIONS = [
  { value: "self_study", label: "我只需要免费资料自学" },
  { value: "consider_course", label: "我在考虑是否报班" },
  { value: "want_course", label: "我想了解报班信息及价格" },
  { value: "enterprise", label: "企业团报咨询" },
];

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    subject: "laws",
    intent: "",
    note: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [manualText, setManualText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.contact.trim()) {
      setErrorMsg("请填写姓名和联系方式");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const lead = {
      name: form.name.trim(),
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
      // 未配置任何后端：降级为「复制后发微信」，保证线索不丢
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
      // 剪贴板不可用时，提示用户手动选中复制
    }
  };

  if (status === "success") {
    // 手动复制模式
    if (manualText) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">再走最后一步就完成啦</h3>
            <p className="text-sm text-green-700">
              请复制下方信息，发送给我们的备考助手微信，即可领取资料包。
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
          {WECHAT_ID ? (
            <p className="text-xs text-green-700 text-center mt-3">
              备考助手微信：<span className="font-semibold">{WECHAT_ID}</span>
            </p>
          ) : (
            <p className="text-xs text-green-600 text-center mt-3">
              复制后请发送给备考助手，我们会在 24 小时内回复。
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">提交成功！</h3>
        <p className="text-sm text-green-600">
          感谢你的登记。我们会尽快通过你留下的联系方式与你取得联系，送上免费备考资料。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-white" />
          <div>
            <h3 className="font-semibold text-white text-sm">免费领取备考资料</h3>
            <p className="text-primary-200 text-xs">
              留下联系方式，获取独家整理的高频考点、速记口诀、真题解析
            </p>
          </div>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="你的称呼"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-shadow"
            />
          </div>

          {/* 联系方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              微信/手机 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="微信号或手机号"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* 关注科目 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            你最关注的科目
          </label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none bg-white"
          >
            {SUBJECTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* 意向 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            你的学习需求
          </label>
          <div className="space-y-2">
            {INTENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  form.intent === opt.value
                    ? "border-primary-400 bg-primary-50"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="intent"
                  value={opt.value}
                  checked={form.intent === opt.value}
                  onChange={(e) => setForm({ ...form, intent: e.target.value })}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            备注（选填）
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="如有特殊需求或问题，请在此说明..."
            rows={2}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-shadow resize-none"
          />
        </div>

        {/* 错误提示 */}
        {status === "error" && errorMsg && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {status === "submitting" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              免费领取资料
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          你的信息仅用于发送备考资料和课程咨询，不会公开或转售给第三方。
        </p>
      </form>
    </div>
  );
}
