/**
 * - [INPUT]: 依赖 app/globals.css 与 Next.js Metadata 能力
 * - [OUTPUT]: 对外提供 RootLayout 组件与后台站点元信息
 * - [POS]: apps/admin 的根布局，承载全局样式与页面壳
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getDataDir } from "../lib/audit";

export const metadata: Metadata = {
  title: "OpenKestrel Admin",
  description: "OpenKestrel 审计与运营后台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dataDir = getDataDir();
  return (
    <html lang="zh-CN">
      <body>
        <main
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 24px 56px",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-soft)",
                  fontSize: 12,
                  letterSpacing: 1,
                }}
              >
                OPENKESTREL CONSOLE
              </p>
              <h1 style={{ margin: "10px 0 0", fontSize: 30, fontWeight: 700 }}>
                运营后台
              </h1>
            </div>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-soft)",
                border: "1px solid var(--line)",
                borderRadius: 999,
                padding: "6px 10px",
                background: "var(--panel)",
              }}
            >
              共享目录：{dataDir}
            </span>
          </header>

          <nav
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              borderBottom: "1px solid var(--line)",
              paddingBottom: 16,
            }}
          >
            <Link
              href="/"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "var(--panel)",
                border: "1px solid var(--line)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Debates 最新讨论
            </Link>
            <Link
              href="/audits"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "var(--panel)",
                border: "1px solid var(--line)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Audits 系统审计
            </Link>
          </nav>

          {children}
        </main>
      </body>
    </html>
  );
}
