<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 OPENKESTREL_DATA_DIR 环境变量
- [OUTPUT]: 提供 src/storage/ 的路径约定与共享目录策略
- [POS]: src/storage/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/storage/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「src/storage/」负责 业务逻辑实现与依赖协作，当前由 `adapter.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`adapter.ts`（驱动适配）、`paths.ts`（路径解析）
- 实现原理：由 `adapter.ts` 负责入口编排，`paths.ts` 负责核心处理与结果产出；异常路径在当前目录内兜底并向上抛出可诊断信息。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `adapter.ts`、`paths.ts`。
- 调用链路：`adapter.ts` -> `paths.ts` -> 输出
## 成员清单

- [`adapter.ts`](./adapter.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`paths.ts`](./paths.ts)：TypeScript 实现文件，承载本模块核心逻辑

