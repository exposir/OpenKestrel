/**
 * - [INPUT]: 依赖 ModalEngine、浏览器键盘事件与 `@openkestrel/theme-motion/core`
 * - [OUTPUT]: 导出 GlobalHotkeys 组件，提供全局快捷键分发（Cmd/Ctrl+K、Cmd/Ctrl+D、?、Esc）
 * - [POS]: app/components/ 的全局热键中枢，挂载于 layout 覆盖全部页面
 * - [PROTOCOL]: 快捷键映射变更须同步 HotkeyHelpDialog.tsx 与 app/CLAUDE.md
 */
"use client";

import { useEffect } from "react";
import { toggleLightDarkWithMotion } from "@openkestrel/theme-motion/core";
import { useModalEngine } from "./modal-engine/useModalEngine";

export function GlobalHotkeys() {
  const { open, close } = useModalEngine();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isThemeShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d";

      if (isSearchShortcut) {
        event.preventDefault();
        open("search", "shortcut");
        return;
      }
      if (isThemeShortcut) {
        event.preventDefault();
        toggleLightDarkWithMotion();
        return;
      }
      if (event.key === "Escape") {
        close();
        return;
      }
      if (isTypingTarget) return;
      if (event.key === "?") {
        event.preventDefault();
        open("hotkey-help", "shortcut");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return null;
}
