/**
 * - [INPUT]: 依赖 `next/link` (路由), `react-markdown` (内容渲染), `app/components/search/SearchLauncher` (搜索触发器), `app/components/trigger/TriggerButton` (发帖触发器), `src/storage/adapter` (存储适配器), `auth.ts` (登录态)
 * - [OUTPUT]: 对外提供 `HomePage` 异步组件
 * - [POS]: 业务主页入口，负责展示讨论列表与触发新讨论
 * - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { TriggerButton, StreamCard } from "./components/trigger/TriggerButton";
import { ThemeToggle } from "./components/theme/ThemeToggle";
import { AuthButton } from "./components/auth/AuthButton";
import { SearchLauncher } from "./components/search/SearchLauncher";
import { auth } from "../src/auth/auth";
import { listDebateFiles, readDebateFile } from "../src/storage/adapter";

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

async function getDebates(query?: string): Promise<DebateFile[]> {
  try {
    const files = await listDebateFiles();
    const normalizedQuery = query?.trim().toLowerCase() ?? "";
    const debates = await Promise.all(
      files.map(async (filename) => {
        const data = await readDebateFile(filename.replace(".json", ""));
        if (normalizedQuery) {
          const searchable = [
            data[0]?.topic ?? "",
            ...data.map((d) => d.soul),
            ...data.map((d) => d.response),
          ]
            .join("\n")
            .toLowerCase();
          if (!searchable.includes(normalizedQuery)) {
            return null;
          }
        }

        const matchedEntry = normalizedQuery
          ? data.find((d) => d.response.toLowerCase().includes(normalizedQuery))
          : data[0];

        return {
          filename: filename.replace(".json", ""),
          topic: data[0]?.topic ?? "未知话题",
          souls: data.map((d) => d.soul),
          excerpt: matchedEntry?.response ? matchedEntry.response.slice(0, 400) + "..." : "",
          timestamp: data[0]?.timestamp ?? "",
        };
      }),
    );
    return debates
      .filter((item): item is DebateFile => item !== null)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (error) {
    console.warn("Failed to read output directory:", error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }> | { q?: string | string[] };
}) {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawQuery = resolvedSearchParams.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const debates = await getDebates(query);
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
          <AuthButton isAuthenticated={isAuthenticated} userName={session?.user?.name} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SearchLauncher initialQuery={query} />
            <TriggerButton isAuthenticated={isAuthenticated} />
          </div>
        </div>

        <StreamCard />

        <div style={{ marginTop: 24 }}>
          {query ? (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 12,
                color: "var(--text-secondary)",
              }}
            >
              当前搜索：{query}
            </p>
          ) : null}
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
              {query
                ? `没有找到与「${query}」相关的讨论`
                : "暂无讨论记录，点击「发起讨论」开始第一篇"}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {debates.map((d) => (
                <Link
                  key={d.filename}
                  href={`/debate/${d.filename}`}
                  prefetch
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
