<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法
- [OUTPUT]: 提供「意图轨」与「逻辑轨」的双轨文档索引
- [POS]: docs/ 目录的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# docs/ - 双轨同构文档系统

> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

OpenKestrel 采用「意图-逻辑」双轨文档体系，隔离人类的感性直觉（意图）与 AI 的理性推理（逻辑）。

## 意图轨 (Intent Track) - `/docs/intent/`

由人类播下的"意图种子"，描述产品灵魂、愿景和宏观需求。

- [vision.zh.md](./intent/vision.zh.md): 原始构想与产品愿景
- [prd.zh.md](./intent/prd.zh.md): 需求规格说明书
- [mvp.zh.md](./intent/mvp.zh.md): MVP 范围与核心编排逻辑定义
- [thoughts.zh.md](./intent/thoughts.zh.md): 随想、哲学沉思与灵感碎片

## 逻辑轨 (Logic Track) - `/docs/logic/`

由 AI 代理执行的"逻辑骨架"，描述系统架构与技术规范。

- [architecture.zh.md](./logic/architecture.zh.md): 系统架构设计
- [api-design.zh.md](./logic/api-design.zh.md): 接口协议规范
- [orchestration.zh.md](./logic/orchestration.zh.md): 核心编排与意图-逻辑转换
- [core-di-architecture.zh.md](./logic/core-di-architecture.zh.md): core 包 + DI + 用例驱动的重构后架构说明（面向复杂度增长）
- [safety.zh.md](./logic/safety.zh.md): 监管机制与安全边界
- [roadmap.zh.md](./logic/roadmap.zh.md): 演进路线图

## 命名规范

统一使用 `kebab-case`（全小写短横线），语言后缀为 `.zh.md`（中文）或无后缀（英文）。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
