/**
 * - [INPUT]: 依赖 `next/navigation` 路由能力与 `window` 键盘事件
 * - [OUTPUT]: 导出 SearchLauncher 组件，提供伪输入框触发器、弹窗输入与 Tag 清除能力
 * - [POS]: app/components/ 的全局搜索入口组件，位于首页讨论区顶部并展示当前查询状态
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

interface SearchLauncherProps {
  initialQuery?: string;
}

export function SearchLauncher({ initialQuery = "" }: SearchLauncherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    modalInputRef.current?.focus();
    modalInputRef.current?.select();
  }, [open]);

  function submitSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
    setDraft("");
  }

  function clearTag() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
  }

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "4px 6px",
          background: "var(--bg-surface)",
          width: 168,
          cursor: "pointer",
        }}
      >
        {initialQuery ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              maxWidth: 104,
              gap: 6,
              padding: "2px 8px",
              border: "1px solid var(--tag-border)",
              borderRadius: 999,
              background: "var(--tag-bg)",
              color: "var(--tag-text)",
              fontSize: 12,
            }}
            title={initialQuery}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {initialQuery}
            </span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                clearTag();
              }}
              role="button"
              aria-label="清除搜索标签"
              style={{
                fontSize: 12,
                lineHeight: 1,
              }}
            >
              x
            </span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>搜索</span>
        )}
        <span
          style={{
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "0 6px",
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginLeft: "auto",
          }}
        >
          ⌘K
        </span>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="ok-dialog-overlay" />
          <Dialog.Content
            className="ok-dialog-content ok-search-dialog"
            style={{ width: "min(520px, calc(100vw - 16px))" }}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                submitSearch(draft);
                setOpen(false);
              }}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                ref={modalInputRef}
                className="modal-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={initialQuery ? `当前：${initialQuery}` : "搜索话题、人格或正文..."}
                style={{ marginBottom: 0, padding: "10px 4px", fontSize: 14 }}
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0 14px",
                  background: "var(--bg-surface)",
                  color: draft.trim() ? "var(--text-primary)" : "var(--text-muted)",
                  cursor: draft.trim() ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap",
                }}
              >
                搜索
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
