<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法与 monorepo 目录约定
- [OUTPUT]: 提供 apps/web 的模块地图、依赖边界与运行规则
- [POS]: apps/web 的 L2 模块地图（前台主应用）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/web/

> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「apps/web/」负责 模块能力组织与对外暴露，当前由 `next.config.ts` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`next.config.ts`（逻辑实现）、`package.json`（配置）、`tsconfig.json`（配置）
- 实现原理：由 `next.config.ts` 接收入口，再通过 `package.json` 和 `tsconfig.json` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `app/`、`next.config.ts`、`package.json`、`src/`。
- 调用链路：`next.config.ts` -> `package.json` -> `tsconfig.json` -> 输出

## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`next.config.ts`](./next.config.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数
