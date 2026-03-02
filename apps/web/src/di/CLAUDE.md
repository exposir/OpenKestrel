<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块边界、packages/core 的 ports 与 token 约定
- [OUTPUT]: 提供 src/di/ 的成员清单、装配规则与依赖注入边界
- [POS]: apps/web/src/di/ 的 L2 模块地图（服务端 composition root）
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# src/di/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「src/di/」实现具体业务能力，当前重点是 依赖注入装配入口，负责实例注册与组装。
- 核心文件：`container.ts`。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`container.ts`](./container.ts)：依赖注入装配入口，负责实例注册与组装

