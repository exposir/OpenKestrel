<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块地图，及 docs/logic/orchestration.zh.md 的编排设计
- [OUTPUT]: 提供 orchestration/ 各文件的接口约定与变更规则
- [POS]: src/orchestration/ 的 L3 级别规范
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/orchestration/ - 意图编译引擎

> L3 | Parent: [src/CLAUDE.md](../CLAUDE.md)

## 数据流

```
Soul (soul.ts)
  ↓ buildSystemPrompt()
Prompt (prompts.ts)
  ↓ callDeepSeekStream() / callDeepSeek()
engine.ts
  ├── 流式路径：callDeepSeekStream → onChunk 回调 → 调用方推流
  └── 批量路径：runOrchestration → entropyCheck → DebateOutput | null
```

## 接口约定

### `Soul` (soul.ts)

```ts
interface Soul {
  id: string;            // 人格稳定标识，用于前后端传递
  name: string;          // 人格名称，用于展示
  worldview: string;     // 核心立场，注入 System Prompt
  style: string;         // 表达风格
  reasoning_mode: string;
  perspective: string;   // 独特视角
  forbidden: string[];   // 禁止行为列表
}
```

### `callDeepSeekStream` (engine.ts)

- 使用 `deepseek-chat` 模型，`stream: true`
- 每个 token chunk 触发 `onChunk(chunk: string)` 回调
- 返回完整拼接字符串

### `runOrchestration` (engine.ts)

- 使用 `deepseek-reasoner` 模型（非流式）
- 内置 `entropyCheck`：不通过则返回 `null`，调用方跳过该结果
- 从输出中提取 Step 5 正文作为 `response`，其余为 `reasoning`

### `buildUserPrompt` (prompts.ts)

- 输入对象字段：`topic/context/references/mustCover/mustAvoid`
- 非空字段按块注入到 User Prompt，保持 Step 1-5 主结构不变

## 变更规则

- 修改 Prompt 结构（Step 1-5）需同步更新 `docs/logic/orchestration.zh.md`
- 新增 LLM 调用函数只能在 `engine.ts` 内
- `entropyCheck` 失败默认通过（防止校验解析异常导致全量丢弃）
