<!--
- [INPUT]: 依赖 app/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 app/components/ 的成员清单
- [POS]: app/components/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# components/

> L2 | 父级: [app/CLAUDE.md](../CLAUDE.md)

客户端交互组件集合，均为 `"use client"` 组件。

## 成员清单

- [AuthButton.tsx](./AuthButton.tsx): 登录/登出按钮，依赖 `next-auth/react`
- [KeyboardShortcutsHelp.tsx](./KeyboardShortcutsHelp.tsx): 快捷键帮助弹窗入口，支持 `?` 打开全局快捷键列表
- [SearchLauncher.tsx](./SearchLauncher.tsx): 全局搜索入口，基于 Radix Dialog 的伪输入框弹窗，支持 `Cmd/Ctrl + K` 搜索与查询 Tag 清除
- [ThemeToggle.tsx](./ThemeToggle.tsx): 明暗主题切换开关
- [TriggerButton.tsx](./TriggerButton.tsx): 发起讨论按钮 + 流式响应卡片 (`StreamCard`)，基于 Radix Dialog/Collapsible 实现表单弹窗并通过 SSE 调用编排 API
