import type { Metadata } from "next";
import "./globals.css";
import { GlobalHotkeys } from "./components/GlobalHotkeys";

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
        <GlobalHotkeys />
        {children}
      </body>
    </html>
  );
}
