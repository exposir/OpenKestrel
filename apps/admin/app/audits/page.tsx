/**
 * - [INPUT]: 依赖 lib/audit.ts 的审计读取与统计能力
 * - [OUTPUT]: 提供后台的系统审计日志页面（统计卡片 + 审计日志表）
 * - [POS]: apps/admin/app/audits/page.tsx
 */
import { getAuditMetrics, readRecentAuditRecords } from "../../lib/audit";
import type { CSSProperties, ReactNode } from "react";
import Form from "next/form";

function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default async function AuditsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; q?: string }>;
}) {
  const { category = "all", status = "all", q = "" } = await searchParams;
  const allRecords = await readRecentAuditRecords(500);
  const metrics = getAuditMetrics(allRecords);
  const keyword = q.trim().toLowerCase();

  const records = allRecords.filter((record) => {
    if (category !== "all" && record.category !== category) return false;
    if (status !== "all" && record.status !== status) return false;
    if (!keyword) return true;
    const haystack = JSON.stringify(record).toLowerCase();
    return haystack.includes(keyword);
  });

  return (
    <div>
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
          action="/audits"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            padding: 14,
            borderBottom: "1px solid var(--line)",
            background: "var(--panel-soft)",
          }}
        >
          <select
            name="category"
            defaultValue={category}
            style={filterInputStyle}
          >
            <option value="all">全部分类</option>
            <option value="auth">认证事件</option>
            <option value="orchestrate">发帖事件</option>
          </select>
          <select name="status" defaultValue={status} style={filterInputStyle}>
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="failure">失败</option>
          </select>
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索邮箱 / action / metadata"
            style={{ ...filterInputStyle, minWidth: 260, flex: 1 }}
          />
          <button
            type="submit"
            style={{
              border: "1px solid var(--line)",
              background: "var(--chip)",
              color: "var(--text)",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            筛选
          </button>
        </Form>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ color: "var(--text-soft)", textAlign: "left" }}>
                <Th>时间</Th>
                <Th>分类</Th>
                <Th>动作</Th>
                <Th>状态</Th>
                <Th>用户</Th>
                <Th>IP</Th>
                <Th>摘要</Th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "24px 16px", color: "var(--text-soft)" }}
                  >
                    暂无匹配的审计记录
                  </td>
                </tr>
              ) : (
                records.slice(0, 200).map((record, idx) => (
                  <tr
                    key={`${record.timestamp}-${idx}`}
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <Td>{formatTime(record.timestamp)}</Td>
                    <Td>{record.category}</Td>
                    <Td>{record.action}</Td>
                    <Td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          background:
                            record.status === "success"
                              ? "rgba(58,199,139,0.16)"
                              : "rgba(255,109,109,0.16)",
                          color:
                            record.status === "success"
                              ? "var(--ok)"
                              : "var(--bad)",
                        }}
                      >
                        {record.status}
                      </span>
                    </Td>
                    <Td>{record.actor?.email || record.actor?.name || "-"}</Td>
                    <Td>{record.request?.ip || "-"}</Td>
                    <Td
                      style={{
                        maxWidth: 360,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {JSON.stringify(record.metadata ?? {})}
                    </Td>
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
        <MetricCard title="今日总事件" value={String(metrics.todayTotal)} />
        <MetricCard
          title="今日登录成功"
          value={String(metrics.todayAuthSignIn)}
        />
        <MetricCard
          title="今日发帖成功"
          value={String(metrics.todayPostsSuccess)}
        />
        <MetricCard
          title="今日发帖失败"
          value={String(metrics.todayPostsFailure)}
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
