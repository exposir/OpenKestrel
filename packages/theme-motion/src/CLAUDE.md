<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: src/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「src/」负责 业务逻辑实现与依赖协作，当前由 `index.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`index.ts`（逻辑实现）、`core.ts`（逻辑实现）、`react.ts`（逻辑实现）、`style.css`（模块实现）
- 实现原理：由 `index.ts` 接收入口，再通过 `core.ts` 和 `react.ts` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `core.ts`、`index.ts`、`react.ts`、`style.css`。
- 调用链路：`index.ts` -> `core.ts` -> `react.ts` -> 输出
## 成员清单

- [`core.ts`](./core.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`index.ts`](./index.ts)：模块导出或入口文件，聚合对外能力
- [`react.ts`](./react.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`style.css`](./style.css)：本目录成员文件，承载对应子能力实现

