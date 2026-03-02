<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 OPENKESTREL_DATA_DIR 共享目录约定
- [OUTPUT]: 提供 apps/admin 的模块职责与运行说明
- [POS]: apps/admin 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/admin/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「apps/admin/」。
- 核心文件：`package.json`（项目配置）、`proxy.ts`（TypeScript 业务实现）、`README.md`（模块文档与规范）、`tsconfig.json`（项目配置）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `package.json` 接入调用，再由 `proxy.ts` 与 `README.md` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 `app/`、`lib/`；同级协作见本文件“成员清单”。
## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`lib/`](./lib)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`proxy.ts`](./proxy.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数

