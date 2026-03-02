/**
 * - [INPUT]: 依赖 entities.ts 的 DebateEntry 与 valueObjects.ts 的 DebateId/Topic
 * - [OUTPUT]: 导出 Debate 聚合根
 * - [POS]: debate 域聚合层，统一讨论主语义与序列化出口
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import type { DebateEntry } from "./entities";
import type { DebateId, Topic } from "./valueObjects";

export class Debate {
  constructor(
    readonly id: DebateId,
    readonly topic: Topic,
    readonly entries: DebateEntry[],
  ) {}

  toJSON() {
    return this.entries.map((e) => e.toJSON());
  }
}
