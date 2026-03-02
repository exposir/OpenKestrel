<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块边界、packages/core 的 ports 与 token 约定
- [OUTPUT]: 提供 src/di/ 的成员清单、装配规则与依赖注入边界
- [POS]: apps/web/src/di/ 的 L2 模块地图（服务端 composition root）
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# src/di/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

成员清单 [container.ts](./container.ts): DI composition root（`tsyringe`），集中注册 `@openkestrel/core` ports 的运行时实现（LLM 网关、Debate/Search 仓储）。

法则: 仅此目录允许装配依赖·route 不直接 `new` 基础设施实现·token 来源统一为 `@openkestrel/core` 的 `TOKENS`
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
