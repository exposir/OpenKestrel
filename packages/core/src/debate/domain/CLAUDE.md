<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: domain/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# domain/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「domain/」负责 业务逻辑实现与依赖协作，当前由 `aggregate.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`aggregate.ts`（逻辑实现）、`entities.ts`（逻辑实现）、`valueObjects.ts`（逻辑实现）
- 实现原理：由 `aggregate.ts` 接收入口，再通过 `entities.ts` 和 `valueObjects.ts` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `aggregate.ts`、`entities.ts`、`valueObjects.ts`。
- 调用链路：`aggregate.ts` -> `entities.ts` -> `valueObjects.ts` -> 输出
## 成员清单

- [`aggregate.ts`](./aggregate.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`entities.ts`](./entities.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`valueObjects.ts`](./valueObjects.ts)：TypeScript 实现文件，承载本模块核心逻辑

