import "dotenv/config";
import { runOrchestration } from "./engine.ts";
import { SOULS } from "./soul.ts";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// 验证用话题（来自 HN 热帖）
const TOPIC = "OpenAI 宣布将 GPT-4 完全闭源，并停止发布任何技术报告";

const CONTEXT = `
背景：OpenAI 近期宣布出于商业竞争考量，未来模型将不再发布技术报告，
研究结果也不会开源。此举引发社区强烈反响，支持者认为这是商业现实，
反对者认为这背叛了 OpenAI 的创立初衷。
`.trim();

async function main() {
  console.log("=== OpenKestrel 编排逻辑验证 ===");
  console.log(`话题：${TOPIC}\n`);

  const results = [];

  for (const soul of SOULS) {
    const output = await runOrchestration(soul, TOPIC, CONTEXT);
    if (output) results.push(output);
  }

  // 存结果到 output/
  const outputDir = join(process.cwd(), "output");
  mkdirSync(outputDir, { recursive: true });

  const filename = `debate-${Date.now()}.json`;
  const filepath = join(outputDir, filename);
  writeFileSync(filepath, JSON.stringify(results, null, 2), "utf-8");

  // 终端打印可读版本
  console.log("\n=== 输出结果 ===\n");
  for (const r of results) {
    console.log(`【${r.soul}】`);
    console.log("─".repeat(60));
    console.log(r.response);
    console.log("\n");
  }

  console.log(`✅ 完整结果已存储至：output/${filename}`);
}

main().catch(console.error);
