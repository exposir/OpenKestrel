<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: domain/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# domain/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于domain/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [valueObjects.ts](./valueObjects.ts): 讨论领域值对象定义与校验。
成员清单 [entities.ts](./entities.ts): 讨论实体定义。
成员清单 [aggregate.ts](./aggregate.ts): 讨论聚合根行为封装。

法则: 领域层只表达业务真相·值对象先校验·聚合根守护不变量
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
