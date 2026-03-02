<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: lib/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# lib/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「lib/」负责 模块能力组织与对外暴露，当前由 `audit.ts` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`audit.ts`（逻辑实现）、`storage.ts`（逻辑实现）
- 实现原理：由 `audit.ts` 负责入口编排，`storage.ts` 负责核心处理与结果产出；异常路径在当前目录内兜底并向上抛出可诊断信息。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `audit.ts`、`storage.ts`。
- 调用链路：`audit.ts` -> `storage.ts` -> 输出

## 成员清单

- [`audit.ts`](./audit.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`storage.ts`](./storage.ts)：TypeScript 实现文件，承载本模块核心逻辑
