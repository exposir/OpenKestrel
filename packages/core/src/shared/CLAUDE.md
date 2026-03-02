<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: shared/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# shared/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于shared/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [errors.ts](./errors.ts): Core 共享错误类型。

法则: 共享层轻量且通用·避免业务泄漏·跨子域复用
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
