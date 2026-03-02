// [INPUT]: 依赖 DI 容器与 SearchRepository 的文件索引实现，解析 URL 查询参数
// [OUTPUT]: 导出 GET /api/search，返回匹配帖子列表（id/topic/excerpt/souls/timestamp）
// [POS]: app/api/ 的搜索路由，服务全局快捷键搜索弹窗
// [PROTOCOL]: 字段变更需同步 app/components/GlobalHotkeys.tsx 与 app/CLAUDE.md

import { getContainer } from "../../../src/di/container";
import { SearchDebatesUseCase, TOKENS, type SearchRepository } from "@openkestrel/core";

interface SearchItem {
  id: string;
  topic: string;
  excerpt: string;
  souls: string[];
  timestamp: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limitRaw = Number.parseInt(searchParams.get("limit") ?? "12", 10);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(20, limitRaw)) : 12;
  if (!q) {
    return Response.json({ items: [] satisfies SearchItem[] });
  }

  // Temporary: reuse existing file-based search until an indexer lands.
  // The use case is still resolved from DI to keep callers stable.
  const container = getContainer();
  const repo = container.resolve<SearchRepository>(TOKENS.SearchRepository);
  const useCase = new SearchDebatesUseCase(repo);
  const items = (await useCase.execute({ q, limit })) as SearchItem[];
  return Response.json({ items });
}
