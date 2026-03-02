/**
 * - [INPUT]: 依赖 Next.js 类型声明注入
 * - [OUTPUT]: 提供 web 应用的 Next 环境类型入口
 * - [POS]: apps/web 的类型接线文件（由 Next.js 生成并维护）
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/web/CLAUDE.md
 */
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
