<!--
- [INPUT]: 依赖 /CLAUDE.md 的全局模块边界、apps/web 与 packages/core 的现状代码
- [OUTPUT]: 本文档提供“重构后 core + DI + 用例驱动”架构说明、分层边界与开发指南
- [POS]: 逻辑轨文档；解释 packages/core 与 apps/web 的职责分离与依赖注入装配
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# OpenKestrel - Core + DI 架构说明（重构后）

本文档记录当前已落地的“业务内核 core 包 + 应用层 DI 装配 + API route 通过用例驱动”的架构形态，并解释为什么要这样做、如何继续演进到更复杂的前端。

## 1. 背景与目标

### 1.1 为什么要重构

在 MVP 阶段，把逻辑直接写在 Next.js `app` 路由与组件里是最快的。但一旦复杂度上升，常见问题会快速出现：

- 模块边界不清：UI、存储、鉴权、LLM 调用、编排策略混在一起，改动会牵一片。
- 难测试：没有清晰的 ports（接口）与用例（use case），只能靠端到端手工验证。
- 难替换：本地文件存储未来要迁 DB、LLM 未来要换供应商，会触发大规模改动。
- 状态扩散：交互增多后，组件之间共享状态与副作用会变成“隐形全局变量”。

### 1.2 本次重构的明确目标（已经做到的）

- 抽出 `packages/core`：提供纯业务内核（领域模型 + 用例 + ports），不依赖 Next/React。
- 通过 DI（依赖注入）集中装配基础设施实现：LLM 网关、仓储（文件存储）等。
- Next API Routes 不再“手搓流程”，而是解析请求 -> 调用 core 用例 -> 推送协议。
- 保持对外协议不变（例如 `/api/orchestrate` 的 NDJSON 事件结构）。

### 1.3 非目标（目前没做，后续才做）

- 还没有把前端 UI 全部迁移到 Service/Store（Zustand + React Query）模式。
- 还没有把 Search 从“遍历文件”升级为索引化（倒排索引/SQLite/Postgres FTS）。
- 还没有把 Auth/Audit 也完整迁到 core（目前 core 只覆盖 Debate/Search 的最小纵切）。

## 2. 当前架构的“真实形态”（以代码为准）

### 2.1 Monorepo 顶层

```
apps/
  web/      Next.js 前台应用
  admin/    Next.js 管理台
packages/
  core/         纯业务内核（本次新增）
  theme-motion/ 可复用主题动画库
  dep-graph/    依赖分析工具包
docs/
  logic/    逻辑轨文档
  intent/   意图轨文档
```

### 2.2 packages/core（业务内核）

定位：只定义“业务是什么、流程怎么走、依赖什么能力（ports）”，不关心这些能力如何实现。

```
packages/core/src/
  shared/
    errors.ts
  di/
    tokens.ts
  debate/
    domain/
      valueObjects.ts
      entities.ts
      aggregate.ts
    application/
      streamDebate.ts
    infrastructure-ports/
      llmGateway.ts
      debateRepository.ts
  search/
    application/
      searchDebates.ts
    infrastructure-ports/
      searchRepository.ts
  index.ts
```

核心规则：

- core 不导入 `next` / `react` / `fs` / `dotenv` / `process.env` 等运行时依赖。
- core 只通过 ports（接口）向外表达依赖：例如 `LlmGateway`、`DebateRepository`。

### 2.3 apps/web（应用层与基础设施实现）

apps/web 里分两层看：

1. Next.js 路由与 UI（`app/`）：负责协议与渲染。
2. 运行时实现（`src/`）：提供 core 所需 ports 的“具体实现”，并完成 DI 装配。

本次新增/关键点：

- `apps/web/src/di/container.ts`：composition root（DI 装配入口）。
- `apps/web/app/api/orchestrate/route.ts`：通过 DI 获取 `StreamDebateUseCase` 执行。
- `apps/web/app/api/search/route.ts`：通过 DI 获取 `SearchDebatesUseCase` 执行。

## 3. 分层职责与依赖方向（核心约束）

### 3.1 分层定义

- Domain（领域层，core 内）：值对象、实体、聚合，不依赖外部 IO。
- Application（应用层，core 内）：用例（UseCase），编排流程，依赖 ports。
- Infrastructure（基础设施，apps/web 内）：文件存储、LLM 调用封装、日志落盘等。
- Delivery（交付层，apps/web/app 内）：HTTP 解析、协议格式、流式响应、页面渲染。

### 3.2 依赖方向

必须保持单向依赖：

- Delivery -> Application -> Domain
- Infrastructure implements ports, but core 不依赖 Infrastructure。

具体到仓库：

- `apps/web` 可以依赖 `@openkestrel/core`
- `@openkestrel/core` 不能依赖 `apps/web`

## 4. DI（依赖注入）如何工作

### 4.1 为什么要 DI

DI 的价值不是“炫技”，而是解决两个现实问题：

1. 替换成本：FileRepo -> DBRepo、DeepSeek -> 其他模型，尽量不动用例代码。
2. 可测试性：用 mock ports 测 use case，不需要起 Next server。

