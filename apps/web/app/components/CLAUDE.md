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
- [ComposeDialog.tsx](./ComposeDialog.tsx): 发帖弹窗内容，封装话题/人格/高级输入并发起流式编排请求
- [GlobalHotkeys.tsx](./GlobalHotkeys.tsx): 全局热键分发器，调用 ModalEngine 处理 `Cmd/Ctrl + K`、`?`、`Esc`、`Cmd/Ctrl + D`
- [HotkeyHelpDialog.tsx](./HotkeyHelpDialog.tsx): 快捷键帮助弹窗内容
- [SearchDialog.tsx](./SearchDialog.tsx): 全局搜索弹窗内容，调用 `/api/search` 展示结果并跳转
- [SearchLauncher.tsx](./SearchLauncher.tsx): 首页搜索触发器，展示查询 Tag，点击后通过 ModalEngine 打开搜索
- [ThemeToggle.tsx](./ThemeToggle.tsx): 明暗主题三态切换按钮，依赖 `@openkestrel/theme-motion/react` 完成状态与动画切换
- [TriggerButton.tsx](./TriggerButton.tsx): 发起讨论按钮 + 流式响应卡片 (`StreamCard`)，通过 ModalEngine 打开发帖弹窗
- [modal-engine/CLAUDE.md](./modal-engine/CLAUDE.md): 弹窗引擎模块地图（单实例状态机 + 统一渲染）
