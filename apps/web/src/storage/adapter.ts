// [INPUT]: 依赖 storage/paths.ts 的本地路径策略与 fs/promises，读取 STORAGE_DRIVER 配置
// [OUTPUT]: 导出统一存储适配器接口（local 可用，cf 占位），供页面/API/审计层复用
// [POS]: src/storage/ 的驱动切换层，隔离调用方与底层存储实现
// [PROTOCOL]: 新增驱动时必须保持接口兼容，并同步更新 src/storage/CLAUDE.md

import { mkdir, readdir, readFile, writeFile, appendFile } from "fs/promises";
import { join } from "path";
import { getAuditDir, getDebateDir, getDebateFilePath } from "./paths";

export type StorageDriver = "local" | "cf";

export interface DebateEntry {
  soul: string;
  topic: string;
  reasoning?: string;
  response: string;
  timestamp: string;
}

export interface AuditLine {
  timestamp: string;
  category: "auth" | "orchestrate";
  action: string;
  status: "success" | "failure";
  actor: unknown;
  request: unknown;
  metadata: unknown;
}

export function getStorageDriver(): StorageDriver {
  const value = process.env.STORAGE_DRIVER?.trim().toLowerCase();
  return value === "cf" ? "cf" : "local";
}

function getDailyAuditFilePath(): string {
  const date = new Date().toISOString().slice(0, 10);
  return join(getAuditDir(), `${date}.jsonl`);
}

function assertCloudflareNotImplemented(): never {
  throw new Error(
    "STORAGE_DRIVER=cf is not wired in runtime yet. Configure Cloudflare D1/R2 adapter before enabling it.",
  );
}

export async function writeDebateFile(
  filename: string,
  content: DebateEntry[],
): Promise<void> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  const debateDir = getDebateDir();
  await mkdir(debateDir, { recursive: true });
  await writeFile(join(debateDir, filename), JSON.stringify(content, null, 2), "utf-8");
}

export async function readDebateFile(id: string): Promise<DebateEntry[]> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  const raw = await readFile(getDebateFilePath(id), "utf-8");
  return JSON.parse(raw) as DebateEntry[];
}

export async function listDebateFiles(): Promise<string[]> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  const debateDir = getDebateDir();
  const files = await readdir(debateDir);
  return files.filter((f) => /^debate-\d+\.json$/.test(f));
}

export async function appendAuditRecord(record: AuditLine): Promise<void> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  await mkdir(getAuditDir(), { recursive: true });
  await appendFile(getDailyAuditFilePath(), JSON.stringify(record) + "\n", "utf-8");
}
