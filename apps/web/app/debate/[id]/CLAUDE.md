<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: debate/[id]/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# debate/[id]/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「debate/[id]/」实现具体业务能力，当前重点是 本目录成员文件，承载对应子能力实现。
- 核心文件：`debate-page.module.css`、`DebateToc.module.css`、`DebateToc.tsx`、`page.tsx`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../../CLAUDE.md](./../../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`debate-page.module.css`](./debate-page.module.css)：本目录成员文件，承载对应子能力实现
- [`DebateToc.module.css`](./DebateToc.module.css)：本目录成员文件，承载对应子能力实现
- [`DebateToc.tsx`](./DebateToc.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`page.tsx`](./page.tsx)：页面入口，负责该路由的渲染与交互

