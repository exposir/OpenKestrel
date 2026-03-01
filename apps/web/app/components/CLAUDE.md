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
- [GlobalHotkeys.tsx](./GlobalHotkeys.tsx): 全局热键中枢，支持 `Cmd/Ctrl + K` 搜索、`Cmd/Ctrl + D` 主题切换、`?` 快捷键帮助
- [SearchLauncher.tsx](./SearchLauncher.tsx): 首页搜索触发器，展示查询 Tag，点击后触发全局搜索弹窗
- [ThemeToggle.tsx](./ThemeToggle.tsx): 明暗主题三态切换按钮（仅按钮逻辑）
- [themeTransition.ts](./themeTransition.ts): 主题切换共享内核，统一处理 View Transition 动画与即时切换逻辑
- [TriggerButton.tsx](./TriggerButton.tsx): 发起讨论按钮 + 流式响应卡片 (`StreamCard`)，基于 Radix Dialog/Collapsible 实现表单弹窗并通过 SSE 调用编排 API
