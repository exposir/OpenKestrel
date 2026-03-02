<!--
- [INPUT]: 依赖 /CLAUDE.md 的 monorepo 模块边界与文档协议
- [OUTPUT]: 提供 packages/ 工作区的模块地图
- [POS]: packages/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/
> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「packages/」实现具体业务能力，当前重点是 子模块目录，承载该子域实现。
- 核心文件：以成员清单中的入口与实现文件为核心。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `core/`、`dep-graph/`、`theme-motion/`；相关实现见本文件“成员清单”。
## 成员清单

- [`core/`](./core)：子模块目录，承载该子域实现
- [`dep-graph/`](./dep-graph)：子模块目录，承载该子域实现
- [`theme-motion/`](./theme-motion)：子模块目录，承载该子域实现

