import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts";
import type { Soul } from "./soul.ts";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DebateOutput {
  soul: string;
  topic: string;
  reasoning: string;
  response: string;
  timestamp: string;
}

async function callDeepSeek(messages: Message[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY 未设置");

  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages,
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API 错误: ${err}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

// 流式调用 DeepSeek，每个 chunk 回调
export async function callDeepSeekStream(
  messages: Message[],
  onChunk: (chunk: string) => void
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY 未设置");

  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.8,
      max_tokens: 2000,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API 错误: ${err}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") break;
      try {
        const json = JSON.parse(data);
        const chunk = json.choices?.[0]?.delta?.content ?? "";
        if (chunk) {
          full += chunk;
          onChunk(chunk);
        }
      } catch {}
    }
  }

  return full;
}

// 信息熵校验
async function entropyCheck(
  content: string,
  topic: string
): Promise<{ pass: boolean; reason: string }> {
  const messages: Message[] = [
    {
      role: "system",
      content:
        "你是一个内容质量审核员。你的唯一职责是判断一段发言是否包含真实的信息量和有效的论证，还是只是听起来很有道理的废话。",
    },
    {
      role: "user",
      content: `话题：${topic}\n\n待审核发言：\n${content}\n\n请判断这段发言是否通过质量校验。标准：\n1. 是否有明确的立场？\n2. 论点是否有实质性前提支撑（不是空洞断言）？\n3. 读完后是否获得了新视角或信息？\n\n只回答 JSON 格式：{"pass": true/false, "reason": "一句话说明原因"}`,
    },
  ];

  const result = await callDeepSeek(messages);
  try {
    const json = result.match(/\{.*\}/s)?.[0] ?? "{}";
    return JSON.parse(json);
  } catch {
    return { pass: true, reason: "校验解析失败，默认通过" };
  }
}

export async function runOrchestration(
  soul: Soul,
  topic: string,
  context?: string
): Promise<DebateOutput | null> {
  const messages: Message[] = [
    { role: "system", content: buildSystemPrompt(soul) },
    { role: "user", content: buildUserPrompt(topic, context) },
  ];

  const raw = await callDeepSeek(messages);
  const step5Match = raw.match(/\*\*Step 5[^\n]*\n([\s\S]+)$/);
  const response = step5Match ? step5Match[1].trim() : raw.trim();
  const reasoning = step5Match ? raw.slice(0, raw.indexOf("**Step 5")).trim() : "";

  const check = await entropyCheck(response, topic);
  if (!check.pass) return null;

  return {
    soul: soul.name,
    topic,
    reasoning,
    response,
    timestamp: new Date().toISOString(),
  };
}

