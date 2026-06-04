"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    _hmt: any[];
  }
}

export default function BaiduAnalytics() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window._hmt) {
      window._hmt = [];
      const hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?d8015ff6d776cefc09d01bf7d33fc928";
      const s = document.getElementsByTagName("script")[0];
      s?.parentNode?.insertBefore(hm, s);
    }
  }, []);

  return null;
}
