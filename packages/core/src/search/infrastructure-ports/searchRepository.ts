/**
 * - [INPUT]: 无框架依赖，仅定义搜索读模型与查询契约
 * - [OUTPUT]: 导出 SearchItem / SearchRepository port
 * - [POS]: search 仓储端口层，隔离用例与索引实现
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
export interface SearchItem {
  id: string;
  topic: string;
  excerpt: string;
  souls: string[];
  timestamp: string;
}

export interface SearchRepository {
  search(q: string, limit: number): Promise<SearchItem[]>;
}
