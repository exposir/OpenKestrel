<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块宪法，及 ../src/orchestration/ 的引擎层接口
- [OUTPUT]: 提供 app/ 目录的路由结构与前端协作规则
- [POS]: apps/web/app/ 的 L2 级别规范（Next.js App Router）
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# app/ - Next.js 前端与 API 路由

> L2 | Parent: [apps/web/CLAUDE.md](../CLAUDE.md)

## 目录结构

```
app/
├── layout.tsx                  全局根布局：挂载主题样式/ModalProvider/GlobalHotkeys（Server Component）
├── page.tsx                    首页：讨论列表 + 登录态展示 + 触发入口（Server Component）
├── components/
│   ├── AuthButton.tsx          登录/退出按钮（Client Component）
│   ├── GlobalHotkeys.tsx       全局快捷键分发（Cmd/Ctrl+K、?、Esc、Cmd/Ctrl+D）
│   ├── SearchLauncher.tsx      首页搜索触发器（伪输入框，触发 ModalEngine）
│   ├── ComposeDialog.tsx       发帖弹窗内容（话题/人格/高级输入）
│   ├── SearchDialog.tsx        搜索弹窗内容（调用 /api/search）
│   ├── HotkeyHelpDialog.tsx    快捷键帮助弹窗内容
│   ├── TriggerButton.tsx       发起讨论按钮 + 流式渲染卡片（Client Component）
│   ├── ThemeToggle.tsx         明暗主题切换（Client Component）
│   └── modal-engine/
│       ├── ModalProvider.tsx   单实例弹窗状态机与渲染宿主
│       ├── useModalEngine.ts   弹窗控制 Hook
│       ├── modal-types.ts      弹窗类型定义
│       ├── modal-motion.ts     弹窗切换时序常量（单源）
│       └── CLAUDE.md           modal-engine 模块地图
├── debate/[id]/page.tsx        讨论详情页（Server Component）
├── debate/[id]/DebateToc.tsx   讨论详情目录导航（Client Component）
└── api/
    ├── auth/[...nextauth]/route.ts OAuth 回调与会话路由
    ├── orchestrate/route.ts     POST /api/orchestrate 流式编排接口（需登录）
    └── search/route.ts          GET /api/search 全局搜索接口（返回帖子候选）
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
{ type: "error", message: string }
```

打字机光标实现：在 `content` 末尾追加 ` ▋`，`done` 后移除。

## 弹窗管理协议（ModalEngine）

- 弹窗状态单源：`ModalProvider` 维护 `active/phase/exiting`
- 当前仅支持三类弹窗：`compose` / `search` / `hotkey-help`
- 任意时刻仅一个 active 弹窗；切换时使用交叉淡入淡出（cross-fade）
- 快捷键入口统一收敛到 `GlobalHotkeys.tsx`
- `SearchLauncher` / `TriggerButton` 只发起 `open()` 请求，不私有维护弹窗 `open` 状态
- 从 `compose` 切走时，表单草稿按策略清空

## 请求体协议（`POST /api/orchestrate`）

```ts
{
  topic: string;
  context?: string;
  soul_id?: string;      // 人格 ID，无效时返回 400
  references?: string[]; // 参考资料（链接或文本）
  must_cover?: string[]; // 必须覆盖点
  must_avoid?: string[]; // 禁止触碰点
}
```

UI 规则：基础输入默认展示（话题/人格/背景），高级输入（参考资料/覆盖点/禁区）默认折叠。

## 认证规则

- 登录流程由 `/api/auth/[...nextauth]` 处理，Provider 按环境变量动态启用：GitHub / Google OAuth，开发环境默认附带本地账号（credentials）
- 首页公开可读；发起讨论为写操作，必须登录
- `/api/orchestrate` 在服务端先校验登录态，未登录返回 `401`
- 登录与发帖操作会写入 `output/audit/YYYY-MM-DD.jsonl`（JSONL 审计日志）
- 数据读写目录可由 `OPENKESTREL_DATA_DIR` 覆盖（用于 web/admin 同机共享）

## 规则

- `page.tsx`（首页/详情页）必须保持 Server Component，不加 `"use client"`
- 所有流式交互逻辑收敛在 `TriggerButton.tsx`，不散落至 `page.tsx`
- `/api/orchestrate` 响应头固定为 `Content-Type: text/event-stream`，前端按 NDJSON 解析
- `output/` 目录由 API 路由写入，前端只读，已加入 `.gitignore`
