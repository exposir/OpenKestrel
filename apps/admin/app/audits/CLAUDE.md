<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: audits/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# audits/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「audits/」接收页面渲染与用户交互事件，围绕 `page.tsx` 组织状态更新并输出可复用 UI 组件；输入是 props、上下文状态与键盘/点击事件，输出是组件树与交互回调；本目录不负责后端持久化与领域编排。
- 核心文件：`page.tsx`（页面渲染入口）
- 实现原理：以 `page.tsx` 作为交互入口，按组件依赖关系联动同级文件完成渲染；样式通过 CSS 模块在组件 import 时注入；失败路径采用空状态/禁用态等前端降级策略。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `page.tsx`。
- 调用链路：`page.tsx` -> `../../lib/audit.ts` -> `../../lib/storage.ts` -> 输出

## 成员清单

- [`page.tsx`](./page.tsx)：页面入口，负责该路由的渲染与交互
