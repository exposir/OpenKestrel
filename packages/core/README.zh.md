<!--
- [INPUT]: 依赖 @openkestrel/core 的导出契约（src/index.ts）与 package.json 构建脚本
- [OUTPUT]: 提供 core 包的中文用途说明、导出边界与最小使用示例
- [POS]: packages/core 的中文使用说明文档
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# @openkestrel/core

OpenKestrel 的纯业务内核包，聚合领域模型、应用用例与基础设施 ports，不依赖 Next/React。

## 构建

```bash
pnpm --filter @openkestrel/core build
```

## 对外 API

统一从包入口导入（`@openkestrel/core`），当前公开：

- shared errors (`DomainError`, `ValidationError`)
- DI tokens
- debate ports / use case / domain
- search ports / use case

## 使用示例

```ts
import {
  streamDebate,
  searchDebates,
  CORE_TOKENS,
  DomainError,
} from "@openkestrel/core";
```

## 规则

- 应用层只依赖公开入口，不跨层直接导入 `src/**`
- 新增导出时，同步更新 `src/index.ts` 与 `packages/core/CLAUDE.md`
- 英文版文档位于 `README.md`
