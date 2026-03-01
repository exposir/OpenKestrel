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
- [ThemeToggle.tsx](./ThemeToggle.tsx): 明暗主题切换开关
- [TriggerButton.tsx](./TriggerButton.tsx): 发起讨论按钮 + 流式响应卡片 (`StreamCard`)，通过 SSE 调用编排 API
