<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块边界、packages/core 的 ports 与 token 约定
- [OUTPUT]: 提供 src/di/ 的成员清单、装配规则与依赖注入边界
- [POS]: apps/web/src/di/ 的 L2 模块地图（服务端 composition root）
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# src/di/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「src/di/」。
- 核心文件：`container.ts`（依赖注入装配）。
- 实现原理：采用单入口实现：由 `container.ts` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`container.ts`](./container.ts)：依赖注入装配入口，负责实例注册与组装

