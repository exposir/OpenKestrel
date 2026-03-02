<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 src/auth/ 模块职责与成员
- [POS]: src/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「auth/」负责 业务逻辑实现与依赖协作，当前由 `auth.ts` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`auth.ts`（逻辑实现）
- 实现原理：由 `auth.ts` 单点承载入口与处理流程，对外保持稳定输出；边界条件在文件内显式校验并快速失败。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `auth.ts`。
- 调用链路：`auth.ts` -> 输出
## 成员清单

- [auth.ts](./auth.ts): 认证入口，配置 OAuth (GitHub/Google) + 本地 Credentials 登录，导出 `auth/handlers/signIn/signOut`，含审计日志埋点与 `env/load.ts` 环境加载
