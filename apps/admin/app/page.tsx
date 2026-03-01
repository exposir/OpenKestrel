/**
 * - [INPUT]: 依赖 lib/audit.ts 的审计读取与统计能力
 * - [OUTPUT]: 提供后台首页（统计卡片 + 审计日志表）
 * - [POS]: apps/admin 的主控制台页面
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import {
  getAuditMetrics,
  getDataDir,
  readRecentAuditRecords,
  readRecentDebateSummaries,
} from "../lib/audit";
import type { CSSProperties, ReactNode } from "react";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN");
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; q?: string }>;
}) {
  const { category = "all", status = "all", q = "" } = await searchParams;
  const allRecords = await readRecentAuditRecords(500);
  const debates = await readRecentDebateSummaries(80);
  const metrics = getAuditMetrics(allRecords);
  const dataDir = getDataDir();
  const keyword = q.trim().toLowerCase();

  const records = allRecords.filter((record) => {
    if (category !== "all" && record.category !== category) return false;
    if (status !== "all" && record.status !== status) return false;
    if (!keyword) return true;
    const haystack = JSON.stringify(record).toLowerCase();
    return haystack.includes(keyword);
  });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 56px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 12, letterSpacing: 1 }}>
            OPENKESTREL CONSOLE
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: 30, fontWeight: 700 }}>
            运营后台
          </h1>
        </div>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-soft)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "6px 10px",
            background: "var(--panel)",
          }}
        >
          共享目录：{dataDir}
        </span>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <MetricCard title="今日总事件" value={String(metrics.todayTotal)} />
        <MetricCard title="今日登录成功" value={String(metrics.todayAuthSignIn)} />
        <MetricCard title="今日发帖成功" value={String(metrics.todayPostsSuccess)} />
        <MetricCard title="今日发帖失败" value={String(metrics.todayPostsFailure)} />
        <MetricCard title="历史讨论文件" value={String(debates.length)} />
      </section>

      <section
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
          marginTop: 14,
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid var(--line)",
            background: "var(--panel-soft)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          最近已发讨论（来自 debate-*.json）
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
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
                  <td colSpan={4} style={{ padding: "20px 16px", color: "var(--text-soft)" }}>
                    未发现讨论文件
                  </td>
                </tr>
              ) : (
                debates.slice(0, 50).map((item) => (
                  <tr key={item.filename} style={{ borderTop: "1px solid var(--line)" }}>
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

      <section
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
          marginTop: 14,
        }}
      >
        <form
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            padding: 14,
            borderBottom: "1px solid var(--line)",
            background: "var(--panel-soft)",
          }}
        >
          <select name="category" defaultValue={category} style={filterInputStyle}>
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
        </form>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
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
                  <td colSpan={7} style={{ padding: "24px 16px", color: "var(--text-soft)" }}>
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
                          color: record.status === "success" ? "var(--ok)" : "var(--bad)",
                        }}
                      >
                        {record.status}
                      </span>
                    </Td>
                    <Td>{record.actor?.email || record.actor?.name || "-"}</Td>
                    <Td>{record.request?.ip || "-"}</Td>
                    <Td style={{ maxWidth: 360, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {JSON.stringify(record.metadata ?? {})}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
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
      <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 12 }}>{title}</p>
      <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, borderBottom: "1px solid var(--line)" }}>
      {children}
    </th>
  );
}

function Td({ children, style }: { children: ReactNode; style?: CSSProperties }) {
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
