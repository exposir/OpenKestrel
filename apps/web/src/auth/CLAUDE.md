<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 src/auth/ 模块职责与成员
- [POS]: src/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/

> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「auth/」接收上游模块调用并围绕 `auth.ts` 组织业务处理链路，输出可复用的函数、类型或端口能力；输入是业务参数、依赖注入对象或环境上下文，输出是确定性处理结果；本目录不负责页面展示层。
- 核心文件：`auth.ts`（业务逻辑实现）
- 实现原理：由 `auth.ts` 作为导入入口，按同级依赖完成处理并向上层返回结果；失败路径通过显式异常或错误对象上抛给调用方统一处置。
- 相关文件：上游规范 [src/CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `auth.ts`。
- 调用链路：`auth.ts` -> `../audit/logger.ts` -> `../storage/adapter.ts` -> 输出

## 成员清单

- [auth.ts](./auth.ts): 认证入口，配置 OAuth (GitHub/Google) + 本地 Credentials 登录，导出 `auth/handlers/signIn/signOut`，含审计日志埋点与 `env/load.ts` 环境加载
