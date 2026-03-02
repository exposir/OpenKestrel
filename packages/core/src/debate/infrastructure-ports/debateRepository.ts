/**
 * - [INPUT]: 依赖 domain/aggregate.ts 与 domain/valueObjects.ts
 * - [OUTPUT]: 导出 DebateRepository port
 * - [POS]: debate 仓储端口层，隔离用例与存储实现（file/db/cloud）
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import type { Debate } from "../domain/aggregate";
import type { DebateId } from "../domain/valueObjects";

export interface DebateRepository {
  save(debate: Debate): Promise<void>;
  findById(id: DebateId): Promise<Debate | null>;
  listIds(): Promise<DebateId[]>;
}
