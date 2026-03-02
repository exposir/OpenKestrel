<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 OPENKESTREL_DATA_DIR 共享目录约定
- [OUTPUT]: 提供 apps/admin 的模块职责与运行说明
- [POS]: apps/admin 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/admin/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「apps/admin/」实现具体业务能力，当前重点是 子模块目录，承载该子域实现。
- 核心文件：`next-env.d.ts`、`package.json`、`proxy.ts`、`README.md`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 `app/`、`lib/`、`node_modules/`；相关实现见本文件“成员清单”。
## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`lib/`](./lib)：子模块目录，承载该子域实现
- [`next-env.d.ts`](./next-env.d.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`node_modules/`](./node_modules)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`proxy.ts`](./proxy.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数

