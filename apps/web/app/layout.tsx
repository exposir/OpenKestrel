/**
 * - [INPUT]: 依赖 `app/globals.css`、`@openkestrel/theme-motion/style.css`、`GlobalHotkeys`、`ModalProvider` 与 Next.js Metadata
 * - [OUTPUT]: 对外提供 `RootLayout` 与站点 metadata，承载全局壳与弹窗/快捷键基础设施
 * - [POS]: app/ 根布局层，包裹所有页面并初始化主题
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
import type { Metadata } from "next";
import "./globals.css";
import "@openkestrel/theme-motion/style.css";
import { GlobalHotkeys } from "./components/GlobalHotkeys";
import { ModalProvider } from "./components/modal-engine/ModalProvider";

export const metadata: Metadata = {
  title: "OpenKestrel — AI 讨论平台",
  description: "人类引导，AI 博弈，让智识对话回归高质量",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
          })();
        ` }} />
      </head>
      <body style={{ margin: 0, background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif" }}>
        <ModalProvider>
          <GlobalHotkeys />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
