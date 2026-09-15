import Link from "next/link";
import {
  Scale,
  ClipboardList,
  Wrench,
  FileText,
  FlaskConical,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { SUBJECTS } from "@/lib/constants";
import Badge from "../ui/Badge";

const iconMap: Record<string, typeof Scale> = {
  Scale,
  ClipboardList,
  Wrench,
  FileText,
  FlaskConical,
};

/** 已上线科目（有完整内容） */
const LIVE_SUBJECTS = ["laws", "management", "technology", "chemical"];
/** 付费科目（专业实务方向） */
const PAID_SUBJECTS = ["chemical"];

export default function SubjectCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          四大考试科目
        </h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          法规、管理、技术三科<span className="text-emerald-600 font-medium">永久免费</span>，专业实务方向按需解锁
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SUBJECTS.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const isActive = LIVE_SUBJECTS.includes(subject.slug);
          const isPaid = PAID_SUBJECTS.includes(subject.slug);

          return (
            <Link key={subject.slug} href={`/${subject.slug}`}>
              <div className="bg-white rounded-2xl border border-warm-100/70 p-5 h-full hover:border-primary-100/50 hover:shadow-sm transition-all group relative overflow-hidden">
                {/* 顶部色条 */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                  style={{ backgroundColor: subject.color }}
                />

                <div className="flex flex-col gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}12` }}
                  >
                    <Icon
                      className="w-4.5 h-4.5"
                      style={{ color: subject.color }}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {subject.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {subject.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={!isActive ? "default" : isPaid ? "warning" : "success"}
                      >
                        {!isActive ? "即将上线" : isPaid ? "免费试读" : "已上线"}
                      </Badge>
                      <span className="text-[11px] text-gray-400">
                        {subject.totalChapters} 章
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-400 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

