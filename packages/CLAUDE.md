<!--
- [INPUT]: 依赖 /CLAUDE.md 的 monorepo 模块边界与文档协议
- [OUTPUT]: 提供 packages/ 工作区的模块地图
- [POS]: packages/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/
> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「packages/」。
- 核心文件：`core/`（模块实现）、`dep-graph/`（模块实现）、`theme-motion/`（模块实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `core/` 接入调用，再由 `dep-graph/` 与 `theme-motion/` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `core/`、`dep-graph/`、`theme-motion/`；同级协作见本文件“成员清单”。
## 成员清单

- [`core/`](./core)：子模块目录，承载该子域实现
- [`dep-graph/`](./dep-graph)：子模块目录，承载该子域实现
- [`theme-motion/`](./theme-motion)：子模块目录，承载该子域实现

