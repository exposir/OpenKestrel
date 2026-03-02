<!--
- [INPUT]: 依赖 /CLAUDE.md 的分形文档协议与 packages/ 约定
- [OUTPUT]: 提供 @openkestrel/core 的模块地图、边界与公开接口
- [POS]: packages/core 的 L2 模块地图（纯业务内核）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/core/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

纯业务内核包：定义领域模型、应用用例、基础设施 ports（接口），不依赖 Next/React。

成员清单 [package.json](./package.json): 包元数据与导出入口配置（`@openkestrel/core`）。  
成员清单 [README.md](./README.md): 包用途、导出边界与最小接入示例。  
成员清单 [README.zh.md](./README.zh.md): 包中文说明、导出边界与最小接入示例。  
成员清单 [tsconfig.build.json](./tsconfig.build.json): core 库构建配置（ESM + d.ts 输出到 `dist/`）。  
成员清单 [src/index.ts](./src/index.ts): 对外统一导出入口（errors/tokens/ports/use-cases/domain）。  
成员清单 [src/shared/errors.ts](./src/shared/errors.ts): 共享领域错误模型（`DomainError`/`ValidationError`）。  
成员清单 [src/di/tokens.ts](./src/di/tokens.ts): DI token 协议（ports 注入标识）。  
成员清单 [src/debate/domain/valueObjects.ts](./src/debate/domain/valueObjects.ts): Debate 值对象与不变量校验。  
成员清单 [src/debate/domain/entities.ts](./src/debate/domain/entities.ts): DebateEntry 实体。  
成员清单 [src/debate/domain/aggregate.ts](./src/debate/domain/aggregate.ts): Debate 聚合根。  
成员清单 [src/debate/infrastructure-ports/llmGateway.ts](./src/debate/infrastructure-ports/llmGateway.ts): LLM 网关端口。  
成员清单 [src/debate/infrastructure-ports/debateRepository.ts](./src/debate/infrastructure-ports/debateRepository.ts): Debate 仓储端口。  
成员清单 [src/debate/application/streamDebate.ts](./src/debate/application/streamDebate.ts): 流式编排用例（事件流 + 持久化）。  
成员清单 [src/search/infrastructure-ports/searchRepository.ts](./src/search/infrastructure-ports/searchRepository.ts): Search 仓储端口。  
成员清单 [src/search/application/searchDebates.ts](./src/search/application/searchDebates.ts): 搜索查询用例（输入校验 + 限流策略）。

法则: core 无框架依赖·只暴露稳定 DTO/ports·应用层只依赖 ports
