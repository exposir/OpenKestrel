/**
 * - [INPUT]: 依赖 app/globals.css 与 Next.js Metadata 能力
 * - [OUTPUT]: 对外提供 RootLayout 组件与后台站点元信息
 * - [POS]: apps/admin 的根布局，承载全局样式与页面壳
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenKestrel Admin",
  description: "OpenKestrel 审计与运营后台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
