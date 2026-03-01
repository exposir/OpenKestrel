// [INPUT]: 依赖 auth.ts 登录态、src/orchestration/soul.ts 的 SOULS、engine.ts 的 callDeepSeekStream、prompts.ts 的 Prompt 构建器、fs/promises 文件写入
// [OUTPUT]: POST /api/orchestrate，返回 ReadableStream（NDJSON：meta → chunk[] → done/error）
// [POS]: app/api/ 的流式编排路由，L2 级别；连接前端流式渲染层与后端引擎层的桥梁
// [PROTOCOL]: NDJSON 消息结构变更须同步 app/TriggerButton.tsx 和 app/CLAUDE.md

import { SOULS } from "../../../src/orchestration/soul";
import { callDeepSeekStream } from "../../../src/orchestration/engine";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "../../../src/orchestration/prompts";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { auth } from "../../../auth";

function normalizeStringList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Please sign in first", { status: 401 });
  }

  const { topic, context, soul_id, references, must_cover, must_avoid } =
    await req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return new Response("Topic is required", { status: 400 });
  }

  const matchedSoul = SOULS.find(
    (item) => item.id === soul_id || item.name === soul_id,
  );
  if (typeof soul_id === "string" && soul_id.trim().length > 0 && !matchedSoul) {
    return new Response("Invalid soul_id", { status: 400 });
  }
  const soul = matchedSoul ?? SOULS[0];
  const normalizedContext =
    typeof context === "string" && context.trim() ? context.trim() : undefined;
  const normalizedReferences = normalizeStringList(references);
  const normalizedMustCover = normalizeStringList(must_cover);
  const normalizedMustAvoid = normalizeStringList(must_avoid);
  const timestamp = new Date().toISOString();
  const filename = `debate-${Date.now()}.json`;

  const messages = [
    { role: "system" as const, content: buildSystemPrompt(soul) },
    {
      role: "user" as const,
      content: buildUserPrompt({
        topic: topic.trim(),
        context: normalizedContext,
        references: normalizedReferences,
        mustCover: normalizedMustCover,
        mustAvoid: normalizedMustAvoid,
      }),
    },
  ];

  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (s: string) => new TextEncoder().encode(s);
      const push = (payload: unknown) =>
        controller.enqueue(encode(JSON.stringify(payload) + "\n"));

      try {
        // 先推送元信息
        push({
          type: "meta",
          soul: soul.name,
          topic: topic.trim(),
          timestamp,
        });

        await callDeepSeekStream(messages, (chunk) => {
          fullContent += chunk;
          push({ type: "chunk", text: chunk });
        });

        // 存文件
        const output = {
          soul: soul.name,
          topic: topic.trim(),
          reasoning: "",
          response: fullContent,
          timestamp,
        };
        const outputDir = join(process.cwd(), "output");
        await mkdir(outputDir, { recursive: true });
        await writeFile(
          join(outputDir, filename),
          JSON.stringify([output], null, 2),
          "utf-8",
        );

        push({
          type: "done",
          filename: filename.replace(".json", ""),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "编排过程发生未知错误";
        push({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
