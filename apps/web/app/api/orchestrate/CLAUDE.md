<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: orchestrate/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# orchestrate/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于orchestrate/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [route.ts](./route.ts): 讨论编排 API，返回流式 NDJSON。

法则: 编排接口登录前置·DI 单一装配·流式协议稳定
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
