<!--
- [INPUT]: 依赖 ../CLAUDE.md 的包级协作规则与导出约束
- [OUTPUT]: 提供 theme-motion 包的成员清单与发布边界
- [POS]: packages/theme-motion/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# theme-motion/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「theme-motion/」负责 模块能力组织与对外暴露，当前由 `package.json` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`package.json`（配置）、`README.md`（规则文档）、`README.zh.md`（规则文档）、`tsconfig.build.json`（配置）
- 实现原理：由 `package.json` 接收入口，再通过 `README.md` 和 `README.zh.md` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `package.json`、`README.md`、`README.zh.md`、`src/`。
- 调用链路：`package.json` -> `README.md` -> `README.zh.md` -> 输出
## 成员清单

- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现

