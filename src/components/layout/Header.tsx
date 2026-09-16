"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { NAV_SUBJECTS } from "@/lib/constants";
import { MAJOR_DIRECTIONS } from "@/lib/majors";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMajorOpen, setMobileMajorOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // 路由变化时关闭所有面板
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-warm-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all overflow-hidden">
              {/* 书本图标 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M4 6h16M4 12h16M4 18h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="2" y="3" width="20" height="18" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M2 6h20" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800 leading-tight tracking-tight">
                注安师学习
              </div>
              <div className="text-[11px] text-gray-400 leading-tight">
                免费 · 系统 · 高效
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5">
            {NAV_SUBJECTS.map((subject) => {
              const active = pathname.startsWith(`/${subject.slug}`);
              // 专业实务：带 7 个方向的下拉菜单
              const isCaseStudy = subject.slug === "case-study";

              if (!isCaseStudy) {
                return (
                  <Link
                    key={subject.slug}
                    href={`/${subject.slug}`}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-primary-50/80 text-primary-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-warm-50/60"
                    }`}
                  >
                    {subject.shortTitle}
                  </Link>
                );
              }

              // 专业实务下拉
              const open = openDropdown === subject.slug;
              // 任一方向页被访问时，父项也高亮
              const childActive = MAJOR_DIRECTIONS.some(
                (d) => pathname.startsWith(`/${d.slug}`) && d.slug !== "case-study"
              );
              return (
                <div key={subject.slug} className="relative">
                  <div className="flex items-center">
                    <Link
                      href={`/${subject.slug}`}
                      className={`pl-3.5 pr-1 py-2 rounded-l-lg text-sm font-medium transition-all ${
                        active || childActive
                          ? "bg-primary-50/80 text-primary-700 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-warm-50/60"
                      }`}
                    >
                      {subject.shortTitle}
                    </Link>
                    <button
                      onClick={() => setOpenDropdown(open ? null : subject.slug)}
                      aria-label="展开专业实务方向"
                      aria-expanded={open}
                      className={`pr-2 pl-0.5 py-2 rounded-r-lg text-sm transition-all ${
                        active || childActive
                          ? "bg-primary-50/80 text-primary-700 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-warm-50/60"
                      }`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {open && (
                    <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl border border-warm-100 shadow-lg p-2">
                      <div className="px-2.5 py-1.5 text-[11px] text-gray-400">
                        7 个专业方向
                      </div>
                      {MAJOR_DIRECTIONS.map((d) => (
                        <Link
                          key={d.slug}
                          href={`/${d.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                            d.available
                              ? "text-gray-700 hover:bg-primary-50/70 hover:text-primary-700"
                              : "text-gray-400 cursor-default"
                          }`}
                        >
                          <span className="flex-1 truncate">{d.title}</span>
                          {d.available ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                              已上线
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-300">
                              规划中
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/hotspots"
              className="hidden md:inline-flex text-xs text-gray-400 hover:text-primary-600 transition-colors px-2.5"
            >
              高频考点
            </Link>
            <Link
              href="/guide"
              className="hidden md:inline-flex text-xs text-gray-400 hover:text-primary-600 transition-colors px-2.5"
            >
              备考指南
            </Link>
            <Link
              href="/search"
              className="p-2.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50/60 transition-colors"
              aria-label="搜索"
            >
              <Search className="w-4.5 h-4.5" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-warm-50/60 transition-colors"
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-warm-100/60 py-3 pb-4">
            {NAV_SUBJECTS.map((subject) => {
              const active = pathname.startsWith(`/${subject.slug}`);
              const isCaseStudy = subject.slug === "case-study";

              if (!isCaseStudy) {
                return (
                  <Link
                    key={subject.slug}
                    href={`/${subject.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-primary-50/80 text-primary-700"
                        : "text-gray-500 hover:bg-warm-50/60"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-300" />
                    <div>{subject.title}</div>
                    <span className="ml-auto text-xs text-gray-300">
                      {subject.totalChapters}章
                    </span>
                  </Link>
                );
              }

              return (
                <div key={subject.slug}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      active ? "bg-primary-50/80 text-primary-700" : "text-gray-500"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-300" />
                    <Link
                      href={`/${subject.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1"
                    >
                      {subject.title}
                    </Link>
                    <button
                      onClick={() => setMobileMajorOpen(!mobileMajorOpen)}
                      aria-label="展开专业实务方向"
                      className="p-1"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileMajorOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {mobileMajorOpen && (
                    <div className="pl-6 pr-2 pb-1">
                      {MAJOR_DIRECTIONS.map((d) =>
                        d.available ? (
                          <Link
                            key={d.slug}
                            href={`/${d.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-warm-50/60"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            {d.title}
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                              已上线
                            </span>
                          </Link>
                        ) : (
                          <div
                            key={d.slug}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            {d.title}
                            <span className="ml-auto text-[10px] text-gray-300">
                              规划中
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
