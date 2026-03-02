<!--
- [INPUT]: 依赖 @openkestrel/core 的导出契约（src/index.ts）与 package.json 构建脚本
- [OUTPUT]: Provide English usage guide, export boundary, and quick-start examples for @openkestrel/core
- [POS]: packages/core 的使用说明文档
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# @openkestrel/core

Pure business core package for OpenKestrel. It contains domain models, application use cases, and infrastructure ports, with no Next.js or React dependency.

## Build

```bash
pnpm --filter @openkestrel/core build
```

## Public API

Import from the package entry (`@openkestrel/core`). Current public surface includes:

- shared errors (`DomainError`, `ValidationError`)
- DI tokens
- debate ports / use case / domain
- search ports / use case

## Usage

```ts
import {
  streamDebate,
  searchDebates,
  CORE_TOKENS,
  DomainError,
} from "@openkestrel/core";
```

## Rules

- Application layers should only import from the public entry and never from `src/**`.
- When adding exports, update both `src/index.ts` and `packages/core/CLAUDE.md`.
- Chinese version is maintained in `README.zh.md`.
