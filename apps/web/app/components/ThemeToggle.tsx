// [INPUT]: 依赖 `themeTransition` 主题切换内核与浏览器按钮点击事件
// [OUTPUT]: ThemeToggle — 三态主题切换按钮（system / light / dark），支持从右上角扩散到全屏的主题切换动画
// [POS]: app/ 的全局 UI 层，Client Component
// [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md

"use client";

import { useState, useEffect, type MouseEvent, type ReactNode } from "react";
import { readStoredTheme, setThemeWithMotion, type Theme } from "./themeTransition";

const CYCLE: Theme[] = ["system", "light", "dark"];
const TITLE: Record<Theme, string> = { system: "Follow system", light: "Light mode", dark: "Dark mode" };

const ICONS: Record<Theme, ReactNode> = {
  system: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  light: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  dark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function cycle(event?: MouseEvent<HTMLButtonElement>) {
    const button = event?.currentTarget;
    const rect = button?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.right - rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
    setThemeWithMotion(next, origin);
  }

  return (
    <button
      onClick={(event) => cycle(event)}
      title={TITLE[theme]}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        padding: 0,
        background: "var(--bg-elevated)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {ICONS[theme]}
    </button>
  );
}
