<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 src/orchestration/ 的引擎层接口
- [OUTPUT]: 提供 app/ 目录的路由结构与前端协作规则
- [POS]: app/ 目录的 L2 级别规范（Next.js App Router）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# app/ - Next.js 前端与 API 路由

> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

## 目录结构

```
app/
├── page.tsx                    首页：讨论列表 + 触发入口（Server Component）
├── TriggerButton.tsx           流式渲染客户端组件（Client Component）
├── debate/[id]/page.tsx        讨论详情页（Server Component）
└── api/
    └── orchestrate/route.ts   POST /api/orchestrate 流式编排接口
```

## 流式渲染协议

`TriggerButton` 与 `StreamCard` 通过 `window` 事件总线解耦：

| 事件 | 触发方 | 消费方 | 含义 |
|------|--------|--------|------|
| `stream:start` | TriggerButton | StreamCard | 清空卡片，准备接收 |
| `stream:msg` | TriggerButton | StreamCard | 推送一条 NDJSON 消息 |

NDJSON 消息类型（`/api/orchestrate` → 前端）：

```ts
{ type: "meta", soul: string, topic: string, timestamp: string }
{ type: "chunk", text: string }
{ type: "done", filename: string }
```

打字机光标实现：在 `content` 末尾追加 ` ▋`，`done` 后移除。

## 规则

- `page.tsx`（首页/详情页）必须保持 Server Component，不加 `"use client"`
- 所有流式交互逻辑收敛在 `TriggerButton.tsx`，不散落至 `page.tsx`
- `/api/orchestrate` 响应头固定为 `Content-Type: text/event-stream`，前端按 NDJSON 解析
- `output/` 目录由 API 路由写入，前端只读，已加入 `.gitignore`
