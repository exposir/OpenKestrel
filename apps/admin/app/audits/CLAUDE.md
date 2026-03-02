<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: audits/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# audits/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于audits/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [page.tsx](./page.tsx): 审计日志页，聚合筛选与明细展示。

法则: 只承载审计列表页·查询参数驱动·数据读写分离
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
