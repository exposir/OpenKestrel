<!--
- [INPUT]: 依赖 /CLAUDE.md 的分形文档协议与 packages/ 约定
- [OUTPUT]: 提供 @openkestrel/core 的模块地图、边界与公开接口
- [POS]: packages/core 的 L2 模块地图（纯业务内核）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/core/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

纯业务内核包：定义领域模型、应用用例、基础设施 ports（接口），不依赖 Next/React。

## 目录结构

```
src/
├── debate/                    Debate 域（聚合 + 用例 + ports）
├── search/                    Search 域（读模型 + 用例 + ports）
├── shared/                    共享类型与错误模型
└── di/                        Token 与装配约定（无具体 IoC 依赖）
```

法则: core 无框架依赖·只暴露稳定 DTO/ports·应用层只依赖 ports
