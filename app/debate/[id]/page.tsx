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
  } catch {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ color: "#888" }}>对战记录不存在</p>
        <Link href="/" style={{ color: "#fff" }}>← 返回首页</Link>
      </main>
    );
  }

  const topic = debate[0]?.topic ?? "";

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <Link href="/" style={{ color: "#666", fontSize: 13, textDecoration: "none" }}>
        ← 返回
      </Link>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "24px 0 8px" }}>
        {topic}
      </h1>
      <p style={{ color: "#555", fontSize: 12, margin: "0 0 40px" }}>
        {new Date(debate[0]?.timestamp).toLocaleString("zh-CN")}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {debate.map((entry, i) => (
          <article key={i} style={{
            border: "1px solid #222",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 20px",
              background: "#111",
              borderBottom: "1px solid #222",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 20,
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "#aaa",
                fontWeight: 500,
              }}>
                {entry.soul}
              </span>
            </div>

            <div style={{ padding: "24px 24px", background: "#0d0d0d", fontSize: 15, lineHeight: 1.8, color: "#ddd" }}>
              <ReactMarkdown>{entry.response}</ReactMarkdown>
            </div>

            {entry.reasoning && (
              <details style={{ borderTop: "1px solid #1a1a1a" }}>
                <summary style={{
                  padding: "10px 24px",
                  fontSize: 12,
                  color: "#555",
                  cursor: "pointer",
                  background: "#0a0a0a",
                }}>
                  查看推理过程
                </summary>
                <div style={{ padding: "16px 24px", background: "#0a0a0a", fontSize: 13, lineHeight: 1.7, color: "#555" }}>
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
