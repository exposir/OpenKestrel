import type { Metadata } from "next";

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
    <html lang="zh">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#e5e5e5", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
