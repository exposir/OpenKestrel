// [INPUT]: 依赖 src/orchestration/soul.ts 的 SOULS、engine.ts 的 callDeepSeekStream、prompts.ts 的 Prompt 构建器
// [OUTPUT]: POST /api/orchestrate，返回 ReadableStream（NDJSON：meta → chunk[] → done）
// [POS]: app/api/ 的流式编排路由，L2 级别；连接前端流式渲染层与后端引擎层的桥梁
// [PROTOCOL]: NDJSON 消息结构变更须同步 app/TriggerButton.tsx 和 app/CLAUDE.md

import { SOULS } from "../../../src/orchestration/soul.ts";
import { callDeepSeekStream } from "../../../src/orchestration/engine.ts";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "../../../src/orchestration/prompts.ts";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export async function POST(req: Request) {
  const { topic, context } = await req.json();

  if (!topic) {
    return new Response("Topic is required", { status: 400 });
  }

  const soul = SOULS[0];
  const timestamp = new Date().toISOString();
  const filename = `debate-${Date.now()}.json`;

  const messages = [
    { role: "system" as const, content: buildSystemPrompt(soul) },
    { role: "user" as const, content: buildUserPrompt(topic, context) },
  ];

  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (s: string) => new TextEncoder().encode(s);

      // 先推送元信息
      controller.enqueue(
        encode(
          JSON.stringify({ type: "meta", soul: soul.name, topic, timestamp }) +
            "\n",
        ),
      );

      await callDeepSeekStream(messages, (chunk) => {
        fullContent += chunk;
        controller.enqueue(
          encode(JSON.stringify({ type: "chunk", text: chunk }) + "\n"),
        );
      });

      // 存文件
      const output = {
        soul: soul.name,
        topic,
        reasoning: "",
        response: fullContent,
        timestamp,
      };
      const outputDir = join(process.cwd(), "output");
      mkdirSync(outputDir, { recursive: true });
      writeFileSync(
        join(outputDir, filename),
        JSON.stringify([output], null, 2),
        "utf-8",
      );

      controller.enqueue(
        encode(
          JSON.stringify({
            type: "done",
            filename: filename.replace(".json", ""),
          }) + "\n",
        ),
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
