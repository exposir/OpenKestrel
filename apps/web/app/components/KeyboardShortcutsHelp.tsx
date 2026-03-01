/**
 * - [INPUT]: 依赖 `window` 键盘事件与 `modal-*` 全局样式
 * - [OUTPUT]: 导出 KeyboardShortcutsHelp 组件，提供 `?` 打开快捷键列表弹窗
 * - [POS]: app/components/ 的快捷键帮助入口，统一展示全局快捷键约定
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  function openModal() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosing(false);
    setOpen(true);
  }

  function closeModal() {
    if (closeTimerRef.current) return;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closeTimerRef.current = null;
    }, 180);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (isTypingTarget) return;
      if (event.key !== "?") return;
      event.preventDefault();
      openModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {open ? (
        <div
          className={`modal-overlay${closing ? " closing" : ""}`}
          onClick={closeModal}
        >
          <div
            className={`modal-content${closing ? " closing" : ""}`}
            onClick={(event) => event.stopPropagation()}
            style={{ width: "min(520px, calc(100vw - 40px))", padding: 20 }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              快捷键
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ShortcutRow keys="⌘/Ctrl + K" desc="打开搜索弹窗" />
              <ShortcutRow keys="⌘/Ctrl + D" desc="浅色/深色切换" />
              <ShortcutRow keys="?" desc="打开快捷键列表" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ShortcutRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "10px 12px",
        background: "var(--bg-base)",
      }}
    >
      <span style={{ color: "var(--text-primary)", fontSize: 13 }}>{desc}</span>
      <span
        style={{
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "2px 8px",
          color: "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {keys}
      </span>
    </div>
  );
}
