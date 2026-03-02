<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: analyzer/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# analyzer/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「analyzer/」实现具体业务能力，当前重点是 模块导出或入口文件，聚合对外能力。
- 核心文件：`index.ts`、`path-utils.ts`、`scan.ts`、`tsconfig.ts`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`index.ts`](./index.ts)：模块导出或入口文件，聚合对外能力
- [`path-utils.ts`](./path-utils.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`scan.ts`](./scan.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`tsconfig.ts`](./tsconfig.ts)：TypeScript 实现文件，承载本模块核心逻辑

