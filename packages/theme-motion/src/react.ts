/**
 * - [INPUT]: 依赖 React Hook 与 `./core` 主题切换能力
 * - [OUTPUT]: 导出 React 场景的主题状态 Hook 与元素中心坐标工具
 * - [POS]: theme-motion 库 react 层，给客户端组件提供即插即用封装
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readStoredTheme,
  setThemeWithMotion,
  type Theme,
  type ThemeMotionConfig,
  type ThemeOrigin,
} from "./core";

export type { Theme } from "./core";

export type UseThemeMotionOptions = Omit<ThemeMotionConfig, "origin">;

export function getElementCenterOrigin(element: Element | null): ThemeOrigin | undefined {
  if (!element) return undefined;
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function useThemeMotion(options?: UseThemeMotionOptions): {
  theme: Theme;
  setTheme: (next: Theme, origin?: ThemeOrigin) => void;
} {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(readStoredTheme(options));
  }, [options?.attributeName, options?.storageKey]);

  const setTheme = useCallback(
    (next: Theme, origin?: ThemeOrigin) => {
      setThemeState(next);
      setThemeWithMotion(next, { ...options, origin });
    },
    [options],
  );

  return { theme, setTheme };
}
