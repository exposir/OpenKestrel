/**
 * - [INPUT]: 依赖浏览器 `localStorage`、`matchMedia`、`document.startViewTransition`
 * - [OUTPUT]: 导出主题类型与主题切换方法（含动画与快捷键切换）
 * - [POS]: app/components/ 的主题切换共享内核，供按钮与全局热键复用
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */

export type Theme = "system" | "light" | "dark";

type ViewTransitionHandle = {
  finished: Promise<void>;
};

type StartViewTransition = (updateCallback: () => void) => ViewTransitionHandle;

function applyThemeInstant(next: Theme): void {
  if (next === "system") {
    localStorage.removeItem("theme");
    document.documentElement.removeAttribute("data-theme");
    return;
  }
  localStorage.setItem("theme", next);
  document.documentElement.setAttribute("data-theme", next);
}

function setTransitionOrigin(origin?: { x: number; y: number }): void {
  const html = document.documentElement;
  const fallbackOrigin = { x: window.innerWidth - 20, y: 20 };
  const resolvedOrigin = origin ?? fallbackOrigin;
  html.style.setProperty("--ok-theme-transition-x", `${resolvedOrigin.x}px`);
  html.style.setProperty("--ok-theme-transition-y", `${resolvedOrigin.y}px`);
}

function clearTransitionOrigin(): void {
  const html = document.documentElement;
  html.style.removeProperty("--ok-theme-transition-x");
  html.style.removeProperty("--ok-theme-transition-y");
}

export function readStoredTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

export function setThemeWithMotion(next: Theme, origin?: { x: number; y: number }): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    applyThemeInstant(next);
    return;
  }

  const docWithTransition = document as Document & { startViewTransition?: StartViewTransition };
  if (!docWithTransition.startViewTransition) {
    applyThemeInstant(next);
    return;
  }

  setTransitionOrigin(origin);

  const transition = docWithTransition.startViewTransition(() => {
    applyThemeInstant(next);
  });

  transition.finished.finally(() => {
    clearTransitionOrigin();
  });
}

export function toggleLightDarkWithMotion(origin?: { x: number; y: number }): Theme {
  const current = localStorage.getItem("theme");
  const next: Theme = current === "dark" ? "light" : "dark";
  setThemeWithMotion(next, origin);
  return next;
}
