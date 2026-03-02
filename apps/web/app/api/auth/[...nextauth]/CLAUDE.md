<!--
- [INPUT]: 依赖 ../../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: auth/[...nextauth]/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/[...nextauth]/
> L2 | 父级: [../../CLAUDE.md](../../CLAUDE.md)


## 模块功能综述

该目录主要用于auth/[...nextauth]/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [route.ts](./route.ts): NextAuth 路由处理（登录/回调/会话）。

法则: 认证路由单一入口·Provider 按配置启用·会话策略集中
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
