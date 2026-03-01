/**
 * - [INPUT]: 依赖浏览器 `localStorage`、`matchMedia`、`document.startViewTransition`
 * - [OUTPUT]: 导出主题类型、即时切换、带动画切换与快捷切换方法
 * - [POS]: theme-motion 库 core 层，提供无框架绑定的主题切换内核
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

export type Theme = "system" | "light" | "dark";

export type ThemeOrigin = { x: number; y: number };

export type ThemeStorageConfig = {
  storageKey?: string;
  attributeName?: string;
};

export type ThemeMotionConfig = ThemeStorageConfig & {
  origin?: ThemeOrigin;
  respectReducedMotion?: boolean;
};

type ViewTransitionHandle = { finished: Promise<void> };

type StartViewTransition = (updateCallback: () => void) => ViewTransitionHandle;

const DEFAULT_STORAGE_KEY = "theme";
const DEFAULT_ATTRIBUTE_NAME = "data-theme";

function resolveStorageKey(config?: ThemeStorageConfig): string {
  return config?.storageKey ?? DEFAULT_STORAGE_KEY;
}

function resolveAttributeName(config?: ThemeStorageConfig): string {
  return config?.attributeName ?? DEFAULT_ATTRIBUTE_NAME;
}

function canUseDom(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function setTransitionOrigin(origin?: ThemeOrigin): void {
  const html = document.documentElement;
  const fallbackOrigin = { x: window.innerWidth - 20, y: 20 };
  const resolvedOrigin = origin ?? fallbackOrigin;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const farthestDistance = Math.max(
    Math.hypot(resolvedOrigin.x, resolvedOrigin.y),
    Math.hypot(viewportWidth - resolvedOrigin.x, resolvedOrigin.y),
    Math.hypot(resolvedOrigin.x, viewportHeight - resolvedOrigin.y),
    Math.hypot(viewportWidth - resolvedOrigin.x, viewportHeight - resolvedOrigin.y),
  );
  const revealRadius = Math.ceil(farthestDistance + 2);

  html.style.setProperty("--ok-theme-transition-x", `${resolvedOrigin.x}px`);
  html.style.setProperty("--ok-theme-transition-y", `${resolvedOrigin.y}px`);
  html.style.setProperty("--ok-theme-transition-r", `${revealRadius}px`);
}

function clearTransitionOrigin(): void {
  const html = document.documentElement;
  html.style.removeProperty("--ok-theme-transition-x");
  html.style.removeProperty("--ok-theme-transition-y");
  html.style.removeProperty("--ok-theme-transition-r");
}

export function applyThemeInstant(next: Theme, config?: ThemeStorageConfig): void {
  if (!canUseDom()) return;

  const storageKey = resolveStorageKey(config);
  const attributeName = resolveAttributeName(config);

  if (next === "system") {
    localStorage.removeItem(storageKey);
    document.documentElement.removeAttribute(attributeName);
    return;
  }

  localStorage.setItem(storageKey, next);
  document.documentElement.setAttribute(attributeName, next);
}

export function readStoredTheme(config?: ThemeStorageConfig): Theme {
  if (!canUseDom()) return "system";

  const storageKey = resolveStorageKey(config);
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

export function setThemeWithMotion(next: Theme, config?: ThemeMotionConfig): void {
  if (!canUseDom()) return;

  const respectReducedMotion = config?.respectReducedMotion ?? true;
  if (respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyThemeInstant(next, config);
    return;
  }

  const docWithTransition = document as Document & { startViewTransition?: StartViewTransition };
  if (!docWithTransition.startViewTransition) {
    applyThemeInstant(next, config);
    return;
  }

  setTransitionOrigin(config?.origin);

  // bind document to avoid illegal invocation in strict runtimes
  const startTransition = docWithTransition.startViewTransition.bind(document);
  const transition = startTransition(() => {
    applyThemeInstant(next, config);
  });

  transition.finished.finally(() => {
    clearTransitionOrigin();
  });
}

export function toggleLightDarkWithMotion(config?: ThemeMotionConfig): Theme {
  const current = readStoredTheme(config);
  const next: Theme = current === "dark" ? "light" : "dark";
  setThemeWithMotion(next, config);
  return next;
}
