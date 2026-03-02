<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: viewer-app/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# viewer-app/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「viewer-app/」负责 业务逻辑实现与依赖协作，当前由 `app.js` 等文件对外提供能力，典型使用场景是上层模块调用核心能力时。
- 核心文件：`app.js`（模块实现）、`index.html`（模块实现）、`renderer.js`（模块实现）、`style.css`（模块实现）
- 实现原理：由 `app.js` 接收入口，再通过 `index.html` 和 `renderer.js` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `app.js`、`index.html`、`renderer.js`、`style.css`。
- 调用链路：`app.js` -> `index.html` -> `renderer.js` -> 输出
## 成员清单

- [`app.js`](./app.js)：本目录成员文件，承载对应子能力实现
- [`index.html`](./index.html)：本目录成员文件，承载对应子能力实现
- [`renderer.js`](./renderer.js)：本目录成员文件，承载对应子能力实现
- [`style.css`](./style.css)：本目录成员文件，承载对应子能力实现

