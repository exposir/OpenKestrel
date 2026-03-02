<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块边界、packages/core 的 ports 与 token 约定
- [OUTPUT]: 提供 src/di/ 的成员清单、装配规则与依赖注入边界
- [POS]: apps/web/src/di/ 的 L2 模块地图（服务端 composition root）
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/di/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「di/」接收上游模块调用并围绕 `container.ts` 组织业务处理链路，输出可复用的函数、类型或端口能力；输入是业务参数、依赖注入对象或环境上下文，输出是确定性处理结果；本目录不负责页面展示层。
- 核心文件：`container.ts`（业务逻辑实现）
- 实现原理：由 `container.ts` 作为导入入口，按同级依赖完成处理并向上层返回结果；失败路径通过显式异常或错误对象上抛给调用方统一处置。
- 相关文件：上游规范 [src/CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `container.ts`。
- 调用链路：`container.ts` -> `../orchestration/engine.ts` -> `../orchestration/prompts.ts` -> 输出

## 成员清单

- [`container.ts`](./container.ts)：依赖注入装配入口，负责实例注册与组装
