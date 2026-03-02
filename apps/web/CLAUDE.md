<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法与 monorepo 目录约定
- [OUTPUT]: 提供 apps/web 的模块地图、依赖边界与运行规则
- [POS]: apps/web 的 L2 模块地图（前台主应用）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/web/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「apps/web/」。
- 核心文件：`next.config.ts`（TypeScript 业务实现）、`package.json`（项目配置）、`tsconfig.json`（项目配置）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `next.config.ts` 接入调用，再由 `package.json` 与 `tsconfig.json` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 `app/`、`src/`；同级协作见本文件“成员清单”。
## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`next.config.ts`](./next.config.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数

