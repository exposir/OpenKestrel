<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 OPENKESTREL_DATA_DIR 环境变量
- [OUTPUT]: 提供 src/storage/ 的路径约定与共享目录策略
- [POS]: src/storage/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/storage/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「src/storage/」。
- 核心文件：`adapter.ts`（外部适配与驱动切换）、`paths.ts`（路径与资源定位）。
- 实现原理：采用双文件协作：`adapter.ts` 负责入口与编排，`paths.ts` 负责核心处理并输出结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`adapter.ts`](./adapter.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`paths.ts`](./paths.ts)：TypeScript 实现文件，承载本模块核心逻辑

