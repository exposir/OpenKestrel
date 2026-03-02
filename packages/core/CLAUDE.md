<!--
- [INPUT]: 依赖 /CLAUDE.md 的分形文档协议与 packages/ 约定
- [OUTPUT]: 提供 @openkestrel/core 的模块地图、边界与公开接口
- [POS]: packages/core 的 L2 模块地图（纯业务内核）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/core/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「packages/core/」。
- 核心文件：`package.json`（项目配置）、`README.md`（模块文档与规范）、`README.zh.md`（模块文档与规范）、`tsconfig.build.json`（项目配置）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `package.json` 接入调用，再由 `README.md` 与 `README.zh.md` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 `src/`；同级协作见本文件“成员清单”。
## 成员清单

- [`package.json`](./package.json)：配置文件，声明运行或构建参数
- [`README.md`](./README.md)：文档文件，记录该模块规范与说明
- [`README.zh.md`](./README.zh.md)：文档文件，记录该模块规范与说明
- [`src/`](./src)：子模块目录，承载该子域实现
- [`tsconfig.build.json`](./tsconfig.build.json)：配置文件，声明运行或构建参数
- [`tsconfig.build.tsbuildinfo`](./tsconfig.build.tsbuildinfo)：本目录成员文件，承载对应子能力实现

