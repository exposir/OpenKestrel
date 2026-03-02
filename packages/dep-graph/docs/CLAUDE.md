<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: docs/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# docs/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：承载该目录核心能力，实现模块级功能交付，对应目录「docs/」。
- 核心文件：`viewer-spec.md`（模块文档与规范）。
- 实现原理：采用单入口实现：由 `viewer-spec.md` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`viewer-spec.md`](./viewer-spec.md)：文档文件，记录该模块规范与说明

