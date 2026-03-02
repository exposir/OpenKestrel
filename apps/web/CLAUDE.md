<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法与 monorepo 目录约定
- [OUTPUT]: 提供 apps/web 的模块地图、依赖边界与运行规则
- [POS]: apps/web 的 L2 模块地图（前台主应用）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/web/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「apps/web/」实现具体业务能力，当前重点是 子模块目录，承载该子域实现。
- 核心文件：`next-env.d.ts`、`next.config.ts`、`package.json`、`tsconfig.json`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 `app/`、`node_modules/`、`src/`；相关实现见本文件“成员清单”。
## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`next-env.d.ts`](./next-env.d.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`next.config.ts`](./next.config.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`node_modules/`](./node_modules)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数
- [`tsconfig.tsbuildinfo`](./tsconfig.tsbuildinfo)：本目录成员文件，承载对应子能力实现

