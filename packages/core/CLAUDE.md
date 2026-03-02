<!--
- [INPUT]: 依赖 /CLAUDE.md 的分形文档协议与 packages/ 约定
- [OUTPUT]: 提供 @openkestrel/core 的模块地图、边界与公开接口
- [POS]: packages/core 的 L2 模块地图（纯业务内核）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/core/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「packages/core/」实现具体业务能力，当前重点是 子模块目录，承载该子域实现。
- 核心文件：`package.json`、`README.md`、`README.zh.md`、`tsconfig.build.json`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `dist/`、`node_modules/`、`src/`；相关实现见本文件“成员清单”。
## 成员清单

- [`dist/`](./dist)：子模块目录，承载该子域实现
- [`node_modules/`](./node_modules)：子模块目录，承载该子域实现
- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现

