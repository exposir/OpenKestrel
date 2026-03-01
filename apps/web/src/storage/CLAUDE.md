<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 OPENKESTREL_DATA_DIR 环境变量
- [OUTPUT]: 提供 src/storage/ 的路径约定与共享目录策略
- [POS]: src/storage/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/storage/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

成员清单 [paths.ts](./paths.ts): 统一本地目录路径策略，优先 `OPENKESTREL_DATA_DIR`，否则按 `process.cwd()/output` → `../../output` 回退。
成员清单 [adapter.ts](./adapter.ts): 存储适配器切换层，支持 `STORAGE_DRIVER=local|cf`（当前 `cf` 为接口占位，防误配显式报错）。

法则: 绝对路径优先·默认值可运行·单一真相源管理读写目录
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
