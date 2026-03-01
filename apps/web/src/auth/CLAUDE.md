<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 src/auth/ 模块职责与成员
- [POS]: src/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

认证模块，基于 Auth.js (next-auth v5) 统一管理登录会话策略。

## 成员清单

- [auth.ts](./auth.ts): 认证入口，配置 OAuth (GitHub/Google) + 本地 Credentials 登录，导出 `auth/handlers/signIn/signOut`，含审计日志埋点与 `env/load.ts` 环境加载
