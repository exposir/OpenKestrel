<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: src/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于src/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [index.ts](./index.ts): 包级导出入口。
成员清单 [types.ts](./types.ts): 依赖图核心类型定义。
成员清单 [cli.ts](./cli.ts): 命令行入口与参数处理。
成员清单 [analyzer/CLAUDE.md](./analyzer/CLAUDE.md): 分析器子模块地图。
成员清单 [graph/CLAUDE.md](./graph/CLAUDE.md): 图算法子模块地图。
成员清单 [viewer-server/CLAUDE.md](./viewer-server/CLAUDE.md): 可视化服务端子模块地图。
成员清单 [viewer-app/CLAUDE.md](./viewer-app/CLAUDE.md): 可视化前端子模块地图。

法则: CLI/分析/图算法/可视化解耦·入口稳定·类型先行
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
