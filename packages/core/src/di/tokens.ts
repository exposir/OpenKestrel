/**
 * - [INPUT]: 无外部依赖，使用 Symbol 作为 DI token 标识
 * - [OUTPUT]: 导出 TOKENS 常量集合
 * - [POS]: core DI 协议层，统一应用层与基础设施层的注入标识
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
export const TOKENS = {
  LlmGateway: Symbol.for("@openkestrel/core/LlmGateway"),
  DebateRepository: Symbol.for("@openkestrel/core/DebateRepository"),
  SearchRepository: Symbol.for("@openkestrel/core/SearchRepository"),
} as const;
