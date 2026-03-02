/**
 * - [INPUT]: 无框架依赖，仅定义 LLM 消息结构与流式契约
 * - [OUTPUT]: 导出 LlmMessage / LlmGateway port
 * - [POS]: debate 基础设施端口层，隔离 use case 与具体模型供应商实现
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface LlmGateway {
  stream(
    messages: LlmMessage[],
    onChunk: (chunk: string) => void,
  ): Promise<string>;
}
