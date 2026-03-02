<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: app/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# app/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「app/」负责 模块能力组织与对外暴露，当前由 `page.tsx` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`page.tsx`（页面入口）、`layout.tsx`（布局入口）、`globals.css`（模块实现）
- 实现原理：由 `page.tsx` 接收入口，再通过 `layout.tsx` 和 `globals.css` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `audits/`、`globals.css`、`layout.tsx`、`page.tsx`。
- 调用链路：`page.tsx` -> `layout.tsx` -> `globals.css` -> 输出

## 成员清单

- [`audits/`](./audits)：子模块目录，承载该子域实现
- [`globals.css`](./globals.css)：本目录成员文件，承载对应子能力实现
- [`layout.tsx`](./layout.tsx)：布局入口，负责该层级页面骨架
- [`page.tsx`](./page.tsx)：页面入口，负责该路由的渲染与交互
