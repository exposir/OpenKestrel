<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: analyzer/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# analyzer/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于analyzer/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [index.ts](./index.ts): 分析器导出入口。
成员清单 [scan.ts](./scan.ts): 依赖扫描主流程。
成员清单 [path-utils.ts](./path-utils.ts): 路径解析与归一化工具。
成员清单 [tsconfig.ts](./tsconfig.ts): tsconfig 读取与路径映射解析。

法则: 扫描与路径解析分离·tsconfig 解析独立·输出规范化
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
