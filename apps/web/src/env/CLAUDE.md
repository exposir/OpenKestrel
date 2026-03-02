<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 monorepo 目录结构（apps/web + 仓库根）
- [OUTPUT]: 提供 src/env/ 的环境变量加载职责与优先级约定
- [POS]: src/env/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/env/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「src/env/」实现具体业务能力，当前重点是 TypeScript 实现文件，承载本模块核心逻辑。
- 核心文件：`load.ts`。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`load.ts`](./load.ts)：TypeScript 实现文件，承载本模块核心逻辑

