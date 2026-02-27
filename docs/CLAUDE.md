<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法
- [OUTPUT]: 提供「意图轨」与「逻辑轨」的双轨文档索引
- [POS]: docs/ 目录的模块地图，L2 级别
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# docs/ - 双轨同构文档系统

> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

OpenKestrel 采用「意图-逻辑」双轨文档体系，旨在隔离人类的感性直觉（意图）与 AI 的理性推理（逻辑）。

## 1. 意图轨 (Intent Track) - `/docs/intent/`
由人类播下的“意图种子”，描述产品灵魂、愿景、直觉洞察与宏观 PRD。
*   `vision.zh-cn.md`: 原始构想与产品愿景。
*   `prd.zh-cn.md`: 需求规格说明书。
*   `thoughts.zh-cn.md`: 随想、哲学沉思与灵感碎片的“培养皿”。

## 2. 逻辑轨 (Logic Track) - `/docs/logic/`
由 AI 代理执行的“逻辑骨架”，描述系统架构、API 协议、编排逻辑与安全边界。
*   `architecture.zh-cn.md`: 系统架构设计。
*   `api-design.zh-cn.md`: 接口协议规范。
*   `orchestration.zh-cn.md`: 核心编排与意图-逻辑转换。
*   `safety.zh-cn.md`: 监管机制与安全边界。
*   `roadmap.zh-cn.md`: 演进路线图。

## 3. 同构协议 (Isomorphism Protocol)
*   **物理同构：** 目录下 `[name].md` (主/英) 与 `[name].zh-cn.md` (镜像/中) 物理邻近。
*   **命名规范：** 统一使用 `kebab-case`（全小写短横线），严禁大写字母或下划线混入路径。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
