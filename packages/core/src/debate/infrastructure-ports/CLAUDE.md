<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: infrastructure-ports/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# infrastructure-ports/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「infrastructure-ports/」负责 业务逻辑实现与依赖协作，当前由 `debateRepository.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`debateRepository.ts`（逻辑实现）、`llmGateway.ts`（逻辑实现）
- 实现原理：由 `debateRepository.ts` 负责入口编排，`llmGateway.ts` 负责核心处理与结果产出；异常路径在当前目录内兜底并向上抛出可诊断信息。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `debateRepository.ts`、`llmGateway.ts`。
- 调用链路：`debateRepository.ts` -> `llmGateway.ts` -> 输出
## 成员清单

- [`debateRepository.ts`](./debateRepository.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`llmGateway.ts`](./llmGateway.ts)：TypeScript 实现文件，承载本模块核心逻辑

