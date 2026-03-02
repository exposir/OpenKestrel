/**
 * - [INPUT]: 依赖 SearchRepository port 与 shared/errors.ts 的 ValidationError
 * - [OUTPUT]: 导出 SearchDebatesUseCase 与查询模型
 * - [POS]: search 应用层，收敛 query 校验与仓储调用策略
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import type { SearchItem, SearchRepository } from "../infrastructure-ports/searchRepository";
import { ValidationError } from "../../shared/errors";

export interface SearchDebatesQuery {
  q: string;
  limit: number;
}

export class SearchDebatesUseCase {
  constructor(private readonly repo: SearchRepository) {}

  async execute(query: SearchDebatesQuery): Promise<SearchItem[]> {
    const q = query.q.trim().toLowerCase();
    if (!q) throw new ValidationError("q is required");
    const limit = Number.isFinite(query.limit)
      ? Math.max(1, Math.min(20, query.limit))
      : 12;
    return this.repo.search(q, limit);
  }
}
