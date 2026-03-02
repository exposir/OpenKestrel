<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块边界、packages/core 的 ports 与 token 约定
- [OUTPUT]: 提供 src/di/ 的成员清单、装配规则与依赖注入边界
- [POS]: apps/web/src/di/ 的 L2 模块地图（服务端 composition root）
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# src/di/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「src/di/」负责 业务逻辑实现与依赖协作，当前由 `container.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`container.ts`（依赖装配）
- 实现原理：由 `container.ts` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `container.ts`。
- 调用链路：`container.ts` -> 输出
## 成员清单

- [`container.ts`](./container.ts)：依赖注入装配入口，负责实例注册与组装

