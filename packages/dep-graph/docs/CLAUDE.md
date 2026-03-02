<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: docs/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# docs/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「docs/」负责 模块能力组织与对外暴露，当前由 `viewer-spec.md` 等文件对外提供能力，典型使用场景是模块协作与复用时。
- 核心文件：`viewer-spec.md`（规则文档）
- 实现原理：由 `viewer-spec.md` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `viewer-spec.md`。
- 调用链路：`viewer-spec.md` -> 输出
## 成员清单

- [`viewer-spec.md`](./viewer-spec.md)：文档文件，记录该模块规范与说明

