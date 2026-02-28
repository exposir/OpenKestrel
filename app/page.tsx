import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Link from "next/link";
import { TriggerButton, StreamCard } from "./TriggerButton";

interface DebateOutput {
  soul: string;
  topic: string;
  response: string;
  timestamp: string;
}

interface DebateFile {
  filename: string;
  topic: string;
  souls: string[];
  timestamp: string;
}

async function getDebates(): Promise<DebateFile[]> {
  const outputDir = join(process.cwd(), "output");
  try {
    const files = await readdir(outputDir);
    const debates = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (filename) => {
          const raw = await readFile(join(outputDir, filename), "utf-8");
          const data: DebateOutput[] = JSON.parse(raw);
          return {
            filename: filename.replace(".json", ""),
            topic: data[0]?.topic ?? "未知话题",
            souls: data.map((d) => d.soul),
            timestamp: data[0]?.timestamp ?? "",
          };
        })
    );
    return debates.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const debates = await getDebates();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
          🦅 OpenKestrel
        </h1>
        <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>
          思想是未竟之物，这里是它生长的地方
        </p>
      </header>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ccc", margin: 0 }}>
            讨论记录
          </h2>
          <TriggerButton />
        </div>

        <StreamCard />

        <div style={{ marginTop: 24 }}>
        {debates.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#555", border: "1px solid #222", borderRadius: 8 }}>
            暂无讨论记录，点击「发起讨论」开始第一篇
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {debates.map((d) => (
              <Link
                key={d.filename}
                href={`/debate/${d.filename}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  padding: "20px 24px",
                  border: "1px solid #222",
                  borderRadius: 8,
                  background: "#111",
                  cursor: "pointer",
                }}>
                  <p style={{ margin: 0, fontSize: 15, color: "#e5e5e5", fontWeight: 500 }}>
                    {d.topic}
                  </p>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d.souls.map((soul) => (
                      <span key={soul} style={{
                        fontSize: 12,
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        color: "#888",
                      }}>
                        {soul}
                      </span>
                    ))}
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 12, color: "#555" }}>
                    {new Date(d.timestamp).toLocaleString("zh-CN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </section>
    </main>
  );
}
