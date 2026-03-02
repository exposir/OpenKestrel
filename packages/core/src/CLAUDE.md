<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: src/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于src/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [index.ts](./index.ts): Core 对外统一导出入口。
成员清单 [debate/CLAUDE.md](./debate/CLAUDE.md): Debate 子域模块地图。
成员清单 [search/CLAUDE.md](./search/CLAUDE.md): Search 子域模块地图。
成员清单 [di/CLAUDE.md](./di/CLAUDE.md): DI 协议模块地图。
成员清单 [shared/CLAUDE.md](./shared/CLAUDE.md): 共享类型与错误模块地图。

法则: 按 DDD/ports 分层·导出面集中·禁止框架耦合
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
