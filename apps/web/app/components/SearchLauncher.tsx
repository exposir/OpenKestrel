/**
 * - [INPUT]: 依赖 `next/navigation` 路由能力与 `window` 键盘事件
 * - [OUTPUT]: 导出 SearchLauncher 组件，提供常驻搜索框、`Cmd/Ctrl + K` 聚焦与清除能力
 * - [POS]: app/components/ 的全局搜索入口组件，位于首页讨论区顶部并承载查询状态
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchLauncherProps {
  initialQuery?: string;
}

export function SearchLauncher({ initialQuery = "" }: SearchLauncherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function submitSearch() {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
  }

  function clearSearch() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 8px",
            background: "var(--bg-surface)",
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索话题、人格或正文..."
            style={{
              width: 220,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 13,
            }}
          />
          <span
            style={{
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "0 6px",
              fontSize: 11,
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            ⌘K
          </span>
        </div>
        <button
          type="submit"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          搜索
        </button>
      </form>

      {initialQuery ? (
        <button
          type="button"
          onClick={clearSearch}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 10px",
            background: "var(--bg-base)",
            color: "var(--text-primary)",
            fontSize: 12,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
