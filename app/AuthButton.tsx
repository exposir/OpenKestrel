/**
 * - [INPUT]: 依赖 next-auth/react 的 signIn/signOut，以及服务端传入的用户会话摘要
 * - [OUTPUT]: 导出 AuthButton 组件，提供登录/退出交互
 * - [POS]: app/ 的认证交互组件，位于首页头部
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export function AuthButton({ isAuthenticated, userName }: AuthButtonProps) {
  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => signIn("github")}
          style={{
            padding: "8px 12px",
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          GitHub 登录
        </button>
        <button
          onClick={() => signIn("google")}
          style={{
            padding: "8px 12px",
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Google 登录
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          maxWidth: 120,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {userName || "已登录"}
      </span>
      <button
        onClick={() => signOut()}
        style={{
          padding: "8px 12px",
          background: "transparent",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        退出
      </button>
    </div>
  );
}
