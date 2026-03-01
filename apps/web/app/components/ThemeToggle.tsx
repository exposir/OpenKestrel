// [INPUT]: 依赖浏览器 localStorage / documentElement / window keydown 事件
// [OUTPUT]: ThemeToggle — 三态主题切换按钮（system / light / dark），支持 Cmd/Ctrl + D 在 light/dark 间切换
// [POS]: app/ 的全局 UI 层，Client Component
// [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md

"use client";

import { useState, useEffect, type ReactNode } from "react";

type Theme = "system" | "light" | "dark";

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

  function applyTheme(next: Theme) {
    if (next === "system") {
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("data-theme");
      return;
    }
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  function cycle() {
    setTheme((current) => {
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
      applyTheme(next);
      return next;
    });
  }

  function toggleLightDarkByShortcut() {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d";
      if (!isShortcut) return;
      event.preventDefault();
      toggleLightDarkByShortcut();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      onClick={cycle}
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
