<!--
- [INPUT]: 依赖仓库内各层 CLAUDE.md 与 README 文档
- [OUTPUT]: 提供项目全量文档目录（可导航、可分层检索）
- [POS]: docs/ 目录下的统一文档目录入口
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# OpenKestrel 文档总目录

> 目的：提供一个“单页可达”的完整文档导航，避免文档分散导致查找成本过高。

## 1. 根入口文档（Repository Root）

- [README.md](../README.md): 英文总览、运行命令、验证步骤、Cloudflare 说明。
- [README.zh.md](../README.zh.md): 中文总览、运行命令、验证步骤、Cloudflare 说明。
- [CLAUDE.md](../CLAUDE.md): L1 项目宪法与全局架构地图。
- [AGENTS.md](../AGENTS.md): OpenAI Agent 入口（指向 L1 规则）。
- [CODEX.md](../CODEX.md): Codex 入口（指向 L1 规则）。
- [GEMINI.md](../GEMINI.md): Gemini 入口（指向 L1 规则）。

## 2. docs 目录导航

- [CLAUDE.md](./CLAUDE.md): docs L2 索引（意图轨 + 逻辑轨）。

### 2.1 意图轨（docs/intent）

- [vision.zh.md](./intent/vision.zh.md): 产品愿景与定位。
- [prd.zh.md](./intent/prd.zh.md): 产品需求与范围。
- [mvp.zh.md](./intent/mvp.zh.md): MVP 目标与核心能力边界。
- [thoughts.zh.md](./intent/thoughts.zh.md): 灵感、哲学、长期思考。

### 2.2 逻辑轨（docs/logic）

- [architecture.zh.md](./logic/architecture.zh.md): 系统架构总设计。
- [api-design.zh.md](./logic/api-design.zh.md): API 协议与边界。
- [orchestration.zh.md](./logic/orchestration.zh.md): 编排逻辑与流程。
- [core-di-architecture.zh.md](./logic/core-di-architecture.zh.md): core + DI 重构后架构说明。
- [safety.zh.md](./logic/safety.zh.md): 安全与监管机制。
- [roadmap.zh.md](./logic/roadmap.zh.md): 迭代路线图。

## 3. 应用文档（apps）

### 3.1 Web 应用（apps/web）

- [apps/web/CLAUDE.md](../apps/web/CLAUDE.md): web L2 模块地图。
- [apps/web/app/CLAUDE.md](../apps/web/app/CLAUDE.md): App Router 页面/API 协作规则。
- [apps/web/app/components/CLAUDE.md](../apps/web/app/components/CLAUDE.md): 前端组件规范。
- [apps/web/app/components/modal-engine/CLAUDE.md](../apps/web/app/components/modal-engine/CLAUDE.md): 弹窗状态机规范。
- [apps/web/src/CLAUDE.md](../apps/web/src/CLAUDE.md): web 核心引擎模块地图。
- [apps/web/src/auth/CLAUDE.md](../apps/web/src/auth/CLAUDE.md): 认证模块。
- [apps/web/src/audit/CLAUDE.md](../apps/web/src/audit/CLAUDE.md): 审计模块。
- [apps/web/src/storage/CLAUDE.md](../apps/web/src/storage/CLAUDE.md): 存储模块。
- [apps/web/src/orchestration/CLAUDE.md](../apps/web/src/orchestration/CLAUDE.md): 编排模块。
- [apps/web/src/env/CLAUDE.md](../apps/web/src/env/CLAUDE.md): 环境变量加载模块。
- [apps/web/src/di/CLAUDE.md](../apps/web/src/di/CLAUDE.md): DI composition root 规范。

### 3.2 Admin 应用（apps/admin）

- [apps/admin/CLAUDE.md](../apps/admin/CLAUDE.md): admin L2 模块地图。
- [apps/admin/README.md](../apps/admin/README.md): admin 使用说明与运行方式。

## 4. 包文档（packages）

- [packages/CLAUDE.md](../packages/CLAUDE.md): packages 工作区总索引。
- [packages/core/CLAUDE.md](../packages/core/CLAUDE.md): 纯业务内核包说明。
- [packages/theme-motion/CLAUDE.md](../packages/theme-motion/CLAUDE.md): 主题动效包说明。
- [packages/theme-motion/README.md](../packages/theme-motion/README.md): 主题动效包使用文档。
- [packages/dep-graph/CLAUDE.md](../packages/dep-graph/CLAUDE.md): 依赖图工具包说明。
- [packages/dep-graph/README.md](../packages/dep-graph/README.md): 依赖图工具包使用文档。
- [packages/dep-graph/docs/viewer-spec.md](../packages/dep-graph/docs/viewer-spec.md): viewer 规范说明。

## 5. 维护规则（文档目录）

- 新增任何 `.md` 文档时，必须同步更新本目录文件。
- 新增模块目录并包含 `CLAUDE.md` 时，必须在对应分组补索引。
- 若文档被移动/重命名，需在本文件修复链接，避免死链。
