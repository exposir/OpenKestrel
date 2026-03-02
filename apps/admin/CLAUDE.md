<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 OPENKESTREL_DATA_DIR 共享目录约定
- [OUTPUT]: 提供 apps/admin 的模块职责与运行说明
- [POS]: apps/admin 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# apps/admin/

> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「apps/admin/」接收管理后台运行与构建输入，装配 Next.js 配置、代理入口与业务页面目录并输出可运行后台；输入是环境变量、workspace 脚本与框架配置，输出是 admin 应用进程与构建产物；本目录不直接承载帖子领域业务实现。
- 核心文件：`proxy.ts`（业务逻辑实现）、`package.json`（包定义与脚本约束）、`tsconfig.json`（TypeScript 编译配置）、`app/`（子模块边界）
- 实现原理：通过应用脚本与代理入口将请求导向 `app/` 页面与 `lib/` 数据访问能力，再由 Next.js 完成渲染与路由分发；失败路径由框架和工具链在启动/构建时直接报错。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `proxy.ts`、`package.json`、`tsconfig.json`。
- 调用链路：`应用脚本入口` -> `app/ + lib/ 装配` -> 输出

## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`lib/`](./lib)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`proxy.ts`](./proxy.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数
