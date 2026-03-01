/**
 * - [INPUT]: 依赖 src/auth/auth.ts 导出的 handlers
 * - [OUTPUT]: 导出 NextAuth 的 GET/POST 处理器，提供 OAuth 回调与会话端点
 * - [POS]: app/api/auth 的认证路由入口
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
import { handlers } from "../../../../src/auth/auth";

export const { GET, POST } = handlers;
