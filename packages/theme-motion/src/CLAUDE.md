<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: src/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「src/」。
- 核心文件：`index.ts`（TypeScript 业务实现）、`core.ts`（TypeScript 业务实现）、`react.ts`（TypeScript 业务实现）、`style.css`（模块实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `index.ts` 接入调用，再由 `core.ts` 与 `react.ts` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`core.ts`](./core.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`index.ts`](./index.ts)：模块导出或入口文件，聚合对外能力
- [`react.ts`](./react.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`style.css`](./style.css)：本目录成员文件，承载对应子能力实现