### 4.2 composition root（装配根）

文件：`apps/web/src/di/container.ts`

它做三件事：

- 引入 `reflect-metadata`（tsyringe 需要）。
- 注册 ports 的实现（`TOKENS.*` -> `useValue`）。
- 暴露 `getContainer()`，供 API routes 解析 use case。

注意：

- 当前注册用 `useValue`（工厂产物），以稳定为主；后续可以演进到 `@injectable()` + `@inject()`。
- ports 实现目前直接调用 `apps/web/src/storage/adapter.ts` 与 `apps/web/src/orchestration/engine.ts`，这是“可用优先”的纵切。

## 5. 关键数据流（重构后的链路）

### 5.1 流式编排 `/api/orchestrate`

文件：`apps/web/app/api/orchestrate/route.ts`

流程：

1. 解析请求 JSON（topic/context/soul_id/...）
2. `auth()` 校验登录（未登录返回 401）
3. 构造 LLM messages（system/user）
4. `getContainer()` 解析 ports
5. 创建 `StreamDebateUseCase(llm, repo)` 并执行
6. 把用例产出的事件以 NDJSON 写到 `ReadableStream`
7. done 后写审计日志

用例负责：

- 产出 `meta/chunk/done/error` 事件序列
- 将完整输出持久化到仓储（`DebateRepository.save`）

route 负责：

- 把事件序列转换为对外协议（NDJSON + headers）
- 做鉴权与审计（目前仍在 apps/web）

### 5.2 搜索 `/api/search`

文件：`apps/web/app/api/search/route.ts`

当前实现仍是“遍历所有 debate 文件 + 过滤”，但已经通过 DI + use case 做了调用收口：

- route 解析 `q/limit`
- `SearchDebatesUseCase` 做输入校验与 limit 归一
- `SearchRepository.search` 做具体扫描逻辑

这一步的意义：未来你把 search 升级为索引，只需要替换 `SearchRepository` 实现，不动 route 与 UI。

## 6. 为什么这样设计（取舍与理由）

### 6.1 core 包单独存在的理由

- 让“业务语义”有一个不受框架波动影响的稳定宿主。
- 降低耦合：Next.js 升级、路由变更、UI 组件重写，不应该牵动业务模型。
- 提高复用：未来 admin/worker/cli 都可以复用同一套用例与领域模型。

### 6.2 用例（UseCase）而不是“随手写函数”

UseCase 的价值在于把“业务流程”明确化：

- 输入输出明确（command/query -> events/DTO）
- 副作用集中（通过 ports）
- 可测（mock ports）

### 6.3 ports（接口）先于实现

你想要的可扩展性，本质是“替换能力”：

- 仓储：file -> db -> cloud
- LLM：DeepSeek -> OpenRouter -> 其他
- Search：scan -> index

ports 是替换的接缝。

### 6.4 DI 的现实成本与控制

DI 的风险是“隐式依赖与调试困难”。为了控制成本，本项目的约束是：

- 只允许一个 composition root：`apps/web/src/di/container.ts`
- token 统一来自 `@openkestrel/core` 的 `TOKENS`
- API routes 不直接 new 基础设施对象，只 resolve 用例所需依赖

## 7. 开发指南（你后续扩展时怎么做）

### 7.1 新增一个用例（推荐流程）

1. 在 `packages/core/src/<domain>/infrastructure-ports/` 定义 ports（如果需要新能力）。
2. 在 `packages/core/src/<domain>/application/` 新增用例类（UseCase）。
3. 在 `packages/core/src/index.ts` 导出新用例与 ports 类型。
4. 在 `apps/web/src/di/container.ts` 注册 ports 实现（或替换实现）。
5. 在 `apps/web/app/api/.../route.ts` 里 resolve 并调用用例。

### 7.2 未来前端复杂化时的落点（Service/Store）

现在 UI 仍有不少直接 `fetch('/api/...')` 与 window event 的逻辑。演进建议：

- 每个“用户意图”落到一个 service（调用用例/接口），组件只触发 service。
- UI 本地状态用 Zustand（modal 状态、草稿、流式临时文本）。
- 服务器状态用 React Query（列表、详情、搜索）。

这样做能把“交互复杂度”从组件树里抽出来，避免后期页面变成巨型脚本。

### 7.3 Search 的必经升级路线（避免性能崩）

当 debate 文件数量上来后，scan 必然会拖慢：

- 第一阶段：把 index 写到本地（SQLite/JSON index），`SearchRepository` 读取索引。
- 第二阶段：把存储迁 DB，Search 走 FTS。

因为已经收口到 `SearchRepository`，升级时不会牵动 route 与 UI。

## 8. 当前已知缺口（诚实清单）

- core 内暂时只覆盖 Debate/Search 的最小纵切；Auth/Audit 仍在 apps/web/src 内为主。
- Debate 的领域不变量、领域事件、仓储契约测试尚未系统化（目前以可用为主）。
- Search 仍是文件扫描（已通过 ports 为后续升级留缝）。

