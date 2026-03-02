<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块宪法，及 /docs/logic/orchestration.zh.md 的编排设计
- [OUTPUT]: 提供 src/ 目录的模块地图与协作规则
- [POS]: apps/web/src/ 的 L2 级别规范，AI 读取业务内核前的第一读物
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# src/ - 核心引擎

> L2 | Parent: [apps/web/CLAUDE.md](../CLAUDE.md)

所有运行时逻辑的宿主。当前包含六个子模块：`auth/`（认证）、`orchestration/`（编排引擎）、`audit/`（审计日志）、`storage/`（共享路径策略）、`env/`（monorepo 环境加载）与 `di/`（依赖注入装配入口）。

## 目录结构

```
src/
├── auth/            认证模块（L3）
│   └── auth.ts      Auth.js 配置，OAuth + Credentials 登录，导出 auth/handlers/signIn/signOut
├── di/              依赖注入装配入口（L3）
│   └── container.ts DI composition root（tsyringe + reflect-metadata），注册 ports 实现
├── orchestration/   意图编译引擎（L3）
│   ├── soul.ts      Soul 数据结构与预设人格库
│   ├── prompts.ts   System/User Prompt 构建器
│   ├── engine.ts    DeepSeek 调用层 + 信息熵校验
│   └── index.ts     CLI 入口（离线验证用）
├── audit/           审计日志模块（L3）
│   └── logger.ts    登录/发帖审计事件落盘（JSONL）
├── env/             环境变量加载模块（L3）
│   └── load.ts      兼容 apps/web 与仓库根目录的 .env/.env.local 加载
└── storage/         共享目录路径策略（L3）
    ├── paths.ts     数据目录/审计目录/讨论文件路径统一解析
    └── adapter.ts   存储适配器切换层（local/cf）
```

## 模块职责边界

| 模块               | 职责                                                | 不负责               |
| ------------------ | --------------------------------------------------- | -------------------- |
| `auth/auth.ts`     | Auth.js 配置、OAuth/Credentials 登录、审计事件埋点  | 权限逻辑 / 页面路由  |
| `soul.ts`          | 定义 Soul 接口与静态人格库                          | 动态创建/持久化 Soul |
| `prompts.ts`       | 从 Soul 结构生成 Prompt 字符串                      | 调用 API             |
| `engine.ts`        | 所有 LLM 调用、流式推送、熵校验                     | UI / 文件路由        |
| `index.ts`         | 离线 CLI 批量运行验证                               | Web 请求处理         |
| `audit/logger.ts`  | 审计事件统一写入与请求上下文提取                    | 权限判定 / 业务逻辑  |
| `di/container.ts`  | ports 实现注册与用例装配入口（服务端）              | 业务逻辑本身         |
| `env/load.ts`      | 统一加载环境变量，兼容 monorepo 下不同 cwd          | 业务逻辑 / 鉴权规则  |
| `storage/paths.ts` | 数据目录路径统一管理（支持 `OPENKESTREL_DATA_DIR`） | 业务审计内容本身     |
| `storage/adapter.ts` | 统一读写接口与驱动切换（`STORAGE_DRIVER`）         | LLM 调用与鉴权规则   |

## 规则

- `engine.ts` 是唯一允许调用外部 API 的文件，其他模块不得直接 `fetch`
- 新增人格在 `soul.ts` 的 `SOULS` 数组追加，不新建文件
- Prompt 变更必须同步至 `docs/logic/orchestration.zh.md`
