<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: viewer-app/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# viewer-app/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于viewer-app/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [app.js](./app.js): 依赖图浏览器前端主逻辑。
成员清单 [renderer.js](./renderer.js): 图渲染基础设施（WebGL 优先 + SVG 回退 + 缩放拖拽）。
成员清单 [style.css](./style.css): 浏览器样式。
成员清单 [index.html](./index.html): 浏览器静态入口。

法则: 前端渲染与数据协议清晰·样式与逻辑分离·入口单一
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
