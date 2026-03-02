<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 src/auth/ 模块职责与成员
- [POS]: src/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「auth/」。
- 核心文件：`auth.ts`（TypeScript 业务实现）。
- 实现原理：采用单入口实现：由 `auth.ts` 直接承载核心逻辑并对外提供可调用能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [auth.ts](./auth.ts): 认证入口，配置 OAuth (GitHub/Google) + 本地 Credentials 登录，导出 `auth/handlers/signIn/signOut`，含审计日志埋点与 `env/load.ts` 环境加载
