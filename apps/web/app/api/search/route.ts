/**
 * - [INPUT]: 依赖 URL 查询参数（q/limit）、DI 容器与 SearchRepository 实现
 * - [OUTPUT]: 导出 GET /api/search，返回帖子候选列表（id/topic/excerpt/souls/timestamp）
 * - [POS]: app/api 的搜索路由，服务 GlobalHotkeys 与 SearchDialog 搜索弹窗
 * - [PROTOCOL]: 返回字段或过滤规则变更时，同步 app/components/hotkeys/GlobalHotkeys.tsx 与 app/CLAUDE.md
 */

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
  try {
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
  } catch (error) {
    console.warn("Search route failed:", error);
    return Response.json({ items: [] satisfies SearchItem[] }, { status: 200 });
  }
}
