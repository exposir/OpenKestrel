/**
 * - [INPUT]: 依赖 lib/audit.ts 的审计读取与统计能力
 * - [OUTPUT]: 提供后台的系统审计日志页面（统计卡片 + 审计日志表）
 * - [POS]: apps/admin/app/audits/page.tsx
 */
import { getAuditMetrics, readRecentAuditRecords } from "../../lib/audit";
import type { ReactNode } from "react";
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
    <div className="ok-admin-layout">
      <section className="ok-admin-panel">
        <Form action="/audits" className="ok-admin-toolbar">
          <select
            name="category"
            defaultValue={category}
            className="ok-admin-select"
          >
            <option value="all">全部分类</option>
            <option value="auth">认证事件</option>
            <option value="orchestrate">发帖事件</option>
          </select>
          <select
            name="status"
            defaultValue={status}
            className="ok-admin-select"
          >
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="failure">失败</option>
          </select>
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索邮箱 / action / metadata"
            className="ok-admin-input"
            style={{ minWidth: 260, flex: 1 }}
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
                  <td colSpan={7} className="ok-admin-empty">
                    暂无匹配的审计记录
                  </td>
                </tr>
              ) : (
                records.slice(0, 200).map((record, idx) => (
                  <tr
                    key={`${record.timestamp}-${idx}`}
                    className="ok-admin-row"
                  >
                    <Td>{formatTime(record.timestamp)}</Td>
                    <Td>{record.category}</Td>
                    <Td>{record.action}</Td>
                    <Td>
                      <span className={`ok-admin-status ${record.status}`}>
                        {record.status}
                      </span>
                    </Td>
                    <Td>{record.actor?.email || record.actor?.name || "-"}</Td>
                    <Td>{record.request?.ip || "-"}</Td>
                    <Td className="ok-admin-ellipsis-cell">
                      {JSON.stringify(record.metadata ?? {})}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="ok-admin-sidebar-wrap">
        <aside className="ok-admin-sidebar">
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
  return (
    <td className={`ok-admin-td${className ? ` ${className}` : ""}`}>
      {children}
    </td>
  );
}
