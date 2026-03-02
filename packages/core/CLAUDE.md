<!--
- [INPUT]: 依赖 /CLAUDE.md 的分形文档协议与 packages/ 约定
- [OUTPUT]: 提供 @openkestrel/core 的模块地图、边界与公开接口
- [POS]: packages/core 的 L2 模块地图（纯业务内核）
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# packages/core/

> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「packages/core/」接收领域内核的构建与发布输入，组织 `src/` 对外导出稳定业务能力；输入是包配置、构建脚本与源码目录，输出是可被 web/admin 复用的 core 库；本目录不负责 UI 与路由渲染。
- 核心文件：`package.json`（包定义与脚本约束）、`tsconfig.build.json`（TypeScript 编译配置）、`src/`（子模块边界）、`tsconfig.build.tsbuildinfo`（TypeScript 编译配置）
- 实现原理：由包脚本驱动 TypeScript 构建流程，`src/` 汇总 debate/search/shared/di 的对外导出并产出发布文件；失败路径在类型检查或构建阶段被直接阻断。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `package.json`、`tsconfig.build.json`、`src/`。
- 调用链路：`包构建脚本` -> `src/ 导出聚合` -> 输出

## 成员清单

- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现
