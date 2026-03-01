<!--
- [INPUT]: 依赖 /CLAUDE.md 的项目宪法，及 OPENKESTREL_DATA_DIR 共享目录约定
- [OUTPUT]: 提供 apps/admin 的模块职责与运行说明
- [POS]: apps/admin 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# apps/admin/
> L2 | Parent: [/CLAUDE.md](../../CLAUDE.md)

成员清单 [app/layout.tsx](./app/layout.tsx): 后台根布局与全局元信息。  
成员清单 [app/page.tsx](./app/page.tsx): 仪表盘主页，展示审计统计与日志表。  
成员清单 [app/globals.css](./app/globals.css): 后台视觉主题与基础样式。  
成员清单 [lib/audit.ts](./lib/audit.ts): 读取共享 JSONL 审计日志并做聚合统计。  
成员清单 [lib/storage.ts](./lib/storage.ts): 存储驱动与共享数据目录解析（`STORAGE_DRIVER` / `OPENKESTREL_DATA_DIR`）。  
成员清单 [proxy.ts](./proxy.ts): 可选 Basic Auth 门禁（`ADMIN_BASIC_USER/PASS`）。  
成员清单 [package.json](./package.json): 管理后台独立依赖与脚本（默认端口 3100）。
成员清单 [README.md](./README.md): 共享目录与部署运行说明。

法则: 后台只读审计优先·共享目录路径单源化·权限缺省拒绝（配置即生效）
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
