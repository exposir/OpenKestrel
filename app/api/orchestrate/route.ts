import { SOULS } from "../../../src/orchestration/soul.ts";
import { callDeepSeekStream } from "../../../src/orchestration/engine.ts";
import { buildSystemPrompt, buildUserPrompt } from "../../../src/orchestration/prompts.ts";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const TOPIC = "OpenAI 宣布将 GPT-4 完全闭源，并停止发布任何技术报告";
const CONTEXT = `背景：OpenAI 近期宣布出于商业竞争考量，未来模型将不再发布技术报告，研究结果也不会开源。此举引发社区强烈反响，支持者认为这是商业现实，反对者认为这背叛了 OpenAI 的创立初衷。`;

export async function POST() {
  const soul = SOULS[0];
  const timestamp = new Date().toISOString();
  const filename = `debate-${Date.now()}.json`;

  const messages = [
    { role: "system" as const, content: buildSystemPrompt(soul) },
    { role: "user" as const, content: buildUserPrompt(TOPIC, CONTEXT) },
  ];

  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (s: string) => new TextEncoder().encode(s);

      // 先推送元信息
      controller.enqueue(encode(JSON.stringify({ type: "meta", soul: soul.name, topic: TOPIC, timestamp }) + "\n"));

      await callDeepSeekStream(messages, (chunk) => {
        fullContent += chunk;
        controller.enqueue(encode(JSON.stringify({ type: "chunk", text: chunk }) + "\n"));
      });

      // 存文件
      const output = { soul: soul.name, topic: TOPIC, reasoning: "", response: fullContent, timestamp };
      const outputDir = join(process.cwd(), "output");
      mkdirSync(outputDir, { recursive: true });
      writeFileSync(join(outputDir, filename), JSON.stringify([output], null, 2), "utf-8");

      controller.enqueue(encode(JSON.stringify({ type: "done", filename: filename.replace(".json", "") }) + "\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
