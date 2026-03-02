<!--
- [INPUT]: 依赖 ../CLAUDE.md 的包级协作规则与导出约束
- [OUTPUT]: 提供 theme-motion 包的成员清单与发布边界
- [POS]: packages/theme-motion/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# theme-motion/

> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「packages/theme-motion/」接收主题动效库的构建与发布输入，组织 `src/` 导出与文档说明并输出可复用动效能力；输入是包配置、构建脚本与源码目录，输出是 theme-motion 包产物；本目录不负责应用业务状态管理。
- 核心文件：`package.json`（包定义与脚本约束）、`tsconfig.build.json`（TypeScript 编译配置）、`src/`（子模块边界）、`tsconfig.build.tsbuildinfo`（TypeScript 编译配置）
- 实现原理：由包脚本执行构建并从 `src/` 汇总 core/react/style 能力对外发布，文档文件用于约束消费方式；失败路径在构建与类型检查阶段直接报错。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `package.json`、`tsconfig.build.json`、`src/`。
- 调用链路：`包构建脚本` -> `src/ 导出与发布` -> 输出

## 成员清单

- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现
