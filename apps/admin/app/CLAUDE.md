<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: app/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# app/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「app/」。
- 核心文件：`layout.tsx`（布局入口）、`page.tsx`（页面入口）。
- 实现原理：采用双文件协作：`layout.tsx` 负责入口与编排，`page.tsx` 负责核心处理并输出结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `audits/`；同级协作见本文件“成员清单”。
## 成员清单

- [`audits/`](./audits)：子模块目录，承载该子域实现
- [`globals.css`](./globals.css)：本目录成员文件，承载对应子能力实现
- [`layout.tsx`](./layout.tsx)：布局入口，负责该层级页面骨架
- [`page.tsx`](./page.tsx)：页面入口，负责该路由的渲染与交互

