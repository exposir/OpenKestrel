<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: intent/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# intent/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「intent/」负责 文档规范沉淀与知识索引，当前由 `mvp.zh.md` 等文件对外提供能力，典型使用场景是开发者查阅方案与规则时。
- 核心文件：`mvp.zh.md`（规则文档）、`prd.zh.md`（规则文档）、`thoughts.zh.md`（规则文档）、`vision.zh.md`（规则文档）
- 实现原理：由 `mvp.zh.md` 接收入口，再通过 `prd.zh.md` 和 `thoughts.zh.md` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `mvp.zh.md`、`prd.zh.md`、`thoughts.zh.md`、`vision.zh.md`。
- 调用链路：`mvp.zh.md` -> `prd.zh.md` -> `thoughts.zh.md` -> 输出
## 成员清单

- [`mvp.zh.md`](./mvp.zh.md)：文档文件，记录该模块规范与说明
- [`prd.zh.md`](./prd.zh.md)：文档文件，记录该模块规范与说明
- [`thoughts.zh.md`](./thoughts.zh.md)：文档文件，记录该模块规范与说明
- [`vision.zh.md`](./vision.zh.md)：文档文件，记录该模块规范与说明

