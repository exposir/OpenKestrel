<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引与 OPENKESTREL_DATA_DIR 环境变量
- [OUTPUT]: 提供 src/storage/ 的路径约定与共享目录策略
- [POS]: src/storage/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/storage/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「src/storage/」实现具体业务能力，当前重点是 TypeScript 实现文件，承载本模块核心逻辑。
- 核心文件：`adapter.ts`、`paths.ts`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`adapter.ts`](./adapter.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`paths.ts`](./paths.ts)：TypeScript 实现文件，承载本模块核心逻辑

