<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: di/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# di/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于di/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [tokens.ts](./tokens.ts): Core 端口注入 token 常量。

法则: DI 仅保留 token 契约·避免服务定位器反模式
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
