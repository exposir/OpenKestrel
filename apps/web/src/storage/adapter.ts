/**
 * - [INPUT]: 依赖 STORAGE_DRIVER、storage/paths.ts 与 fs/promises，执行本地文件读写与审计落盘
 * - [OUTPUT]: 导出 Debate/Audit 的统一存储接口（local 可用、cf fail-fast 占位）
 * - [POS]: src/storage 的驱动切换层，隔离调用方与具体存储实现
 * - [PROTOCOL]: 新增或修改存储驱动时保持接口兼容，并同步更新 src/storage/CLAUDE.md
 */

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

export interface DebateSummary {
  id: string;
  topic: string;
  souls: string[];
  excerpt: string;
  timestamp: string;
}

interface DebateIndexEntry extends DebateSummary {
  searchText: string;
}

const INDEX_FILE = ".ok-debate-index.v1.json";

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

function getIndexFilePath(): string {
  return join(getDebateDir(), INDEX_FILE);
}

function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDebateSummary(id: string, entries: DebateEntry[]): DebateSummary {
  const topic = entries[0]?.topic ?? "未知话题";
  const souls = Array.from(new Set(entries.map((entry) => entry.soul).filter(Boolean)));
  const timestamp = entries[0]?.timestamp ?? "";
  const excerptSource = entries[0]?.response ?? "";
  const excerptPlain = markdownToPlainText(excerptSource);
  const excerpt =
    excerptPlain.length > 220 ? `${excerptPlain.slice(0, 220).trimEnd()}...` : excerptPlain;
  return { id, topic, souls, excerpt, timestamp };
}

function buildDebateIndexEntry(id: string, entries: DebateEntry[]): DebateIndexEntry {
  const summary = buildDebateSummary(id, entries);
  const responses = entries.map((entry) => markdownToPlainText(entry.response)).join(" ");
  const searchText = normalizeText([summary.topic, ...summary.souls, responses].join(" ")).slice(
    0,
    20000,
  );
  return {
    ...summary,
    searchText: searchText.toLowerCase(),
  };
}

async function readDebateIndex(): Promise<DebateIndexEntry[] | null> {
  try {
    const raw = await readFile(getIndexFilePath(), "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(Boolean) as DebateIndexEntry[];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return null;
    return null;
  }
}

async function writeDebateIndex(entries: DebateIndexEntry[]): Promise<void> {
  await mkdir(getDebateDir(), { recursive: true });
  await writeFile(getIndexFilePath(), JSON.stringify(entries, null, 2), "utf-8");
}

async function rebuildDebateIndex(): Promise<DebateIndexEntry[]> {
  const files = await listDebateFiles();
  const items = await Promise.all(
    files.map(async (filename) => {
      const id = filename.replace(".json", "");
      try {
        const entries = await readDebateFile(id);
        return buildDebateIndexEntry(id, entries);
      } catch {
        return null;
      }
    }),
  );
  const index = items
    .filter((item): item is DebateIndexEntry => item !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  await writeDebateIndex(index);
  return index;
}

async function getDebateIndex(): Promise<DebateIndexEntry[]> {
  const existing = await readDebateIndex();
  if (existing) return existing;
  return rebuildDebateIndex();
}

async function upsertDebateIndex(id: string, entries: DebateEntry[]): Promise<void> {
  const index = await getDebateIndex();
  const next = buildDebateIndexEntry(id, entries);
  const withoutCurrent = index.filter((item) => item.id !== id);
  withoutCurrent.push(next);
  withoutCurrent.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  await writeDebateIndex(withoutCurrent);
}

export async function writeDebateFile(filename: string, content: DebateEntry[]): Promise<void> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  const debateDir = getDebateDir();
  await mkdir(debateDir, { recursive: true });
  await writeFile(join(debateDir, filename), JSON.stringify(content, null, 2), "utf-8");
  await upsertDebateIndex(filename.replace(".json", ""), content);
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
  let files: string[] = [];
  try {
    files = await readdir(debateDir);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  return files.filter((f) => /^debate-\d+\.json$/.test(f));
}

export async function listDebateSummaries(options?: {
  query?: string;
  limit?: number;
}): Promise<DebateSummary[]> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  const normalizedQuery = options?.query?.trim().toLowerCase() ?? "";
  const limit = options?.limit ?? Number.MAX_SAFE_INTEGER;
  const index = await getDebateIndex();

  return index
    .filter((item) => {
      if (!normalizedQuery) return true;
      return item.searchText.includes(normalizedQuery);
    })
    .slice(0, limit)
    .map(({ searchText: _searchText, ...summary }) => summary);
}

export async function appendAuditRecord(record: AuditLine): Promise<void> {
  if (getStorageDriver() === "cf") {
    assertCloudflareNotImplemented();
  }
  await mkdir(getAuditDir(), { recursive: true });
  await appendFile(getDailyAuditFilePath(), JSON.stringify(record) + "\n", "utf-8");
}
