import Link from "next/link";
import { Shield } from "lucide-react";
import { SUBJECTS, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              中级注册安全工程师学习平台。法规、管理、技术三科永久免费，
              专业实务方向按需解锁，助力每一位注安师考生高效通关。
            </p>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">考试科目</h4>
            <ul className="space-y-2">
              {SUBJECTS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/laws/compare"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  易混知识点对比
                </Link>
              </li>
              <li>
                <Link
                  href="/laws/mindmaps"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  思维导图
                </Link>
              </li>
              <li>
                <Link
                  href="/laws/bisai"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  免费视频课程
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  全站搜索
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. 内容仅供学习参考，请以官方教材和考试大纲为准。
          </p>
          <p className="text-xs text-gray-500">
            本站为非盈利性质的学习分享平台
          </p>
        </div>
      </div>
    </footer>
  );
}
