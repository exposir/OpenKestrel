// [INPUT]: 依赖 src/storage/adapter.ts 的讨论文件读取能力与 URL 查询参数
// [OUTPUT]: 导出 GET /api/search，返回匹配帖子列表（id/topic/excerpt/souls/timestamp）
// [POS]: app/api/ 的搜索路由，服务全局快捷键搜索弹窗
// [PROTOCOL]: 字段变更需同步 app/components/GlobalHotkeys.tsx 与 app/CLAUDE.md

import { listDebateFiles, readDebateFile } from "../../../src/storage/adapter";

interface SearchItem {
  id: string;
  topic: string;
  excerpt: string;
  souls: string[];
  timestamp: string;
}

function buildExcerpt(input: string, query: string): string {
  const text = input.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx < 0) return text.slice(0, 160);
  const start = Math.max(0, idx - 36);
  const end = Math.min(text.length, idx + query.length + 84);
  return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limitRaw = Number.parseInt(searchParams.get("limit") ?? "12", 10);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(20, limitRaw)) : 12;
  if (!q) {
    return Response.json({ items: [] satisfies SearchItem[] });
  }

  const files = await listDebateFiles();
  const matches = await Promise.all(
    files.map(async (filename) => {
      const id = filename.replace(".json", "");
      const entries = await readDebateFile(id);
      const topic = entries[0]?.topic ?? "未知话题";
      const souls = entries.map((item) => item.soul);
      const timestamp = entries[0]?.timestamp ?? "";
      const fullText = [topic, ...souls, ...entries.map((item) => item.response)].join("\n");
      if (!fullText.toLowerCase().includes(q)) return null;

      const matchedEntry = entries.find((item) => item.response.toLowerCase().includes(q));
      const excerptSource = matchedEntry?.response ?? fullText;
      return {
        id,
        topic,
        souls,
        timestamp,
        excerpt: buildExcerpt(excerptSource, q),
      } satisfies SearchItem;
    }),
  );

  const items = matches
    .filter((item): item is SearchItem => item !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);

  return Response.json({ items });
}
