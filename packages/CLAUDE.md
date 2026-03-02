<!--
- [INPUT]: 依赖 /CLAUDE.md 的 monorepo 模块边界与文档协议
- [OUTPUT]: 提供 packages/ 工作区的模块地图
- [POS]: packages/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
-->

# packages/
> L2 | Parent: [/CLAUDE.md](../CLAUDE.md)

成员清单 [theme-motion/CLAUDE.md](./theme-motion/CLAUDE.md): 主题切换动画库（core + react + css），可被 web/admin 复用并独立发布。  
成员清单 [dep-graph/CLAUDE.md](./dep-graph/CLAUDE.md): 高性能依赖分析与 WebGL 可视化工具包（CLI + SDK + Viewer）。
成员清单 [core/CLAUDE.md](./core/CLAUDE.md): 纯业务内核包（DDD 模型 + ports + 用例），供应用层通过 DI 调用。

法则: 包职责单一·导出面稳定·应用仅依赖公开入口
