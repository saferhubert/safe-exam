import Link from "next/link";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面未找到 (404)",
  description: "您访问的页面不存在或已被移除，请返回首页继续学习注安师免费课程。",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          页面未找到
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          您访问的页面可能已被移除或不存在。请检查网址是否正确，或返回首页继续学习。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/laws"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            开始学习
          </Link>
        </div>
      </div>
    </div>
  );
}
