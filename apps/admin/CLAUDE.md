<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 OPENKESTREL_DATA_DIR 共享目录约定
- [OUTPUT]: 提供 apps/admin 的模块职责与运行说明
- [POS]: apps/admin 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/admin/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「apps/admin/」负责 模块能力组织与对外暴露，当前由 `package.json` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`package.json`（配置）、`proxy.ts`（逻辑实现）、`README.md`（规则文档）、`tsconfig.json`（配置）
- 实现原理：由 `package.json` 接收入口，再通过 `proxy.ts` 和 `README.md` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `app/`、`lib/`、`package.json`、`proxy.ts`。
- 调用链路：`package.json` -> `proxy.ts` -> `README.md` -> 输出
## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`lib/`](./lib)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`proxy.ts`](./proxy.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数

