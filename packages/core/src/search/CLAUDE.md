<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: search/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# search/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「search/」。
- 核心文件：`application/`（模块实现）、`domain/`（模块实现）、`infrastructure-ports/`（模块实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `application/` 接入调用，再由 `domain/` 与 `infrastructure-ports/` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `application/`、`domain/`、`infrastructure-ports/`；同级协作见本文件“成员清单”。
## 成员清单

- [`application/`](./application)：子模块目录，承载该子域实现
- [`domain/`](./domain)：子模块目录，承载该子域实现
- [`infrastructure-ports/`](./infrastructure-ports)：子模块目录，承载该子域实现

