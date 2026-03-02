<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: search/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# search/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「search/」负责 业务逻辑实现与依赖协作，当前由 `application/` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`application/`（子模块）、`domain/`（子模块）、`infrastructure-ports/`（子模块）
- 实现原理：由 `application/` 接收入口，再通过 `domain/` 和 `infrastructure-ports/` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `application/`、`domain/`、`infrastructure-ports/`。
- 调用链路：`application/` -> `domain/` -> `infrastructure-ports/` -> 输出

## 成员清单

- [`application/`](./application)：子模块目录，承载该子域实现
- [`domain/`](./domain)：子模块目录，承载该子域实现
- [`infrastructure-ports/`](./infrastructure-ports)：子模块目录，承载该子域实现
