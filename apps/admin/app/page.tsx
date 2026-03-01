/**
 * - [INPUT]: 依赖 lib/audit.ts 的审计读取与统计能力
 * - [OUTPUT]: 提供后台首页（统计卡片 + 审计日志表）
 * - [POS]: apps/admin 的主控制台页面
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import { readRecentDebateSummaries } from "../lib/audit";
import type { CSSProperties, ReactNode } from "react";
import Form from "next/form";

function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ dq?: string }>;
}) {
  const { dq = "" } = await searchParams;
  const allDebates = await readRecentDebateSummaries(80);
  const debateKeyword = dq.trim().toLowerCase();

  const debates = allDebates.filter((item) => {
    if (!debateKeyword) return true;
    const haystack =
      `${item.filename} ${item.topic} ${item.souls.join(" ")}`.toLowerCase();
    return haystack.includes(debateKeyword);
  });

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <section
        style={{
          flex: 1,
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <Form
          action="/"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            padding: "12px 14px",
            borderBottom: "1px solid var(--line)",
            background: "var(--panel-soft)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            最近已发讨论（来自 debate-*.json）
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              name="dq"
              defaultValue={dq}
              placeholder="搜索话题 / 文件 / Soul"
              style={{
                ...filterInputStyle,
                minWidth: 200,
                padding: "4px 10px",
              }}
            />
            <button
              type="submit"
              style={{
                border: "1px solid var(--line)",
                background: "var(--chip)",
                color: "var(--text)",
                borderRadius: 8,
                padding: "4px 12px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              筛选
            </button>
          </div>
        </Form>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ color: "var(--text-soft)", textAlign: "left" }}>
                <Th>时间</Th>
                <Th>话题</Th>
                <Th>Soul</Th>
                <Th>文件</Th>
              </tr>
            </thead>
            <tbody>
              {debates.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: "20px 16px", color: "var(--text-soft)" }}
                  >
                    未发现讨论文件
                  </td>
                </tr>
              ) : (
                debates.slice(0, 50).map((item) => (
                  <tr
                    key={item.filename}
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <Td>{item.timestamp ? formatTime(item.timestamp) : "-"}</Td>
                    <Td
                      style={{
                        maxWidth: 540,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.topic}
                    </Td>
                    <Td>{item.souls.join(", ") || "-"}</Td>
                    <Td>{item.filename}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <aside
        style={{
          width: 280,
          position: "sticky",
          top: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <MetricCard
          title="历史讨论文件总数"
          value={String(allDebates.length)}
        />
      </aside>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 12 }}>
        {title}
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        padding: "12px 16px",
        fontSize: 12,
        fontWeight: 600,
        borderBottom: "1px solid var(--line)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <td style={{ padding: "10px 16px", color: "var(--text)", ...style }}>
      {children}
    </td>
  );
}

const filterInputStyle: CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--panel)",
  color: "var(--text)",
  borderRadius: 8,
  padding: "8px 10px",
};
