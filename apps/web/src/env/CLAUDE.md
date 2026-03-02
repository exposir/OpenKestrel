<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 monorepo 目录结构（apps/web + 仓库根）
- [OUTPUT]: 提供 src/env/ 的环境变量加载职责与优先级约定
- [POS]: src/env/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/env/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「env/」接收上游模块调用并围绕 `load.ts` 组织业务处理链路，输出可复用的函数、类型或端口能力；输入是业务参数、依赖注入对象或环境上下文，输出是确定性处理结果；本目录不负责页面展示层。
- 核心文件：`load.ts`（业务逻辑实现）
- 实现原理：由 `load.ts` 作为导入入口，按同级依赖完成处理并向上层返回结果；失败路径通过显式异常或错误对象上抛给调用方统一处置。
- 相关文件：上游规范 [src/CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `load.ts`。
- 调用链路：`load.ts` -> 输出

## 成员清单

- [`load.ts`](./load.ts)：TypeScript 实现文件，承载本模块核心逻辑
