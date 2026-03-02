<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与 ModalEngine 快捷键协议
- [OUTPUT]: 本文档提供 hotkeys/ 成员清单与职责边界
- [POS]: app/components/hotkeys/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# hotkeys/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「hotkeys/」负责 前端交互与状态驱动渲染，当前由 `GlobalHotkeys.tsx` 等文件对外提供能力，典型使用场景是页面渲染与用户交互触发时。
- 核心文件：`GlobalHotkeys.tsx`（组件实现）、`HotkeyHelpDialog.module.css`（交互弹窗）、`HotkeyHelpDialog.tsx`（交互弹窗）
- 实现原理：由 `GlobalHotkeys.tsx` 接收入口，再通过 `HotkeyHelpDialog.module.css` 和 `HotkeyHelpDialog.tsx` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `GlobalHotkeys.tsx`、`HotkeyHelpDialog.module.css`、`HotkeyHelpDialog.tsx`。
- 调用链路：`GlobalHotkeys.tsx` -> `HotkeyHelpDialog.module.css` -> `HotkeyHelpDialog.tsx` -> 输出

## 成员清单

- [`GlobalHotkeys.tsx`](./GlobalHotkeys.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`HotkeyHelpDialog.module.css`](./HotkeyHelpDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`HotkeyHelpDialog.tsx`](./HotkeyHelpDialog.tsx)：React 组件实现文件，负责界面与交互逻辑
