<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法与 monorepo 目录约定
- [OUTPUT]: 提供 apps/web 的模块地图、依赖边界与运行规则
- [POS]: apps/web 的 L2 模块地图（前台主应用）
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/web/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

成员清单 [app/CLAUDE.md](./app/CLAUDE.md): App Router 页面、组件与 API 路由协作规则。  
成员清单 [src/CLAUDE.md](./src/CLAUDE.md): 认证、编排、审计、存储四个业务内核模块地图。  
成员清单 [package.json](./package.json): 前台应用独立依赖与脚本（`dev/build/start/orchestrate`）。  
成员清单 [tsconfig.json](./tsconfig.json): 前台 TS 配置（继承根基线 + `@/app`、`@/src` 别名）。  
成员清单 [next.config.ts](./next.config.ts): 前台 Next.js 配置入口。  
成员清单 [next-env.d.ts](./next-env.d.ts): Next.js 类型注入入口。

法则: 前台应用自包含·核心逻辑仅归 web·共享目录单源化（`OPENKESTREL_DATA_DIR`）
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
