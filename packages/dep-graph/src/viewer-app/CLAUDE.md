<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: viewer-app/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# viewer-app/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供核心业务实现能力，负责领域逻辑、依赖装配与外部适配，对应目录「viewer-app/」。
- 核心文件：`app.js`（模块实现）、`index.html`（模块实现）、`renderer.js`（模块实现）、`style.css`（模块实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `app.js` 接入调用，再由 `index.html` 与 `renderer.js` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`app.js`](./app.js)：本目录成员文件，承载对应子能力实现
- [`index.html`](./index.html)：本目录成员文件，承载对应子能力实现
- [`renderer.js`](./renderer.js)：本目录成员文件，承载对应子能力实现
- [`style.css`](./style.css)：本目录成员文件，承载对应子能力实现

