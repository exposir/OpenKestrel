<!--
- [INPUT]: 依赖 /CLAUDE.md 的完整协作规则
- [OUTPUT]: OpenAI Agent 协作入口与最小执行清单
- [POS]: 项目根目录，指向 CLAUDE.md
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# OpenKestrel - AI 协作规则 (OpenAI)

> **本文件指向 [CLAUDE.md](./CLAUDE.md)**，完整的项目协作规则、认知架构、GEB 分形文档系统协议均在 CLAUDE.md 中定义。
>
> CLAUDE.md 是跨 AI 通用的项目上下文文件，无论你是哪个 AI Agent，请直接阅读 CLAUDE.md。

## 快速入口

1. 先读根目录 [CLAUDE.md](./CLAUDE.md)（L1 项目宪法）。
2. 进入任一模块前，先读该目录下 `CLAUDE.md`（L2 模块地图）。
3. 修改代码文件前，检查并维护该文件头部 INPUT/OUTPUT/POS 契约（L3）。

## 最小执行清单（OpenAI Agent）

- 只要发生文件级架构变更（创建/删除/移动/重命名），同步更新对应目录 `CLAUDE.md`。
- 只要发生职责或导出变化，更新目标文件 L3 头部契约。
- 完成改动后按 `L3 -> L2 -> L1` 顺序做一次一致性回环检查。
- 若文档与代码不一致，优先修正文档到与代码同构后再结束任务。

## 仓库导航（简版）

- `apps/web/`: 前台主应用（Next.js App Router + 核心业务）。
- `apps/admin/`: 管理后台（审计看板与运营控制台）。
- `docs/`: 产品/架构文档。
- `output/`: 共享数据目录（帖子与审计日志）。

## 约束优先级

1. 用户明确需求
2. 当前 Agent 运行时系统/开发者指令
3. 本文件与 `CLAUDE.md` 的项目规则
