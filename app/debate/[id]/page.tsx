import { readFile } from "fs/promises";
import { join } from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface DebateOutput {
  soul: string;
  topic: string;
  reasoning: string;
  response: string;
  timestamp: string;
}

export default async function DebatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const filepath = join(process.cwd(), "output", `${id}.json`);

  let debate: DebateOutput[] = [];
  try {
    const raw = await readFile(filepath, "utf-8");
    debate = JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to load debate file: ${id}`, error);
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>对战记录不存在</p>
        <Link href="/" style={{ color: "var(--text-primary)" }}>← 返回首页</Link>
      </main>
    );
  }

  const topic = debate[0]?.topic ?? "";

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <Link href="/" style={{ color: "var(--text-secondary)", fontSize: 13, textDecoration: "none" }}>
        ← 返回
      </Link>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "24px 0 8px" }}>
        {topic}
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "0 0 40px" }}>
        {new Date(debate[0]?.timestamp).toLocaleString("zh-CN")}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {debate.map((entry, i) => (
          <article key={i} style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 20px",
              background: "var(--bg-base)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--tag-bg)",
                border: "1px solid var(--tag-border)",
                color: "var(--tag-text)",
                fontWeight: 500,
              }}>
                {entry.soul}
              </span>
            </div>

            <div style={{ padding: "24px 24px", background: "var(--bg-base)", fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)" }}>
              <ReactMarkdown>{entry.response}</ReactMarkdown>
            </div>

            {entry.reasoning && (
              <details style={{ borderTop: "1px solid var(--border-muted)" }}>
                <summary style={{
                  padding: "10px 24px",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  background: "var(--bg-base)",
                }}>
                  查看推理过程
                </summary>
                <div style={{ padding: "16px 24px", background: "var(--bg-base)", fontSize: 13, lineHeight: 1.7, color: "var(--text-muted)" }}>
                  <ReactMarkdown>{entry.reasoning}</ReactMarkdown>
                </div>
              </details>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
