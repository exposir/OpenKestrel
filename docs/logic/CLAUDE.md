<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: logic/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# logic/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：沉淀项目文档规范，负责设计说明、约束定义与知识索引，对应目录「logic/」。
- 核心文件：`api-design.zh.md`（模块文档与规范）、`architecture.zh.md`（模块文档与规范）、`core-di-architecture.zh.md`（模块文档与规范）、`orchestration.zh.md`（模块文档与规范）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `api-design.zh.md` 接入调用，再由 `architecture.zh.md` 与 `core-di-architecture.zh.md` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`api-design.zh.md`](./api-design.zh.md)：文档文件，记录该模块规范与说明
- [`architecture.zh.md`](./architecture.zh.md)：文档文件，记录该模块规范与说明
- [`core-di-architecture.zh.md`](./core-di-architecture.zh.md)：文档文件，记录该模块规范与说明
- [`orchestration.zh.md`](./orchestration.zh.md)：文档文件，记录该模块规范与说明
- [`roadmap.zh.md`](./roadmap.zh.md)：文档文件，记录该模块规范与说明
- [`safety.zh.md`](./safety.zh.md)：文档文件，记录该模块规范与说明

