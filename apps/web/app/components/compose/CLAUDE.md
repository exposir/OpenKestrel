<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与编排请求协议
- [OUTPUT]: 本文档提供 compose/ 成员清单与职责边界
- [POS]: app/components/compose/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# compose/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供前端交互组件能力，负责状态驱动渲染与用户操作响应，对应目录「compose/」。
- 核心文件：`ComposeDialog.module.css`（交互弹窗实现）、`ComposeDialog.tsx`（交互弹窗实现）。
- 实现原理：采用双文件协作：`ComposeDialog.module.css` 负责入口与编排，`ComposeDialog.tsx` 负责核心处理并输出结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`ComposeDialog.module.css`](./ComposeDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`ComposeDialog.tsx`](./ComposeDialog.tsx)：React 组件实现文件，负责界面与交互逻辑

