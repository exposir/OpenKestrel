// [INPUT]: 依赖 dotenv、fs/path 与进程 cwd，读取 apps/web 与仓库根目录环境文件
// [OUTPUT]: 导出 ensureEnvLoaded，保证服务端运行时可解析 AUTH_/DEEPSEEK/OPENKESTREL 环境变量
// [POS]: src/env/ 的环境加载器，供 auth 与 orchestration 服务端模块复用
// [PROTOCOL]: 变更环境加载优先级时需同步更新 src/CLAUDE.md 与 README 环境变量说明

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
