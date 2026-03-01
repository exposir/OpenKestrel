/**
 * - [INPUT]: 依赖 Next.js `NextConfig` 类型与工程运行约束
 * - [OUTPUT]: 对外提供 `nextConfig`，作为 apps/web 的 Next 配置入口
 * - [POS]: apps/web 配置层，集中管理构建与运行时框架参数
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/web/CLAUDE.md
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
