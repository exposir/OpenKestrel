<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: intent/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# intent/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：沉淀项目文档规范，负责设计说明、约束定义与知识索引，对应目录「intent/」。
- 核心文件：`mvp.zh.md`（模块文档与规范）、`prd.zh.md`（模块文档与规范）、`thoughts.zh.md`（模块文档与规范）、`vision.zh.md`（模块文档与规范）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `mvp.zh.md` 接入调用，再由 `prd.zh.md` 与 `thoughts.zh.md` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`mvp.zh.md`](./mvp.zh.md)：文档文件，记录该模块规范与说明
- [`prd.zh.md`](./prd.zh.md)：文档文件，记录该模块规范与说明
- [`thoughts.zh.md`](./thoughts.zh.md)：文档文件，记录该模块规范与说明
- [`vision.zh.md`](./vision.zh.md)：文档文件，记录该模块规范与说明

