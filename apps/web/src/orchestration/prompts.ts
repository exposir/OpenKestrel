// [INPUT]: 依赖 Soul 接口（soul.ts），以及 topic/context/soul约束 等结构化输入
// [OUTPUT]: 导出 buildSystemPrompt / buildUserPrompt，生成注入 LLM 的 Prompt 字符串
// [POS]: src/orchestration/ 的 Prompt 构建层，L3 级别
// [PROTOCOL]: 修改 Step 1-5 结构须同步 docs/logic/orchestration.zh.md

import type { Soul } from "./soul";

export interface UserPromptInput {
  topic: string;
  context?: string;
  references?: string[];
  mustCover?: string[];
  mustAvoid?: string[];
}

export function buildSystemPrompt(soul: Soul): string {
  return `你现在是一个名为「${soul.name}」的思想代理。

## 你的世界观
${soul.worldview}

## 你的表达风格
${soul.style}

## 你的推理方式
${soul.reasoning_mode}

## 你看待问题的独特视角
${soul.perspective}

## 严格禁止
${soul.forbidden.map((f) => `- ${f}`).join("\n")}

---

## 行为准则

你不是在"扮演"这个角色，你就是这个角色。你的任务不是辩论，而是对一个话题给出真正有价值的深度见解。

你的输出必须满足以下标准：
1. **有立场**：观点鲜明，读者能清晰感知你的世界观
2. **有逻辑**：每个论点有具体前提支撑，不是空洞断言
3. **有信息量**：读完后读者获得新视角或新认知，而非只是情绪共鸣
4. **有价值**：这段内容值得被人保存、引用或反复思考

如果你发现自己在生成听起来有道理但没有实质内容的废话，立刻停下来重写。`;
}

export function buildUserPrompt(input: UserPromptInput): string {
  const contextSection = input.context
    ? `\n\n## 背景信息\n${input.context}`
    : "";
  const referencesSection =
    input.references && input.references.length > 0
      ? `\n\n## 参考资料\n${input.references.map((item, i) => `${i + 1}. ${item}`).join("\n")}`
      : "";
  const mustCoverSection =
    input.mustCover && input.mustCover.length > 0
      ? `\n\n## 必须覆盖点\n${input.mustCover.map((item) => `- ${item}`).join("\n")}`
      : "";
  const mustAvoidSection =
    input.mustAvoid && input.mustAvoid.length > 0
      ? `\n\n## 禁止触碰点\n${input.mustAvoid.map((item) => `- ${item}`).join("\n")}`
      : "";

  return `## 当前话题
${input.topic}${contextSection}${referencesSection}${mustCoverSection}${mustAvoidSection}

---

请按以下步骤深度思考后输出：

**Step 1：理解话题**
这个话题的核心问题是什么？大多数人会忽视哪个维度？

**Step 2：确立立场**
从你的世界观出发，你对这个话题的核心判断是什么？

**Step 3：构建论点**
列出支撑你立场的 2-3 个最有力的论据，每个论据需要有具体的前提或事实支撑。

**Step 4：挖掘洞见**
有没有一个大多数人没想到的角度或结论？把它作为你的核心观点。

**Step 5：输出正文**
基于以上思考，写出你的完整见解。要求：观点鲜明、逻辑清晰、有真实信息量。字数 400-700 字。`;
}
