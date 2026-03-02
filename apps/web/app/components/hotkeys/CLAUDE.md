<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与 ModalEngine 快捷键协议
- [OUTPUT]: 本文档提供 hotkeys/ 成员清单与职责边界
- [POS]: app/components/hotkeys/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# hotkeys/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

该目录主要用于hotkeys/相关能力的组织与实现，并明确与相邻模块的职责边界。
成员清单 [GlobalHotkeys.tsx](./GlobalHotkeys.tsx): 全局快捷键分发器（Cmd/Ctrl + K、Cmd/Ctrl + D、?、Esc）。
成员清单 [HotkeyHelpDialog.tsx](./HotkeyHelpDialog.tsx): 快捷键帮助弹窗内容。
成员清单 [HotkeyHelpDialog.module.css](./HotkeyHelpDialog.module.css): 快捷键帮助弹窗样式模块。

法则: 快捷键映射单源化·弹窗行为统一路由到 ModalEngine·帮助文案与映射同步
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
