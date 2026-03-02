<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 monorepo 目录结构（apps/web + 仓库根）
- [OUTPUT]: 提供 src/env/ 的环境变量加载职责与优先级约定
- [POS]: src/env/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/env/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「src/env/」负责 业务逻辑实现与依赖协作，当前由 `load.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`load.ts`（逻辑实现）
- 实现原理：由 `load.ts` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `load.ts`。
- 调用链路：`load.ts` -> 输出
## 成员清单

- [`load.ts`](./load.ts)：TypeScript 实现文件，承载本模块核心逻辑

