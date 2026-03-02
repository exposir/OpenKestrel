/**
 * - [INPUT]: 依赖 dotenv + fs/path + process.cwd()，按候选路径读取 .env/.env.local
 * - [OUTPUT]: 导出 ensureEnvLoaded()，在服务端调用前完成一次性环境变量注入
 * - [POS]: src/env 的运行时环境加载层，供 auth/orchestration/storage 等服务端模块复用
 * - [PROTOCOL]: 调整加载顺序或候选路径时，同步更新 src/CLAUDE.md 与 README 环境变量文档
 */

import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

let loaded = false;

export function ensureEnvLoaded(): void {
  if (loaded) return;
  loaded = true;

  const candidates = [
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "../../.env.local"),
    resolve(process.cwd(), "../../.env"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    config({ path: filePath, override: false });
  }
}
