// [INPUT]: 依赖 OPENKESTREL_DATA_DIR 环境变量与 Node path API
// [OUTPUT]: 导出 getDataDir/getDebateDir/getAuditDir/getDebateFilePath，统一数据目录路径
// [POS]: src/storage/ 的路径策略层，供 web/admin 两端复用
// [PROTOCOL]: 变更时更新此头部，然后检查 src/storage/CLAUDE.md

import { join } from "path";

export function getDataDir(): string {
  const configured = process.env.OPENKESTREL_DATA_DIR?.trim();
  if (configured) return configured;
  return join(process.cwd(), "output");
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
