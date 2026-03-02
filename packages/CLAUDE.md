<!--
- [INPUT]: 依赖 /CLAUDE.md 的 monorepo 模块边界与文档协议
- [OUTPUT]: 提供 packages/ 工作区的模块地图
- [POS]: packages/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# packages/

> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「packages/」接收 monorepo 的包级能力装配需求，统一管理可复用包边界并向应用层输出可安装依赖；输入是 workspace 约束与包发布配置，输出是 `core/`、`dep-graph/`、`theme-motion/` 三个子包的稳定消费入口；本目录不承载具体业务流程实现。
- 核心文件：`core/`（子模块边界）、`dep-graph/`（子模块边界）、`theme-motion/`（子模块边界）
- 实现原理：以工作区边界和子包目录为装配骨架，构建时由各子包各自的 `package.json` 与 `src/` 入口完成编译与导出；失败路径主要由包管理器与构建工具在安装/构建阶段直接报错。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `core/`、`dep-graph/`、`theme-motion/`。
- 调用链路：`workspace 包边界` -> `core/dep-graph/theme-motion 子包装配` -> 输出

## 成员清单

- [`core/`](./core)：子模块目录，承载该子域实现
- [`dep-graph/`](./dep-graph)：子模块目录，承载该子域实现
- [`theme-motion/`](./theme-motion)：子模块目录，承载该子域实现
