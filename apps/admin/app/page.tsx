/**
 * - [INPUT]: 依赖 lib/audit.ts 的审计读取与统计能力
 * - [OUTPUT]: 提供后台首页（统计卡片 + 审计日志表）
 * - [POS]: apps/admin 的主控制台页面
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import { readRecentDebateSummaries } from "../lib/audit";
import type { ReactNode } from "react";
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
    <div className="ok-admin-layout">
      <section className="ok-admin-panel">
        <Form action="/" className="ok-admin-toolbar">
          <input
            name="q"
            defaultValue={dq}
            placeholder="搜索话题"
            className="ok-admin-input"
          />
          <button type="submit" className="ok-admin-button">
            筛选
          </button>
        </Form>
        <div className="ok-admin-table-wrap">
          <table className="ok-admin-table">
            <thead>
              <tr className="ok-admin-table-head-row">
                <Th>时间</Th>
                <Th>话题</Th>
                <Th>Soul</Th>
                <Th>文件</Th>
              </tr>
            </thead>
            <tbody>
              {debates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="ok-admin-empty">
                    未发现讨论文件
                  </td>
                </tr>
              ) : (
                debates.slice(0, 50).map((item) => (
                  <tr key={item.filename} className="ok-admin-row">
                    <Td>{item.timestamp ? formatTime(item.timestamp) : "-"}</Td>
                    <Td className="ok-admin-topic-cell">
                      {item.topic}
                    </Td>
                    <Td>{item.souls.join(", ") || "-"}</Td>
                    <Td>
                      <code className="ok-admin-chip">
                        {item.filename}
                      </code>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="ok-admin-sidebar-wrap">
        <aside className="ok-admin-sidebar" style={{ width: 260 }}>
          <MetricCard
            title="历史讨论文件总数"
            value={String(allDebates.length)}
          />
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="ok-admin-metric">
      <p className="ok-admin-metric-label">{title}</p>
      <p className="ok-admin-metric-value">{value}</p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="ok-admin-th">{children}</th>;
}

function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`ok-admin-td${className ? ` ${className}` : ""}`}>{children}</td>;
}
