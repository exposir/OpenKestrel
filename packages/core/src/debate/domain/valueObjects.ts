/**
 * - [INPUT]: 依赖 shared/errors.ts 的 ValidationError
 * - [OUTPUT]: 导出 DebateId / Topic / SoulName 值对象
 * - [POS]: debate 域值对象层，收敛输入合法性与不变量校验
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import { ValidationError } from "../../shared/errors";

export class DebateId {
  private constructor(readonly value: string) {}

  static from(value: string): DebateId {
    const trimmed = value.trim();
    if (!trimmed) throw new ValidationError("DebateId cannot be empty");
    return new DebateId(trimmed);
  }

  toString() {
    return this.value;
  }
}

export class Topic {
  private constructor(readonly value: string) {}

  static from(value: string): Topic {
    const trimmed = value.trim();
    if (!trimmed) throw new ValidationError("Topic is required");
    if (trimmed.length > 500) throw new ValidationError("Topic is too long");
    return new Topic(trimmed);
  }

  toString() {
    return this.value;
  }
}

export class SoulName {
  private constructor(readonly value: string) {}

  static from(value: string): SoulName {
    const trimmed = value.trim();
    if (!trimmed) throw new ValidationError("SoulName cannot be empty");
    return new SoulName(trimmed);
  }

  toString() {
    return this.value;
  }
}
