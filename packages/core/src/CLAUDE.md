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
- 核心文件：`index.ts`（TypeScript 业务实现）。
- 实现原理：采用单入口实现：由 `index.ts` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `debate/`、`di/`、`search/`、`shared/`；同级协作见本文件“成员清单”。
## 成员清单

- [`debate/`](./debate)：子模块目录，承载该子域实现
- [`di/`](./di)：子模块目录，承载该子域实现
- [`index.ts`](./index.ts)：模块导出或入口文件，聚合对外能力
- [`search/`](./search)：子模块目录，承载该子域实现
- [`shared/`](./shared)：子模块目录，承载该子域实现

