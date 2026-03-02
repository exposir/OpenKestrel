<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与搜索 API 协议
- [OUTPUT]: 本文档提供 search/ 成员清单与职责边界
- [POS]: app/components/search/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# search/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单 [SearchLauncher.tsx](./SearchLauncher.tsx): 首页搜索触发器与查询 Tag 清理入口。
成员清单 [SearchDialog.tsx](./SearchDialog.tsx): 全局搜索弹窗内容，调用 `/api/search` 并跳转帖子。
成员清单 [SearchDialog.module.css](./SearchDialog.module.css): 搜索弹窗样式模块。

法则: 触发器与弹窗解耦·查询参数与路由保持一致·结果展示可回退
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
