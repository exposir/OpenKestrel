/**
 * - [INPUT]: 依赖 Node path/url API 与项目根目录信息
 * - [OUTPUT]: 提供路径归一化、扩展名判断、聚合前缀计算工具
 * - [POS]: analyzer 基础工具层，服务扫描/解析/聚合全流程
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import path from "node:path";

export const SUPPORTED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);

export function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

export function normalizeAbsolutePath(input: string): string {
  return toPosixPath(path.resolve(input));
}

export function toRelativePath(root: string, absPath: string): string {
  const rel = path.relative(root, absPath);
  return toPosixPath(rel || ".");
}

export function isSupportedCodeFile(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

export function aggregateKey(relativePath: string, depth: number): string {
  const cleaned = relativePath.replace(/^\.\//, "");
  if (!cleaned || cleaned === ".") {
    return ".";
  }
  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length <= depth) {
    return parts.join("/");
  }
  return parts.slice(0, depth).join("/");
}
