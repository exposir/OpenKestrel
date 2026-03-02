/**
 * - [INPUT]: 依赖 @openkestrel/core 的 ports/usecases 与 tsyringe 容器
 * - [OUTPUT]: 导出 getContainer()，提供 apps/web 的 composition root（单实例 DI 装配）
 * - [POS]: src/di 的装配入口，API 路由与服务端逻辑从此解析用例
 * - [PROTOCOL]: 新增/替换基础设施实现时，必须集中在本文件注册并同步 src/CLAUDE.md
 */
import "reflect-metadata";
import { container as rootContainer, type DependencyContainer } from "tsyringe";
import {
  TOKENS,
  type DebateRepository,
  type LlmGateway,
  type SearchRepository,
} from "@openkestrel/core";
import { callDeepSeekStream } from "../orchestration/engine";
import {
  listDebateFiles,
  readDebateFile,
  writeDebateFile,
} from "../storage/adapter";
import { Debate, DebateEntry, DebateId, SoulName, Topic } from "@openkestrel/core";

let initialized = false;

function buildLlmGateway(): LlmGateway {
  return {
    stream: (messages, onChunk) => callDeepSeekStream(messages, onChunk),
  };
}

function buildDebateRepository(): DebateRepository {
  return {
    async save(debate) {
      const filename = `${debate.id.value}.json`;
      // apps/web 存储层当前约定为 DebateEntry[] JSON
      await writeDebateFile(filename, debate.toJSON() as any);
    },

    async findById(id) {
      try {
        const raw = await readDebateFile(id.value);
        const topic = Topic.from(raw[0]?.topic ?? "");
        const entries = raw.map(
          (item) =>
            new DebateEntry({
              soul: SoulName.from(item.soul),
              topic,
              response: item.response,
              timestamp: item.timestamp,
              reasoning: item.reasoning,
            }),
        );
        return new Debate(id, topic, entries);
      } catch {
        return null;
      }
    },

    async listIds() {
      const files = await listDebateFiles();
      return files
        .map((name) => name.replace(".json", ""))
        .map((id) => DebateId.from(id));
    },
  };
}

function buildSearchRepository(): SearchRepository {
  return {
    async search(q, limit) {
      const files = await listDebateFiles();
      const matches = await Promise.all(
        files.map(async (filename) => {
          const id = filename.replace(".json", "");
          const entries = await readDebateFile(id);
          const topic = entries[0]?.topic ?? "未知话题";
          const souls = entries.map((item) => item.soul);
          const timestamp = entries[0]?.timestamp ?? "";
          const fullText = [topic, ...souls, ...entries.map((item) => item.response)].join(
            "\n",
          );
          if (!fullText.toLowerCase().includes(q)) return null;

          const buildExcerpt = (input: string) => {
            const text = input.replace(/\s+/g, " ").trim();
            if (!text) return "";
            const lower = text.toLowerCase();
            const idx = lower.indexOf(q);
            if (idx < 0) return text.slice(0, 160);
            const start = Math.max(0, idx - 36);
            const end = Math.min(text.length, idx + q.length + 84);
            return (
              (start > 0 ? "..." : "") +
              text.slice(start, end) +
              (end < text.length ? "..." : "")
            );
          };

          const matchedEntry = entries.find((item) =>
            item.response.toLowerCase().includes(q),
          );
          const excerptSource = matchedEntry?.response ?? fullText;
          return {
            id,
            topic,
            souls,
            timestamp,
            excerpt: buildExcerpt(excerptSource),
          };
        }),
      );

      return matches
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, limit);
    },
  };
}

function ensureInitialized(container: DependencyContainer) {
  if (initialized) return;
  initialized = true;

  container.register(TOKENS.LlmGateway, { useValue: buildLlmGateway() });
  container.register(TOKENS.DebateRepository, { useValue: buildDebateRepository() });
  container.register(TOKENS.SearchRepository, { useValue: buildSearchRepository() });
}

export function getContainer(): DependencyContainer {
  ensureInitialized(rootContainer);
  return rootContainer;
}
