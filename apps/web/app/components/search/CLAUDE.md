<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与搜索 API 协议
- [OUTPUT]: 本文档提供 search/ 成员清单与职责边界
- [POS]: app/components/search/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# search/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供前端交互组件能力，负责状态驱动渲染与用户操作响应，对应目录「search/」。
- 核心文件：`SearchDialog.module.css`（交互弹窗实现）、`SearchDialog.tsx`（交互弹窗实现）、`SearchLauncher.tsx`（React 组件实现）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `SearchDialog.module.css` 接入调用，再由 `SearchDialog.tsx` 与 `SearchLauncher.tsx` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`SearchDialog.module.css`](./SearchDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`SearchDialog.tsx`](./SearchDialog.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`SearchLauncher.tsx`](./SearchLauncher.tsx)：React 组件实现文件，负责界面与交互逻辑

