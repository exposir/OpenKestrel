<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: application/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# application/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于application/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [streamDebate.ts](./streamDebate.ts): 讨论流式编排用例。

法则: 用例编排只依赖端口·输入输出显式·副作用可测试
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
