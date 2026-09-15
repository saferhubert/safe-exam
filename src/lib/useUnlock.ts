"use client";

import { useCallback, useEffect, useState } from "react";
import {
  UNLOCK_CODES,
  BUNDLE_CODES,
  UNLOCK_STORAGE_KEY,
  isSectionFree,
} from "@/lib/paywall";

interface UnlockState {
  /** 已解锁的方向列表 */
  subjects: string[];
  /** 是否解锁了全科 */
  bundle: boolean;
}

const EMPTY: UnlockState = { subjects: [], bundle: false };

function read(): UnlockState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(UNLOCK_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<UnlockState> | null;
    return {
      subjects: Array.isArray(parsed?.subjects) ? parsed.subjects : [],
      bundle: Boolean(parsed?.bundle),
    };
  } catch {
    return EMPTY;
  }
}

function write(state: UnlockState) {
  try {
    window.localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("safe-exam-unlock-change"));
  } catch {
    /* localStorage 不可用时静默降级 */
  }
}

/**
 * 解锁状态管理
 * 用于判断用户是否已付费解锁某专业方向
 */
export function useUnlock() {
  const [state, setState] = useState<UnlockState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const sync = () => setState(read());
    window.addEventListener("safe-exam-unlock-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("safe-exam-unlock-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** 校验并提交解锁码 */
  const redeem = useCallback(
    (code: string, subjectSlug?: string): { ok: boolean; msg: string } => {
      const c = code.trim().toUpperCase();
      if (!c) return { ok: false, msg: "请输入解锁码" };

      if (BUNDLE_CODES.includes(c)) {
        const next = { ...read(), bundle: true };
        write(next);
        setState(next);
        return { ok: true, msg: "全科实务包已解锁！" };
      }

      for (const [slug, codes] of Object.entries(UNLOCK_CODES)) {
        if (codes.includes(c)) {
          const cur = read();
          const subjects = Array.from(new Set([...cur.subjects, slug]));
          const next = { ...cur, subjects };
          write(next);
          setState(next);
          return { ok: true, msg: "该方向已解锁！" };
        }
      }
      return { ok: false, msg: "解锁码无效，请核对后重试" };
    },
    []
  );

  const reset = useCallback(() => {
    write(EMPTY);
    setState(EMPTY);
  }, []);

  /** 判断是否已解锁某方向 */
  const hasAccess = useCallback(
    (subjectSlug: string) =>
      state.bundle || state.subjects.includes(subjectSlug),
    [state]
  );

  return { ...state, hydrated, redeem, reset, hasAccess };
}

/**
 * 判断某节是否需要付费（客户端用，含已解锁状态）
 */
export function useSectionAccess(subjectSlug: string, sectionIndex: number) {
  const { hasAccess, hydrated } = useUnlock();
  const free = isSectionFree(subjectSlug, sectionIndex);
  return { locked: !free && !hasAccess(subjectSlug), free, hydrated };
}
