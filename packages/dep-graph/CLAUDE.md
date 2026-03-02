<!--
- [INPUT]: 依赖 ../CLAUDE.md 的包级协作规则与导出约束
- [OUTPUT]: 提供 dep-graph 包成员清单与能力边界
- [POS]: packages/dep-graph/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# dep-graph/

> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「packages/dep-graph/」接收依赖图分析工具的构建输入，组织 `src/` 代码与 `docs/` 规范并输出可执行 CLI 与可视化能力；输入是包配置、构建脚本与源码/文档目录，输出是 dep-graph 包产物；本目录不承担上层业务编排。
- 核心文件：`package.json`（包定义与脚本约束）、`tsconfig.build.json`（TypeScript 编译配置）、`docs/`（子模块边界）、`src/`（子模块边界）
- 实现原理：由包脚本驱动构建，将 `src/` 中的 analyzer/graph/viewer 能力编译为可执行入口，并用 `docs/` 维护规范；失败路径在构建与依赖解析阶段直接暴露。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `package.json`、`tsconfig.build.json`、`docs/`。
- 调用链路：`包构建脚本` -> `src/ 能力编译 + docs/ 规范约束` -> 输出

## 成员清单

- [`docs/`](./docs)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tests/`](./tests)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现
