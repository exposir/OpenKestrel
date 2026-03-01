/**
 * - [INPUT]: 依赖 OPENKESTREL_DATA_DIR/STORAGE_DRIVER 与 Node path/fs API
 * - [OUTPUT]: 导出后台存储驱动选择与数据目录解析工具
 * - [POS]: apps/admin/lib 的存储驱动边界层
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import { existsSync } from "fs";
import { join } from "path";

export type StorageDriver = "local" | "cf";

export function getStorageDriver(): StorageDriver {
  const value = process.env.STORAGE_DRIVER?.trim().toLowerCase();
  return value === "cf" ? "cf" : "local";
}

export function getDataDir(): string {
  const configured = process.env.OPENKESTREL_DATA_DIR?.trim();
  if (configured) return configured;

  const fromRepoRoot = join(process.cwd(), "output");
  if (existsSync(fromRepoRoot)) return fromRepoRoot;

  const fromAdminApp = join(process.cwd(), "..", "..", "output");
  if (existsSync(fromAdminApp)) return fromAdminApp;

  return fromRepoRoot;
}

export function assertStorageReady(): void {
  if (getStorageDriver() === "cf") {
    throw new Error(
      "STORAGE_DRIVER=cf is not wired in admin yet. Connect D1/R2 queries before enabling it.",
    );
  }
}
