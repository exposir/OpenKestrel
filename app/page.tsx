/**
 * - [INPUT]: 依赖 `fs/promises` (文件搜索), `next/link` (路由), `react-markdown` (内容渲染), `src/orchestration/soul` (人格选项), `auth.ts` (登录态)
 * - [OUTPUT]: 对外提供 `HomePage` 异步组件
 * - [POS]: 业务主页入口，负责展示讨论列表与触发新讨论
 * - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { TriggerButton, StreamCard } from "./TriggerButton";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { SOULS } from "../src/orchestration/soul";
import { auth } from "../auth";

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
  excerpt: string;
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
            excerpt: data[0]?.response
              ? data[0].response.slice(0, 400) + "..."
              : "",
            timestamp: data[0]?.timestamp ?? "",
          };
        }),
    );
    return debates.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (error) {
    console.warn("Failed to read output directory:", error);
    return [];
  }
}

export default async function HomePage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  const debates = await getDebates();
  const soulOptions = SOULS.map((soul) => ({ id: soul.id, name: soul.name }));

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <header
        style={{
          marginBottom: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            🦅 OpenKestrel
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: 8,
              fontSize: 15,
            }}
          >
            思想是未竟之物，这里是它生长的地方
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AuthButton
            isAuthenticated={isAuthenticated}
            userName={session?.user?.name}
          />
          <ThemeToggle />
        </div>
      </header>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            讨论记录
          </h2>
          <TriggerButton
            soulOptions={soulOptions}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <StreamCard />

        <div style={{ marginTop: 24 }}>
          {debates.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            >
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
                  <div
                    style={{
                      padding: "20px 24px",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--bg-surface)",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {d.topic}
                    </p>
                    <div
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <span
                              style={{
                                fontWeight: 600,
                                display: "block",
                                marginBottom: 4,
                              }}
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <span
                              style={{
                                fontWeight: 600,
                                display: "block",
                                marginBottom: 4,
                              }}
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <span
                              style={{
                                fontWeight: 600,
                                display: "block",
                                marginBottom: 4,
                              }}
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <span style={{ display: "inline" }} {...props} />
                          ),
                        }}
                      >
                        {d.excerpt}
                      </ReactMarkdown>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {d.souls.map((soul) => (
                        <span
                          key={soul}
                          style={{
                            fontSize: 12,
                            padding: "2px 10px",
                            borderRadius: 20,
                            background: "var(--tag-bg)",
                            border: "1px solid var(--tag-border)",
                            color: "var(--tag-text)",
                          }}
                        >
                          {soul}
                        </span>
                      ))}
                    </div>
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
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
