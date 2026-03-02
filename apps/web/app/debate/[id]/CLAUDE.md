<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: debate/[id]/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# debate/[id]/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「debate/[id]/」。
- 核心文件：`page.tsx`（页面入口）、`debate-page.module.css`（模块实现）、`DebateToc.module.css`（模块实现）、`DebateToc.tsx`（React 组件实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `page.tsx` 接入调用，再由 `debate-page.module.css` 与 `DebateToc.module.css` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`debate-page.module.css`](./debate-page.module.css)：本目录成员文件，承载对应子能力实现
- [`DebateToc.module.css`](./DebateToc.module.css)：本目录成员文件，承载对应子能力实现
- [`DebateToc.tsx`](./DebateToc.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`page.tsx`](./page.tsx)：页面入口，负责该路由的渲染与交互

