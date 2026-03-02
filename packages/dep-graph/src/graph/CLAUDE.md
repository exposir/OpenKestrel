<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: graph/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# graph/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「graph/」负责 业务逻辑实现与依赖协作，当前由 `algorithms.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`algorithms.ts`（逻辑实现）
- 实现原理：由 `algorithms.ts` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `algorithms.ts`。
- 调用链路：`algorithms.ts` -> 输出

## 成员清单

- [`algorithms.ts`](./algorithms.ts)：TypeScript 实现文件，承载本模块核心逻辑
