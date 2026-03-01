<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 monorepo 目录结构（apps/web + 仓库根）
- [OUTPUT]: 提供 src/env/ 的环境变量加载职责与优先级约定
- [POS]: src/env/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/env/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

成员清单 [load.ts](./load.ts): 统一加载 `.env.local/.env`（优先 `apps/web`，再回退仓库根），导出 `ensureEnvLoaded`。

法则: 兼容 monorepo cwd 差异·仅服务端调用·加载顺序稳定可预测
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
