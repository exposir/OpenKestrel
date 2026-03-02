/**
 * - [INPUT]: 依赖 valueObjects.ts 的 SoulName / Topic
 * - [OUTPUT]: 导出 DebateEntry 实体及其 props 类型
 * - [POS]: debate 域实体层，承载单条讨论输出的领域语义
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import type { SoulName, Topic } from "./valueObjects";

export interface DebateEntryProps {
  soul: SoulName;
  topic: Topic;
  response: string;
  timestamp: string;
  reasoning?: string;
}

export class DebateEntry {
  constructor(readonly props: DebateEntryProps) {}

  toJSON() {
    return {
      soul: this.props.soul.value,
      topic: this.props.topic.value,
      response: this.props.response,
      timestamp: this.props.timestamp,
      reasoning: this.props.reasoning,
    };
  }
}
