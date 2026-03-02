<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引，及 app/api/auth + app/api/orchestrate 的事件上下文
- [OUTPUT]: 提供 src/audit/ 的日志写入职责与接口约定
- [POS]: src/audit/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/audit/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「src/audit/」实现具体业务能力，当前重点是 TypeScript 实现文件，承载本模块核心逻辑。
- 核心文件：`logger.ts`。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`logger.ts`](./logger.ts)：TypeScript 实现文件，承载本模块核心逻辑

