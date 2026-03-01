// [INPUT]: 依赖 fs/promises、storage/paths.ts 与 Request 头信息，接收认证/业务操作事件
// [OUTPUT]: 导出 logAuditEvent/getRequestContext，将审计事件写入 output/audit/*.jsonl
// [POS]: src/audit/ 的日志落盘层，供 auth.ts 与 API 路由复用
// [PROTOCOL]: 变更时更新此头部，然后检查 src/audit/CLAUDE.md

import { appendFile, mkdir } from "fs/promises";
import { join } from "path";
import { getAuditDir } from "../storage/paths";

export interface AuditActor {
  id?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface AuditRequestContext {
  ip?: string | null;
  userAgent?: string | null;
}

export interface AuditEvent {
  category: "auth" | "orchestrate";
  action: string;
  status: "success" | "failure";
  actor?: AuditActor;
  request?: AuditRequestContext;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

function getDailyAuditFilePath(): string {
  const date = new Date().toISOString().slice(0, 10);
  return join(getAuditDir(), `${date}.jsonl`);
}

export function getRequestContext(req: Request): AuditRequestContext {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip =
    forwardedFor?.split(",").map((s) => s.trim()).find(Boolean) ??
    realIp ??
    null;
  return {
    ip,
    userAgent: req.headers.get("user-agent"),
  };
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  const record = {
    timestamp: event.timestamp ?? new Date().toISOString(),
    category: event.category,
    action: event.action,
    status: event.status,
    actor: event.actor ?? {},
    request: event.request ?? {},
    metadata: event.metadata ?? {},
  };

  try {
    const filePath = getDailyAuditFilePath();
    await mkdir(getAuditDir(), { recursive: true });
    await appendFile(filePath, JSON.stringify(record) + "\n", "utf-8");
  } catch (error) {
    console.warn("Audit log write failed:", error);
  }
}
