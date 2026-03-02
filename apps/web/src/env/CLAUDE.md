<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 monorepo 目录结构（apps/web + 仓库根）
- [OUTPUT]: 提供 src/env/ 的环境变量加载职责与优先级约定
- [POS]: src/env/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/env/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「src/env/」。
- 核心文件：`load.ts`（TypeScript 业务实现）。
- 实现原理：采用单入口实现：由 `load.ts` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`load.ts`](./load.ts)：TypeScript 实现文件，承载本模块核心逻辑

