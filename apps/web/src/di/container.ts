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
  listDebateSummaries,
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
      return files.map((name) => name.replace(".json", "")).map((id) => DebateId.from(id));
    },
  };
}

function buildSearchRepository(): SearchRepository {
  return {
    async search(q, limit) {
      return listDebateSummaries({ query: q, limit });
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
