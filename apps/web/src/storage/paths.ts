// [INPUT]: 依赖 OPENKESTREL_DATA_DIR 环境变量、Node path API 与 fs.existsSync
// [OUTPUT]: 导出 getDataDir/getDebateDir/getAuditDir/getDebateFilePath，统一数据目录路径
// [POS]: src/storage/ 的路径策略层，供 web/admin 两端复用
// [PROTOCOL]: 变更时更新此头部，然后检查 src/storage/CLAUDE.md

import { existsSync } from "fs";
import { join } from "path";

export function getDataDir(): string {
  const configured = process.env.OPENKESTREL_DATA_DIR?.trim();
  if (configured) return configured;

  const fromAppCwd = join(process.cwd(), "output");
  if (existsSync(fromAppCwd)) return fromAppCwd;

  const fromRepoRoot = join(process.cwd(), "..", "..", "output");
  if (existsSync(fromRepoRoot)) return fromRepoRoot;

  return fromAppCwd;
}

export function getDebateDir(): string {
  return getDataDir();
}

export function getAuditDir(): string {
  return join(getDataDir(), "audit");
}

export function getDebateFilePath(id: string): string {
  return join(getDebateDir(), `${id}.json`);
}
