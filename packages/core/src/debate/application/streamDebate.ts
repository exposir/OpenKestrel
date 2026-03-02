/**
 * - [INPUT]: 依赖 debate 域模型与 LlmGateway/DebateRepository ports
 * - [OUTPUT]: 导出 StreamDebateUseCase、命令模型与流事件类型
 * - [POS]: debate 应用层，编排流式生成、事件推送与持久化
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
import { Debate } from "../domain/aggregate";
import { DebateEntry } from "../domain/entities";
import { DebateId, SoulName, Topic } from "../domain/valueObjects";
import type { DebateRepository } from "../infrastructure-ports/debateRepository";
import type { LlmGateway, LlmMessage } from "../infrastructure-ports/llmGateway";

export type DebateStreamEvent =
  | { type: "meta"; soul: string; topic: string; timestamp: string }
  | { type: "chunk"; text: string }
  | { type: "done"; id: string }
  | { type: "error"; message: string };

export interface StreamDebateCommand {
  id: string;
  soulName: string;
  topic: string;
  timestamp: string;
  messages: LlmMessage[];
}

export class StreamDebateUseCase {
  constructor(
    private readonly llm: LlmGateway,
    private readonly repo: DebateRepository,
  ) {}

  async *execute(command: StreamDebateCommand): AsyncGenerator<DebateStreamEvent> {
    const id = DebateId.from(command.id);
    const topic = Topic.from(command.topic);
    const soul = SoulName.from(command.soulName);
    const timestamp = command.timestamp;

    yield { type: "meta", soul: soul.value, topic: topic.value, timestamp };

    let full = "";
    const queue: DebateStreamEvent[] = [];
    let done = false;
    const wakeRef: { current: null | (() => void) } = { current: null };

    const push = (event: DebateStreamEvent) => {
      queue.push(event);
      const fn = wakeRef.current;
      if (fn) fn();
      wakeRef.current = null;
    };

    const waitForEvent = () =>
      new Promise<void>((resolve) => {
        wakeRef.current = () => resolve();
      });

    const run = (async () => {
      try {
        await this.llm.stream(command.messages, (chunk) => {
          full += chunk;
          push({ type: "chunk", text: chunk });
        });

        const entry = new DebateEntry({
          soul,
          topic,
          response: full,
          timestamp,
          reasoning: "",
        });
        const debate = new Debate(id, topic, [entry]);
        await this.repo.save(debate);

        push({ type: "done", id: id.value });
      } catch (error) {
        const message = error instanceof Error ? error.message : "stream failed";
        push({ type: "error", message });
      } finally {
        done = true;
        const fn = wakeRef.current;
        if (fn) fn();
        wakeRef.current = null;
      }
    })();

    while (!done || queue.length > 0) {
      if (queue.length === 0) {
        await waitForEvent();
        continue;
      }
      yield queue.shift()!;
    }

    await run;
  }
}
