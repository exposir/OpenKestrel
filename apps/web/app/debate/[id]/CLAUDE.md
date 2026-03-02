<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: debate/[id]/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# debate/[id]/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于debate/[id]/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [page.tsx](./page.tsx): 讨论详情页 Server Component。
成员清单 [DebateToc.tsx](./DebateToc.tsx): 讨论目录导航组件。
成员清单 [debate-page.module.css](./debate-page.module.css): 详情页样式模块。
成员清单 [DebateToc.module.css](./DebateToc.module.css): 目录组件样式模块。

法则: 详情页与目录组件分离·样式模块化·路由参数单源
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
