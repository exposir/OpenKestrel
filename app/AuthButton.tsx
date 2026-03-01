/**
 * - [INPUT]: 依赖 next-auth/react 的 signIn/signOut、/api/auth/providers 可用渠道，以及服务端传入的用户会话摘要
 * - [OUTPUT]: 导出 AuthButton 组件，提供登录/退出交互
 * - [POS]: app/ 的认证交互组件，位于首页头部
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export function AuthButton({ isAuthenticated, userName }: AuthButtonProps) {
  const [providerIds, setProviderIds] = useState<string[]>([]);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadProviders = async () => {
      try {
        const resp = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!resp.ok) return;
        const data = (await resp.json()) as Record<string, unknown>;
        if (!cancelled) {
          setProviderIds(Object.keys(data ?? {}));
        }
      } catch {
        // ignore provider discovery errors
      }
    };
    loadProviders();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasGithub = providerIds.includes("github");
  const hasGoogle = providerIds.includes("google");
  const hasCredentials = providerIds.includes("credentials");

  const handleLocalLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    setSubmitting(false);
    if (result?.error) {
      setError("本地账号或密码错误");
      return;
    }
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {hasGithub ? (
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
        ) : null}
        {hasGoogle ? (
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
        ) : null}
        {hasCredentials ? (
          <>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="本地账号"
              style={{
                width: 100,
                padding: "8px 10px",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="本地密码"
              style={{
                width: 100,
                padding: "8px 10px",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <button
              onClick={handleLocalLogin}
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
              {submitting ? "登录中..." : "本地登录"}
            </button>
          </>
        ) : null}
        {!hasGithub && !hasGoogle && !hasCredentials ? (
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>未配置可用登录方式</span>
        ) : null}
        {error ? <span style={{ fontSize: 12, color: "#d85b5b" }}>{error}</span> : null}
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
