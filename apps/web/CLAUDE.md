<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法与 monorepo 目录约定
- [OUTPUT]: 提供 apps/web 的模块地图、依赖边界与运行规则
- [POS]: apps/web 的 L2 模块地图（前台主应用）
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# apps/web/

> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「apps/web/」接收前台应用的运行与构建输入，装配 Next.js 配置、脚本入口与源码目录边界并输出可运行站点；输入是环境变量、workspace 脚本与框架配置，输出是 web 应用进程与构建产物；本目录不直接定义领域层规则。
- 核心文件：`next.config.ts`（Next.js 运行时配置）、`package.json`（包定义与脚本约束）、`tsconfig.json`（TypeScript 编译配置）、`app/`（子模块边界）
- 实现原理：通过应用脚本与框架配置定位 `app/` 与 `src/` 两条主链路，再由运行时分别加载页面层与核心引擎；失败路径由 Next.js、TypeScript 与依赖解析在启动/构建阶段直接暴露。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `next.config.ts`、`package.json`、`tsconfig.json`。
- 调用链路：`应用脚本入口` -> `app/ + src/ 装配` -> 输出

## 成员清单

- [`app/`](./app)：子模块目录，承载该子域实现
- [`next.config.ts`](./next.config.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.json`](./tsconfig.json)：配置文件，声明运行或构建参数
