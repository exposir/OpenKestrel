/**
 * - [INPUT]: 依赖 `next/link` (路由), `react-markdown` (渲染), `src/storage/adapter` (存储适配器), `DebateToc` (目录导航)
 * - [OUTPUT]: 对外提供 `DebatePage` 详情页组件
 * - [POS]: app/debate/[id]/ 的讨论详情展示页，读取讨论落盘文件并渲染，左侧 TOC + 右侧内容双栏布局
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { readDebateFile } from "../../../src/storage/adapter";
import { DebateToc } from "./DebateToc";

function extractHeadingsFromMarkdown(markdown: string) {
  const headings: { text: string; depth: number }[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    // match `# Heading` to `###### Heading`
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        depth: match[1].length,
        text: match[2].trim(),
      });
    }
  }
  return headings;
}

// Helper to generate a consistent HTML id from a heading text
// simple slugify (lowercased, spaces to hyphens, remove special characters)
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "");
}

interface DebateOutput {
  soul: string;
  topic: string;
  reasoning?: string;
  response: string;
  timestamp: string;
}

export default async function DebatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let debate: DebateOutput[] = [];
  try {
    debate = await readDebateFile(id);
  } catch (error) {
    console.warn(`Failed to load debate file: ${id}`, error);
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>对战记录不存在</p>
        <Link href="/" style={{ color: "var(--text-primary)" }}>
          ← 返回首页
        </Link>
      </main>
    );
  }

  const topic = debate[0]?.topic ?? "";

  // ── Build TOC items from debate entries ──
  const tocItems: { id: string; label: string; depth: number }[] = [];
  debate.forEach((entry, i) => {
    // 顶级目录：发言代理
    tocItems.push({
      id: `soul-${i}`,
      label: entry.soul,
      depth: 0,
    });

    // 提取正文里的各级子标题
    const headings = extractHeadingsFromMarkdown(entry.response);
    headings.forEach((h, hidx) => {
      // id 不能只由文本生成，因为不同的 soul 可能会有相同的标题，这里加上 soul-${i} 前缀防止冲突
      // 但由于 MarkdownRenderer 里我们在生成 DOM ID 时无法获知是哪个 soul，最简单的办法是在页面级要求 slug 全局唯一。
      // 但为了简单稳定，我们在 ReactMarkdown 环节仅由 child 文本生成 slug，TOC 这边只要也按同样规则即可。
      // 问题是，如果文章中有两个完全一样的标题 "## 结论"，会选到第一个。这对现在的轻量场景可接受，暂用全局的 slugify(text) 作为 id，但加上前置一个统一人为前缀来区别卡片
      const anchorId = `heading-${i}-${slugify(h.text)}`;
      tocItems.push({
        id: anchorId,
        label: h.text,
        depth: h.depth,
      });
    });
  });

  return (
    <div className="debate-layout">
      {/* ── Left: Content ── */}
      <main className="debate-content">
        <Link
          href="/"
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← 返回
        </Link>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "24px 0 8px",
          }}
        >
          {topic}
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            margin: "0 0 40px",
          }}
        >
          {new Date(debate[0]?.timestamp).toLocaleString("zh-CN")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {debate.map((entry, i) => (
            <article
              key={i}
              id={`soul-${i}`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
                scrollMarginTop: 24,
              }}
            >
              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--bg-base)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "var(--tag-bg)",
                    border: "1px solid var(--tag-border)",
                    color: "var(--tag-text)",
                    fontWeight: 500,
                  }}
                >
                  {entry.soul}
                </span>
              </div>

              <div
                style={{
                  padding: "24px 24px",
                  background: "var(--bg-base)",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--text-primary)",
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h1
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h2
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h3
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h4
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h4>
                      );
                    },
                    h5: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h5
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h5>
                      );
                    },
                    h6: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h6
                          id={`heading-${i}-${slugify(text)}`}
                          style={{ scrollMarginTop: 60 }}
                          {...props}
                        >
                          {children}
                        </h6>
                      );
                    },
                  }}
                >
                  {entry.response}
                </ReactMarkdown>
              </div>

              {entry.reasoning && (
                <details style={{ borderTop: "1px solid var(--border-muted)" }}>
                  <summary
                    style={{
                      padding: "10px 24px",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      background: "var(--bg-base)",
                    }}
                  >
                    查看推理过程
                  </summary>
                  <div
                    style={{
                      padding: "16px 24px",
                      background: "var(--bg-base)",
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: "var(--text-muted)",
                    }}
                  >
                    <ReactMarkdown>{entry.reasoning}</ReactMarkdown>
                  </div>
                </details>
              )}
            </article>
          ))}
        </div>
      </main>

      {/* ── Right: TOC ── */}
      <aside className="debate-sidebar">
        <DebateToc items={tocItems} />
      </aside>
    </div>
  );
}
