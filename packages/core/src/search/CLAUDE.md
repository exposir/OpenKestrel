<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: search/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# search/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于search/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [application/CLAUDE.md](./application/CLAUDE.md): Search 应用层用例地图。
成员清单 [infrastructure-ports/CLAUDE.md](./infrastructure-ports/CLAUDE.md): Search 存储端口地图。

法则: 查询用例与端口解耦·输入校验前置·返回模型稳定
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
