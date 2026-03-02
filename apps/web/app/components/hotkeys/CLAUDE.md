<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与 ModalEngine 快捷键协议
- [OUTPUT]: 本文档提供 hotkeys/ 成员清单与职责边界
- [POS]: app/components/hotkeys/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# hotkeys/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「hotkeys/」接收页面渲染与用户交互事件，围绕 `GlobalHotkeys.tsx` 组织状态更新并输出可复用 UI 组件；输入是 props、上下文状态与键盘/点击事件，输出是组件树与交互回调；本目录不负责后端持久化与领域编排。
- 核心文件：`GlobalHotkeys.tsx`（界面与交互实现）、`HotkeyHelpDialog.tsx`（弹窗内容组件）、`HotkeyHelpDialog.module.css`（样式依赖定义）
- 实现原理：以 `GlobalHotkeys.tsx` 作为交互入口，按组件依赖关系联动同级文件完成渲染；样式通过 CSS 模块在组件 import 时注入；失败路径采用空状态/禁用态等前端降级策略。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `GlobalHotkeys.tsx`、`HotkeyHelpDialog.tsx`、`HotkeyHelpDialog.module.css`。
- 调用链路：`GlobalHotkeys.tsx` -> `../modal-engine/useModalEngine.ts` -> `../modal-engine/ModalProvider.tsx`（import `ModalProvider.module.css`） -> 输出

## 成员清单

- [`GlobalHotkeys.tsx`](./GlobalHotkeys.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`HotkeyHelpDialog.module.css`](./HotkeyHelpDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`HotkeyHelpDialog.tsx`](./HotkeyHelpDialog.tsx)：React 组件实现文件，负责界面与交互逻辑
