<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: infrastructure-ports/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# infrastructure-ports/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于infrastructure-ports/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [llmGateway.ts](./llmGateway.ts): LLM 能力端口契约。
成员清单 [debateRepository.ts](./debateRepository.ts): 讨论存储端口契约。

法则: 端口面向能力而非实现·命名稳定·契约先于适配器
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
