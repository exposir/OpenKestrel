<!--
- [INPUT]: 依赖 app/components/CLAUDE.md 的模块定位与弹窗交互目标
- [OUTPUT]: 提供 modal-engine/ 的成员清单与职责边界
- [POS]: app/components/modal-engine/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# modal-engine/

> L2 | 父级: [app/components/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「modal-engine/」接收页面渲染与用户交互事件，围绕 `ModalProvider.tsx` 组织状态更新并输出可复用 UI 组件；输入是 props、上下文状态与键盘/点击事件，输出是组件树与交互回调；本目录不负责后端持久化与领域编排。
- 核心文件：`ModalProvider.tsx`（状态编排与渲染宿主）、`modal-motion.ts`（业务逻辑实现）、`modal-types.ts`（业务逻辑实现）、`useModalEngine.ts`（业务逻辑实现）
- 实现原理：以 `ModalProvider.tsx` 作为交互入口，按组件依赖关系联动同级文件完成渲染；样式通过 CSS 模块在组件 import 时注入；失败路径采用空状态/禁用态等前端降级策略。
- 相关文件：上游规范 [app/components/CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `ModalProvider.tsx`、`modal-motion.ts`、`modal-types.ts`。
- 调用链路：`ModalProvider.tsx`（import `ModalProvider.module.css`） -> `modal-types.ts` -> `modal-motion.ts` -> 输出

## 成员清单

- [`modal-motion.ts`](./modal-motion.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`modal-types.ts`](./modal-types.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`ModalProvider.module.css`](./ModalProvider.module.css)：本目录成员文件，承载对应子能力实现
- [`ModalProvider.tsx`](./ModalProvider.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`useModalEngine.ts`](./useModalEngine.ts)：TypeScript 实现文件，承载本模块核心逻辑
