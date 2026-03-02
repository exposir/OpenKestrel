<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与编排请求协议
- [OUTPUT]: 本文档提供 compose/ 成员清单与职责边界
- [POS]: app/components/compose/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# compose/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「compose/」负责 前端交互与状态驱动渲染，当前由 `ComposeDialog.module.css` 等文件对外提供能力，典型使用场景是页面渲染与用户交互触发时。
- 核心文件：`ComposeDialog.module.css`（交互弹窗）、`ComposeDialog.tsx`（交互弹窗）
- 实现原理：由 `ComposeDialog.module.css` 负责入口编排，`ComposeDialog.tsx` 负责核心处理与结果产出；异常路径在当前目录内兜底并向上抛出可诊断信息。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `ComposeDialog.module.css`、`ComposeDialog.tsx`。
- 调用链路：`ComposeDialog.module.css` -> `ComposeDialog.tsx` -> 输出

## 成员清单

- [`ComposeDialog.module.css`](./ComposeDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`ComposeDialog.tsx`](./ComposeDialog.tsx)：React 组件实现文件，负责界面与交互逻辑
