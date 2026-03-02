<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 src/auth/ 模块职责与成员
- [POS]: src/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「auth/」实现具体业务能力，当前重点是 负责该目录的核心业务实现。
- 核心文件：以成员清单中的入口与实现文件为核心。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [auth.ts](./auth.ts): 认证入口，配置 OAuth (GitHub/Google) + 本地 Credentials 登录，导出 `auth/handlers/signIn/signOut`，含审计日志埋点与 `env/load.ts` 环境加载
