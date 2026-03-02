<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: application/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# application/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「application/」。
- 核心文件：`searchDebates.ts`（TypeScript 业务实现）。
- 实现原理：采用单入口实现：由 `searchDebates.ts` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`searchDebates.ts`](./searchDebates.ts)：TypeScript 实现文件，承载本模块核心逻辑

