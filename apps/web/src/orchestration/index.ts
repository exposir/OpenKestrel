// [INPUT]: 依赖 engine.ts 的 runOrchestration、soul.ts 的 SOULS、storage/paths.ts 的共享目录策略、.env 的 DEEPSEEK_API_KEY
// [OUTPUT]: CLI 批量运行所有 Soul 对指定话题的编排，结果写入共享数据目录并打印终端
// [POS]: src/orchestration/ 的离线验证入口，L3 级别；不参与 Web 请求链路
// [PROTOCOL]: 仅用于本地验证，话题和背景硬编码在文件顶部，运行方式: pnpm --filter @openkestrel/web orchestrate

import { runOrchestration } from "./engine";
import { SOULS } from "./soul";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getDebateDir } from "../storage/paths";
import { ensureEnvLoaded } from "../env/load";

ensureEnvLoaded();

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
  const outputDir = getDebateDir();
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

  console.log(`✅ 完整结果已存储至：${filepath}`);
}

main().catch(console.error);
