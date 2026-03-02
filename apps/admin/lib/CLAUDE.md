<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: lib/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# lib/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于lib/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [audit.ts](./audit.ts): 审计日志读取与统计聚合库。
成员清单 [storage.ts](./storage.ts): 共享数据目录与存储驱动解析库。

法则: lib 仅放可复用业务库代码·禁止放构建产物
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
