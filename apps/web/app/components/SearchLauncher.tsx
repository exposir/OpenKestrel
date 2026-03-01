/**
 * - [INPUT]: 依赖 `next/navigation` 路由能力与 ModalEngine open("search")
 * - [OUTPUT]: 导出 SearchLauncher 组件，提供伪输入框触发与查询 Tag 清除
 * - [POS]: app/components/ 的搜索触发器，位于首页讨论区顶部，弹窗由统一引擎托管
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModalEngine } from "./modal-engine/useModalEngine";

interface SearchLauncherProps {
  initialQuery?: string;
}

export function SearchLauncher({ initialQuery = "" }: SearchLauncherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open } = useModalEngine();
  const [hovered, setHovered] = useState(false);

  function clearTag() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
  }

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => open("search", "button")}
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
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            clearTag();
          }}
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
            cursor: "pointer",
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
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              clearTag();
            }}
            role="button"
            aria-label="清除搜索标签"
            style={{ fontSize: 12, lineHeight: 1, cursor: "pointer" }}
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
          background: hovered ? "var(--bg-elevated)" : "transparent",
          transition: "background 0.15s ease-out",
        }}
      >
        ⌘K
      </span>
    </button>
  );
}
