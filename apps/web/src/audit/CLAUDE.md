<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引，及 app/api/auth + app/api/orchestrate 的事件上下文
- [OUTPUT]: 提供 src/audit/ 的日志写入职责与接口约定
- [POS]: src/audit/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/audit/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「src/audit/」负责 业务逻辑实现与依赖协作，当前由 `logger.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`logger.ts`（逻辑实现）
- 实现原理：由 `logger.ts` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `logger.ts`。
- 调用链路：`logger.ts` -> 输出

## 成员清单

- [`logger.ts`](./logger.ts)：TypeScript 实现文件，承载本模块核心逻辑
