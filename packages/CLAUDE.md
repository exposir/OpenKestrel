<!--
- [INPUT]: 依赖 /CLAUDE.md 的 monorepo 模块边界与文档协议
- [OUTPUT]: 提供 packages/ 工作区的模块地图
- [POS]: packages/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/

> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「packages/」负责 模块能力组织与对外暴露，当前由 `core/` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`core/`（子模块）、`dep-graph/`（子模块）、`theme-motion/`（子模块）
- 实现原理：由 `core/` 接收入口，再通过 `dep-graph/` 和 `theme-motion/` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `core/`、`dep-graph/`、`theme-motion/`。
- 调用链路：`core/` -> `dep-graph/` -> `theme-motion/` -> 输出

## 成员清单

- [`core/`](./core)：子模块目录，承载该子域实现
- [`dep-graph/`](./dep-graph)：子模块目录，承载该子域实现
- [`theme-motion/`](./theme-motion)：子模块目录，承载该子域实现
