<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: src/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# src/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单 [index.ts](./index.ts): 包导出入口。
成员清单 [core.ts](./core.ts): 主题与动画核心原语。
成员清单 [react.ts](./react.ts): React 集成适配层。
成员清单 [style.css](./style.css): 主题动画样式变量与基础样式。

法则: 核心动画原语稳定·React 适配层薄·样式变量单源
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
