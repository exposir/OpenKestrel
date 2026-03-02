<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: logic/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# logic/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「logic/」负责 文档规范沉淀与知识索引，当前由 `api-design.zh.md` 等文件对外提供能力，典型使用场景是开发者查阅方案与规则时。
- 核心文件：`api-design.zh.md`（规则文档）、`architecture.zh.md`（规则文档）、`core-di-architecture.zh.md`（规则文档）、`orchestration.zh.md`（规则文档）
- 实现原理：由 `api-design.zh.md` 接收入口，再通过 `architecture.zh.md` 和 `core-di-architecture.zh.md` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `api-design.zh.md`、`architecture.zh.md`、`core-di-architecture.zh.md`、`orchestration.zh.md`。
- 调用链路：`api-design.zh.md` -> `architecture.zh.md` -> `core-di-architecture.zh.md` -> 输出
## 成员清单

- [`api-design.zh.md`](./api-design.zh.md)：文档文件，记录该模块规范与说明
- [`architecture.zh.md`](./architecture.zh.md)：文档文件，记录该模块规范与说明
- [`core-di-architecture.zh.md`](./core-di-architecture.zh.md)：文档文件，记录该模块规范与说明
- [`orchestration.zh.md`](./orchestration.zh.md)：文档文件，记录该模块规范与说明
- [`roadmap.zh.md`](./roadmap.zh.md)：文档文件，记录该模块规范与说明
- [`safety.zh.md`](./safety.zh.md)：文档文件，记录该模块规范与说明

