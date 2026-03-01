/**
 * - [INPUT]: 依赖 fs/promises 与存储驱动解析层（storage.ts），读取共享审计 JSONL
 * - [OUTPUT]: 导出审计记录读取与统计函数，供后台页面渲染
 * - [POS]: apps/admin/lib 的数据访问层
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { assertStorageReady, getDataDir } from "./storage";
export { getDataDir } from "./storage";

export interface AuditRecord {
  timestamp: string;
  category: "auth" | "orchestrate";
  action: string;
  status: "success" | "failure";
  actor?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  };
  request?: {
    ip?: string | null;
    userAgent?: string | null;
  };
  metadata?: Record<string, unknown>;
}

function getAuditDir(): string {
  return join(getDataDir(), "audit");
}

function getDebateDir(): string {
  return getDataDir();
}

function parseJsonLine(line: string): AuditRecord | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as AuditRecord;
  } catch {
    return null;
  }
}

export async function readRecentAuditRecords(limit = 300): Promise<AuditRecord[]> {
  assertStorageReady();
  const auditDir = getAuditDir();
  let files: string[] = [];
  try {
    files = (await readdir(auditDir))
      .filter((f) => f.endsWith(".jsonl"))
      .sort()
      .reverse();
  } catch {
    return [];
  }

  const out: AuditRecord[] = [];
  for (const file of files) {
    const raw = await readFile(join(auditDir, file), "utf-8");
    const lines = raw.split("\n");
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const record = parseJsonLine(lines[i]);
      if (!record) continue;
      out.push(record);
      if (out.length >= limit) {
        return out.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      }
    }
  }

  return out.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export interface AuditMetrics {
  todayTotal: number;
  todayAuthSignIn: number;
  todayPostsSuccess: number;
  todayPostsFailure: number;
}

export function getAuditMetrics(records: AuditRecord[]): AuditMetrics {
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.timestamp.slice(0, 10) === today);
  return {
    todayTotal: todayRecords.length,
    todayAuthSignIn: todayRecords.filter(
      (r) => r.category === "auth" && r.action === "sign_in" && r.status === "success",
    ).length,
    todayPostsSuccess: todayRecords.filter(
      (r) => r.category === "orchestrate" && r.action === "create_post" && r.status === "success",
    ).length,
    todayPostsFailure: todayRecords.filter(
      (r) => r.category === "orchestrate" && r.action === "create_post" && r.status === "failure",
    ).length,
  };
}

export interface DebateSummary {
  filename: string;
  topic: string;
  souls: string[];
  timestamp: string;
}

export async function readRecentDebateSummaries(
  limit = 50,
): Promise<DebateSummary[]> {
  assertStorageReady();
  const dir = getDebateDir();
  let files: string[] = [];
  try {
    files = (await readdir(dir))
      .filter((f) => /^debate-\d+\.json$/.test(f))
      .sort((a, b) => b.localeCompare(a))
      .slice(0, limit);
  } catch {
    return [];
  }

  const summaries: DebateSummary[] = [];
  for (const file of files) {
    try {
      const raw = await readFile(join(dir, file), "utf-8");
      const parsed = JSON.parse(raw) as Array<{
        soul?: string;
        topic?: string;
        timestamp?: string;
      }>;
      const first = parsed[0];
      summaries.push({
        filename: file.replace(".json", ""),
        topic: first?.topic ?? "未知话题",
        souls: parsed.map((item) => item.soul ?? "").filter(Boolean),
        timestamp: first?.timestamp ?? "",
      });
    } catch {
      // ignore broken debate file
    }
  }

  return summaries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
