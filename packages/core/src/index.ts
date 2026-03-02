/**
 * - [INPUT]: 依赖 core 各域公开模块
 * - [OUTPUT]: 导出 @openkestrel/core 对外稳定 API（errors/tokens/ports/use-cases/domain）
 * - [POS]: core 包统一出口，应用层只能从此处消费公开契约
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
export * from "./shared/errors";
export * from "./di/tokens";

export * from "./debate/infrastructure-ports/llmGateway";
export * from "./debate/infrastructure-ports/debateRepository";
export * from "./debate/application/streamDebate";
export * from "./debate/domain/valueObjects";
export * from "./debate/domain/entities";
export * from "./debate/domain/aggregate";

export * from "./search/infrastructure-ports/searchRepository";
export * from "./search/application/searchDebates";
